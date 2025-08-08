/**
 * Application Constants
 * Centralized configuration and constants for the Warehouse Management System
 * 
 * @module utils/constants
 */

// ==================== APPLICATION INFO ====================
export const APP_INFO = {
  NAME: 'MIA Warehouse Management System',
  VERSION: '2.0.0',
  DESCRIPTION: 'Advanced Warehouse Management Template with Real-time Analytics',
  AUTHOR: 'Fellou AI',
  BUILD_DATE: new Date().toISOString(),
};

// ==================== API CONFIGURATION ====================
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://api.warehouse.com',
  TIMEOUT: 15000, // 15 seconds
  RETRY_ATTEMPTS: 3,
  GOOGLE_SHEETS_URL: 'https://script.google.com/macros/s/AKfycbwQdC5ZTkD71xEDWPApkkbp5oyS7M4ijwmcCFKAtYqin75dssevjkfFgpEq1O2Xyils/exec',
  WEBSOCKET_URL: process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws',
};

// ==================== STORAGE KEYS ====================
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'mia-warehouse-token',
  USER_DATA: 'mia-warehouse-user',
  THEME: 'mia-warehouse-theme',
  SETTINGS: 'mia-warehouse-settings',
  LAST_LOGIN: 'mia-warehouse-last-login',
  REMEMBER_USER: 'rememberedUsername',
  SESSION_TOKEN: 'authToken',
  CURRENT_USER: 'currentUser',
  LOGIN_BLOCK: 'loginBlock',
  PREFERENCES: 'mia-warehouse-preferences',
};

// ==================== ROUTE PATHS ====================
export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  DEMO: '/demo',
  
  // Protected routes
  DASHBOARD: '/dashboard',
  ORDERS: '/orders',
  INVENTORY: '/inventory',
  STAFF: '/staff',
  ANALYTICS: '/analytics',
  PICKING: '/picking',
  ALERTS: '/alerts',
  WAREHOUSE_MAP: '/warehouse-map',
  AUTOMATION: '/automation',
  SETTINGS: '/settings',
  USERS: '/users',
  
  // Order sub-routes
  ORDERS_LIST: '/orders/list',
  ORDERS_CREATE: '/orders/create',
  ORDERS_DETAILS: '/orders/:id',
  
  // Inventory sub-routes
  INVENTORY_LIST: '/inventory/list',
  INVENTORY_CREATE: '/inventory/create',
  INVENTORY_DETAILS: '/inventory/:id',
  
  // Staff sub-routes
  STAFF_LIST: '/staff/list',
  STAFF_CREATE: '/staff/create',
  STAFF_DETAILS: '/staff/:id',
};

// ==================== USER ROLES & PERMISSIONS ====================
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  SUPERVISOR: 'supervisor',
  OPERATOR: 'operator',
  VIEWER: 'viewer',
};

export const PERMISSIONS = {
  // System permissions
  SYSTEM_ADMIN: 'system:admin',
  SYSTEM_CONFIG: 'system:config',
  
  // User management
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  
  // Order management
  ORDERS_VIEW: 'orders:view',
  ORDERS_CREATE: 'orders:create',
  ORDERS_EDIT: 'orders:edit',
  ORDERS_DELETE: 'orders:delete',
  ORDERS_PROCESS: 'orders:process',
  
  // Inventory management
  INVENTORY_VIEW: 'inventory:view',
  INVENTORY_CREATE: 'inventory:create',
  INVENTORY_EDIT: 'inventory:edit',
  INVENTORY_DELETE: 'inventory:delete',
  INVENTORY_ADJUST: 'inventory:adjust',
  
  // Staff management
  STAFF_VIEW: 'staff:view',
  STAFF_CREATE: 'staff:create',
  STAFF_EDIT: 'staff:edit',
  STAFF_DELETE: 'staff:delete',
  
  // Analytics & Reports
  ANALYTICS_VIEW: 'analytics:view',
  REPORTS_GENERATE: 'reports:generate',
  REPORTS_EXPORT: 'reports:export',
};

export const ROLE_PERMISSIONS = {
  [USER_ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [USER_ROLES.ADMIN]: [
    PERMISSIONS.USERS_VIEW, PERMISSIONS.USERS_CREATE, PERMISSIONS.USERS_EDIT,
    PERMISSIONS.ORDERS_VIEW, PERMISSIONS.ORDERS_CREATE, PERMISSIONS.ORDERS_EDIT, PERMISSIONS.ORDERS_PROCESS,
    PERMISSIONS.INVENTORY_VIEW, PERMISSIONS.INVENTORY_CREATE, PERMISSIONS.INVENTORY_EDIT, PERMISSIONS.INVENTORY_ADJUST,
    PERMISSIONS.STAFF_VIEW, PERMISSIONS.STAFF_CREATE, PERMISSIONS.STAFF_EDIT,
    PERMISSIONS.ANALYTICS_VIEW, PERMISSIONS.REPORTS_GENERATE, PERMISSIONS.REPORTS_EXPORT,
  ],
  [USER_ROLES.MANAGER]: [
    PERMISSIONS.ORDERS_VIEW, PERMISSIONS.ORDERS_CREATE, PERMISSIONS.ORDERS_EDIT, PERMISSIONS.ORDERS_PROCESS,
    PERMISSIONS.INVENTORY_VIEW, PERMISSIONS.INVENTORY_EDIT, PERMISSIONS.INVENTORY_ADJUST,
    PERMISSIONS.STAFF_VIEW, PERMISSIONS.STAFF_EDIT,
    PERMISSIONS.ANALYTICS_VIEW, PERMISSIONS.REPORTS_GENERATE,
  ],
  [USER_ROLES.SUPERVISOR]: [
    PERMISSIONS.ORDERS_VIEW, PERMISSIONS.ORDERS_EDIT, PERMISSIONS.ORDERS_PROCESS,
    PERMISSIONS.INVENTORY_VIEW, PERMISSIONS.INVENTORY_EDIT,
    PERMISSIONS.STAFF_VIEW,
    PERMISSIONS.ANALYTICS_VIEW,
  ],
  [USER_ROLES.OPERATOR]: [
    PERMISSIONS.ORDERS_VIEW, PERMISSIONS.ORDERS_PROCESS,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.STAFF_VIEW,
  ],
  [USER_ROLES.VIEWER]: [
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.STAFF_VIEW,
    PERMISSIONS.ANALYTICS_VIEW,
  ],
};

// ==================== ORDER STATUS ====================
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  PICKING: 'picking',
  PACKED: 'packed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
};

export const ORDER_PRIORITY = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
  CRITICAL: 'critical',
};

// ==================== INVENTORY STATUS ====================
export const INVENTORY_STATUS = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
  RESERVED: 'reserved',
  DAMAGED: 'damaged',
  EXPIRED: 'expired',
};

export const STOCK_MOVEMENTS = {
  INBOUND: 'inbound',
  OUTBOUND: 'outbound',
  ADJUSTMENT: 'adjustment',
  TRANSFER: 'transfer',
  RETURN: 'return',
  DAMAGE: 'damage',
  EXPIRED: 'expired',
};

// ==================== STAFF STATUS ====================
export const STAFF_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_BREAK: 'on_break',
  TRAINING: 'training',
  SICK_LEAVE: 'sick_leave',
  VACATION: 'vacation',
};

export const STAFF_DEPARTMENTS = {
  RECEIVING: 'receiving',
  STORAGE: 'storage',
  PICKING: 'picking',
  PACKING: 'packing',
  SHIPPING: 'shipping',
  QUALITY_CONTROL: 'quality_control',
  MANAGEMENT: 'management',
  MAINTENANCE: 'maintenance',
};

// ==================== ALERT TYPES ====================
export const ALERT_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical',
};

export const ALERT_CATEGORIES = {
  SYSTEM: 'system',
  INVENTORY: 'inventory',
  ORDER: 'order',
  STAFF: 'staff',
  QUALITY: 'quality',
  SECURITY: 'security',
};

// ==================== NOTIFICATION SETTINGS ====================
export const NOTIFICATION_TYPES = {
  PUSH: 'push',
  EMAIL: 'email',
  SMS: 'sms',
  IN_APP: 'in_app',
};

export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
};

// ==================== SYSTEM LIMITS ====================
export const SYSTEM_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_UPLOAD_FILES: 5,
  MAX_SEARCH_RESULTS: 1000,
  MAX_EXPORT_RECORDS: 10000,
  SESSION_TIMEOUT: 8 * 60 * 60 * 1000, // 8 hours
  MAX_LOGIN_ATTEMPTS: 5,
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
};

// ==================== PERFORMANCE THRESHOLDS ====================
export const PERFORMANCE_THRESHOLDS = {
  PAGE_LOAD_WARNING: 3000, // 3 seconds
  PAGE_LOAD_CRITICAL: 5000, // 5 seconds
  API_RESPONSE_WARNING: 2000, // 2 seconds  
  API_RESPONSE_CRITICAL: 5000, // 5 seconds
  MEMORY_USAGE_WARNING: 100, // 100MB
  MEMORY_USAGE_CRITICAL: 200, // 200MB
  ERROR_RATE_WARNING: 5, // 5%
  ERROR_RATE_CRITICAL: 10, // 10%
};

// ==================== BUSINESS RULES ====================
export const BUSINESS_RULES = {
  // Stock levels
  LOW_STOCK_THRESHOLD: 10,
  CRITICAL_STOCK_THRESHOLD: 5,
  OVERSTOCK_THRESHOLD: 1000,
  
  // Order processing
  MAX_ORDER_ITEMS: 100,
  MIN_ORDER_VALUE: 0.01,
  MAX_ORDER_VALUE: 1000000,
  
  // Staff productivity
  MIN_PICKS_PER_HOUR: 30,
  TARGET_PICKS_PER_HOUR: 50,
  EXCELLENT_PICKS_PER_HOUR: 80,
  
  // Quality thresholds
  MIN_ACCURACY_RATE: 95, // 95%
  TARGET_ACCURACY_RATE: 98, // 98%
  EXCELLENT_ACCURACY_RATE: 99.5, // 99.5%
};

// ==================== DATE/TIME FORMATS ====================
export const DATE_FORMATS = {
  SHORT_DATE: 'MM/DD/YYYY',
  LONG_DATE: 'MMMM DD, YYYY',
  DATE_TIME: 'MM/DD/YYYY HH:mm:ss',
  TIME_ONLY: 'HH:mm:ss',
  ISO_DATE: 'YYYY-MM-DD',
  ISO_DATETIME: 'YYYY-MM-DDTHH:mm:ss.sssZ',
};

// ==================== CURRENCY & UNITS ====================
export const CURRENCY = {
  DEFAULT: 'USD',
  SYMBOL: '$',
  DECIMAL_PLACES: 2,
};

export const UNITS = {
  WEIGHT: {
    DEFAULT: 'kg',
    OPTIONS: ['g', 'kg', 'lb', 'oz'],
  },
  DIMENSION: {
    DEFAULT: 'cm',
    OPTIONS: ['mm', 'cm', 'm', 'in', 'ft'],
  },
  VOLUME: {
    DEFAULT: 'L',
    OPTIONS: ['ml', 'L', 'gal', 'qt'],
  },
};

// ==================== THEME CONSTANTS ====================
export const THEME = {
  COLORS: {
    PRIMARY: '#3B82F6',
    SECONDARY: '#6B7280',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#3B82F6',
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
  },
};

// ==================== VALIDATION RULES ====================
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]{10,}$/,
  POSTAL_CODE: /^[\d\w\s\-]{3,10}$/,
  SKU: /^[A-Z0-9\-_]{3,20}$/,
  BARCODE: /^[\d]{8,14}$/,
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL: true,
  },
};

// ==================== ERROR CODES ====================
export const ERROR_CODES = {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS: 'AUTH_001',
  AUTH_TOKEN_EXPIRED: 'AUTH_002',
  AUTH_ACCESS_DENIED: 'AUTH_003',
  AUTH_SESSION_EXPIRED: 'AUTH_004',
  
  // Validation errors
  VALIDATION_REQUIRED_FIELD: 'VAL_001',
  VALIDATION_INVALID_FORMAT: 'VAL_002',
  VALIDATION_OUT_OF_RANGE: 'VAL_003',
  
  // Business logic errors
  BIZ_INSUFFICIENT_STOCK: 'BIZ_001',
  BIZ_ORDER_ALREADY_PROCESSED: 'BIZ_002',
  BIZ_DUPLICATE_SKU: 'BIZ_003',
  
  // System errors
  SYS_DATABASE_ERROR: 'SYS_001',
  SYS_NETWORK_ERROR: 'SYS_002',
  SYS_FILE_UPLOAD_ERROR: 'SYS_003',
};

// ==================== WEBSOCKET EVENTS ====================
export const WS_EVENTS = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  
  // Data updates
  METRICS_UPDATE: 'metrics_update',
  ORDER_UPDATE: 'order_update',
  INVENTORY_UPDATE: 'inventory_update',
  STAFF_UPDATE: 'staff_update',
  
  // Alerts
  ALERT_NEW: 'alert_new',
  ALERT_RESOLVED: 'alert_resolved',
  
  // System events
  SYSTEM_STATUS: 'system_status',
  HEARTBEAT: 'heartbeat',
};

// ==================== FEATURE FLAGS ====================
export const FEATURE_FLAGS = {
  ENABLE_WEBSOCKET: process.env.REACT_APP_ENABLE_WEBSOCKET !== 'false',
  ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS !== 'false',
  ENABLE_NOTIFICATIONS: process.env.REACT_APP_ENABLE_NOTIFICATIONS !== 'false',
  ENABLE_PERFORMANCE_MONITORING: process.env.REACT_APP_ENABLE_PERFORMANCE !== 'false',
  ENABLE_ERROR_REPORTING: process.env.REACT_APP_ENABLE_ERROR_REPORTING !== 'false',
  DEBUG_MODE: process.env.NODE_ENV === 'development',
};

// ==================== DEFAULT SETTINGS ====================
export const DEFAULT_SETTINGS = {
  theme: 'light',
  language: 'en',
  timezone: 'UTC',
  dateFormat: DATE_FORMATS.SHORT_DATE,
  currency: CURRENCY.DEFAULT,
  notifications: {
    email: true,
    push: true,
    inApp: true,
  },
  dashboard: {
    refreshInterval: 30000, // 30 seconds
    showMetrics: true,
    showAlerts: true,
  },
  table: {
    pageSize: 25,
    sortOrder: 'asc',
  },
};

// ==================== EXPORT ALL ====================
export default {
  APP_INFO,
  API_CONFIG,
  STORAGE_KEYS,
  ROUTES,
  USER_ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  ORDER_STATUS,
  ORDER_PRIORITY,
  INVENTORY_STATUS,
  STOCK_MOVEMENTS,
  STAFF_STATUS,
  STAFF_DEPARTMENTS,
  ALERT_TYPES,
  ALERT_CATEGORIES,
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITIES,
  SYSTEM_LIMITS,
  PERFORMANCE_THRESHOLDS,
  BUSINESS_RULES,
  DATE_FORMATS,
  CURRENCY,
  UNITS,
  THEME,
  VALIDATION_RULES,
  ERROR_CODES,
  WS_EVENTS,
  FEATURE_FLAGS,
  DEFAULT_SETTINGS,
};