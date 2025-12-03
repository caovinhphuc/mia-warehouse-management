# 🚀 DEPLOY LÊN VERCEL NGAY BÂY GIỜ

## ✅ Trạng thái hiện tại

- ✅ Code đã được commit: `🚀 Deploy: Update authentication to support email/login + latest features`
- ✅ Code đã được push lên GitHub: [https://github.com/caovinhphuc/mia-warehouse-management](https://github.com/caovinhphuc/mia-warehouse-management)
- ✅ Repository: `caovinhphuc/mia-warehouse-management`
- 🌐 Vercel URL hiện tại: [https://warehouse-management-template-jsx.vercel.app/login](https://warehouse-management-template-jsx.vercel.app/login)

---

## 🎯 **CÁCH 1: Deploy qua Vercel Dashboard (KHUYÊN DÙNG)**

### **Bước 1: Kiểm tra Vercel Dashboard**

1. Mở: **<https://vercel.com/dashboard>**
2. Đăng nhập với GitHub account: **caovinhphuc**
3. Tìm project: **mia-warehouse-management**

### **Bước 2: Trigger Deployment**

**Nếu đã kết nối GitHub:**

- Vercel sẽ **TỰ ĐỘNG deploy** khi có code mới từ GitHub
- Kiểm tra tab **"Deployments"** để xem deployment mới nhất
- Nếu chưa tự động, click **"Redeploy"** → Chọn commit mới nhất

**Nếu chưa kết nối GitHub:**

1. Click **"Add New..."** → **"Project"**
2. Import từ GitHub: **mia-warehouse-management**
3. Vercel sẽ tự động detect cấu hình
4. Click **"Deploy"**

### **Bước 3: Cấu hình Environment Variables**

**QUAN TRỌNG!** Đảm bảo đã thêm các biến sau trong Vercel:

1. Vào: **Settings** → **Environment Variables**
2. Thêm các biến sau:

```
REACT_APP_GOOGLE_SHEETS_API_KEY=AIzaSyB_MwjhFxQtxnihpZTa95XH0BCI9MXihh8
REACT_APP_GOOGLE_SHEETS_ID=1m2B2ODXuuatnW0EKExdVeCa1WwvF52bZOhS7DGqG6Vg
REACT_APP_AUDIT_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbzJ7ZVmG3JyU0wQlBAfNxC1CK9eUAqrHGKvf_BVUT8eIQYT0TsYL7Jp39kQQidOrPft/exec
REACT_APP_PROFILE_UPDATE_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbzJ7ZVmG3JyU0wQlBAfNxC1CK9eUAqrHGKvf_BVUT8eIQYT0TsYL7Jp39kQQidOrPft/exec
NODE_ENV=production
GENERATE_SOURCEMAP=false
```

3. Chọn environment: **Production, Preview, Development**
4. Click **"Save"**
5. Vercel sẽ tự động **redeploy**

---

## 🎯 **CÁCH 2: Deploy qua Vercel CLI**

### **Cài đặt Vercel CLI (nếu chưa có):**

```bash
npm install -g vercel
```

### **Deploy:**

```bash
cd /Users/phuccao/Documents/GitHub/mia-warehouse-management
vercel --prod
```

**Lưu ý:**

- Lần đầu sẽ hỏi login và cấu hình project
- Sau đó sẽ deploy tự động

---

## 📋 **CHECKLIST TRƯỚC KHI DEPLOY:**

- [x] ✅ Code đã commit và push lên GitHub
- [ ] ⚠️ Environment variables đã cấu hình trong Vercel
- [ ] ⚠️ Google Sheets API key đúng
- [ ] ⚠️ Google Apps Script webhook URLs đúng

---

## 🧪 **SAU KHI DEPLOY - TEST NGAY:**

1. Mở URL Vercel của bạn
2. Vào Login page
3. Kiểm tra connection status: **🟢 Connected**
4. Đăng nhập với:
   - **Username**: `admin` hoặc email trong Google Sheets
   - **Password**: `admin1234`
5. Kiểm tra các tính năng hoạt động

---

## 🐛 **TROUBLESHOOTING:**

### **Deployment failed:**

- Check build logs trong Vercel Dashboard
- Verify environment variables đã add đúng
- Test build local: `npm run build`

### **Environment variables không hoạt động:**

- Đảm bảo biến bắt đầu bằng `REACT_APP_`
- Redeploy sau khi thêm biến mới
- Kiểm tra trong Vercel → Settings → Environment Variables

### **Google Sheets không kết nối:**

- Verify API key trong Vercel
- Check Google Sheets ID đúng
- Test API key: <https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/Users!A:H?key=YOUR_API_KEY>

---

## 📞 **HỖ TRỢ:**

- 📖 Xem chi tiết: `VERCEL_ENV_VARS.md`
- 📖 Quick guide: `QUICK_DEPLOY.md`
- 📖 Full guide: `FINAL_DEPLOYMENT_GUIDE.md`

---

**🚀 BẮT ĐẦU DEPLOY NGAY TẠI: <https://vercel.com/dashboard>**
