import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Header } from './layout/Header';
import { Sidebar } from './layout/Sidebar';
import { useTheme } from '../App';

const MainLayout = ({ headerProps = {} }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden bg-gray-100 dark:bg-gray-900 ${
        isDarkMode ? 'dark' : ''
      }`}
    >
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        currentPath={location.pathname}
        onNavigate={(path) => {
          if (typeof path === 'string') {
            navigate(path);
          }
          setSidebarOpen(false);
        }}
      />

      {/* Main Content Area - Full width and optimized */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header - Full width with proper height */}
        <Header
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          connectionStatus="connected"
          lastSyncTime={new Date()}
          {...headerProps}
        />

        {/* Main Content - Full viewport sizing */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="h-full w-full p-6 lg:p-8">
            <div className="max-w-none w-full h-full">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

MainLayout.displayName = 'MainLayout';

export default MainLayout;
