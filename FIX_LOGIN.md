# 🔧 HƯỚNG DẪN KHẮC PHỤC LỖI ĐĂNG NHẬP

## ✅ Đã khắc phục

1. ✅ **File `.env` đã được tạo** với API key và cấu hình cần thiết
2. ✅ **API key hoạt động tốt** - đã test và có 6 users trong Google Sheets
3. ✅ **Google Apps Script webhook đã được cấu hình**

## 🚀 BƯỚC TIẾP THEO

### **1. Restart Dev Server**

File `.env` chỉ được load khi **khởi động** React app. Bạn cần:

```bash
# Dừng server hiện tại (Ctrl+C)
# Sau đó chạy lại:
npm start

# Hoặc dùng script:
./start-dev.sh
```

### **2. Kiểm tra Connection Status**

Sau khi restart, mở trang login và kiểm tra:

- **Connection Status** phải hiển thị: **🟢 Kết nối Google Sheets thành công**
- Nếu vẫn hiển thị **🔴 Không thể kết nối**, kiểm tra console browser (F12) để xem lỗi

### **3. Thử Đăng Nhập**

Sử dụng một trong các tài khoản sau:

| Username     | Password     | Role    |
| ------------ | ------------ | ------- |
| `admin`      | `admin12345` | ADMIN   |
| `manager`    | `manager123` | MANAGER |
| `supervisor` | `super123`   | USER    |
| `staff1`     | `staff123`   | USER    |
| `staff2`     | `staff456`   | USER    |
| `inspector`  | `inspect789` | VIEWER  |

**Lưu ý:**

- Có thể đăng nhập bằng **username** hoặc **email**
- Ví dụ: `admin` hoặc `admin@mia.vn` đều được

## 🐛 TROUBLESHOOTING

### **Vấn đề 1: Connection Status vẫn hiển thị "Không thể kết nối"**

**Nguyên nhân:**

- Dev server chưa restart sau khi tạo `.env`
- API key không được load

**Giải pháp:**

1. Kiểm tra file `.env` có tồn tại: `cat .env`
2. Restart dev server: `npm start`
3. Xóa cache browser và reload trang

### **Vấn đề 2: "Sai tên đăng nhập hoặc mật khẩu"**

**Nguyên nhân:**

- Username/password không đúng
- Dữ liệu trong Google Sheets đã thay đổi

**Giải pháp:**

1. Chạy script kiểm tra users:
   ```bash
   node check-users-in-sheets.js
   ```
2. Sử dụng username/password từ output của script

### **Vấn đề 3: "Kết nối quá chậm" hoặc Timeout**

**Nguyên nhân:**

- Mạng chậm
- Google Sheets API bị rate limit

**Giải pháp:**

1. Kiểm tra kết nối mạng
2. Đợi vài phút rồi thử lại
3. Kiểm tra Google Sheets API quota

## 📋 CHECKLIST

- [x] File `.env` đã được tạo
- [ ] Dev server đã được restart
- [ ] Connection status hiển thị "Connected"
- [ ] Đăng nhập thành công với một trong các tài khoản trên

## 💡 LƯU Ý QUAN TRỌNG

1. **File `.env` không được commit lên Git** (đã có trong `.gitignore`)
2. **Mỗi developer cần tạo file `.env` riêng** cho local development
3. **Production (Vercel) sử dụng Environment Variables** trong Vercel Dashboard, không dùng file `.env`

## 🔗 TÀI LIỆU THAM KHẢO

- Xem danh sách users: `node check-users-in-sheets.js`
- Test Apps Script: Mở `test-apps-script.html` trong browser
- Cấu hình Vercel: Xem `VERCEL_ENV_VARS.md`
