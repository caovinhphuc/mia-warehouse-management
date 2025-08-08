import { AlertCircle, Briefcase, Loader2, Mail, Phone, Save, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { updateUserProfileEnhanced } from '../services/googleAppsScriptService';

/**
 * Quick Edit Modal - Chỉnh sửa thông tin user nhanh từ Header
 * Không cần navigate to profile page
 */
const QuickEditModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name || user.displayName || '',
        email: user.email || '',
        phone: user.phone || '',
        position: user.position || user.role || '',
      });
      setError(null);
    }
  }, [isOpen, user]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user ID
      const userId = user?.id || user?.username || user?.email || 'user-001';

      console.log('🔄 QuickEdit: Updating user profile...');
      console.log('User ID:', userId);
      console.log('Form data:', formData);

      // Update profile using enhanced service
      const result = await updateUserProfileEnhanced(userId, formData);

      if (result.success) {
        console.log('✅ QuickEdit: Profile updated successfully');

        // Call parent onSave handler with updated data
        if (onSave) {
          onSave(result.data || formData);
        }

        // Dispatch global event for other components
        window.dispatchEvent(
          new CustomEvent('userProfileUpdated', {
            detail: result.data || formData,
          }),
        );

        // Update localStorage for immediate sync
        try {
          const currentUser = localStorage.getItem('currentUser');
          if (currentUser) {
            const userData = JSON.parse(currentUser);
            const updatedUserData = {
              ...userData,
              name: result.data?.name || formData.name,
              email: result.data?.email || formData.email,
              phone: result.data?.phone || formData.phone,
              position: result.data?.position || formData.position,
              lastUpdated: new Date().toISOString(),
            };
            localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
            console.log('✅ QuickEdit: Updated localStorage');
          }
        } catch (e) {
          console.warn('⚠️ QuickEdit: Could not update localStorage:', e.message);
        }

        // Close modal
        onClose();
      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (error) {
      console.error('❌ QuickEdit: Error updating profile:', error);
      setError(error.message || 'Lỗi khi cập nhật thông tin. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({
      name: user?.name || user?.displayName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      position: user?.position || user?.role || '',
    });
    setError(null);
    onClose();
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Chỉnh sửa thông tin
          </h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Họ và tên
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Nhập họ và tên"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="h-4 w-4 inline mr-1" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Nhập email"
                disabled={loading}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="h-4 w-4 inline mr-1" />
                Số điện thoại
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Nhập số điện thoại"
                disabled={loading}
              />
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Briefcase className="h-4 w-4 inline mr-1" />
                Chức vụ
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Nhập chức vụ"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickEditModal;
