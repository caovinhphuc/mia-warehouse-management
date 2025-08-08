// ==================== GOOGLE SHEETS AUTHENTICATION SERVICE ====================
/**
 * Google Sheets Authentication Service for MIA Warehouse Management
 * Provides real-time verification against Google Sheets database
 *
 * Features:
 * - Real-time user verification
 * - Role-based access control
 * - Audit logging
 * - Session management
 *
 * Author: Trưởng phòng Kho vận
 * Date: 12/06/2025
 */

// Google Sheets API Configuration
export const GOOGLE_SHEETS_CONFIG = {
  // Replace with your actual Google Sheets API key
  API_KEY: process.env.REACT_APP_GOOGLE_SHEETS_API_KEY || "",

  // MIA Warehouse Google Sheets ID from the provided link
  SHEET_ID:
    process.env.REACT_APP_GOOGLE_SHEETS_ID ||
    "1m2B2ODXuuatnW0EKExdVeCa1WwvF52bZOhS7DGqG6Vg",

  // Sheet ranges for different data types - Updated to match actual sheet structure
  RANGES: {
    USERS: "Users!A:H", // Username, Password, Full Name, Email, Role, Department, Permissions, Shift
    AUDIT_LOG: "AuditLog!A:F", // Timestamp, Action, Username, Details, Status, IP Address
    PERMISSIONS: "Permissions!A:C", // Role, Permission, Description
    SESSIONS: "Sessions!A:E", // Session ID, User ID, Login Time, Expires At, Is Active
  },

  // API endpoints
  BASE_URL: "https://sheets.googleapis.com/v4/spreadsheets",
};

// ==================== AUTHENTICATION FUNCTIONS ====================

/**
 * Verify user credentials against Google Sheets
 * @param {string} username - User's login username
 * @param {string} password - User's password
 * @returns {Promise<Object>} Authentication result
 */
export const verifyCredentials = async (username, password) => {
  try {
    // Use the real API key and sheet ID from environment
    const API_KEY = GOOGLE_SHEETS_CONFIG.API_KEY;
    const SHEET_ID = GOOGLE_SHEETS_CONFIG.SHEET_ID;

    // Create timeout controller for API request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Users!A:H?key=${API_KEY}`,
      {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(
        "Google Sheets API failed:",
        response.status,
        response.statusText
      );
      return {
        success: false,
        error: "Không thể kết nối tới hệ thống xác thực. Vui lòng thử lại sau.",
        code: "SHEETS_API_ERROR",
      };
    }

    const data = await response.json();

    if (!data.values || data.values.length === 0) {
      return {
        success: false,
        error: "Không có dữ liệu người dùng trong hệ thống",
      };
    }

    // Parse users from Google Sheets - Headers: Username, Password, Full Name, Email, Role, Department, Permissions, Shift
    const userRows = data.values.slice(1);

    const users = userRows.map((row) => {
      return {
        username: row[0] || "", // Username
        password: row[1] || "", // Password
        fullName: row[2] || "", // Full Name
        email: row[3] || "", // Email
        role: row[4] || "", // Role
        department: row[5] || "", // Department
        permissions: row[6] || "", // Permissions
        shift: row[7] || "", // Shift
      };
    });

    // Find user by username
    const user = users.find(
      (u) => u.username && u.username.toLowerCase() === username.toLowerCase()
    );

    if (!user) {
      return {
        success: false,
        error: "Không tìm thấy tài khoản này trong hệ thống",
      };
    }

    // Verify password
    if (user.password !== password) {
      return {
        success: false,
        error: "Mật khẩu không chính xác",
      };
    }

    // Generate session token
    const sessionToken = generateSessionToken(user);

    // Return successful authentication
    return {
      success: true,
      userData: {
        id: user.username,
        name: user.fullName || user.username,
        email: user.email || `${user.username}@mia.vn`,
        role: user.role || "Staff",
        department: user.department || "Operations",
        permissions: user.permissions
          ? user.permissions.split(",").map((p) => p.trim())
          : ["read_orders"],
        avatar: "/api/placeholder/32/32",
        shift: user.shift || "Day Shift",
        lastLogin: new Date(),
      },
      token: sessionToken,
      session: {
        id: sessionToken,
        userId: user.id || `user-${Date.now()}`,
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
    };
  } catch (error) {
    console.error("Google Sheets credentials verification failed:", error);

    // Return authentication failure
    return {
      success: false,
      error:
        error.name === "AbortError"
          ? "Kết nối tới hệ thống quá chậm. Vui lòng thử lại."
          : "Không thể kết nối tới hệ thống xác thực. Vui lòng kiểm tra kết nối mạng.",
      code: error.name === "AbortError" ? "TIMEOUT" : "CONNECTION_ERROR",
    };
  }
};

// ==================== SESSION MANAGEMENT ====================

/**
 * Generate a session token for authenticated user
 */
const generateSessionToken = (user) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2);
  return `mia_session_${user.id || "user"}_${timestamp}_${randomString}`;
};

// ==================== CONNECTION TESTING ====================

/**
 * Test connection to Google Sheets API
 * @returns {Promise<boolean>} Connection status
 */
export const testGoogleSheetsConnection = async () => {
  try {
    const API_KEY = GOOGLE_SHEETS_CONFIG.API_KEY;
    const SHEET_ID = GOOGLE_SHEETS_CONFIG.SHEET_ID;

    // Create timeout controller for connection test
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A1:A1?key=${API_KEY}`,
      {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error("Google Sheets connection test failed:", error);
    if (error.name === "AbortError") {
      console.log("Google Sheets connection timeout");
    }
    return false;
  }
};

// ==================== AUDIT LOGGING ====================

/**
 * Log audit events to Google Sheets via Google Apps Script webhook
 * @param {Object} eventData - Event data to log
 */
export const logAuditEvent = async (eventData) => {
  try {
    // Google Apps Script Web App URL for audit logging
    // Replace this with your deployed Google Apps Script Web App URL
    const AUDIT_WEBHOOK_URL =
      process.env.REACT_APP_AUDIT_WEBHOOK_URL ||
      "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

    // Prepare audit log data
    const auditData = {
      timestamp: new Date().toISOString(),
      action: eventData.action || "UNKNOWN",
      username: eventData.username || "unknown",
      details: eventData.details || "",
      status: eventData.status || "SUCCESS",
      ipAddress: eventData.ipAddress || getClientIP(),
    };

    console.log("Logging audit event:", auditData);

    // Prefer serverless API (Service Account) if available
    try {
      const apiBase = process.env.REACT_APP_API_BASE_URL || "/api";
      const resp = await fetch(`${apiBase}/audit-log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(auditData),
      });
      if (resp && resp.ok) {
        return { success: true, logged: "serverless_api" };
      }
    } catch (_) {
      // continue to fallbacks
    }

    // If no webhook URL is configured, log locally only
    if (AUDIT_WEBHOOK_URL.includes("YOUR_SCRIPT_ID")) {
      console.log("Audit Event (Local Only - Configure webhook):", auditData);
      return { success: true, logged: "locally" };
    }

    // Fire-and-forget to Apps Script (no-cors)
    try {
      fetch(AUDIT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(auditData),
        mode: "no-cors",
      }).catch(() => {});
    } catch (_) {
      // ignore webhook errors; we will still try direct Sheets append
    }

    // Parallel fallback: append directly to Google Sheets via API
    try {
      const apiKey = GOOGLE_SHEETS_CONFIG.API_KEY;
      const sheetId = GOOGLE_SHEETS_CONFIG.SHEET_ID;
      const range = GOOGLE_SHEETS_CONFIG.RANGES.AUDIT_LOG || "AuditLog!A:F";

      if (apiKey && sheetId) {
        await fetch(
          `${GOOGLE_SHEETS_CONFIG.BASE_URL}/${sheetId}/values/${encodeURIComponent(
            range
          )}:append?valueInputOption=RAW&key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              values: [
                [
                  auditData.timestamp,
                  auditData.action,
                  auditData.username,
                  auditData.details,
                  auditData.status,
                  auditData.ipAddress,
                ],
              ],
            }),
          }
        );
        return { success: true, logged: "sheets_api" };
      }
    } catch (appendError) {
      console.warn(
        "Direct Sheets append failed:",
        appendError?.message || appendError
      );
    }

    // If we reach here, we at least attempted webhook
    return { success: true, logged: "webhook_only" };
  } catch (error) {
    console.error("Failed to log audit event:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get client IP address (simplified for browser environment)
 */
const getClientIP = () => {
  // In a browser environment, we can't get the real client IP
  // This would typically be handled by the server
  return "browser-client";
};

// ==================== SESSION MANAGEMENT ====================

/**
 * Create a new user session
 * @param {Object} user - User data
 * @returns {Object} Session data
 */
export const createSession = async (user) => {
  const sessionId = generateSessionToken(user);
  const session = {
    id: sessionId,
    userId: user.id,
    loginTime: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    isActive: true,
  };

  // Store session in localStorage for now
  // In production, this should be stored server-side
  localStorage.setItem(`session_${sessionId}`, JSON.stringify(session));

  return session;
};

/**
 * Verify if a session is still valid
 * @param {string} sessionId - Session ID to verify
 * @returns {boolean} Session validity
 */
export const verifySession = async (sessionId) => {
  try {
    const sessionData = localStorage.getItem(`session_${sessionId}`);
    if (!sessionData) return false;

    const session = JSON.parse(sessionData);
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);

    return session.isActive && now < expiresAt;
  } catch (error) {
    return false;
  }
};

/**
 * End a user session
 * @param {string} sessionId - Session ID to end
 */
export const endSession = async (sessionId) => {
  try {
    localStorage.removeItem(`session_${sessionId}`);
  } catch (error) {
    console.error("Failed to end session:", error);
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Parse user data from Google Sheets response (unused in current implementation)
 */
// const parseUsersData = (values) => {
//   if (!values || values.length === 0) return [];
//   const headers = values[0];
//   const userRows = values.slice(1);
//   return userRows.map((row) => {
//     const user = {};
//     headers.forEach((header, index) => {
//       user[header.toLowerCase()] = row[index] || '';
//     });
//     if (user.permissions && typeof user.permissions === 'string') {
//       user.permissions = user.permissions.split(',').map((p) => p.trim());
//     }
//     return user;
//   });
// };

/**
 * Get user's IP address
 * @returns {Promise<string>} User's IP address
 */
export const getUserIP = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return "unknown";
  }
};

// Export configuration for external use
export default GOOGLE_SHEETS_CONFIG;
