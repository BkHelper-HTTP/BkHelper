✅ README.md
# 📚 FastAPI Backend - Schedule, Notes, Forum, Notification

Dự án backend sử dụng **FastAPI** để xây dựng hệ thống API RESTful phục vụ các chức năng:
- ✅ Xác thực người dùng (JWT)
- 📅 Quản lý lịch học
- 📝 Ghi chú cá nhân
- 💬 Diễn đàn thảo luận
- 🔔 Thông báo (push notification)
- 🔄 Tích hợp Google Calendar (nếu dùng)

---

## 📁 Cấu trúc thư mục chính


```
backend/
├── app/
│ ├── api/ # Endpoint (auth, notes, schedule, etc.)
│ ├── core/ # Cấu hình app, bảo mật
│ ├── models/ # SQLAlchemy models & Pydantic schemas
│ ├── db/ # Kết nối DB, CRUD
│ ├── services/ # Logic xử lý (scraping, calendar, notify...)
│ ├── utils/ # Helper functions
│ └── main.py # Điểm bắt đầu FastAPI
├── alembic/ # Quản lý migration (Alembic)
├── venv/ # Môi trường ảo (đã ignore)
├── .env # Biến môi trường (đã ignore)
├── .gitignore
├── requirements.txt # Thư viện phụ thuộc
├── Dockerfile # Docker config (nếu dùng)
├── README.md # File mô tả này
└── start.sh # Script khởi động (nếu có)
```

---

## ⚙️ Hướng dẫn cài đặt

### 1. Clone dự án

```bash
git clone <link-repo-cua-ban>
cd BE_BkHelper/
```

### 2. Tạo môi trường ảo
```bash
python -m venv venv
```

### 3. Kích hoạt môi trường ảo
Windows (PowerShell):
```bash
.\venv\Scripts\Activate.ps1
```
Windows (CMD):
```bash
.\venv\Scripts\activate
```
macOS/Linux:
```bash
source venv/bin/activate
```

### 4. Cài đặt các thư viện phụ thuộc
```bash
pip install -r requirements.txt
```
---

## 🚀 Chạy ứng dụng FastAPI
```bash
uvicorn app.main:app --reload
```

Truy cập docs:

Swagger UI: http://localhost:8000/docs

ReDoc: http://localhost:8000/redoc

Fastapi: http://localhost:8000/docs#/default/root__get


## 🧪 Testing (chưa có)
```bash
python run pytest
```

## 📦 Docker (chưa có)
```bash
docker build -t fastapi-backend .
docker run -p 8000:8000 fastapi-backend
```

## 🧰 Công nghệ sử dụng

🔹 FastAPI

🔹 Uvicorn

🔹 SQLAlchemy

🔹 Pydantic

🔹 Alembic

🔹 JWT (python-jose)

🔹 passlib (bcrypt)

🔹 Python-dotenv

🔹 (Tuỳ chọn) Google Calendar API, Firebase Push

## 📝 License

MIT License © 2025

## ✍️ Tác giả

github.com/caothien5504

