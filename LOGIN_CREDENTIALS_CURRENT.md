# 🔐 Thông Tin Đăng Nhập Hiện Tại (Từ Google Sheets)

## ✅ Credentials Chính Xác (Đã Kiểm Tra)

### Admin Account

- **Username**: `admin` hoặc `admin@mia.vn`
- **Password**: `admin12345` ⚠️ (Có số 5 ở cuối)
- **Email**: `admin@mia.vn`
- **Role**: `ADMIN`

### Manager Account

- **Username**: `manager` hoặc `manager@mia.com`
- **Password**: `manager123`
- **Email**: `manager@mia.com`
- **Role**: `MANAGER`

### Staff Accounts

- **Username**: `supervisor` / Password: `super123` / Role: `USER`
- **Username**: `staff1` / Password: `staff123` / Role: `USER`
- **Username**: `staff2` / Password: `staff456` / Role: `USER`

### Viewer Account

- **Username**: `inspector` / Password: `inspect789` / Role: `VIEWER`

## 🎯 Cách Đăng Nhập

1. Mở trang login
2. Nhập:
   - **Username**: `admin` (hoặc email `admin@mia.vn`)
   - **Password**: `admin12345` ⚠️ (Lưu ý: có số 5 ở cuối)
3. Click "Đăng nhập"

## ⚠️ Lưu Ý Quan Trọng

1. **Password admin là `admin12345` (có số 5)**, KHÔNG phải `admin1234`
2. Có thể đăng nhập bằng **username** hoặc **email**
3. Password phải nhập chính xác (case-sensitive)

## 🔓 Nếu Tài Khoản Bị Khóa

Mở Console (F12) và chạy:

```javascript
localStorage.removeItem("loginBlock");
location.reload();
```

## 🧪 Test Credentials

Chạy script test để xem tất cả users:

```bash
node scripts/test-login.js
```

---

**Cập nhật:** 2026-01-16
**Nguồn:** Google Sheets - Sheet "Users"
