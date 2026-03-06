# 🚨 QUICK FIX: API Key chưa được cấu hình

## ❌ Lỗi hiện tại:

```
[GoogleSheetsService] ⚠️ API Key chưa được cấu hình!
```

## ✅ Giải pháp: Thêm Environment Variables trên Vercel

### Bước 1: Vào Vercel Dashboard

1. Mở: https://vercel.com/dashboard
2. Chọn project: **mia-warehouse-management**
3. Vào: **Settings** → **Environment Variables**

### Bước 2: Thêm 2 biến BẮT BUỘC sau:

#### 1️⃣ Google Sheets API Key

```
Name: REACT_APP_GOOGLE_SHEETS_API_KEY
Value: <API_KEY_LẤY_TỪ_GOOGLE_CLOUD_CONSOLE>
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 2️⃣ Google Sheets ID

```
Name: REACT_APP_GOOGLE_SHEETS_ID
Value: <SHEET_ID_TỪ_URL_GOOGLE_SHEETS>
Environment: ✅ Production ✅ Preview ✅ Development
```

### Bước 3: Redeploy

1. Vào tab **Deployments**
2. Click **"..."** (3 chấm) trên deployment mới nhất
3. Chọn **"Redeploy"**
4. Đợi build xong (2-3 phút)

### Bước 4: Test lại

1. Mở URL production: https://mia-warehouse-management-xi.vercel.app
2. Kiểm tra connection status: **🟢 Connected**
3. Thử đăng nhập:
   - Username: `admin`
   - Password: `admin12345`

---

## 🔍 Kiểm tra nhanh:

Sau khi redeploy, mở Console (F12) và kiểm tra:

- ✅ Không còn lỗi `API Key chưa được cấu hình`
- ✅ Connection status hiển thị: **"Kết nối Google Sheets thành công"**

---

## ⚠️ Lưu ý:

- Phải chọn **cả 3 environments**: Production, Preview, Development
- Phải **Redeploy** sau khi thêm biến mới
- Biến `REACT_APP_*` sẽ được build vào code, không cần restart server
