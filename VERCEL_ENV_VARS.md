# 🔐 VERCEL ENVIRONMENT VARIABLES

## 📋 Danh sách Environment Variables cần cấu hình trong Vercel

### **Bước 1: Vào Vercel Dashboard**

1. Mở: <https://vercel.com/dashboard>
2. Chọn project: `mia-warehouse-management`
3. Vào: **Settings** → **Environment Variables**

### **Bước 2: Thêm các biến sau:**

---

## ✅ **REQUIRED (Bắt buộc)**

### 1. Google Sheets API Key

```
Name: REACT_APP_GOOGLE_SHEETS_API_KEY
Value: AIzaSyB_MwjhFxQtxnihpZTa95XH0BCI9MXihh8
Environment: Production, Preview, Development
```

### 2. Google Sheets ID

```
Name: REACT_APP_GOOGLE_SHEETS_ID
Value: 1m2B2ODXuuatnW0EKExdVeCa1WwvF52bZOhS7DGqG6Vg
Environment: Production, Preview, Development
```

---

## 🔧 **OPTIONAL (Tùy chọn - cho audit logging)**

### 3. Audit Webhook URL

```
Name: REACT_APP_AUDIT_WEBHOOK_URL
Value: https://script.google.com/macros/s/AKfycbzJ7ZVmG3JyU0wQlBAfNxC1CK9eUAqrHGKvf_BVUT8eIQYT0TsYL7Jp39kQQidOrPft/exec
Environment: Production, Preview, Development
```

### 4. Profile Update Webhook URL

```
Name: REACT_APP_PROFILE_UPDATE_WEBHOOK_URL
Value: https://script.google.com/macros/s/AKfycbzJ7ZVmG3JyU0wQlBAfNxC1CK9eUAqrHGKvf_BVUT8eIQYT0TsYL7Jp39kQQidOrPft/exec
Environment: Production, Preview, Development
```

---

## ⚙️ **PRODUCTION SETTINGS**

### 5. Node Environment

```
Name: NODE_ENV
Value: production
Environment: Production
```

### 6. Source Map (Disable để tối ưu)

```
Name: GENERATE_SOURCEMAP
Value: false
Environment: Production
```

---

## 📝 **CÁCH THÊM TRONG VERCEL:**

1. Click **"Add New"**
2. Điền **Name** và **Value**
3. Chọn **Environment**: Production, Preview, Development (hoặc cả 3)
4. Click **"Save"**
5. **Redeploy** project để áp dụng

---

## ⚠️ **LƯU Ý:**

- ✅ Tất cả biến `REACT_APP_*` sẽ được expose trong browser
- ✅ Không thêm private keys vào `REACT_APP_*`
- ✅ Sau khi thêm biến mới, cần **Redeploy** project
- ✅ Test lại sau khi deploy để đảm bảo biến hoạt động

---

## 🧪 **TEST SAU KHI DEPLOY:**

1. Mở URL production của bạn
2. Vào Login page
3. Kiểm tra connection status: **🟢 Connected**
4. Thử đăng nhập với: `admin` / `admin1234`

---

**💡 Tip:** Copy từng biến ở trên và paste vào Vercel Dashboard để tránh lỗi typo!
