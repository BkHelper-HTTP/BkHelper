import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime
from typing import Optional

class HCMUTMyBKService:
    CAS_LOGIN_URL = "https://sso.hcmut.edu.vn/cas/login"
    MYBK_APP_URL = "https://mybk.hcmut.edu.vn/app/"
    STUDENT_INFO_API = "https://mybk.hcmut.edu.vn/api/v1/student/get-student-info?null"
    SCHEDULE_API = "https://mybk.hcmut.edu.vn/api/v1/student/schedule"

    def __init__(self, token: str, cookies: dict):
        self.token = token
        self.cookies = cookies
        self.session = requests.Session()
        for k, v in cookies.items():
            self.session.cookies.set(k, v, domain="mybk.hcmut.edu.vn")

    def get_student_info(self):
        headers = {"Authorization": self.token, "User-Agent": "Mozilla/5.0"}
        res = self.session.get(self.STUDENT_INFO_API, headers=headers)
        if res.status_code != 200:
            raise Exception(f"Failed to get student info ({res.status_code})")
        return res.json()

    def get_current_semester_year(self) -> str:
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

    # def get_schedule(self, token: str, student_id: int, semester_year: Optional[str] = None):
    #     if semester_year is None:
    #         semester_year = self.get_current_semester_year()
    #     url = f"{self.SCHEDULE_API}?studentId={student_id}&semesterYear={semester_year}&null"
    #     headers = {"Authorization": token, "User-Agent": "Mozilla/5.0"}
    #     res = self.session.get(url, headers=headers)
    #     if res.status_code != 200:
    #         raise Exception(f"Failed to get schedule ({res.status_code})")
    #     return res.json()

    # # ------------------------
    # # Gọi gộp (login + info + schedule)
    # # ------------------------
    # def get_full_schedule(self, semester_year: Optional[str] = None):
    #     if semester_year is None or semester_year.lower() == "null":
    #         semester_year = self.get_current_semester_year()
    #     login_data = self.login()
    #     token = login_data["token"]
    #     info = self.get_student_info(token)
    #     student_id = info["data"]["id"]
    #     schedule = self.get_schedule(token, student_id, semester_year)
    #     return schedule["data"]
    def get_schedule(self, student_id: int, semester_year: Optional[str] = None):
        if semester_year is None:
            semester_year = self.get_current_semester_year()
        url = f"{self.SCHEDULE_API}?studentId={student_id}&semesterYear={semester_year}&null"
        headers = {"Authorization": self.token, "User-Agent": "Mozilla/5.0"}
        res = self.session.get(url, headers=headers)
        if res.status_code != 200:
            raise Exception(f"Failed to get schedule ({res.status_code})")
        return res.json()

    def get_full_schedule(self, semester_year: Optional[str] = None):
        if semester_year is None or semester_year.lower() == "null":
            semester_year = self.get_current_semester_year()

        # Không gọi login() nữa, token + cookies đã có sẵn
        info = self.get_student_info()
        student_id = info["data"]["id"]
        schedule = self.get_schedule(student_id, semester_year)
        return schedule["data"]