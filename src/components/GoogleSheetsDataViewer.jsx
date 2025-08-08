import { AlertCircle, Clock, Database, FileText, RefreshCw, Shield, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  getUnifiedGoogleSheetsService,
  logAuditEvent,
  testConnection,
} from '../services/unifiedGoogleSheetsService';

const GoogleSheetsDataViewer = () => {
  const [data, setData] = useState({
    users: [],
    auditLogs: [],
    permissions: [],
    sessions: [],
  });
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('users');

  const service = getUnifiedGoogleSheetsService();

  // Load specific sheet data
  const loadSheetData = useCallback(
    async (range) => {
      const endpoint = `${service.config.BASE_URL}/${service.config.SHEET_ID}/values/${service.config.RANGES[range]}?key=${service.config.API_KEY}`;

      const response = await service.makeRequest(endpoint, {
        useCache: true,
        cacheKey: `sheet_${range}_${Date.now()}`,
      });

      if (!response.values || response.values.length === 0) {
        return [];
      }

      // Parse data with headers
      const headers = response.values[0];
      const rows = response.values.slice(1);

      return rows.map((row, index) => {
        const item = { id: index + 1 };
        headers.forEach((header, colIndex) => {
          item[header.toLowerCase().replace(/\s+/g, '_')] = row[colIndex] || '';
        });
        return item;
      });
    },
    [service],
  );

  // Load data from all sheets
  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Test connection first
      const healthCheck = await testConnection();
      setConnectionStatus(healthCheck.success ? 'connected' : 'disconnected');

      if (!healthCheck.success) {
        throw new Error(healthCheck.error || 'Connection failed');
      }

      // Load data from each sheet range
      const promises = {
        users: loadSheetData('USERS'),
        auditLogs: loadSheetData('AUDIT_LOG'),
        permissions: loadSheetData('PERMISSIONS'),
        sessions: loadSheetData('SESSIONS'),
      };

      const results = await Promise.allSettled(Object.values(promises));
      const newData = {};

      // Process results
      Object.keys(promises).forEach((key, index) => {
        if (results[index].status === 'fulfilled') {
          newData[key] = results[index].value;
        } else {
          console.error(`Failed to load ${key}:`, results[index].reason);
          newData[key] = [];
        }
      });

      setData(newData);
      setLastUpdate(new Date());

      // Log the data viewing activity
      await logAuditEvent({
        action: 'DATA_VIEW',
        username: 'system',
        details: 'Viewed Google Sheets data dashboard',
        status: 'SUCCESS',
      });
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error.message);
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  }, [loadSheetData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    loadAllData();

    const interval = setInterval(() => {
      if (connectionStatus === 'connected') {
        loadAllData();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [loadAllData, connectionStatus]);

  // Connection status indicator
  const ConnectionIndicator = () => (
    <div className="flex items-center space-x-2 mb-4">
      <div
        className={`w-3 h-3 rounded-full ${
          connectionStatus === 'connected'
            ? 'bg-green-500'
            : connectionStatus === 'checking'
              ? 'bg-yellow-500'
              : 'bg-red-500'
        }`}
      ></div>
      <span className="text-sm font-medium">
        {connectionStatus === 'connected' && 'Kết nối tốt'}
        {connectionStatus === 'checking' && 'Đang kiểm tra...'}
        {connectionStatus === 'disconnected' && 'Mất kết nối'}
        {connectionStatus === 'error' && 'Lỗi kết nối'}
      </span>
      {lastUpdate && (
        <span className="text-xs text-gray-500">
          Cập nhật: {lastUpdate.toLocaleTimeString('vi-VN')}
        </span>
      )}
    </div>
  );

  // Render data table
  const DataTable = ({ data, columns, title, icon: Icon }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {data.length} items
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm">
                      {col.render ? col.render(item[col.key], item) : item[col.key] || '-'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Tab configuration
  const tabs = [
    {
      key: 'users',
      label: 'Users',
      icon: Users,
      data: data.users,
      columns: [
        { key: 'username', label: 'Username' },
        { key: 'full_name', label: 'Full Name' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'department', label: 'Department' },
        { key: 'shift', label: 'Shift' },
        {
          key: 'permissions',
          label: 'Permissions',
          render: (value) => (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{value || 'None'}</span>
          ),
        },
      ],
    },
    {
      key: 'auditLogs',
      label: 'Audit Logs',
      icon: FileText,
      data: data.auditLogs,
      columns: [
        {
          key: 'timestamp',
          label: 'Time',
          render: (value) => new Date(value).toLocaleString('vi-VN'),
        },
        { key: 'action', label: 'Action' },
        { key: 'username', label: 'User' },
        { key: 'details', label: 'Details' },
        {
          key: 'status',
          label: 'Status',
          render: (value) => (
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                value === 'SUCCESS'
                  ? 'bg-green-100 text-green-800'
                  : value === 'FAILED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              {value}
            </span>
          ),
        },
        { key: 'ip_address', label: 'IP Address' },
      ],
    },
    {
      key: 'permissions',
      label: 'Permissions',
      icon: Shield,
      data: data.permissions,
      columns: [
        { key: 'role', label: 'Role' },
        { key: 'permission', label: 'Permission' },
        { key: 'description', label: 'Description' },
      ],
    },
    {
      key: 'sessions',
      label: 'Sessions',
      icon: Clock,
      data: data.sessions,
      columns: [
        {
          key: 'session_id',
          label: 'Session ID',
          render: (value) => value?.substring(0, 20) + '...',
        },
        { key: 'user_id', label: 'User ID' },
        {
          key: 'login_time',
          label: 'Login Time',
          render: (value) => new Date(value).toLocaleString('vi-VN'),
        },
        {
          key: 'expires_at',
          label: 'Expires At',
          render: (value) => new Date(value).toLocaleString('vi-VN'),
        },
        {
          key: 'is_active',
          label: 'Status',
          render: (value) => (
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                value === 'TRUE' || value === true
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {value === 'TRUE' || value === true ? 'Active' : 'Inactive'}
            </span>
          ),
        },
      ],
    },
  ];

  const activeTabData = tabs.find((tab) => tab.key === activeTab);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Database className="w-6 h-6" />
            <span>Google Sheets Data Viewer</span>
          </h1>
          <p className="text-gray-600">Hiển thị dữ liệu thời gian thực từ Google Sheets</p>
        </div>

        <button
          onClick={loadAllData}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Đang tải...' : 'Làm mới'}</span>
        </button>
      </div>

      {/* Connection Status */}
      <ConnectionIndicator />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="bg-gray-100 text-gray-900 ml-2 py-0.5 px-2 rounded-full text-xs">
                {tab.data.length}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Data Table */}
      {activeTabData && (
        <DataTable
          data={activeTabData.data}
          columns={activeTabData.columns}
          title={activeTabData.label}
          icon={activeTabData.icon}
        />
      )}
    </div>
  );
};

export default GoogleSheetsDataViewer;
