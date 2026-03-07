# 📋 Luồng & Cấu trúc vận hành - MIA Warehouse Management

> Tài liệu tóm tắt luồng chạy và cấu trúc dự án. Cập nhật: 2025-03-07

---

## 1. Luồng khởi động

```
index.js
  └── import App
  └── import miaDesignSystem.css, tailwind.css
  └── ReactDOM.createRoot().render(<App />)
        └── App (App.js)
```

---

## 2. Cấu trúc Provider (App.js)

Thứ tự bao bọc từ ngoài vào trong:

```
ErrorBoundary
  └── Router (React Router v6)
        └── ThemeProvider          # Dark/light mode, themeClasses
              └── AuthProvider     # user, login, logout, isAuthenticated
                    └── NotificationProvider
                          └── AppStateProvider  # notifications, systemStatus, connectionStatus
                                └── MetricsProvider
                                      └── WebSocketProvider
                                            └── NotificationContainer + NetworkStatus
                                            └── <Routes>
```

**Exports từ App.js:**

- `useTheme()` – theme, isDarkMode, toggleTheme
- `useAuth()` – user, login, logout, isAuthenticated, isLoading
- `useAppState()` – notifications, addNotification, systemStatus, connectionStatus

---

## 3. Luồng Authentication

### Đăng nhập (Login page)

1. User nhập username/password → `Login.js`
2. `verifyCredentials()` từ `unifiedGoogleSheetsService` – đọc sheet **Users** qua Google Sheets API
3. Nếu thành công:
   - `localStorage.setItem('currentUser', ...)` + `sessionStorage.setItem('authToken', ...)`
   - `window.dispatchEvent(new StorageEvent('storage', { key: 'currentUser', ... }))`
4. `AuthProvider` lắng nghe storage → `checkAuthStatus()` → set `user`, `isAuthenticated`
5. Redirect tới `/dashboard`

### Protected Routes

- `ProtectedRoute` dùng `useAuth().isAuthenticated`
- Chưa đăng nhập → `<Navigate to="/login" />`
- Đã đăng nhập → render `children` (MainLayout)

### Đăng xuất

- Header gọi `logout()` từ `useAuth`
- Xóa localStorage/sessionStorage (mia-warehouse-token, currentUser, authToken, ...)
- Ghi audit log qua `logAuditEvent` (unifiedGoogleSheetsService / webhook)

---

## 4. Luồng Routing

### Public

- `/login` → `LoginPage` (lazy)

### Protected (bên trong MainLayout)

- `/` → redirect `/dashboard`
- `/dashboard` → `DashboardModule` (Integration Dashboard)
- `/orders/*` → OrdersModule
- `/picking/*` → PickingModule
- `/warehouse-map/*` → WarehouseMapModule
- `/staff/*` → StaffModule
- `/inventory/*` → InventoryModule
- `/shippingsla/*` → ShippingSLAModule
- `/analytics/*` → AnalyticsModule (có ModuleErrorBoundary)
- `/alerts/*` → AlertsModule
- `/automation/*` → AutomationModule
- `/users` → UserManagementPage
- `/profile` → UserProfilePage
- `/settings` → SettingsPage
- `/google-sheets-data` → GoogleSheetsDataViewer
- `/enhanced-profile` → EnhancedUserProfile
- `/transport/*` → TransportModule (Kho bãi & Vận chuyển - So sánh SLA NVC)
- `*` → redirect `/dashboard`

---

## 5. Layout structure

### MainLayout (`src/components/MainLayout.js`)

```
MainLayout
  ├── Sidebar (layout/Sidebar)
  │     └── menuItems: main, management, logistics, analytics, system
  │     └── onNavigate → navigate(path) + setSidebarOpen(false)
  │
  ├── Header (layout/Header)
  │     └── title, search, sync status, notifications, user menu, theme toggle
  │     └── useAuth(), useTheme(), useNotification()
  │
  └── <main>
        └── <Outlet />  ← Nội dung module render tại đây
```

### Sidebar đang dùng

- **File:** `src/components/layout/Sidebar/index.js`
- **Import:** `MainLayout` import từ `./layout/Sidebar` (không phải `src/components/Sidebar.js`)

### Các Sidebar khác (không dùng trong MainLayout)

- `src/components/Sidebar.js` – Sidebar cũ (dùng NavLink, có thêm menu Users, Google Sheets Data)
- `SharedComponentsApp.js` – có export Sidebar (có thể trùng logic)
- `WarehouseSidebar` – chỉ dùng trong module warehouse-map

---

## 6. Data flow

### Google Sheets

- **Service:** `unifiedGoogleSheetsService.js`
- **Config:** `REACT_APP_GOOGLE_SHEETS_API_KEY`, `REACT_APP_GOOGLE_SHEETS_ID`
- **Sheets:** Users, AuditLog, Permissions, Sessions
- **Đọc:** Google Sheets API v4
- **Ghi (audit, profile):** Webhook Apps Script (`REACT_APP_AUDIT_WEBHOOK_URL`, `REACT_APP_PROFILE_UPDATE_WEBHOOK_URL`)

### Modules dùng data

- Orders, Picking, Analytics, Alerts: có service/hook riêng, có thể dùng Google Sheets hoặc mock
- Dashboard: `generateIntegratedData()` mock + `automationAPI` cho tích hợp
- User profile: `googleAppsScriptService` (webhook) hoặc fallback localStorage

---

## 7. Cấu trúc thư mục chính

```
src/
├── index.js              # Entry point
├── App.js                # Router, Providers, lazy modules
├── components/
│   ├── MainLayout.js     # Sidebar + Header + Outlet
│   ├── layout/
│   │   ├── Sidebar/      # Sidebar đang dùng
│   │   └── Header/
│   └── Sidebar.js        # Legacy (không dùng trong MainLayout)
├── pages/
│   ├── Login.js
│   ├── UserManagement.js
│   ├── UserProfile.js
│   ├── Settings.js
│   └── ...
├── modules/
│   ├── dashboard/        # Integration Dashboard
│   ├── orders/
│   ├── picking/
│   ├── alerts/
│   ├── analytics/
│   ├── inventory/
│   ├── staff/
│   ├── warehouse-map/
│   ├── shippingsla/
│   └── automation/
├── services/
│   ├── unifiedGoogleSheetsService.js
│   ├── googleSheetsAuth.js
│   ├── googleAppsScriptService.js
│   └── ...
├── shared/
│   ├── constants/        # theme, designSystem
│   ├── hooks/            # useNotification, useTheme
│   └── styles/           # miaDesignSystem.css
└── utils/
```

---

## 8. Checklist khi thêm module mới

1. Tạo module trong `src/modules/<tên-module>/` (có `index.js` export default)
2. Thêm lazy import trong `App.js`
3. Thêm `<Route path="tên-path/*" element={<Suspense><ModuleName /></Suspense>} />`
4. Thêm item vào `menuItems` trong `src/components/layout/Sidebar/index.js`

---

## 9. Environment Variables cần thiết

| Biến | Mô tả |
|------|-------|
| `REACT_APP_GOOGLE_SHEETS_API_KEY` | API key Google Cloud |
| `REACT_APP_GOOGLE_SHEETS_ID` | ID Google Sheet chính |
| `REACT_APP_AUDIT_WEBHOOK_URL` | Webhook Apps Script cho audit log |
| `REACT_APP_PROFILE_UPDATE_WEBHOOK_URL` | Webhook Apps Script cho cập nhật profile |

---

## 10. Scripts chạy

```bash
npm start          # react-scripts start (CRA)
npm run build      # Production build
./deploy.sh        # Build → commit (nếu có thay đổi) → push → vercel
vercel --prod      # Deploy Vercel trực tiếp
```

---

**📌 Lưu ý:** File này mô tả luồng **hiện tại**. Khi thay đổi cấu trúc (Layout, Sidebar, Auth, routing), nên cập nhật lại doc.
