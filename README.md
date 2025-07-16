# 🌐 Parking Client (React)

Đây là giao diện web của hệ thống AutoParking, cho phép người dùng:
- Đăng ký chỗ đỗ xe.
- Nhận mã OTP.
- Check-in / Check-out xe.

## 🚀 Khởi động dự án

```bash
yarn install
yarn start
```

Mặc định sẽ chạy tại `http://localhost:3000`.

## 🛠️ Môi trường

Tạo file `.env` tại thư mục gốc:

```
REACT_APP_API_BASE=http://localhost:1204
```

## 🔧 Cấu trúc chính

- `App.js` – Giao diện chính cho việc đăng ký và checkin/checkout.
- `App.css` – Giao diện và style tùy chỉnh.

## 🧪 Tính năng

- ✅ Hiển thị trạng thái slot (trống / đã đăng ký).
- 🔐 Validate biển số xe (`ABC-12345` hoặc `29M-1234`).
- 🔄 Check trạng thái để tự động chuyển đổi giữa check-in / check-out.
- 📡 Gửi request đến API Node.js backend.

## 📦 Yêu cầu

| Thành phần | Phiên bản yêu cầu |
|------------|------------------|
| 🟢 Node.js | >= 16.x          |
| 🧶 Yarn    | >= 1.22          |

## 📁 API sử dụng

| Method | Endpoint    | 📋 Mô tả chức năng               |
|--------|-------------|----------------------------------|
| 🟢 GET | `/slots`    | Lấy danh sách các slot khả dụng |
| 🟠 POST | `/register` | Đăng ký slot với biển số xe     |
| 🟠 POST | `/checkin`  | Tiến hành check-in              |
| 🟠 POST | `/checkout` | Tiến hành check-out             |
| 🟠 POST | `/status`   | Kiểm tra trạng thái xe hiện tại |

## 👤 Tác giả

Khoa Nguyễn – 2025

---

## 🤝 Đóng góp

Chào đón mọi đóng góp! Vui lòng mở pull request hoặc issue nếu bạn có ý tưởng cải tiến.

## 📄 License

MIT License