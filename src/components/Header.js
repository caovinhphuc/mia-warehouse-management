import React from 'react';
import { Bell, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">
        Warehouse Management
      </h1>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
          <Bell size={20} />
        </button>
        <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
          <User size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
