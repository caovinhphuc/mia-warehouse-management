import {
  Activity,
  BarChart3,
  Bell,
  CheckCircle,
  Command,
  Edit,
  FileText,
  Grid,
  Loader2,
  Monitor,
  Moon,
  Navigation,
  Package,
  Pause,
  Play,
  RefreshCw,
  Settings,
  Square as SquareIcon,
  Sun,
  Upload,
  Users,
  Warehouse,
  X,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from '../../App';
import { automationAPI } from '../automation/services/automationAPI';

// ==================== MOCK INTEGRATED DATA ====================
const generateIntegratedData = () => ({
  systemStatus: {
    overall: 'healthy',
    uptime: '99.7%',
    lastUpdate: new Date(),
    modules: {
      orders: { status: 'online', performance: 98.5, alerts: 2 },
      inventory: { status: 'online', performance: 96.2, alerts: 5 },
      staff: { status: 'online', performance: 94.8, alerts: 1 },
      picking: { status: 'online', performance: 97.1, alerts: 3 },
      analytics: { status: 'online', performance: 99.2, alerts: 0 },
      alerts: { status: 'online', performance: 98.9, alerts: 7 },
      automation: { status: 'online', performance: 97.8, alerts: 1 },
    },
    integrations: {
      googleSheets: { status: 'connected', lastSync: '2 minutes ago' },
      shopee: { status: 'connected', lastSync: '30 seconds ago' },
      tiktok: { status: 'connected', lastSync: '1 minute ago' },
      email: { status: 'connected', lastSync: 'real-time' },
      sms: { status: 'warning', lastSync: '5 minutes ago' },
      automation: { status: 'connected', lastSync: '1 minute ago' },
    },
  },

  realTimeMetrics: {
    ordersToday: 289,
    ordersInProgress: 15,
    slaCompliance: 94.8,
    staffActive: 22,
    inventoryAlerts: 5,
    pickingEfficiency: 87.3,
    hourlyThroughput: 126,
    avgProcessingTime: 22.5,
    systemLoad: 67,
    errorRate: 1.2,
  },

  widgets: [
    {
      id: 'orders-overview',
      title: 'Orders Overview',
      type: 'metric-grid',
      size: 'large',
      position: { x: 0, y: 0, w: 6, h: 4 },
      data: {
        metrics: [
          { label: 'Today Orders', value: 289, change: '+12%', color: 'blue' },
          { label: 'In Progress', value: 15, change: '-3%', color: 'orange' },
          {
            label: 'SLA Compliance',
            value: '94.8%',
            change: '+2.1%',
            color: 'green',
          },
          {
            label: 'Avg Process Time',
            value: '22.5m',
            change: '-8%',
            color: 'purple',
          },
        ],
      },
    },
    {
      id: 'live-alerts',
      title: 'Live Alerts',
      type: 'alert-feed',
      size: 'medium',
      position: { x: 6, y: 0, w: 6, h: 4 },
      data: {
        alerts: [
          {
            type: 'critical',
            message: 'VALI-PIS-24 out of stock',
            time: '2m ago',
            module: 'inventory',
          },
          {
            type: 'warning',
            message: '3 staff on unscheduled break',
            time: '5m ago',
            module: 'staff',
          },
          {
            type: 'info',
            message: 'Peak hour efficiency: 98%',
            time: '10m ago',
            module: 'picking',
          },
          {
            type: 'success',
            message: 'Daily backup completed',
            time: '15m ago',
            module: 'system',
          },
        ],
      },
    },
    {
      id: 'performance-chart',
      title: 'Hourly Performance',
      type: 'line-chart',
      size: 'large',
      position: { x: 0, y: 4, w: 8, h: 4 },
      data: {
        series: [
          {
            name: 'Orders',
            data: [45, 52, 38, 64, 72, 68, 89, 95, 78, 82, 76, 69],
          },
          {
            name: 'Efficiency',
            data: [78, 82, 85, 89, 92, 88, 94, 96, 91, 87, 84, 82],
          },
        ],
        categories: [
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
          '14:00',
          '15:00',
          '16:00',
          '17:00',
          '18:00',
        ],
      },
    },
    {
      id: 'staff-status',
      title: 'Staff Status',
      type: 'donut-chart',
      size: 'medium',
      position: { x: 8, y: 4, w: 4, h: 4 },
      data: {
        series: [
          { name: 'Working', value: 18, color: '#10B981' },
          { name: 'Break', value: 3, color: '#F59E0B' },
          { name: 'Absent', value: 2, color: '#EF4444' },
          { name: 'Training', value: 5, color: '#3B82F6' },
        ],
      },
    },
    {
      id: 'inventory-status',
      title: 'Inventory Status',
      type: 'progress-bars',
      size: 'medium',
      position: { x: 0, y: 8, w: 6, h: 3 },
      data: {
        items: [
          { name: 'Zone A Utilization', value: 95, color: 'red' },
          { name: 'Zone B Utilization', value: 78, color: 'yellow' },
          { name: 'Zone C Utilization', value: 65, color: 'green' },
          { name: 'Zone D Utilization', value: 88, color: 'blue' },
        ],
      },
    },
    {
      id: 'top-products',
      title: 'Top Products Today',
      type: 'table',
      size: 'medium',
      position: { x: 6, y: 8, w: 6, h: 3 },
      data: {
        headers: ['Product', 'Orders', 'Revenue'],
        rows: [
          ['Vali Larita 28"', '42', '52.5M'],
          ['Travel Pillow', '38', '7.6M'],
          ['TSA Lock Set', '35', '4.6M'],
          ['Luggage Tag', '28', '2.5M'],
        ],
      },
    },
    {
      id: 'automation-status',
      title: 'Automation Status',
      type: 'automation-widget',
      size: 'medium',
      position: { x: 8, y: 4, w: 4, h: 4 },
      data: {
        status: 'running',
        tasksToday: 145,
        successRate: 97.8,
        currentTask: 'Data Extraction',
        nextRun: '15:30',
      },
    },
  ],

  quickActions: [
    {
      id: 'emergency-stop',
      label: 'Emergency Stop',
      icon: SquareIcon,
      color: 'red',
      critical: true,
    },
    {
      id: 'force-sync',
      label: 'Force Sync All',
      icon: RefreshCw,
      color: 'blue',
    },
    {
      id: 'backup-now',
      label: 'Backup Now',
      icon: Upload,
      color: 'green',
    },
    {
      id: 'maintenance-mode',
      label: 'Maintenance Mode',
      icon: Settings,
      color: 'orange',
    },
    {
      id: 'generate-report',
      label: 'Generate Report',
      icon: FileText,
      color: 'purple',
    },
    {
      id: 'broadcast-message',
      label: 'Broadcast Alert',
      icon: Bell,
      color: 'yellow',
    },
    {
      id: 'automation-start',
      label: 'Start Automation',
      icon: Play,
      color: 'green',
    },
    {
      id: 'automation-stop',
      label: 'Stop Automation',
      icon: Pause,
      color: 'red',
    },
  ],

  integrationStatus: {
    apis: [
      {
        name: 'Shopee API',
        status: 'connected',
        latency: '120ms',
        rate: '45/min',
      },
      {
        name: 'TikTok API',
        status: 'connected',
        latency: '89ms',
        rate: '32/min',
      },
      {
        name: 'Lazada API',
        status: 'warning',
        latency: '340ms',
        rate: '12/min',
      },
      {
        name: 'Google Sheets',
        status: 'connected',
        latency: '67ms',
        rate: '8/min',
      },
      {
        name: 'Automation System',
        status: 'connected',
        latency: '45ms',
        rate: '60/min',
      },
    ],
    webhooks: [
      { name: 'Order Updates', status: 'active', processed: 1247, failed: 3 },
      { name: 'Inventory Sync', status: 'active', processed: 89, failed: 0 },
      {
        name: 'Alert Notifications',
        status: 'active',
        processed: 23,
        failed: 1,
      },
    ],
  },
});

// ==================== MAIN COMPONENT ====================
const IntegrationDashboard = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [data, setData] = useState(generateIntegratedData());
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [quickActionLoading, setQuickActionLoading] = useState(null); // Track which quick action is loading

  // Real-time updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        realTimeMetrics: {
          ...prev.realTimeMetrics,
          ordersToday: prev.realTimeMetrics.ordersToday + Math.floor(Math.random() * 3),
          ordersInProgress: Math.max(
            0,
            prev.realTimeMetrics.ordersInProgress + Math.floor(Math.random() * 5) - 2,
          ),
          slaCompliance: Math.max(
            90,
            Math.min(100, prev.realTimeMetrics.slaCompliance + (Math.random() - 0.5) * 2),
          ),
          systemLoad: Math.max(
            0,
            Math.min(100, prev.realTimeMetrics.systemLoad + (Math.random() - 0.5) * 10),
          ),
        },
        systemStatus: {
          ...prev.systemStatus,
          lastUpdate: new Date(),
        },
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const views = [
    { id: 'dashboard', label: 'Control Center', icon: Grid },
    { id: 'system', label: 'System Status', icon: Monitor },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'automation', label: 'Automation', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const themeClasses = {
    background: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    surface: isDarkMode ? 'bg-gray-800' : 'bg-white',
    surface2: isDarkMode ? 'bg-gray-700' : 'bg-gray-100',
    text: {
      primary: isDarkMode ? 'text-white' : 'text-gray-900',
      secondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
      muted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    },
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
  };

  const handleQuickAction = async (actionId) => {
    console.log(`Executing quick action: ${actionId}`);

    setQuickActionLoading(actionId); // Set loading state

    try {
      switch (actionId) {
        case 'automation-start':
          await automationAPI.start();
          console.log('Automation started successfully');
          // Update integration status
          setData((prev) => ({
            ...prev,
            systemStatus: {
              ...prev.systemStatus,
              integrations: {
                ...prev.systemStatus.integrations,
                automation: { status: 'connected', lastSync: 'just now' },
              },
            },
          }));
          break;

        case 'automation-stop':
          await automationAPI.stop();
          console.log('Automation stopped successfully');
          // Update integration status
          setData((prev) => ({
            ...prev,
            systemStatus: {
              ...prev.systemStatus,
              integrations: {
                ...prev.systemStatus.integrations,
                automation: { status: 'warning', lastSync: 'stopped' },
              },
            },
          }));
          break;

        case 'force-sync':
          // Force sync all integrations including automation
          await automationAPI.getStatus();
          console.log('Force sync completed');
          break;

        default:
          console.log(`Action ${actionId} not implemented yet`);
      }
    } catch (error) {
      console.error(`Error executing action ${actionId}:`, error);
    } finally {
      setQuickActionLoading(null); // Reset loading state
    }
  };

  return (
    <div
      className={`h-full transition-colors duration-200 ${themeClasses.background} ${themeClasses.text.primary}`}
    >
      {/* Header */}
      <div className={`${themeClasses.surface} border-b ${themeClasses.border} p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
              <Command size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">MIA Warehouse Control Center</h1>
              <p className={`${themeClasses.text.muted}`}>
                Integration Dashboard • 01/06/2025 15:00 • System Status:
                <span className="text-green-500 ml-1 font-medium">Healthy</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* System health indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live</span>
            </div>

            {/* Auto refresh toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                autoRefresh
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {autoRefresh ? <Play size={16} /> : <Pause size={16} />}
              <span className="text-sm font-medium">Auto Refresh</span>
            </button>

            {/* Edit mode toggle */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-3 py-2 rounded-lg transition-colors ${
                isEditMode
                  ? 'bg-blue-600 text-white'
                  : `${themeClasses.surface2} ${themeClasses.text.secondary}`
              }`}
            >
              <Edit size={16} />
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${themeClasses.surface2} hover:opacity-80 transition-colors`}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Settings */}
            <button
              className={`p-2 rounded-lg ${themeClasses.surface2} hover:opacity-80 transition-colors`}
            >
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex space-x-2 mt-4 overflow-x-auto">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeView === view.id
                  ? 'bg-indigo-600 text-white'
                  : `${themeClasses.surface2} ${themeClasses.text.secondary} hover:${themeClasses.text.primary}`
              }`}
            >
              <view.icon size={16} />
              <span>{view.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-6">
        {activeView === 'dashboard' && (
          <DashboardView
            data={data}
            themeClasses={themeClasses}
            isEditMode={isEditMode}
            onQuickAction={handleQuickAction}
            quickActionLoading={quickActionLoading}
          />
        )}
        {activeView === 'system' && (
          <SystemStatusView data={data.systemStatus} themeClasses={themeClasses} />
        )}
        {activeView === 'integrations' && (
          <IntegrationsView data={data.integrationStatus} themeClasses={themeClasses} />
        )}
        {activeView === 'automation' && <AutomationView themeClasses={themeClasses} />}
        {activeView === 'settings' && <SettingsView themeClasses={themeClasses} />}
      </div>
    </div>
  );
};

// ==================== DASHBOARD VIEW ====================
const DashboardView = ({ data, themeClasses, isEditMode, onQuickAction, quickActionLoading }) => {
  return (
    <div className="space-y-6">
      {/* Quick actions - Optimized for desktop */}
      <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Thao tác nhanh</h3>
          <span className="text-sm text-gray-500">Nhấp để thực hiện</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {data.quickActions.map((action) => {
            const isLoading = quickActionLoading === action.id;
            return (
              <button
                key={action.id}
                onClick={() => onQuickAction(action.id)}
                disabled={isLoading}
                className={`flex flex-col items-center space-y-3 p-4 rounded-xl border-2 border-dashed transition-all ${
                  isLoading
                    ? 'animate-pulse border-blue-400 bg-blue-50 dark:bg-blue-900/20 cursor-not-allowed'
                    : action.critical
                    ? 'border-red-300 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-red-200 hover:shadow-lg hover:scale-105'
                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-blue-200 hover:shadow-lg hover:scale-105'
                }`}
              >
                <div
                  className={`p-3 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/30`}
                >
                  {isLoading ? (
                    <Loader2
                      size={24}
                      className={`text-${action.color}-600 dark:text-${action.color}-400 animate-spin`}
                    />
                  ) : (
                    <action.icon
                      size={24}
                      className={`text-${action.color}-600 dark:text-${action.color}-400`}
                    />
                  )}
                </div>
                <span className="text-sm font-medium text-center leading-tight">
                  {isLoading ? 'Đang xử lý...' : action.label}
                </span>
                {action.critical && (
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Object.entries(data.realTimeMetrics)
          .slice(0, 10)
          .map(([key, value]) => (
            <MetricCard
              key={key}
              label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              value={value}
              themeClasses={themeClasses}
              isLive={true}
            />
          ))}
      </div>

      {/* Widget grid - Optimized for desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Column 1 - Main metrics and charts */}
        <div className="xl:col-span-2 space-y-6">
          {data.widgets
            .filter((w) => ['orders-overview', 'performance-chart'].includes(w.id))
            .map((widget) => (
              <div
                key={widget.id}
                className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6 hover:shadow-md transition-shadow`}
              >
                <WidgetRenderer
                  widget={widget}
                  themeClasses={themeClasses}
                  isEditMode={isEditMode}
                />
              </div>
            ))}

          {/* Inventory status row */}
          <div
            className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6 hover:shadow-md transition-shadow`}
          >
            <WidgetRenderer
              widget={data.widgets.find((w) => w.id === 'inventory-status')}
              themeClasses={themeClasses}
              isEditMode={isEditMode}
            />
          </div>
        </div>

        {/* Column 2 - Side panels */}
        <div className="space-y-6">
          {data.widgets
            .filter((w) =>
              ['live-alerts', 'staff-status', 'top-products', 'automation-status'].includes(w.id),
            )
            .map((widget) => (
              <div
                key={widget.id}
                className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6 hover:shadow-md transition-shadow`}
              >
                <h3 className="text-lg font-semibold mb-4">{widget.title}</h3>
                <WidgetRenderer
                  widget={widget}
                  themeClasses={themeClasses}
                  isEditMode={isEditMode}
                />
              </div>
            ))}
        </div>
      </div>

      {/* Module status overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(data.systemStatus.modules).map(([module, status]) => (
          <ModuleStatusCard
            key={module}
            module={module}
            status={status}
            themeClasses={themeClasses}
          />
        ))}
      </div>
    </div>
  );
};

// ==================== METRIC CARD ====================
const MetricCard = ({ label, value, themeClasses, isLive }) => {
  const getValueColor = (label, value) => {
    if (label.toLowerCase().includes('sla')) {
      return value >= 95 ? 'text-green-600' : value >= 90 ? 'text-yellow-600' : 'text-red-600';
    }
    if (label.toLowerCase().includes('error')) {
      return value <= 2 ? 'text-green-600' : value <= 5 ? 'text-yellow-600' : 'text-red-600';
    }
    return 'text-blue-600';
  };

  return (
    <div
      className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-5 hover:shadow-lg transition-all duration-200 hover:scale-105`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className={`text-sm font-medium ${themeClasses.text.muted}`}>{label}</p>
        {isLive && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-500 font-medium">LIVE</span>
          </div>
        )}
      </div>
      <p className={`text-2xl font-bold ${getValueColor(label, value)}`}>
        {typeof value === 'number'
          ? value > 1000
            ? `${(value / 1000).toFixed(1)}K`
            : value % 1 !== 0
            ? value.toFixed(1)
            : value
          : value}
      </p>
      {/* Progress bar for percentage values */}
      {((typeof value === 'string' && value.includes('%')) ||
        label.toLowerCase().includes('compliance')) && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                parseFloat(value) >= 95
                  ? 'bg-green-500'
                  : parseFloat(value) >= 90
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(parseFloat(value) || 0, 100)}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== WIDGET RENDERER ====================
const WidgetRenderer = ({ widget, themeClasses, isEditMode }) => {
  const renderWidget = () => {
    switch (widget.type) {
      case 'metric-grid':
        return (
          <div className="grid grid-cols-2 gap-4">
            {widget.data.metrics.map((metric, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg bg-${metric.color}-50 dark:bg-${metric.color}-900/20`}
              >
                <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                <p className="text-xl font-bold text-gray-600 dark:text-gray-400">{metric.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{metric.change}</p>
              </div>
            ))}
          </div>
        );

      case 'alert-feed':
        return (
          <ul className="space-y-2">
            {widget.data.alerts.map((alert, index) => (
              <li key={index} className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-900/20`}>
                <p className="text-sm text-gray-600 dark:text-gray-400">{alert.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{alert.time}</p>
              </li>
            ))}
          </ul>
        );

      case 'line-chart':
        return (
          <div className="h-64">
            {/* Placeholder for chart rendering */}
            <p>Chart rendering logic goes here</p>
          </div>
        );

      case 'donut-chart':
        return (
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              {/* Simplified donut chart representation */}
              <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {widget.data.series.reduce((sum, item) => sum + item.value, 0)}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              {widget.data.series.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'progress-bars':
        return (
          <div className="space-y-3">
            {widget.data.items.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm">{item.value}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-${item.color}-500`}
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  {widget.data.headers.map((header, index) => (
                    <th key={index} className="text-left py-2 px-3 text-sm font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {widget.data.rows.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="py-2 px-3 text-sm">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'automation-widget':
        return (
          <div className="space-y-4">
            {/* Status indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    widget.data.status === 'running' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`}
                ></div>
                <span className="font-medium capitalize">{widget.data.status}</span>
              </div>
              <Activity size={20} className="text-blue-500" />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{widget.data.tasksToday}</div>
                <div className="text-xs text-gray-600">Tasks Today</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-lg font-bold text-green-600">{widget.data.successRate}%</div>
                <div className="text-xs text-gray-600">Success Rate</div>
              </div>
            </div>

            {/* Current task */}
            <div className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Current Task</div>
              <div className="font-medium">{widget.data.currentTask}</div>
            </div>

            {/* Next run */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Next Run:</span>
              <span className="font-medium">{widget.data.nextRun}</span>
            </div>
          </div>
        );

      default:
        return <div className="text-center text-gray-500">Unknown widget type</div>;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{widget.title}</h3>
        {isEditMode && (
          <div className="flex space-x-2">
            <button className="p-1 text-gray-500 hover:text-gray-700">
              <Edit size={14} />
            </button>
            <button className="p-1 text-gray-500 hover:text-gray-700">
              <X size={14} />
            </button>
          </div>
        )}
      </div>
      {renderWidget()}
    </div>
  );
};

// ==================== MODULE STATUS CARD ====================
const ModuleStatusCard = ({ module, status, themeClasses }) => {
  const getModuleIcon = (module) => {
    const icons = {
      orders: Package,
      inventory: Warehouse,
      staff: Users,
      picking: Navigation,
      analytics: BarChart3,
      alerts: Bell,
    };
    return icons[module] || Activity;
  };

  const ModuleIcon = getModuleIcon(module);

  return (
    <div
      className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-4 hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded-lg ${
              status.status === 'online'
                ? 'bg-green-100 dark:bg-green-900/30'
                : 'bg-red-100 dark:bg-red-900/30'
            }`}
          >
            <ModuleIcon
              size={20}
              className={`${status.status === 'online' ? 'text-green-600' : 'text-red-600'}`}
            />
          </div>
          <span className="font-medium capitalize">{module}</span>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            status.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {status.status}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className={themeClasses.text.muted}>Performance:</span>
          <span className="font-medium">{status.performance}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              status.performance >= 95
                ? 'bg-green-500'
                : status.performance >= 85
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${status.performance}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm">
          <span className={themeClasses.text.muted}>Active Alerts:</span>
          <span className={`font-medium ${status.alerts > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {status.alerts}
          </span>
        </div>
      </div>
    </div>
  );
};

// ==================== SYSTEM STATUS VIEW ====================
const SystemStatusView = ({ data, themeClasses }) => {
  return (
    <div className="space-y-6">
      {/* Overall status */}
      <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
        <h3 className="text-lg font-semibold mb-4">System Health Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h4 className="font-semibold text-green-600">HEALTHY</h4>
            <p className="text-sm text-gray-500 mt-1">All systems operational</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Activity size={32} className="text-blue-600" />
            </div>
            <h4 className="font-semibold text-blue-600">UPTIME</h4>
            <p className="text-sm text-gray-500 mt-1">{data.uptime}</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <RefreshCw size={32} className="text-purple-600" />
            </div>
            <h4 className="font-semibold text-purple-600">LAST UPDATE</h4>
            <p className="text-sm text-gray-500 mt-1">{data.lastUpdate.toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      {/* Module details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(data.modules).map(([module, status]) => (
          <ModuleStatusCard
            key={module}
            module={module}
            status={status}
            themeClasses={themeClasses}
          />
        ))}
      </div>

      {/* Integration status */}
      <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
        <h3 className="text-lg font-semibold mb-4">External Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data.integrations).map(([integration, status]) => (
            <div
              key={integration}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    status.status === 'connected' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                ></div>
                <span className="font-medium capitalize">{integration}</span>
              </div>
              <span className="text-sm text-gray-500">{status.lastSync}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==================== INTEGRATIONS VIEW ====================
const IntegrationsView = ({ data, themeClasses }) => {
  return (
    <div className="space-y-6">
      {/* API connections */}
      <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
        <h3 className="text-lg font-semibold mb-4">API Connections</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4">Service</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Latency</th>
                <th className="text-left py-3 px-4">Rate</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.apis.map((api, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4 font-medium">{api.name}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        api.status === 'connected'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {api.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{api.latency}</td>
                  <td className="py-3 px-4">{api.rate}</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm">
                      Test Connection
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Webhooks */}
      <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
        <h3 className="text-lg font-semibold mb-4">Webhook Status</h3>
        <div className="space-y-3">
          {data.webhooks.map((webhook, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <h4 className="font-medium">{webhook.name}</h4>
                <p className="text-sm text-gray-500">
                  Processed: {webhook.processed} • Failed: {webhook.failed}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    webhook.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {webhook.status}
                </span>
                <button className="text-blue-600 hover:text-blue-700 text-sm">Configure</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==================== SETTINGS VIEW ====================
const SettingsView = ({ themeClasses }) => {
  return (
    <div className="space-y-6">
      <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
        <h3 className="text-lg font-semibold mb-4">Dashboard Configuration</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Auto Refresh</h4>
              <p className="text-sm text-gray-500">Automatically refresh data every 5 seconds</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Dark Mode</h4>
              <p className="text-sm text-gray-500">Switch to dark theme</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Sound Notifications</h4>
              <p className="text-sm text-gray-500">Play sound for critical alerts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
        <h3 className="text-lg font-semibold mb-4">System Maintenance</h3>
        <div className="space-y-3">
          <button className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <h4 className="font-medium text-blue-700 dark:text-blue-400">Backup System Data</h4>
            <p className="text-sm text-blue-600 dark:text-blue-300">Create a full system backup</p>
          </button>

          <button className="w-full text-left p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            <h4 className="font-medium text-green-700 dark:text-green-400">
              Force Sync All Modules
            </h4>
            <p className="text-sm text-green-600 dark:text-green-300">
              Synchronize all module data
            </p>
          </button>

          <button className="w-full text-left p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
            <h4 className="font-medium text-yellow-700 dark:text-yellow-400">
              System Health Check
            </h4>
            <p className="text-sm text-yellow-600 dark:text-yellow-300">
              Run comprehensive system diagnostics
            </p>
          </button>

          <button className="w-full text-left p-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
            <h4 className="font-medium text-red-700 dark:text-red-400">Restart All Services</h4>
            <p className="text-sm text-red-600 dark:text-red-300">
              ⚠️ This will cause temporary downtime
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== AUTOMATION VIEW ====================
const AutomationView = ({ themeClasses }) => {
  const [automationStatus, setAutomationStatus] = useState({
    isRunning: false,
    lastRun: null,
    totalRuns: 0,
    successRate: 0,
    currentTask: null,
  });

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Load automation status
    loadAutomationStatus();
    loadAutomationLogs();
  }, []);

  const loadAutomationStatus = async () => {
    try {
      const status = await automationAPI.getStatus();
      setAutomationStatus(status);
    } catch (error) {
      console.error('Error loading automation status:', error);
    }
  };

  const loadAutomationLogs = async () => {
    try {
      const logsData = await automationAPI.getLogs();
      setLogs(logsData.slice(0, 10)); // Show last 10 logs
    } catch (error) {
      console.error('Error loading automation logs:', error);
    }
  };

  const handleStartAutomation = async () => {
    try {
      await automationAPI.start();
      await loadAutomationStatus();
    } catch (error) {
      console.error('Error starting automation:', error);
    }
  };

  const handleStopAutomation = async () => {
    try {
      await automationAPI.stop();
      await loadAutomationStatus();
    } catch (error) {
      console.error('Error stopping automation:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Automation Control Panel */}
      <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Automation Control</h3>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                automationStatus.isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`}
            ></div>
            <span className="text-sm font-medium">
              {automationStatus.isRunning ? 'Running' : 'Stopped'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{automationStatus.totalRuns}</div>
            <div className="text-sm text-gray-500">Total Runs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{automationStatus.successRate}%</div>
            <div className="text-sm text-gray-500">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {automationStatus.lastRun
                ? new Date(automationStatus.lastRun).toLocaleTimeString()
                : 'Never'}
            </div>
            <div className="text-sm text-gray-500">Last Run</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {automationStatus.currentTask || 'Idle'}
            </div>
            <div className="text-sm text-gray-500">Current Task</div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleStartAutomation}
            disabled={automationStatus.isRunning}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              automationStatus.isRunning
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed animate-pulse'
                : 'bg-green-100 text-green-700 hover:bg-green-200 shadow-md hover:shadow-lg'
            }`}
          >
            {automationStatus.isRunning ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Đang chạy...</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>Start Automation</span>
              </>
            )}
          </button>

          <button
            onClick={handleStopAutomation}
            disabled={!automationStatus.isRunning}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              !automationStatus.isRunning
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            <Pause size={16} />
            <span>Stop Automation</span>
          </button>

          <button
            onClick={loadAutomationStatus}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Recent Automation Logs */}
      <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Automation Logs</h3>
          <button
            onClick={loadAutomationLogs}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Refresh Logs
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No automation logs available</div>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  log.level === 'error'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : log.level === 'warning'
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-green-500 bg-green-50 dark:bg-green-900/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{log.message}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                {log.details && <div className="text-xs text-gray-600 mt-1">{log.details}</div>}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Automation Configuration Quick Access */}
      <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
        <h3 className="text-lg font-semibold mb-4">Quick Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/automation/config"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <Settings size={32} className="mx-auto mb-2 text-gray-600" />
            <div className="font-medium">Settings</div>
            <div className="text-sm text-gray-500">Configure automation parameters</div>
          </a>

          <a
            href="/automation/logs"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <FileText size={32} className="mx-auto mb-2 text-gray-600" />
            <div className="font-medium">Full Logs</div>
            <div className="text-sm text-gray-500">View detailed logs</div>
          </a>

          <a
            href="/automation"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <Monitor size={32} className="mx-auto mb-2 text-gray-600" />
            <div className="font-medium">Dashboard</div>
            <div className="text-sm text-gray-500">Full automation dashboard</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default IntegrationDashboard;
