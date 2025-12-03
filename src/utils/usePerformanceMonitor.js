/**
 * Custom hook for monitoring performance metrics in the application
 *
 * @module utils/usePerformanceMonitor
 */

import { useCallback, useEffect, useRef } from "react";

/**
 * Custom hook to track and report application performance metrics
 * @returns {Object} Performance monitoring methods and data
 */
export const usePerformanceMonitor = () => {
  const metricsRef = useRef({
    pageLoad: null,
    componentRenders: {},
    apiCalls: {},
    resourceLoads: {},
    memoryUsage: [],
    interactionEvents: [],
  });

  // Initialize performance monitoring
  useEffect(() => {
    // Check if Performance API is available
    if (!window.performance) {
      console.warn("Performance API not supported in this browser");
      return;
    }

    // Record initial page load time
    const navigationEntry = performance.getEntriesByType("navigation")[0];
    if (navigationEntry) {
      metricsRef.current.pageLoad = {
        loadTime: navigationEntry.loadEventEnd - navigationEntry.startTime,
        domContentLoaded:
          navigationEntry.domContentLoadedEventEnd - navigationEntry.startTime,
        firstPaint:
          performance.getEntriesByName("first-paint")[0]?.startTime || null,
        firstContentfulPaint:
          performance.getEntriesByName("first-contentful-paint")[0]
            ?.startTime || null,
      };
    }

    // Set up PerformanceObserver for resource loading
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (
            entry.initiatorType === "fetch" ||
            entry.initiatorType === "xmlhttprequest"
          ) {
            metricsRef.current.apiCalls[entry.name] = {
              duration: entry.duration,
              size: entry.transferSize,
              timestamp: Date.now(),
            };
          } else {
            metricsRef.current.resourceLoads[entry.name] = {
              duration: entry.duration,
              size: entry.transferSize,
              type: entry.initiatorType,
              timestamp: Date.now(),
            };
          }
        });
      });

      resourceObserver.observe({ entryTypes: ["resource"] });

      // Monitor memory usage if available
      if (performance.memory) {
        const memoryInterval = setInterval(() => {
          metricsRef.current.memoryUsage.push({
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            timestamp: Date.now(),
          });

          // Keep only last 100 measurements
          if (metricsRef.current.memoryUsage.length > 100) {
            metricsRef.current.memoryUsage.shift();
          }
        }, 10000); // Check every 10 seconds

        return () => {
          clearInterval(memoryInterval);
          resourceObserver.disconnect();
        };
      }

      return () => {
        resourceObserver.disconnect();
      };
    } catch (error) {
      console.warn("PerformanceObserver not supported", error);
    }
  }, []);

  /**
   * Record a component render time
   * @param {string} componentName - Name of the component being measured
   * @param {number} renderTime - Time taken to render in ms
   */
  const recordRenderTime = useCallback((componentName, renderTime) => {
    if (!metricsRef.current.componentRenders[componentName]) {
      metricsRef.current.componentRenders[componentName] = [];
    }

    metricsRef.current.componentRenders[componentName].push({
      duration: renderTime,
      timestamp: Date.now(),
    });

    // Keep only last 50 render measurements per component
    if (metricsRef.current.componentRenders[componentName].length > 50) {
      metricsRef.current.componentRenders[componentName].shift();
    }
  }, []);

  /**
   * Record a user interaction event
   * @param {string} eventType - Type of interaction (click, input, etc.)
   * @param {Object} details - Additional details about the interaction
   */
  const recordInteraction = useCallback((eventType, details = {}) => {
    metricsRef.current.interactionEvents.push({
      type: eventType,
      details,
      timestamp: Date.now(),
    });

    // Keep only last 100 interaction events
    if (metricsRef.current.interactionEvents.length > 100) {
      metricsRef.current.interactionEvents.shift();
    }
  }, []);

  /**
   * Record a custom metric
   * @param {string} metricName - Name of the metric
   * @param {any} value - Value of the metric
   */
  const recordMetric = useCallback((metricName, value) => {
    if (!metricsRef.current[metricName]) {
      metricsRef.current[metricName] = [];
    }

    if (Array.isArray(metricsRef.current[metricName])) {
      metricsRef.current[metricName].push({
        value,
        timestamp: Date.now(),
      });

      // Limit array size
      if (metricsRef.current[metricName].length > 100) {
        metricsRef.current[metricName].shift();
      }
    } else {
      metricsRef.current[metricName] = {
        value,
        timestamp: Date.now(),
      };
    }
  }, []);

  /**
   * Get all collected metrics
   * @returns {Object} All performance metrics
   */
  const getAllMetrics = useCallback(() => {
    return { ...metricsRef.current };
  }, []);

  return {
    recordRenderTime,
    recordInteraction,
    recordMetric,
    getAllMetrics,
  };
};

export default usePerformanceMonitor;
