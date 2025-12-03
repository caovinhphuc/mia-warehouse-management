# 🔧 Hướng Dẫn Cấu Hình Google Apps Script

## 📋 URL Hiện Tại

```
https://script.google.com/macros/s/AKfycbzJ7ZVmG3JyU0wQlBAfNxC1CK9eUAqrHGKvf_BVUT8eIQYT0TsYL7Jp39kQQidOrPft/exec
```

## ⚠️ Vấn Đề Hiện Tại

URL đang redirect đến trang đăng nhập, có nghĩa là:

- Apps Script chưa được deploy với quyền "Anyone"
- Hoặc cần phải authorize lại permissions

## ✅ Các Bước Khắc Phục

### Bước 1: Truy cập Apps Script Editor

1. Mở: <https://script.google.com>
2. Tìm project **"MIA Warehouse Profile Updater"** hoặc project có script ID tương ứng
3. Click vào project để mở editor

### Bước 2: Kiểm Tra Deployment

1. Click menu **"Deploy"** > **"Manage deployments"**
2. Kiểm tra deployment hiện tại:
   - **Execute as**: Phải là **"Me"**
   - **Who has access**: Phải là **"Anyone"**

### Bước 3: Cập Nhật Deployment Settings

Nếu "Who has access" không phải "Anyone":

1. Click icon **✏️ Edit** (bên cạnh deployment)
2. Trong phần **"Execute as"**: Chọn **"Me"**
3. Trong phần **"Who has access"**: Chọn **"Anyone"**
4. Click **"Deploy"**
5. **COPY URL MỚI** (nếu có thay đổi)

### Bước 4: Authorize Script (Nếu Cần)

1. Trong editor, click **"Run"** (play button) ở bất kỳ function nào
2. Google sẽ yêu cầu authorization:
   - Click **"Review permissions"**
   - Chọn tài khoản Google của bạn
   - Click **"Advanced"** > **"Go to [Project Name] (unsafe)"**
   - Click **"Allow"**

### Bước 5: Test URL

Chạy script test:

```bash
node test-apps-script-url.js
```

Hoặc test trực tiếp trong browser:

- GET request: Mở URL trong browser, phải thấy JSON response
- POST request: Dùng Postman hoặc curl để test

### Bước 6: Cập Nhật Environment Variables

Sau khi URL hoạt động:

1. **Local development** (.env file):

```env
REACT_APP_AUDIT_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbzJ7ZVmG3JyU0wQlBAfNxC1CK9eUAqrHGKvf_BVUT8eIQYT0TsYL7Jp39kQQidOrPft/exec
REACT_APP_PROFILE_UPDATE_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbzJ7ZVmG3JyU0wQlBAfNxC1CK9eUAqrHGKvf_BVUT8eIQYT0TsYL7Jp39kQQidOrPft/exec
```

2. **Production** (Vercel):
   - Vào Vercel Dashboard > Project Settings > Environment Variables
   - Thêm hoặc cập nhật 2 biến trên với URL mới
   - Redeploy application

## 🧪 Test Kết Nối

### Test bằng cURL

```bash
# GET request
curl "https://script.google.com/macros/s/AKfycbzJ7ZVmG3JyU0wQlBAfNxC1CK9eUAqrHGKvf_BVUT8eIQYT0TsYL7Jp39kQQidOrPft/exec"

# POST request (audit log)
curl -X POST "https://script.google.com/macros/s/AKfycbzJ7ZVmG3JyU0wQlBAfNxC1CK9eUAqrHGKvf_BVUT8eIQYT0TsYL7Jp39kQQidOrPft/exec" \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2025-01-02T00:00:00.000Z",
    "action": "TEST",
    "username": "test",
    "details": "Test connection",
    "status": "SUCCESS",
    "ipAddress": "127.0.0.1"
  }'
```

### Response mong đợi

```json
{
  "success": true,
  "message": "🏭 MIA Warehouse Apps Script is working!",
  "timestamp": "2025-01-02T00:00:00.000Z",
  "version": "1.0 - Audit Logging"
}
```

## 📝 Lưu Ý Quan Trọng

1. **Permissions**: Apps Script phải được deploy với quyền "Anyone" để frontend có thể gọi
2. **Authorization**: Script cần được authorize ít nhất 1 lần trước khi public
3. **CORS**: Code.gs đã có CORS headers, đảm bảo không bị block bởi browser
4. **Rate Limiting**: Google Apps Script có giới hạn về số requests, cần cache khi có thể

## 🆘 Troubleshooting

### Vấn đề: "Moved Temporarily" redirect

- **Nguyên nhân**: Deployment chưa được set "Anyone"
- **Giải pháp**: Làm theo Bước 3 ở trên

### Vấn đề: "Script function not found"

- **Nguyên nhân**: Code.gs chưa có function doGet() hoặc doPost()
- **Giải pháp**: Kiểm tra file Code.gs có đầy đủ functions

### Vấn đề: "Authorization required"

- **Nguyên nhân**: Script chưa được authorize
- **Giải pháp**: Làm theo Bước 4 ở trên

## 📞 Hỗ Trợ

- Email: <caovinhphuc.ios@gmail.com>
- File test: `test-apps-script-url.js`
- Documentation: `APPS_SCRIPT_INSTRUCTIONS.txt`

---

**Cập nhật:** 2025-01-02
