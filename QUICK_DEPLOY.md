# 🚀 QUICK DEPLOY GUIDE - MIA WAREHOUSE

## ⚡ Deploy nhanh trong 5 phút

### **Phương pháp 1: Script tự động** (Khuyên dùng)

```bash
 ./deploy.sh
```

Script sẽ tự động:

1. ✅ Build test để đảm bảo không có lỗi
2. ✅ Kiểm tra và add file vào staging
3. ✅ Commit (chỉ khi có thay đổi; bỏ qua nếu working tree clean)
4. ✅ Hỏi xác nhận push lên GitHub
5. ✅ Hỏi xác nhận deploy lên Vercel (nếu có Vercel CLI)

---

### **Phương pháp 2: Manual Deploy**

#### **Bước 1: Commit & Push**

```bash
# Thêm tất cả file
git add .

# Commit
git commit -m "🚀 Deploy: Update authentication + latest features"

# Push lên GitHub
git push origin main
```

#### **Bước 2: Deploy lên Vercel**

**Option A: Tự động (nếu đã kết nối GitHub)**

- Vercel sẽ tự động deploy khi có code mới
- Kiểm tra tại: <https://vercel.com/dashboard>

**Option B: Manual qua Vercel CLI**

```bash
# Cài đặt Vercel CLI (nếu chưa có)
npm install -g vercel

# Deploy
vercel --prod
```

**Option C: Qua Vercel Dashboard**

1. Mở <https://vercel.com/dashboard>
2. Chọn project: `mia-warehouse-management`
3. Click "Redeploy" → "Redeploy" lại

---

## 🔧 Environment Variables (QUAN TRỌNG!)

### **Cấu hình trong Vercel Dashboard:**

1. Vào project → **Settings** → **Environment Variables**
2. Thêm các biến sau:

```env
REACT_APP_GOOGLE_SHEETS_API_KEY=<API_KEY_CỦA_BẠN>
REACT_APP_GOOGLE_SHEETS_ID=<SHEET_ID_CỦA_BẠN>
REACT_APP_AUDIT_WEBHOOK_URL=<WEBHOOK_URL_APPS_SCRIPT>
REACT_APP_PROFILE_UPDATE_WEBHOOK_URL=<WEBHOOK_URL_APPS_SCRIPT>
NODE_ENV=production
GENERATE_SOURCEMAP=false
```

> 📋 Chi tiết biến env: xem `VERCEL_ENV_VARS.md` hoặc `env.example`

1. Chọn environment: **Production, Preview, Development**
2. Click **Save**
3. Vercel sẽ tự động redeploy

---

## ✅ Checklist trước khi deploy

- [ ] Code đã được test local
- [ ] Build thành công (`npm run build`)
- [ ] Environment variables đã cấu hình
- [ ] Google Sheets API key đúng
- [ ] Google Apps Script đã deploy (nếu dùng webhook)

---

## 🐛 Troubleshooting

### **Build failed trên Vercel (`pnpm run build` exited with 1):**

- Dự án dùng **npm** (có `vercel.json` bắt buộc `npm ci` và `npm run build`)
- Nếu có `pnpm-lock.yaml`, Vercel có thể nhầm dùng pnpm → đã fix trong `vercel.json`

```bash
# Test build local trước
npm run build
```

### **Environment variables không hoạt động:**

- Đảm bảo biến bắt đầu bằng `REACT_APP_`
- Redeploy sau khi thêm biến mới
- Kiểm tra trong Vercel Dashboard → Settings → Environment Variables

### **Google Sheets không kết nối:**

- Kiểm tra API key trong Vercel
- Verify Google Sheets ID đúng
- Check permissions của Google Sheets

### **Bước 6 "Bỏ qua deploy Vercel" dù chưa bấm n:**

- Đã fix: buffer stdin sau bước 5 (push) để bước 6 đọc đúng input
- Đảm bảo dùng `deploy.sh` mới nhất

---

## 📞 Hỗ trợ

Xem chi tiết tại: `FINAL_DEPLOYMENT_GUIDE.md`

---

**🎯 Ready to deploy! Chạy `./deploy.sh` để bắt đầu!**
