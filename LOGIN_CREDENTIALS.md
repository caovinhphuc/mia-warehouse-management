# 🔐 Thông Tin Đăng Nhập

## ✅ Credentials Đúng

### Admin Account
- **Username**: `admin` (không phải `admin@mia.vn`)
- **Password**: `admin1234`

### Manager Account
- **Username**: `manager`
- **Password**: `manager123`

### Staff Accounts
- **Username**: `supervisor` / Password: `super123`
- **Username**: `staff1` / Password: `staff123`
- **Username**: `staff2` / Password: `staff456`

### Viewer Account
- **Username**: `inspector` / Password: `inspect789`

## ⚠️ Lưu Ý Quan Trọng

1. **Username KHÔNG có @mia.vn**
   - ❌ Sai: `admin@mia.vn`
   - ✅ Đúng: `admin`

2. **Email khác với Username**
   - Email trong sheet: `admin@mia.vn`
   - Username để login: `admin`

3. **Password là exact match**
   - Phải nhập chính xác như trong Google Sheets

## 🎯 Cách Đăng Nhập

1. Mở: `http://localhost:3001/login`
2. Nhập:
   - Username: `admin`
   - Password: `admin1234`
3. Click "Đăng nhập"

## 🔓 Nếu Tài Khoản Bị Khóa

Mở Console (F12) và chạy:
```javascript
localStorage.removeItem("loginBlock");
location.reload();
```

---

**Cập nhật:** 2025-01-02
