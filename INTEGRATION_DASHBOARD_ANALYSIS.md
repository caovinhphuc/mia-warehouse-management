# 📊 Integration Dashboard - Phân tích & Đề xuất

> Phân tích chi tiết module Integration Dashboard (MIA Warehouse Control Center). Cập nhật: 2025-03-07

---

## 1. Tổng quan

**Mục đích:** Bảng điều khiển tổng hợp (Control Center) cho hệ thống kho MIA, hiển thị trạng thái hệ thống, tích hợp, automation và cho phép thao tác nhanh.

**Route:** `/dashboard`  
**Entry point:** `src/modules/dashboard/index.js`  
**Main component:** `IntegrationDashboard`

---

## 2. Chức năng hiện có

### 2.1 Các view (5 tab)

| View | ID | Mô tả | Dữ liệu |
|------|-----|-------|---------|
| Control Center | `dashboard` | Dashboard chính, widgets, quick actions | Mock + real-time simulation |
| System Status | `system` | Sức khỏe hệ thống, modules, integrations | Mock |
| Integrations | `integrations` | API connections, webhooks | Mock |
| Automation | `automation` | Điều khiển automation, logs | **Real** (automationAPI) |
| Settings | `settings` | Cấu hình dashboard | Mock (UI only) |

### 2.2 Quick Actions

| Action | Implemented | Ghi chú |
|--------|-------------|---------|
| Emergency Stop | ❌ | Chưa logic |
| Force Sync All | ✅ | Gọi `automationAPI.getStatus()` |
| Backup Now | ❌ | Chưa logic |
| Maintenance Mode | ❌ | Chưa logic |
| Generate Report | ❌ | Chưa logic |
| Broadcast Alert | ❌ | Chưa logic |
| Start Automation | ✅ | `automationAPI.start()` |
| Stop Automation | ✅ | `automationAPI.stop()` |

### 2.3 Widget types

| Type | Renderer | Trạng thái |
|------|----------|------------|
| metric-grid | 4 metrics (Orders, SLA, …) | ✅ Có data |
| alert-feed | Danh sách alerts | ✅ Mock |
| line-chart | Biểu đồ theo giờ | ⚠️ Placeholder ("Chart rendering logic goes here") |
| donut-chart | Phân bố Staff | ⚠️ Simplified (vòng tròn đơn giản) |
| progress-bars | Zone utilization | ✅ |
| table | Top products | ✅ |
| automation-widget | Trạng thái automation | ✅ Mock (data static) |

### 2.4 Tính năng phụ

- **Auto Refresh:** Bật/tắt, refresh mỗi 5s khi bật (cập nhật số random cho realTimeMetrics)
- **Edit Mode:** Toggle có UI (nút Edit) nhưng **chưa có logic** kéo thả, sắp xếp widget
- **Theme:** Dark/Light mode (dùng `useTheme` từ App)
- **Loading state:** Quick actions có `Loader2` spin khi đang xử lý

---

## 3. Luồng xử lý (Data Flow)

```
┌─────────────────────────────────────────────────────────────────┐
│ IntegrationDashboard                                             │
├─────────────────────────────────────────────────────────────────┤
│ 1. Khởi tạo                                                      │
│    • useState(generateIntegratedData())  ← Mock data             │
│    • activeView, isEditMode, autoRefresh, quickActionLoading     │
│                                                                  │
│ 2. Auto Refresh (useEffect, 5s)                                  │
│    • Cập nhật realTimeMetrics với số random                      │
│    • Cập nhật systemStatus.lastUpdate                            │
│                                                                  │
│ 3. handleQuickAction(actionId)                                   │
│    • automation-start  → automationAPI.start() → setData         │
│    • automation-stop   → automationAPI.stop()  → setData         │
│    • force-sync        → automationAPI.getStatus()               │
│    • Các action khác   → logger.info("not implemented")          │
│                                                                  │
│ 4. Render theo activeView                                        │
│    • dashboard   → DashboardView                                 │
│    • system      → SystemStatusView                              │
│    • integrations→ IntegrationsView                              │
│    • automation  → AutomationView (fetch automationAPI.getStatus)│
│    • settings    → SettingsView                                  │
└─────────────────────────────────────────────────────────────────┘

Nguồn dữ liệu:
- Mock: generateIntegratedData() - static + mô phỏng real-time
- Real: automationAPI (localhost:8000) - status, start, stop, logs
```

---

## 4. Phân tích UI

### 4.1 Layout

- **Header:** Logo, tiêu đề, Live indicator, Auto Refresh toggle, Edit, Theme, Settings
- **Navigation:** 5 tab dạng button
- **Content:** Thay đổi theo tab
- **Grid Dashboard:** 2 cột (main 2/3 + sidebar 1/3), responsive

### 4.2 Components con

- `MetricCard` – hiển thị số + progress bar (cho SLA)
- `ModuleStatusCard` – module status, performance, alerts
- `WidgetRenderer` – switch theo widget.type
- `SystemStatusView`, `IntegrationsView`, `AutomationView`, `SettingsView`

### 4.3 Điểm mạnh

- Layout rõ ràng, chia cột hợp lý
- Dark mode nhất quán
- Trạng thái loading cho quick actions
- Responsive (grid cols 2/4/5, xl breakpoints)

### 4.4 Hạn chế

- Line chart chưa render (placeholder)
- Donut chart dạng đơn giản (không dùng Chart.js)
- Edit mode không có logic drag-drop
- Settings checkboxes không gắn với state (defaultChecked, không onChange)

---

## 5. Phân tích UX

### 5.1 Điểm tốt

- Tab navigation trực quan
- Auto Refresh có thể tắt (tránh gây phiền)
- Quick actions có feedback (loading)
- Emergency Stop nổi bật (border đỏ, critical)

### 5.2 Hạn chế

- **Không có breadcrumb** – khó biết đang ở view nào nếu deep vào
- **Timestamp cứng** – "01/06/2025 15:00" trong header
- **Test Connection / Configure** – nút có nhưng không xử lý
- **Không có empty state** – khi không có logs/alerts
- **Refresh 5s** – có thể gây nhấp nháy, không cần thiết cho một số metric
- **Lỗi automationAPI** – khi backend không chạy, không có thông báo rõ ràng

---

## 6. Đánh giá tổng quan

| Tiêu chí | Điểm | Ghi chú |
|----------|------|---------|
| Chức năng cốt lõi | 6/10 | Mock nhiều, ít kết nối data thật |
| UI/UX | 7/10 | Layout ổn, thiếu feedback, placeholder |
| Code structure | 7/10 | File lớn (~1450 dòng), có thể tách component |
| Tích hợp thật | 4/10 | Chỉ automationAPI, dễ lỗi khi backend tắt |
| Responsive | 7/10 | Có breakpoints |
| Accessibility | 5/10 | Thiếu aria, keyboard nav |

---

## 7. Đề xuất bổ sung

### 7.1 Dữ liệu thật

- [ ] Kết nối **Google Sheets** / API để lấy metric thật (orders, SLA, inventory)
- [ ] Kết nối **Orders module**, **Alerts module** để hiển thị live alerts
- [ ] WebSocket/SSE cho real-time thay vì poll 5s

### 7.2 Quick actions

- [ ] **Emergency Stop** – logic dừng các tiến trình quan trọng
- [ ] **Force Sync** – gọi API sync Google Sheets / từng module
- [ ] **Backup Now** – export/backup dữ liệu
- [ ] **Generate Report** – xuất PDF/Excel báo cáo
- [ ] **Broadcast Alert** – gửi thông báo đến staff/người dùng

### 7.3 Charts

- [ ] Dùng **Chart.js** (đã có trong project) cho line-chart, donut-chart
- [ ] Thêm trend sparkline cho metric cards
- [ ] Thêm date range picker cho biểu đồ

### 7.4 Integrations view

- [ ] **Test Connection** – gọi API test từng service
- [ ] **Configure** webhook – modal/form cấu hình
- [ ] Hiển thị latency/rate thật từ health check

---

## 8. Đề xuất cải thiện

### 8.1 Code structure

- Tách `DashboardView`, `SystemStatusView`, `IntegrationsView`, `AutomationView`, `SettingsView` ra file riêng
- Tách `WidgetRenderer`, `MetricCard`, `ModuleStatusCard` vào `components/`
- Tách `generateIntegratedData` và config vào `data/` hoặc `config/`

### 8.2 State management

- Settings: dùng `useState` cho Auto Refresh, Dark Mode, Sound
- Cân nhắc `useContext` hoặc store nhẹ nếu nhiều view dùng chung settings

### 8.3 Error handling

- Bọc `automationAPI` calls trong try/catch và hiển thị toast/alert
- Fallback UI khi automation backend không chạy
- Retry với exponential backoff cho API lỗi

### 8.4 Performance

- Tránh re-render toàn bộ: memo cho `MetricCard`, `ModuleStatusCard`
- `useMemo` cho filtered widgets
- Giảm tần suất auto-refresh hoặc cho user chọn (5s / 30s / 1min)

### 8.5 UX

- Cập nhật timestamp header theo `data.systemStatus.lastUpdate`
- Thêm skeleton loading khi fetch automation status
- Empty state cho logs, alerts
- Confirm dialog cho Emergency Stop, Restart Services

---

## 9. Đề xuất nâng cấp

### 9.1 Customizable dashboard

- Drag-and-drop sắp xếp widgets (react-grid-layout)
- Thêm/xóa widget
- Lưu layout vào localStorage hoặc backend

### 9.2 Alert system

- Kết nối với module Alerts
- Sound/desktop notification cho critical
- Cấu hình threshold (SLA < 90% → alert)

### 9.3 Role-based

- Ẩn/hiện quick actions theo role (e.g. Emergency Stop chỉ admin)
- Giới hạn view theo permission

### 9.4 Export & reports

- Export dashboard dạng PDF
- Schedule report (daily/weekly email)
- Deep link đến module tương ứng (click Orders metric → /orders)

### 9.5 Mobile

- Bottom tab thay vì horizontal tabs
- Swipe giữa các view
- Widget dạng card có thể collapse

---

## 10. Ưu tiên thực hiện (80/20)

| Ưu tiên | Task | Effort | Impact |
|---------|------|--------|--------|
| P0 | Line chart render với Chart.js | Thấp | Cao |
| P0 | Error handling + fallback cho automationAPI | Thấp | Cao |
| P1 | Settings gắn state (Auto Refresh, Sound) | Thấp | Trung bình |
| P1 | Timestamp động trong header | Thấp | Trung bình |
| P2 | Kết nối data thật (Orders, Alerts) | Cao | Cao |
| P2 | Implement các quick actions còn lại | Trung bình | Trung bình |
| P3 | Tách components, refactor | Trung bình | Trung bình |
| P3 | Drag-drop widget layout | Cao | Trung bình |

---

## 11. File tham chiếu

```
src/modules/dashboard/
├── index.js              # Main (~1454 dòng)
├── DashboardOptimized.js # Alternative (nếu có)
└── components/
    ├── WidgetRenderer.js
    └── SystemStatus.js

src/modules/automation/services/automationAPI.js  # API integration
```

---

**Cập nhật:** 2025-03-07
