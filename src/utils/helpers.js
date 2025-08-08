/**
 * Utility Helper Functions
 * Collection of reusable utility functions for the Warehouse Management System
 * 
 * @module utils/helpers
 */

import { 
  DATE_FORMATS, 
  CURRENCY, 
  VALIDATION_RULES, 
  BUSINESS_RULES,
  ERROR_CODES 
} from './constants';

// ==================== DATE & TIME UTILITIES ====================

/**
 * Format date to specified format
 * @param {Date|string} date - Date to format
 * @param {string} format - Format string (default: SHORT_DATE)
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = DATE_FORMATS.SHORT_DATE) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');

  switch (format) {
    case DATE_FORMATS.SHORT_DATE:
      return `${month}/${day}/${year}`;
    case DATE_FORMATS.LONG_DATE:
      return dateObj.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case DATE_FORMATS.DATE_TIME:
      return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
    case DATE_FORMATS.TIME_ONLY:
      return `${hours}:${minutes}:${seconds}`;
    case DATE_FORMATS.ISO_DATE:
      return `${year}-${month}-${day}`;
    case DATE_FORMATS.ISO_DATETIME:
      return dateObj.toISOString();
    default:
      return dateObj.toLocaleDateString();
  }
};

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param {Date|string} date - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const dateObj = new Date(date);
  const diffMs = now - dateObj;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  
  return formatDate(date, DATE_FORMATS.SHORT_DATE);
};

/**
 * Check if date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  const dateObj = new Date(date);
  return dateObj.toDateString() === today.toDateString();
};

/**
 * Add days to a date
 * @param {Date|string} date - Base date
 * @param {number} days - Number of days to add
 * @returns {Date} New date with days added
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// ==================== NUMBER & CURRENCY UTILITIES ====================

/**
 * Format number as currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = CURRENCY.DEFAULT) => {
  if (typeof amount !== 'number') return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: CURRENCY.DECIMAL_PLACES,
    maximumFractionDigits: CURRENCY.DECIMAL_PLACES,
  }).format(amount);
};

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
export const formatNumber = (num, decimals = 0) => {
  if (typeof num !== 'number') return '0';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Format percentage
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => {
  if (typeof value !== 'number') return '0%';
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

/**
 * Generate random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
export const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Round number to specified decimal places
 * @param {number} num - Number to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} Rounded number
 */
export const roundToDecimals = (num, decimals = 2) => {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};

// ==================== STRING UTILITIES ====================

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert string to title case
 * @param {string} str - String to convert
 * @returns {string} Title case string
 */
export const toTitleCase = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Generate slug from string
 * @param {string} str - String to convert to slug
 * @returns {string} Slug string
 */
export const generateSlug = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Truncate string to specified length
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated string
 */
export const truncate = (str, length, suffix = '...') => {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + suffix;
};

/**
 * Generate random string
 * @param {number} length - Length of string
 * @param {string} charset - Character set to use
 * @returns {string} Random string
 */
export const generateRandomString = (length = 10, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
};

// ==================== VALIDATION UTILITIES ====================

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return VALIDATION_RULES.EMAIL.test(email);
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  return VALIDATION_RULES.PHONE.test(phone);
};

/**
 * Validate SKU format
 * @param {string} sku - SKU to validate
 * @returns {boolean} True if valid SKU
 */
export const isValidSKU = (sku) => {
  if (!sku || typeof sku !== 'string') return false;
  return VALIDATION_RULES.SKU.test(sku);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with score and feedback
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, score: 0, feedback: ['Password is required'] };
  }

  const feedback = [];
  let score = 0;

  // Length check
  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    feedback.push(`Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters long`);
  } else {
    score += 1;
  }

  // Uppercase check
  if (VALIDATION_RULES.PASSWORD.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    feedback.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  // Lowercase check
  if (VALIDATION_RULES.PASSWORD.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    feedback.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  // Number check
  if (VALIDATION_RULES.PASSWORD.REQUIRE_NUMBERS && !/\d/.test(password)) {
    feedback.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  // Special character check
  if (VALIDATION_RULES.PASSWORD.REQUIRE_SPECIAL && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    feedback.push('Password must contain at least one special character');
  } else {
    score += 1;
  }

  const isValid = feedback.length === 0;
  const strength = score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong';

  return { isValid, score, strength, feedback };
};

// ==================== ARRAY UTILITIES ====================

/**
 * Remove duplicates from array
 * @param {Array} arr - Array to deduplicate
 * @param {string} key - Key to use for object deduplication
 * @returns {Array} Deduplicated array
 */
export const removeDuplicates = (arr, key = null) => {
  if (!Array.isArray(arr)) return [];
  
  if (key) {
    const seen = new Set();
    return arr.filter(item => {
      const value = item[key];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  }
  
  return [...new Set(arr)];
};

/**
 * Sort array by key
 * @param {Array} arr - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} Sorted array
 */
export const sortBy = (arr, key, direction = 'asc') => {
  if (!Array.isArray(arr)) return [];
  
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Group array by key
 * @param {Array} arr - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (arr, key) => {
  if (!Array.isArray(arr)) return {};
  
  return arr.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

/**
 * Paginate array
 * @param {Array} arr - Array to paginate
 * @param {number} page - Page number (1-based)
 * @param {number} pageSize - Items per page
 * @returns {Object} Paginated result
 */
export const paginate = (arr, page = 1, pageSize = 25) => {
  if (!Array.isArray(arr)) return { data: [], total: 0, page: 1, pageSize, totalPages: 0 };
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const data = arr.slice(startIndex, endIndex);
  const total = arr.length;
  const totalPages = Math.ceil(total / pageSize);
  
  return { data, total, page, pageSize, totalPages };
};

// ==================== OBJECT UTILITIES ====================

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  
  const clonedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (obj) => {
  if (!obj) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

/**
 * Get nested property value
 * @param {Object} obj - Object to search
 * @param {string} path - Property path (e.g., 'user.profile.name')
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Property value or default
 */
export const getNestedValue = (obj, path, defaultValue = null) => {
  if (!obj || typeof obj !== 'object') return defaultValue;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || !(key in current)) {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current;
};

/**
 * Set nested property value
 * @param {Object} obj - Object to modify
 * @param {string} path - Property path
 * @param {*} value - Value to set
 * @returns {Object} Modified object
 */
export const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let current = obj;
  
  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
  return obj;
};

// ==================== BUSINESS LOGIC UTILITIES ====================

/**
 * Calculate stock status based on quantity
 * @param {number} quantity - Current quantity
 * @param {number} lowThreshold - Low stock threshold
 * @param {number} criticalThreshold - Critical stock threshold
 * @returns {string} Stock status
 */
export const getStockStatus = (quantity, lowThreshold = BUSINESS_RULES.LOW_STOCK_THRESHOLD, criticalThreshold = BUSINESS_RULES.CRITICAL_STOCK_THRESHOLD) => {
  if (quantity <= 0) return 'out_of_stock';
  if (quantity <= criticalThreshold) return 'critical';
  if (quantity <= lowThreshold) return 'low_stock';
  return 'in_stock';
};

/**
 * Calculate order priority score
 * @param {Object} order - Order object
 * @returns {number} Priority score (higher = more urgent)
 */
export const calculateOrderPriority = (order) => {
  let score = 0;
  
  // Base priority
  switch (order.priority) {
    case 'critical': score += 100; break;
    case 'urgent': score += 80; break;
    case 'high': score += 60; break;
    case 'normal': score += 40; break;
    case 'low': score += 20; break;
  }
  
  // Order age (older orders get higher priority)
  const ageInHours = (new Date() - new Date(order.createdAt)) / (1000 * 60 * 60);
  score += Math.min(ageInHours / 24 * 10, 20); // Max 20 points for age
  
  // Order value (higher value gets slight priority boost)
  score += Math.min(order.totalValue / 1000, 10); // Max 10 points for value
  
  return Math.round(score);
};

/**
 * Calculate staff productivity score
 * @param {Object} staff - Staff member object
 * @returns {number} Productivity score (0-100)
 */
export const calculateStaffProductivity = (staff) => {
  const { picksPerHour = 0, accuracyRate = 0, hoursWorked = 0 } = staff;
  
  // Picks per hour score (40% weight)
  const picksScore = Math.min((picksPerHour / BUSINESS_RULES.EXCELLENT_PICKS_PER_HOUR) * 100, 100);
  
  // Accuracy score (40% weight)
  const accuracyScore = accuracyRate;
  
  // Hours worked consistency (20% weight)
  const hoursScore = Math.min((hoursWorked / 8) * 100, 100); // 8 hours = 100%
  
  return Math.round(picksScore * 0.4 + accuracyScore * 0.4 + hoursScore * 0.2);
};

// ==================== FILE UTILITIES ====================

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file extension
 * @param {string} filename - File name
 * @returns {string} File extension
 */
export const getFileExtension = (filename) => {
  if (!filename || typeof filename !== 'string') return '';
  return filename.split('.').pop().toLowerCase();
};

/**
 * Check if file type is allowed
 * @param {string} filename - File name
 * @param {Array} allowedTypes - Array of allowed extensions
 * @returns {boolean} True if allowed
 */
export const isAllowedFileType = (filename, allowedTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png']) => {
  const extension = getFileExtension(filename);
  return allowedTypes.includes(extension);
};

// ==================== URL UTILITIES ====================

/**
 * Build URL with query parameters
 * @param {string} baseUrl - Base URL
 * @param {Object} params - Query parameters
 * @returns {string} Complete URL
 */
export const buildUrl = (baseUrl, params = {}) => {
  if (!baseUrl) return '';
  
  const url = new URL(baseUrl);
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      url.searchParams.set(key, params[key]);
    }
  });
  
  return url.toString();
};

/**
 * Parse query string to object
 * @param {string} queryString - Query string
 * @returns {Object} Parsed parameters
 */
export const parseQueryString = (queryString) => {
  if (!queryString) return {};
  
  const params = new URLSearchParams(queryString);
  const result = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
};

// ==================== PERFORMANCE UTILITIES ====================

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in ms
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ==================== EXPORT ALL ====================
export default {
  // Date & Time
  formatDate,
  getRelativeTime,
  isToday,
  addDays,
  
  // Numbers & Currency
  formatCurrency,
  formatNumber,
  formatPercentage,
  randomNumber,
  roundToDecimals,
  
  // Strings
  capitalize,
  toTitleCase,
  generateSlug,
  truncate,
  generateRandomString,
  
  // Validation
  isValidEmail,
  isValidPhone,
  isValidSKU,
  validatePassword,
  
  // Arrays
  removeDuplicates,
  sortBy,
  groupBy,
  paginate,
  
  // Objects
  deepClone,
  isEmpty,
  getNestedValue,
  setNestedValue,
  
  // Business Logic
  getStockStatus,
  calculateOrderPriority,
  calculateStaffProductivity,
  
  // Files
  formatFileSize,
  getFileExtension,
  isAllowedFileType,
  
  // URLs
  buildUrl,
  parseQueryString,
  
  // Performance
  debounce,
  throttle,
};