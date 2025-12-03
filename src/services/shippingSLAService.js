/**
 * Shipping SLA API Service
 * Tích hợp với backend automation_bridge.py
 */

// Get API URL from environment, default to empty if not set
const API_BASE_URL = process.env.REACT_APP_API_URL || "";
const API_ENABLED = API_BASE_URL && API_BASE_URL.trim() !== "";

class ShippingSLAService {
  constructor() {
    this.baseURL = API_ENABLED ? `${API_BASE_URL}/api/shipping-sla` : null;
    this.isEnabled = API_ENABLED;
  }

  // Helper method for API calls
  async apiCall(endpoint, options = {}) {
    // Check if API is enabled
    if (!this.isEnabled || !this.baseURL) {
      throw new Error(
        "Backend API không được cấu hình. Vui lòng thêm REACT_APP_API_URL vào file .env.local hoặc disable tính năng này."
      );
    }

    try {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);

      if (!response.ok) {
        // Handle connection errors gracefully
        if (response.status === 0 || !response.ok) {
          throw new Error(
            "Không thể kết nối đến server. Vui lòng kiểm tra REACT_APP_API_URL hoặc đảm bảo backend API đang chạy."
          );
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);

      // Provide user-friendly error message
      if (
        error.message.includes("fetch") ||
        error.message.includes("Failed to fetch")
      ) {
        throw new Error(
          "Không thể kết nối đến server. Vui lòng kiểm tra REACT_APP_API_URL hoặc đảm bảo backend API đang chạy."
        );
      }

      throw error;
    }
  }

  // Upload and process orders file
  async uploadOrdersFile(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${this.baseURL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Upload orders file failed:", error);
      throw error;
    }
  }

  // Load demo data
  async loadDemoData() {
    return this.apiCall("/demo-data", {
      method: "POST",
    });
  }

  // Get orders with filtering
  async getOrders(filters = {}) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "") {
        params.append(key, value);
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/orders?${queryString}` : "/orders";

    return this.apiCall(endpoint);
  }

  // Get carriers
  async getCarriers() {
    return this.apiCall("/carriers");
  }

  // Get SLA configuration
  async getSLAConfig() {
    return this.apiCall("/sla-config");
  }

  // Update SLA configuration
  async updateSLAConfig(config) {
    return this.apiCall("/sla-config", {
      method: "PUT",
      body: JSON.stringify(config),
    });
  }

  // Bulk actions
  async performBulkAction(action, orderIds, additionalData = {}) {
    return this.apiCall("/bulk-actions", {
      method: "POST",
      body: JSON.stringify({
        action,
        orderIds,
        ...additionalData,
      }),
    });
  }

  // Get real-time statistics
  async getStats() {
    return this.apiCall("/stats");
  }

  // Export orders
  async exportOrders(orderIds = [], format = "csv") {
    return this.apiCall("/export", {
      method: "POST",
      body: JSON.stringify({
        orderIds,
        format,
      }),
    });
  }

  // Check if backend has data
  async checkDataStatus() {
    return this.apiCall("/data-status");
  }

  // Real-time data polling
  startRealTimeUpdates(callback, interval = 60000) {
    const updateInterval = setInterval(async () => {
      try {
        const [ordersResponse, statsResponse] = await Promise.all([
          this.getOrders(),
          this.getStats(),
        ]);

        callback({
          orders: ordersResponse.data?.orders || [],
          stats: statsResponse.data || {},
          timestamp: new Date(),
        });
      } catch (error) {
        console.error("Real-time update failed:", error);
      }
    }, interval);

    return () => clearInterval(updateInterval);
  }

  // Process orders data for frontend
  processOrdersData(orders) {
    return orders.map((order) => ({
      ...order,
      // Ensure all required fields exist
      orderId: order.orderId || "Unknown",
      customerName: order.customerName || "N/A",
      platform: order.platform || "unknown",
      orderValue: parseFloat(order.orderValue) || 0,
      orderTime: new Date(order.orderTime || Date.now()),
      suggestedCarrier: order.suggestedCarrier || "Not assigned",
      slaStatus: order.slaStatus || { level: "unknown", urgency: "unknown" },
      timeRemaining: parseFloat(order.timeRemaining) || 0,
      priority: parseFloat(order.priority) || 0,
      status: order.status || "pending",
    }));
  }

  // Helper method to format time remaining
  formatTimeRemaining(hours) {
    if (hours <= 0) return "Hết hạn";

    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes} phút`;
    } else if (hours < 24) {
      const wholeHours = Math.floor(hours);
      const remainingMinutes = Math.round((hours - wholeHours) * 60);
      return remainingMinutes > 0
        ? `${wholeHours}h ${remainingMinutes}p`
        : `${wholeHours}h`;
    } else {
      const days = Math.floor(hours / 24);
      const remainingHours = Math.round(hours % 24);
      return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
    }
  }

  // Helper method to get SLA status color
  getSLAStatusColor(slaStatus) {
    switch (slaStatus?.level) {
      case "expired":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "safe":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  // Helper method to get platform badge color
  getPlatformColor(platform) {
    switch (platform?.toLowerCase()) {
      case "tiktok":
        return "bg-black text-white";
      case "shopee":
        return "bg-orange-500 text-white";
      case "website":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  }
}

// Singleton instance
const shippingSLAService = new ShippingSLAService();

export default shippingSLAService;
