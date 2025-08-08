import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { useTheme } from '../../App';

export const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const { isDarkMode } = useTheme();

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-red-900'
          : 'bg-gradient-to-br from-red-50 via-white to-orange-50'
      }`}
    >
      <div
        className={`max-w-md w-full p-8 rounded-lg shadow-xl transition-colors duration-200 ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        } border`}
      >
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div
            className={`p-4 rounded-full ${
              isDarkMode ? 'bg-red-900/30' : 'bg-red-100'
            }`}
          >
            <AlertTriangle
              className={`w-12 h-12 ${
                isDarkMode ? 'text-red-400' : 'text-red-600'
              }`}
            />
          </div>
        </div>

        {/* Error Message */}
        <div className="text-center mb-6">
          <h1
            className={`text-2xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Đã xảy ra lỗi
          </h1>
          <p
            className={`text-sm mb-4 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Ứng dụng đã gặp sự cố không mong muốn. Vui lòng thử lại hoặc liên hệ
            bộ phận hỗ trợ.
          </p>

          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === 'development' && error && (
            <div
              className={`p-4 rounded-lg text-left text-xs font-mono mb-4 ${
                isDarkMode
                  ? 'bg-gray-900 border-gray-700 text-red-400'
                  : 'bg-gray-100 border-gray-200 text-red-600'
              } border`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Bug className="w-4 h-4" />
                <span className="font-semibold">Chi tiết lỗi:</span>
              </div>
              <div className="whitespace-pre-wrap break-all">
                {error.toString()}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={resetErrorBoundary}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>

          <button
            onClick={handleReload}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium border transition-colors duration-200 ${
              isDarkMode
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            Tải lại trang
          </button>

          <button
            onClick={handleGoHome}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium border transition-colors duration-200 ${
              isDarkMode
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </button>
        </div>

        {/* Support Info */}
        <div
          className={`mt-6 pt-6 border-t text-center text-xs ${
            isDarkMode
              ? 'border-gray-700 text-gray-400'
              : 'border-gray-200 text-gray-500'
          }`}
        >
          <p>Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ:</p>
          <p className="font-semibold mt-1">
            Bộ phận Hỗ trợ Kỹ thuật - MIA Warehouse
          </p>
        </div>
      </div>
    </div>
  );
};

// Simple error component for smaller errors
export const SimpleError = ({ message, onRetry }) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 rounded-lg border ${
        isDarkMode
          ? 'bg-red-900/20 border-red-700 text-red-400'
          : 'bg-red-50 border-red-200 text-red-700'
      }`}
    >
      <AlertTriangle className="w-8 h-8 mb-3" />
      <p className="text-sm text-center mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            isDarkMode
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          Thử lại
        </button>
      )}
    </div>
  );
};

export default ErrorFallback;
