import {
  AlertCircle,
  BarChart3,
  Bell,
  ClipboardList,
  Database,
  Home,
  LogOut,
  MapIcon,
  Menu,
  Package,
  Settings,
  User,
  Users,
  Warehouse,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../App';
import { getSidebarClasses, getThemeClasses } from '../shared/constants/theme';

const Sidebar = ({ isOpen = true, toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout, isDarkMode } = useAuth();

  // Get centralized theme classes
  const themeClasses = getThemeClasses(isDarkMode);
  const sidebarClasses = getSidebarClasses(isDarkMode);

  const handleLogout = () => {
    logout();
    // Navigation will be handled by the auth provider
  };

  const menuSections = [
    {
      title: 'Chức năng chính',
      items: [
        { name: 'Dashboard SLA', icon: Home, path: '/dashboard' },
        { name: 'Quản lý Đơn hàng', icon: ClipboardList, path: '/orders' },
        { name: 'Lấy hàng thông minh', icon: Package, path: '/picking' },
        { name: 'Cảnh báo', icon: AlertCircle, path: '/alerts' },
      ],
    },
    {
      title: 'Quản lý hệ thống',
      items: [
        { name: 'Quản lý Nhân sự', icon: Users, path: '/staff' },
        { name: 'Quản lý Tồn kho', icon: Warehouse, path: '/inventory' },
        { name: 'Bản đồ kho', icon: MapIcon, path: '/warehouse-map' },
        { name: 'Phân tích & Báo cáo', icon: BarChart3, path: '/analytics' },
        { name: 'Quản lý Người dùng', icon: User, path: '/users' },
      ],
    },
    {
      title: 'Cài đặt & Hỗ trợ',
      items: [
        { name: 'Cài đặt hệ thống', icon: Settings, path: '/settings' },
        { name: 'Dữ liệu Google Sheets', icon: Database, path: '/google-sheets-data' },
        { name: 'Hồ sơ nâng cao', icon: User, path: '/enhanced-profile' },
      ],
    },
  ];

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: 'Đơn hàng mới',
      message: '5 đơn hàng cần xử lý',
      time: '2 phút trước',
    },
    {
      id: 2,
      title: 'Hết hàng',
      message: 'Sản phẩm ABC sắp hết',
      time: '15 phút trước',
    },
    {
      id: 3,
      title: 'Đồng bộ Google Sheets',
      message: 'Cập nhật thành công',
      time: '1 giờ trước',
    },
  ];

  return (
    <>
      {/* Mobile Sidebar Toggle Button - Enhanced */}
      <button
        onClick={toggleSidebar}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-lg ${themeClasses.surface} shadow-lg ${themeClasses.border} hover:shadow-xl transition-all duration-200`}
      >
        {isOpen ? (
          <X size={20} className={themeClasses.text.muted} />
        ) : (
          <Menu size={20} className={themeClasses.text.muted} />
        )}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-60 ${
          themeClasses.navigation.sidebar
        } shadow-lg h-full flex flex-col transition-transform duration-300 ease-in-out`}
      >
        {/* Simplified Header - chỉ có logo */}
        <div className={`px-4 py-3 ${themeClasses.card.header}`}>
          <h1 className={`text-lg font-semibold ${themeClasses.text.primary} tracking-tight`}>
            MIA Warehouse v2.1
          </h1>
        </div>

        {/* Menu Sections */}
        <nav className="flex-1 overflow-y-auto py-2">
          {menuSections.map(({ title, items }) => (
            <div key={title} className="mb-4">
              <h6
                className={`px-4 mb-2 text-xs font-medium ${themeClasses.text.subtle} uppercase tracking-wider`}
              >
                {title}
              </h6>
              {items.map(({ name, icon: Icon, path }) => (
                <NavLink
                  key={name}
                  to={path}
                  onClick={() => {
                    // Close mobile sidebar when navigation item is clicked
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                  className={({ isActive }) =>
                    isActive
                      ? sidebarClasses.linkActive
                      : `${sidebarClasses.link} ${themeClasses.interactive.hover}`
                  }
                >
                  <Icon
                    size={16}
                    className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                  />
                  <span className="truncate">{name}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer - User Info, Notifications, Logout */}
        <div className={`${themeClasses.card.header}`}>
          {/* User Profile Section - Enhanced */}
          <div className="p-3">
            <div
              className={`flex items-center space-x-3 p-2 rounded-lg ${themeClasses.surface2} mb-3`}
            >
              <div className="flex-shrink-0 p-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md">
                <User size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${themeClasses.text.primary} truncate`}>
                  {user?.name || user?.username || 'Admin User'}
                </p>
                <p className={`text-xs ${themeClasses.text.muted} truncate`}>
                  {user?.role || 'Quản lý kho'}
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Action Buttons Row - Redesigned for better UX */}
            <div className="space-y-2">
              {/* Notifications Button */}
              <div className="relative w-full">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg ${themeClasses.surface2} ${themeClasses.interactive.hover} ${themeClasses.text.secondary} transition-colors text-xs group`}
                  title="Thông báo"
                >
                  <div className="flex items-center space-x-2">
                    <Bell size={14} className="text-blue-600 dark:text-blue-400" />
                    <span>Thông báo</span>
                  </div>
                  {notifications.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown - Improved positioning */}
                {showNotifications && (
                  <div
                    className={`absolute bottom-full left-0 mb-2 w-80 ${themeClasses.surface} ${themeClasses.border} rounded-lg shadow-xl z-50 overflow-hidden`}
                  >
                    <div
                      className={`px-4 py-3 ${themeClasses.card.header} ${themeClasses.surface2}`}
                    >
                      <h5
                        className={`text-sm font-semibold ${themeClasses.text.primary} flex items-center justify-between`}
                      >
                        <span>Thông báo</span>
                        <span
                          className={`text-xs ${themeClasses.status.info} px-2 py-1 rounded-full`}
                        >
                          {notifications.length}
                        </span>
                      </h5>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 ${themeClasses.card.header} ${themeClasses.interactive.hover} transition-colors cursor-pointer`}
                        >
                          <p className={`text-sm font-medium ${themeClasses.text.primary}`}>
                            {notification.title}
                          </p>
                          <p className={`text-xs ${themeClasses.text.muted} mt-1`}>
                            {notification.message}
                          </p>
                          <p className={`text-xs ${themeClasses.text.subtle} mt-2`}>
                            {notification.time}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className={themeClasses.surface2}>
                      <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition-colors font-medium">
                        Xem tất cả thông báo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Logout Button - Redesigned */}
              <button
                onClick={handleLogout}
                className={`w-full flex items-center justify-between p-2 rounded-lg ${themeClasses.status.error} transition-colors text-xs group`}
                title="Đăng xuất khỏi hệ thống"
              >
                <div className="flex items-center space-x-2">
                  <LogOut size={14} />
                  <span>Đăng xuất</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* System Info - Redesigned */}
          <div className="px-3 pb-3">
            <div
              className={`p-2 ${themeClasses.status.success} rounded-lg border ${themeClasses.border.default}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">
                    Google Sheets
                  </span>
                </div>
                <span className="text-xs text-green-600 dark:text-green-500">Active</span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">Cập nhật: 15/06/2025</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
