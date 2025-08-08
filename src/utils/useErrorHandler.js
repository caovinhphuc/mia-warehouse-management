/**
 * Enhanced error handling hook with retry mechanisms and reporting
 * 
 * @module utils/useErrorHandler
 */

import { useCallback, useRef, useState } from 'react';

/**
 * Enhanced error handler with retry mechanisms and centralized error reporting
 * @returns {Object} Error handling methods and state
 */
export const useErrorHandler = () => {
  const [errors, setErrors] = useState([]);
  const retryAttemptsRef = useRef({});

  /**
   * Handle an error with comprehensive logging and optional retry
   * @param {Error} error - The error object
   * @param {string} context - Context where the error occurred
   * @param {Object} options - Error handling options
   */
  const handleError = useCallback((error, context = 'Unknown', options = {}) => {
    const {
      shouldRetry = false,
      maxRetries = 3,
      retryDelay = 1000,
      reportToService = true,
      severity = 'error',
      userMessage = null,
    } = options;

    const errorId = `${context}_${Date.now()}`;
    const errorDetails = {
      id: errorId,
      message: error.message || 'Unknown error',
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      severity,
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: null, // Will be populated if user is authenticated
    };

    // Enhanced error details for different error types
    if (error.name) errorDetails.type = error.name;
    if (error.code) errorDetails.code = error.code;
    if (error.status) errorDetails.httpStatus = error.status;

    // Log to console with appropriate level
    switch (severity) {
      case 'critical':
      case 'error':
        console.error(`[${context}] Error:`, error);
        break;
      case 'warning':
        console.warn(`[${context}] Warning:`, error);
        break;
      default:
        console.log(`[${context}] Info:`, error);
    }

    // Add to errors state
    setErrors(prev => {
      const newErrors = [errorDetails, ...prev.slice(0, 49)]; // Keep last 50 errors
      return newErrors;
    });

    // Report to monitoring service if enabled
    if (reportToService && process.env.NODE_ENV === 'production') {
      try {
        // In production, this would send to your error tracking service
        // Example: Sentry, LogRocket, Rollbar, etc.
        reportErrorToService(errorDetails);
      } catch (reportingError) {
        console.warn('Failed to report error to monitoring service:', reportingError);
      }
    }

    // Handle retry logic
    if (shouldRetry) {
      const currentAttempts = retryAttemptsRef.current[errorId] || 0;
      
      if (currentAttempts < maxRetries) {
        retryAttemptsRef.current[errorId] = currentAttempts + 1;
        
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            console.log(`Retrying ${context} (attempt ${currentAttempts + 1}/${maxRetries})`);
            resolve();
          }, retryDelay * (currentAttempts + 1)); // Exponential backoff
        });
      } else {
        console.error(`Max retries (${maxRetries}) reached for ${context}`);
        delete retryAttemptsRef.current[errorId];
      }
    }

    // Show user notification if message provided
    if (userMessage && window.showNotification) {
      window.showNotification({
        type: severity === 'critical' ? 'error' : severity,
        title: 'Error Occurred',
        message: userMessage,
      });
    }

    return errorDetails;
  }, []);

  /**
   * Handle async errors with automatic retry
   * @param {Function} asyncFn - The async function to execute
   * @param {string} context - Context for error handling
   * @param {Object} options - Error handling options
   */
  const handleAsyncError = useCallback(async (asyncFn, context, options = {}) => {
    const maxRetries = options.maxRetries || 3;
    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        return await asyncFn();
      } catch (error) {
        attempt++;
        
        if (attempt > maxRetries) {
          handleError(error, context, {
            ...options,
            shouldRetry: false,
          });
          throw error;
        }

        // Log retry attempt
        console.log(`Async operation failed, retrying... (${attempt}/${maxRetries})`);
        
        // Wait before retry with exponential backoff
        const delay = (options.retryDelay || 1000) * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }, [handleError]);

  /**
   * Create an error boundary handler
   * @param {string} componentName - Name of the component
   */
  const createErrorBoundaryHandler = useCallback((componentName) => {
    return (error, errorInfo) => {
      handleError(error, `ErrorBoundary_${componentName}`, {
        severity: 'critical',
        reportToService: true,
        userMessage: 'An unexpected error occurred. Please refresh the page.',
        additionalInfo: errorInfo,
      });
    };
  }, [handleError]);

  /**
   * Handle form validation errors
   * @param {Object} validationErrors - Object containing field validation errors
   * @param {string} formName - Name of the form
   */
  const handleValidationErrors = useCallback((validationErrors, formName) => {
    const errorSummary = Object.entries(validationErrors)
      .map(([field, message]) => `${field}: ${message}`)
      .join(', ');

    handleError(
      new Error(`Validation failed: ${errorSummary}`),
      `Form_${formName}`,
      {
        severity: 'warning',
        reportToService: false,
        shouldRetry: false,
      }
    );

    return validationErrors;
  }, [handleError]);

  /**
   * Handle API errors with specific logic for different status codes
   * @param {Response|Error} error - API error response or error object
   * @param {string} endpoint - API endpoint that failed
   * @param {Object} options - Additional options
   */
  const handleApiError = useCallback((error, endpoint, options = {}) => {
    let errorMessage = 'API request failed';
    let shouldRetry = false;
    let severity = 'error';

    if (error.status) {
      switch (error.status) {
        case 401:
          errorMessage = 'Authentication required';
          severity = 'warning';
          break;
        case 403:
          errorMessage = 'Access forbidden';
          severity = 'warning';
          break;
        case 404:
          errorMessage = 'Resource not found';
          severity = 'warning';
          break;
        case 429:
          errorMessage = 'Too many requests - please wait';
          shouldRetry = true;
          severity = 'warning';
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          errorMessage = 'Server error - please try again';
          shouldRetry = true;
          severity = 'error';
          break;
        default:
          errorMessage = `API error (${error.status})`;
      }
    } else if (error.name === 'NetworkError' || !navigator.onLine) {
      errorMessage = 'Network connection error';
      shouldRetry = true;
      severity = 'warning';
    }

    return handleError(error, `API_${endpoint}`, {
      ...options,
      shouldRetry,
      severity,
      userMessage: errorMessage,
    });
  }, [handleError]);

  /**
   * Clear errors from state
   * @param {string} errorId - Specific error ID to clear, or null to clear all
   */
  const clearErrors = useCallback((errorId = null) => {
    setErrors(prev => {
      if (errorId) {
        return prev.filter(error => error.id !== errorId);
      }
      return [];
    });
  }, []);

  /**
   * Get errors with filtering options
   * @param {Object} filters - Filters to apply
   */
  const getErrors = useCallback((filters = {}) => {
    const { severity, context, limit = 10 } = filters;
    
    let filteredErrors = errors;

    if (severity) {
      filteredErrors = filteredErrors.filter(error => error.severity === severity);
    }

    if (context) {
      filteredErrors = filteredErrors.filter(error => 
        error.context.toLowerCase().includes(context.toLowerCase())
      );
    }

    return filteredErrors.slice(0, limit);
  }, [errors]);

  return {
    handleError,
    handleAsyncError,
    handleApiError,
    handleValidationErrors,
    createErrorBoundaryHandler,
    clearErrors,
    getErrors,
    errors,
  };
};

/**
 * Report error to external monitoring service
 * @param {Object} errorDetails - Detailed error information
 */
const reportErrorToService = (errorDetails) => {
  // This would be implemented based on your chosen error tracking service
  // Examples:
  
  // Sentry
  // Sentry.captureException(new Error(errorDetails.message), {
  //   tags: { context: errorDetails.context },
  //   extra: errorDetails,
  // });

  // LogRocket
  // LogRocket.captureException(new Error(errorDetails.message));

  // Custom API endpoint
  // fetch('/api/errors', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(errorDetails),
  // });

  console.log('Error reported to monitoring service:', errorDetails);
};

export default useErrorHandler;