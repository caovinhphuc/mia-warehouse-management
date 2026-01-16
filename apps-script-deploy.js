#!/usr/bin/env node

/**
 * 🚀 GOOGLE APPS SCRIPT DEPLOYMENT HELPER
 * Script hỗ trợ deploy Google Apps Script cho MIA Warehouse Management System
 * https://script.google.com/macros/s/AKfycbzJ7ZVmG3JyU0wQlBAfNxC1CK9eUAqrHGKvf_BVUT8eIQYT0TsYL7Jp39kQQidOrPft/exec
 */

const fs = require("fs");
const path = require("path");

console.log("🚀 GOOGLE APPS SCRIPT DEPLOYMENT HELPER");
console.log("==========================================\n");

// Read Code.gs file
const codeGsPath = path.join(__dirname, "Code.gs");
const codeGsContent = fs.readFileSync(codeGsPath, "utf8");

console.log("📋 DEPLOYMENT STEPS:\n");

console.log("1️⃣ TẠो APPS SCRIPT PROJECT:");
console.log("   • Truy cập: https://script.google.com");
console.log('   • Click "New Project"');
console.log('   • Đặt tên: "MIA Warehouse Profile Updater"\n');

console.log("2️⃣ COPY CODE.GS CONTENT:");
console.log("   • Select All và Delete code mặc định");
console.log("   • Copy toàn bộ nội dung sau:\n");

console.log("========== CODE.GS CONTENT START ==========");
console.log(codeGsContent);
console.log("========== CODE.GS CONTENT END ==========\n");

console.log("3️⃣ DEPLOY AS WEB APP:");
console.log('   • Click "Deploy > New deployment"');
console.log('   • Type: "Web app"');
console.log('   • Description: "MIA Warehouse API v1.0"');
console.log('   • Execute as: "Me"');
console.log('   • Who has access: "Anyone"');
console.log('   • Click "Deploy"\n');

console.log("4️⃣ COPY WEB APP URL:");
console.log("   • Sau khi deploy thành công");
console.log(
  "   • Copy Web App URL (dạng: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec)"
);
console.log("   • Lưu URL này để cập nhật vào Vercel environment variables\n");

console.log("5️⃣ UPDATE VERCEL ENVIRONMENT VARIABLES:");
console.log("   • Truy cập Vercel project settings");
console.log("   • Add environment variables:");
console.log("     REACT_APP_AUDIT_WEBHOOK_URL=[YOUR_WEB_APP_URL]");
console.log("     REACT_APP_PROFILE_UPDATE_WEBHOOK_URL=[YOUR_WEB_APP_URL]");
console.log("   • Redeploy application\n");

console.log("6️⃣ TEST INTEGRATION:");
console.log("   • Login vào ứng dụng");
console.log("   • Thay đổi profile information");
console.log("   • Kiểm tra Google Sheets có cập nhật không");
console.log("   • Verify audit log entries\n");

console.log("✅ DEPLOY COMPLETED!");
console.log("📞 Support: caovinhphuc.ios@gmail.com");

// Save detailed instructions to file
const instructionsPath = path.join(__dirname, "APPS_SCRIPT_INSTRUCTIONS.txt");
const instructions = `
GOOGLE APPS SCRIPT DEPLOYMENT INSTRUCTIONS
==========================================

1. Truy cập: https://script.google.com
2. Tạo project mới: "MIA Warehouse Profile Updater"
3. Copy Code.gs content (đã save trong file này)
4. Deploy as Web App với settings:
   - Execute as: Me
   - Who has access: Anyone
5. Copy Web App URL
6. Update Vercel environment variables
7. Test integration

Code.gs Content:
================
${codeGsContent}

Environment Variables to Add:
============================
REACT_APP_AUDIT_WEBHOOK_URL=[YOUR_WEB_APP_URL]
REACT_APP_PROFILE_UPDATE_WEBHOOK_URL=[YOUR_WEB_APP_URL]

Test Cases:
===========
1. Login with admin account
2. Update profile information
3. Verify Google Sheets update
4. Check audit log entries

Generated: ${new Date().toISOString()}
Support: caovinhphuc.ios@gmail.com
`;

console.log("📄 Chi tiết instructions đã lưu trong: ${instructionsPath}");
fs.writeFileSync(instructionsPath, instructions);
console.log(`📄 Chi tiết instructions đã lưu trong: ${instructionsPath}`);
