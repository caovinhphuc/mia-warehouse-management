// ==================== SIDEBAR COMPONENT ====================
/**
 * Sidebar navigation cho Dashboard Kho vận
 * Menu: Dashboard, Đơn hàng, Nhân sự, Báo cáo, Cảnh báo, Kho, Cài đặt
 * Cập nhật: 08/06/2025 - Trưởng phòng Kho vận
 */

import React, { useState } from 'react';
// import { useTheme } from '../../../App'; // Import useTheme hook - Ready for dark mode styling
import {
  BarChart2,
  Package,
  Navigation,
  Map,
  Users,
  Truck,
  Archive,
  TrendingUp,
  AlertTriangle,
  Settings,
  Shield,
  ChevronRight,
  Bot,
} from 'lucide-react';

export const Sidebar = ({
  isOpen,
  currentPath = '/dashboard',
  onNavigate = () => {},
}) => {
  const [expandedSections, setExpandedSections] = useState(['main']);
  // const { isDarkMode } = useTheme(); // Use theme hook - not used yet but ready for dark mode styling

  // Menu configuration cho hệ thống kho vận
  const menuItems = [
    {
      section: 'main',
      title: 'Chức năng chính',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard SLA',
          icon: BarChart2,
          path: '/dashboard',
          description: 'Tổng quan SLA và KPI',
        },
        {
          id: 'orders',
          label: 'Quản lý Đơn hàng',
          icon: Package,
          path: '/orders',
          description: 'P1-P4 priority tracking',
          badge: 'P1: 5',
        },
        {
          id: 'picking',
          label: 'Lấy hàng thông minh',
          icon: Navigation,
          path: '/picking',
          description: 'Route optimization & tracking',
        },
        {
          id: 'warehouse-map',
          label: 'Bản đồ Kho',
          icon: Map,
          path: '/warehouse-map',
          description: 'Layout và tối ưu hóa vị trí',
        },
      ],
    },
    {
      section: 'management',
      title: 'Quản lý',
      items: [
        {
          id: 'staff',
          label: 'Nhân sự',
          icon: Users,
          path: '/staff',
          description: 'Phân ca và hiệu suất',
        },
        // {
        //   id: 'tasks',
        //   label: 'Nhiệm vụ',
        //   icon: Archive,
        //   path: '/tasks',
        //   description: 'Quản lý nhiệm vụ',
        // },
      ],
    },
    {
      section: 'logistics',
      title: 'Logistics & Kho',
      items: [
        {
          id: 'transport',
          label: 'Kho bãi & Vận chuyển',
          icon: Truck,
          path: '/transport',
          description: 'Quản lý kho bãi và vận chuyển',
        },
        {
          id: 'inventory',
          label: 'Tồn kho',
          icon: Archive,
          path: '/inventory',
          description: 'Quản lý stock levels',
        },
        {
          id: 'shippingsla',
          label: 'Hệ Thống SLA',
          icon: Shield,
          path: '/shippingsla',
          description: 'Quản lý SLA vận chuyển và giám sát',
        },
      ],
    },
    {
      section: 'analytics',
      title: 'Phân tích & Báo cáo',
      items: [
        {
          id: 'analytics',
          label: 'Phân tích nâng cao',
          icon: TrendingUp,
          path: '/analytics',
          description: 'Insights và dự báo',
        },
        {
          id: 'alerts',
          label: 'Cảnh báo',
          icon: AlertTriangle,
          path: '/alerts',
          description: 'SLA alerts & notifications',
          badge: '3',
        },
      ],
    },
    {
      section: 'system',
      title: 'Hệ thống',
      items: [
        {
          id: 'automation',
          label: 'ONE Automation',
          icon: Bot,
          path: '/automation',
          description: 'Tự động hóa thu thập dữ liệu',
        },
        {
          id: 'settings',
          label: 'Cài đặt',
          icon: Settings,
          path: '/settings',
          description: 'System configuration',
        },
      ],
    },
  ];

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isItemActive = (path) => currentPath === path;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => onNavigate(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header - hidden on desktop since header shows logo */}
          <div className="lg:hidden p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Package size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  MIA Warehouse
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SLA Dashboard
                </p>
              </div>
            </div>
          </div>

          {/* Navigation menu */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((section) => (
              <div key={section.section} className="mb-6">
                {/* Section header */}
                <button
                  onClick={() => toggleSection(section.section)}
                  className="w-full flex items-center justify-between text-left px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {section.title}
                  <ChevronRight
                    size={14}
                    className={`transform transition-transform ${
                      expandedSections.includes(section.section)
                        ? 'rotate-90'
                        : ''
                    }`}
                  />
                </button>

                {/* Section items */}
                {expandedSections.includes(section.section) && (
                  <div className="mt-2 space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = isItemActive(item.path);

                      return (
                        <button
                          key={item.id}
                          onClick={() => onNavigate(item.path)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                            isActive
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <Icon
                            size={18}
                            className={
                              isActive ? 'text-blue-600 dark:text-blue-400' : ''
                            }
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate">
                                {item.label}
                              </p>
                              {item.badge && (
                                <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Shield
                  size={16}
                  className="text-blue-600 dark:text-blue-400"
                />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  MIA Warehouse v2.1
                </span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Google Sheets Integration Active
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Cập nhật: 08/06/2025
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

Sidebar.displayName = 'Sidebar';

// This Sidebar component provides a responsive navigation menu for the MIA Warehouse Dashboard.
