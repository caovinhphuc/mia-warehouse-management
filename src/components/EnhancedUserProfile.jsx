import {
  Activity,
  AlertTriangle,
  Briefcase,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  User,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  logAuditEvent,
  testConnection,
  updateUserProfile,
} from '../services/unifiedGoogleSheetsService';

const EnhancedUserProfile = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    role: user?.role || '',
    shift: user?.shift || '',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [auditLogs, setAuditLogs] = useState([]);

  // Load user audit logs
  const loadUserAuditLogs = useCallback(async () => {
    if (!user?.id) return;

    try {
      // This would load user-specific audit logs
      // For now, we'll simulate some recent activity
      const mockLogs = [
        {
          timestamp: new Date().toISOString(),
          action: 'PROFILE_VIEW',
          details: 'Viewed profile page',
          status: 'SUCCESS',
        },
        {
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          action: 'LOGIN_SUCCESS',
          details: 'Successful login',
          status: 'SUCCESS',
        },
      ];
      setAuditLogs(mockLogs);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    }
  }, [user?.id]);

  const checkConnection = useCallback(async () => {
    try {
      const health = await testConnection();
      setConnectionStatus(health.success ? 'connected' : 'disconnected');
    } catch (error) {
      setConnectionStatus('error');
    }
  }, []);

  // Check connection on mount
  useEffect(() => {
    checkConnection();
    loadUserAuditLogs();
  }, [checkConnection, loadUserAuditLogs]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Log field change activity
    logAuditEvent({
      action: 'PROFILE_FIELD_CHANGE',
      username: user?.id || 'unknown',
      details: `Changed ${name} field`,
      status: 'SUCCESS',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (connectionStatus !== 'connected') {
      setMessage({
        type: 'error',
        text: 'Không thể cập nhật: Mất kết nối với hệ thống',
      });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      // Update profile via unified service
      const result = await updateUserProfile(user.id, formData);

      if (result.success) {
        setMessage({
          type: 'success',
          text: 'Cập nhật hồ sơ thành công!',
        });

        // Notify parent component
        if (onUpdate) {
          onUpdate({ ...user, ...formData });
        }

        // Log successful update
        await logAuditEvent({
          action: 'PROFILE_UPDATE_SUCCESS',
          username: user.id,
          details: `Updated profile fields: ${Object.keys(formData).join(', ')}`,
          status: 'SUCCESS',
        });

        // Reload audit logs to show the update
        setTimeout(loadUserAuditLogs, 1000);
      } else {
        throw new Error(result.error || 'Update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Có lỗi xảy ra khi cập nhật hồ sơ',
      });

      // Log failed update
      await logAuditEvent({
        action: 'PROFILE_UPDATE_FAILED',
        username: user?.id || 'unknown',
        details: `Profile update failed: ${error.message}`,
        status: 'FAILED',
      });
    } finally {
      setSaving(false);

      // Auto-hide success message after 3 seconds
      if (message?.type === 'success') {
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  const ConnectionIndicator = () => (
    <div className="flex items-center space-x-2 mb-4">
      <div
        className={`w-2 h-2 rounded-full ${
          connectionStatus === 'connected'
            ? 'bg-green-500'
            : connectionStatus === 'checking'
              ? 'bg-yellow-500'
              : 'bg-red-500'
        }`}
      ></div>
      <span className="text-xs text-gray-500">
        {connectionStatus === 'connected' && 'Đã kết nối'}
        {connectionStatus === 'checking' && 'Đang kiểm tra...'}
        {connectionStatus === 'disconnected' && 'Mất kết nối'}
        {connectionStatus === 'error' && 'Lỗi kết nối'}
      </span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Hồ Sơ Cá Nhân</h1>
              <p className="text-gray-500">Quản lý thông tin tài khoản của bạn</p>
            </div>
          </div>

          <button
            onClick={checkConnection}
            disabled={saving}
            className="p-2 text-gray-400 hover:text-gray-600"
            title="Kiểm tra kết nối"
          >
            <RefreshCw className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <ConnectionIndicator />
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-6">Thông Tin Cơ Bản</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phòng ban</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Chọn phòng ban</option>
                      <option value="Operations">Operations</option>
                      <option value="Warehouse">Warehouse</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Management">Management</option>
                      <option value="IT">IT</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chức vụ</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ca làm việc
                  </label>
                  <select
                    name="shift"
                    value={formData.shift}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn ca làm việc</option>
                    <option value="Day Shift">Ca ngày (6:00 - 18:00)</option>
                    <option value="Night Shift">Ca đêm (18:00 - 6:00)</option>
                    <option value="Morning Shift">Ca sáng (6:00 - 14:00)</option>
                    <option value="Evening Shift">Ca chiều (14:00 - 22:00)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving || connectionStatus !== 'connected'}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Activity Log */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-medium">Hoạt Động Gần Đây</h2>
            </div>

            <div className="space-y-3">
              {auditLogs.map((log, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        log.status === 'SUCCESS' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {log.action.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-gray-500">{log.details}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {new Date(log.timestamp).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {auditLogs.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Chưa có hoạt động nào được ghi nhận
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedUserProfile;
