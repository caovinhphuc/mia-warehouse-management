#!/usr/bin/env node

/**
 * 🧪 TEST LOGIN FUNCTIONALITY
 * Script để test đăng nhập và kiểm tra các vấn đề
 */

const https = require("https");

// Load environment variables from .env if available
require("dotenv").config({ path: ".env" });

const CONFIG = {
  API_KEY:
    process.env.REACT_APP_GOOGLE_SHEETS_API_KEY ||
    "AIzaSyB_MwjhFxQtxnihpZTa95XH0BCI9MXihh8",
  SHEET_ID:
    process.env.REACT_APP_GOOGLE_SHEETS_ID ||
    "1m2B2ODXuuatnW0EKExdVeCa1WwvF52bZOhS7DGqG6Vg",
  BASE_URL: "https://sheets.googleapis.com/v4/spreadsheets",
  RANGE: "Users!A:H",
};

console.log("🧪 TEST LOGIN FUNCTIONALITY");
console.log("==============================\n");

// Test 1: Check API Key
console.log("1️⃣ Checking API Key...");
if (!CONFIG.API_KEY || CONFIG.API_KEY.trim() === "") {
  console.log("   ❌ API Key is NOT SET");
  console.log("   💡 Set REACT_APP_GOOGLE_SHEETS_API_KEY in .env or Vercel");
} else {
  console.log(`   ✅ API Key is set: ${CONFIG.API_KEY.substring(0, 20)}...`);
}

// Test 2: Check Sheet ID
console.log("\n2️⃣ Checking Sheet ID...");
if (!CONFIG.SHEET_ID || CONFIG.SHEET_ID.trim() === "") {
  console.log("   ❌ Sheet ID is NOT SET");
} else {
  console.log(`   ✅ Sheet ID: ${CONFIG.SHEET_ID}`);
}

// Test 3: Test Google Sheets API connection
console.log("\n3️⃣ Testing Google Sheets API connection...");
function testGoogleSheetsConnection() {
  return new Promise((resolve) => {
    const url = `${CONFIG.BASE_URL}/${CONFIG.SHEET_ID}/values/${CONFIG.RANGE}?key=${CONFIG.API_KEY}`;

    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            if (res.statusCode === 200) {
              const response = JSON.parse(data);
              if (response.values && response.values.length > 0) {
                console.log(`   ✅ Connection successful!`);
                console.log(
                  `   📊 Found ${response.values.length} rows (including header)`
                );
                console.log(`   👥 Users count: ${response.values.length - 1}`);

                // Show all users with credentials
                if (response.values.length > 1) {
                  console.log("\n   📋 All users in system:");
                  response.values.slice(1).forEach((row, index) => {
                    console.log(
                      `      ${index + 1}. Username: ${
                        row[0] || "N/A"
                      }, Password: ${row[1] || "N/A"}, Email: ${
                        row[3] || "N/A"
                      }, Role: ${row[4] || "N/A"}`
                    );
                  });
                }

                resolve({ success: true, data: response });
              } else {
                console.log("   ⚠️  Connection successful but no data found");
                resolve({ success: false, error: "No data" });
              }
            } else {
              const errorData = JSON.parse(data);
              console.log(`   ❌ Connection failed: HTTP ${res.statusCode}`);
              console.log(
                `   Error: ${errorData.error?.message || "Unknown error"}`
              );

              if (res.statusCode === 403) {
                console.log(
                  "\n   💡 Vấn đề: API Key không hợp lệ hoặc không có quyền truy cập"
                );
                console.log("   🔧 Giải pháp:");
                console.log(
                  "      1. Kiểm tra API Key trong Google Cloud Console"
                );
                console.log(
                  "      2. Đảm bảo Google Sheets API đã được enable"
                );
                console.log("      3. Kiểm tra Sheet ID có đúng không");
                console.log(
                  "      4. Đảm bảo Sheet đã được share với service account (nếu dùng)"
                );
              }

              resolve({ success: false, error: errorData.error?.message });
            }
          } catch (error) {
            console.log(`   ❌ Parse error: ${error.message}`);
            console.log(`   Response: ${data.substring(0, 200)}`);
            resolve({ success: false, error: error.message });
          }
        });
      })
      .on("error", (error) => {
        console.log(`   ❌ Connection error: ${error.message}`);
        resolve({ success: false, error: error.message });
      });
  });
}

// Test 4: Test specific user credentials
console.log("\n4️⃣ Testing user credentials...");
async function testUserCredentials(username, password) {
  return new Promise((resolve) => {
    const url = `${CONFIG.BASE_URL}/${CONFIG.SHEET_ID}/values/${CONFIG.RANGE}?key=${CONFIG.API_KEY}`;

    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            if (res.statusCode === 200) {
              const response = JSON.parse(data);
              if (response.values && response.values.length > 1) {
                const users = response.values.slice(1);

                // Find user
                const normalizedInput = username.toLowerCase().trim();
                const user = users.find(
                  (u) =>
                    (u[0] && u[0].toLowerCase() === normalizedInput) ||
                    (u[3] && u[3].toLowerCase() === normalizedInput)
                );

                if (!user) {
                  console.log(`   ❌ User "${username}" not found`);
                  console.log("   💡 Available usernames:");
                  users.slice(0, 5).forEach((u) => {
                    console.log(`      - ${u[0] || "N/A"} (${u[3] || "N/A"})`);
                  });
                  resolve({ success: false, error: "User not found" });
                  return;
                }

                // Check password
                if (user[1] !== password) {
                  console.log(
                    `   ❌ Password incorrect for user "${username}"`
                  );
                  console.log(`   💡 Expected password: "${user[1]}"`);
                  resolve({ success: false, error: "Password incorrect" });
                  return;
                }

                console.log(`   ✅ Credentials valid for user "${username}"`);
                console.log(
                  `   📊 User info: ${user[2] || "N/A"} (${user[4] || "N/A"})`
                );
                resolve({ success: true, user });
              } else {
                console.log("   ❌ No users found in sheet");
                resolve({ success: false, error: "No users" });
              }
            } else {
              console.log(
                `   ❌ Failed to fetch users: HTTP ${res.statusCode}`
              );
              resolve({ success: false, error: `HTTP ${res.statusCode}` });
            }
          } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
            resolve({ success: false, error: error.message });
          }
        });
      })
      .on("error", (error) => {
        console.log(`   ❌ Connection error: ${error.message}`);
        resolve({ success: false, error: error.message });
      });
  });
}

// Main test function
async function runTests() {
  const connectionTest = await testGoogleSheetsConnection();

  if (connectionTest.success) {
    // Test with default credentials
    console.log("\n5️⃣ Testing default credentials (admin/admin12345)...");
    await testUserCredentials("admin", "admin12345");
  }

  console.log("\n" + "=".repeat(50));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(50));
  console.log(`API Key: ${CONFIG.API_KEY ? "✅ Set" : "❌ Not Set"}`);
  console.log(`Sheet ID: ${CONFIG.SHEET_ID ? "✅ Set" : "❌ Not Set"}`);
  console.log(
    `Connection: ${connectionTest.success ? "✅ Success" : "❌ Failed"}`
  );

  if (!connectionTest.success) {
    console.log("\n🎯 NEXT STEPS:");
    console.log("   1. Check API Key in .env or Vercel Environment Variables");
    console.log("   2. Verify Google Sheets API is enabled");
    console.log("   3. Check Sheet ID is correct");
    console.log("   4. Ensure Sheet is accessible");
  }
}

// Run tests
runTests().catch((error) => {
  console.error("❌ Test script error:", error);
  process.exit(1);
});
