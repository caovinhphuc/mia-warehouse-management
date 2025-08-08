/**
 * Metrics Context Provider for warehouse management application
 * Provides real-time metrics and analytics data throughout the app
 * 
 * @module utils/MetricsContext
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// ==================== CONTEXT DEFINITION ====================
const MetricsContext = createContext();

// ==================== INITIAL STATE ====================
const initialState = {
  // Real-time metrics
  realTimeMetrics: {
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    activeStaff: 0,
    inventoryValue: 0,
    lowStockItems: 0,
    criticalAlerts: 0,
  },
  
  // Business KPIs
  businessKPIs: {
    orderFulfillmentRate: 0,
    averageOrderProcessingTime: 0,
    inventoryTurnoverRate: 0,
    customerSatisfactionScore: 0,
    warehouseUtilization: 0,
    costPerOrder: 0,
    revenuePerDay: 0,
  },

  // Performance metrics
  performanceMetrics: {
    systemUptime: 100,
    averageResponseTime: 0,
    errorRate: 0,
    throughputPerHour: 0,
    memoryUsage: 0,
    cpuUsage: 0,
  },

  // Staff productivity
  staffMetrics: {
    totalStaff: 0,
    activeStaff: 0,
    staffProductivity: 0,
    averagePickingTime: 0,
    staffUtilization: 0,
    trainingCompletionRate: 0,
  },

  // Operational metrics
  operationalMetrics: {
    totalSkus: 0,
    inStock: 0,
    outOfStock: 0,
    averageStorageTime: 0,
    pickingAccuracy: 0,
    shippingAccuracy: 0,
    returnRate: 0,
  },

  // Trends and analytics
  trends: {
    orderTrends: [],
    inventoryTrends: [],
    staffProductivityTrends: [],
    errorTrends: [],
  },

  // Loading states
  loading: {
    realTimeMetrics: false,
    businessKPIs: false,
    performanceMetrics: false,
    staffMetrics: false,
    operationalMetrics: false,
  },

  // Error states
  errors: {
    realTimeMetrics: null,
    businessKPIs: null,
    performanceMetrics: null,
    staffMetrics: null,
    operationalMetrics: null,
  },

  // Last updated timestamps
  lastUpdated: {
    realTimeMetrics: null,
    businessKPIs: null,
    performanceMetrics: null,
    staffMetrics: null,
    operationalMetrics: null,
  },
};

// ==================== ACTION TYPES ====================
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  UPDATE_REAL_TIME_METRICS: 'UPDATE_REAL_TIME_METRICS',
  UPDATE_BUSINESS_KPIS: 'UPDATE_BUSINESS_KPIS',
  UPDATE_PERFORMANCE_METRICS: 'UPDATE_PERFORMANCE_METRICS',
  UPDATE_STAFF_METRICS: 'UPDATE_STAFF_METRICS',
  UPDATE_OPERATIONAL_METRICS: 'UPDATE_OPERATIONAL_METRICS',
  ADD_TREND_DATA: 'ADD_TREND_DATA',
  RESET_METRICS: 'RESET_METRICS',
};

// ==================== REDUCER ====================
const metricsReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.category]: action.loading,
        },
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.category]: action.error,
        },
        loading: {
          ...state.loading,
          [action.category]: false,
        },
      };

    case ActionTypes.UPDATE_REAL_TIME_METRICS:
      return {
        ...state,
        realTimeMetrics: {
          ...state.realTimeMetrics,
          ...action.metrics,
        },
        lastUpdated: {
          ...state.lastUpdated,
          realTimeMetrics: new Date().toISOString(),
        },
        errors: {
          ...state.errors,
          realTimeMetrics: null,
        },
        loading: {
          ...state.loading,
          realTimeMetrics: false,
        },
      };

    case ActionTypes.UPDATE_BUSINESS_KPIS:
      return {
        ...state,
        businessKPIs: {
          ...state.businessKPIs,
          ...action.kpis,
        },
        lastUpdated: {
          ...state.lastUpdated,
          businessKPIs: new Date().toISOString(),
        },
        errors: {
          ...state.errors,
          businessKPIs: null,
        },
        loading: {
          ...state.loading,
          businessKPIs: false,
        },
      };

    case ActionTypes.UPDATE_PERFORMANCE_METRICS:
      return {
        ...state,
        performanceMetrics: {
          ...state.performanceMetrics,
          ...action.metrics,
        },
        lastUpdated: {
          ...state.lastUpdated,
          performanceMetrics: new Date().toISOString(),
        },
        errors: {
          ...state.errors,
          performanceMetrics: null,
        },
        loading: {
          ...state.loading,
          performanceMetrics: false,
        },
      };

    case ActionTypes.UPDATE_STAFF_METRICS:
      return {
        ...state,
        staffMetrics: {
          ...state.staffMetrics,
          ...action.metrics,
        },
        lastUpdated: {
          ...state.lastUpdated,
          staffMetrics: new Date().toISOString(),
        },
        errors: {
          ...state.errors,
          staffMetrics: null,
        },
        loading: {
          ...state.loading,
          staffMetrics: false,
        },
      };

    case ActionTypes.UPDATE_OPERATIONAL_METRICS:
      return {
        ...state,
        operationalMetrics: {
          ...state.operationalMetrics,
          ...action.metrics,
        },
        lastUpdated: {
          ...state.lastUpdated,
          operationalMetrics: new Date().toISOString(),
        },
        errors: {
          ...state.errors,
          operationalMetrics: null,
        },
        loading: {
          ...state.loading,
          operationalMetrics: false,
        },
      };

    case ActionTypes.ADD_TREND_DATA:
      return {
        ...state,
        trends: {
          ...state.trends,
          [action.trendType]: [
            ...state.trends[action.trendType],
            {
              ...action.data,
              timestamp: new Date().toISOString(),
            },
          ].slice(-100), // Keep last 100 data points
        },
      };

    case ActionTypes.RESET_METRICS:
      return initialState;

    default:
      return state;
  }
};

// ==================== PROVIDER COMPONENT ====================
export const MetricsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(metricsReducer, initialState);

  // ==================== UTILITY FUNCTIONS ====================
  const setLoading = useCallback((category, loading) => {
    dispatch({ type: ActionTypes.SET_LOADING, category, loading });
  }, []);

  const setError = useCallback((category, error) => {
    dispatch({ type: ActionTypes.SET_ERROR, category, error });
  }, []);

  // ==================== METRICS UPDATE FUNCTIONS ====================
  const updateRealTimeMetrics = useCallback((metrics) => {
    dispatch({ type: ActionTypes.UPDATE_REAL_TIME_METRICS, metrics });
  }, []);

  const updateBusinessKPIs = useCallback((kpis) => {
    dispatch({ type: ActionTypes.UPDATE_BUSINESS_KPIS, kpis });
  }, []);

  const updatePerformanceMetrics = useCallback((metrics) => {
    dispatch({ type: ActionTypes.UPDATE_PERFORMANCE_METRICS, metrics });
  }, []);

  const updateStaffMetrics = useCallback((metrics) => {
    dispatch({ type: ActionTypes.UPDATE_STAFF_METRICS, metrics });
  }, []);

  const updateOperationalMetrics = useCallback((metrics) => {
    dispatch({ type: ActionTypes.UPDATE_OPERATIONAL_METRICS, metrics });
  }, []);

  const addTrendData = useCallback((trendType, data) => {
    dispatch({ type: ActionTypes.ADD_TREND_DATA, trendType, data });
  }, []);

  // ==================== DATA FETCHING FUNCTIONS ====================
  const fetchRealTimeMetrics = useCallback(async () => {
    setLoading('realTimeMetrics', true);
    try {
      // Mock real-time metrics - in production, this would be API calls
      const mockMetrics = {
        totalOrders: Math.floor(Math.random() * 1000) + 500,
        completedOrders: Math.floor(Math.random() * 800) + 400,
        pendingOrders: Math.floor(Math.random() * 200) + 50,
        activeStaff: Math.floor(Math.random() * 50) + 20,
        inventoryValue: Math.floor(Math.random() * 1000000) + 500000,
        lowStockItems: Math.floor(Math.random() * 20) + 5,
        criticalAlerts: Math.floor(Math.random() * 5),
      };

      updateRealTimeMetrics(mockMetrics);
      
      // Add to trends
      addTrendData('orderTrends', {
        totalOrders: mockMetrics.totalOrders,
        completedOrders: mockMetrics.completedOrders,
      });

    } catch (error) {
      setError('realTimeMetrics', error.message);
    }
  }, [updateRealTimeMetrics, addTrendData, setLoading, setError]);

  const fetchBusinessKPIs = useCallback(async () => {
    setLoading('businessKPIs', true);
    try {
      // Mock business KPIs
      const mockKPIs = {
        orderFulfillmentRate: Math.round((Math.random() * 20 + 80) * 100) / 100,
        averageOrderProcessingTime: Math.round((Math.random() * 10 + 15) * 100) / 100,
        inventoryTurnoverRate: Math.round((Math.random() * 5 + 8) * 100) / 100,
        customerSatisfactionScore: Math.round((Math.random() * 20 + 80) * 100) / 100,
        warehouseUtilization: Math.round((Math.random() * 30 + 60) * 100) / 100,
        costPerOrder: Math.round((Math.random() * 10 + 5) * 100) / 100,
        revenuePerDay: Math.floor(Math.random() * 50000) + 25000,
      };

      updateBusinessKPIs(mockKPIs);
    } catch (error) {
      setError('businessKPIs', error.message);
    }
  }, [updateBusinessKPIs, setLoading, setError]);

  const fetchPerformanceMetrics = useCallback(async () => {
    setLoading('performanceMetrics', true);
    try {
      // Mock performance metrics
      const mockMetrics = {
        systemUptime: Math.round((Math.random() * 5 + 95) * 100) / 100,
        averageResponseTime: Math.round((Math.random() * 200 + 100) * 100) / 100,
        errorRate: Math.round((Math.random() * 2) * 100) / 100,
        throughputPerHour: Math.floor(Math.random() * 1000) + 500,
        memoryUsage: Math.round((Math.random() * 30 + 40) * 100) / 100,
        cpuUsage: Math.round((Math.random() * 40 + 20) * 100) / 100,
      };

      updatePerformanceMetrics(mockMetrics);
    } catch (error) {
      setError('performanceMetrics', error.message);
    }
  }, [updatePerformanceMetrics, setLoading, setError]);

  const fetchStaffMetrics = useCallback(async () => {
    setLoading('staffMetrics', true);
    try {
      // Mock staff metrics
      const mockMetrics = {
        totalStaff: Math.floor(Math.random() * 30) + 50,
        activeStaff: Math.floor(Math.random() * 25) + 35,
        staffProductivity: Math.round((Math.random() * 20 + 75) * 100) / 100,
        averagePickingTime: Math.round((Math.random() * 5 + 8) * 100) / 100,
        staffUtilization: Math.round((Math.random() * 25 + 70) * 100) / 100,
        trainingCompletionRate: Math.round((Math.random() * 15 + 80) * 100) / 100,
      };

      updateStaffMetrics(mockMetrics);
      
      // Add to trends
      addTrendData('staffProductivityTrends', {
        productivity: mockMetrics.staffProductivity,
        utilization: mockMetrics.staffUtilization,
      });

    } catch (error) {
      setError('staffMetrics', error.message);
    }
  }, [updateStaffMetrics, addTrendData, setLoading, setError]);

  const fetchOperationalMetrics = useCallback(async () => {
    setLoading('operationalMetrics', true);
    try {
      // Mock operational metrics
      const mockMetrics = {
        totalSkus: Math.floor(Math.random() * 1000) + 2000,
        inStock: Math.floor(Math.random() * 900) + 1800,
        outOfStock: Math.floor(Math.random() * 100) + 50,
        averageStorageTime: Math.round((Math.random() * 10 + 15) * 100) / 100,
        pickingAccuracy: Math.round((Math.random() * 5 + 95) * 100) / 100,
        shippingAccuracy: Math.round((Math.random() * 3 + 97) * 100) / 100,
        returnRate: Math.round((Math.random() * 3 + 1) * 100) / 100,
      };

      updateOperationalMetrics(mockMetrics);
      
      // Add to trends
      addTrendData('inventoryTrends', {
        totalSkus: mockMetrics.totalSkus,
        inStock: mockMetrics.inStock,
        outOfStock: mockMetrics.outOfStock,
      });

    } catch (error) {
      setError('operationalMetrics', error.message);
    }
  }, [updateOperationalMetrics, addTrendData, setLoading, setError]);

  // ==================== CALCULATED METRICS ====================
  const getCalculatedMetrics = useCallback(() => {
    const { realTimeMetrics, businessKPIs, performanceMetrics, staffMetrics, operationalMetrics } = state;

    return {
      // Efficiency Scores
      overallEfficiency: Math.round(
        (businessKPIs.orderFulfillmentRate * 0.3 +
         performanceMetrics.systemUptime * 0.2 +
         staffMetrics.staffProductivity * 0.3 +
         operationalMetrics.pickingAccuracy * 0.2) * 100
      ) / 100,

      // Health Score
      systemHealthScore: Math.round(
        (performanceMetrics.systemUptime * 0.4 +
         (100 - performanceMetrics.errorRate) * 0.3 +
         (businessKPIs.customerSatisfactionScore) * 0.3) * 100
      ) / 100,

      // Productivity Index
      productivityIndex: Math.round(
        (staffMetrics.staffProductivity * 0.4 +
         businessKPIs.warehouseUtilization * 0.3 +
         operationalMetrics.pickingAccuracy * 0.3) * 100
      ) / 100,

      // Alert Priority Score
      alertPriorityScore: Math.min(
        realTimeMetrics.criticalAlerts * 20 +
        realTimeMetrics.lowStockItems * 5 +
        (100 - performanceMetrics.systemUptime) * 10,
        100
      ),
    };
  }, [state]);

  // ==================== REFRESH ALL METRICS ====================
  const refreshAllMetrics = useCallback(async () => {
    await Promise.all([
      fetchRealTimeMetrics(),
      fetchBusinessKPIs(),
      fetchPerformanceMetrics(),
      fetchStaffMetrics(),
      fetchOperationalMetrics(),
    ]);
  }, [
    fetchRealTimeMetrics,
    fetchBusinessKPIs,
    fetchPerformanceMetrics,
    fetchStaffMetrics,
    fetchOperationalMetrics,
  ]);

  // ==================== AUTO-REFRESH SETUP ====================
  useEffect(() => {
    // Initial load
    refreshAllMetrics();

    // Set up intervals for different refresh rates
    const realTimeInterval = setInterval(fetchRealTimeMetrics, 30000); // 30 seconds
    const performanceInterval = setInterval(fetchPerformanceMetrics, 60000); // 1 minute
    const businessInterval = setInterval(fetchBusinessKPIs, 300000); // 5 minutes
    const staffInterval = setInterval(fetchStaffMetrics, 120000); // 2 minutes
    const operationalInterval = setInterval(fetchOperationalMetrics, 180000); // 3 minutes

    return () => {
      clearInterval(realTimeInterval);
      clearInterval(performanceInterval);
      clearInterval(businessInterval);
      clearInterval(staffInterval);
      clearInterval(operationalInterval);
    };
  }, [refreshAllMetrics, fetchRealTimeMetrics, fetchPerformanceMetrics, 
      fetchBusinessKPIs, fetchStaffMetrics, fetchOperationalMetrics]);

  // ==================== CONTEXT VALUE ====================
  const contextValue = {
    // State
    ...state,
    
    // Calculated metrics
    calculatedMetrics: getCalculatedMetrics(),
    
    // Actions
    updateRealTimeMetrics,
    updateBusinessKPIs,
    updatePerformanceMetrics,
    updateStaffMetrics,
    updateOperationalMetrics,
    addTrendData,
    
    // Fetch functions
    fetchRealTimeMetrics,
    fetchBusinessKPIs,
    fetchPerformanceMetrics,
    fetchStaffMetrics,
    fetchOperationalMetrics,
    refreshAllMetrics,
    
    // Utility
    setLoading,
    setError,
  };

  return (
    <MetricsContext.Provider value={contextValue}>
      {children}
    </MetricsContext.Provider>
  );
};

// ==================== HOOK ====================
export const useMetrics = () => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error('useMetrics must be used within a MetricsProvider');
  }
  return context;
};

export default MetricsContext;