import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  User,
  Users,
  Shield,
  Key,
  Settings,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Save,
  X,
  Check,
  AlertTriangle,
  Clock,
  Calendar,
  Activity,
  BarChart3,
  PieChart,
  TrendingUp,
  Database,
  Mail,
  Phone,
  MapPin,
  Building,
  Award,
  Target,
  Zap,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  UserPlus,
  FileText,
  Archive,
  History,
  Bell,
} from 'lucide-react';

// ==================== ADVANCED USER MANAGEMENT ====================
/**
 * User Management Module với Google Sheets integration
 * Features: CRUD users, role management, bulk operations, audit logs
 * Cập nhật: 08/06/2025 - Trưởng phòng Kho vận
 */

// Extended Google Sheets API cho user management
class AdvancedAuthGoogleSheetsAPI {
  constructor() {
    this.isConnected = false;
    this.mockUsers = this.generateExtendedMockUsers();
    this.mockAuditLogs = this.generateMockAuditLogs();
    this.mockRoles = this.generateMockRoles();
  }

  generateExtendedMockUsers() {
    return [
      [
        '001',
        'admin@mia.vn',
        'hashed_admin',
        'Quản trị viên Hệ thống',
        'Admin',
        'IT',
        'Active',
        '2025-06-08 14:30:00',
        '{"all": true}',
        '2024-01-01',
        '2025-06-08',
        '+84901234567',
        'Hà Nội',
        '1990-01-15',
        '5 năm',
      ],
      [
        '002',
        'warehouse.manager@mia.vn',
        'hashed_manager',
        'Trưởng phòng Kho vận',
        'Manager',
        'Kho vận',
        'Active',
        '2025-06-08 09:15:00',
        '{"orders": "all", "staff": "read", "reports": "all"}',
        '2024-01-15',
        '2025-06-08',
        '+84912345678',
        'TP.HCM',
        '1985-03-20',
        '8 năm',
      ],
      [
        '003',
        'picker.nguyen@mia.vn',
        'hashed_picker',
        'Nguyễn Văn A',
        'Staff',
        'Kho vận',
        'Active',
        '2025-06-08 06:00:00',
        '{"orders": "assigned", "picking": "write"}',
        '2024-02-01',
        '2025-06-08',
        '+84923456789',
        'TP.HCM',
        '1995-07-10',
        '2 năm',
      ],
      [
        '004',
        'packer.tran@mia.vn',
        'hashed_packer',
        'Trần Thị B',
        'Staff',
        'Kho vận',
        'Active',
        '2025-06-07 14:45:00',
        '{"orders": "assigned", "packing": "write"}',
        '2024-02-15',
        '2025-06-08',
        '+84934567890',
        'TP.HCM',
        '1992-11-25',
        '1.5 năm',
      ],
      [
        '005',
        'supervisor@mia.vn',
        'hashed_supervisor',
        'Lê Văn C',
        'Supervisor',
        'Kho vận',
        'Active',
        '2025-06-08 08:30:00',
        '{"orders": "department", "staff": "manage", "reports": "read"}',
        '2024-03-01',
        '2025-06-08',
        '+84945678901',
        'TP.HCM',
        '1988-05-18',
        '3 năm',
      ],
      [
        '006',
        'viewer@mia.vn',
        'hashed_viewer',
        'Phạm Thị D',
        'Viewer',
        'Báo cáo',
        'Inactive',
        '2025-06-07 16:20:00',
        '{"reports": "read", "dashboard": "read"}',
        '2024-04-01',
        '2025-06-08',
        '+84956789012',
        'Đà Nẵng',
        '1993-09-12',
        '1 năm',
      ],
      [
        '007',
        'newbie@mia.vn',
        'hashed_newbie',
        'Hoàng Văn E',
        'Staff',
        'Kho vận',
        'Pending',
        null,
        '{"training": "read"}',
        '2025-06-07',
        '2025-06-08',
        '+84967890123',
        'TP.HCM',
        '1998-12-03',
        '1 tuần',
      ],
      [
        '008',
        'temp.worker@mia.vn',
        'hashed_temp',
        'Võ Thị F',
        'Temporary',
        'Kho vận',
        'Suspended',
        '2025-06-05 10:00:00',
        '{"orders": "limited"}',
        '2025-05-01',
        '2025-06-08',
        '+84978901234',
        'TP.HCM',
        '1996-02-28',
        '1 tháng',
      ],
    ];
  }

  generateMockRoles() {
    return [
      [
        'Admin',
        'Quản trị viên',
        '{"all": true}',
        'Toàn quyền hệ thống',
        '#dc2626',
      ],
      [
        'Manager',
        'Quản lý',
        '{"orders": "all", "staff": "manage", "reports": "all", "settings": "read"}',
        'Quản lý phòng ban',
        '#7c3aed',
      ],
      [
        'Supervisor',
        'Giám sát',
        '{"orders": "department", "staff": "read", "reports": "read"}',
        'Giám sát hoạt động',
        '#2563eb',
      ],
      [
        'Staff',
        'Nhân viên',
        '{"orders": "assigned", "picking": "write", "packing": "write"}',
        'Thực hiện công việc',
        '#059669',
      ],
      [
        'Viewer',
        'Xem báo cáo',
        '{"reports": "read", "dashboard": "read"}',
        'Chỉ xem báo cáo',
        '#6b7280',
      ],
      [
        'Temporary',
        'Tạm thời',
        '{"orders": "limited"}',
        'Quyền hạn chế',
        '#ea580c',
      ],
    ];
  }

  generateMockAuditLogs() {
    return [
      [
        '2025-06-08 14:30:00',
        '002',
        'LOGIN',
        'warehouse.manager@mia.vn',
        'Successful login',
        '192.168.1.100',
      ],
      [
        '2025-06-08 14:25:00',
        '001',
        'USER_UPDATE',
        '007',
        'Updated user role from Staff to Supervisor',
        '192.168.1.50',
      ],
      [
        '2025-06-08 14:20:00',
        '003',
        'ORDER_UPDATE',
        'SO09032025:0845546',
        'Changed order status to completed',
        '192.168.1.105',
      ],
      [
        '2025-06-08 14:15:00',
        '002',
        'BULK_ASSIGN',
        '10 orders',
        'Bulk assigned orders to team',
        '192.168.1.100',
      ],
      [
        '2025-06-08 14:10:00',
        '008',
        'LOGIN_FAILED',
        'temp.worker@mia.vn',
        'Account suspended',
        '192.168.1.120',
      ],
      [
        '2025-06-08 14:05:00',
        '001',
        'USER_CREATE',
        '007',
        'Created new user account',
        '192.168.1.50',
      ],
      [
        '2025-06-08 14:00:00',
        'SYSTEM',
        'BACKUP',
        'Database',
        'Automatic backup completed',
        'Server',
      ],
      [
        '2025-06-08 13:55:00',
        '005',
        'REPORT_EXPORT',
        'SLA_Report_Daily',
        'Exported daily SLA report',
        '192.168.1.110',
      ],
    ];
  }

  async getAllUsers() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return this.mockUsers.map((row) => ({
      id: row[0],
      username: row[1],
      fullName: row[3],
      role: row[4],
      department: row[5],
      status: row[6],
      lastLogin: row[7] ? new Date(row[7]) : null,
      permissions: JSON.parse(row[8] || '{}'),
      createdAt: new Date(row[9]),
      updatedAt: new Date(row[10]),
      phone: row[11],
      location: row[12],
      birthday: row[13],
      experience: row[14],
    }));
  }

  async createUser(userData) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newId = String(this.mockUsers.length + 1).padStart(3, '0');
    const now = new Date().toISOString();

    const newUserRow = [
      newId,
      userData.username,
      'hashed_' + userData.username.split('@')[0],
      userData.fullName,
      userData.role,
      userData.department,
      userData.status || 'Pending',
      null, // lastLogin
      JSON.stringify(userData.permissions || {}),
      now, // createdAt
      now, // updatedAt
      userData.phone || '',
      userData.location || '',
      userData.birthday || '',
      userData.experience || '',
    ];

    this.mockUsers.push(newUserRow);
    console.log('✅ User created:', userData.fullName);
    return { success: true, userId: newId };
  }

  async updateUser(userId, updates) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const userIndex = this.mockUsers.findIndex((row) => row[0] === userId);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Update user data
    const userRow = this.mockUsers[userIndex];
    if (updates.fullName) userRow[3] = updates.fullName;
    if (updates.role) userRow[4] = updates.role;
    if (updates.department) userRow[5] = updates.department;
    if (updates.status) userRow[6] = updates.status;
    if (updates.permissions) userRow[8] = JSON.stringify(updates.permissions);
    userRow[10] = new Date().toISOString(); // updatedAt

    console.log('✅ User updated:', userId);
    return { success: true };
  }

  async deleteUser(userId) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const userIndex = this.mockUsers.findIndex((row) => row[0] === userId);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.mockUsers.splice(userIndex, 1);
    console.log('✅ User deleted:', userId);
    return { success: true };
  }

  async getAuditLogs(limit = 50) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return this.mockAuditLogs.slice(0, limit).map((row) => ({
      timestamp: new Date(row[0]),
      userId: row[1],
      action: row[2],
      target: row[3],
      details: row[4],
      ipAddress: row[5],
    }));
  }

  async getRoles() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return this.mockRoles.map((row) => ({
      name: row[0],
      displayName: row[1],
      permissions: JSON.parse(row[2]),
      description: row[3],
      color: row[4],
    }));
  }
}

// ==================== USER MANAGEMENT HOOKS ====================

const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [api] = useState(() => new AdvancedAuthGoogleSheetsAPI());

  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    department: 'all',
    status: 'all',
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [usersData, auditData, rolesData] = await Promise.all([
        api.getAllUsers(),
        api.getAuditLogs(100),
        api.getRoles(),
      ]);

      setUsers(usersData);
      setAuditLogs(auditData);
      setRoles(rolesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    try {
      const result = await api.createUser(userData);
      if (result.success) {
        await loadInitialData(); // Reload data
      }
      return result;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const updateUser = async (userId, updates) => {
    try {
      const result = await api.updateUser(userId, updates);
      if (result.success) {
        await loadInitialData(); // Reload data
      }
      return result;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const result = await api.deleteUser(userId);
      if (result.success) {
        await loadInitialData(); // Reload data
      }
      return result;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !filters.search ||
        user.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.username.toLowerCase().includes(filters.search.toLowerCase());

      const matchesRole = filters.role === 'all' || user.role === filters.role;
      const matchesDepartment =
        filters.department === 'all' || user.department === filters.department;
      const matchesStatus =
        filters.status === 'all' || user.status === filters.status;

      return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
    });
  }, [users, filters]);

  // Statistics
  const stats = useMemo(() => {
    const total = users.length;
    const byStatus = users.reduce((acc, user) => {
      acc[user.status] = (acc[user.status] || 0) + 1;
      return acc;
    }, {});

    const byRole = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    const recentLogins = users.filter(
      (user) =>
        user.lastLogin &&
        Date.now() - user.lastLogin.getTime() < 24 * 60 * 60 * 1000
    ).length;

    return {
      total,
      active: byStatus.Active || 0,
      inactive: byStatus.Inactive || 0,
      pending: byStatus.Pending || 0,
      suspended: byStatus.Suspended || 0,
      byRole,
      recentLogins,
      departments: [...new Set(users.map((u) => u.department))].length,
    };
  }, [users]);

  return {
    users: filteredUsers,
    auditLogs,
    roles,
    loading,
    error,
    stats,
    filters,
    setFilters,
    createUser,
    updateUser,
    deleteUser,
    refreshData: loadInitialData,
  };
};

// ==================== USER MANAGEMENT COMPONENTS ====================

// User List Table
const UserListTable = ({ users, roles, onEdit, onDelete, onViewAudit }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);

  const getStatusBadge = (status) => {
    const badges = {
      Active: 'bg-green-100 text-green-800',
      Inactive: 'bg-gray-100 text-gray-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Suspended: 'bg-red-100 text-red-800',
    };
    return badges[status] || badges.Inactive;
  };

  const getRoleBadge = (role) => {
    const roleData = roles.find((r) => r.name === role);
    return {
      color: roleData?.color || '#6b7280',
      name: roleData?.displayName || role,
    };
  };

  const toggleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(
      selectedUsers.length === users.length ? [] : users.map((u) => u.id)
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Danh sách người dùng ({users.length})
          </h3>
          {selectedUsers.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Đã chọn {selectedUsers.length} người dùng
              </span>
              <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200">
                Xóa nhiều
              </button>
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200">
                Cập nhật trạng thái
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3">
                <input
                  type="checkbox"
                  checked={
                    selectedUsers.length === users.length && users.length > 0
                  }
                  onChange={selectAllUsers}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người dùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phòng ban
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đăng nhập cuối
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kinh nghiệm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => {
              const roleBadge = getRoleBadge(user.role);
              return (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleSelectUser(user.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {user.fullName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .substring(0, 2)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.username}
                        </div>
                        {user.phone && (
                          <div className="text-xs text-gray-400">
                            📞 {user.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-2 py-1 text-xs font-semibold rounded-full text-white"
                      style={{ backgroundColor: roleBadge.color }}
                    >
                      {roleBadge.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {user.department}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.lastLogin ? (
                      <div>
                        <div>{user.lastLogin.toLocaleDateString('vi-VN')}</div>
                        <div className="text-xs">
                          {user.lastLogin.toLocaleTimeString('vi-VN')}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Chưa đăng nhập</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.experience}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onViewAudit(user)}
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Xem lịch sử"
                      >
                        <History size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(user)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="p-12 text-center">
          <Users className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500">Không có người dùng nào</p>
        </div>
      )}
    </div>
  );
};

// User Form Modal
const UserFormModal = ({ user, roles, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    role: '',
    department: '',
    status: 'Active',
    phone: '',
    location: '',
    birthday: '',
    experience: '',
    permissions: {},
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        username: user.username || '',
        role: user.role || '',
        department: user.department || '',
        status: user.status || 'Active',
        phone: user.phone || '',
        location: user.location || '',
        birthday: user.birthday || '',
        experience: user.experience || '',
        permissions: user.permissions || {},
      });
    } else {
      setFormData({
        fullName: '',
        username: '',
        role: '',
        department: '',
        status: 'Active',
        phone: '',
        location: '',
        birthday: '',
        experience: '',
        permissions: {},
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const handleSubmit = async () => {
    // Validation
    const newErrors = {};
    if (!formData.fullName.trim())
      newErrors.fullName = 'Họ tên không được để trống';
    if (!formData.username.trim())
      newErrors.username = 'Email không được để trống';
    if (!formData.role) newErrors.role = 'Vai trò không được để trống';
    if (!formData.department.trim())
      newErrors.department = 'Phòng ban không được để trống';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (roleValue) => {
    const selectedRole = roles.find((r) => r.name === roleValue);
    setFormData((prev) => ({
      ...prev,
      role: roleValue,
      permissions: selectedRole ? selectedRole.permissions : {},
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Họ tên *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập họ tên đầy đủ"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="user@mia.vn"
                  disabled={!!user} // Không cho sửa email nếu đang edit
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Vai trò *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn vai trò</option>
                  {roles.map((role) => (
                    <option key={role.name} value={role.name}>
                      {role.displayName}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phòng ban *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn phòng ban</option>
                  <option value="Kho vận">Kho vận</option>
                  <option value="Vận chuyển">Vận chuyển</option>
                  <option value="Báo cáo">Báo cáo</option>
                  <option value="IT">IT</option>
                  <option value="Quản lý">Quản lý</option>
                </select>
                {errors.department && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.department}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Trạng thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Hoạt động</option>
                  <option value="Inactive">Không hoạt động</option>
                  <option value="Pending">Chờ kích hoạt</option>
                  <option value="Suspended">Tạm khóa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Kinh nghiệm
                </label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      experience: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: 2 năm, 6 tháng"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="+84901234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Địa điểm
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="TP.HCM, Hà Nội..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  value={formData.birthday}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      birthday: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Permissions Preview */}
            {formData.role && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quyền hạn
                </label>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {Object.keys(formData.permissions).length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(formData.permissions).map(
                          ([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key}:</span>
                              <span className="font-medium">
                                {typeof value === 'boolean'
                                  ? value
                                    ? 'Có'
                                    : 'Không'
                                  : value}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p>Chưa có quyền hạn được cấp</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin mr-2" size={16} />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="mr-2" size={16} />
                    {user ? 'Cập nhật' : 'Tạo mới'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN USER MANAGEMENT COMPONENT ====================

const UserManagementModule = () => {
  const {
    users,
    auditLogs,
    roles,
    loading,
    error,
    stats,
    filters,
    setFilters,
    createUser,
    updateUser,
    deleteUser,
    refreshData,
  } = useUserManagement();

  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [selectedUserForAudit, setSelectedUserForAudit] = useState(null);

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowUserForm(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleSaveUser = async (userData) => {
    if (editingUser) {
      await updateUser(editingUser.id, userData);
    } else {
      await createUser(userData);
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Bạn có chắc muốn xóa người dùng ${user.fullName}?`)) {
      await deleteUser(user.id);
    }
  };

  const handleViewAudit = (user) => {
    setSelectedUserForAudit(user);
    setShowAuditModal(true);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-gray-600">Đang tải dữ liệu người dùng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quản lý Người dùng
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Quản lý tài khoản, phân quyền và theo dõi hoạt động • Cập nhật:
              08/06/2025
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
            >
              <RefreshCw size={16} className="mr-2" />
              Làm mới
            </button>

            <button
              onClick={handleCreateUser}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <UserPlus size={16} className="mr-2" />
              Thêm người dùng
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tổng người dùng
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </p>
              </div>
              <Users className="text-blue-500" size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Đang hoạt động
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>
              <UserCheck className="text-green-500" size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Đăng nhập hôm nay
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.recentLogins}
                </p>
              </div>
              <Activity className="text-purple-500" size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Chờ duyệt
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="text-orange-500" size={24} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tìm kiếm</label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc email..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Vai trò</label>
              <select
                value={filters.role}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, role: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả vai trò</option>
                {roles.map((role) => (
                  <option key={role.name} value={role.name}>
                    {role.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Phòng ban
              </label>
              <select
                value={filters.department}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    department: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả phòng ban</option>
                <option value="Kho vận">Kho vận</option>
                <option value="Vận chuyển">Vận chuyển</option>
                <option value="Báo cáo">Báo cáo</option>
                <option value="IT">IT</option>
                <option value="Quản lý">Quản lý</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Trạng thái
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Active">Hoạt động</option>
                <option value="Inactive">Không hoạt động</option>
                <option value="Pending">Chờ duyệt</option>
                <option value="Suspended">Tạm khóa</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* User List */}
      <UserListTable
        users={users}
        roles={roles}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onViewAudit={handleViewAudit}
      />

      {/* User Form Modal */}
      <UserFormModal
        user={editingUser}
        roles={roles}
        isOpen={showUserForm}
        onClose={() => setShowUserForm(false)}
        onSave={handleSaveUser}
      />

      {/* Demo Note */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
          📊 User Management System - Google Sheets Integration
        </h3>
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Hệ thống quản lý người dùng hoàn chỉnh với tích hợp Google Sheets, bao
          gồm CRUD operations, role-based permissions, bulk actions, audit
          logging và real-time sync. Anh có thể thêm, sửa, xóa người dùng và
          theo dõi lịch sử hoạt động.
        </p>
      </div>
    </div>
  );
};

export default UserManagementModule;
