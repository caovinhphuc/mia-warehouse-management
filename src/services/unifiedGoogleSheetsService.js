/**
 * 🔧 UNIFIED GOOGLE SHEETS SERVICE
 * Dịch vụ thống nhất cho Google Sheets integration
 *
 * Tập hợp tất cả các chức năng Google Sheets vào một service duy nhất
 * với error handling, caching, và retry logic
 */

// ==================== CONFIGURATION ====================
export const UNIFIED_GOOGLE_SHEETS_CONFIG = {
  // API Configuration
  API_KEY: process.env.REACT_APP_GOOGLE_SHEETS_API_KEY || "",
  SHEET_ID:
    process.env.REACT_APP_GOOGLE_SHEETS_ID ||
    "1m2B2ODXuuatnW0EKExdVeCa1WwvF52bZOhS7DGqG6Vg",
  BASE_URL: "https://sheets.googleapis.com/v4/spreadsheets",

  // Webhook URLs
  WEBHOOKS: {
    AUDIT: process.env.REACT_APP_AUDIT_WEBHOOK_URL || "",
    PROFILE: process.env.REACT_APP_PROFILE_UPDATE_WEBHOOK_URL || "",
  },

  // Sheet Ranges (Thống nhất naming)
  RANGES: {
    USERS: "Users!A:H", // Username, Password, Full Name, Email, Role, Department, Permissions, Shift
    AUDIT_LOG: "AuditLog!A:F", // Timestamp, Action, Username, Details, Status, IP Address
    PERMISSIONS: "Permissions!A:C", // Role, Permission, Description
    SESSIONS: "Sessions!A:E", // Session ID, User ID, Login Time, Expires At, Is Active
  },

  // Performance Settings
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes cache
  RETRY_ATTEMPTS: 3, // Retry failed requests
  TIMEOUT: 10000, // 10 second timeout
  RATE_LIMIT_DELAY: 100, // 100ms between requests

  // Security Settings
  MAX_AUDIT_BATCH: 50, // Max audit logs per batch
  SESSION_EXPIRE: 24 * 60 * 60 * 1000, // 24 hours
};

// ==================== CACHE MANAGER ====================
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
  }

  set(key, data, ttl = UNIFIED_GOOGLE_SHEETS_CONFIG.CACHE_TTL) {
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now() + ttl);
  }

  get(key) {
    const timestamp = this.timestamps.get(key);
    if (!timestamp || Date.now() > timestamp) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// ==================== ERROR HANDLER ====================
class ErrorHandler {
  static handle(error, context = "") {
    console.error(`[GoogleSheetsService] ${context}:`, error);

    if (error.name === "AbortError") {
      return {
        success: false,
        error: "Kết nối quá chậm. Vui lòng thử lại.",
        code: "TIMEOUT",
      };
    }

    // Handle missing API key
    if (error.code === "MISSING_API_KEY") {
      return {
        success: false,
        error:
          error.message ||
          "API Key chưa được cấu hình. Vui lòng liên hệ quản trị viên.",
        code: "MISSING_API_KEY",
      };
    }

    if (error.status === 403 || error.code === "PERMISSION_DENIED") {
      return {
        success: false,
        error:
          error.message ||
          "Không có quyền truy cập. Kiểm tra API key và permissions.",
        code: "PERMISSION_DENIED",
      };
    }

    if (error.status === 429) {
      return {
        success: false,
        error: "Vượt quá giới hạn request. Vui lòng thử lại sau.",
        code: "RATE_LIMIT",
      };
    }

    return {
      success: false,
      error:
        error.message ||
        "Lỗi kết nối với Google Sheets. Vui lòng kiểm tra mạng.",
      code: "CONNECTION_ERROR",
    };
  }
}

// ==================== UNIFIED GOOGLE SHEETS SERVICE ====================
class UnifiedGoogleSheetsService {
  constructor(config = {}) {
    this.config = { ...UNIFIED_GOOGLE_SHEETS_CONFIG, ...config };
    this.cache = new CacheManager();
    this.auditQueue = [];
    this.isProcessingQueue = false;

    // Validate configuration
    this.validateConfig();

    // Initialize auto-processing
    this.startAutoProcessing();
  }

  // ==================== CONFIGURATION VALIDATION ====================

  validateConfig() {
    if (!this.config.API_KEY || this.config.API_KEY.trim() === "") {
      console.error(
        "[GoogleSheetsService] ⚠️ API Key chưa được cấu hình!",
        "\nVui lòng thêm REACT_APP_GOOGLE_SHEETS_API_KEY vào file .env hoặc Vercel Environment Variables"
      );
    }
  }

  // ==================== CORE API METHODS ====================

  async makeRequest(endpoint, options = {}) {
    const { retries = 0, useCache = true, cacheKey = null } = options;

    // Validate API key before making request
    if (!this.config.API_KEY || this.config.API_KEY.trim() === "") {
      const error = new Error(
        "API Key chưa được cấu hình. Vui lòng thêm REACT_APP_GOOGLE_SHEETS_API_KEY vào file .env hoặc Vercel Environment Variables."
      );
      error.code = "MISSING_API_KEY";
      error.status = 403;
      throw error;
    }

    // Check cache first
    if (useCache && cacheKey) {
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.config.TIMEOUT
      );

      const response = await fetch(endpoint, {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        ...options.fetchOptions,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || "Unknown error";

        // Special handling for 403 errors (missing API key or permission denied)
        if (response.status === 403) {
          const error = new Error(
            errorMessage.includes("unregistered callers") ||
            errorMessage.includes("API key") ||
            (endpoint.includes("key=") &&
              !endpoint.includes("key=" + this.config.API_KEY))
              ? "API Key chưa được cấu hình hoặc không hợp lệ. Vui lòng kiểm tra REACT_APP_GOOGLE_SHEETS_API_KEY trong file .env hoặc Vercel Environment Variables."
              : `Không có quyền truy cập: ${errorMessage}`
          );
          error.code =
            response.status === 403 ? "PERMISSION_DENIED" : "API_ERROR";
          error.status = response.status;
          throw error;
        }

        throw new Error(`API Error: ${response.status} - ${errorMessage}`);
      }

      const data = await response.json();

      // Cache successful responses
      if (useCache && cacheKey) {
        this.cache.set(cacheKey, data);
      }

      return data;
    } catch (error) {
      // Don't retry if it's a configuration error
      if (
        error.code === "MISSING_API_KEY" ||
        error.code === "PERMISSION_DENIED"
      ) {
        throw error;
      }

      if (retries < this.config.RETRY_ATTEMPTS) {
        await this.sleep(1000 * (retries + 1)); // Exponential backoff
        return this.makeRequest(endpoint, { ...options, retries: retries + 1 });
      }
      throw error;
    }
  }

  // ==================== AUTHENTICATION ====================

  async verifyCredentials(username, password) {
    try {
      const endpoint = `${this.config.BASE_URL}/${this.config.SHEET_ID}/values/${this.config.RANGES.USERS}?key=${this.config.API_KEY}`;

      const data = await this.makeRequest(endpoint, {
        useCache: true,
        cacheKey: "users_data",
      });

      if (!data.values || data.values.length === 0) {
        return {
          success: false,
          error: "Không có dữ liệu người dùng trong hệ thống",
        };
      }

      const users = this.parseUsersData(data.values);

      // Tìm user theo username hoặc email (không phân biệt hoa thường)
      const normalizedInput = username.toLowerCase().trim();
      const user = users.find(
        (u) =>
          (u.username && u.username.toLowerCase() === normalizedInput) ||
          (u.email && u.email.toLowerCase() === normalizedInput)
      );

      if (!user) {
        await this.queueAuditLog({
          action: "LOGIN_FAILED",
          username,
          details: "User not found",
          status: "FAILED",
        });

        return {
          success: false,
          error: "Không tìm thấy tài khoản này trong hệ thống",
        };
      }

      if (user.password !== password) {
        await this.queueAuditLog({
          action: "LOGIN_FAILED",
          username,
          details: "Invalid password",
          status: "FAILED",
        });

        return {
          success: false,
          error: "Mật khẩu không chính xác",
        };
      }

      // Generate session
      const sessionToken = this.generateSessionToken(user);
      const userData = this.transformUserData(user);

      await this.queueAuditLog({
        action: "LOGIN_SUCCESS",
        username,
        details: "Successful login",
        status: "SUCCESS",
      });

      return {
        success: true,
        userData,
        token: sessionToken,
        session: {
          id: sessionToken,
          userId: user.username,
          loginTime: new Date().toISOString(),
          expiresAt: new Date(
            Date.now() + this.config.SESSION_EXPIRE
          ).toISOString(),
        },
      };
    } catch (error) {
      return ErrorHandler.handle(error, "verifyCredentials");
    }
  }

  // ==================== AUDIT LOGGING ====================

  async queueAuditLog(eventData) {
    const auditData = {
      timestamp: new Date().toISOString(),
      action: eventData.action || "UNKNOWN",
      username: eventData.username || "unknown",
      details: eventData.details || "",
      status: eventData.status || "SUCCESS",
      ipAddress: eventData.ipAddress || (await this.getClientIP()),
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    this.auditQueue.push(auditData);

    // Process immediately if queue is getting full
    if (this.auditQueue.length >= this.config.MAX_AUDIT_BATCH) {
      this.processAuditQueue();
    }

    return auditData;
  }

  async processAuditQueue() {
    if (this.isProcessingQueue || this.auditQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;
    const batch = this.auditQueue.splice(0, this.config.MAX_AUDIT_BATCH);

    try {
      // Send to webhook
      if (
        this.config.WEBHOOKS.AUDIT &&
        !this.config.WEBHOOKS.AUDIT.includes("YOUR_SCRIPT_ID")
      ) {
        await fetch(this.config.WEBHOOKS.AUDIT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ batch }),
          mode: "no-cors",
        });
      }

      console.log(
        `[UnifiedGoogleSheetsService] Processed ${batch.length} audit logs`
      );
    } catch (error) {
      console.error(
        "[UnifiedGoogleSheetsService] Audit processing failed:",
        error
      );
      // Re-queue failed items
      this.auditQueue.unshift(...batch);
    } finally {
      this.isProcessingQueue = false;
    }
  }

  // ==================== USER MANAGEMENT ====================

  async updateUserProfile(userId, updates) {
    try {
      if (
        this.config.WEBHOOKS.PROFILE &&
        !this.config.WEBHOOKS.PROFILE.includes("YOUR_SCRIPT_ID")
      ) {
        await fetch(this.config.WEBHOOKS.PROFILE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "UPDATE_PROFILE",
            userId,
            updateData: updates,
            timestamp: new Date().toISOString(),
          }),
          mode: "no-cors",
        });

        await this.queueAuditLog({
          action: "PROFILE_UPDATE",
          username: userId,
          details: `Updated profile: ${Object.keys(updates).join(", ")}`,
          status: "SUCCESS",
        });

        // Clear user cache
        this.cache.clear();

        return { success: true };
      } else {
        return {
          success: false,
          error: "Profile update webhook not configured",
        };
      }
    } catch (error) {
      return ErrorHandler.handle(error, "updateUserProfile");
    }
  }

  // ==================== UTILITY METHODS ====================

  parseUsersData(values) {
    if (!values || values.length === 0) return [];

    // Skip header row and process user data
    const userRows = values.slice(1);

    return userRows.map((row) => ({
      username: row[0] || "",
      password: row[1] || "",
      fullName: row[2] || "",
      email: row[3] || "",
      role: row[4] || "",
      department: row[5] || "",
      permissions: row[6] ? row[6].split(",").map((p) => p.trim()) : [],
      shift: row[7] || "",
    }));
  }

  transformUserData(user) {
    return {
      id: user.username,
      name: user.fullName || user.username,
      email: user.email || `${user.username}@mia.vn`,
      role: user.role || "Staff",
      department: user.department || "Operations",
      permissions: user.permissions || ["read_orders"],
      avatar: "/api/placeholder/32/32",
      shift: user.shift || "Day Shift",
      lastLogin: new Date(),
    };
  }

  generateSessionToken(user) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2);
    return `mia_unified_${user.username}_${timestamp}_${randomString}`;
  }

  async getClientIP() {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return "unknown";
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  startAutoProcessing() {
    // Process audit queue every 10 seconds
    setInterval(() => {
      this.processAuditQueue();
    }, 10000);
  }

  // ==================== HEALTH CHECK ====================

  async healthCheck() {
    try {
      const endpoint = `${this.config.BASE_URL}/${this.config.SHEET_ID}/values/A1:A1?key=${this.config.API_KEY}`;
      await this.makeRequest(endpoint, { useCache: false });

      return {
        success: true,
        status: "healthy",
        timestamp: new Date().toISOString(),
        cache: this.cache.getStats(),
        queueSize: this.auditQueue.length,
      };
    } catch (error) {
      return {
        success: false,
        status: "unhealthy",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// ==================== EXPORT ====================

// Singleton instance
let unifiedServiceInstance = null;

export const getUnifiedGoogleSheetsService = (config) => {
  if (!unifiedServiceInstance) {
    unifiedServiceInstance = new UnifiedGoogleSheetsService(config);
  }
  return unifiedServiceInstance;
};

// Legacy compatibility exports
export const verifyCredentials = async (username, password) => {
  const service = getUnifiedGoogleSheetsService();
  return service.verifyCredentials(username, password);
};

export const logAuditEvent = async (eventData) => {
  const service = getUnifiedGoogleSheetsService();
  return service.queueAuditLog(eventData);
};

export const updateUserProfile = async (userId, updates) => {
  const service = getUnifiedGoogleSheetsService();
  return service.updateUserProfile(userId, updates);
};

export const testConnection = async () => {
  const service = getUnifiedGoogleSheetsService();
  return service.healthCheck();
};

// Main service class export
export { UnifiedGoogleSheetsService };

// Configuration export
export default UNIFIED_GOOGLE_SHEETS_CONFIG;
