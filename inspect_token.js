const jwt = require("jsonwebtoken");

// ⚠️ PHẢI GIỐNG ENV CỦA FASTAPI
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "super-secret-key-change-this-alka-ll9942%@$$$$$";

function inspectToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY, {
      algorithms: ["HS256"]
    });

    console.log("✅ Token hợp lệ");
    console.log("📦 Payload nhận được:");
    console.log({
      user_id: decoded.user_id,
      student_code: decoded.student_code,
      avatar_url: decoded.avatar_url,
      first_name: decoded.first_name,
      last_name: decoded.last_name,
      exp: decoded.exp
    });

  } catch (err) {
    console.log("❌ Token không hợp lệ");
    console.error("Lỗi:", err.message);
  }
}

// 👉 DÁN ACCESS_TOKEN TẠO BÊN FASTAPI
const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiN2Y4MmFlODQtMjU0ZC00NzY4LWI0OGUtMWUyMTA1YWVkMWY5Iiwic3R1ZGVudF9jb2RlIjoiMjIxMzI4NyIsImF2YXRhcl91cmwiOiJodHRwczovL3Jlcy5jbG91ZGluYXJ5LmNvbS9keHVibzdlZ3YvaW1hZ2UvdXBsb2FkL3YxNzY2OTM0MzE3L2F2YXRhcnMveWlhb2NvdnR6emJiZHppc2h3MW0uanBnIiwiZmlyc3RfbmFtZSI6IlRIXHUxZWNhTkgiLCJsYXN0X25hbWUiOiJOR1VZXHUxZWM0TiBIXHUxZWQyIFFVXHUxZWQwQyIsImV4cCI6MTc2NzkzNTM1NH0.XTuKGM237PoV7WaBF9qrLRFdCYMZ3F9xQWIscU6cDQM";

inspectToken(accessToken);
