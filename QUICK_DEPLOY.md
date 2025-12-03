# 🚀 QUICK DEPLOY GUIDE - MIA WAREHOUSE

## ⚡ Deploy nhanh trong 5 phút

### **Phương pháp 1: Script tự động** (Khuyên dùng)

```bash
./deploy.sh
```

Script sẽ tự động:

1. ✅ Build test để đảm bảo không có lỗi
2. ✅ Commit tất cả thay đổi
3. ✅ Push lên GitHub
4. ✅ Deploy lên Vercel (nếu có Vercel CLI)

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
REACT_APP_GOOGLE_SHEETS_API_KEY=AIzaSyB_MwjhFxQtxnihpZTa95XH0BCI9MXihh8
REACT_APP_GOOGLE_SHEETS_ID=1m2B2ODXuuatnW0EKExdVeCa1WwvF52bZOhS7DGqG6Vg
REACT_APP_AUDIT_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbzJ7ZVmG3JyU0wQlBAfNxC1CK9eUAqrHGKvf_BVUT8eIQYT0TsYL7Jp39kQQidOrPft/exec
REACT_APP_PROFILE_UPDATE_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbzJ7ZVmG3JyU0wQlBAfNxC1CK9eUAqrHGKvf_BVUT8eIQYT0TsYL7Jp39kQQidOrPft/exec
NODE_ENV=production
GENERATE_SOURCEMAP=false
```

3. Chọn environment: **Production, Preview, Development**
4. Click **Save**
5. Vercel sẽ tự động redeploy

---

## ✅ Checklist trước khi deploy

- [ ] Code đã được test local
- [ ] Build thành công (`npm run build`)
- [ ] Environment variables đã cấu hình
- [ ] Google Sheets API key đúng
- [ ] Google Apps Script đã deploy (nếu dùng webhook)

---

## 🐛 Troubleshooting

### **Build failed trên Vercel:**

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

---

## 📞 Hỗ trợ

Xem chi tiết tại: `FINAL_DEPLOYMENT_GUIDE.md`

---

**🎯 Ready to deploy! Chạy `./deploy.sh` để bắt đầu!**
