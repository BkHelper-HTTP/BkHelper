import requests
from bs4 import BeautifulSoup
import json
import re

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
        print(info)
        student_id = info["data"]["id"]
        schedule = self.get_schedule(token, student_id, semester_year)
        return schedule