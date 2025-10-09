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
            'cookies': self.cookies
        }

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
