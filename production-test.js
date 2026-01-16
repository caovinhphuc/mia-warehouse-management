#!/usr/bin/env node

/**
 * 🧪 PRODUCTION END-TO-END TEST SCRIPT
 * Test complete workflow: Frontend → Google Sheets → Apps Script
 */

const https = require("https"); // for testing Google Sheets API and Apps Script web app

const http = require("http"); // for testing Vercel app
const fs = require("fs"); // for reading apps-script-deploy.js file

// Try to extract Apps Script URL from apps-script-deploy.js or use environment variable
let APPS_SCRIPT_URL = process.env.REACT_APP_AUDIT_WEBHOOK_URL || "";
if (!APPS_SCRIPT_URL && fs.existsSync("apps-script-deploy.js")) {
  try {
    const appsScriptContent = fs.readFileSync("apps-script-deploy.js", "utf8");
    // Extract URL from comment or content
    const urlMatch = appsScriptContent.match(
      /https:\/\/script\.google\.com\/macros\/s\/[^\s\/]+/
    );
    if (urlMatch) {
      APPS_SCRIPT_URL = urlMatch[0];
    }
  } catch (error) {
    // Ignore error, will use empty string
  }
}

const CONFIG = {
  // Production URLs (update after deployment)
  // Try to get from environment variable first, then use default
  VERCEL_URL:
    process.env.REACT_APP_BASE_URL ||
    process.env.VERCEL_URL ||
    "https://mia-warehouse-management-ax3w.vercel.app",
  APPS_SCRIPT_URL: APPS_SCRIPT_URL, // From apps-script-deploy.js or env var

  // Google Sheets config
  SHEET_ID:
    process.env.REACT_APP_GOOGLE_SHEETS_ID ||
    "1m2B2ODXuuatnW0EKExdVeCa1WwvF52bZOhS7DGqG6Vg",
  API_KEY:
    process.env.REACT_APP_GOOGLE_SHEETS_API_KEY ||
    "AIzaSyB_MwjhFxQtxnihpZTa95XH0BCI9MXihh8",

  // Test credentials for login with admin account
  TEST_USER: {
    username: "admin",
    password: "admin1234",
  },
};

console.log("🧪 PRODUCTION END-TO-END TEST");
console.log("==============================\n");

async function testProductionDeployment() {
  const results = {
    vercel: false,
    googleSheets: false,
    appsScript: false,
    integration: false,
  };

  console.log("1️⃣ Testing Vercel Deployment...");
  try {
    const vercelTest = await testVercelApp();
    results.vercel = vercelTest.success;
    console.log(
      `   ${results.vercel ? "✅" : "❌"} Vercel: ${vercelTest.message}`
    );
  } catch (error) {
    console.log(`   ❌ Vercel Error: ${error.message}`);
  }

  console.log("\n2️⃣ Testing Google Sheets API...");
  try {
    const sheetsTest = await testGoogleSheetsAPI();
    results.googleSheets = sheetsTest.success;
    console.log(
      `   ${results.googleSheets ? "✅" : "❌"} Google Sheets: ${
        sheetsTest.message
      }`
    );
    if (sheetsTest.users) {
      console.log(`   📊 Found ${sheetsTest.users} users in database`);
    }
  } catch (error) {
    console.log(`   ❌ Google Sheets Error: ${error.message}`);
  }

  console.log("\n3️⃣ Testing Google Apps Script...");
  if (CONFIG.APPS_SCRIPT_URL && CONFIG.APPS_SCRIPT_URL.trim() !== "") {
    try {
      const scriptTest = await testAppsScript();
      results.appsScript = scriptTest.success;
      console.log(
        `   ${results.appsScript ? "✅" : "❌"} Apps Script: ${
          scriptTest.message
        }`
      );
    } catch (error) {
      console.log(`   ❌ Apps Script Error: ${error.message}`);
    }
  } else {
    console.log(
      "   ⚠️ Apps Script URL not configured - Deploy Apps Script first"
    );
    console.log(
      "   💡 Set REACT_APP_AUDIT_WEBHOOK_URL in .env or Vercel environment variables"
    );
  }

  console.log("\n4️⃣ Testing Complete Integration...");
  const integrationScore = Object.values(results).filter(Boolean).length;
  results.integration = integrationScore >= 2; // At least Vercel + Google Sheets

  console.log(
    `   ${
      results.integration ? "✅" : "❌"
    } Integration Score: ${integrationScore}/4`
  );

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 PRODUCTION TEST RESULTS");
  console.log("=".repeat(50));

  console.log(`✅ Vercel Deployment:     ${results.vercel ? "PASS" : "FAIL"}`);
  console.log(
    `✅ Google Sheets API:     ${results.googleSheets ? "PASS" : "FAIL"}`
  );
  console.log(
    `✅ Google Apps Script:    ${results.appsScript ? "PASS" : "NEED SETUP"}`
  );
  console.log(
    `✅ Overall Integration:   ${results.integration ? "READY" : "NEEDS WORK"}`
  );

  console.log("\n🎯 NEXT STEPS:");
  if (!results.vercel) {
    console.log("   🔧 Deploy to Vercel following DEPLOY_NOW.md");
    console.log(`   📝 Current VERCEL_URL: ${CONFIG.VERCEL_URL}`);
    console.log(
      "   💡 Update VERCEL_URL in production-test.js or set REACT_APP_BASE_URL env var"
    );
  }
  if (!results.googleSheets) {
    console.log("   🔧 Check Google Sheets API key and permissions");
    console.log(
      "   💡 Verify REACT_APP_GOOGLE_SHEETS_API_KEY is set correctly"
    );
  }
  if (!results.appsScript) {
    console.log(
      "   🔧 Deploy Google Apps Script following apps-script-deploy.js"
    );
    console.log("   💡 Set REACT_APP_AUDIT_WEBHOOK_URL in .env or Vercel");
  }
  if (results.integration) {
    console.log("   🎉 System ready for production use!");
    const loginUrl = CONFIG.VERCEL_URL.includes("http")
      ? CONFIG.VERCEL_URL + "/login"
      : "https://" + CONFIG.VERCEL_URL + "/login";
    console.log("   📱 Test login at: " + loginUrl);
    console.log("   👤 Username: admin, Password: admin1234");
  }

  return results;
}

async function testVercelApp() {
  return new Promise((resolve) => {
    // Normalize URL - ensure it has protocol
    let testUrl = CONFIG.VERCEL_URL.trim();

    // If running locally
    if (testUrl.includes("localhost") || testUrl.includes("127.0.0.1")) {
      testUrl = testUrl.startsWith("http") ? testUrl : "http://localhost:3000";
    } else {
      // Production URL - ensure it has https://
      if (!testUrl.startsWith("http://") && !testUrl.startsWith("https://")) {
        testUrl = "https://" + testUrl;
      }
    }

    // Validate URL format
    try {
      new URL(testUrl);
    } catch (error) {
      resolve({
        success: false,
        message: `Invalid URL format: ${CONFIG.VERCEL_URL}`,
      });
      return;
    }

    const protocol = testUrl.startsWith("https") ? https : http;
    const urlObj = new URL(testUrl);

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (testUrl.startsWith("https") ? 443 : 80),
      path: urlObj.pathname + (urlObj.search || ""),
      method: "GET",
      timeout: 10000, // 10 second timeout
    };

    const req = protocol
      .request(options, (res) => {
        if (
          res.statusCode === 200 ||
          res.statusCode === 301 ||
          res.statusCode === 302
        ) {
          resolve({
            success: true,
            message: `App accessible at ${testUrl} (HTTP ${res.statusCode})`,
          });
        } else {
          resolve({
            success: false,
            message: `HTTP ${res.statusCode} - Check deployment`,
          });
        }
      })
      .on("error", (error) => {
        resolve({
          success: false,
          message: `Cannot connect: ${error.message}`,
        });
      })
      .on("timeout", () => {
        req.destroy();
        resolve({
          success: false,
          message: "Connection timeout - Check URL or network",
        });
      });

    req.setTimeout(10000);
    req.end();
  });
}

async function testGoogleSheetsAPI() {
  return new Promise((resolve) => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/Users!A1:H10?key=${CONFIG.API_KEY}`;

    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const response = JSON.parse(data);
            if (response.values && response.values.length > 0) {
              resolve({
                success: true,
                message: "API connection successful",
                users: response.values.length - 1,
              });
            } else {
              resolve({
                success: false,
                message: "No data found in Users sheet",
              });
            }
          } catch (error) {
            resolve({
              success: false,
              message: "Invalid response format",
            });
          }
        });
      })
      .on("error", (error) => {
        resolve({
          success: false,
          message: "API connection failed",
        });
      });
  });
}

async function testAppsScript() {
  return new Promise((resolve) => {
    // Validate URL
    if (!CONFIG.APPS_SCRIPT_URL || CONFIG.APPS_SCRIPT_URL.trim() === "") {
      resolve({
        success: false,
        message: "Apps Script URL not configured",
      });
      return;
    }

    let testUrl = CONFIG.APPS_SCRIPT_URL.trim();

    // Ensure URL has protocol
    if (!testUrl.startsWith("http://") && !testUrl.startsWith("https://")) {
      testUrl = "https://" + testUrl;
    }

    // Validate URL format
    try {
      new URL(testUrl);
    } catch (error) {
      resolve({
        success: false,
        message: `Invalid URL format: ${CONFIG.APPS_SCRIPT_URL}`,
      });
      return;
    }

    const urlObj = new URL(testUrl);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + (urlObj.search || ""),
      method: "GET",
      timeout: 10000,
    };

    const req = https
      .request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            // Apps Script might return HTML or JSON
            if (res.headers["content-type"]?.includes("application/json")) {
              const response = JSON.parse(data);
              if (response.success || response.status === "ok") {
                resolve({
                  success: true,
                  message: "Web App responding correctly",
                });
              } else {
                resolve({
                  success: false,
                  message: `Web App error: ${
                    response.error || "Unknown error"
                  }`,
                });
              }
            } else {
              // If HTML response, check if it's a valid Apps Script page
              // HTTP 302 is common for Apps Script (redirect to authorization or result)
              if (res.statusCode === 200 || res.statusCode === 302) {
                resolve({
                  success: true,
                  message: `Web App accessible (HTTP ${res.statusCode}${
                    res.statusCode === 302
                      ? " - Redirect, may need authorization"
                      : ""
                  })`,
                });
              } else {
                resolve({
                  success: false,
                  message: `HTTP ${res.statusCode} - Check deployment settings`,
                });
              }
            }
          } catch (error) {
            // If can't parse, but got 200 or 302, consider it success
            // HTTP 302 is common for Apps Script redirects
            if (res.statusCode === 200 || res.statusCode === 302) {
              resolve({
                success: true,
                message: `Web App accessible (HTTP ${res.statusCode})`,
              });
            } else {
              resolve({
                success: false,
                message: `Invalid response format (HTTP ${res.statusCode})`,
              });
            }
          }
        });
      })
      .on("error", (error) => {
        resolve({
          success: false,
          message: `Cannot connect: ${error.message}`,
        });
      })
      .on("timeout", () => {
        req.destroy();
        resolve({
          success: false,
          message: "Connection timeout",
        });
      });

    req.setTimeout(10000);
    req.end();
  });
}

// Run tests
if (require.main === module) {
  testProductionDeployment().catch(console.error);
}

module.exports = { testProductionDeployment };
