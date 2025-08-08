import React, { useState } from 'react';
import {
  User,
  Shield,
  Mail,
  Clock,
  Calendar,
  LogOut,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  Package,
  Users,
  BarChart2,
} from 'lucide-react';

// ==================== USER PROFILE COMPONENT ====================
/**
 * Component hiển thị thông tin profile user và quyền hạn
 * Tích hợp với hệ thống authentication
 * Cập nhật: 12/06/2025 - Trưởng phòng Kho vận
 */

const UserProfile = ({ user, onUpdateProfile, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user || {});

  const handleSave = () => {
    onUpdateProfile?.(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user || {});
    setIsEditing(false);
  };

  // Permission mapping for display
  const permissionLabels = {
    read_orders: 'Xem đơn hàng',
    write_orders: 'Chỉnh sửa đơn hàng',
    delete_orders: 'Xóa đơn hàng',
    manage_staff: 'Quản lý nhân sự',
    view_analytics: 'Xem báo cáo',
    system_settings: 'Cài đặt hệ thống',
    manage_inventory: 'Quản lý kho',
    approve_requests: 'Phê duyệt yêu cầu',
    export_data: 'Xuất dữ liệu',
    update_order_status: 'Cập nhật trạng thái đơn',
    scan_products: 'Quét sản phẩm',
    view_picking_tasks: 'Xem task lấy hàng',
    manage_team: 'Quản lý team',
    approve_shifts: 'Phê duyệt ca làm',
    export_reports: 'Xuất báo cáo',
    view_costs: 'Xem chi phí',
    financial_reports: 'Báo cáo tài chính',
  };

  // Role-based colors
  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'warehouse manager':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'warehouse supervisor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'warehouse staff':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'warehouse accountant':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'guest user':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'warehouse manager':
        return <Shield size={16} />;
      case 'warehouse supervisor':
        return <Users size={16} />;
      case 'warehouse staff':
        return <Package size={16} />;
      case 'warehouse accountant':
        return <BarChart2 size={16} />;
      default:
        return <User size={16} />;
    }
  };

  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <User size={32} className="mx-auto mb-2" />
            <p>Không có thông tin người dùng</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <div
                className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                  user.role
                )}`}
              >
                {getRoleIcon(user.role)}
                <span>{user.role}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
              >
                <Edit size={16} />
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="p-2 bg-green-500 hover:bg-green-600 rounded-lg text-white transition-colors"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Thông tin cơ bản
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Họ tên
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.name || ''}
                    onChange={(e) =>
                      setEditedUser((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{user.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <div className="flex items-center space-x-2">
                  <Mail size={16} className="text-gray-400" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedUser.email || ''}
                      onChange={(e) =>
                        setEditedUser((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <span className="text-gray-900 dark:text-white">
                      {user.email}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phòng ban
                </label>
                <p className="text-gray-900 dark:text-white">
                  {user.department}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ca làm việc
                </label>
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {user.shift}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quyền hạn hệ thống
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {user.permissions?.map((permission) => (
              <div
                key={permission}
                className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <CheckCircle
                  size={16}
                  className="text-green-600 dark:text-green-400"
                />
                <span className="text-sm text-green-800 dark:text-green-300">
                  {permissionLabels[permission] || permission}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Thông tin hoạt động
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Đăng nhập lần cuối
                </span>
              </div>
              <p className="text-gray-900 dark:text-white">
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleString('vi-VN')
                  : 'Chưa có'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ID người dùng
                </span>
              </div>
              <p className="text-gray-900 dark:text-white font-mono text-sm">
                {user.id}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <AlertTriangle size={16} />
            <span>Để thay đổi quyền hạn, liên hệ quản trị viên hệ thống</span>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
