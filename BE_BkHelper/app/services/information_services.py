import requests
from bs4 import BeautifulSoup
import re


class InformationService:
    LMS_BASE_URL = "https://lms.hcmut.edu.vn/"
    MYBK_API_BASE = "https://mybk.hcmut.edu.vn/api/v1"

    def __init__(self, session: requests.Session = None, cookies: dict = None, mybk_token: str = None):
        """
        session: requests.Session() đã login LMS (tùy chọn)
        cookies: dict cookies LMS {'MoodleSession': ..., 'MOODLEID1_': ...}
        mybk_token: token Authorization cho MyBK API
        """
        self.session = session or requests.Session()
        self.cookies = cookies or {}
        self.mybk_token = mybk_token

        # Cập nhật cookies LMS nếu có
        if self.cookies:
            for k, v in self.cookies.items():
                self.session.cookies.set(k, v, domain="lms.hcmut.edu.vn")

    def get_user_image(self, save_path: str = None):
        """
        Lấy ảnh đại diện (avatar) của user đang đăng nhập.
        Trả về dict chứa link ảnh và dữ liệu ảnh (bytes).
        Nếu truyền save_path thì sẽ lưu file ảnh vào đó.

        :param save_path: đường dẫn file (tùy chọn)
        :return: {
            "image_url": str,
            "image_bytes": bytes,
            "saved_to": str | None
        }
        """
        headers = {
            "User-Agent": "Mozilla/5.0",
            "Cookie": f"MoodleSession={self.cookies.get('MoodleSession')}; MOODLEID1_={self.cookies.get('MOODLEID1_')}"
        }

        # 1️⃣ GET trang chủ LMS (đã đăng nhập)
        res = self.session.get(self.LMS_BASE_URL, headers=headers)
        if res.status_code != 200:
            raise Exception(f"Không thể truy cập LMS ({res.status_code})")

        # 2️⃣ Dùng BeautifulSoup để tìm link ảnh <img class="userpicture" ...>
        soup = BeautifulSoup(res.text, "html.parser")
        img_tag = soup.find("img", {"class": "userpicture"})

        if not img_tag or not img_tag.get("src"):
            raise Exception("Không tìm thấy ảnh đại diện trong HTML trả về.")

        image_url = img_tag["src"]

        # 3️⃣ GET ảnh thực tế (bảo vệ bằng cookie)
        img_res = self.session.get(image_url, headers=headers)
        if img_res.status_code != 200:
            raise Exception(f"Tải ảnh thất bại: HTTP {img_res.status_code}")

        image_bytes = img_res.content

        # 4️⃣ (Tùy chọn) Lưu file nếu được yêu cầu
        saved_to = None
        if save_path:
            with open(save_path, "wb") as f:
                f.write(image_bytes)
            saved_to = save_path

        return {
            "image_url": image_url,
            "image_bytes": image_bytes,
            "saved_to": saved_to
        }
    
    def get_mybk_user_id(self):
        """
        Lấy id người dùng từ MyBK
        """
        if not self.mybk_token:
            raise ValueError("Token MyBK chưa được cung cấp.")

        headers = {"Authorization": self.mybk_token, "User-Agent": "Mozilla/5.0"}
        res = self.session.get(f"{self.MYBK_API_BASE}/my", headers=headers)
        if res.status_code != 200:
            raise Exception(f"Failed to get MyBK user info ({res.status_code})")
        data = res.json()
        try:
            user_id = data["data"]["profile"]["id"]
        except KeyError:
            raise Exception("Không tìm thấy user id trong MyBK response")
        
        return user_id

    def get_mybk_user_detail(self, user_id: int = None):
        """
        Lấy chi tiết thông tin người dùng từ MyBK
        """
        if not self.mybk_token:
            raise ValueError("Token MyBK chưa được cung cấp.")

        if user_id is None:
            user_id = self.get_mybk_user_id()

        headers = {"Authorization": self.mybk_token, "User-Agent": "Mozilla/5.0"}
        res = self.session.get(f"{self.MYBK_API_BASE}/student/detail-info/{user_id}?null", headers=headers)
        if res.status_code != 200:
            raise Exception(f"Failed to get MyBK user detail ({res.status_code})")
        return res.json()