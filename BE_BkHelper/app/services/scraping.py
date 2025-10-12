# app/services/scraping.py
import requests
from bs4 import BeautifulSoup
import json
import re


class HCMUTLMSService:
    CAS_LOGIN_URL = "https://sso.hcmut.edu.vn/cas/login"
    LMS_LOGIN_URL = "https://lms.hcmut.edu.vn/login/index.php?authCAS=CAS"
    NOTIFY_API = "https://lms.hcmut.edu.vn/lib/ajax/service.php"

    def __init__(self, username: str, password: str):
        self.username = username
        self.password = password
        self.session = requests.Session()
        self.cookies = {}

    def login(self):
        service_url = f"{self.LMS_LOGIN_URL}"
        login_url = f"{self.CAS_LOGIN_URL}?service={service_url}"

        # Step 1: GET form
        res = self.session.get(login_url, allow_redirects=False)
        soup = BeautifulSoup(res.text, 'html.parser')

        lt = soup.find('input', {'name': 'lt'}).get('value')
        execution = soup.find('input', {'name': 'execution'}).get('value')
        event_id = soup.find('input', {'name': '_eventId'}).get('value')

        payload = {
            'username': self.username,
            'password': self.password,
            'lt': lt,
            'execution': execution,
            '_eventId': event_id,
            'submit': 'Đăng nhập'
        }

        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Origin': 'https://sso.hcmut.edu.vn',
            'Referer': login_url,
            'User-Agent': 'Mozilla/5.0'
        }

        # Step 2: POST login
        login_response = self.session.post(login_url, data=payload, headers=headers, allow_redirects=False)

        # Step 3: Follow redirect manually to LMS
        if 'Location' in login_response.headers:
            redirect_url = login_response.headers['Location']
            final_response = self.session.get(redirect_url)
        else:
            raise Exception("Login failed. No redirect.")

        final_html = final_response.text

        # Step 4: Extract sesskey and userid
        if "sesskey" not in final_html or "data-userid" not in final_html:
            raise Exception("Login failed. sesskey or userid not found.")

        try:
            # Lấy sesskey
            sesskey_index = final_html.find("sesskey") + 10
            sesskey = final_html[sesskey_index:sesskey_index+10]

            # Lấy userid từ data-userid="33015"
            userid_match = re.search(r'data-userid="(\d+)"', final_html)
            if not userid_match:
                raise Exception("Cannot parse userid")
            userid = int(userid_match.group(1))
        except Exception as e:
            raise Exception("Parsing error: " + str(e))

        self.cookies = self.session.cookies.get_dict()

        return {
            'sesskey': sesskey,
            'userid': userid,
            'cookies': self.cookies,
            # 'session': self.session,
        }

    def logout(self, sesskey: str):
        headers = {
            'User-Agent': 'Mozilla/5.0',
            'Referer': self.LMS_LOGIN_URL,
            'Origin': 'https://lms.hcmut.edu.vn'
        }

        try:
            # 1️⃣ Gọi Moodle logout
            moodle_logout_url = f"https://lms.hcmut.edu.vn/login/logout.php?sesskey={sesskey}"
            res1 = self.session.get(moodle_logout_url, headers=headers, allow_redirects=False)

            if res1.status_code != 302 or 'Location' not in res1.headers:
                raise Exception("Không nhận được redirect từ Moodle logout.")

            # 2️⃣ Theo redirect đến CAS logout (chỉ 1 lần)
            cas_logout_url = res1.headers['Location']
            res2 = self.session.get(cas_logout_url, headers=headers, allow_redirects=False)

            # 3️⃣ Nếu CAS redirect ngược lại về LMS, follow thêm 1 lần
            if 'Location' in res2.headers:
                final_url = res2.headers['Location']
                self.session.get(final_url, headers=headers, allow_redirects=False)
            else:
                final_url = cas_logout_url

            self.session.cookies.clear()

            return {'ok': True, 'msg': 'Logout thành công', 'final_url': final_url}

        except Exception as e:
            return {'ok': False, 'msg': f'Lỗi khi logout: {e}'}

    def get_notifications(self, sesskey: str, userid: int):
        """
        Gọi core_message_get_conversations để lấy danh sách thông báo từ LMS
        """
        url = f"{self.NOTIFY_API}?sesskey={sesskey}&info=core_message_get_conversations"
        payload = [
            {
                "index": 0,
                "methodname": "core_message_get_conversations",
                "args": {
                    "userid": userid,
                    "type": 1,
                    "limitnum": 51,
                    "limitfrom": 0,
                    "favourites": False,
                    "mergeself": True
                }
            }
        ]

        headers = {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0",
            "Cookie": f"MoodleSession={self.cookies.get('MoodleSession')}; MOODLEID1_={self.cookies.get('MOODLEID1_')}"
        }

        response = self.session.post(url, headers=headers, data=json.dumps(payload))
        result = response.json()

        # Kiểm tra lỗi nếu có
        if not isinstance(result, list):
            raise Exception("Invalid response from LMS: " + json.dumps(result))

        if "exception" in result[0]:
            raise Exception("Error getting notifications: " + result[0]["exception"]["message"])

        return result[0]["data"]
    
    def get_notification_messages(self, sesskey: str, userid: int, convid: int, limitnum: int = 101, limitfrom: int = 1, newest: bool = True):
        """
        Gọi core_message_get_conversation_messages để lấy danh sách tin nhắn trong 1 cuộc hội thoại (conversation)
        """
        url = f"{self.NOTIFY_API}?sesskey={sesskey}&info=core_message_get_conversation_messages"
        payload = [
            {
                "index": 0,
                "methodname": "core_message_get_conversation_messages",
                "args": {
                    "currentuserid": userid,
                    "convid": convid,
                    "newest": newest,
                    "limitnum": limitnum,
                    "limitfrom": limitfrom
                }
            }
        ]

        headers = {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0",
            "Cookie": f"MoodleSession={self.cookies.get('MoodleSession')}; MOODLEID1_={self.cookies.get('MOODLEID1_')}"
        }

        response = self.session.post(url, headers=headers, data=json.dumps(payload))
        result = response.json()

        # Kiểm tra phản hồi hợp lệ
        if not isinstance(result, list):
            raise Exception("Invalid response from LMS: " + json.dumps(result))

        if "exception" in result[0]:
            raise Exception("Error getting messages: " + result[0]["exception"]["message"])

        return result[0]["data"]





class HCMUTMyBKService:
    CAS_LOGIN_URL = "https://sso.hcmut.edu.vn/cas/login"
    MYBK_APP_URL = "https://mybk.hcmut.edu.vn/app/"
    STUDENT_INFO_API = "https://mybk.hcmut.edu.vn/api/v1/student/get-student-info?null"
    SCHEDULE_API = "https://mybk.hcmut.edu.vn/api/v1/student/schedule"

    def __init__(self, username: str, password: str):
        self.username = username
        self.password = password
        self.session = requests.Session()
        self.cookies = {}

    def login(self):
        # Bước 1: GET /app để lấy SESSION cookie
        res_app = self.session.get(self.MYBK_APP_URL, allow_redirects=False)
        cookies = self.session.cookies.get_dict()
        if "SESSION" not in cookies:
            raise Exception("Không lấy được SESSION cookie từ MyBK /app/")
        session_cookie = cookies["SESSION"]

        # Bước 2: GET CAS login để lấy form + JSESSIONID
        service_url = "https://mybk.hcmut.edu.vn/app/login/cas"
        login_url = f"{self.CAS_LOGIN_URL}?service={service_url}"
        res_cas_get = self.session.get(login_url, allow_redirects=False)
        cookies = self.session.cookies.get_dict()
        if "JSESSIONID" not in cookies:
            raise Exception("Không lấy được JSESSIONID cookie từ CAS login")
        jsessionid_cookie = cookies["JSESSIONID"]

        # Parse form params
        soup = BeautifulSoup(res_cas_get.text, "html.parser")
        lt = soup.find("input", {"name": "lt"}).get("value")
        execution = soup.find("input", {"name": "execution"}).get("value")
        event_id = soup.find("input", {"name": "_eventId"}).get("value")

        # Bước 3: POST login
        payload = {
            "username": self.username,
            "password": self.password,
            "lt": lt,
            "execution": execution,
            "_eventId": event_id,
            "submit": "Đăng nhập"
        }

        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Origin": "https://sso.hcmut.edu.vn",
            "Referer": login_url,
            "User-Agent": "Mozilla/5.0",
            "Cookie": f"JSESSIONID={jsessionid_cookie}"
        }

        res_cas_post = self.session.post(
            login_url, data=payload, headers=headers, allow_redirects=False
        )
        if "Location" not in res_cas_post.headers:
            raise Exception("Login failed — không có Location redirect từ CAS.")

        redirect_url = res_cas_post.headers["Location"]
        if not redirect_url.startswith("https://mybk.hcmut.edu.vn"):
            raise Exception("Redirect URL không phải MyBK.")

        # Bước 4: Gắn lại SESSION cookie trước khi GET ticket
        self.session.cookies.set("SESSION", session_cookie, domain="mybk.hcmut.edu.vn")

        # GET xác thực ticket trên MyBK
        res_ticket = self.session.get(redirect_url, allow_redirects=True)
        if res_ticket.status_code not in (200, 302):
            raise Exception(f"Lỗi khi xác thực ticket: {res_ticket.status_code}")

        # Bước 5: GET /app để lấy hid_Token
        res_app2 = self.session.get(self.MYBK_APP_URL)
        soup2 = BeautifulSoup(res_app2.text, "html.parser")
        token_tag = soup2.find("input", {"id": "hid_Token"})
        if not token_tag:
            raise Exception("Không tìm thấy hid_Token (cookie chưa hợp lệ hoặc MyBK đổi cấu trúc).")

        hid_token = token_tag.get("value")
        self.cookies = self.session.cookies.get_dict()

        return {"token": hid_token, "cookies": self.cookies}

    def get_student_info(self, token: str):
        headers = {"Authorization": token, "User-Agent": "Mozilla/5.0"}
        res = self.session.get(self.STUDENT_INFO_API, headers=headers)
        if res.status_code != 200:
            raise Exception(f"Failed to get student info ({res.status_code})")
        return res.json()

    from datetime import datetime

    def get_current_semester_year():
        today = datetime.today()
        year = today.year
        month = today.month
        day = today.day

        # Quy tắc xác định học kỳ (1,2,3)
        if (month == 8 and day >= 15) or (month in [9, 10, 11, 12]):
            semester = 1
            year_str = str(year)  # VD: 2025
        elif month in [1, 2, 3, 4, 5]:
            semester = 2
            year_str = str(year - 1)  # vì học kỳ 2 thuộc năm trước (vd học kỳ 2 của năm 2025 là 20252)
        else:  # 1/6 - 14/8
            semester = 3
            year_str = str(year - 1)  # học kỳ 3 cũng thuộc năm trước

        return year_str + str(semester)

    def get_schedule(self, token: str, student_id: int, semester_year: str = "20251"):
        if semester_year is None:
            semester_year = get_current_semester_year()
        url = f"{self.SCHEDULE_API}?studentId={student_id}&semesterYear={semester_year}&null"
        headers = {"Authorization": token, "User-Agent": "Mozilla/5.0"}
        res = self.session.get(url, headers=headers)
        if res.status_code != 200:
            raise Exception(f"Failed to get schedule ({res.status_code})")
        return res.json()

    # ------------------------
    # Gọi gộp (login + info + schedule)
    # ------------------------
    def get_full_schedule(self, semester_year: str = "20251"):
        login_data = self.login()
        token = login_data["token"]
        info = self.get_student_info(token)
        student_id = info["data"]["id"]
        schedule = self.get_schedule(token, student_id, semester_year)
        return schedule