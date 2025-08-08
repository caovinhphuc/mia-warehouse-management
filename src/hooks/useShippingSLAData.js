/**
 * Real-time Data Hook for Shipping SLA
 * Quản lý state và real-time updates
 */
import { useState, useEffect, useCallback } from 'react';
import shippingSLAService from '../services/shippingSLAService';

export const useShippingSLAData = (
  autoRefresh = true,
  refreshInterval = 60000
) => {
  const [state, setState] = useState({
    // Orders data
    orders: [],
    filteredOrders: [],

    // Statistics
    stats: {
      totalOrders: 0,
      totalValue: 0,
      expired: 0,
      warning: 0,
      safe: 0,
      platforms: {},
      carriers: {},
      avgTimeRemaining: 0,
    },

    // UI state
    loading: false,
    error: null,
    lastUpdated: null,

    // Filters and sorting
    filters: {
      platform: 'all',
      carrier: 'all',
      status: 'all',
      timeRemaining: 'all',
      searchQuery: '',
      orderValue: { min: '', max: '' },
      dateRange: { start: '', end: '' },
    },
    sortConfig: {
      field: 'timeRemaining',
      direction: 'asc',
    },

    // Selection
    selectedOrders: [],

    // Other data
    carriers: [],
    slaConfig: {},

    // Data quality
    dataQuality: {
      total: 0,
      clean: 0,
      errors: 0,
      duplicates: 0,
    },
  });

  // Update filters
  const updateFilter = useCallback((filterName, value) => {
    setState((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterName]: value,
      },
    }));
  }, []);

  // Update sort config
  const updateSortConfig = useCallback((field, direction) => {
    setState((prev) => ({
      ...prev,
      sortConfig: { field, direction },
    }));
  }, []);

  // Update selected orders
  const updateSelectedOrders = useCallback((selectedOrders) => {
    setState((prev) => ({
      ...prev,
      selectedOrders,
    }));
  }, []);

  // Apply filters and sorting to orders
  const applyFiltersAndSorting = useCallback((orders, filters, sortConfig) => {
    let filtered = [...orders];

    // Apply filters
    if (filters.platform !== 'all') {
      filtered = filtered.filter(
        (order) => order.platform === filters.platform
      );
    }

    if (filters.carrier !== 'all') {
      filtered = filtered.filter(
        (order) => order.suggestedCarrier === filters.carrier
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(
        (order) => order.slaStatus?.level === filters.status
      );
    }

    if (filters.timeRemaining !== 'all') {
      switch (filters.timeRemaining) {
        case 'expired':
          filtered = filtered.filter((order) => order.timeRemaining <= 0);
          break;
        case 'urgent':
          filtered = filtered.filter(
            (order) => order.timeRemaining > 0 && order.timeRemaining <= 2
          );
          break;
        case 'soon':
          filtered = filtered.filter(
            (order) => order.timeRemaining > 2 && order.timeRemaining <= 6
          );
          break;
        case 'safe':
          filtered = filtered.filter((order) => order.timeRemaining > 6);
          break;
        default:
          // No additional filtering for unknown values
          break;
      }
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(query) ||
          (order.customerName &&
            order.customerName.toLowerCase().includes(query))
      );
    }

    if (filters.orderValue.min !== '' || filters.orderValue.max !== '') {
      const min = parseFloat(filters.orderValue.min) || 0;
      const max = parseFloat(filters.orderValue.max) || Infinity;
      filtered = filtered.filter(
        (order) => order.orderValue >= min && order.orderValue <= max
      );
    }

    if (filters.dateRange.start !== '' || filters.dateRange.end !== '') {
      const startDate = filters.dateRange.start
        ? new Date(filters.dateRange.start)
        : new Date(0);
      const endDate = filters.dateRange.end
        ? new Date(filters.dateRange.end)
        : new Date();

      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.orderTime);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const { field, direction } = sortConfig;
      let aValue = a[field];
      let bValue = b[field];

      if (
        field === 'timeRemaining' ||
        field === 'orderValue' ||
        field === 'priority'
      ) {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, []);

  // Load data from API
  const loadData = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) {
          setState((prev) => ({ ...prev, loading: true, error: null }));
        }

        const [ordersResponse, carriersResponse, statsResponse] =
          await Promise.all([
            shippingSLAService.getOrders(state.filters),
            shippingSLAService.getCarriers(),
            shippingSLAService.getStats(),
          ]);

        const orders = shippingSLAService.processOrdersData(
          ordersResponse.data?.orders || []
        );
        const filteredOrders = applyFiltersAndSorting(
          orders,
          state.filters,
          state.sortConfig
        );

        setState((prev) => ({
          ...prev,
          orders,
          filteredOrders,
          stats: statsResponse.data || prev.stats,
          carriers: carriersResponse.data || [],
          loading: false,
          lastUpdated: new Date(),
          dataQuality: {
            total: orders.length,
            clean: orders.length,
            errors: 0,
            duplicates: 0,
          },
        }));
      } catch (error) {
        console.error('Failed to load data:', error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message || 'Failed to load data',
        }));
      }
    },
    [state.filters, state.sortConfig, applyFiltersAndSorting]
  );

  // Load demo data
  const loadDemoData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await shippingSLAService.loadDemoData();
      const orders = shippingSLAService.processOrdersData(
        response.data?.orders || []
      );
      const filteredOrders = applyFiltersAndSorting(
        orders,
        state.filters,
        state.sortConfig
      );

      setState((prev) => ({
        ...prev,
        orders,
        filteredOrders,
        loading: false,
        lastUpdated: new Date(),
        dataQuality: {
          total: orders.length,
          clean: orders.length,
          errors: 0,
          duplicates: 0,
        },
      }));

      return response;
    } catch (error) {
      console.error('Failed to load demo data:', error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load demo data',
      }));
      throw error;
    }
  }, [state.filters, state.sortConfig, applyFiltersAndSorting]);

  // Upload orders file
  const uploadOrdersFile = useCallback(
    async (file) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const response = await shippingSLAService.uploadOrdersFile(file);
        const orders = shippingSLAService.processOrdersData(
          response.data?.orders || []
        );
        const filteredOrders = applyFiltersAndSorting(
          orders,
          state.filters,
          state.sortConfig
        );

        setState((prev) => ({
          ...prev,
          orders,
          filteredOrders,
          loading: false,
          lastUpdated: new Date(),
          dataQuality: {
            total: orders.length,
            clean: orders.length,
            errors: 0,
            duplicates: 0,
          },
        }));

        return response;
      } catch (error) {
        console.error('Failed to upload file:', error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message || 'Failed to upload file',
        }));
        throw error;
      }
    },
    [state.filters, state.sortConfig, applyFiltersAndSorting]
  );

  // Perform bulk action
  const performBulkAction = useCallback(
    async (action, additionalData = {}) => {
      try {
        const response = await shippingSLAService.performBulkAction(
          action,
          state.selectedOrders,
          additionalData
        );

        // Reload data after bulk action
        await loadData(false);

        // Clear selection
        setState((prev) => ({ ...prev, selectedOrders: [] }));

        return response;
      } catch (error) {
        console.error('Bulk action failed:', error);
        throw error;
      }
    },
    [state.selectedOrders, loadData]
  );

  // Export orders
  const exportOrders = useCallback(
    async (format = 'csv') => {
      try {
        const orderIds =
          state.selectedOrders.length > 0 ? state.selectedOrders : [];
        const response = await shippingSLAService.exportOrders(
          orderIds,
          format
        );
        return response;
      } catch (error) {
        console.error('Export failed:', error);
        throw error;
      }
    },
    [state.selectedOrders]
  );

  // Effect: Update filtered orders when filters or orders change
  useEffect(() => {
    const filteredOrders = applyFiltersAndSorting(
      state.orders,
      state.filters,
      state.sortConfig
    );
    setState((prev) => ({ ...prev, filteredOrders }));
  }, [state.orders, state.filters, state.sortConfig, applyFiltersAndSorting]);

  // Effect: Auto-refresh data - Only if we have data
  useEffect(() => {
    if (!autoRefresh || state.orders.length === 0) return;

    const stopRefresh = shippingSLAService.startRealTimeUpdates((data) => {
      const orders = shippingSLAService.processOrdersData(data.orders);
      const filteredOrders = applyFiltersAndSorting(
        orders,
        state.filters,
        state.sortConfig
      );

      setState((prev) => ({
        ...prev,
        orders,
        filteredOrders,
        stats: data.stats,
        lastUpdated: data.timestamp,
      }));
    }, refreshInterval);

    return stopRefresh;
  }, [
    autoRefresh,
    refreshInterval,
    state.filters,
    state.sortConfig,
    state.orders.length, // Add this dependency
    applyFiltersAndSorting,
  ]);

  // Check if backend has data
  const checkDataStatus = useCallback(async () => {
    try {
      const response = await shippingSLAService.checkDataStatus();
      return response.data;
    } catch (error) {
      console.error('Failed to check data status:', error);
      return { hasData: false, orderCount: 0, isEmpty: true };
    }
  }, []);

  // Initial data load - Check if has data first
  useEffect(() => {
    const initializeData = async () => {
      try {
        const status = await checkDataStatus();
        if (status.hasData && status.orderCount > 0) {
          // Only load data if backend has real data
          await loadData(false); // Don't show loading on initial check
        }
        // If no data, user needs to manually load demo or upload file
      } catch (error) {
        console.error('Failed to initialize data:', error);
      }
    };

    initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return {
    // Data
    orders: state.orders,
    filteredOrders: state.filteredOrders,
    stats: state.stats,
    carriers: state.carriers,
    slaConfig: state.slaConfig,

    // UI state
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    dataQuality: state.dataQuality,

    // Filters and sorting
    filters: state.filters,
    sortConfig: state.sortConfig,
    selectedOrders: state.selectedOrders,

    // Actions
    updateFilter,
    updateSortConfig,
    updateSelectedOrders,
    loadData,
    loadDemoData,
    uploadOrdersFile,
    performBulkAction,
    exportOrders,
    checkDataStatus,

    // Helpers
    formatTimeRemaining: shippingSLAService.formatTimeRemaining,
    getSLAStatusColor: shippingSLAService.getSLAStatusColor,
    getPlatformColor: shippingSLAService.getPlatformColor,
  };
};
export default useShippingSLAData;
