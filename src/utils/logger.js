/**
 * Logger utility for MIA Warehouse Management System
 * Provides consistent logging interface across the application
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
};

// Get log level from environment or default to INFO
const getLogLevel = () => {
  const envLevel = process.env.REACT_APP_LOG_LEVEL?.toUpperCase();
  return LOG_LEVELS[envLevel] ?? LOG_LEVELS.INFO;
};

const currentLogLevel = getLogLevel();
const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Format log message with timestamp and context
 */
const formatMessage = (level, ...args) => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level}]`;
  return [prefix, ...args];
};

/**
 * Logger object with different log levels
 */
const logger = {
  /**
   * Debug level logging (only in development)
   */
  debug: (...args) => {
    if (isDevelopment && currentLogLevel <= LOG_LEVELS.DEBUG) {
      console.debug(...formatMessage("DEBUG", ...args));
    }
  },

  /**
   * Info level logging
   */
  info: (...args) => {
    if (currentLogLevel <= LOG_LEVELS.INFO) {
      console.info(...formatMessage("INFO", ...args));
    }
  },

  /**
   * Warning level logging
   */
  warn: (...args) => {
    if (currentLogLevel <= LOG_LEVELS.WARN) {
      console.warn(...formatMessage("WARN", ...args));
    }
  },

  /**
   * Error level logging
   */
  error: (...args) => {
    if (currentLogLevel <= LOG_LEVELS.ERROR) {
      console.error(...formatMessage("ERROR", ...args));
    }
  },

  /**
   * Log with custom level
   */
  log: (level, ...args) => {
    const levelMap = {
      debug: logger.debug,
      info: logger.info,
      warn: logger.warn,
      error: logger.error,
    };
    const logFn = levelMap[level.toLowerCase()] || logger.info;
    logFn(...args);
  },

  /**
   * Group related logs
   */
  group: (label, fn) => {
    if (isDevelopment) {
      console.group(label);
      try {
        fn();
      } finally {
        console.groupEnd();
      }
    } else {
      fn();
    }
  },

  /**
   * Log table data
   */
  table: (data) => {
    if (isDevelopment && currentLogLevel <= LOG_LEVELS.DEBUG) {
      console.table(data);
    }
  },
};

export default logger;
