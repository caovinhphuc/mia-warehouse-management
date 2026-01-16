import {
  AlertCircle,
  Bell,
  Camera,
  Edit,
  Loader2,
  Lock,
  Palette,
  Save,
  User,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from '../App';
import { getUserProfile } from '../services/googleSheetsUserManagement';
import { useNotification } from '../shared/hooks/useNotification';
import logger from "../utils/logger";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const { addNotification } = useNotification();

  // User data from Google Sheets
  const [userInfo, setUserInfo] = useState(null);
  const [tempUserInfo, setTempUserInfo] = useState(null);

  // Get current user ID from localStorage or auth context
  const getCurrentUserId = () => {
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        return userData.id || userData.username || userData.email;
      }
      // Fallback to demo user
      return 'user-001';
    } catch (e) {
      return 'user-001';
    }
  };

  // Load user profile on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const userId = getCurrentUserId();
        const profile = await getUserProfile(userId);
        setUserInfo(profile);
        setTempUserInfo(profile);
      } catch (err) {
        logger.error('Error loading user profile:', err);
        setError('Không thể tải thông tin người dùng');
        addNotification({
          message: 'Lỗi tải thông tin',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [addNotification]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempUserInfo(userInfo || {});
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const userId = getCurrentUserId();

      // Import the enhanced update service
      const { updateUserProfileEnhanced } = await import('../services/googleAppsScriptService');

      logger.info('🔄 Updating user profile...');
      logger.info('User ID:', userId);
      logger.info('Profile data:', tempUserInfo);

      // Update profile using enhanced method (tries multiple approaches)
      const result = await updateUserProfileEnhanced(userId, tempUserInfo);

      if (result.success) {
        // Update local state
        setUserInfo(result.data || tempUserInfo);
        setIsEditing(false);

        // Show success notification with method info
        addNotification({
          message: result.message || 'Cập nhật thông tin thành công!',
          type: 'success',
        });

        // Update localStorage for immediate UI refresh
        try {
          const currentUser = localStorage.getItem('currentUser');
          if (currentUser) {
            const userData = JSON.parse(currentUser);
            const updatedUserData = {
              ...userData,
              name: result.data?.name || tempUserInfo.name,
              email: result.data?.email || tempUserInfo.email,
              phone: result.data?.phone || tempUserInfo.phone,
              lastUpdated: new Date().toISOString(),
            };
            localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
            logger.info('✅ Updated localStorage with new profile data');
          }
        } catch (e) {
          logger.warn('⚠️ Could not update localStorage:', e.message);
        }

        // Trigger a custom event to notify other components (like Header)
        window.dispatchEvent(
          new CustomEvent('userProfileUpdated', {
            detail: result.data || tempUserInfo,
          }),
        );

        logger.info('✅ Profile update completed successfully');
      } else {
        throw new Error('Profile update failed');
      }
    } catch (error) {
      logger.error('❌ Error saving profile:', error);
      addNotification({
        message: error.message || 'Lỗi khi cập nhật thông tin. Vui lòng thử lại.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempUserInfo(userInfo || {});
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setTempUserInfo((prev) => ({
      ...(prev || {}),
      [field]: value,
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: User },
    { id: 'security', label: 'Bảo mật', icon: Lock },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'preferences', label: 'Tùy chọn', icon: Palette },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Page Header with Actions */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Thông tin cá nhân</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý thông tin tài khoản và tùy chọn cá nhân
          </p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </button>
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm font-medium rounded-lg transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Hủy
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Đang tải thông tin...</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && userInfo && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              {/* Avatar Section */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {userInfo?.name?.charAt(0) || userInfo?.email?.charAt(0) || 'U'}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
                  {userInfo?.displayName || userInfo?.name || 'Người dùng'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userInfo?.position || 'Chưa có thông tin'}
                </p>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Thông tin cá nhân
                  </h2>

                  {/* Profile Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Họ và tên
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={tempUserInfo?.name || ''}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                          {userInfo?.name || 'Chưa có thông tin'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={tempUserInfo?.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                          {userInfo?.email || 'Chưa có thông tin'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Số điện thoại
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={tempUserInfo?.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                          {userInfo?.phone || 'Chưa có thông tin'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Chức vụ
                      </label>
                      <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                        {userInfo?.position || 'Chưa có thông tin'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phòng ban
                      </label>
                      <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                        {userInfo?.department || 'Chưa có thông tin'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Địa điểm làm việc
                      </label>
                      <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                        {userInfo?.location || 'Chưa có thông tin'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ngày vào làm
                      </label>
                      <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                        {userInfo?.joinDate
                          ? new Date(userInfo.joinDate).toLocaleDateString('vi-VN')
                          : 'Chưa có thông tin'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mã nhân viên
                      </label>
                      <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                        {userInfo?.employeeId || 'Chưa có thông tin'}
                      </p>
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Giới thiệu
                    </label>
                    {isEditing ? (
                      <textarea
                        value={tempUserInfo?.bio || ''}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                        {userInfo?.bio || 'Chưa có thông tin'}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Bảo mật tài khoản
                  </h2>
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        Đổi mật khẩu
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Cập nhật mật khẩu để bảo vệ tài khoản của bạn
                      </p>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        Đổi mật khẩu
                      </button>
                    </div>

                    <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        Xác thực 2 bước
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Thêm lớp bảo mật cho tài khoản của bạn
                      </p>
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                        Kích hoạt 2FA
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Cài đặt thông báo
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Email thông báo
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Nhận thông báo qua email
                        </p>
                      </div>
                      <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Thông báo SLA</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Cảnh báo khi SLA gần hết hạn
                        </p>
                      </div>
                      <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Tùy chọn hiển thị
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Chế độ tối</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Chuyển đổi giao diện sáng/tối
                        </p>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isDarkMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
