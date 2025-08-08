import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Building,
  Users,
  Clock,
  Shield,
  Smartphone,
  Database,
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Calendar,
  Timer,
  Target,
  Award,
  Zap,
  Activity,
  MapPin,
  Phone,
  Mail,
  Globe,
  BarChart3,
  PieChart,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader,
  Star,
  Flag,
  Bell,
  Lock,
  Unlock,
  Key,
  User,
  UserCheck,
  UserX,
  UserPlus,
  FileText,
  Archive,
  History,
  Package,
  Truck,
  Home,
  Coffee,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  QrCode,
  Camera,
  Headphones,
} from 'lucide-react';

// ==================== SHARED GOOGLE SHEETS API ====================
/**
 * Unified Google Sheets API cho tất cả modules
 * Quản lý: Departments, Shifts, Permissions, Mobile Sessions, HR Data
 * Cập nhật: 08/06/2025 - Trưởng phòng Kho vận
 */

const WAREHOUSE_SHEETS_CONFIG = {
  SPREADSHEET_ID:
    process.env.VITE_WAREHOUSE_SPREADSHEET_ID ||
    'warehouse-management-spreadsheet-id',
  SHEETS: {
    DEPARTMENTS: 'Departments',
    SHIFTS: 'Shifts',
    SHIFT_ASSIGNMENTS: 'ShiftAssignments',
    PERMISSION_TEMPLATES: 'PermissionTemplates',
    MOBILE_SESSIONS: 'MobileSessions',
    HR_INTEGRATION: 'HRIntegration',
    AUDIT_LOG: 'WarehouseAuditLog',
  },
  RANGES: {
    DEPARTMENTS_DATA: 'Departments!A2:M',
    SHIFTS_DATA: 'Shifts!A2:K',
    ASSIGNMENTS_DATA: 'ShiftAssignments!A2:H',
    TEMPLATES_DATA: 'PermissionTemplates!A2:F',
    MOBILE_DATA: 'MobileSessions!A2:J',
    HR_DATA: 'HRIntegration!A2:P',
  },
};

class WarehouseManagementAPI {
  constructor() {
    this.isConnected = false;
    this.mockData = this.generateMockData();
  }

  generateMockData() {
    return {
      departments: [
        [
          '001',
          'Kho vận chính',
          'Main Warehouse',
          'Khu A-B',
          '25',
          'Nguyễn Văn Manager',
          'Active',
          '2024-01-01',
          '50000000',
          '45000000',
          'Kho chính lưu trữ hàng hóa',
          'KV',
        ],
        [
          '002',
          'Đóng gói & Xuất kho',
          'Packing & Outbound',
          'Khu C',
          '15',
          'Trần Thị Supervisor',
          'Active',
          '2024-01-01',
          '30000000',
          '28000000',
          'Đóng gói và xuất hàng',
          'DG',
        ],
        [
          '003',
          'Nhập kho & Kiểm tra',
          'Inbound & QC',
          'Khu D',
          '12',
          'Lê Văn QC Lead',
          'Active',
          '2024-01-01',
          '25000000',
          '22000000',
          'Nhập hàng và kiểm tra chất lượng',
          'NK',
        ],
        [
          '004',
          'Vận chuyển nội bộ',
          'Internal Transport',
          'Toàn kho',
          '8',
          'Phạm Văn Driver Lead',
          'Active',
          '2024-01-01',
          '20000000',
          '18000000',
          'Di chuyển hàng trong kho',
          'VC',
        ],
        [
          '005',
          'Bảo trì & An toàn',
          'Maintenance & Safety',
          'Toàn bộ',
          '5',
          'Hoàng Thị Safety',
          'Active',
          '2024-01-01',
          '15000000',
          '12000000',
          'Bảo trì thiết bị và an toàn lao động',
          'BT',
        ],
      ],
      shifts: [
        [
          'SH001',
          'Ca Sáng',
          '06:00',
          '14:00',
          '8',
          'Kho vận chính,Đóng gói & Xuất kho',
          'Active',
          'Chủ yếu picking và packing',
          '1.0',
          'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
        ],
        [
          'SH002',
          'Ca Chiều',
          '14:00',
          '22:00',
          '8',
          'Kho vận chính,Vận chuyển nội bộ',
          'Active',
          'Stocking và inventory',
          '1.0',
          'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
        ],
        [
          'SH003',
          'Ca Đêm',
          '22:00',
          '06:00',
          '8',
          'Bảo trì & An toàn',
          'Active',
          'Bảo trì và cleaning',
          '1.5',
          'Sunday,Monday,Tuesday,Wednesday,Thursday',
        ],
        [
          'SH004',
          'Ca Chủ nhật',
          '08:00',
          '16:00',
          '8',
          'Kho vận chính',
          'Active',
          'Ca cuối tuần reduced',
          '1.3',
          'Sunday',
        ],
        [
          'SH005',
          'Ca Overtime',
          '18:00',
          '22:00',
          '4',
          'All Departments',
          'Active',
          'Tăng ca khi cần',
          '1.5',
          'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
        ],
      ],
      assignments: [
        [
          'ASG001',
          'SH001',
          '003',
          'Nguyễn Văn A',
          '2025-06-08',
          'Assigned',
          'Picker lead ca sáng',
          'Normal',
        ],
        [
          'ASG002',
          'SH001',
          '004',
          'Trần Thị B',
          '2025-06-08',
          'Assigned',
          'Packer ca sáng',
          'Normal',
        ],
        [
          'ASG003',
          'SH002',
          '005',
          'Lê Văn C',
          '2025-06-08',
          'Assigned',
          'Supervisor ca chiều',
          'Critical',
        ],
        [
          'ASG004',
          'SH003',
          '006',
          'Phạm Thị D',
          '2025-06-08',
          'Pending',
          'Maintenance ca đêm',
          'Normal',
        ],
        [
          'ASG005',
          'SH005',
          '003',
          'Nguyễn Văn A',
          '2025-06-08',
          'Requested',
          'Overtime picking',
          'Optional',
        ],
      ],
      permissionTemplates: [
        [
          'TPL001',
          'Warehouse Picker',
          'Nhân viên lấy hàng',
          '{"orders": "assigned", "picking": "write", "inventory": "read"}',
          'Kho vận chính',
          'Cơ bản cho picker',
        ],
        [
          'TPL002',
          'Packing Specialist',
          'Chuyên viên đóng gói',
          '{"orders": "assigned", "packing": "write", "shipping": "read"}',
          'Đóng gói & Xuất kho',
          'Quyền đóng gói',
        ],
        [
          'TPL003',
          'QC Inspector',
          'Kiểm tra chất lượng',
          '{"qc": "write", "inventory": "write", "reports": "read"}',
          'Nhập kho & Kiểm tra',
          'Kiểm tra hàng hóa',
        ],
        [
          'TPL004',
          'Shift Supervisor',
          'Giám sát ca',
          '{"orders": "department", "staff": "manage", "reports": "write"}',
          'All Departments',
          'Quản lý ca làm việc',
        ],
        [
          'TPL005',
          'Department Manager',
          'Trưởng phòng',
          '{"orders": "all", "staff": "all", "reports": "all", "budgets": "read"}',
          'All Departments',
          'Quản lý phòng ban',
        ],
      ],
      mobileSessions: [
        [
          'MOB001',
          '003',
          'PICKER_001',
          'Android 12',
          '192.168.1.100',
          '2025-06-08 06:00:00',
          'Active',
          'Warehouse Floor A',
          'mobile_token_123',
          'Standard',
        ],
        [
          'MOB002',
          '004',
          'PACK_STATION_02',
          'Terminal OS',
          '192.168.1.105',
          '2025-06-08 06:15:00',
          'Active',
          'Packing Area C',
          'terminal_token_456',
          'Kiosk',
        ],
        [
          'MOB003',
          '005',
          'MOBILE_SUP_01',
          'iOS 16',
          '192.168.1.110',
          '2025-06-08 14:00:00',
          'Active',
          'Mobile Roaming',
          'mobile_token_789',
          'Supervisor',
        ],
        [
          'MOB004',
          '006',
          'MAINT_TAB_01',
          'Android 11',
          '192.168.1.115',
          '2025-06-08 22:00:00',
          'Offline',
          'Maintenance Area',
          'tablet_token_012',
          'Maintenance',
        ],
        [
          'MOB005',
          '007',
          'TEMP_DEVICE_99',
          'Web Browser',
          '192.168.1.120',
          '2025-06-08 08:30:00',
          'Expired',
          'Visitor Area',
          'temp_token_345',
          'Temporary',
        ],
      ],
      hrIntegration: [
        [
          'HR001',
          '003',
          'EMP2024001',
          'Nguyễn Văn A',
          'Active',
          '2024-02-01',
          '15000000',
          'Kho vận chính',
          'Picker',
          'Permanent',
          'Performance: 95%',
          'Next review: 2025-08-01',
          '2 năm',
          '+84901234567',
          'nguyenvana@mia.vn',
        ],
        [
          'HR002',
          '004',
          'EMP2024015',
          'Trần Thị B',
          'Active',
          '2024-02-15',
          '13000000',
          'Đóng gói & Xuất kho',
          'Packer',
          'Permanent',
          'Performance: 88%',
          'Next review: 2025-08-15',
          '1.5 năm',
          '+84912345678',
          'tranthib@mia.vn',
        ],
        [
          'HR003',
          '005',
          'EMP2024030',
          'Lê Văn C',
          'Active',
          '2024-03-01',
          '20000000',
          'Kho vận chính',
          'Supervisor',
          'Permanent',
          'Performance: 92%',
          'Next review: 2025-09-01',
          '3 năm',
          '+84923456789',
          'levanc@mia.vn',
        ],
        [
          'HR004',
          '006',
          'EMP2024045',
          'Phạm Thị D',
          'Leave',
          '2024-04-01',
          '12000000',
          'Bảo trì & An toàn',
          'Maintenance',
          'Contract',
          'Performance: 90%',
          'Contract expires: 2025-04-01',
          '1 năm',
          '+84934567890',
          'phamthid@mia.vn',
        ],
        [
          'HR005',
          '007',
          'EMP2025001',
          'Hoàng Văn E',
          'Probation',
          '2025-06-01',
          '11000000',
          'Nhập kho & Kiểm tra',
          'QC Inspector',
          'Probation',
          'Performance: N/A',
          'Probation ends: 2025-09-01',
          '1 tuần',
          '+84945678901',
          'hoangvane@mia.vn',
        ],
      ],
    };
  }

  async connect() {
    console.log('🔌 Connecting to Warehouse Management Sheets...');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    this.isConnected = true;
    console.log('✅ Connected to Warehouse Management Sheets');
    return { success: true, timestamp: new Date() };
  }

  // Department Management Methods
  async getDepartments() {
    if (!this.isConnected) await this.connect();
    await new Promise((resolve) => setTimeout(resolve, 400));

    return this.mockData.departments.map((row) => ({
      id: row[0],
      name: row[1],
      englishName: row[2],
      location: row[3],
      staffCount: parseInt(row[4]),
      manager: row[5],
      status: row[6],
      establishedDate: new Date(row[7]),
      budget: parseInt(row[8]),
      actualSpent: parseInt(row[9]),
      description: row[10],
      code: row[11],
    }));
  }

  async createDepartment(deptData) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const newId = String(this.mockData.departments.length + 1).padStart(3, '0');
    const newDept = [
      newId,
      deptData.name,
      deptData.englishName,
      deptData.location,
      deptData.staffCount.toString(),
      deptData.manager,
      deptData.status || 'Active',
      new Date().toISOString(),
      deptData.budget.toString(),
      '0',
      deptData.description,
      deptData.code,
    ];
    this.mockData.departments.push(newDept);
    return { success: true, departmentId: newId };
  }

  // Shift Management Methods
  async getShifts() {
    if (!this.isConnected) await this.connect();
    await new Promise((resolve) => setTimeout(resolve, 350));

    return this.mockData.shifts.map((row) => ({
      id: row[0],
      name: row[1],
      startTime: row[2],
      endTime: row[3],
      duration: parseInt(row[4]),
      departments: row[5].split(','),
      status: row[6],
      description: row[7],
      overtimeRate: parseFloat(row[8]),
      workDays: row[9].split(','),
    }));
  }

  async getShiftAssignments(date = null) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return this.mockData.assignments.map((row) => ({
      id: row[0],
      shiftId: row[1],
      userId: row[2],
      userName: row[3],
      date: new Date(row[4]),
      status: row[5],
      notes: row[6],
      priority: row[7],
    }));
  }

  async createShiftAssignment(assignmentData) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newId =
      'ASG' + String(this.mockData.assignments.length + 1).padStart(3, '0');
    const newAssignment = [
      newId,
      assignmentData.shiftId,
      assignmentData.userId,
      assignmentData.userName,
      assignmentData.date.toISOString(),
      assignmentData.status || 'Assigned',
      assignmentData.notes || '',
      assignmentData.priority || 'Normal',
    ];
    this.mockData.assignments.push(newAssignment);
    return { success: true, assignmentId: newId };
  }

  // Permission Template Methods
  async getPermissionTemplates() {
    await new Promise((resolve) => setTimeout(resolve, 250));

    return this.mockData.permissionTemplates.map((row) => ({
      id: row[0],
      name: row[1],
      displayName: row[2],
      permissions: JSON.parse(row[3]),
      applicableDepartments: row[4],
      description: row[5],
    }));
  }

  // Mobile Session Methods
  async getMobileSessions() {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return this.mockData.mobileSessions.map((row) => ({
      id: row[0],
      userId: row[1],
      deviceId: row[2],
      deviceInfo: row[3],
      ipAddress: row[4],
      loginTime: new Date(row[5]),
      status: row[6],
      location: row[7],
      sessionToken: row[8],
      sessionType: row[9],
    }));
  }

  async createMobileSession(sessionData) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newId =
      'MOB' + String(this.mockData.mobileSessions.length + 1).padStart(3, '0');
    const newSession = [
      newId,
      sessionData.userId,
      sessionData.deviceId,
      sessionData.deviceInfo,
      sessionData.ipAddress,
      new Date().toISOString(),
      'Active',
      sessionData.location,
      'token_' + Math.random().toString(36).substring(7),
      sessionData.sessionType || 'Standard',
    ];
    this.mockData.mobileSessions.push(newSession);
    return { success: true, sessionId: newId, token: newSession[8] };
  }

  // HR Integration Methods
  async getHRData() {
    await new Promise((resolve) => setTimeout(resolve, 450));

    return this.mockData.hrIntegration.map((row) => ({
      id: row[0],
      userId: row[1],
      employeeId: row[2],
      fullName: row[3],
      status: row[4],
      hireDate: new Date(row[5]),
      salary: parseInt(row[6]),
      department: row[7],
      position: row[8],
      employmentType: row[9],
      performanceNotes: row[10],
      reviewNotes: row[11],
      experience: row[12],
      phone: row[13],
      email: row[14],
    }));
  }

  async syncWithHR(userId, hrData) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    // Simulate HR system sync
    console.log('🔄 Syncing with HR system for user:', userId);
    return { success: true, syncedAt: new Date() };
  }
}

// ==================== SHARED HOOKS ====================

const useWarehouseManagement = () => {
  const [api] = useState(() => new WarehouseManagementAPI());
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [data, setData] = useState({
    departments: [],
    shifts: [],
    assignments: [],
    templates: [],
    mobileSessions: [],
    hrData: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeConnection();
  }, []);

  const initializeConnection = async () => {
    try {
      setConnectionStatus('connecting');
      await api.connect();
      setConnectionStatus('connected');
      await loadAllData();
    } catch (err) {
      setConnectionStatus('error');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async () => {
    try {
      const [
        departments,
        shifts,
        assignments,
        templates,
        mobileSessions,
        hrData,
      ] = await Promise.all([
        api.getDepartments(),
        api.getShifts(),
        api.getShiftAssignments(),
        api.getPermissionTemplates(),
        api.getMobileSessions(),
        api.getHRData(),
      ]);

      setData({
        departments,
        shifts,
        assignments,
        templates,
        mobileSessions,
        hrData,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    api,
    connectionStatus,
    data,
    loading,
    error,
    refreshData: loadAllData,
  };
};

// ==================== MODULE 1: DEPARTMENT MANAGEMENT ====================
/**
 * Department Management Module
 * Quản lý cấu trúc tổ chức phòng ban warehouse
 * Features: CRUD departments, budget tracking, staff allocation
 */

const DepartmentManagementModule = ({ data, api, onRefresh }) => {
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid, table, hierarchy

  const stats = useMemo(() => {
    const depts = data.departments;
    const totalBudget = depts.reduce((sum, d) => sum + d.budget, 0);
    const totalSpent = depts.reduce((sum, d) => sum + d.actualSpent, 0);
    const totalStaff = depts.reduce((sum, d) => sum + d.staffCount, 0);

    return {
      totalDepartments: depts.length,
      activeDepartments: depts.filter((d) => d.status === 'Active').length,
      totalBudget,
      totalSpent,
      budgetUtilization: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
      totalStaff,
      avgStaffPerDept:
        depts.length > 0 ? Math.round(totalStaff / depts.length) : 0,
    };
  }, [data.departments]);

  const DepartmentCard = ({ department }) => {
    const budgetUtilization =
      department.budget > 0
        ? (department.actualSpent / department.budget) * 100
        : 0;
    const utilizationColor =
      budgetUtilization > 90
        ? 'text-red-600'
        : budgetUtilization > 70
        ? 'text-yellow-600'
        : 'text-green-600';

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {department.name}
            </h3>
            <p className="text-sm text-gray-500">{department.englishName}</p>
            <div className="flex items-center mt-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {department.code}
              </span>
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  department.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {department.status}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {department.staffCount}
            </p>
            <p className="text-xs text-gray-500">Nhân viên</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <MapPin size={16} className="text-gray-400 mr-2" />
            <span className="text-gray-600 dark:text-gray-400">
              {department.location}
            </span>
          </div>

          <div className="flex items-center text-sm">
            <User size={16} className="text-gray-400 mr-2" />
            <span className="text-gray-600 dark:text-gray-400">
              {department.manager}
            </span>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">
                Ngân sách
              </span>
              <span className={`font-medium ${utilizationColor}`}>
                {budgetUtilization.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  budgetUtilization > 90
                    ? 'bg-red-500'
                    : budgetUtilization > 70
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{(department.actualSpent / 1000000).toFixed(1)}M</span>
              <span>{(department.budget / 1000000).toFixed(1)}M VND</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {department.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-500">
            Thành lập: {department.establishedDate.toLocaleDateString('vi-VN')}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setEditingDept(department);
                setShowDeptForm(true);
              }}
              className="p-1 text-blue-600 hover:text-blue-800"
            >
              <Edit size={16} />
            </button>
            <button className="p-1 text-gray-600 hover:text-gray-800">
              <Eye size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quản lý Phòng ban
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Cấu trúc tổ chức và phân bổ nguồn lực warehouse
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''
                }`}
              >
                <Building size={16} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded ${
                  viewMode === 'table' ? 'bg-white dark:bg-gray-600 shadow' : ''
                }`}
              >
                <FileText size={16} />
              </button>
            </div>

            <button
              onClick={() => {
                setEditingDept(null);
                setShowDeptForm(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Thêm phòng ban
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tổng phòng ban
                </p>
                <p className="text-2xl font-bold">{stats.totalDepartments}</p>
              </div>
              <Building className="text-blue-500" size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tổng nhân viên
                </p>
                <p className="text-2xl font-bold">{stats.totalStaff}</p>
              </div>
              <Users className="text-green-500" size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ngân sách
                </p>
                <p className="text-2xl font-bold">
                  {(stats.totalBudget / 1000000).toFixed(0)}M
                </p>
              </div>
              <Target className="text-purple-500" size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sử dụng ngân sách
                </p>
                <p className="text-2xl font-bold">
                  {stats.budgetUtilization.toFixed(1)}%
                </p>
              </div>
              <BarChart3 className="text-orange-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Departments Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.departments.map((dept) => (
            <DepartmentCard key={dept.id} department={dept} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phòng ban
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Vị trí
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quản lý
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nhân viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ngân sách
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.departments.map((dept) => (
                  <tr
                    key={dept.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{dept.name}</div>
                        <div className="text-sm text-gray-500">{dept.code}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{dept.location}</td>
                    <td className="px-6 py-4 text-sm">{dept.manager}</td>
                    <td className="px-6 py-4 text-sm">{dept.staffCount}</td>
                    <td className="px-6 py-4 text-sm">
                      {(dept.actualSpent / 1000000).toFixed(1)}M /{' '}
                      {(dept.budget / 1000000).toFixed(1)}M
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          dept.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {dept.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setEditingDept(dept);
                          setShowDeptForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Department Form Modal sẽ được implement tiếp theo... */}
      {/* NOTE: DepartmentFormModal component sẽ được thêm vào phần tiếp theo */}
    </div>
  );
};

// ==================== MODULE 2: SHIFT MANAGEMENT ====================
/**
 * Shift Management Module
 * Quản lý ca làm việc và phân công nhân viên
 * Features: Shift scheduling, staff assignment, overtime tracking
 */

const ShiftManagementModule = ({ data, api, onRefresh }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('calendar'); // calendar, list, assignments
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);

  // Get shifts for selected date
  const shiftsForDate = useMemo(() => {
    const dayName = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
    });
    return data.shifts.filter(
      (shift) => shift.workDays.includes(dayName) && shift.status === 'Active'
    );
  }, [data.shifts, selectedDate]);

  // Get assignments for selected date
  const assignmentsForDate = useMemo(() => {
    return data.assignments.filter(
      (assignment) =>
        assignment.date.toDateString() === selectedDate.toDateString()
    );
  }, [data.assignments, selectedDate]);

  const ShiftCard = ({ shift, assignments }) => {
    const shiftAssignments = assignments.filter((a) => a.shiftId === shift.id);
    const requiredStaff = shift.departments.length * 3; // Estimate based on departments
    const assignedStaff = shiftAssignments.length;
    const staffingRate =
      requiredStaff > 0 ? (assignedStaff / requiredStaff) * 100 : 0;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {shift.name}
            </h3>
            <p className="text-sm text-gray-500">
              {shift.startTime} - {shift.endTime} ({shift.duration}h)
            </p>
            <p className="text-xs text-gray-400 mt-1">{shift.description}</p>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold">
              {assignedStaff}/{requiredStaff}
            </span>
            <p className="text-xs text-gray-500">Nhân viên</p>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Staffing Rate</span>
              <span
                className={`font-medium ${
                  staffingRate >= 100
                    ? 'text-green-600'
                    : staffingRate >= 80
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {staffingRate.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  staffingRate >= 100
                    ? 'bg-green-500'
                    : staffingRate >= 80
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(staffingRate, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {shift.departments.map((dept) => (
              <span
                key={dept}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
              >
                {dept}
              </span>
            ))}
          </div>

          {shift.overtimeRate > 1.0 && (
            <div className="flex items-center text-sm text-orange-600">
              <Clock size={14} className="mr-1" />
              Overtime {shift.overtimeRate}x
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {shiftAssignments.length} assignments
            </span>
            <button
              onClick={() => setShowAssignmentForm(true)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
            >
              Assign Staff
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AssignmentsList = ({ assignments }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold">Phân công ca làm việc</h3>
        <p className="text-sm text-gray-500">
          {selectedDate.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {assignments.length > 0 ? (
          assignments.map((assignment) => {
            const shift = data.shifts.find((s) => s.id === assignment.shiftId);
            return (
              <div
                key={assignment.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{assignment.userName}</div>
                    <div className="text-sm text-gray-500">
                      {shift?.name} • {shift?.startTime} - {shift?.endTime}
                    </div>
                    {assignment.notes && (
                      <div className="text-xs text-gray-400 mt-1">
                        {assignment.notes}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        assignment.status === 'Assigned'
                          ? 'bg-green-100 text-green-800'
                          : assignment.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : assignment.status === 'Requested'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {assignment.status}
                    </span>
                    {assignment.priority === 'Critical' && (
                      <div className="text-xs text-red-600 mt-1">
                        ⚠️ Critical
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Clock size={48} className="mx-auto mb-2 opacity-50" />
            <p>Chưa có phân công nào cho ngày này</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quản lý Ca làm việc
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Lập lịch và phân công nhân viên theo ca
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-gray-600 shadow'
                  : ''
              }`}
            >
              <Calendar size={16} />
            </button>
            <button
              onClick={() => setViewMode('assignments')}
              className={`p-2 rounded ${
                viewMode === 'assignments'
                  ? 'bg-white dark:bg-gray-600 shadow'
                  : ''
              }`}
            >
              <Users size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ca làm việc hôm nay
              </p>
              <p className="text-2xl font-bold">{shiftsForDate.length}</p>
            </div>
            <Clock className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Đã phân công
              </p>
              <p className="text-2xl font-bold">{assignmentsForDate.length}</p>
            </div>
            <UserCheck className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Overtime
              </p>
              <p className="text-2xl font-bold">
                {
                  assignmentsForDate.filter((a) => {
                    const shift = data.shifts.find((s) => s.id === a.shiftId);
                    return shift?.overtimeRate > 1.0;
                  }).length
                }
              </p>
            </div>
            <Zap className="text-orange-500" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chờ duyệt
              </p>
              <p className="text-2xl font-bold">
                {
                  assignmentsForDate.filter((a) => a.status === 'Pending')
                    .length
                }
              </p>
            </div>
            <Timer className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shiftsForDate.map((shift) => (
            <ShiftCard
              key={shift.id}
              shift={shift}
              assignments={assignmentsForDate}
            />
          ))}
        </div>
      ) : (
        <AssignmentsList assignments={assignmentsForDate} />
      )}
    </div>
  );
};

// ==================== MODULE 3: PERMISSION TEMPLATES ====================
/**
 * Permission Template System
 * Templates cho từng vị trí warehouse với quyền hạn được định nghĩa sẵn
 */

const PermissionTemplateModule = ({ data, api, onRefresh }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplateForm, setShowTemplateForm] = useState(false);

  const TemplateCard = ({ template }) => {
    const permissionCount = Object.keys(template.permissions).length;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {template.displayName}
            </h3>
            <p className="text-sm text-gray-500">{template.name}</p>
            <p className="text-xs text-gray-400 mt-2">{template.description}</p>
          </div>
          <Shield className="text-blue-500" size={24} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Phòng ban áp dụng:</span>
            <span className="text-sm font-medium">
              {template.applicableDepartments}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Số quyền hạn:</span>
            <span className="text-sm font-medium">
              {permissionCount} permissions
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Quyền hạn chi tiết:</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {Object.entries(template.permissions).map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="capitalize text-gray-700 dark:text-gray-300">
                    {key}:
                  </span>
                  <span className="font-medium text-blue-600">
                    {typeof value === 'boolean'
                      ? value
                        ? 'Có'
                        : 'Không'
                      : value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => setSelectedTemplate(template)}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
          >
            Xem chi tiết
          </button>
          <div className="flex space-x-2">
            <button className="p-1 text-blue-600 hover:text-blue-800">
              <Edit size={16} />
            </button>
            <button className="p-1 text-gray-600 hover:text-gray-800">
              <FileText size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Permission Templates
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Mẫu quyền hạn cho từng vị trí công việc
          </p>
        </div>

        <button
          onClick={() => setShowTemplateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Tạo template
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.templates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Chi tiết Template</h3>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg">
                    {selectedTemplate.displayName}
                  </h4>
                  <p className="text-gray-600">
                    {selectedTemplate.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Template ID:
                    </label>
                    <p className="text-sm">{selectedTemplate.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Áp dụng cho:
                    </label>
                    <p className="text-sm">
                      {selectedTemplate.applicableDepartments}
                    </p>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-3">Quyền hạn chi tiết:</h5>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                    {Object.entries(selectedTemplate.permissions).map(
                      ([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize font-medium">{key}:</span>
                          <span className="text-blue-600">
                            {typeof value === 'boolean'
                              ? value
                                ? '✅ Có quyền'
                                : '❌ Không có quyền'
                              : value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== MODULE 4: MOBILE AUTHENTICATION ====================
/**
 * Mobile App Authentication
 * Extend authentication cho mobile workers với QR codes, terminals
 */

const MobileAuthenticationModule = ({ data, api, onRefresh }) => {
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const stats = useMemo(() => {
    const sessions = data.mobileSessions;
    return {
      totalSessions: sessions.length,
      activeSessions: sessions.filter((s) => s.status === 'Active').length,
      mobileSessions: sessions.filter((s) => s.sessionType === 'Standard')
        .length,
      kioskSessions: sessions.filter((s) => s.sessionType === 'Kiosk').length,
      supervisorSessions: sessions.filter((s) => s.sessionType === 'Supervisor')
        .length,
    };
  }, [data.mobileSessions]);

  const SessionCard = ({ session }) => {
    const getSessionIcon = (type) => {
      switch (type) {
        case 'Standard':
          return <Smartphone className="text-blue-500" size={20} />;
        case 'Kiosk':
          return <Package className="text-green-500" size={20} />;
        case 'Supervisor':
          return <Shield className="text-purple-500" size={20} />;
        case 'Maintenance':
          return <Settings className="text-orange-500" size={20} />;
        default:
          return <Globe className="text-gray-500" size={20} />;
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'Active':
          return 'bg-green-100 text-green-800';
        case 'Offline':
          return 'bg-gray-100 text-gray-800';
        case 'Expired':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-yellow-100 text-yellow-800';
      }
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {getSessionIcon(session.sessionType)}
            <div>
              <h3 className="font-medium">{session.deviceId}</h3>
              <p className="text-sm text-gray-500">{session.deviceInfo}</p>
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              session.status
            )}`}
          >
            {session.status}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">User ID:</span>
            <span className="font-medium">{session.userId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Location:</span>
            <span className="font-medium">{session.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">IP Address:</span>
            <span className="font-mono text-xs">{session.ipAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Login Time:</span>
            <span className="font-medium">
              {session.loginTime.toLocaleTimeString('vi-VN')}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-500">
            {session.sessionType} Session
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedSession(session)}
              className="p-1 text-blue-600 hover:text-blue-800"
            >
              <Eye size={16} />
            </button>
            <button className="p-1 text-red-600 hover:text-red-800">
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mobile Authentication
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý phiên đăng nhập mobile và terminal
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowQRCode(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <QrCode size={16} className="mr-2" />
            Tạo QR Login
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <Plus size={16} className="mr-2" />
            New Session
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tổng sessions
              </p>
              <p className="text-2xl font-bold">{stats.totalSessions}</p>
            </div>
            <Smartphone className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Đang hoạt động
              </p>
              <p className="text-2xl font-bold text-green-600">
                {stats.activeSessions}
              </p>
            </div>
            <Wifi className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mobile</p>
              <p className="text-2xl font-bold">{stats.mobileSessions}</p>
            </div>
            <Smartphone className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Kiosk</p>
              <p className="text-2xl font-bold">{stats.kioskSessions}</p>
            </div>
            <Package className="text-orange-500" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Supervisor
              </p>
              <p className="text-2xl font-bold">{stats.supervisorSessions}</p>
            </div>
            <Shield className="text-indigo-500" size={24} />
          </div>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.mobileSessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <h3 className="text-lg font-bold mb-4">QR Code Login</h3>
              <div className="w-48 h-48 bg-gray-200 mx-auto mb-4 flex items-center justify-center rounded-lg">
                <QrCode size={120} className="text-gray-500" />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Quét mã QR này để đăng nhập nhanh trên thiết bị mobile
              </p>
              <div className="text-xs text-gray-500 mb-4">
                Mã có hiệu lực trong 5 phút
              </div>
              <button
                onClick={() => setShowQRCode(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== MODULE 5: HR INTEGRATION ====================
/**
 * HR System Integration
 * Sync với hệ thống nhân sự, employee lifecycle, performance tracking
 */

const HRIntegrationModule = ({ data, api, onRefresh }) => {
  const [syncStatus, setSyncStatus] = useState('ready'); // ready, syncing, success, error
  const [lastSyncTime, setLastSyncTime] = useState(null);

  const handleHRSync = async () => {
    setSyncStatus('syncing');
    try {
      // Simulate HR sync for each employee
      for (const employee of data.hrData) {
        await api.syncWithHR(employee.userId, employee);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate processing time
      }
      setSyncStatus('success');
      setLastSyncTime(new Date());
      setTimeout(() => setSyncStatus('ready'), 3000);
    } catch (error) {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('ready'), 3000);
    }
  };

  const EmployeeCard = ({ employee }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'Active':
          return 'bg-green-100 text-green-800';
        case 'Leave':
          return 'bg-yellow-100 text-yellow-800';
        case 'Probation':
          return 'bg-blue-100 text-blue-800';
        case 'Terminated':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    const getEmploymentTypeColor = (type) => {
      switch (type) {
        case 'Permanent':
          return 'bg-blue-100 text-blue-800';
        case 'Contract':
          return 'bg-purple-100 text-purple-800';
        case 'Probation':
          return 'bg-orange-100 text-orange-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {employee.fullName}
            </h3>
            <p className="text-sm text-gray-500">{employee.employeeId}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  employee.status
                )}`}
              >
                {employee.status}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getEmploymentTypeColor(
                  employee.employmentType
                )}`}
              >
                {employee.employmentType}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{employee.position}</p>
            <p className="text-xs text-gray-500">{employee.department}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Ngày vào làm:</span>
              <p className="font-medium">
                {employee.hireDate.toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Kinh nghiệm:</span>
              <p className="font-medium">{employee.experience}</p>
            </div>
            <div>
              <span className="text-gray-600">Lương:</span>
              <p className="font-medium">
                {(employee.salary / 1000000).toFixed(1)}M VND
              </p>
            </div>
            <div>
              <span className="text-gray-600">Liên hệ:</span>
              <p className="font-medium text-xs">{employee.phone}</p>
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm">
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                Performance Notes:
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                {employee.performanceNotes}
              </p>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            <p>{employee.reviewNotes}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-xs text-gray-500">
            <Mail size={12} className="mr-1" />
            <span>{employee.email}</span>
          </div>
          <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
            Sync HR
          </button>
        </div>
      </div>
    );
  };

  const stats = useMemo(() => {
    const employees = data.hrData;
    return {
      totalEmployees: employees.length,
      activeEmployees: employees.filter((e) => e.status === 'Active').length,
      onLeave: employees.filter((e) => e.status === 'Leave').length,
      probation: employees.filter((e) => e.status === 'Probation').length,
      avgSalary:
        employees.length > 0
          ? employees.reduce((sum, e) => sum + e.salary, 0) / employees.length
          : 0,
      permanentStaff: employees.filter((e) => e.employmentType === 'Permanent')
        .length,
    };
  }, [data.hrData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            HR System Integration
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Đồng bộ dữ liệu nhân sự và theo dõi hiệu suất
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {lastSyncTime && (
            <span className="text-sm text-gray-500">
              Sync cuối: {lastSyncTime.toLocaleTimeString('vi-VN')}
            </span>
          )}
          <button
            onClick={handleHRSync}
            disabled={syncStatus === 'syncing'}
            className={`px-4 py-2 rounded-lg flex items-center ${
              syncStatus === 'syncing'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            {syncStatus === 'syncing' ? (
              <>
                <RefreshCw size={16} className="mr-2 animate-spin" />
                Đang sync...
              </>
            ) : (
              <>
                <Database size={16} className="mr-2" />
                Sync with HR
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      {syncStatus !== 'ready' && (
        <div
          className={`p-4 rounded-lg border ${
            syncStatus === 'success'
              ? 'bg-green-50 border-green-200'
              : syncStatus === 'error'
              ? 'bg-red-50 border-red-200'
              : 'bg-blue-50 border-blue-200'
          }`}
        >
          <div className="flex items-center">
            {syncStatus === 'syncing' && (
              <RefreshCw
                className="animate-spin mr-2 text-blue-600"
                size={20}
              />
            )}
            {syncStatus === 'success' && (
              <CheckCircle className="mr-2 text-green-600" size={20} />
            )}
            {syncStatus === 'error' && (
              <XCircle className="mr-2 text-red-600" size={20} />
            )}
            <span
              className={`font-medium ${
                syncStatus === 'success'
                  ? 'text-green-800'
                  : syncStatus === 'error'
                  ? 'text-red-800'
                  : 'text-blue-800'
              }`}
            >
              {syncStatus === 'syncing' &&
                'Đang đồng bộ dữ liệu với hệ thống HR...'}
              {syncStatus === 'success' &&
                'Đồng bộ thành công! Dữ liệu nhân sự đã được cập nhật.'}
              {syncStatus === 'error' && 'Lỗi đồng bộ! Vui lòng thử lại sau.'}
            </span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tổng nhân viên
              </p>
              <p className="text-2xl font-bold">{stats.totalEmployees}</p>
            </div>
            <Users className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Đang làm việc
              </p>
              <p className="text-2xl font-bold text-green-600">
                {stats.activeEmployees}
              </p>
            </div>
            <UserCheck className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Thử việc
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.probation}
              </p>
            </div>
            <Timer className="text-orange-500" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nghỉ phép
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.onLeave}
              </p>
            </div>
            <Coffee className="text-yellow-500" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chính thức
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.permanentStaff}
              </p>
            </div>
            <Award className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Lương TB
              </p>
              <p className="text-2xl font-bold text-indigo-600">
                {(stats.avgSalary / 1000000).toFixed(1)}M
              </p>
            </div>
            <Target className="text-indigo-500" size={24} />
          </div>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.hrData.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))}
      </div>
    </div>
  );
};

// ==================== MAIN SUITE COMPONENT ====================
/**
 * Main Warehouse Management Suite
 * Tích hợp tất cả 5 modules với navigation và shared state
 */

const WarehouseManagementSuite = () => {
  const [activeModule, setActiveModule] = useState('departments');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { api, connectionStatus, data, loading, error, refreshData } =
    useWarehouseManagement();

  const modules = [
    {
      id: 'departments',
      name: 'Phòng ban',
      icon: Building,
      component: DepartmentManagementModule,
    },
    {
      id: 'shifts',
      name: 'Ca làm việc',
      icon: Clock,
      component: ShiftManagementModule,
    },
    {
      id: 'templates',
      name: 'Permission Templates',
      icon: Shield,
      component: PermissionTemplateModule,
    },
    {
      id: 'mobile',
      name: 'Mobile Auth',
      icon: Smartphone,
      component: MobileAuthenticationModule,
    },
    {
      id: 'hr',
      name: 'HR Integration',
      icon: Database,
      component: HRIntegrationModule,
    },
  ];

  const ActiveModuleComponent = modules.find(
    (m) => m.id === activeModule
  )?.component;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Building className="animate-pulse" size={64} />
          </div>
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Đang kết nối Warehouse Management System...
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Đang tải dữ liệu từ Google Sheets
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 text-red-500" size={64} />
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Lỗi kết nối hệ thống
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Thử lại kết nối
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Building size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                MIA Warehouse
              </h1>
              <p className="text-xs text-gray-500">Management Suite</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeModule === module.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{module.name}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Connection Status */}
        <div className="absolute bottom-4 left-4 right-4">
          <div
            className={`p-3 rounded-lg border ${
              connectionStatus === 'connected'
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              {connectionStatus === 'connected' ? (
                <Wifi
                  className="text-green-600 dark:text-green-400"
                  size={16}
                />
              ) : (
                <WifiOff className="text-red-600 dark:text-red-400" size={16} />
              )}
              <span
                className={`text-sm font-medium ${
                  connectionStatus === 'connected'
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-red-800 dark:text-red-200'
                }`}
              >
                {connectionStatus === 'connected'
                  ? 'Đã kết nối'
                  : 'Mất kết nối'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto">
        <div className="p-6">
          {ActiveModuleComponent && (
            <ActiveModuleComponent
              data={data}
              api={api}
              onRefresh={refreshData}
            />
          )}
        </div>
      </div>

      {/* Demo Information */}
      <div className="fixed bottom-4 right-4 max-w-sm">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            🏭 MIA Warehouse Management Suite
          </h3>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Hệ thống quản lý warehouse hoàn chỉnh với 5 modules: Department
            Management, Shift Management, Permission Templates, Mobile
            Authentication và HR Integration. Tích hợp Google Sheets real-time.
          </p>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            📅 Cập nhật: 08/06/2025 • Version 2.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseManagementSuite;
