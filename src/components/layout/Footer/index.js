// ==================== FOOTER COMPONENT ====================
/**
 * Footer thông tin hệ thống và workspace status
 * Hiển thị: Version, sync status, workspace info, links
 * Cập nhật: 08/06/2025 - Trưởng phòng Kho vận
 */

import React from 'react';
import { Package } from 'lucide-react';

export const Footer = ({
  connectionStatus = 'connected',
  lastSyncTime,
  totalOrders = 0,
  systemVersion = 'v2.1.0',
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="px-4 lg:px-6 py-4">
        {/* Main footer content */}
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          {/* Left: System info */}
          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Package size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="font-medium">MIA Warehouse SLA Dashboard</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                {systemVersion}
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <span>
                Tổng đơn hàng: <strong>{totalOrders.toLocaleString()}</strong>
              </span>
              <span>•</span>
              <span>
                Workspace: <strong>Kho Vận MIA</strong>
              </span>
            </div>
          </div>

          {/* Right: Status và links */}
          <div className="flex items-center space-x-6 text-sm">
            {/* Sync status */}
            <div className="flex items-center space-x-2">
              {connectionStatus === 'connected' ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 dark:text-green-400">
                    Google Sheets Connected
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 dark:text-red-400">
                    Disconnected
                  </span>
                </>
              )}
              {lastSyncTime && (
                <span className="text-gray-500 dark:text-gray-400">
                  • Sync: {lastSyncTime.toLocaleTimeString('vi-VN')}
                </span>
              )}
            </div>

            {/* Links */}
            <div className="hidden lg:flex items-center space-x-4 text-gray-500 dark:text-gray-400">
              <button
                type="button"
                className="hover:text-blue-600 dark:hover:text-blue-400 bg-transparent border-none cursor-pointer"
              >
                Hướng dẫn
              </button>
              <span>•</span>
              <button
                type="button"
                className="hover:text-blue-600 dark:hover:text-blue-400 bg-transparent border-none cursor-pointer"
              >
                Hỗ trợ
              </button>
              <span>•</span>
              <button
                type="button"
                className="hover:text-blue-600 dark:hover:text-blue-400 bg-transparent border-none cursor-pointer"
              >
                API Docs
              </button>
            </div>
          </div>
        </div>

        {/* Bottom: Copyright và workspace details */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div>
            © {currentYear} MIA Group. Dashboard phát triển cho Trưởng phòng Kho
            vận.
          </div>
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <span>Environment: Production</span>
            <span>•</span>
            <span>Region: Vietnam</span>
            <span>•</span>
            <span>Cập nhật: 08/06/2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// This Footer component provides essential system information and workspace status.
// It includes connection status, last sync time, total orders, and version details.
// The footer is responsive and adapts to different screen sizes, ensuring important information is always accessible.
// The component uses Lucide icons for visual clarity and includes links for help and documentation.
