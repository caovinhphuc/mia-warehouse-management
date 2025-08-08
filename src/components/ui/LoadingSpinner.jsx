import React from 'react';
import { useTheme } from '../../App';

export const LoadingSpinner = ({
  size = 'medium',
  text = 'Đang tải...',
  className = '',
}) => {
  const { isDarkMode } = useTheme();

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    extra: 'w-16 h-16',
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    extra: 'text-xl',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      <div className="relative">
        <div
          className={`${
            sizeClasses[size]
          } border-4 rounded-full animate-spin transition-colors duration-200 ${
            isDarkMode
              ? 'border-gray-600 border-t-blue-400'
              : 'border-gray-300 border-t-blue-600'
          }`}
        ></div>
      </div>
      {text && (
        <p
          className={`${
            textSizeClasses[size]
          } font-medium transition-colors duration-200 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          {text}
        </p>
      )}
    </div>
  );
};

// Component for inline loading (smaller, no text)
export const InlineLoader = ({ className = '' }) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`w-4 h-4 border-2 rounded-full animate-spin transition-colors duration-200 ${
        isDarkMode
          ? 'border-gray-600 border-t-blue-400'
          : 'border-gray-300 border-t-blue-600'
      } ${className}`}
    ></div>
  );
};

// Component for page loading (full screen)
export const PageLoader = ({ text = 'Đang tải trang...' }) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-900/80' : 'bg-white/80'
      }`}
    >
      <div
        className={`p-8 rounded-lg shadow-lg transition-colors duration-200 ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        } border`}
      >
        <LoadingSpinner size="large" text={text} />
      </div>
    </div>
  );
};

// Component for content loading (within a container)
export const ContentLoader = ({
  text = 'Đang tải nội dung...',
  minHeight = '200px',
}) => {
  return (
    <div
      className="flex items-center justify-center w-full"
      style={{ minHeight }}
    >
      <LoadingSpinner size="medium" text={text} />
    </div>
  );
};

export default LoadingSpinner;
