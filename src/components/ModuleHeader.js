import React from 'react';
import { useAuth } from '../App';

/**
 * ModuleHeader - Header component dùng chung cho tất cả modules
 * @param {Object} props
 * @param {string} props.title - Tiêu đề module
 * @param {string} props.subtitle - Mô tả phụ (optional)
 * @param {React.Component} props.icon - Icon component
 * @param {React.ReactNode} props.actions - Các nút action bên phải (optional)
 * @param {string} props.status - Trạng thái module (optional)
 * @param {Object} props.stats - Thống kê nhanh (optional)
 */
const ModuleHeader = ({ title, subtitle, icon: Icon, actions, status = 'healthy', stats = {} }) => {
  const { user } = useAuth();

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      case 'offline':
        return 'text-gray-500';
      default:
        return 'text-blue-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'healthy':
        return 'Hoạt động bình thường';
      case 'warning':
        return 'Cảnh báo';
      case 'error':
        return 'Lỗi';
      case 'offline':
        return 'Offline';
      default:
        return 'Đang kiểm tra';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Title & Info */}
        <div className="flex items-center space-x-4">
          {Icon && (
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md">
              <Icon size={24} className="text-white" />
            </div>
          )}

          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>

            <div className="flex items-center space-x-4 mt-1">
              {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>}

              <div className="flex items-center space-x-2 text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString('vi-VN')} •{' '}
                  {new Date().toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>

                <span className="text-gray-300 dark:text-gray-600">•</span>

                <span className="text-gray-500 dark:text-gray-400">Trạng thái:</span>
                <span className={`font-medium ${getStatusColor(status)}`}>
                  {getStatusText(status)}
                </span>

                {user && (
                  <>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {user.name || user.username || 'Admin'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Stats & Actions */}
        <div className="flex items-center space-x-6">
          {/* Quick Stats */}
          {Object.keys(stats).length > 0 && (
            <div className="hidden md:flex items-center space-x-4">
              {Object.entries(stats).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{key}</div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
};

export default ModuleHeader;
