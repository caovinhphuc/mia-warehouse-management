# 🔧 Cập Nhật Google Apps Script - Sửa CORS Headers

## ⚠️ Vấn Đề Đã Sửa

Code trước đây định nghĩa CORS headers nhưng **không set vào response**, gây lỗi CORS khi gọi từ browser.

## ✅ Đã Sửa

1. ✅ Thêm CORS headers vào `doGet()` response
2. ✅ Thêm CORS headers vào `doPost()` success response
3. ✅ Thêm CORS headers vào `doPost()` error response
4. ✅ Cập nhật endpoint ID trong response

## 📝 Các Bước Cập Nhật

### Bước 1: Copy Code Mới

File code đã được sửa: **`fixed-apps-script.gs`** hoặc **`Code.gs`**

Copy **TOÀN BỘ** nội dung từ file này.

### Bước 2: Vào Google Apps Script

1. Mở: <https://script.google.com>
2. Tìm project của bạn (hoặc tạo mới)
3. Mở editor

### Bước 3: Paste Code Mới

1. Xóa **TOÀN BỘ** code cũ
2. Paste code mới từ `fixed-apps-script.gs`
3. Click **Save** (Ctrl+S / Cmd+S)

### Bước 4: Deploy Lại

1. Click **Deploy** > **Manage deployments**
2. Click **✏️ Edit** (icon edit) ở deployment hiện tại
3. **QUAN TRỌNG**: Kiểm tra settings:
   - **Execute as**: "Me"
   - **Who has access**: **"Anyone"** ⚠️ (Phải là "Anyone"!)
4. Click **Deploy**
5. Copy URL mới (nếu có thay đổi)

### Bước 5: Test

Sau khi deploy lại, test bằng một trong các cách:

**Option 1: Test trong browser**

```bash
# Mở URL này trong browser
https://script.google.com/macros/s/AKfycbzJ7ZVmG3JyU0wQlBAfNxC1CK9eUAqrHGKvf_BVUT8eIQYT0TsYL7Jp39kQQidOrPft/exec
```

Nếu thấy JSON response như này là OK:

```json
{
  "success": true,
  "message": "🏭 MIA Warehouse Apps Script is working!",
  "timestamp": "...",
  "version": "1.0 - Audit Logging"
}
```

**Option 2: Test bằng script**

```bash
node test-apps-script-url.js
```

**Option 3: Test bằng local server**

```bash
node test-server.js
# Mở: http://localhost:3000/test-apps-script.html
```

## 🎯 Những Thay Đổi Chính

### doGet() - Thêm CORS headers

```javascript
return ContentService.createTextOutput(...)
  .setMimeType(ContentService.MimeType.JSON)
  .setHeaders({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
```

### doPost() - Set CORS headers cho cả success và error

```javascript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Success response
return ContentService.createTextOutput(...)
  .setMimeType(ContentService.MimeType.JSON)
  .setHeaders(corsHeaders);

// Error response
return ContentService.createTextOutput(...)
  .setMimeType(ContentService.MimeType.JSON)
  .setHeaders(corsHeaders);
```

## ⚠️ Lưu Ý Quan Trọng

1. **Phải deploy lại** sau khi update code
2. **"Who has access" phải là "Anyone"** - nếu không sẽ bị redirect
3. Nếu URL thay đổi sau khi deploy, cập nhật lại `.env.local`:

   ```env
   REACT_APP_AUDIT_WEBHOOK_URL=<URL_MỚI>
   REACT_APP_PROFILE_UPDATE_WEBHOOK_URL=<URL_MỚI>
   ```

## 🆘 Nếu Vẫn Lỗi

1. Kiểm tra lại deployment settings
2. Đảm bảo "Who has access" = "Anyone"
3. Clear browser cache và test lại
4. Check Google Apps Script execution log (View > Logs)

---

**Cập nhật:** 2025-01-02
**Files đã sửa:** `fixed-apps-script.gs`, `Code.gs`
