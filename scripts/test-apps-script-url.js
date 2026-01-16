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

    const url = new URL(APPS_SCRIPT_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: "GET",
      headers: {
        "User-Agent": "MIA-Warehouse-Test/1.0",
      },
      maxRedirects: 5, // Follow up to 5 redirects
    };

    const makeRequest = (requestUrl, redirectCount = 0) => {
      const urlObj = new URL(requestUrl);
      const reqOptions = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: "GET",
        headers: {
          "User-Agent": "MIA-Warehouse-Test/1.0",
        },
      };

      const req = https.request(reqOptions, (res) => {
        let data = "";

        // Handle redirects (301, 302, 307, 308)
        if (
          (res.statusCode === 301 ||
            res.statusCode === 302 ||
            res.statusCode === 307 ||
            res.statusCode === 308) &&
          res.headers.location &&
          redirectCount < 5
        ) {
          const redirectUrl = res.headers.location.startsWith("http")
            ? res.headers.location
            : `https://${urlObj.hostname}${res.headers.location}`;
          console.log(
            `   ↪️  Redirect ${res.statusCode} to: ${redirectUrl.substring(
              0,
              80
            )}...`
          );
          return makeRequest(redirectUrl, redirectCount + 1);
        }

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          // Check if response is HTML (likely error page)
          if (
            data.trim().startsWith("<") ||
            data.toLowerCase().includes("<html") ||
            data.toLowerCase().includes("moved temporarily")
          ) {
            console.log(
              "   ⚠️  Received HTML response (likely redirect or error):"
            );
            console.log("   " + data.substring(0, 300).replace(/\n/g, "\n   "));
            console.log(
              "\n   💡 Vấn đề: Apps Script deployment chưa được cấu hình đúng"
            );
            console.log("   🔧 Giải pháp:");
            console.log("      1. Vào: https://script.google.com");
            console.log(
              "      2. Tìm project và click 'Deploy' > 'Manage deployments'"
            );
            console.log("      3. Click ✏️ Edit ở deployment hiện tại");
            console.log("      4. Đảm bảo 'Who has access' = 'Anyone'");
            console.log("      5. Click 'Deploy' lại");
            resolve({
              success: false,
              error: "HTML redirect response - Check deployment settings",
            });
            return;
          }

          try {
            const response = JSON.parse(data);
            console.log("   ✅ GET request successful!");
            console.log("   📊 Response:", JSON.stringify(response, null, 2));
            // Store the final URL that worked (in case of redirect)
            resolve({
              success: true,
              response,
              redirectUrl: requestUrl, // Store the URL that actually worked
            });
          } catch (error) {
            console.log("   ⚠️  Response is not JSON:");
            console.log("   " + data.substring(0, 300).replace(/\n/g, "\n   "));
            resolve({ success: false, error: "Invalid JSON response" });
          }
        });
      });

      req.on("error", (error) => {
        console.log(`   ❌ GET request failed: ${error.message}`);
        resolve({ success: false, error: error.message });
      });

      req.setTimeout(10000, () => {
        req.destroy();
        console.log("   ❌ Request timeout");
        resolve({ success: false, error: "Request timeout" });
      });

      req.end();
    };

    makeRequest(APPS_SCRIPT_URL);
  });
}

// Test POST request (audit log)
function testPostRequest(useRedirectUrl = null) {
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

    // Use redirect URL from GET if available, otherwise use original URL
    const startUrl = useRedirectUrl || APPS_SCRIPT_URL;

    const makeRequest = (requestUrl, redirectCount = 0) => {
      const urlObj = new URL(requestUrl);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
          "User-Agent": "MIA-Warehouse-Test/1.0",
        },
      };

      const req = https.request(options, (res) => {
        let data = "";

        // Handle redirects (301, 302, 307, 308)
        if (
          (res.statusCode === 301 ||
            res.statusCode === 302 ||
            res.statusCode === 307 ||
            res.statusCode === 308) &&
          res.headers.location &&
          redirectCount < 5
        ) {
          const redirectUrl = res.headers.location.startsWith("http")
            ? res.headers.location
            : `https://${urlObj.hostname}${res.headers.location}`;
          console.log(
            `   ↪️  Redirect ${res.statusCode} to: ${redirectUrl.substring(
              0,
              80
            )}...`
          );
          return makeRequest(redirectUrl, redirectCount + 1);
        }

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          // Check if response is HTML (likely error page)
          if (
            data.trim().startsWith("<") ||
            data.toLowerCase().includes("<html") ||
            data.toLowerCase().includes("moved temporarily")
          ) {
            console.log(
              "   ⚠️  Received HTML response (likely redirect or error):"
            );
            console.log("   " + data.substring(0, 300).replace(/\n/g, "\n   "));
            console.log(
              "\n   💡 Vấn đề: Apps Script deployment chưa được cấu hình đúng"
            );
            console.log("   🔧 Giải pháp:");
            console.log("      1. Vào: https://script.google.com");
            console.log(
              "      2. Tìm project và click 'Deploy' > 'Manage deployments'"
            );
            console.log("      3. Click ✏️ Edit ở deployment hiện tại");
            console.log("      4. Đảm bảo 'Who has access' = 'Anyone'");
            console.log("      5. Click 'Deploy' lại");
            resolve({
              success: false,
              error: "HTML redirect response - Check deployment settings",
            });
            return;
          }

          try {
            const response = JSON.parse(data);
            console.log("   ✅ POST request successful!");
            console.log("   📊 Response:", JSON.stringify(response, null, 2));
            resolve({ success: true, response });
          } catch (error) {
            console.log("   ⚠️  Response is not JSON:");
            console.log("   " + data.substring(0, 300).replace(/\n/g, "\n   "));
            resolve({ success: false, error: "Invalid JSON response" });
          }
        });
      });

      req.on("error", (error) => {
        console.log(`   ❌ POST request failed: ${error.message}`);
        resolve({ success: false, error: error.message });
      });

      req.setTimeout(10000, () => {
        req.destroy();
        console.log("   ❌ Request timeout");
        resolve({ success: false, error: "Request timeout" });
      });

      req.write(postData);
      req.end();
    };

    makeRequest(APPS_SCRIPT_URL);
  });
}

// Store redirect URL from GET request to use for POST
let redirectUrl = null;

// Main test function
async function runTests() {
  const getResult = await testGetRequest();

  // If GET succeeded and we have a redirect URL, use it for POST
  if (getResult.redirectUrl) {
    console.log(
      `\n   💡 Using redirect URL for POST: ${getResult.redirectUrl.substring(
        0,
        80
      )}...`
    );
  }

  const postResult = await testPostRequest(getResult.redirectUrl || null);

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
  } else if (getResult.success && !postResult.success) {
    console.log("\n✅ GET request successful - Apps Script is accessible!");
    console.log("⚠️  POST request failed - this may be normal for Apps Script");
    console.log("\n💡 Lưu ý:");
    console.log("   - GET request đã thành công, Apps Script đang hoạt động");
    console.log("   - POST request có thể cần xử lý khác trong production");
    console.log(
      "   - Trong React app, POST requests sẽ dùng fetch với mode 'no-cors'"
    );
    console.log("   - Điều này sẽ hoạt động tốt trong browser environment");
    console.log("\n📝 Next steps:");
    console.log("   1. Copy URL to your .env file:");
    console.log(`      REACT_APP_AUDIT_WEBHOOK_URL=${APPS_SCRIPT_URL}`);
    console.log(
      `      REACT_APP_PROFILE_UPDATE_WEBHOOK_URL=${APPS_SCRIPT_URL}`
    );
    console.log(
      "   2. Restart your React app to load new environment variables"
    );
    console.log(
      "   3. Test POST requests trong browser (sẽ hoạt động với no-cors mode)"
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
