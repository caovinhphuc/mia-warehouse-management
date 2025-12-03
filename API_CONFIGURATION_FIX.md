# 🔧 Hướng Dẫn Sửa Lỗi: Không thể kết nối đến server

## ⚠️ Vấn Đề

Lỗi: **"Không thể kết nối đến server. Vui lòng kiểm tra REACT_APP_API_URL hoặc đảm bảo backend API đang chạy."**

## 🔍 Nguyên Nhân

Ứng dụng đang cố kết nối đến backend API nhưng:

1. Biến `REACT_APP_API_URL` chưa được cấu hình
2. Hoặc backend API server chưa được khởi chạy

## ✅ Giải Pháp

### Giải Pháp 1: Disable Backend API (Khuyến Nghị)

Nếu bạn không cần backend API (chỉ dùng Google Sheets), có thể disable các tính năng cần backend:

1. **Disable Shipping SLA Module** (nếu không dùng):
   - Module này cần backend API tại `http://localhost:8000`
   - Có thể comment/disable route trong `App.jsx`

2. **Sử dụng chỉ Google Sheets API**:
   - Ứng dụng chính hoạt động với Google Sheets
   - Không cần backend API server riêng

### Giải Pháp 2: Cấu Hình Backend API

Nếu bạn cần backend API (ví dụ: Shipping SLA module):

1. **Thêm biến môi trường vào `.env.local`**:

```env
# Backend API URL (nếu cần)
REACT_APP_API_URL=http://localhost:8000

# Hoặc để trống nếu không dùng
REACT_APP_API_URL=
```

2. **Khởi chạy backend API server**:
   - Nếu có file `automation_bridge.py` hoặc backend server
   - Chạy server tại port 8000 (hoặc port khác)

### Giải Pháp 3: Sửa Code để Tránh Lỗi

Thêm error handling tốt hơn trong các service:

1. **Shipping SLA Service** - Kiểm tra API URL trước khi gọi:
   - File: `src/services/shippingSLAService.js`
   - Thêm check: nếu không có API URL, skip API calls

2. **Constants** - Cập nhật default URL:
   - File: `src/utils/constants.js`
   - Đảm bảo default URL hợp lệ

## 📝 Các Bước Thực Hiện Ngay

### Bước 1: Kiểm Tra `.env.local`

```bash
# Kiểm tra file hiện tại
cat .env.local | grep API
```

### Bước 2: Thêm Biến Môi Trường (Nếu Cần)

```bash
# Thêm vào .env.local
echo "REACT_APP_API_URL=" >> .env.local
```

Hoặc nếu có backend API:

```bash
echo "REACT_APP_API_URL=http://localhost:8000" >> .env.local
```

### Bước 3: Restart React App

```bash
# Dừng app (Ctrl+C)
# Khởi động lại
npm start
```

## 🔧 Sửa Code Nhanh

### Option A: Disable API Calls khi không có URL

Thêm vào `src/services/shippingSLAService.js`:

```javascript
async apiCall(endpoint, options = {}) {
  // Check if API URL is configured
  if (!API_BASE_URL || API_BASE_URL === 'http://localhost:8000') {
    console.warn('Backend API not configured. Skipping API call.');
    throw new Error('Backend API is not configured or not running.');
  }

  // ... rest of code
}
```

### Option B: Fallback to Mock Data

Khi API không available, sử dụng mock data hoặc skip feature.

## 📋 Kiểm Tra Sau Khi Sửa

1. Restart React app
2. Mở browser console
3. Kiểm tra xem còn lỗi API connection không
4. Nếu module Shipping SLA không cần thiết, có thể tắt route đó

## 🎯 Modules Cần Backend API

- **Shipping SLA System** - Cần backend tại port 8000
- **Automation System** - Có thể cần backend

Các module khác (Dashboard, Orders, Inventory, Users) chỉ cần Google Sheets.

---

**Cập nhật:** 2025-01-02
**File liên quan:** `src/services/shippingSLAService.js`, `src/utils/constants.js`
