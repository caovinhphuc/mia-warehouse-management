import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  User,
  Key,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Package,
  BarChart2,
  Clock,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle,
  Loader2,
  Wifi,
  WifiOff,
} from 'lucide-react';
import UserProfile from '../components/UserProfile';
import {
  fetchAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
} from '../services/googleSheetsUserManagement';
import { testGoogleSheetsConnection } from '../services/googleSheetsAuth';

// ==================== USER MANAGEMENT PAGE ====================
export default function UserManagement() {
  // State for user data and Google Sheets integration
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [lastSync, setLastSync] = useState(null);
  const [error, setError] = useState(null);

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'profile'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Load users from Google Sheets
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Test connection first
      const isConnected = await testGoogleSheetsConnection();
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');

      // Fetch users
      const userData = await fetchAllUsers();
      setUsers(userData);
      setLastSync(new Date());
    } catch (err) {
      console.error('Error loading users:', err);
      setError(err.message);
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadUsers();
  }, []);

  // Handle user creation
  const handleCreateUser = async (userData) => {
    try {
      setLoading(true);
      const newUser = await createUser(userData);
      setUsers((prev) => [...prev, newUser]);
      setShowCreateModal(false);
      await loadUsers(); // Refresh the list
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle user update
  const handleUpdateUser = async (userId, userData) => {
    try {
      setLoading(true);
      await updateUser(userId, userData);
      setEditingUser(null);
      await loadUsers(); // Refresh the list
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteUser(userId);
      await loadUsers(); // Refresh the list
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await updateUserStatus(userId, newStatus);
      await loadUsers(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  // Manual refresh
  const handleRefresh = () => {
    loadUsers();
  };

  // Filter users based on search and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === 'all' || user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  // Get unique roles
  const roles = [
    'all',
    ...new Set(users.map((user) => user.role).filter(Boolean)),
  ];

  // Toggle password visibility
  const togglePasswordVisibility = (username) => {
    setShowPasswords((prev) => ({
      ...prev,
      [username]: !prev[username],
    }));
  };

  // Role icons and colors
  const getRoleConfig = (role) => {
    switch (role?.toLowerCase()) {
      case 'warehouse manager':
        return {
          icon: Shield,
          color:
            'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
          bgColor: 'bg-purple-50 dark:bg-purple-900/10',
        };
      case 'warehouse supervisor':
        return {
          icon: Users,
          color:
            'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
          bgColor: 'bg-blue-50 dark:bg-blue-900/10',
        };
      case 'warehouse staff':
        return {
          icon: Package,
          color:
            'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
          bgColor: 'bg-green-50 dark:bg-green-900/10',
        };
      case 'warehouse accountant':
        return {
          icon: BarChart2,
          color:
            'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
          bgColor: 'bg-orange-50 dark:bg-orange-900/10',
        };
      case 'guest user':
        return {
          icon: User,
          color:
            'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
          bgColor: 'bg-gray-50 dark:bg-gray-900/10',
        };
      default:
        return {
          icon: User,
          color:
            'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
          bgColor: 'bg-gray-50 dark:bg-gray-900/10',
        };
    }
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setViewMode('profile');
  };

  const handleBackToList = () => {
    setSelectedUser(null);
    setViewMode('list');
  };

  const handleUpdateProfile = (updatedUser) => {
    // In a real app, this would make an API call
    console.log('Updating user profile:', updatedUser);
  };

  const handleLogout = () => {
    // In a real app, this would handle logout
    console.log('Logging out user:', selectedUser?.username);
  };

  if (viewMode === 'profile' && selectedUser) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={handleBackToList}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <span>←</span>
              <span>Quay lại danh sách</span>
            </button>
          </div>

          <UserProfile
            user={selectedUser}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Quản lý Tài khoản
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Danh sách tài khoản người dùng hệ thống MIA Warehouse SLA
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {/* Connection Status */}
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                {connectionStatus === 'connected' ? (
                  <>
                    <Wifi size={14} className="text-green-500" />
                    <span className="text-xs text-green-600 dark:text-green-400">
                      Online
                    </span>
                  </>
                ) : connectionStatus === 'connecting' ? (
                  <>
                    <Loader2
                      size={14}
                      className="text-yellow-500 animate-spin"
                    />
                    <span className="text-xs text-yellow-600 dark:text-yellow-400">
                      Kết nối...
                    </span>
                  </>
                ) : (
                  <>
                    <WifiOff size={14} className="text-red-500" />
                    <span className="text-xs text-red-600 dark:text-red-400">
                      Offline
                    </span>
                  </>
                )}
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={loading ? 'animate-spin' : ''}
                />
                <span>Làm mới</span>
              </button>

              {/* Add User Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus size={16} />
                <span>Thêm người dùng</span>
              </button>
            </div>
          </div>

          {/* Last Sync Info */}
          {lastSync && (
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Cập nhật lần cuối: {lastSync.toLocaleString('vi-VN')}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle size={16} className="text-red-500" />
              <span className="text-red-700 dark:text-red-400">{error}</span>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center space-x-3">
              <Filter size={16} className="text-gray-400" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role === 'all' ? 'Tất cả vai trò' : role}
                  </option>
                ))}
              </select>
            </div>

            {/* Stats */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Hiển thị {filteredUsers.length} / {users.length} tài khoản
            </div>
          </div>
        </div>

        {/* User List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="col-span-3">Người dùng</div>
              <div className="col-span-2">Vai trò</div>
              <div className="col-span-2">Phòng ban</div>
              <div className="col-span-2">Đăng nhập cuối</div>
              <div className="col-span-2">Thông tin đăng nhập</div>
              <div className="col-span-1">Thao tác</div>
            </div>
          </div>

          {/* User Rows */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.map((user) => {
              const roleConfig = getRoleConfig(user.role);
              const RoleIcon = roleConfig.icon;

              return (
                <div
                  key={user.id}
                  className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${roleConfig.bgColor}`}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* User Info */}
                    <div className="col-span-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User size={16} className="text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="col-span-2">
                      <div
                        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${roleConfig.color}`}
                      >
                        <RoleIcon size={12} />
                        <span>{user.role}</span>
                      </div>
                    </div>

                    {/* Department */}
                    <div className="col-span-2">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {user.department}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.shift}
                      </p>
                    </div>

                    {/* Last Login */}
                    <div className="col-span-2">
                      <div className="flex items-center space-x-1">
                        <Clock size={12} className="text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleDateString(
                                'vi-VN'
                              )
                            : 'Chưa có'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleTimeString('vi-VN')
                          : ''}
                      </p>
                    </div>

                    {/* Login Credentials */}
                    <div className="col-span-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <User size={12} className="text-gray-400" />
                          <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {user.username}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Key size={12} className="text-gray-400" />
                          <div className="flex items-center space-x-1">
                            <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {showPasswords[user.username]
                                ? user.password
                                : '••••••'}
                            </span>
                            <button
                              onClick={() =>
                                togglePasswordVisibility(user.username)
                              }
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                            >
                              {showPasswords[user.username] ? (
                                <EyeOff size={12} className="text-gray-400" />
                              ) : (
                                <Eye size={12} className="text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewProfile(user)}
                          className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded text-blue-600 dark:text-blue-400"
                          title="Xem profile"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() =>
                            handleToggleStatus(user.id, user.status)
                          }
                          className={`p-1 rounded ${
                            user.status === 'active'
                              ? 'hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400'
                              : 'hover:bg-green-100 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400'
                          }`}
                          title={
                            user.status === 'active' ? 'Tạm dừng' : 'Kích hoạt'
                          }
                        >
                          {user.status === 'active' ? (
                            <XCircle size={14} />
                          ) : (
                            <CheckCircle size={14} />
                          )}
                        </button>
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-1 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 rounded text-yellow-600 dark:text-yellow-400"
                          title="Chỉnh sửa"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400"
                          title="Xóa"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Không tìm thấy người dùng nào
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                Thử thay đổi điều kiện tìm kiếm hoặc bộ lọc
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {users.length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tổng tài khoản
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle
                  size={20}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {users.filter((u) => u.status === 'active').length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Đang hoạt động
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Shield
                  size={20}
                  className="text-purple-600 dark:text-purple-400"
                />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {users.filter((u) => u.role === 'Warehouse Manager').length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Quản lý
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Clock
                  size={20}
                  className="text-orange-600 dark:text-orange-400"
                />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {
                    users.filter(
                      (u) =>
                        u.lastLogin &&
                        Date.now() - new Date(u.lastLogin).getTime() <
                          24 * 60 * 60 * 1000
                    ).length
                  }
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Đăng nhập 24h
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
              <Loader2 size={20} className="animate-spin text-blue-500" />
              <span className="text-gray-700 dark:text-gray-300">
                Đang xử lý...
              </span>
            </div>
          </div>
        )}

        {/* Create User Modal */}
        {showCreateModal && (
          <CreateUserModal
            onClose={() => setShowCreateModal(false)}
            onSave={handleCreateUser}
          />
        )}

        {/* Edit User Modal */}
        {editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSave={(userData) => handleUpdateUser(editingUser.id, userData)}
          />
        )}
      </div>
    </div>
  );
}

// ==================== CREATE USER MODAL ====================
const CreateUserModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    role: '',
    department: '',
    password: '',
    status: 'active',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Thêm người dùng mới
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          >
            <XCircle size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Vai trò
            </label>
            <select
              required
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Chọn vai trò</option>
              <option value="Warehouse Manager">Quản lý kho</option>
              <option value="Warehouse Supervisor">Giám sát kho</option>
              <option value="Warehouse Staff">Nhân viên kho</option>
              <option value="Warehouse Accountant">Kế toán kho</option>
              <option value="Guest User">Người dùng khách</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phòng ban
            </label>
            <select
              required
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Chọn phòng ban</option>
              <option value="Logistics">Logistics</option>
              <option value="Operations">Operations</option>
              <option value="Finance">Finance</option>
              <option value="Demo">Demo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Tạo người dùng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== EDIT USER MODAL ====================
const EditUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    name: user.name || '',
    role: user.role || '',
    department: user.department || '',
    status: user.status || 'active',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Chỉnh sửa người dùng
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          >
            <XCircle size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Vai trò
            </label>
            <select
              required
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Chọn vai trò</option>
              <option value="Warehouse Manager">Quản lý kho</option>
              <option value="Warehouse Supervisor">Giám sát kho</option>
              <option value="Warehouse Staff">Nhân viên kho</option>
              <option value="Warehouse Accountant">Kế toán kho</option>
              <option value="Guest User">Người dùng khách</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phòng ban
            </label>
            <select
              required
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Chọn phòng ban</option>
              <option value="Logistics">Logistics</option>
              <option value="Operations">Operations</option>
              <option value="Finance">Finance</option>
              <option value="Demo">Demo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Trạng thái
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm dừng</option>
            </select>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
