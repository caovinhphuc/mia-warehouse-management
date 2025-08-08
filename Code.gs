/**
 * Google Apps Script để handle Profile Updates từ Frontend
 * Deploy as Web App và expose endpoint để update user profile
 */

// ==================== MAIN FUNCTIONS ====================

/**
 * Handle GET requests (for testing)
 * @param {Object} e - Event object containing request data
 */
function doGet(e) {
  try {
    const response = {
      success: true,
      message: 'MIA Warehouse Profile Updater API is running',
      timestamp: new Date().toISOString(),
      endpoints: {
        'GET_PROFILE': 'POST with action: "GET_PROFILE", userId: "user-id"',
        'UPDATE_PROFILE': 'POST with action: "UPDATE_PROFILE", userId: "user-id", updateData: {...}'
      }
    };

    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
        timestamp: new Date().toISOString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}














/**
 * Main function to handle HTTP requests
 * @param {Object} e - Event object containing request data
 */
function doPost(e) {
  try {
    // Set CORS headers
    const response = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json',
      },
    };

    // Parse request data
    const requestData = JSON.parse(e.postData.contents);
    const { action, userId, updateData } = requestData;

    let result;
    switch (action) {
      case 'UPDATE_PROFILE':
        result = updateUserProfile(userId, updateData);
        break;
      case 'GET_PROFILE':
        result = getUserProfile(userId);
        break;
      default:
        throw new Error(`Unsupported action: ${action}`);
    }

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle OPTIONS requests for CORS
 */
function doOptions() {
  return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.JSON).setHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
}

// ==================== USER PROFILE FUNCTIONS ====================

/**
 * Update user profile in Google Sheets
 * @param {string} userId - User ID or username
 * @param {Object} updateData - Data to update
 */
function updateUserProfile(userId, updateData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Users');

  if (!sheet) {
    throw new Error('Users sheet not found');
  }

  // Get all data
  const range = sheet.getDataRange();
  const values = range.getValues();
  const headers = values[0];

  // Find user row
  let userRowIndex = -1;
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (row[0] === userId || row[3] === userId) {
      // Check username or email
      userRowIndex = i;
      break;
    }
  }

  if (userRowIndex === -1) {
    throw new Error(`User not found: ${userId}`);
  }

  // Update specific fields
  const currentRow = values[userRowIndex];
  const updatedRow = [...currentRow];

  // Map update data to columns
  Object.keys(updateData).forEach((key) => {
    const headerIndex = findHeaderIndex(headers, key);
    if (headerIndex >= 0) {
      updatedRow[headerIndex] = updateData[key];
    }
  });

  // Add timestamp
  const updatedAtIndex = findHeaderIndex(headers, 'updated');
  if (updatedAtIndex >= 0) {
    updatedRow[updatedAtIndex] = new Date().toISOString();
  }

  // Write back to sheet
  const rowRange = sheet.getRange(userRowIndex + 1, 1, 1, updatedRow.length);
  rowRange.setValues([updatedRow]);

  // Log activity
  logActivity('UPDATE_PROFILE', userId, updateData);

  return {
    success: true,
    userId: userId,
    updatedFields: Object.keys(updateData),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get user profile
 * @param {string} userId - User ID or username
 */
function getUserProfile(userId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Users');

  if (!sheet) {
    throw new Error('Users sheet not found');
  }

  const range = sheet.getDataRange();
  const values = range.getValues();
  const headers = values[0];

  // Find user row
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (row[0] === userId || row[3] === userId) {
      const user = {};
      headers.forEach((header, index) => {
        user[header.toLowerCase().replace(/\s+/g, '')] = row[index] || '';
      });
      return user;
    }
  }

  throw new Error(`User not found: ${userId}`);
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Find header index by name (case insensitive)
 * @param {Array} headers - Header array
 * @param {string} name - Header name to find
 */
function findHeaderIndex(headers, name) {
  const normalizedName = name.toLowerCase().replace(/\s+/g, '');

  return headers.findIndex((header) => {
    const normalizedHeader = header.toLowerCase().replace(/\s+/g, '');
    return normalizedHeader.includes(normalizedName) || normalizedName.includes(normalizedHeader);
  });
}

/**
 * Log user activity
 * @param {string} action - Action performed
 * @param {string} userId - User ID
 * @param {Object} details - Activity details
 */
function logActivity(action, userId, details) {
  try {
    const auditSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('AuditLog');

    if (auditSheet) {
      auditSheet.appendRow([
        new Date().toISOString(),
        action,
        userId,
        userId, // performed by (same user for profile updates)
        JSON.stringify(details),
        'web-app', // source
      ]);
    }
  } catch (error) {
    console.log('Failed to log activity:', error.message);
  }
}

/**
 * Test function - can be called manually
 */
function testUpdateProfile() {
  const testData = {
    name: 'Test Update Name',
    phone: '+84 901 234 567',
    bio: 'Updated from Google Apps Script',
  };

  const result = updateUserProfile('admin', testData);
  console.log('Test result:', result);
}

// ==================== DEPLOYMENT INSTRUCTIONS ====================
/*
1. Mở https://script.google.com/
2. Tạo New Project
3. Copy paste toàn bộ code này vào
4. Lưu project với tên "MIA Warehouse Profile Updater"
5. Deploy as Web App:
   - Execute as: Me
   - Who has access: Anyone
6. Copy Web App URL
7. Cập nhật URL này vào frontend service
*/
