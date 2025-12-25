# hcmut_sso_base.py
import requests
from bs4 import BeautifulSoup

class HCMUTCASBase:
    CAS_URL = "https://sso.hcmut.edu.vn/cas/login"

    def __init__(self, username: str, password: str):
        self.username = username
        self.password = password
        self.session = requests.Session()
        self.is_logged_in = False

    def cas_login(self, service_url: str):
        """
        Đăng nhập CAS 1 lần, trả về session đã chứa cookie CASTGC.
        """
        login_url = f"{self.CAS_URL}?service={service_url}"
        res = self.session.get(login_url)
        soup = BeautifulSoup(res.text, "html.parser")

        lt = soup.find("input", {"name": "lt"}).get("value")
        execution = soup.find("input", {"name": "execution"}).get("value")
        event_id = soup.find("input", {"name": "_eventId"}).get("value")

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
            "User-Agent": "Mozilla/5.0"
        }

        res_post = self.session.post(login_url, data=payload, headers=headers, allow_redirects=False)

        if "Location" not in res_post.headers:
            raise Exception("CAS login failed (không có redirect).")

        redirect_url = res_post.headers["Location"]
        self.is_logged_in = True
        return redirect_url, self.session
    

class HCMUTMyBKService:
    MYBK_APP_URL = "https://mybk.hcmut.edu.vn/app/"
    STUDENT_INFO_API = "https://mybk.hcmut.edu.vn/api/v1/student/get-student-info?null"
    SCHEDULE_API = "https://mybk.hcmut.edu.vn/api/v1/student/schedule"

    def __init__(self, cas_session: requests.Session):
        # Dùng chung session từ CAS
        self.session = cas_session
        self.cookies = {}

    def login(self):
        res_app = self.session.get(self.MYBK_APP_URL, allow_redirects=True)
        soup = BeautifulSoup(res_app.text, "html.parser")
        token_tag = soup.find("input", {"id": "hid_Token"})
        if not token_tag:
            raise Exception("Không tìm thấy hid_Token (cookie chưa hợp lệ hoặc MyBK đổi cấu trúc).")
        hid_token = token_tag.get("value")
        self.cookies = self.session.cookies.get_dict()
        return {"token": hid_token, "cookies": self.cookies}
    

class HCMUTLMSService:
    LMS_LOGIN_URL = "https://lms.hcmut.edu.vn/login/index.php?authCAS=CAS"
    NOTIFY_API = "https://lms.hcmut.edu.vn/lib/ajax/service.php"

    def __init__(self, cas_session: requests.Session):
        self.session = cas_session
        self.cookies = {}

    def login(self):
        res = self.session.get(self.LMS_LOGIN_URL)
        html = res.text
        if "sesskey" not in html or "data-userid" not in html:
            raise Exception("Không lấy được sesskey hoặc userid. Có thể chưa login thành công.")
        sesskey = html.split("sesskey\":\"")[1].split("\"")[0]
        import re
        userid = int(re.search(r'data-userid="(\d+)"', html).group(1))
        self.cookies = self.session.cookies.get_dict()
        return {"sesskey": sesskey, "userid": userid, "cookies": self.cookies}
    
    

def login_all(username: str, password: str):
    cas = HCMUTCASBase(username, password)
    
    # Bước 1: Login CAS
    redirect_url, session = cas.cas_login("https://mybk.hcmut.edu.vn/app/login/cas")

    # Bước 2: Follow redirect_url để xác thực ticket trên MyBK
    session.get(redirect_url, allow_redirects=True)

    # Bước 3: Lúc này session đã hợp lệ → có thể login MyBK
    mybk = HCMUTMyBKService(session)
    mybk_data = mybk.login()

    # Bước 4: Login LMS (chung session)
    lms = HCMUTLMSService(session)
    lms_data = lms.login()

    return {
        "mybk": mybk_data,
        "lms": lms_data,
        "session_cookies": session.cookies.get_dict()
    }

def logout_all(self, sesskey: str):
    """
    Đăng xuất khỏi cả LMS và MyBK (CAS logout toàn cục)
    """
    headers = {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://lms.hcmut.edu.vn',
        'Origin': 'https://lms.hcmut.edu.vn'
    }

    try:
        results = {}

        # 1️ Logout Moodle (LMS)
        moodle_logout_url = f"https://lms.hcmut.edu.vn/login/logout.php?sesskey={sesskey}"
        res1 = self.session.get(moodle_logout_url, headers=headers, allow_redirects=False)

        if res1.status_code == 302 and 'Location' in res1.headers:
            cas_logout_url = res1.headers['Location']
            results['lms_redirect'] = cas_logout_url

            # 2️ CAS logout (hệ thống SSO dùng chung với MyBK)
            res2 = self.session.get(cas_logout_url, headers=headers, allow_redirects=False)

            if 'Location' in res2.headers:
                final_url = res2.headers['Location']
                self.session.get(final_url, headers=headers, allow_redirects=False)
                results['cas_final'] = final_url
            else:
                results['cas_final'] = cas_logout_url
        else:
            results['lms'] = f"Logout LMS không redirect (code {res1.status_code})"

        # 3️ Logout MyBK (nếu có SESSION cookie)
        if 'SESSION' in self.session.cookies.get_dict():
            mybk_logout_url = "https://mybk.hcmut.edu.vn/app/logout"
            res3 = self.session.get(mybk_logout_url, headers=headers, allow_redirects=False)
            results['mybk'] = f"MyBK logout status {res3.status_code}"

        # 4️ Xóa toàn bộ cookie local
        self.session.cookies.clear()

        return {
            'ok': True,
            'msg': 'Đã logout toàn bộ (LMS + CAS + MyBK)',
            'details': results
        }

    except Exception as e:
        return {
            'ok': False,
            'msg': f'Lỗi khi logout_all: {e}'
        }
    

def logout_all(session: requests.Session, sesskey: str):
    """
    Đăng xuất khỏi cả LMS, MyBK và CAS (SSO logout toàn cục)
    """
    headers = {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://lms.hcmut.edu.vn',
        'Origin': 'https://lms.hcmut.edu.vn'
    }

    try:
        results = {}

        # 1️ Logout LMS (Moodle)
        moodle_logout_url = f"https://lms.hcmut.edu.vn/login/logout.php?sesskey={sesskey}"
        res1 = session.get(moodle_logout_url, headers=headers, allow_redirects=False)

        if res1.status_code == 302 and 'Location' in res1.headers:
            cas_logout_url = res1.headers['Location']
            results['lms_redirect'] = cas_logout_url

            # 2️ CAS logout (theo redirect từ LMS)
            res2 = session.get(cas_logout_url, headers=headers, allow_redirects=False)

            if 'Location' in res2.headers:
                final_url = res2.headers['Location']
                session.get(final_url, headers=headers, allow_redirects=False)
                results['cas_final'] = final_url
            else:
                results['cas_final'] = cas_logout_url
        else:
            results['lms'] = f"Logout LMS không redirect (code {res1.status_code})"

        # 3️ Logout MyBK (nếu có SESSION cookie)
        cookies = session.cookies.get_dict()
        if 'SESSION' in cookies:
            # 🔹 Gọi đúng endpoint MyBK logout (bạn đã sniff)
            mybk_logout_url = "https://mybk.hcmut.edu.vn/app/logout?type=cas"
            res3 = session.get(mybk_logout_url, headers=headers, allow_redirects=False)
            results['mybk_status'] = res3.status_code

            if res3.status_code == 302 and 'Location' in res3.headers:
                cas_logout_url2 = res3.headers['Location']
                results['mybk_cas_redirect'] = cas_logout_url2

                # 🔹 Tiếp tục gọi CAS logout (MyBK → CAS)
                res4 = session.get(cas_logout_url2, headers=headers, allow_redirects=False)
                results['cas_from_mybk_status'] = res4.status_code

                # 🔹 Nếu CAS redirect ngược lại MyBK → follow thêm 1 lần
                if 'Location' in res4.headers:
                    final_redirect = res4.headers['Location']
                    res5 = session.get(final_redirect, headers=headers, allow_redirects=False)
                    results['mybk_final_redirect'] = final_redirect
                    results['mybk_final_status'] = res5.status_code
        else:
            results['mybk'] = "Không có SESSION cookie, bỏ qua logout MyBK."

        # 4 Dọn toàn bộ session cookies
        session.cookies.clear()

        return {
            'ok': True,
            'msg': 'Đã logout toàn bộ (LMS + MyBK + CAS)',
            'details': results
        }

    except Exception as e:
        return {
            'ok': False,
            'msg': f'Lỗi khi logout_all: {e}'
        }