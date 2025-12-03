# 🔓 Hướng Dẫn Reset Login Block

## 🎯 Vấn Đề

Tài khoản bị khóa do quá nhiều lần đăng nhập sai.

## ✅ Giải Pháp Nhanh

### Cách 1: Dùng Browser Console (Dễ Nhất)

1. Mở trang login: `http://localhost:3001/login`
2. Nhấn **F12** hoặc **Cmd+Option+I** (Mac) để mở Developer Tools
3. Chuyển sang tab **Console**
4. Paste và Enter:
```javascript
localStorage.removeItem("loginBlock");
location.reload();
```
5. ✅ Xong! Bạn có thể đăng nhập lại ngay.

### Cách 2: Xóa Toàn Bộ LocalStorage

Trong Console:
```javascript
localStorage.clear();
location.reload();
```

⚠️ Lưu ý: Sẽ xóa tất cả dữ liệu đã lưu (theme, preferences, etc.)

### Cách 3: Chỉ Xóa Login Block

Trong Console:
```javascript
localStorage.removeItem("loginBlock");
setTimeout(() => location.reload(), 1000);
```

## 📋 Thông Tin Kỹ Thuật

- **Block Duration**: 5 phút (300 giây)
- **Max Attempts**: 3 lần
- **Storage Key**: `loginBlock`
- **Storage Location**: Browser localStorage

## 🎯 Credentials Mặc Định

- **Username**: `admin`
- **Password**: `admin1234`

Hoặc:
- **Username**: `admin@mia.vn`
- **Password**: `admin1234`

## ⚠️ Lưu Ý

- Login block là tính năng bảo mật
- Chỉ reset khi cần thiết
- Sau khi reset, đảm bảo nhập đúng credentials

---

**Cập nhật:** 2025-01-02
