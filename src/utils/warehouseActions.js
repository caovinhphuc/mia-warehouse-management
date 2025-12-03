/**
 * Comprehensive Warehouse Actions
 * Centralized action creators for all warehouse operations
 *
 * @module utils/warehouseActions
 */

import { API_CONFIG } from "./constants";

// ==================== ACTION TYPES ====================
export const ActionTypes = {
  // User Management
  USER_LOGIN_REQUEST: "USER_LOGIN_REQUEST",
  USER_LOGIN_SUCCESS: "USER_LOGIN_SUCCESS",
  USER_LOGIN_FAILURE: "USER_LOGIN_FAILURE",
  USER_LOGOUT: "USER_LOGOUT",
  USER_UPDATE_PROFILE: "USER_UPDATE_PROFILE",

  // Order Management
  ORDER_FETCH_ALL: "ORDER_FETCH_ALL",
  ORDER_FETCH_BY_ID: "ORDER_FETCH_BY_ID",
  ORDER_CREATE: "ORDER_CREATE",
  ORDER_UPDATE: "ORDER_UPDATE",
  ORDER_DELETE: "ORDER_DELETE",
  ORDER_UPDATE_STATUS: "ORDER_UPDATE_STATUS",
  ORDER_BULK_UPDATE: "ORDER_BULK_UPDATE",

  // Inventory Management
  INVENTORY_FETCH_ALL: "INVENTORY_FETCH_ALL",
  INVENTORY_FETCH_BY_ID: "INVENTORY_FETCH_BY_ID",
  INVENTORY_CREATE: "INVENTORY_CREATE",
  INVENTORY_UPDATE: "INVENTORY_UPDATE",
  INVENTORY_DELETE: "INVENTORY_DELETE",
  INVENTORY_BULK_UPDATE: "INVENTORY_BULK_UPDATE",
  INVENTORY_ADJUST_STOCK: "INVENTORY_ADJUST_STOCK",

  // Staff Management
  STAFF_FETCH_ALL: "STAFF_FETCH_ALL",
  STAFF_FETCH_BY_ID: "STAFF_FETCH_BY_ID",
  STAFF_CREATE: "STAFF_CREATE",
  STAFF_UPDATE: "STAFF_UPDATE",
  STAFF_DELETE: "STAFF_DELETE",
  STAFF_UPDATE_STATUS: "STAFF_UPDATE_STATUS",

  // Analytics
  ANALYTICS_FETCH_DASHBOARD: "ANALYTICS_FETCH_DASHBOARD",
  ANALYTICS_FETCH_REPORTS: "ANALYTICS_FETCH_REPORTS",
  ANALYTICS_FETCH_METRICS: "ANALYTICS_FETCH_METRICS",

  // Alerts
  ALERT_CREATE: "ALERT_CREATE",
  ALERT_UPDATE: "ALERT_UPDATE",
  ALERT_RESOLVE: "ALERT_RESOLVE",
  ALERT_FETCH_ALL: "ALERT_FETCH_ALL",

  // System
  SYSTEM_SET_LOADING: "SYSTEM_SET_LOADING",
  SYSTEM_SET_ERROR: "SYSTEM_SET_ERROR",
  SYSTEM_CLEAR_ERROR: "SYSTEM_CLEAR_ERROR",
  SYSTEM_UPDATE_STATUS: "SYSTEM_UPDATE_STATUS",
};

// ==================== API HELPER FUNCTIONS ====================

/**
 * Generic API request function with error handling
 */
const apiRequest = async (endpoint, options = {}) => {
  const {
    method = "GET",
    data = null,
    headers = {},
    timeout = API_CONFIG.TIMEOUT,
  } = options;

  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    signal: AbortSignal.timeout(timeout),
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};

// ==================== USER ACTIONS ====================

export const userActions = {
  login: (credentials) => async (dispatch) => {
    dispatch({ type: ActionTypes.USER_LOGIN_REQUEST });

    try {
      // Use Google Sheets auth endpoint
      const response = await fetch(API_CONFIG.GOOGLE_SHEETS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (result.success) {
        dispatch({
          type: ActionTypes.USER_LOGIN_SUCCESS,
          payload: result.user,
        });
        return { success: true, user: result.user };
      } else {
        dispatch({
          type: ActionTypes.USER_LOGIN_FAILURE,
          payload: result.message,
        });
        return { success: false, error: result.message };
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.USER_LOGIN_FAILURE,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  },

  logout: () => (dispatch) => {
    // Clear storage
    localStorage.removeItem("mia-warehouse-token");
    localStorage.removeItem("mia-warehouse-user");
    sessionStorage.clear();

    dispatch({ type: ActionTypes.USER_LOGOUT });
  },

  updateProfile: (profileData) => async (dispatch) => {
    try {
      const result = await apiRequest("/users/profile", {
        method: "PUT",
        data: profileData,
      });

      dispatch({
        type: ActionTypes.USER_UPDATE_PROFILE,
        payload: result.user,
      });

      return { success: true, user: result.user };
    } catch (error) {
      dispatch({
        type: ActionTypes.SYSTEM_SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  },
};

// ==================== ORDER ACTIONS ====================

export const orderActions = {
  fetchAll:
    (params = {}) =>
    async (dispatch) => {
      dispatch({ type: ActionTypes.SYSTEM_SET_LOADING, payload: true });

      try {
        const result = await apiRequest("/orders", {
          method: "GET",
          data: params,
        });

        dispatch({
          type: ActionTypes.ORDER_FETCH_ALL,
          payload: result.orders || [],
        });

        return { success: true, orders: result.orders };
      } catch (error) {
        dispatch({
          type: ActionTypes.SYSTEM_SET_ERROR,
          payload: error.message,
        });
        return { success: false, error: error.message };
      } finally {
        dispatch({ type: ActionTypes.SYSTEM_SET_LOADING, payload: false });
      }
    },

  fetchById: (orderId) => async (dispatch) => {
    try {
      const result = await apiRequest(`/orders/${orderId}`);

      dispatch({
        type: ActionTypes.ORDER_FETCH_BY_ID,
        payload: result.order,
      });

      return { success: true, order: result.order };
    } catch (error) {
      dispatch({
        type: ActionTypes.SYSTEM_SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  },

  create: (orderData) => async (dispatch) => {
    try {
      const result = await apiRequest("/orders", {
        method: "POST",
        data: orderData,
      });

      dispatch({
        type: ActionTypes.ORDER_CREATE,
        payload: result.order,
      });

      return { success: true, order: result.order };
    } catch (error) {
      dispatch({
        type: ActionTypes.SYSTEM_SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  },

  update: (orderId, orderData) => async (dispatch) => {
    try {
      const result = await apiRequest(`/orders/${orderId}`, {
        method: "PUT",
        data: orderData,
      });

      dispatch({
        type: ActionTypes.ORDER_UPDATE,
        payload: result.order,
      });

      return { success: true, order: result.order };
    } catch (error) {
      dispatch({
        type: ActionTypes.SYSTEM_SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  },

  updateStatus: (orderId, status) => async (dispatch) => {
    try {
      const result = await apiRequest(`/orders/${orderId}/status`, {
        method: "PATCH",
        data: { status },
      });

      dispatch({
        type: ActionTypes.ORDER_UPDATE_STATUS,
        payload: { orderId, status },
      });

      return { success: true, order: result.order };
    } catch (error) {
      dispatch({
        type: ActionTypes.SYSTEM_SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  },

  bulkUpdate: (orderIds, updates) => async (dispatch) => {
    try {
      const result = await apiRequest("/orders/bulk", {
        method: "PUT",
        data: { orderIds, updates },
      });

      dispatch({
        type: ActionTypes.ORDER_BULK_UPDATE,
        payload: result.orders,
      });

      return { success: true, orders: result.orders };
    } catch (error) {
      dispatch({
        type: ActionTypes.SYSTEM_SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  },

  delete: (orderId) => async (dispatch) => {
    try {
      await apiRequest(`/orders/${orderId}`, {
        method: "DELETE",
      });

      dispatch({
        type: ActionTypes.ORDER_DELETE,
        payload: orderId,
      });

      return { success: true };
    } catch (error) {
      dispatch({
        type: ActionTypes.SYSTEM_SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  },
};

// ==================== INVENTORY ACTIONS ====================

export const inventoryActions = {
  fetchAll:
    (params = {}) =>
    async (dispatch) => {
      dispatch({ type: ActionTypes.SYSTEM_SET_LOADING, payload: true });

      try {
        const result = await apiRequest("/inventory", {
          method: "GET",
          data: params,
        });

        dispatch({
          type: ActionTypes.INVENTORY_FETCH_ALL,
          payload: result.items || [],
        });

        return { success: true, items: result.items };
      } catch (error) {
        dispatch({
          type: ActionTypes.SYSTEM_SET_ERROR,
          payload: error.message,
        });
        return { success: false, error: error.message };
      } finally {
        dispatch({ type: ActionTypes.SYSTEM_SET_LOADING, payload: false });
      }
    },

  fetchById: (itemId) => async (dispatch) => {
    try {
      const result = await apiRequest(`/inventory/${itemId}`);

      dispatch({
        type: ActionTypes.INVENTORY_FETCH_BY_ID,
        payload: result.item,
      });

      return { success: true, item: result.item };
    } catch (error) {
      dispatch({
        type: ActionTypes.SYSTEM_SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  },

  create: (itemData) => async (dispatch) => {
    try {
      const result = await apiRequest("/inventory", {
        method: "POST",
        data: itemData,
      });

      dispatch({
        type: ActionTypes.INVENTORY_CREATE,
        payload: result.item,
      });

      return { success: true, item: result.item };
    } catch (error) {
      dispatch({
        type: ActionTypes.SYSTEM_SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  },

  update: (itemId, itemData) => async (dispatch) => {
    try {
      const result = await apiRequest(`/inventory/${itemId}`, {
        method: "PUT",
        data: itemData,
      });

      dispatch({
        type: ActionTypes.INVENTORY_UPDATE,
        payload: result.item,
      });

      return { success: true, item: result.item };
    } catch (error) {
      dispatch({
        type: ActionTypes.SYSTEM_SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  },

  adjustStock: (itemId, adjustment) => async (dispatch) => {
    try {
      const result = await apiRequest(`/inventory/${itemId}/adjust`, {
        method: "POST",
        data: adjustment,
      });

      dispatch({
        type: ActionTypes.INVENTORY_ADJUST_STOCK,
        payload: result.item,
      });

      return { success: true, item: result.item };
    } catch (error) {
      dispatch({
        type: ActionTypes.SYSTEM_SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  },

  bulkUpdate: (itemIds, updates) => async (dispatch) => {
    try {
      const result = await apiRequest("/inventory/bulk", {
        method: "PUT",
        data: { itemIds, updates },
      });

      dispatch({
        type: ActionTypes.INVENTORY_BULK_UPDATE,
        payload: result.items,
      });

      return { success: true, items: result.items };
    } catch (error) {
      dispatch({
        type: ActionTypes.SYSTEM_SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  },

  delete: (itemId) => async (dispatch) => {
    try {
      await apiRequest(`/inventory/${itemId}`, {
        method: "DELETE",
      });

      dispatch({
        type: ActionTypes.INVENTORY_DELETE,
        payload: itemId,
      });

      return { success: true };
    } catch (error) {
      dispatch({
        type: ActionTypes.SYSTEM_SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  },
};

// ==================== STAFF ACTIONS ====================

export const staffActions = {
  fetchAll: () => async (dispatch) => {
    dispatch({ type: ActionTypes.SYSTEM_SET_LOADING, payload: true });

    try {
      const result = await apiRequest("/staff");

      dispatch({
        type: ActionTypes.STAFF_FETCH_ALL,
        payload: result.staff || [],
      });

      return { success: true, staff: result.staff };
    } catch (error) {
      dispatch({
        type: ActionTypes.SYSTEM_SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: ActionTypes.SYSTEM_SET_LOADING, payload: false });
    }
  },

  create: (staffData) => async (dispatch) => {
    try {
      const result = await apiRequest("/staff", {
        method: "POST",
        data: staffData,
      });

      dispatch({
        type: ActionTypes.STAFF_CREATE,
        payload: result.staff,
      });

      return { success: true, staff: result.staff };
    } catch (error) {
      dispatch({
        type: ActionTypes.SYSTEM_SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  },

  update: (staffId, staffData) => async (dispatch) => {
    try {
      const result = await apiRequest(`/staff/${staffId}`, {
        method: "PUT",
        data: staffData,
      });

      dispatch({
        type: ActionTypes.STAFF_UPDATE,
        payload: result.staff,
      });

      return { success: true, staff: result.staff };
    } catch (error) {
      dispatch({
        type: ActionTypes.SYSTEM_SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  },

  updateStatus: (staffId, status) => async (dispatch) => {
    try {
      const result = await apiRequest(`/staff/${staffId}/status`, {
        method: "PATCH",
        data: { status },
      });

      dispatch({
        type: ActionTypes.STAFF_UPDATE_STATUS,
        payload: { staffId, status },
      });

      return { success: true, staff: result.staff };
    } catch (error) {
      dispatch({
        type: ActionTypes.SYSTEM_SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  },
};

// ==================== ANALYTICS ACTIONS ====================

export const analyticsActions = {
  fetchDashboard: () => async (dispatch) => {
    try {
      const result = await apiRequest("/analytics/dashboard");

      dispatch({
        type: ActionTypes.ANALYTICS_FETCH_DASHBOARD,
        payload: result.data,
      });

      return { success: true, data: result.data };
    } catch (error) {
      dispatch({
        type: ActionTypes.SYSTEM_SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  },

  fetchMetrics:
    (timeRange = "7d") =>
    async (dispatch) => {
      try {
        const result = await apiRequest(
          `/analytics/metrics?range=${timeRange}`
        );

        dispatch({
          type: ActionTypes.ANALYTICS_FETCH_METRICS,
          payload: result.metrics,
        });

        return { success: true, metrics: result.metrics };
      } catch (error) {
        dispatch({
          type: ActionTypes.SYSTEM_SET_ERROR,
          payload: error.message,
        });
        return { success: false, error: error.message };
      }
    },

  fetchReports:
    (reportType, params = {}) =>
    async (dispatch) => {
      try {
        const queryParams = new URLSearchParams(params).toString();
        const result = await apiRequest(
          `/analytics/reports/${reportType}?${queryParams}`
        );

        dispatch({
          type: ActionTypes.ANALYTICS_FETCH_REPORTS,
          payload: { reportType, data: result.data },
        });

        return { success: true, data: result.data };
      } catch (error) {
        dispatch({
          type: ActionTypes.SYSTEM_SET_ERROR,
          payload: error.message,
        });
        return { success: false, error: error.message };
      }
    },
};

// ==================== ALERT ACTIONS ====================

export const alertActions = {
  fetchAll: () => async (dispatch) => {
    try {
      const result = await apiRequest("/alerts");

      dispatch({
        type: ActionTypes.ALERT_FETCH_ALL,
        payload: result.alerts || [],
      });

      return { success: true, alerts: result.alerts };
    } catch (error) {
      dispatch({
        type: ActionTypes.SYSTEM_SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  },

  create: (alertData) => async (dispatch) => {
    try {
      const result = await apiRequest("/alerts", {
        method: "POST",
        data: alertData,
      });

      dispatch({
        type: ActionTypes.ALERT_CREATE,
        payload: result.alert,
      });

      return { success: true, alert: result.alert };
    } catch (error) {
      dispatch({
        type: ActionTypes.SYSTEM_SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  },

  resolve: (alertId, resolution) => async (dispatch) => {
    try {
      const result = await apiRequest(`/alerts/${alertId}/resolve`, {
        method: "POST",
        data: { resolution },
      });

      dispatch({
        type: ActionTypes.ALERT_RESOLVE,
        payload: { alertId, resolution },
      });

      return { success: true, alert: result.alert };
    } catch (error) {
      dispatch({
        type: ActionTypes.SYSTEM_SET_ERROR,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  },
};

// ==================== SYSTEM ACTIONS ====================

export const systemActions = {
  setLoading: (isLoading) => ({
    type: ActionTypes.SYSTEM_SET_LOADING,
    payload: isLoading,
  }),

  setError: (error) => ({
    type: ActionTypes.SYSTEM_SET_ERROR,
    payload: error,
  }),

  clearError: () => ({
    type: ActionTypes.SYSTEM_CLEAR_ERROR,
  }),

  updateStatus: (status) => ({
    type: ActionTypes.SYSTEM_UPDATE_STATUS,
    payload: status,
  }),
};

// ==================== EXPORT ALL ACTIONS ====================

export const warehouseActions = {
  user: userActions,
  order: orderActions,
  inventory: inventoryActions,
  staff: staffActions,
  analytics: analyticsActions,
  alert: alertActions,
  system: systemActions,
};

export default warehouseActions;
