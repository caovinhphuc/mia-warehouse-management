#!/usr/bin/env node

/**
 * 🧪 TEST GOOGLE APPS SCRIPT URL
 * Script đơn giản để test Google Apps Script Web App URL
 */

const https = require("https");

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwUdvTeCpEEvqdUb00IMnwuSSdIoOGlIuaLYoEWY4Zf-k1hnHTFCBVsI4QmZmFBBaOd/exec";

console.log("🧪 Testing Google Apps Script URL...\n");
console.log(`URL: ${APPS_SCRIPT_URL}\n`);

// Test GET request (should return JSON)
function testGetRequest() {
  return new Promise((resolve) => {
    console.log("1️⃣ Testing GET request...");

    https
      .get(APPS_SCRIPT_URL, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const response = JSON.parse(data);
            console.log("   ✅ GET request successful!");
            console.log("   📊 Response:", JSON.stringify(response, null, 2));
            resolve({ success: true, response });
          } catch (error) {
            console.log("   ⚠️ Response is not JSON:", data.substring(0, 200));
            resolve({ success: false, error: "Invalid JSON response" });
          }
        });
      })
      .on("error", (error) => {
        console.log(`   ❌ GET request failed: ${error.message}`);
        resolve({ success: false, error: error.message });
      });
  });
}

// Test POST request (audit log)
function testPostRequest() {
  return new Promise((resolve) => {
    console.log("\n2️⃣ Testing POST request (audit log)...");

    const testData = {
      timestamp: new Date().toISOString(),
      action: "TEST_CONNECTION",
      username: "test-user",
      details: "Testing Apps Script connection",
      status: "SUCCESS",
      ipAddress: "127.0.0.1",
    };

    const postData = JSON.stringify(testData);

    const url = new URL(APPS_SCRIPT_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const response = JSON.parse(data);
          console.log("   ✅ POST request successful!");
          console.log("   📊 Response:", JSON.stringify(response, null, 2));
          resolve({ success: true, response });
        } catch (error) {
          console.log("   ⚠️ Response is not JSON:", data.substring(0, 200));
          resolve({ success: false, error: "Invalid JSON response" });
        }
      });
    });

    req.on("error", (error) => {
      console.log(`   ❌ POST request failed: ${error.message}`);
      resolve({ success: false, error: error.message });
    });

    req.write(postData);
    req.end();
  });
}

// Main test function
async function runTests() {
  const getResult = await testGetRequest();
  const postResult = await testPostRequest();

  console.log("\n" + "=".repeat(50));
  console.log("📊 TEST RESULTS SUMMARY");
  console.log("=".repeat(50));
  console.log(`GET Request:  ${getResult.success ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`POST Request: ${postResult.success ? "✅ PASS" : "❌ FAIL"}`);

  if (getResult.success && postResult.success) {
    console.log("\n🎉 Google Apps Script URL is working correctly!");
    console.log("\n📝 Next steps:");
    console.log("   1. Copy URL to your .env file:");
    console.log(`      REACT_APP_AUDIT_WEBHOOK_URL=${APPS_SCRIPT_URL}`);
    console.log(
      `      REACT_APP_PROFILE_UPDATE_WEBHOOK_URL=${APPS_SCRIPT_URL}`
    );
    console.log(
      "   2. Restart your React app to load new environment variables"
    );
  } else {
    console.log("\n⚠️ Some tests failed. Please check:");
    console.log(
      "   - Apps Script deployment settings (Who has access: Anyone)"
    );
    console.log("   - Apps Script permissions");
    console.log("   - Network connectivity");
  }
}

// Run tests
runTests().catch((error) => {
  console.error("❌ Test script error:", error);
  process.exit(1);
});
