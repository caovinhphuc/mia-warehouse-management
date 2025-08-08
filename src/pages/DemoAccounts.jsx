import {
  AlertTriangle,
  BarChart2,
  CheckCircle,
  Copy,
  Eye,
  Key,
  LogIn,
  Mail,
  Package,
  Shield,
  User,
  Users,
} from 'lucide-react';
import React from 'react';

// ==================== DEMO ACCOUNTS DATA ====================
const DEMO_ACCOUNTS = {
  manager: {
    username: 'manager',
    password: 'manager123',
    userData: {
      id: 'user-001',
      name: 'Trưởng phòng Kho vận',
      email: 'manager@mia.com',
      role: 'Warehouse Manager',
      department: 'Logistics',
      permissions: [
        'read_orders',
        'write_orders',
        'delete_orders',
        'manage_staff',
        'view_analytics',
        'system_settings',
        'manage_inventory',
        'approve_requests',
        'export_data',
      ],
      description: 'Quyền truy cập đầy đủ - Quản lý toàn bộ hệ thống',
      features: [
        'Xem và quản lý tất cả đơn hàng',
        'Quản lý nhân sự và phân ca',
        'Truy cập báo cáo và analytics',
        'Cài đặt hệ thống',
        'Phê duyệt các yêu cầu',
      ],
    },
  },

  supervisor: {
    username: 'supervisor',
    password: 'super123',
    userData: {
      id: 'user-003',
      name: 'Trần Thị B',
      email: 'supervisor@mia.com',
      role: 'Warehouse Supervisor',
      department: 'Operations',
      permissions: [
        'read_orders',
        'write_orders',
        'manage_team',
        'view_analytics',
        'manage_inventory',
        'approve_shifts',
      ],
      description: 'Quyền giám sát - Quản lý team và ca làm việc',
      features: [
        'Quản lý đơn hàng và team',
        'Phê duyệt ca làm việc',
        'Xem báo cáo hiệu suất',
        'Quản lý kho hàng',
        'Giám sát quy trình',
      ],
    },
  },

  staff: {
    username: 'staff',
    password: 'staff123',
    userData: {
      id: 'user-002',
      name: 'Nguyễn Văn A',
      email: 'staff@mia.com',
      role: 'Warehouse Staff',
      department: 'Operations',
      permissions: [
        'read_orders',
        'update_order_status',
        'view_inventory',
        'scan_products',
        'view_picking_tasks',
      ],
      description: 'Quyền nhân viên - Xử lý đơn hàng và picking',
      features: [
        'Xem và cập nhật đơn hàng',
        'Quét sản phẩm',
        'Thực hiện picking tasks',
        'Xem thông tin kho',
        'Cập nhật trạng thái đơn hàng',
      ],
    },
  },

  accountant: {
    username: 'accountant',
    password: 'acc123',
    userData: {
      id: 'user-004',
      name: 'Lê Văn C',
      email: 'accountant@mia.com',
      role: 'Warehouse Accountant',
      department: 'Finance',
      permissions: [
        'read_orders',
        'view_analytics',
        'export_reports',
        'view_costs',
        'financial_reports',
      ],
      description: 'Quyền kế toán - Báo cáo tài chính và chi phí',
      features: [
        'Xem báo cáo tài chính',
        'Xuất dữ liệu chi phí',
        'Phân tích ROI',
        'Theo dõi ngân sách kho',
        'Báo cáo hiệu quả',
      ],
    },
  },

  demo: {
    username: 'demo',
    password: 'demo123',
    userData: {
      id: 'user-005',
      name: 'Demo User',
      email: 'demo@mia.com',
      role: 'Guest User',
      department: 'Demo',
      permissions: ['read_orders', 'view_analytics'],
      description: 'Quyền khách - Chỉ xem thông tin cơ bản',
      features: [
        'Xem danh sách đơn hàng',
        'Xem dashboard cơ bản',
        'Truy cập demo features',
        'Không có quyền chỉnh sửa',
        'Phù hợp để demo hệ thống',
      ],
    },
  },
};

// ==================== DEMO ACCOUNTS PAGE ====================
export default function DemoAccounts() {
  const [copiedAccount, setCopiedAccount] = React.useState(null);

  // Copy credentials to clipboard
  const copyCredentials = (username, password) => {
    const credentials = `Username: ${username}\nPassword: ${password}`;
    navigator.clipboard.writeText(credentials).then(() => {
      setCopiedAccount(username);
      setTimeout(() => setCopiedAccount(null), 2000);
    });
  };

  // Quick login function
  const quickLogin = (username, password) => {
    // Store credentials and redirect to login
    sessionStorage.setItem('demo-username', username);
    sessionStorage.setItem('demo-password', password);
    window.location.href = '/login';
  };

  // Get role configuration
  const getRoleConfig = (role) => {
    switch (role?.toLowerCase()) {
      case 'warehouse manager':
        return {
          icon: Shield,
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
          bgColor: 'bg-purple-50 dark:bg-purple-900/10',
          borderColor: 'border-purple-200 dark:border-purple-800',
        };
      case 'warehouse supervisor':
        return {
          icon: Users,
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
          bgColor: 'bg-blue-50 dark:bg-blue-900/10',
          borderColor: 'border-blue-200 dark:border-blue-800',
        };
      case 'warehouse staff':
        return {
          icon: Package,
          color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
          bgColor: 'bg-green-50 dark:bg-green-900/10',
          borderColor: 'border-green-200 dark:border-green-800',
        };
      case 'warehouse accountant':
        return {
          icon: BarChart2,
          color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
          bgColor: 'bg-orange-50 dark:bg-orange-900/10',
          borderColor: 'border-orange-200 dark:border-orange-800',
        };
      case 'guest user':
        return {
          icon: User,
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
          bgColor: 'bg-gray-50 dark:bg-gray-900/10',
          borderColor: 'border-gray-200 dark:border-gray-800',
        };
      default:
        return {
          icon: User,
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
          bgColor: 'bg-gray-50 dark:bg-gray-900/10',
          borderColor: 'border-gray-200 dark:border-gray-800',
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Package size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                MIA Warehouse SLA Dashboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">Tài khoản Demo</p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              Hệ thống cung cấp <strong>5 tài khoản demo</strong> với các quyền hạn khác nhau để bạn
              có thể trải nghiệm đầy đủ chức năng của dashboard quản lý kho vận.
            </p>
          </div>

          {/* Quick Access Info */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
              <AlertTriangle size={20} />
              <span className="font-medium">Thông tin quan trọng:</span>
            </div>
            <p className="text-blue-600 dark:text-blue-400 mt-2 text-sm">
              • Tất cả tài khoản demo đều được reset mỗi 24h
              <br />
              • Dữ liệu demo được tạo tự động và không ảnh hưởng hệ thống thực
              <br />• Có thể đăng nhập bằng cách click "Đăng nhập nhanh" hoặc copy thông tin đăng
              nhập
            </p>
          </div>
        </div>

        {/* Demo Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Object.entries(DEMO_ACCOUNTS).map(([username, account]) => {
            const roleConfig = getRoleConfig(account.userData.role);
            const RoleIcon = roleConfig.icon;

            return (
              <div
                key={username}
                className={`bg-white dark:bg-gray-800 rounded-lg border-2 ${roleConfig.borderColor} overflow-hidden hover:shadow-lg transition-all duration-300`}
              >
                {/* Header */}
                <div
                  className={`${roleConfig.bgColor} px-6 py-4 border-b ${roleConfig.borderColor}`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-lg ${roleConfig.color}`}>
                      <RoleIcon size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {account.userData.name}
                      </h3>
                      <div
                        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${roleConfig.color}`}
                      >
                        <span>{account.userData.role}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {account.userData.description}
                  </p>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Credentials */}
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <User size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Username:</span>
                      <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">
                        {username}
                      </code>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Key size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Password:</span>
                      <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">
                        {account.password}
                      </code>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {account.userData.email}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Tính năng chính:
                    </h4>
                    <ul className="space-y-1">
                      {account.userData.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {feature}
                          </span>
                        </li>
                      ))}
                      {account.userData.features.length > 3 && (
                        <li className="text-xs text-gray-500 dark:text-gray-500">
                          +{account.userData.features.length - 3} tính năng khác...
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => quickLogin(username, account.password)}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <LogIn size={14} />
                      <span>Đăng nhập nhanh</span>
                    </button>
                    <button
                      onClick={() => copyCredentials(username, account.password)}
                      className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      title="Copy thông tin đăng nhập"
                    >
                      {copiedAccount === username ? (
                        <CheckCircle size={14} className="text-green-500" />
                      ) : (
                        <Copy size={14} className="text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Usage Instructions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            🚀 Hướng dẫn sử dụng
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Cách đăng nhập
              </h3>
              <ol className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </span>
                  <span>Chọn tài khoản demo phù hợp với vai trò bạn muốn trải nghiệm</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </span>
                  <span>Click "Đăng nhập nhanh" hoặc copy username/password</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </span>
                  <span>Nhập thông tin vào form đăng nhập tại trang login</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </span>
                  <span>Trải nghiệm dashboard với quyền hạn tương ứng</span>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tính năng nổi bật
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-start space-x-3">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Role-based Access:</strong> Mỗi tài khoản có quyền hạn khác nhau
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Real-time SLA:</strong> Theo dõi P1-P4 priority orders
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Google Sheets Sync:</strong> Tích hợp đồng bộ dữ liệu
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Dark/Light Mode:</strong> Giao diện tối/sáng linh hoạt
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Responsive Design:</strong> Tương thích mobile/tablet
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-4">
              <a
                href="/login"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <LogIn size={16} />
                <span>Đi tới trang đăng nhập</span>
              </a>
              <a
                href="/users"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
              >
                <Eye size={16} />
                <span>Xem quản lý user</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            © 2025 MIA Group. Dashboard phát triển cho Trưởng phòng Kho vận.
          </p>
          <p className="text-xs mt-1">Version 2.1.0 - Demo Environment - Cập nhật: 12/06/2025</p>
        </div>
      </div>
    </div>
  );
}
