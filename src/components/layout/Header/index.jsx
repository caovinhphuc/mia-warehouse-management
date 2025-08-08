// ==================== HEADER COMPONENT ====================
/**
 * Header chính của Dashboard SLA Kho Vận
 * Tính năng: Navigation, search, sync status, notifications, user menu
 * Cập nhật: 12/06/2025 - Trưởng phòng Kho vận
 */

import {
  Bell,
  Database,
  Edit2,
  Menu,
  Moon,
  Package,
  RefreshCw,
  Search,
  Sun,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useTheme } from '../../../App'; // Import useTheme hook
import { useNotification } from '../../../shared/hooks/useNotification';
import QuickEditModal from '../../QuickEditModal';

export const Header = ({
  // Module customization props
  title = 'MIA Warehouse SLA',
  subtitle = 'Dashboard Quản lý Kho vận',
  breadcrumb = [],
  showSearch = true,
  searchPlaceholder = 'Tìm kiếm đơn hàng, sản phẩm...',
  customActions = [],

  // System props
  connectionStatus = 'connected',
  lastSyncTime,
  sidebarOpen,
  toggleSidebar,
  // Remove currentUser prop, will use auth context instead
}) => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme(); // Use theme hook
  const { logout, user, refreshUser } = useAuth(); // Use auth hook with refresh capability
  const [searchValue, setSearchValue] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showQuickEditModal, setShowQuickEditModal] = useState(false);
  const { notifications } = useNotification();
  const userMenuRef = useRef(null);

  // Real-time sync: Listen for profile updates from other components
  useEffect(() => {
    const handleUserProfileUpdate = (event) => {
      console.log('🔄 Header: Received profile update event', event.detail);

      try {
        // If auth context has refresh method, use it
        if (typeof refreshUser === 'function') {
          refreshUser(event.detail);
        } else {
          // Fallback: Update localStorage and trigger re-render
          const updatedUserData = {
            ...user,
            ...event.detail,
            lastUpdated: new Date().toISOString(),
          };

          localStorage.setItem('currentUser', JSON.stringify(updatedUserData));

          // Dispatch a storage event to trigger other components to refresh
          window.dispatchEvent(
            new StorageEvent('storage', {
              key: 'currentUser',
              newValue: JSON.stringify(updatedUserData),
            }),
          );

          console.log('✅ Header: User data synced via localStorage');
        }
      } catch (error) {
        console.error('❌ Header: Error syncing profile update:', error);
      }
    };

    // Listen for profile updates from UserProfile component
    window.addEventListener('userProfileUpdated', handleUserProfileUpdate);

    return () => {
      window.removeEventListener('userProfileUpdated', handleUserProfileUpdate);
    };
  }, [user, refreshUser]);

  // Listen for localStorage changes (for fallback sync)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'currentUser' && event.newValue) {
        try {
          const updatedUser = JSON.parse(event.newValue);
          console.log('🔄 Header: Detected localStorage user update', updatedUser);
          // Force component re-render by updating user state if needed
          // Note: This is handled automatically by auth context if properly implemented
        } catch (error) {
          console.error('❌ Header: Error parsing updated user data:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      // Use auth context logout for comprehensive cleanup
      await logout();

      // Close user menu
      setShowUserMenu(false);

      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: manual cleanup if auth logout fails
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('authToken');
      navigate('/login');
    }
  };

  // Handle user profile navigation
  const handleProfile = () => {
    navigate('/profile');
    setShowUserMenu(false);
  };

  // Handle settings navigation
  const handleSettings = () => {
    navigate('/users'); // Go to user management
    setShowUserMenu(false);
  };

  // Handle quick edit modal
  const handleQuickEdit = () => {
    setShowQuickEditModal(true);
    setShowUserMenu(false);
  };

  // Handle quick edit save
  const handleQuickEditSave = (updatedData) => {
    console.log('✅ Header: Quick edit saved', updatedData);
    // Modal will handle the global event dispatch and localStorage update
  };

  // Handle search
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchValue);
      // Navigate to search results or filter current page
      // You can implement actual search logic here
    }
  };

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
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-4 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        {/* Left Section: Logo + Mobile Menu + Title/Breadcrumb */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Mobile menu button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo và dynamic title */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
              <Package size={24} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h1>
                {breadcrumb.length > 0 && (
                  <nav className="flex items-center space-x-1 text-sm">
                    {breadcrumb.map((item, index) => (
                      <React.Fragment key={index}>
                        <span className="text-gray-400">/</span>
                        <span
                          className={`${
                            index === breadcrumb.length - 1
                              ? 'text-blue-600 dark:text-blue-400 font-medium'
                              : 'text-gray-500 dark:text-gray-400'
                          } ${item.href ? 'hover:text-blue-700 cursor-pointer' : ''}`}
                          onClick={() => item.href && navigate(item.href)}
                        >
                          {item.label}
                        </span>
                      </React.Fragment>
                    ))}
                  </nav>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
            </div>
          </div>

          {/* Dynamic Search bar */}
          {showSearch && (
            <div className="hidden md:flex relative max-w-md flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleSearch}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
              />
            </div>
          )}

          {/* Custom Actions */}
          {customActions.length > 0 && (
            <div className="hidden lg:flex items-center space-x-2">
              {customActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    action.variant === 'primary'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : action.variant === 'danger'
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                  title={action.tooltip}
                >
                  {action.icon && <action.icon size={16} className="inline mr-1" />}
                  {action.label}
                </button>
              ))}
            </div>
          )}
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
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isDarkMode ? (
              <Sun size={20} className="text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon size={20} className="text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                ) : (
                  <span className="text-white text-sm font-semibold">
                    {(user?.name || user?.username || 'Admin').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || user?.username || 'Trưởng phòng Kho vận'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role || user?.position || 'Manager'}
                </p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                <button
                  onClick={handleProfile}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Thông tin cá nhân
                </button>
                <button
                  onClick={handleQuickEdit}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <Edit2 size={16} className="mr-2" />
                  Chỉnh sửa nhanh
                </button>
                <button
                  onClick={handleSettings}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Quản lý người dùng
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search - shown when screen is small */}
      {showSearch && (
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleSearch}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
            />
          </div>
        </div>
      )}

      {/* Quick Edit Modal */}
      <QuickEditModal
        isOpen={showQuickEditModal}
        onClose={() => setShowQuickEditModal(false)}
        user={user}
        onSave={handleQuickEditSave}
      />
    </header>
  );
};

Header.displayName = 'Header';

Header.propTypes = {
  // Module customization props
  title: PropTypes.string,
  subtitle: PropTypes.string,
  breadcrumb: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
    }),
  ),
  showSearch: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  customActions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      icon: PropTypes.elementType,
      variant: PropTypes.oneOf(['default', 'primary', 'danger']),
      tooltip: PropTypes.string,
    }),
  ),

  // System props
  connectionStatus: PropTypes.string,
  lastSyncTime: PropTypes.instanceOf(Date),
  sidebarOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  // currentUser removed - now using auth context
};

Header.defaultProps = {
  // Module customization defaults
  title: 'MIA Warehouse SLA',
  subtitle: 'Dashboard Quản lý Kho vận',
  breadcrumb: [],
  showSearch: true,
  searchPlaceholder: 'Tìm kiếm đơn hàng, sản phẩm...',
  customActions: [],

  // System defaults
  connectionStatus: 'connected',
  lastSyncTime: null,
  // currentUser removed - now using auth context
};

export default Header;
