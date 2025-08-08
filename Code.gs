/**
 * 🚀 MIA WAREHOUSE MANAGEMENT - COMPLETE GOOGLE APPS SCRIPT
 *
 * Script tổng hợp bao gồm:
 * ✅ Auto setup 4 sheets với formatting chuyên nghiệp
 * ✅ Audit logging webhook để ghi logs từ React app
 * ✅ Authentication API (optional)
 * ✅ Custom menu với utilities
 *
 * CÁCH SỬ DỤNG:
 * 1. Paste toàn bộ code này vào Google Apps Script
 * 2. Chạy setupWarehouseSheets() một lần để tạo cấu trúc
 * 3. Deploy as Web App để có webhook URL
/**
 *  * 🚀 MIA WAREHOUSE MANAGEMENT - ENHANCED SYSTEM V4.0
 *  *
 *  * 📋 TÍNH NĂNG ĐÃ NÂNG CẤP:
 *  * ✅ Ghi log đăng nhập/đăng xuất chi tiết
 *  * ✅ Session management tự động
 *  * ✅ Warehouse management tối ưu
 *  * ✅ Dashboard real-time
 *  * ✅ Multi-sheet integration (9 sheets)
 *  * ✅ Performance optimization
 *  * ✅ Advanced webhook API
 *  *
 *  * 🎯 CÁCH SỬ DỤNG:
 *  * 1. Paste toàn bộ code này vào Google Apps Script
 *  * 2. Chạy setupWarehouseSystem() một lần để tạo cấu trúc
 *  * 3. Deploy as Web App để có webhook URL
 *  * 4. Sử dụng Custom Menu để quản lý
 *  *
 *  * Author: MIA Development Team
 *  * Date: 17/06/2025
 *  * Version: 4.0 - Enhanced with Login Logging & Warehouse Optimization
 *  */

// ==================== CONFIGURATION ====================
const SPREADSHEET_ID = "1m2B2ODXuuatnW0EKExdVeCa1WwvF52bZOhS7DGqG6Vg";
const SHEET_NAMES = {
  USERS: "Users",
  AUDIT_LOG: "AuditLog",
  LOGIN_LOG: "LoginLog",
  SESSIONS: "Sessions",
  INVENTORY: "Inventory",
  TRANSACTIONS: "Transactions",
  LOCATIONS: "Locations",
  DASHBOARD: "Dashboard",
  PERMISSIONS: "Permissions",
};

// ==================== WEBHOOK HANDLERS ====================
/**
 *  * 🔗 Enhanced POST request handler with multiple endpoints
 */
function doPost(e) {
  try {
    console.log("=== MIA Warehouse System V4.0 Started ===");

    const params = JSON.parse(e.postData.contents);
    const action = params.action;

    console.log(`Action received: ${action}`);

    switch (action) {
      case "user_login":
        return handleUserLogin(params);
      case "user_logout":
        return handleUserLogout(params);
      case "add_inventory":
        return handleAddInventory(params);
      case "record_transaction":
        return handleRecordTransaction(params);
      case "update_session":
        return handleUpdateSession(params);
      default:
        return handleAuditLog(params);
    }
  } catch (error) {
    console.error("Error in doPost:", error);
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
        timestamp: new Date().toISOString(),
      })
    )
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  }
}

/**
 *  * 🔐 Handle User Login - Enhanced with detailed logging
 *  */
function handleUserLogin(params) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const loginSheet = getOrCreateSheet(spreadsheet, SHEET_NAMES.LOGIN_LOG);
    const sessionsSheet = getOrCreateSheet(spreadsheet, SHEET_NAMES.SESSIONS);
    const usersSheet = getOrCreateSheet(spreadsheet, SHEET_NAMES.USERS);

    const timestamp = new Date();
    const sessionId = generateSessionId();

    // Record in LoginLog
    const loginData = [
      timestamp,
      params.username || "Unknown",
      params.email || "",
      "LOGIN",
      params.ip_address || "",
      params.user_agent || "",
      params.device_info || "",
      sessionId,
      "SUCCESS",
      "",
    ];

    loginSheet.appendRow(loginData);

    // Update or create user session
    const sessionData = [
      sessionId,
      params.username || "Unknown",
      params.email || "",
      timestamp,
      null, // logout_time
      params.ip_address || "",
      params.device_info || "",
      "ACTIVE",
      timestamp, // last_activity
    ];

    sessionsSheet.appendRow(sessionData);

    // Update user login count
    updateUserLoginCount(usersSheet, params.username, params.email);

    // Update dashboard
    updateDashboard();

    console.log(`User login recorded: ${params.username}`);

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Login logged successfully",
        sessionId: sessionId,
        timestamp: timestamp.toISOString(),
      })
    )
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  } catch (error) {
    console.error("Error in handleUserLogin:", error);
    return createErrorResponse(error);
  }
}

/**
 *  * 🚪 Handle User Logout - Enhanced with session cleanup
 */
function handleUserLogout(params) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const loginSheet = getOrCreateSheet(spreadsheet, SHEET_NAMES.LOGIN_LOG);
    const sessionsSheet = getOrCreateSheet(spreadsheet, SHEET_NAMES.SESSIONS);

    const timestamp = new Date();

    // Record in LoginLog
    const logoutData = [
      timestamp,
      params.username || "Unknown",
      params.email || "",
      "LOGOUT",
      params.ip_address || "",
      params.user_agent || "",
      params.device_info || "",
      params.sessionId || "",
      "SUCCESS",
      params.duration || "",
    ];

    loginSheet.appendRow(logoutData);

    // Update session
    if (params.sessionId) {
      updateSessionLogout(sessionsSheet, params.sessionId, timestamp);
    }

    // Update dashboard
    updateDashboard();

    console.log(`User logout recorded: ${params.username}`);

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Logout logged successfully",
        timestamp: timestamp.toISOString(),
      })
    )
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  } catch (error) {
    console.error("Error in handleUserLogout:", error);
    return createErrorResponse(error);
  }
}

/**
 *  * 📦 Handle Add Inventory - Enhanced warehouse management
 *  */
function handleAddInventory(params) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const inventorySheet = getOrCreateSheet(spreadsheet, SHEET_NAMES.INVENTORY);
    const transactionsSheet = getOrCreateSheet(
      spreadsheet,
      SHEET_NAMES.TRANSACTIONS
    );

    const timestamp = new Date();

    // Add to inventory
    const inventoryData = [
      params.item_code || generateItemCode(),
      params.item_name || "",
      params.description || "",
      params.category || "",
      params.location || "",
      params.quantity || 0,
      params.unit_price || 0,
      params.supplier || "",
      timestamp,
      params.username || "",
      params.min_stock || 10,
      "ACTIVE",
      params.barcode || "",
    ];

    inventorySheet.appendRow(inventoryData);

    // Record transaction
    const transactionData = [
      generateTransactionId(),
      timestamp,
      "STOCK_IN",
      params.item_code || "",
      params.item_name || "",
      params.quantity || 0,
      params.unit_price || 0,
      (params.quantity || 0) * (params.unit_price || 0),
      params.location || "",
      params.username || "",
      "APPROVED",
      params.notes || "Initial stock entry",
      timestamp,
    ];

    transactionsSheet.appendRow(transactionData);

    // Update dashboard
    updateDashboard();

    console.log(`Inventory added: ${params.item_name}`);

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Inventory added successfully",
        item_code: params.item_code || generateItemCode(),
        timestamp: timestamp.toISOString(),
      })
    )
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  } catch (error) {
    console.error("Error in handleAddInventory:", error);
    return createErrorResponse(error);
  }
}

/**
 *  * 📊 Handle Record Transaction - Enhanced transaction logging
 */
function handleRecordTransaction(params) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const transactionsSheet = getOrCreateSheet(
      spreadsheet,
      SHEET_NAMES.TRANSACTIONS
    );
    const inventorySheet = getOrCreateSheet(spreadsheet, SHEET_NAMES.INVENTORY);

    const timestamp = new Date();

    // Record transaction
    const transactionData = [
      generateTransactionId(),
      timestamp,
      params.type || "STOCK_OUT",
      params.item_code || "",
      params.item_name || "",
      params.quantity || 0,
      params.unit_price || 0,
      (params.quantity || 0) * (params.unit_price || 0),
      params.location || "",
      params.username || "",
      params.status || "PENDING",
      params.notes || "",
      timestamp,
    ];

    transactionsSheet.appendRow(transactionData);

    // Update inventory quantity if approved
    if (params.status === "APPROVED") {
      updateInventoryQuantity(
        inventorySheet,
        params.item_code,
        params.quantity,
        params.type
      );
    }

    // Update dashboard
    updateDashboard();

    console.log(`Transaction recorded: ${params.type} - ${params.item_name}`);

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Transaction recorded successfully",
        transaction_id: generateTransactionId(),
        timestamp: timestamp.toISOString(),
      })
    )
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  } catch (error) {
    console.error("Error in handleRecordTransaction:", error);
    return createErrorResponse(error);
  }
}

/**
 *  * 🔄 Handle Update Session - Keep sessions alive
 *  */
function handleUpdateSession(params) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sessionsSheet = getOrCreateSheet(spreadsheet, SHEET_NAMES.SESSIONS);

    const timestamp = new Date();

    // Find and update session
    const data = sessionsSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === params.sessionId) {
        sessionsSheet.getRange(i + 1, 9).setValue(timestamp); // last_activity
        break;
      }
    }

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Session updated successfully",
        timestamp: timestamp.toISOString(),
      })
    )
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  } catch (error) {
    console.error("Error in handleUpdateSession:", error);
    return createErrorResponse(error);
  }
}

/**
 *  * 📝 Handle Audit Log - Enhanced general logging
 */
function handleAuditLog(params) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const auditSheet = getOrCreateSheet(spreadsheet, SHEET_NAMES.AUDIT_LOG);

    const timestamp = new Date();

    const auditData = [
      timestamp,
      params.username || "System",
      params.action || "Unknown",
      params.resource || "",
      params.details || "",
      params.ip_address || "",
      params.user_agent || "",
      params.success || true,
      params.error_message || "",
    ];

    auditSheet.appendRow(auditData);

    console.log(`Audit logged: ${params.action} by ${params.username}`);

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Audit logged successfully",
        timestamp: timestamp.toISOString(),
      })
    )
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  } catch (error) {
    console.error("Error in handleAuditLog:", error);
    return createErrorResponse(error);
  }
}

// ==================== HELPER FUNCTIONS ====================

/**
 *  * 🛠️ Get or create sheet
 *  */
function getOrCreateSheet(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    setupSheetHeaders(sheet, sheetName);
  }
  return sheet;
}

/**
 *  * 📋 Setup sheet headers based on sheet type
 */
function setupSheetHeaders(sheet, sheetName) {
  let headers = [];

  switch (sheetName) {
    case SHEET_NAMES.USERS:
      headers = [
        "User ID",
        "Username",
        "Email",
        "Full Name",
        "Role",
        "Department",
        "Created Date",
        "Last Login",
        "Login Count",
        "Status",
      ];
      break;
    case SHEET_NAMES.AUDIT_LOG:
      headers = [
        "Timestamp",
        "Username",
        "Action",
        "Resource",
        "Details",
        "IP Address",
        "User Agent",
        "Success",
        "Error Message",
      ];
      break;
    case SHEET_NAMES.LOGIN_LOG:
      headers = [
        "Timestamp",
        "Username",
        "Email",
        "Action",
        "IP Address",
        "User Agent",
        "Device Info",
        "Session ID",
        "Status",
        "Duration",
      ];
      break;
    case SHEET_NAMES.SESSIONS:
      headers = [
        "Session ID",
        "Username",
        "Email",
        "Login Time",
        "Logout Time",
        "IP Address",
        "Device Info",
        "Status",
        "Last Activity",
      ];
      break;
    case SHEET_NAMES.INVENTORY:
      headers = [
        "Item Code",
        "Item Name",
        "Description",
        "Category",
        "Location",
        "Quantity",
        "Unit Price",
        "Supplier",
        "Created Date",
        "Created By",
        "Min Stock",
        "Status",
        "Barcode",
      ];
      break;
    case SHEET_NAMES.TRANSACTIONS:
      headers = [
        "Transaction ID",
        "Timestamp",
        "Type",
        "Item Code",
        "Item Name",
        "Quantity",
        "Unit Price",
        "Total Cost",
        "Location",
        "User",
        "Status",
        "Notes",
        "Approved Date",
      ];
      break;
    case SHEET_NAMES.LOCATIONS:
      headers = [
        "Location Code",
        "Location Name",
        "Description",
        "Type",
        "Capacity",
        "Current Usage",
        "Manager",
        "Created Date",
        "Status",
      ];
      break;
    case SHEET_NAMES.DASHBOARD:
      headers = ["Metric", "Value", "Last Updated", "Description"];
      break;
    case SHEET_NAMES.PERMISSIONS:
      headers = [
        "User ID",
        "Username",
        "Role",
        "Permissions",
        "Granted By",
        "Granted Date",
        "Expiry Date",
        "Status",
      ];
      break;
  }

  if (headers.length > 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sheet.getRange(1, 1, 1, headers.length).setBackground("#4285f4");
    sheet.getRange(1, 1, 1, headers.length).setFontColor("white");
    sheet.setFrozenRows(1);
  }
}

/**
 *  * 🔑 Generate unique session ID
 *  */
function generateSessionId() {
  return "SES_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
}

/**
 *  * 📦 Generate unique item code
 */
function generateItemCode() {
  return "ITM_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
}

/**
 *  * 🏷️ Generate unique transaction ID
 *  */
function generateTransactionId() {
  return "TXN_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
}

/**
 *  * 👤 Update user login count
 */
function updateUserLoginCount(usersSheet, username, email) {
  const data = usersSheet.getDataRange().getValues();
  let userFound = false;

  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === username || data[i][2] === email) {
      const currentCount = data[i][8] || 0;
      usersSheet.getRange(i + 1, 8).setValue(new Date()); // Last Login
      usersSheet.getRange(i + 1, 9).setValue(currentCount + 1); // Login Count
      userFound = true;
      break;
    }
  }

  if (!userFound) {
    // Add new user
    const newUserData = [
      "USR_" + Date.now(),
      username,
      email,
      "",
      "USER",
      "",
      new Date(),
      new Date(),
      1,
      "ACTIVE",
    ];
    usersSheet.appendRow(newUserData);
  }
}

/**
 *  * 🚪 Update session logout
 *  */
function updateSessionLogout(sessionsSheet, sessionId, logoutTime) {
  const data = sessionsSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === sessionId) {
      sessionsSheet.getRange(i + 1, 5).setValue(logoutTime); // logout_time
      sessionsSheet.getRange(i + 1, 8).setValue("CLOSED"); // status
      break;
    }
  }
}

/**
 *  * 📦 Update inventory quantity
 */
function updateInventoryQuantity(inventorySheet, itemCode, quantity, type) {
  const data = inventorySheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === itemCode) {
      const currentQuantity = data[i][5] || 0;
      let newQuantity = currentQuantity;

      switch (type) {
        case "STOCK_IN":
          newQuantity = currentQuantity + quantity;
          break;
        case "STOCK_OUT":
          newQuantity = currentQuantity - quantity;
          break;
        case "ADJUSTMENT":
          newQuantity = quantity;
          break;
      }

      inventorySheet.getRange(i + 1, 6).setValue(newQuantity);
      break;
    }
  }
}

/**
 *  * 📊 Update dashboard with real-time metrics
 *  */
function updateDashboard() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const dashboardSheet = getOrCreateSheet(spreadsheet, SHEET_NAMES.DASHBOARD);

    // Clear existing data except headers
    if (dashboardSheet.getLastRow() > 1) {
      dashboardSheet
        .getRange(2, 1, dashboardSheet.getLastRow() - 1, 4)
        .clearContent();
    }

    const timestamp = new Date();

    // Calculate metrics
    const totalUsers = getTotalUsers();
    const activeUsers = getActiveUsers();
    const totalInventoryItems = getTotalInventoryItems();
    const lowStockItems = getLowStockItems();
    const todayTransactions = getTodayTransactions();

    // Update dashboard data
    const dashboardData = [
      [
        "Total Users",
        totalUsers,
        timestamp,
        "Total registered users in the system",
      ],
      [
        "Active Users",
        activeUsers,
        timestamp,
        "Currently active user sessions",
      ],
      [
        "Total Inventory Items",
        totalInventoryItems,
        timestamp,
        "Total items in inventory",
      ],
      [
        "Low Stock Items",
        lowStockItems,
        timestamp,
        "Items below minimum stock level",
      ],
      [
        "Today Transactions",
        todayTransactions,
        timestamp,
        "Transactions processed today",
      ],
      [
        "System Status",
        "ONLINE",
        timestamp,
        "Current system operational status",
      ],
      ["Last Update", timestamp, timestamp, "Last dashboard update time"],
    ];

    if (dashboardData.length > 0) {
      dashboardSheet
        .getRange(2, 1, dashboardData.length, 4)
        .setValues(dashboardData);
    }

    console.log("Dashboard updated successfully");
  } catch (error) {
    console.error("Error updating dashboard:", error);
  }
}

/**
 *  * 👥 Get total users count
 */
function getTotalUsers() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const usersSheet = spreadsheet.getSheetByName(SHEET_NAMES.USERS);
    return usersSheet ? usersSheet.getLastRow() - 1 : 0;
  } catch (error) {
    return 0;
  }
}

/**
 *  * 🟢 Get active users count
 *  */
function getActiveUsers() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sessionsSheet = spreadsheet.getSheetByName(SHEET_NAMES.SESSIONS);
    if (!sessionsSheet) return 0;

    const data = sessionsSheet.getDataRange().getValues();
    let activeCount = 0;

    for (let i = 1; i < data.length; i++) {
      if (data[i][7] === "ACTIVE") {
        activeCount++;
      }
    }

    return activeCount;
  } catch (error) {
    return 0;
  }
}

/**
 *  * 📦 Get total inventory items
 */
function getTotalInventoryItems() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const inventorySheet = spreadsheet.getSheetByName(SHEET_NAMES.INVENTORY);
    return inventorySheet ? inventorySheet.getLastRow() - 1 : 0;
  } catch (error) {
    return 0;
  }
}

/**
 *  * ⚠️ Get low stock items count
 *  */
function getLowStockItems() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const inventorySheet = spreadsheet.getSheetByName(SHEET_NAMES.INVENTORY);
    if (!inventorySheet) return 0;

    const data = inventorySheet.getDataRange().getValues();
    let lowStockCount = 0;

    for (let i = 1; i < data.length; i++) {
      const currentQuantity = data[i][5] || 0;
      const minStock = data[i][10] || 10;
      if (currentQuantity <= minStock) {
        lowStockCount++;
      }
    }

    return lowStockCount;
  } catch (error) {
    return 0;
  }
}

/**
 *  * 📈 Get today's transactions count
 */
function getTodayTransactions() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const transactionsSheet = spreadsheet.getSheetByName(
      SHEET_NAMES.TRANSACTIONS
    );
    if (!transactionsSheet) return 0;

    const data = transactionsSheet.getDataRange().getValues();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let todayCount = 0;

    for (let i = 1; i < data.length; i++) {
      const transactionDate = new Date(data[i][1]);
      transactionDate.setHours(0, 0, 0, 0);
      if (transactionDate.getTime() === today.getTime()) {
        todayCount++;
      }
    }

    return todayCount;
  } catch (error) {
    return 0;
  }
}

/**
 *  * ❌ Create error response
 *  */
function createErrorResponse(error) {
  return ContentService.createTextOutput(
    JSON.stringify({
      success: false,
      error: error.toString(),
      timestamp: new Date().toISOString(),
    })
  )
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
}

// ==================== SETUP FUNCTIONS ====================

/**
 *  * 🚀 Setup complete warehouse system - Run this once!
 */
function setupWarehouseSystem() {
  try {
    console.log("=== Setting up MIA Warehouse System V4.0 ===");

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);

    // Create all required sheets
    Object.values(SHEET_NAMES).forEach((sheetName) => {
      getOrCreateSheet(spreadsheet, sheetName);
    });

    // Setup conditional formatting and data validation
    setupConditionalFormatting(spreadsheet);
    setupDataValidation(spreadsheet);

    // Initialize dashboard
    updateDashboard();

    // Create custom menu
    setupCustomMenu();

    console.log("✅ MIA Warehouse System V4.0 setup completed successfully!");

    // Show success message
    SpreadsheetApp.getUi().alert(
      "Setup Complete!",
      "🎉 MIA Warehouse System V4.0 đã được thiết lập thành công!\n\n" +
        "✅ 9 sheets đã được tạo\n" +
        "✅ Headers và formatting đã áp dụng\n" +
        "✅ Dashboard đã được khởi tạo\n" +
        "✅ Custom menu đã sẵn sàng\n\n" +
        "Hệ thống sẵn sàng sử dụng!",
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } catch (error) {
    console.error("Error in setupWarehouseSystem:", error);
    SpreadsheetApp.getUi().alert(
      "Setup Error",
      "Có lỗi xảy ra trong quá trình setup: " + error.toString(),
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

/**
 *  * 🎨 Setup conditional formatting
 *  */
function setupConditionalFormatting(spreadsheet) {
  try {
    // Inventory low stock alerts
    const inventorySheet = spreadsheet.getSheetByName(SHEET_NAMES.INVENTORY);
    if (inventorySheet) {
      const range = inventorySheet.getRange("F:F"); // Quantity column
      const rule = SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied("=F2<=K2") // When quantity <= min stock
        .setBackground("#ffebee")
        .setFontColor("#d32f2f")
        .setRanges([range])
        .build();

      inventorySheet.setConditionalFormatRules([rule]);
    }

    // Sessions status formatting
    const sessionsSheet = spreadsheet.getSheetByName(SHEET_NAMES.SESSIONS);
    if (sessionsSheet) {
      const range = sessionsSheet.getRange("H:H"); // Status column
      const activeRule = SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo("ACTIVE")
        .setBackground("#e8f5e8")
        .setFontColor("#2e7d32")
        .setRanges([range])
        .build();

      const closedRule = SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo("CLOSED")
        .setBackground("#ffebee")
        .setFontColor("#d32f2f")
        .setRanges([range])
        .build();

      sessionsSheet.setConditionalFormatRules([activeRule, closedRule]);
    }
  } catch (error) {
    console.error("Error setting up conditional formatting:", error);
  }
}

/**
 *  * ✅ Setup data validation
 */
function setupDataValidation(spreadsheet) {
  try {
    // Transaction types validation
    const transactionsSheet = spreadsheet.getSheetByName(
      SHEET_NAMES.TRANSACTIONS
    );
    if (transactionsSheet) {
      const typeRange = transactionsSheet.getRange("C:C");
      const typeValidation = SpreadsheetApp.newDataValidation()
        .requireValueInList(["STOCK_IN", "STOCK_OUT", "TRANSFER", "ADJUSTMENT"])
        .setAllowInvalid(false)
        .build();
      typeRange.setDataValidation(typeValidation);

      const statusRange = transactionsSheet.getRange("K:K");
      const statusValidation = SpreadsheetApp.newDataValidation()
        .requireValueInList(["PENDING", "APPROVED", "REJECTED", "CANCELLED"])
        .setAllowInvalid(false)
        .build();
      statusRange.setDataValidation(statusValidation);
    }

    // User roles validation
    const usersSheet = spreadsheet.getSheetByName(SHEET_NAMES.USERS);
    if (usersSheet) {
      const roleRange = usersSheet.getRange("E:E");
      const roleValidation = SpreadsheetApp.newDataValidation()
        .requireValueInList(["ADMIN", "MANAGER", "USER", "VIEWER"])
        .setAllowInvalid(false)
        .build();
      roleRange.setDataValidation(roleValidation);
    }
  } catch (error) {
    console.error("Error setting up data validation:", error);
  }
}

// ==================== CUSTOM MENU ====================

/**
 *  * 🍽️ Setup custom menu
 *  */
function setupCustomMenu() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu("🏭 MIA Warehouse System")
      .addItem("🚀 Setup System", "setupWarehouseSystem")
      .addSeparator()
      .addItem("📊 Update Dashboard", "updateDashboard")
      .addItem("🧹 Cleanup Old Sessions", "cleanupOldSessions")
      .addSeparator()
      .addItem("📋 View Login Logs", "showLoginLogs")
      .addItem("👥 View Active Users", "showActiveUsers")
      .addItem("📦 Inventory Report", "generateInventoryReport")
      .addSeparator()
      .addItem("ℹ️ System Info", "showSystemInfo")
      .addToUi();
  } catch (error) {
    console.error("Error setting up custom menu:", error);
  }
}

/**
 *  * 🧹 Cleanup old sessions (auto-run)
 */
function cleanupOldSessions() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sessionsSheet = spreadsheet.getSheetByName(SHEET_NAMES.SESSIONS);
    if (!sessionsSheet) return;

    const data = sessionsSheet.getDataRange().getValues();
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    let cleaned = 0;

    // Mark inactive sessions
    for (let i = 1; i < data.length; i++) {
      const lastActivity = new Date(data[i][8]);
      if (lastActivity < cutoffTime && data[i][7] === "ACTIVE") {
        sessionsSheet.getRange(i + 1, 8).setValue("EXPIRED");
        cleaned++;
      }
    }

    console.log(`Cleaned up ${cleaned} expired sessions`);
    SpreadsheetApp.getUi().alert(
      "Cleanup Complete",
      `Đã dọn dẹp ${cleaned} phiên hết hạn.`,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } catch (error) {
    console.error("Error cleaning up sessions:", error);
  }
}

/**
 *  * 📋 Show login logs summary
 *  */
function showLoginLogs() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const loginSheet = spreadsheet.getSheetByName(SHEET_NAMES.LOGIN_LOG);
    if (!loginSheet) {
      SpreadsheetApp.getUi().alert("Không tìm thấy dữ liệu Login Log");
      return;
    }

    const data = loginSheet.getDataRange().getValues();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let todayLogins = 0;
    let todayLogouts = 0;

    for (let i = 1; i < data.length; i++) {
      const logDate = new Date(data[i][0]);
      logDate.setHours(0, 0, 0, 0);

      if (logDate.getTime() === today.getTime()) {
        if (data[i][3] === "LOGIN") todayLogins++;
        if (data[i][3] === "LOGOUT") todayLogouts++;
      }
    }

    SpreadsheetApp.getUi().alert(
      "Login Logs Summary",
      `📅 Hôm nay (${today.toLocaleDateString()}):\n\n` +
        `🟢 Đăng nhập: ${todayLogins}\n` +
        `🔴 Đăng xuất: ${todayLogouts}\n` +
        `📊 Tổng log entries: ${data.length - 1}`,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } catch (error) {
    console.error("Error showing login logs:", error);
  }
}

/**
 *  * 👥 Show active users
 */
function showActiveUsers() {
  try {
    const activeUsersCount = getActiveUsers();
    const totalUsersCount = getTotalUsers();

    SpreadsheetApp.getUi().alert(
      "Active Users",
      `👥 Người dùng hiện tại:\n\n` +
        `🟢 Đang hoạt động: ${activeUsersCount}\n` +
        `📊 Tổng người dùng: ${totalUsersCount}\n` +
        `📈 Tỷ lệ hoạt động: ${totalUsersCount > 0 ? Math.round((activeUsersCount / totalUsersCount) * 100) : 0}%`,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } catch (error) {
    console.error("Error showing active users:", error);
  }
}

/**
 *  * 📦 Generate inventory report
 *  */
function generateInventoryReport() {
  try {
    const totalItems = getTotalInventoryItems();
    const lowStockItems = getLowStockItems();

    SpreadsheetApp.getUi().alert(
      "Inventory Report",
      `📦 Báo cáo kho hàng:\n\n` +
        `📊 Tổng sản phẩm: ${totalItems}\n` +
        `⚠️ Sắp hết hàng: ${lowStockItems}\n` +
        `📈 Tình trạng: ${lowStockItems > 0 ? "Cần bổ sung hàng" : "Ổn định"}\n` +
        `🎯 Cảnh báo: ${lowStockItems > 5 ? "CAO" : lowStockItems > 0 ? "THẤP" : "KHÔNG"}`,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } catch (error) {
    console.error("Error generating inventory report:", error);
  }
}

/**
 *  * ℹ️ Show system information
 */
function showSystemInfo() {
  try {
    SpreadsheetApp.getUi().alert(
      "System Information",
      `🏭 MIA WAREHOUSE MANAGEMENT SYSTEM\n\n` +
        `📌 Version: 4.0 - Enhanced\n` +
        `📅 Date: 17/06/2025\n` +
        `👨‍💻 Developer: MIA Development Team\n` +
        `🔧 Features: Login Logging + Warehouse Optimization\n\n` +
        `📊 Sheets: ${Object.keys(SHEET_NAMES).length}\n` +
        `🔗 Webhook: Active\n` +
        `📱 Mobile: Ready\n` +
        `🛡️ Security: Enhanced`,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } catch (error) {
    console.error("Error showing system info:", error);
  }
}

// ==================== AUTO TRIGGERS ====================

/**
 *  * 🤖 Auto update dashboard every hour
 *  */
function createAutoUpdateTrigger() {
  try {
    // Delete existing triggers
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach((trigger) => {
      if (trigger.getHandlerFunction() === "updateDashboard") {
        ScriptApp.deleteTrigger(trigger);
      }
    });

    // Create new hourly trigger
    ScriptApp.newTrigger("updateDashboard").timeBased().everyHours(1).create();

    console.log("Auto update trigger created successfully");
  } catch (error) {
    console.error("Error creating auto update trigger:", error);
  }
}

/**
 *  * 🌙 Daily cleanup old sessions
 */
function createCleanupTrigger() {
  try {
    // Delete existing triggers
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach((trigger) => {
      if (trigger.getHandlerFunction() === "cleanupOldSessions") {
        ScriptApp.deleteTrigger(trigger);
      }
    });

    // Create new daily trigger at 2 AM
    ScriptApp.newTrigger("cleanupOldSessions")
      .timeBased()
      .everyDays(1)
      .atHour(2)
      .create();

    console.log("Cleanup trigger created successfully");
  } catch (error) {
    console.error("Error creating cleanup trigger:", error);
  }
}

// ==================== INITIALIZATION ====================

/**
 *  * 🎬 onOpen event - Setup menu when spreadsheet opens
 *  */
function onOpen() {
  setupCustomMenu();
}

/**
 *  * 📧 onEdit event - Log changes
 */
function onEdit(e) {
  try {
    const sheet = e.source.getActiveSheet();
    const range = e.range;
    const user = Session.getActiveUser().getEmail();

    // Log edit to audit
    const auditData = {
      username: user,
      action: "EDIT_CELL",
      resource: `${sheet.getName()}!${range.getA1Notation()}`,
      details: `Changed value from "${e.oldValue || ""}" to "${e.value || ""}"`,
      ip_address: "",
      user_agent: "",

      success: true,
      error_message: "",
    };

    handleAuditLog(auditData);
  } catch (error) {
    console.error("Error in onEdit:", error);
  }
}

// ==================== END OF SCRIPT ====================

/**
                                                         *  * 🎯 HƯỚNG DẪN SỬ DỤNG:
                                                         *  *
                                                         *  * 1. SETUP BAN ĐẦU:
                                                         *  *    - Chạy function setupWarehouseSystem() một lần
                                                         *  *    - Deploy as Web App để có webhook URL
                                                         *  *
                                                         *  * 2. WEBHOOK ENDPOINTS:
                                                         *  *    - POST /user_login - Ghi log đăng nhập
                                                         *  *    - POST /user_logout - Ghi log đăng xuất
                                                         *  *    - POST /add_inventory - Thêm sản phẩm
                                                         *  *    - POST /record_transaction - Ghi giao dịch
                                                         *  *    - POST /update_session - Cập nhật phiên
                                                         *  *
                                                         *  * 3. CUSTOM MENU:
                                                         *  *    - Sử dụng menu "🏭 MIA
Page UpCtrl+Home                                                         *  * 4. DASHBOARD:
                                                         *  *    - Hiển thị metrics real-time
                                                         *  *
                                                         *  * 5. MIGRATION:
                                                         *  *    - Dữ liệu cũ được giữ nguyên
                                                         *  *    - Các sheet mới được thêm tự động
                                                         *  */

// =====================================
// 🚀 WAREHOUSE OPTIMIZATION FUNCTIONS - V4.1
// =====================================

/**
 *  * 📈 ENHANCED LOGIN FUNCTION WITH WAREHOUSE OPTIMIZATION
 *  * Tối ưu hóa function ghi log đăng nhập với performance tracking
 *  */
function logUserLoginOptimized(userData) {
  try {
    const startTime = new Date().getTime();
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    // Batch operations để tăng hiệu suất
    const sheets = {
      auditLog: ss.getSheetByName("AUDITLOG"),
      sessions: ss.getSheetByName("SESSIONS"),
      users: ss.getSheetByName("USERS"),
    };

    // Validate input data
    if (!userData || !userData.username) {
      throw new Error("Invalid user data provided");
    }

    // Enhanced session management
    const sessionId = generateSecureSessionId();
    const currentTime = new Date();
    const expiryTime = new Date(currentTime.getTime() + 8 * 60 * 60 * 1000); // 8 hours

    // Parallel data preparation
    const logData = [
      currentTime,
      "LOGIN",
      userData.username,
      `User logged in from IP: ${userData.ip || "Unknown"} | Device: ${userData.device || "Unknown"} | Location: ${userData.location || "Unknown"}`,
      "SUCCESS",
      userData.ip || "Unknown",
      userData.userAgent || "Unknown",
      `Performance: ${new Date().getTime() - startTime}ms`,
    ];

    const sessionData = [
      sessionId,
      userData.username,
      userData.fullName || userData.username,
      currentTime,
      expiryTime,
      "ACTIVE",
      userData.ip || "Unknown",
      userData.department || "Warehouse",
    ];

    // Batch write operations
    sheets.auditLog.appendRow(logData);
    sheets.sessions.appendRow(sessionData);

    // Update user last login
    updateUserLastLogin(sheets.users, userData.username, currentTime);

    // Clean expired sessions
    cleanExpiredSessions();

    const processingTime = new Date().getTime() - startTime;
    console.log(
      `✅ Login logged successfully in ${processingTime}ms for user: ${userData.username}`
    );

    return {
      success: true,
      sessionId: sessionId,
      processingTime: processingTime,
      message: "Login logged successfully",
    };
  } catch (error) {
    console.error("❌ Error in logUserLoginOptimized:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to log login",
    };
  }
}

/**
 *  * 📤 ENHANCED LOGOUT FUNCTION WITH SESSION CLEANUP
 * Tối ưu hóa function ghi log đăng xuất với session management
 *  */
function logUserLogoutOptimized(userData) {
  try {
    const startTime = new Date().getTime();
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    const sheets = {
      auditLog: ss.getSheetByName("AUDITLOG"),
      sessions: ss.getSheetByName("SESSIONS"),
    };

    // Validate input
    if (!userData || !userData.username) {
      throw new Error("Invalid user data provided");
    }

    const currentTime = new Date();

    // Calculate session duration
    const sessionDuration = calculateSessionDuration(userData.sessionId);

    // Enhanced logout logging
    const logData = [
      currentTime,
      "LOGOUT",
      userData.username,
      `User logged out | Session Duration: ${sessionDuration} | IP: ${userData.ip || "Unknown"} | Reason: ${userData.reason || "Normal logout"}`,
      "SUCCESS",
      userData.ip || "Unknown",
      userData.userAgent || "Unknown",
      `Performance: ${new Date().getTime() - startTime}ms`,
    ];

    // Update session status
    updateSessionStatus(sheets.sessions, userData.sessionId, "EXPIRED");

    // Log the logout
    sheets.auditLog.appendRow(logData);

    const processingTime = new Date().getTime() - startTime;
    console.log(
      `✅ Logout logged successfully in ${processingTime}ms for user: ${userData.username}`
    );

    return {
      success: true,
      sessionDuration: sessionDuration,
      processingTime: processingTime,
      message: "Logout logged successfully",
    };
  } catch (error) {
    console.error("❌ Error in logUserLogoutOptimized:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to log logout",
    };
  }
}

/**
 *  * 🔐 SECURE SESSION ID GENERATOR
 * Generate secure session ID với warehouse prefix
 *  */
function generateSecureSessionId() {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2);
  const warehousePrefix = "WH";
  return `${warehousePrefix}_${timestamp}_${random}`;
}

/**
 *  * ⏰ SESSION DURATION CALCULATOR
 * Tính toán thời gian session
 *  */
function calculateSessionDuration(sessionId) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sessionsSheet = ss.getSheetByName("SESSIONS");
    const data = sessionsSheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === sessionId) {
        const startTime = new Date(data[i][3]);
        const endTime = new Date();
        const duration = Math.floor((endTime - startTime) / 1000 / 60); // minutes
        return `${duration} minutes`;
      }
    }
    return "Unknown";
  } catch (error) {
    console.error("Error calculating session duration:", error);
    return "Error calculating duration";
  }
}

/**
 *  * 🧹 EXPIRED SESSIONS CLEANUP
 * Tự động dọn dẹp sessions hết hạn
 *  */
function cleanExpiredSessions() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sessionsSheet = ss.getSheetByName("SESSIONS");
    const data = sessionsSheet.getDataRange().getValues();
    const currentTime = new Date();

    let cleanedCount = 0;

    // Check from bottom to top để tránh index shifting
    for (let i = data.length - 1; i >= 1; i--) {
      const expiryTime = new Date(data[i][4]);
      if (currentTime > expiryTime && data[i][5] === "ACTIVE") {
        // Update status instead of deleting
        sessionsSheet.getRange(i + 1, 6).setValue("EXPIRED");
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned ${cleanedCount} expired sessions`);
    }

    return cleanedCount;
  } catch (error) {
    console.error("Error cleaning expired sessions:", error);
    return 0;
  }
}

/**
 *  * 👤 UPDATE USER LAST LOGIN
 * Cập nhật thời gian đăng nhập cuối cùng
 *  */
function updateUserLastLogin(usersSheet, username, loginTime) {
  try {
    const data = usersSheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === username) {
        // Username column
        // Add last login column if not exists
        const lastCol = usersSheet.getLastColumn();
        if (lastCol < 10) {
          usersSheet.getRange(1, 10).setValue("Last Login");
        }
        usersSheet.getRange(i + 1, 10).setValue(loginTime);
        break;
      }
    }
  } catch (error) {
    console.error("Error updating user last login:", error);
  }
}

/**
 *  * 📊 UPDATE SESSION STATUS
 * Cập nhật trạng thái session
 *  */
function updateSessionStatus(sessionsSheet, sessionId, status) {
  try {
    const data = sessionsSheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === sessionId) {
        sessionsSheet.getRange(i + 1, 6).setValue(status);
        if (status === "EXPIRED") {
          sessionsSheet.getRange(i + 1, 5).setValue(new Date()); // Update expiry time
        }
        break;
      }
    }
  } catch (error) {
    console.error("Error updating session status:", error);
  }
}

/**
 *  * 📈 WAREHOUSE PERFORMANCE MONITOR
 * Monitor hiệu suất các operations
 *  */
function logWarehousePerformance(operation, duration, details) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let perfSheet = ss.getSheetByName("PERFORMANCE");

    // Create performance sheet if not exists
    if (!perfSheet) {
      perfSheet = ss.insertSheet("PERFORMANCE");
      perfSheet
        .getRange("A1:H1")
        .setValues([
          [
            "Timestamp",
            "Operation",
            "Duration (ms)",
            "Status",
            "Details",
            "User",
            "Memory Used",
            "CPU Usage",
          ],
        ]);
      perfSheet
        .getRange("A1:H1")
        .setBackground("#4CAF50")
        .setFontColor("white")
        .setFontWeight("bold");
    }

    const perfData = [
      new Date(),
      operation,
      duration,
      duration < 1000 ? "GOOD" : duration < 3000 ? "MODERATE" : "SLOW",
      details || "",
      Session.getActiveUser().getEmail(),
      `${DriveApp.getStorageUsed() / 1024 / 1024} MB`,
      "N/A", // CPU usage not available in Apps Script
    ];

    perfSheet.appendRow(perfData);

    // Keep only last 1000 records
    if (perfSheet.getLastRow() > 1001) {
      perfSheet.deleteRows(2, perfSheet.getLastRow() - 1001);
    }
  } catch (error) {
    console.error("Error logging performance:", error);
  }
}

/**
 *  * 🚨 WAREHOUSE ALERT SYSTEM
 * Hệ thống cảnh báo cho warehouse
 *  */
function createWarehouseAlert(type, message, severity = "INFO") {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let alertSheet = ss.getSheetByName("ALERTS");

    // Create alerts sheet if not exists
    if (!alertSheet) {
      alertSheet = ss.insertSheet("ALERTS");
      alertSheet
        .getRange("A1:G1")
        .setValues([
          [
            "Timestamp",
            "Type",
            "Severity",
            "Message",
            "Status",
            "Acknowledged By",
            "Resolved At",
          ],
        ]);
      alertSheet
        .getRange("A1:G1")
        .setBackground("#FF9800")
        .setFontColor("white")
        .setFontWeight("bold");
    }

    const alertData = [new Date(), type, severity, message, "ACTIVE", "", ""];

    alertSheet.appendRow(alertData);

    // Color coding based on severity
    const lastRow = alertSheet.getLastRow();
    const severityCell = alertSheet.getRange(lastRow, 3);

    switch (severity) {
      case "CRITICAL":
        severityCell.setBackground("#F44336").setFontColor("white");
        break;
      case "WARNING":
        severityCell.setBackground("#FF9800").setFontColor("white");
        break;
      case "INFO":
        severityCell.setBackground("#2196F3").setFontColor("white");
        break;
    }

    console.log(`🚨 ${severity} Alert created: ${message}`);
  } catch (error) {
    console.error("Error creating warehouse alert:", error);
  }
}

/**
 *  * 📊 ENHANCED DASHBOARD UPDATE WITH CACHING
 * Cập nhật dashboard với caching để tăng hiệu suất
 *  */
function updateDashboardOptimized() {
  try {
    const startTime = new Date().getTime();
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    // Use PropertiesService for caching
    const cache = PropertiesService.getScriptProperties();
    const lastUpdate = cache.getProperty("LAST_DASHBOARD_UPDATE");
    const currentTime = new Date().getTime();

    // Update only if 5 minutes have passed
    if (lastUpdate && currentTime - parseInt(lastUpdate) < 300000) {
      console.log("📊 Dashboard update skipped - using cache");
      return { success: true, cached: true };
    }

    const sheets = {
      dashboard: ss.getSheetByName("DASHBOARD"),
      inventory: ss.getSheetByName("INVENTORY"),
      transactions: ss.getSheetByName("TRANSACTIONS"),
      sessions: ss.getSheetByName("SESSIONS"),
      auditLog: ss.getSheetByName("AUDITLOG"),
    };

    // Parallel data collection
    const metrics = calculateWarehouseMetrics(sheets);

    // Update dashboard in batch
    updateDashboardMetrics(sheets.dashboard, metrics);

    // Cache the update time
    cache.setProperty("LAST_DASHBOARD_UPDATE", currentTime.toString());

    const processingTime = new Date().getTime() - startTime;
    logWarehousePerformance(
      "DASHBOARD_UPDATE",
      processingTime,
      `Updated ${Object.keys(metrics).length} metrics`
    );

    console.log(`📊 Dashboard updated successfully in ${processingTime}ms`);

    return {
      success: true,
      cached: false,
      processingTime: processingTime,
      metricsCount: Object.keys(metrics).length,
    };
  } catch (error) {
    console.error("❌ Error updating dashboard:", error);
    createWarehouseAlert(
      "DASHBOARD_ERROR",
      `Dashboard update failed: ${error.message}`,
      "WARNING"
    );
    return { success: false, error: error.message };
  }
}

/**
 *  * 📈 CALCULATE WAREHOUSE METRICS
 * Tính toán các metrics cho warehouse
 *  */
function calculateWarehouseMetrics(sheets) {
  const metrics = {};
  const currentTime = new Date();
  const today = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate()
  );

  try {
    // Active Sessions
    const sessionsData = sheets.sessions.getDataRange().getValues();
    metrics.activeSessions =
      sessionsData.filter((row) => row[5] === "ACTIVE").length - 1; // -1 for header

    // Today's Logins
    const auditData = sheets.auditLog.getDataRange().getValues();
    metrics.todayLogins = auditData.filter((row) => {
      return row[1] === "LOGIN" && new Date(row[0]) >= today;
    }).length;

    // Today's Transactions
    const transData = sheets.transactions.getDataRange().getValues();
    metrics.todayTransactions =
      transData.filter((row) => {
        return new Date(row[0]) >= today;
      }).length - 1; // -1 for header

    // Low Stock Items
    const invData = sheets.inventory.getDataRange().getValues();
    metrics.lowStockItems = invData.filter((row) => {
      return row[4] && row[4] < 10; // Assuming column 4 is quantity
    }).length;

    // System Health
    metrics.systemHealth = calculateSystemHealth(sheets);

    // Performance Score
    metrics.performanceScore = calculatePerformanceScore();

    console.log("📊 Calculated warehouse metrics:", metrics);
    return metrics;
  } catch (error) {
    console.error("Error calculating metrics:", error);
    return { error: error.message };
  }
}

/**
 *  * 🏥 CALCULATE SYSTEM HEALTH
 * Tính toán health score của hệ thống
 *  */
function calculateSystemHealth(sheets) {
  try {
    let healthScore = 100;
    const issues = [];

    // Check expired sessions
    const sessionsData = sheets.sessions.getDataRange().getValues();
    const expiredCount = sessionsData.filter((row) => {
      return row[5] === "ACTIVE" && new Date() > new Date(row[4]);
    }).length;

    if (expiredCount > 5) {
      healthScore -= 20;
      issues.push(`${expiredCount} expired active sessions`);
    }

    // Check audit log size
    const auditSize = sheets.auditLog.getLastRow();
    if (auditSize > 10000) {
      healthScore -= 10;
      issues.push("Audit log getting large");
    }

    // Check recent errors
    const recentErrors = auditData.filter((row) => {
      return row[4] === "ERROR" && new Date() - new Date(row[0]) < 3600000; // Last hour
    }).length;

    if (recentErrors > 0) {
      healthScore -= recentErrors * 5;
      issues.push(`${recentErrors} errors in last hour`);
    }

    return {
      score: Math.max(healthScore, 0),
      status:
        healthScore > 80
          ? "HEALTHY"
          : healthScore > 60
            ? "WARNING"
            : "CRITICAL",
      issues: issues,
    };
  } catch (error) {
    console.error("Error calculating system health:", error);
    return { score: 0, status: "ERROR", issues: [error.message] };
  }
}

/**
 *  * ⚡ CALCULATE PERFORMANCE SCORE
 * Tính toán performance score
 *  */
function calculatePerformanceScore() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const perfSheet = ss.getSheetByName("PERFORMANCE");

    if (!perfSheet) return 85; // Default score

    const perfData = perfSheet.getDataRange().getValues();
    if (perfData.length < 2) return 85;

    // Calculate average response time for last 50 operations
    const recentOps = perfData.slice(-50);
    const avgDuration =
      recentOps.reduce((sum, row) => sum + (row[2] || 0), 0) / recentOps.length;

    // Score based on average duration
    let score = 100;
    if (avgDuration > 3000) score = 60;
    else if (avgDuration > 1000) score = 80;
    else if (avgDuration > 500) score = 90;

    return Math.round(score);
  } catch (error) {
    console.error("Error calculating performance score:", error);
    return 70; // Conservative default
  }
}

/**
 *  * 📋 UPDATE DASHBOARD METRICS
 * Cập nhật metrics lên dashboard
 *  */
function updateDashboardMetrics(dashSheet, metrics) {
  try {
    if (!dashSheet) return;

    const updates = [
      ["B2", metrics.activeSessions || 0],
      ["B3", metrics.todayLogins || 0],
      ["B4", metrics.todayTransactions || 0],
      ["B5", metrics.lowStockItems || 0],
      ["B6", metrics.systemHealth?.status || "UNKNOWN"],
      ["B7", `${metrics.performanceScore || 70}%`],
      ["B8", new Date().toLocaleString("vi-VN")],
    ];

    // Batch update
    updates.forEach(([cell, value]) => {
      dashSheet.getRange(cell).setValue(value);
    });

    // Color coding for health status
    const healthCell = dashSheet.getRange("B6");
    const healthStatus = metrics.systemHealth?.status;

    switch (healthStatus) {
      case "HEALTHY":
        healthCell.setBackground("#4CAF50").setFontColor("white");
        break;
      case "WARNING":
        healthCell.setBackground("#FF9800").setFontColor("white");
        break;
      case "CRITICAL":
        healthCell.setBackground("#F44336").setFontColor("white");
        break;
      default:
        healthCell.setBackground("#9E9E9E").setFontColor("white");
    }
  } catch (error) {
    console.error("Error updating dashboard metrics:", error);
  }
}

/**
 *  * 🔧 AUTOMATED MAINTENANCE TASKS
 * Các tác vụ bảo trì tự động
 *  */
function performMaintenanceTasks() {
  try {
    console.log("🔧 Starting automated maintenance tasks...");
    const startTime = new Date().getTime();

    // 1. Clean expired sessions
    const cleanedSessions = cleanExpiredSessions();

    // 2. Archive old logs (older than 90 days)
    const archivedLogs = archiveOldLogs();

    // 3. Optimize sheet performance
    const optimizedSheets = optimizeSheetPerformance();

    // 4. Update dashboard
    updateDashboardOptimized();

    // 5. Check system health
    const healthCheck = performHealthCheck();

    const totalTime = new Date().getTime() - startTime;

    const maintenanceReport = {
      timestamp: new Date(),
      cleanedSessions: cleanedSessions,
      archivedLogs: archivedLogs,
      optimizedSheets: optimizedSheets,
      healthStatus: healthCheck.status,
      totalTime: totalTime,
    };

    logWarehousePerformance(
      "MAINTENANCE",
      totalTime,
      JSON.stringify(maintenanceReport)
    );

    console.log(
      `🔧 Maintenance completed in ${totalTime}ms:`,
      maintenanceReport
    );

    return maintenanceReport;
  } catch (error) {
    console.error("❌ Error in maintenance tasks:", error);
    createWarehouseAlert(
      "MAINTENANCE_ERROR",
      `Maintenance failed: ${error.message}`,
      "WARNING"
    );
    return { error: error.message };
  }
}

/**
 *  * 📦 ARCHIVE OLD LOGS
 * Lưu trữ logs cũ để tối ưu hiệu suất
 *  */
function archiveOldLogs() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const auditSheet = ss.getSheetByName("AUDITLOG");
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90); // 90 days ago

    const data = auditSheet.getDataRange().getValues();
    let archivedCount = 0;

    // Create archive sheet if not exists
    let archiveSheet = ss.getSheetByName("AUDITLOG_ARCHIVE");
    if (!archiveSheet) {
      archiveSheet = ss.insertSheet("AUDITLOG_ARCHIVE");
      archiveSheet.getRange("A1:H1").setValues([data[0]]); // Copy header
    }

    // Move old records to archive
    for (let i = data.length - 1; i >= 1; i--) {
      const recordDate = new Date(data[i][0]);
      if (recordDate < cutoffDate) {
        archiveSheet.appendRow(data[i]);
        auditSheet.deleteRow(i + 1);
        archivedCount++;
      }
    }

    console.log(`📦 Archived ${archivedCount} old log records`);
    return archivedCount;
  } catch (error) {
    console.error("Error archiving old logs:", error);
    return 0;
  }
}

/**
 *  * ⚡ OPTIMIZE SHEET PERFORMANCE
 * Tối ưu hóa hiệu suất các sheet
 *  */
function optimizeSheetPerformance() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheets = ss.getSheets();
    let optimizedCount = 0;

    sheets.forEach((sheet) => {
      try {
        // Remove empty rows at the end
        const lastRow = sheet.getLastRow();
        const maxRows = sheet.getMaxRows();

        if (maxRows > lastRow + 100) {
          const excessRows = maxRows - lastRow - 50;
          sheet.deleteRows(lastRow + 51, excessRows);
          optimizedCount++;
        }

        // Remove empty columns at the end
        const lastCol = sheet.getLastColumn();
        const maxCols = sheet.getMaxColumns();

        if (maxCols > lastCol + 10) {
          const excessCols = maxCols - lastCol - 5;
          sheet.deleteColumns(lastCol + 6, excessCols);
        }
      } catch (sheetError) {
        console.log(
          `Warning: Could not optimize sheet ${sheet.getName()}: ${sheetError.message}`
        );
      }
    });

    console.log(`⚡ Optimized ${optimizedCount} sheets`);
    return optimizedCount;
  } catch (error) {
    console.error("Error optimizing sheet performance:", error);
    return 0;
  }
}

/**
 *  * 🏥 PERFORM HEALTH CHECK
 * Kiểm tra tổng thể health của hệ thống
 *  */
function performHealthCheck() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const healthReport = {
      timestamp: new Date(),
      sheetsStatus: {},
      overallStatus: "HEALTHY",
      issues: [],
      recommendations: [],
    };

    // Check all required sheets
    const requiredSheets = [
      "INVENTORY",
      "TRANSACTIONS",
      "USERS",
      "AUDITLOG",
      "SESSIONS",
      "DASHBOARD",
    ];

    requiredSheets.forEach((sheetName) => {
      const sheet = ss.getSheetByName(sheetName);
      if (sheet) {
        const rowCount = sheet.getLastRow();
        healthReport.sheetsStatus[sheetName] = {
          exists: true,
          rowCount: rowCount,
          status: rowCount > 0 ? "OK" : "EMPTY",
        };

        if (rowCount === 0) {
          healthReport.issues.push(`${sheetName} sheet is empty`);
        }
      } else {
        healthReport.sheetsStatus[sheetName] = {
          exists: false,
          status: "MISSING",
        };
        healthReport.issues.push(`${sheetName} sheet is missing`);
        healthReport.overallStatus = "CRITICAL";
      }
    });

    // Check for performance issues
    const performanceScore = calculatePerformanceScore();
    if (performanceScore < 70) {
      healthReport.issues.push("Performance below acceptable level");
      healthReport.recommendations.push("Run maintenance tasks");
      healthReport.overallStatus = "WARNING";
    }

    // Check storage usage
    const storageUsed = DriveApp.getStorageUsed();
    if (storageUsed > 15 * 1024 * 1024 * 1024 * 0.8) {
      // 80% of 15GB

      healthReport.issues.push("Storage usage high");

      healthReport.recommendations.push("Archive old data");

      healthReport.overallStatus = "WARNING";
    }

    console.log("🏥 Health check completed:", healthReport);

    // Create alert if issues found

    if (healthReport.issues.length > 0) {
      createWarehouseAlert(
        "HEALTH_CHECK",
        `System health check found ${healthReport.issues.length} issues: ${healthReport.issues.join(", ")}`,
        healthReport.overallStatus === "CRITICAL" ? "CRITICAL" : "WARNING"
      );
    }

    return healthReport;
  } catch (error) {
    console.error("Error performing health check:", error);
    return {
      timestamp: new Date(),
      overallStatus: "ERROR",
      error: error.message,
    };
  }
}

// =====================================
// 🕐 AUTOMATED TRIGGERS SETUP
// =====================================

/**
 *  * 🔄 SETUP AUTOMATED TRIGGERS
 * Thiết lập các trigger tự động
 *  */
function setupAutomatedTriggers() {
  try {
    // Delete existing triggers
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach((trigger) => {
      ScriptApp.deleteTrigger(trigger);
    });

    // Setup new triggers

    // 1. Dashboard update every 5 minutes
    ScriptApp.newTrigger("updateDashboardOptimized")
      .timeBased()
      .everyMinutes(5)
      .create();

    // 2. Session cleanup every hour
    ScriptApp.newTrigger("cleanExpiredSessions")
      .timeBased()
      .everyHours(1)
      .create();

    // 3. Daily maintenance at 2 AM
    ScriptApp.newTrigger("performMaintenanceTasks")
      .timeBased()
      .everyDays(1)
      .atHour(2)
      .create();

    // 4. Weekly health check on Sundays at 3 AM
    ScriptApp.newTrigger("performHealthCheck")
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.SUNDAY)
      .atHour(3)
      .create();

    console.log("🔄 Automated triggers setup successfully");
    createWarehouseAlert(
      "SYSTEM",
      "Automated triggers configured successfully",
      "INFO"
    );

    return { success: true, triggersCount: 4 };
  } catch (error) {
    console.error("❌ Error setting up triggers:", error);
    createWarehouseAlert(
      "SYSTEM_ERROR",
      `Failed to setup triggers: ${error.message}`,
      "CRITICAL"
    );
    return { success: false, error: error.message };
  }
}

console.log(
  "🎉 MIA Warehouse Management System V4.1 - Optimization Functions Loaded Successfully! 🚀"
);
