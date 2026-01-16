// ==================== IMPORTS ====================
import { UploadCloud } from 'lucide-react';
import { createContext, useContext, useEffect, useState } from 'react';

import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Archive,
  BarChart2,
  Bell,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Database,
  FileText,
  Info,
  Loader2,
  LogOut,
  Map,
  Menu,
  Moon,
  Navigation,
  Package,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Sun,
  TrendingUp,
  Truck,
  User,
  Users,
  Wifi,
  WifiOff,
  X,
  XCircle,
} from 'lucide-react';

// ==================== NOTIFICATION PROVIDER ====================
/**
 * Provider quản lý thông báo toàn hệ thống
 * Tích hợp với Google Sheets sync status và warehouse alerts
 * Cập nhật: 08/06/2025 - Trưởng phòng Kho vận
 */

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [maxNotifications] = useState(5); // Giới hạn 5 thông báo hiển thị

  // Thêm thông báo mới
  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      timestamp: new Date(),
      ...notification,
    };

    setNotifications((prev) => {
      const updated = [newNotification, ...prev].slice(0, maxNotifications);
      return updated;
    });

    // Tự động xóa thông báo sau 5s (trừ loại 'error' và 'warning')
    if (!['error', 'warning'].includes(notification.type)) {
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    }

    return id;
  };

  // Xóa thông báo
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Clear tất cả thông báo
  const clearAll = () => {
    setNotifications([]);
  };

  // Các method tiện ích cho warehouse operations
  const notifySuccess = (message, details = '') =>
    addNotification({ type: 'success', message, details });

  const notifyError = (message, details = '') =>
    addNotification({ type: 'error', message, details });

  const notifyWarning = (message, details = '') =>
    addNotification({ type: 'warning', message, details });

  const notifyInfo = (message, details = '') => addNotification({ type: 'info', message, details });

  // Thông báo đặc biệt cho SLA và sync
  const notifySLAAlert = (orderID, remainingTime) =>
    addNotification({
      type: 'warning',
      message: `Đơn hàng ${orderID} sắp quá hạn SLA`,
      details: `Còn ${remainingTime} phút để hoàn thành`,
      action: { label: 'Xem đơn', href: `/orders/${orderID}` },
    });

  const notifySyncStatus = (status, details) =>
    addNotification({
      type: status === 'success' ? 'success' : 'error',
      message: `Google Sheets ${status === 'success' ? 'đồng bộ thành công' : 'lỗi đồng bộ'}`,
      details: details,
    });

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAll,
        notifySuccess,
        notifyError,
        notifyWarning,
        notifyInfo,
        notifySLAAlert,
        notifySyncStatus,
      }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Hook sử dụng notification
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

// Container hiển thị notifications
const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

// Component notification item
const NotificationItem = ({ notification, onRemove }) => {
  const { type, message, details, timestamp, action } = notification;

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      iconColor: 'text-red-600 dark:text-red-400',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div
      className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor} shadow-lg transform transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-start space-x-3">
        <Icon size={20} className={config.iconColor} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{message}</p>
          {details && <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{details}</p>}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {timestamp.toLocaleTimeString('vi-VN')}
          </p>
          {action && (
            <button className="text-xs text-blue-600 hover:text-blue-800 mt-1">
              {action.label} →
            </button>
          )}
        </div>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// ==================== HEADER COMPONENT ====================
/**
 * Header chính của Dashboard SLA Kho Vận
 * Tính năng: Navigation, search, sync status, notifications, user menu
 * Cập nhật: 08/06/2025 - Trưởng phòng Kho vận
 */

export const Header = ({
  isDarkMode,
  toggleDarkMode,
  connectionStatus = 'connected',
  lastSyncTime,
  sidebarOpen,
  toggleSidebar,
  currentUser = { name: 'Trưởng phòng Kho vận', role: 'Manager' },
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { notifications } = useNotification();

  // Connection status config
  const getConnectionStatus = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: Wifi,
          color: 'text-green-500',
          text: 'Đã kết nối',
          subtitle: lastSyncTime ? `Sync: ${lastSyncTime.toLocaleTimeString('vi-VN')}` : '',
        };
      case 'connecting':
        return {
          icon: RefreshCw,
          color: 'text-blue-500',
          text: 'Đang kết nối...',
          subtitle: 'Thiết lập kết nối Google Sheets',
        };
      case 'error':
        return {
          icon: WifiOff,
          color: 'text-red-500',
          text: 'Lỗi kết nối',
          subtitle: 'Không thể kết nối Google Sheets',
        };
      default:
        return {
          icon: Database,
          color: 'text-gray-500',
          text: 'Chưa kết nối',
          subtitle: '',
        };
    }
  };

  const connStatus = getConnectionStatus();
  const StatusIcon = connStatus.icon;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section: Logo + Mobile Menu + Search */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Mobile menu button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo và title */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Package size={24} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">MIA Warehouse SLA</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard Quản lý Kho vận</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex relative max-w-md flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng, sản phẩm..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Right Section: Status + Controls + User */}
        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <StatusIcon
              size={16}
              className={`${connStatus.color} ${
                connectionStatus === 'connecting' ? 'animate-spin' : ''
              }`}
            />
            <div>
              <p className={`text-xs font-medium ${connStatus.color}`}>{connStatus.text}</p>
              {connStatus.subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{connStatus.subtitle}</p>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Bell size={20} className="text-gray-600 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isDarkMode ? (
              <Sun size={20} className="text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon size={20} className="text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentUser.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.role}</p>
              </div>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {/* User dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="py-2">
                  <button
                    type="button"
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                  >
                    <User size={16} className="mr-3" />
                    Thông tin cá nhân
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                  >
                    <Settings size={16} className="mr-3" />
                    Cài đặt
                  </button>
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <button
                    type="button"
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
                  >
                    <LogOut size={16} className="mr-3" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search - shown when screen is small */}
      <div className="md:hidden mt-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>
    </header>
  );
};

// ==================== SIDEBAR COMPONENT ====================
/**
 * Sidebar navigation cho Dashboard Kho vận
 * Menu: Dashboard, Đơn hàng, Nhân sự, Báo cáo, Cảnh báo, Kho, Cài đặt
 * Cập nhật: 08/06/2025 - Trưởng phòng Kho vận
 */

export const Sidebar = ({ isOpen, currentPath = '/dashboard', onNavigate = () => {} }) => {
  const [expandedSections, setExpandedSections] = useState(['main']);

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
          badge: 'P1: 5', // Hiển thị số đơn P1
        },
        {
          id: 'picking',
          label: 'Lấy hàng thông minh',
          icon: Navigation,
          path: '/picking',
          description: 'Route optimization & tracking',
        },
        {
          id: 'warehouse',
          label: 'Bản đồ Kho',
          icon: Map,
          path: '/warehouse',
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
        {
          id: 'carriers',
          label: 'Đơn vị vận chuyển',
          icon: Truck,
          path: '/carriers',
          description: 'GHN, J&T, GHTK, Shopee Express',
        },
        {
          id: 'inventory',
          label: 'Tồn kho',
          icon: Archive,
          path: '/inventory',
          description: 'Quản lý stock levels',
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
          id: 'reports',
          label: 'Báo cáo',
          icon: FileText,
          path: '/reports',
          description: 'Export và scheduled reports',
        },
        {
          id: 'alerts',
          label: 'Cảnh báo',
          icon: AlertTriangle,
          path: '/alerts',
          description: 'SLA alerts & notifications',
          badge: '3', // Số cảnh báo active
        },
      ],
    },
    {
      section: 'system',
      title: 'Hệ thống',
      items: [
        {
          id: 'integrations',
          label: 'Tích hợp',
          icon: Database,
          path: '/integrations',
          description: 'Google Sheets, APIs',
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
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
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
        fixed top-0 left-0 z-30 h-full w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
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
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">MIA Warehouse</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">SLA Dashboard</p>
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
                      expandedSections.includes(section.section) ? 'rotate-90' : ''
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
                            className={isActive ? 'text-blue-600 dark:text-blue-400' : ''}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate">{item.label}</p>
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
                <Shield size={16} className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  MIA Warehouse v2.1
                </span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Google Sheets Integration Active
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Cập nhật: 08/06/2025</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

// ==================== FOOTER COMPONENT ====================
/**
 * Footer thông tin hệ thống và workspace status
 * Hiển thị: Version, sync status, workspace info, links
 * Cập nhật: 08/06/2025 - Trưởng phòng Kho vận
 */

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
                  <span className="text-red-600 dark:text-red-400">Disconnected</span>
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
              <button type="button" className="hover:text-blue-600 dark:hover:text-blue-400">
                Hướng dẫn
              </button>
              <span>•</span>
              <button type="button" className="hover:text-blue-600 dark:hover:text-blue-400">
                Hỗ trợ
              </button>
              <span>•</span>
              <button type="button" className="hover:text-blue-600 dark:hover:text-blue-400">
                API Docs
              </button>
            </div>
          </div>
        </div>

        {/* Bottom: Copyright và workspace details */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div>© {currentYear} MIA Group. Dashboard phát triển cho Trưởng phòng Kho vận.</div>
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

// ==================== LOADING SPINNER COMPONENT ====================
/**
 * Loading component cho các thao tác async (Google Sheets sync, data loading)
 * Các loại: default, sync, upload, process
 * Cập nhật: 08/06/2025 - Trưởng phòng Kho vận
 */

export const LoadingSpinner = ({
  type = 'default',
  message = 'Đang tải...',
  size = 'md',
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const typeConfig = {
    default: {
      icon: Loader2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    sync: {
      icon: RefreshCw,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    upload: {
      icon: UploadCloud,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    process: {
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  };

  const config = typeConfig[type] || typeConfig.default;
  const Icon = config.icon;

  const LoadingContent = () => (
    <div
      className={`flex flex-col items-center justify-center space-y-4 p-6 rounded-lg ${config.bgColor}`}
    >
      <Icon className={`${sizeClasses[size]} ${config.color} animate-spin`} />
      <div className="text-center">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{message}</p>
        {type === 'sync' && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Đồng bộ với Google Sheets...
          </p>
        )}
        {type === 'upload' && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Đang tải lên dữ liệu...</p>
        )}
        {type === 'process' && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Xử lý yêu cầu...</p>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 z-50 flex items-center justify-center">
        <LoadingContent />
      </div>
    );
  }

  return <LoadingContent />;
};

// ==================== ERROR FALLBACK COMPONENT ====================
/**
 * Error boundary fallback cho xử lý lỗi toàn hệ thống
 * Các loại lỗi: connection, data, permission, general
 * Cập nhật: 08/06/2025 - Trưởng phòng Kho vận
 */

export const ErrorFallback = ({
  error,
  errorType = 'general',
  resetError,
  componentName = 'Component',
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const errorConfig = {
    connection: {
      icon: WifiOff,
      title: 'Lỗi kết nối',
      description: 'Không thể kết nối với Google Sheets hoặc các dịch vụ bên ngoài.',
      color: 'red',
      suggestions: [
        'Kiểm tra kết nối internet',
        'Thử kết nối lại Google Sheets',
        'Liên hệ IT support nếu vấn đề tiếp tục',
      ],
    },
    data: {
      icon: Database,
      title: 'Lỗi dữ liệu',
      description: 'Dữ liệu không hợp lệ hoặc bị lỗi trong quá trình xử lý.',
      color: 'orange',
      suggestions: [
        'Kiểm tra định dạng dữ liệu trong Google Sheets',
        'Đảm bảo các cột bắt buộc có đầy đủ dữ liệu',
        'Liên hệ Trưởng phòng Kho vận để kiểm tra',
      ],
    },
    permission: {
      icon: Shield,
      title: 'Lỗi phân quyền',
      description: 'Bạn không có quyền truy cập tính năng này.',
      color: 'yellow',
      suggestions: [
        'Liên hệ quản trị viên để cấp quyền',
        'Đăng nhập lại với tài khoản có quyền phù hợp',
      ],
    },
    general: {
      icon: AlertCircle,
      title: 'Đã xảy ra lỗi',
      description: 'Hệ thống gặp sự cố không mong muốn.',
      color: 'gray',
      suggestions: [
        'Thử tải lại trang',
        'Kiểm tra console để xem thông tin chi tiết',
        'Liên hệ support nếu lỗi tiếp tục xảy ra',
      ],
    },
  };

  const config = errorConfig[errorType] || errorConfig.general;
  const Icon = config.icon;

  const getColorClasses = (color) =>
    ({
      red: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        icon: 'text-red-600 dark:text-red-400',
        button: 'bg-red-600 hover:bg-red-700',
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-200 dark:border-orange-800',
        icon: 'text-orange-600 dark:text-orange-400',
        button: 'bg-orange-600 hover:bg-orange-700',
      },
      yellow: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        icon: 'text-yellow-600 dark:text-yellow-400',
        button: 'bg-yellow-600 hover:bg-yellow-700',
      },
      gray: {
        bg: 'bg-gray-50 dark:bg-gray-800',
        border: 'border-gray-200 dark:border-gray-700',
        icon: 'text-gray-600 dark:text-gray-400',
        button: 'bg-gray-600 hover:bg-gray-700',
      },
    }[color]);

  const colors = getColorClasses(config.color);

  return (
    <div className={`p-6 rounded-lg border ${colors.bg} ${colors.border} max-w-2xl mx-auto`}>
      <div className="flex items-start space-x-4">
        <Icon size={24} className={colors.icon} />

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {config.title}
          </h3>

          <p className="text-gray-700 dark:text-gray-300 mb-4">{config.description}</p>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Component:{' '}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{componentName}</code>
          </p>

          {/* Suggestions */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Gợi ý khắc phục:
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              {config.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={resetError}
              className={`px-4 py-2 text-white rounded-lg ${colors.button} transition-colors`}
            >
              Thử lại
            </button>

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {showDetails ? 'Ẩn chi tiết' : 'Xem chi tiết lỗi'}
            </button>
          </div>

          {/* Error details */}
          {showDetails && (
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Chi tiết lỗi:
              </h5>
              <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap overflow-auto max-h-40">
                {error?.stack || error?.message || 'Không có thông tin chi tiết'}
              </pre>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Thời gian: {new Date().toLocaleString('vi-VN')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== NETWORK STATUS COMPONENT ====================
/**
 * NetworkStatus component - Hiển thị trạng thái kết nối mạng
 * Tích hợp với App state để theo dõi kết nối và hiệu suất hệ thống
 */
export const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionQuality, setConnectionQuality] = useState('good');
  const [lastCheck, setLastCheck] = useState(new Date());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setConnectionQuality('good');
      setLastCheck(new Date());
    };

    const handleOffline = () => {
      setIsOnline(false);
      setConnectionQuality('offline');
      setLastCheck(new Date());
    };

    const checkConnectionQuality = async () => {
      if (!navigator.onLine) return;

      const startTime = performance.now();
      try {
        await fetch('/favicon.ico', {
          method: 'HEAD',
          cache: 'no-cache',
        });
        const latency = performance.now() - startTime;

        if (latency < 200) {
          setConnectionQuality('excellent');
        } else if (latency < 500) {
          setConnectionQuality('good');
        } else if (latency < 1000) {
          setConnectionQuality('fair');
        } else {
          setConnectionQuality('poor');
        }
        setLastCheck(new Date());
      } catch (error) {
        setConnectionQuality('poor');
      }
    };

    // Event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic connection quality check
    const interval = setInterval(checkConnectionQuality, 30000); // Every 30 seconds

    // Initial check
    checkConnectionQuality();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const getStatusConfig = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        color: 'text-red-500',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        text: 'Offline',
        description: 'Không có kết nối mạng',
      };
    }

    switch (connectionQuality) {
      case 'excellent':
        return {
          icon: Wifi,
          color: 'text-green-500',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          text: 'Excellent',
          description: 'Kết nối tuyệt vời',
        };
      case 'good':
        return {
          icon: Wifi,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          text: 'Good',
          description: 'Kết nối tốt',
        };
      case 'fair':
        return {
          icon: Wifi,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          text: 'Fair',
          description: 'Kết nối chậm',
        };
      case 'poor':
        return {
          icon: Wifi,
          color: 'text-orange-500',
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800',
          text: 'Poor',
          description: 'Kết nối kém',
        };
      default:
        return {
          icon: Wifi,
          color: 'text-gray-500',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
          text: 'Unknown',
          description: 'Đang kiểm tra...',
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div
      className={`fixed bottom-4 left-4 z-40 ${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg p-3 shadow-lg backdrop-blur-sm`}
    >
      <div className="flex items-center space-x-2">
        <StatusIcon size={16} className={statusConfig.color} />
        <div>
          <div className="flex items-center space-x-1">
            <span className={`text-xs font-medium ${statusConfig.color}`}>{statusConfig.text}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{statusConfig.description}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {lastCheck.toLocaleTimeString('vi-VN')}
          </p>
        </div>
      </div>
    </div>
  );
};

// ==================== DEMO COMPONENT ====================
/**
 * Component demo để test các shared components
 * Cập nhật: 08/06/2025 - Trưởng phòng Kho vận
 */

const SharedComponentsDemo = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [connectionStatus] = useState('connected');
  const [showError, setShowError] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const { notifySuccess, notifyError } = useNotification();

  const lastSyncTime = new Date();

  const handleNavigation = (path) => {
    if (typeof path === 'string') {
      setCurrentPath(path);
    }
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const resetError = () => {
    setShowError(false);
  };

  if (showError) {
    return (
      <div className="p-8">
        <ErrorFallback
          error={new Error('Demo error for testing')}
          errorType="connection"
          resetError={resetError}
          componentName="SharedComponentsDemo"
        />
      </div>
    );
  }

  if (showLoading) {
    return <LoadingSpinner type="sync" message="Đang đồng bộ với Google Sheets..." fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} currentPath={currentPath} onNavigate={handleNavigation} />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <Header
            isDarkMode={isDarkMode}
            toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            connectionStatus={connectionStatus}
            lastSyncTime={lastSyncTime}
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
            currentUser={{ name: 'Trưởng phòng Kho vận', role: 'Manager' }}
          />

          {/* Content */}
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Demo controls */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Component Demo Controls
                  </h2>
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowLoading(!showLoading)}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      {showLoading ? 'Hide' : 'Show'} Loading Spinner
                    </button>
                    <button
                      onClick={() => setShowError(!showError)}
                      className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      {showError ? 'Hide' : 'Show'} Error State
                    </button>
                    <button
                      onClick={() => {
                        notifySuccess('Thành công!', 'Đây là thông báo thành công.');
                        setTimeout(() => {
                          notifyError('Lỗi!', 'Đây là thông báo lỗi.');
                        }, 2000);
                      }}
                      className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      Trigger Test Notification
                    </button>
                  </div>
                </div>

                {/* Current status */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Status hiện tại:
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      Theme:{' '}
                      <span className="font-medium">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                    </p>
                    <p>
                      Current Path: <span className="font-medium">{currentPath}</span>
                    </p>
                    <p>
                      Connection: <span className="font-medium">{connectionStatus}</span>
                    </p>
                    <p>
                      Last Sync:{' '}
                      <span className="font-medium">{lastSyncTime.toLocaleString('vi-VN')}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <Footer
            connectionStatus={connectionStatus}
            lastSyncTime={lastSyncTime}
            totalOrders={1247}
          />
        </div>
      </div>
    </div>
  );
};

// Main export component wrapped with NotificationProvider
export default function SharedComponentsApp() {
  return (
    <NotificationProvider>
      <SharedComponentsDemo />
    </NotificationProvider>
  );
}
