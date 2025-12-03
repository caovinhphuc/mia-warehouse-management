/**
 * Central Export File for Utilities
 * Aggregates all utility functions, hooks, constants, and helpers
 *
 * @module utils/index
 */

// ==================== CONSTANTS ====================
export * from "./constants";
export { default as constants } from "./constants";

// ==================== HELPER FUNCTIONS ====================
export * from "./helpers";
export { default as helpers } from "./helpers";

// ==================== CUSTOM HOOKS ====================
export { usePerformanceMonitor } from "./usePerformanceMonitor";
export { useErrorHandler } from "./useErrorHandler";

// ==================== CONTEXT PROVIDERS ====================
export { MetricsProvider, useMetrics } from "./MetricsContext";
export {
  WebSocketProvider,
  useWebSocket,
  useWebSocketMessage,
  useWebSocketSender,
} from "./WebSocketContext";

// ==================== FORM VALIDATION SCHEMAS ====================
// Using Yup for validation (if needed, we can add Zod as well)

// User validation schema
export const userValidationSchema = {
  username: {
    required: true,
    minLength: 3,
    message: "Username must be at least 3 characters",
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Invalid email address",
  },
  password: {
    required: true,
    minLength: 8,
    message: "Password must be at least 8 characters",
  },
  role: {
    required: true,
    options: ["admin", "manager", "supervisor", "operator", "viewer"],
    message: "Valid role is required",
  },
  department: {
    required: true,
    message: "Department is required",
  },
};

// Order validation schema
export const orderValidationSchema = {
  orderNumber: {
    required: true,
    message: "Order number is required",
  },
  customerName: {
    required: true,
    message: "Customer name is required",
  },
  customerEmail: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Valid email address is required",
  },
  items: {
    required: true,
    minLength: 1,
    message: "At least one item is required",
  },
  priority: {
    options: ["low", "normal", "high", "urgent", "critical"],
    default: "normal",
  },
};

// Inventory validation schema
export const inventoryValidationSchema = {
  sku: {
    required: true,
    pattern: /^[A-Z0-9\-_]{3,20}$/,
    message: "Valid SKU is required",
  },
  name: {
    required: true,
    message: "Product name is required",
  },
  category: {
    required: true,
    message: "Category is required",
  },
  quantity: {
    required: true,
    min: 0,
    type: "number",
    message: "Valid quantity is required",
  },
  minStock: {
    required: true,
    min: 0,
    type: "number",
    message: "Valid minimum stock is required",
  },
  unitPrice: {
    required: true,
    min: 0,
    type: "number",
    message: "Valid unit price is required",
  },
};

// ==================== LEGACY COMPATIBILITY ====================
// Keep some legacy functions for backward compatibility

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// ==================== STORAGE HELPERS ====================
// Enhanced localStorage helpers with error handling

export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing localStorage key "${key}":`, error);
    return false;
  }
};

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
};

// ==================== DATA TRANSFORMATION ====================

export const transformOrderData = (order) => {
  return {
    ...order,
    formattedCreatedAt: helpers.formatDate(
      order.createdAt,
      helpers.DATE_FORMATS?.DATE_TIME
    ),
    formattedTotal: helpers.formatCurrency(order.totalAmount),
    itemCount: order.items ? order.items.length : 0,
    statusColor: getStatusColor(order.status),
    priorityScore: helpers.calculateOrderPriority?.(order) || 0,
  };
};

export const transformInventoryData = (item) => {
  const stockLevel = calculateStockLevel(item.quantity, item.minStock);
  return {
    ...item,
    formattedPrice: helpers.formatCurrency(item.unitPrice),
    stockLevel,
    stockLevelColor: getStockLevelColor(stockLevel),
    totalValue: item.quantity * item.unitPrice,
    formattedTotalValue: helpers.formatCurrency(item.quantity * item.unitPrice),
    stockStatus:
      helpers.getStockStatus?.(
        item.quantity,
        item.minStock,
        item.criticalStock
      ) || stockLevel,
  };
};

export const calculateStockLevel = (quantity, minStock) => {
  if (quantity <= 0) return "out-of-stock";
  if (quantity <= minStock) return "low-stock";
  if (quantity <= minStock * 2) return "medium-stock";
  return "high-stock";
};

export const getStatusColor = (status) => {
  const colors = {
    pending: "yellow",
    processing: "blue",
    picking: "indigo",
    packed: "purple",
    shipped: "green",
    delivered: "emerald",
    cancelled: "red",
    returned: "orange",
  };
  return colors[status] || "gray";
};

export const getStockLevelColor = (level) => {
  const colors = {
    "out-of-stock": "red",
    "low-stock": "orange",
    "medium-stock": "yellow",
    "high-stock": "green",
    critical: "red",
  };
  return colors[level] || "gray";
};

// ==================== EXPORT MANAGEMENT ====================

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (
            typeof value === "string" &&
            (value.includes(",") || value.includes('"'))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value ?? "";
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

export const exportToJSON = (data, filename) => {
  if (!data) {
    console.warn("No data to export");
    return;
  }

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// ==================== API HELPERS ====================

export const createApiUrl = (endpoint, params = {}) => {
  return helpers.buildUrl?.(endpoint, params) || endpoint;
};

export const handleApiError = (error, context = "API Call") => {
  console.error(`${context} failed:`, error);

  // Return user-friendly error message
  if (error.status) {
    switch (error.status) {
      case 401:
        return "Authentication required. Please log in again.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 429:
        return "Too many requests. Please wait and try again.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return `Error ${error.status}: ${error.message || "Unknown error"}`;
    }
  }

  return error.message || "An unexpected error occurred.";
};

// ==================== DEFAULT VALUES ====================

export const DEFAULT_PAGE_SIZE = 25;
export const DEFAULT_TIMEOUT = 15000;

// Legacy constants for backward compatibility
export const USER_ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  SUPERVISOR: "supervisor",
  OPERATOR: "operator",
  VIEWER: "viewer",
};

export const ORDER_STATUSES = {
  PENDING: "pending",
  PROCESSING: "processing",
  PICKING: "picking",
  PACKED: "packed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  RETURNED: "returned",
};

export const ORDER_PRIORITIES = {
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
  URGENT: "urgent",
  CRITICAL: "critical",
};

export const INVENTORY_CATEGORIES = {
  ELECTRONICS: "electronics",
  CLOTHING: "clothing",
  BOOKS: "books",
  HOME_GARDEN: "home-garden",
  SPORTS: "sports",
  AUTOMOTIVE: "automotive",
  FOOD_BEVERAGE: "food-beverage",
  HEALTH_BEAUTY: "health-beauty",
  OTHER: "other",
};

export const API_ENDPOINTS = {
  USERS: "/api/users",
  ORDERS: "/api/orders",
  INVENTORY: "/api/inventory",
  ANALYTICS: "/api/analytics",
  REPORTS: "/api/reports",
  STAFF: "/api/staff",
  ALERTS: "/api/alerts",
  METRICS: "/api/metrics",
};
