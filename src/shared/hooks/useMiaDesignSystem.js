import { useMemo } from 'react';
import { useTheme } from '../../App';
import {
  BRAND_COLORS,
  THEME_COLORS,
  TYPOGRAPHY,
  SPACING,
  COMPONENT_VARIANTS,
  SEMANTIC_COLORS,
  VIETNAMESE_LABELS,
  ICON_MAPPINGS
} from '../constants/designSystem';

// ==================== MIA DESIGN SYSTEM HOOK ====================
// Hook chính để sử dụng design system trong toàn bộ ứng dụng
// Phiên bản 2.0.0 - Tối ưu hóa cho warehouse management system

export const useMiaDesignSystem = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  // Theme colors dựa trên dark/light mode
  const colors = useMemo(() => ({
    // Theme colors cho mode hiện tại
    ...THEME_COLORS[isDarkMode ? 'dark' : 'light'],

    // Semantic colors (không thay đổi theo theme)
    semantic: SEMANTIC_COLORS,

    // Brand colors
    brand: {
      primary: BRAND_COLORS.primary,
      secondary: BRAND_COLORS.secondary,
      accent: BRAND_COLORS.accent,
    },

    // Helper functions để lấy màu theo variant
    getBgColor: (variant = 'primary') => {
      const theme = THEME_COLORS[isDarkMode ? 'dark' : 'light'];
      return theme.background[variant] || theme.background.primary;
    },

    getSurfaceColor: (variant = 'primary') => {
      const theme = THEME_COLORS[isDarkMode ? 'dark' : 'light'];
      return theme.surface[variant] || theme.surface.primary;
    },

    getTextColor: (variant = 'primary') => {
      const theme = THEME_COLORS[isDarkMode ? 'dark' : 'light'];
      return theme.text[variant] || theme.text.primary;
    },

    getBorderColor: (variant = 'primary') => {
      const theme = THEME_COLORS[isDarkMode ? 'dark' : 'light'];
      return theme.border[variant] || theme.border.primary;
    },

    // Status colors helper
    getStatusColor: (status) => {
      const statusMap = {
        success: SEMANTIC_COLORS.success.default,
        warning: SEMANTIC_COLORS.warning.default,
        error: SEMANTIC_COLORS.error.default,
        info: SEMANTIC_COLORS.info.default,
        neutral: SEMANTIC_COLORS.neutral.default,
        active: SEMANTIC_COLORS.success.default,
        pending: SEMANTIC_COLORS.warning.default,
        inactive: SEMANTIC_COLORS.neutral.default,
        completed: SEMANTIC_COLORS.success.default,
        processing: SEMANTIC_COLORS.info.default,
        cancelled: SEMANTIC_COLORS.error.default,
      };
      return statusMap[status] || SEMANTIC_COLORS.neutral.default;
    }
  }), [isDarkMode]);

  // Typography helpers với Vietnamese support
  const typography = useMemo(() => ({
    ...TYPOGRAPHY,

    // Helper functions cho text styles
    getHeadingStyle: (size = 'xl', color = 'primary') => ({
      fontSize: TYPOGRAPHY.fontSize[size],
      fontWeight: TYPOGRAPHY.fontWeight.semibold,
      lineHeight: TYPOGRAPHY.lineHeight.tight,
      color: colors.getTextColor(color),
      fontFamily: TYPOGRAPHY.fontFamily.primary.join(', '),
    }),

    getBodyStyle: (size = 'base', color = 'secondary') => ({
      fontSize: TYPOGRAPHY.fontSize[size],
      fontWeight: TYPOGRAPHY.fontWeight.normal,
      lineHeight: TYPOGRAPHY.lineHeight.normal,
      color: colors.getTextColor(color),
      fontFamily: TYPOGRAPHY.fontFamily.primary.join(', '),
    }),

    getCaptionStyle: (color = 'muted') => ({
      fontSize: TYPOGRAPHY.fontSize.sm,
      fontWeight: TYPOGRAPHY.fontWeight.normal,
      lineHeight: TYPOGRAPHY.lineHeight.normal,
      color: colors.getTextColor(color),
      fontFamily: TYPOGRAPHY.fontFamily.primary.join(', '),
    }),

    // Warehouse-specific text styles
    getWarehouseHeading: () => ({
      fontSize: TYPOGRAPHY.fontSize['2xl'],
      fontWeight: TYPOGRAPHY.fontWeight.bold,
      lineHeight: TYPOGRAPHY.lineHeight.tight,
      color: colors.getTextColor('primary'),
      fontFamily: TYPOGRAPHY.fontFamily.secondary.join(', '),
    }),

    getMetricText: () => ({
      fontSize: TYPOGRAPHY.fontSize['3xl'],
      fontWeight: TYPOGRAPHY.fontWeight.extrabold,
      lineHeight: TYPOGRAPHY.lineHeight.tight,
      color: BRAND_COLORS.primary[600],
      fontFamily: TYPOGRAPHY.fontFamily.primary.join(', '),
    })
  }), [colors]);

  // Component class builders - sử dụng COMPONENT_VARIANTS
  const getComponentClasses = useMemo(() => ({
    // Button classes
    button: (variant = 'primary', size = 'md', disabled = false) => {
      if (disabled) {
        return COMPONENT_VARIANTS.button[variant]?.disabled || COMPONENT_VARIANTS.button.primary.disabled;
      }

      const baseClasses = COMPONENT_VARIANTS.button[variant]?.base || COMPONENT_VARIANTS.button.primary.base;

      // Size classes cho các button size khác nhau
      const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm min-w-[80px]',
        md: 'px-4 py-2 text-base min-w-[100px]',
        lg: 'px-6 py-3 text-lg min-w-[120px]',
        xl: 'px-8 py-4 text-xl min-w-[140px]',
      };

      return `${baseClasses} ${sizeClasses[size] || sizeClasses.md}`;
    },

    // Card classes
    card: (variant = 'default') => {
      return COMPONENT_VARIANTS.card[variant] || COMPONENT_VARIANTS.card.default;
    },

    // Badge classes
    badge: (variant = 'default') => {
      return COMPONENT_VARIANTS.badge[variant] || COMPONENT_VARIANTS.badge.default;
    },

    // Input classes
    input: (variant = 'default') => {
      return COMPONENT_VARIANTS.input[variant] || COMPONENT_VARIANTS.input.default;
    },

    // Avatar classes
    avatar: (size = 'md') => {
      return COMPONENT_VARIANTS.avatar[size] || COMPONENT_VARIANTS.avatar.md;
    },

    // Layout classes
    container: (variant = 'default') => {
      const variants = {
        default: `min-h-screen transition-colors duration-200 ${colors.getBgColor('primary')}`,
        surface: `bg-white dark:bg-gray-800 transition-colors duration-200`,
        elevated: `bg-white dark:bg-gray-800 shadow-lg transition-all duration-200`,
        glass: `backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 transition-all duration-200`,
      };
      return variants[variant] || variants.default;
    },

    // Page layout classes
    page: () => `min-h-screen ${colors.getBgColor('primary')} ${colors.getTextColor('primary')} transition-colors duration-200`,

    // Content area classes
    content: () => `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6`,

    // Section classes
    section: (variant = 'default') => {
      const variants = {
        default: `${colors.getSurfaceColor('primary')} rounded-lg border ${colors.getBorderColor('primary')} p-6`,
        elevated: `${colors.getSurfaceColor('elevated')} rounded-lg shadow-lg p-6`,
        outlined: `${colors.getSurfaceColor('primary')} rounded-lg border-2 ${colors.getBorderColor('secondary')} p-6`,
      };
      return variants[variant] || variants.default;
    }
  }), [colors]);

  // Spacing helpers
  const spacing = useMemo(() => ({
    ...SPACING,

    // Helper function để get spacing value
    get: (size = 'md') => SPACING[size] || SPACING.md,

    // Warehouse-specific spacing
    warehouse: {
      cardPadding: SPACING.lg,
      sectionGap: SPACING.xl,
      componentGap: SPACING.md,
      elementGap: SPACING.sm,
    }
  }), []);

  // Vietnamese labels - tất cả đã được dịch
  const labels = useMemo(() => VIETNAMESE_LABELS, []);

  // Icon mappings - mapping tên tiếng Việt với icon
  const icons = useMemo(() => ICON_MAPPINGS, []);

  // Utility functions
  const utils = useMemo(() => ({
    // Combine classes safely
    cn: (...classes) => classes.filter(Boolean).join(' '),

    // Format currency in Vietnamese
    formatCurrency: (amount) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(amount);
    },

    // Format date in Vietnamese
    formatDate: (date) => {
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(date));
    },

    // Format time in Vietnamese
    formatTime: (date) => {
      return new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(new Date(date));
    },

    // Get warehouse status badge variant
    getWarehouseStatusVariant: (status) => {
      const statusMap = {
        active: 'success',
        inactive: 'error',
        pending: 'warning',
        completed: 'success',
        processing: 'info',
        cancelled: 'error',
        draft: 'neutral',
        approved: 'success',
        rejected: 'error',
      };
      return statusMap[status] || 'default';
    }
  }), []);

  return {
    // Theme state
    isDarkMode,
    toggleTheme,

    // Color system
    colors,

    // Typography system
    typography,

    // Component classes
    getComponentClasses,

    // Spacing system
    spacing,

    // Vietnamese localization
    labels,

    // Icon system
    icons,

    // Utility functions
    utils,

    // Theme configuration
    theme: {
      current: THEME_COLORS[isDarkMode ? 'dark' : 'light'],
      semantic: SEMANTIC_COLORS,
      brand: {
        primary: BRAND_COLORS.primary,
        secondary: BRAND_COLORS.secondary,
        accent: BRAND_COLORS.accent,
      },
      typography: TYPOGRAPHY,
      spacing: SPACING,
    }
  };
};

export default useMiaDesignSystem;
const typography = useMemo(() => ({
  ...TYPOGRAPHY,

  // Helper functions for common text styles
  getHeadingStyle: (size = 'xl') => ({
    fontSize: TYPOGRAPHY.fontSize[size],
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    lineHeight: TYPOGRAPHY.lineHeight.tight,
    color: colors.text.primary,
  }),

  getBodyStyle: (size = 'base') => ({
    fontSize: TYPOGRAPHY.fontSize[size],
    fontWeight: TYPOGRAPHY.fontWeight.normal,
    lineHeight: TYPOGRAPHY.lineHeight.normal,
    color: colors.text.secondary,
  }),

  getCaptionStyle: () => ({
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.normal,
    lineHeight: TYPOGRAPHY.lineHeight.normal,
    color: colors.text.muted,
  })
}), [colors.text]);

// Component class builders - sử dụng COMPONENT_VARIANTS đã định nghĩa
const getComponentClasses = useMemo(() => ({
  // Button classes - Lấy từ COMPONENT_VARIANTS
  button: (variant = 'primary', size = 'md', disabled = false) => {
    if (disabled) {
      return COMPONENT_VARIANTS.button[variant]?.disabled || COMPONENT_VARIANTS.button.primary.disabled;
    }

    const baseClasses = COMPONENT_VARIANTS.button[variant]?.base || COMPONENT_VARIANTS.button.primary.base;

    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return `${baseClasses} ${sizeClasses[size]}`;
  },

  // Card classes - Lấy từ COMPONENT_VARIANTS
  card: (variant = 'default') => {
    return COMPONENT_VARIANTS.card[variant] || COMPONENT_VARIANTS.card.default;
  },

  // Badge classes - Lấy từ COMPONENT_VARIANTS
  badge: (variant = 'default') => {
    return COMPONENT_VARIANTS.badge[variant] || COMPONENT_VARIANTS.badge.default;
  },

  // Input classes - Lấy từ COMPONENT_VARIANTS
  input: (variant = 'default') => {
    return COMPONENT_VARIANTS.input[variant] || COMPONENT_VARIANTS.input.default;
  },

  // Avatar classes - Lấy từ COMPONENT_VARIANTS
  avatar: (size = 'md') => {
    return COMPONENT_VARIANTS.avatar[size] || COMPONENT_VARIANTS.avatar.md;
  }
}), [isDarkMode]);
          : 'text-gray-700 hover:bg-gray-100 focus:ring-blue-500',
      };

const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';

return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? disabledClasses : ''}`;
    },

// Card classes
card: (variant = 'default') => {
  const baseClasses = 'rounded-lg transition-shadow duration-200';

  const variantClasses = {
    default: isDarkMode
      ? 'bg-gray-800 border border-gray-700 shadow-sm'
      : 'bg-white border border-gray-200 shadow-sm',
    elevated: isDarkMode
      ? 'bg-gray-800 border border-gray-700 shadow-md hover:shadow-lg'
      : 'bg-white border border-gray-200 shadow-md hover:shadow-lg',
    outlined: isDarkMode
      ? 'bg-gray-800 border-2 border-gray-600'
      : 'bg-white border-2 border-gray-300',
    filled: isDarkMode
      ? 'bg-gray-700 border border-gray-600'
      : 'bg-gray-50 border border-gray-200',
  };

  return `${baseClasses} ${variantClasses[variant]}`;
},

  // Badge classes
  badge: (variant = 'default') => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

    const variantClasses = {
      default: isDarkMode
        ? 'bg-gray-700 text-gray-200'
        : 'bg-gray-100 text-gray-800',
      success: isDarkMode
        ? 'bg-green-900 text-green-200'
        : 'bg-green-100 text-green-800',
      warning: isDarkMode
        ? 'bg-yellow-900 text-yellow-200'
        : 'bg-yellow-100 text-yellow-800',
      error: isDarkMode
        ? 'bg-red-900 text-red-200'
        : 'bg-red-100 text-red-800',
      info: isDarkMode
        ? 'bg-blue-900 text-blue-200'
        : 'bg-blue-100 text-blue-800',
    };

    return `${baseClasses} ${variantClasses[variant]}`;
  },

    // Input classes
    input: (error = false) => {
      const baseClasses = 'block w-full rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

      const normalClasses = isDarkMode
        ? 'bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
        : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500';

      const errorClasses = isDarkMode
        ? 'bg-gray-700 border border-red-500 text-gray-100 placeholder-gray-400 focus:ring-red-500 focus:border-red-500'
        : 'bg-white border border-red-300 text-gray-900 placeholder-gray-500 focus:ring-red-500 focus:border-red-500';

      return `${baseClasses} ${error ? errorClasses : normalClasses}`;
    },

      // Container classes
      container: (variant = 'default') => {
        const variantClasses = {
          default: isDarkMode
            ? 'bg-gray-900 text-gray-100'
            : 'bg-gray-50 text-gray-900',
          surface: isDarkMode
            ? 'bg-gray-800 text-gray-100'
            : 'bg-white text-gray-900',
          elevated: isDarkMode
            ? 'bg-gray-800 text-gray-100 shadow-lg'
            : 'bg-white text-gray-900 shadow-lg',
        };

        return `min-h-screen transition-colors duration-200 ${variantClasses[variant]}`;
      }
  }), [isDarkMode]);

// Vietnamese labels
const labels = VIETNAMESE_LABELS;

// Icon mappings
const icons = ICON_MAPPINGS;

return {
  // Theme state
  isDarkMode,
  toggleTheme,

  // Colors
  colors,

  // Typography
  typography,

  // Spacing
  spacing: SPACING,

  // Component classes
  getComponentClasses,

  // Labels in Vietnamese
  labels,

  // Icon mappings
  icons,

  // Helper functions
  utils: {
    // Conditional classes based on theme
    cn: (...classes) => classes.filter(Boolean).join(' '),

    // Status color helper
    getStatusColor: (status) => {
      const statusMap = {
        success: SEMANTIC_COLORS.success.default,
        warning: SEMANTIC_COLORS.warning.default,
        error: SEMANTIC_COLORS.error.default,
        info: SEMANTIC_COLORS.info.default,
        active: SEMANTIC_COLORS.success.default,
        pending: SEMANTIC_COLORS.warning.default,
        inactive: SEMANTIC_COLORS.error.default,
      };

      return statusMap[status] || colors.text.muted;
    },

    // Status badge class helper
    getStatusBadgeClass: (status) => {
      const statusMap = {
        success: 'success',
        warning: 'warning',
        error: 'error',
        info: 'info',
        active: 'success',
        pending: 'warning',
        inactive: 'error',
      };

      return getComponentClasses.badge(statusMap[status] || 'default');
    }
  }
};
};

export default useMiaDesignSystem;
