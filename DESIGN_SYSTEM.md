# Design System - MIA Warehouse Management

> Tài liệu hướng dẫn theme, tokens và component styling. Cập nhật: 2025-03-07

---

## 1. Tổng quan kiến trúc

```
┌─────────────────────────────────────────────────────────────────┐
│ App.js (ThemeProvider)                                            │
│   └── useTheme() → isDarkMode, toggleTheme, themeClasses          │
├─────────────────────────────────────────────────────────────────┤
│ src/hooks/useTheme.js                                             │
│   └── Re-export useTheme từ App (cho charts, widgets)             │
├─────────────────────────────────────────────────────────────────┤
│ src/shared/constants/theme.js                                     │
│   └── getThemeClasses(isDarkMode), getStatusColor, ...            │
├─────────────────────────────────────────────────────────────────┤
│ src/shared/hooks/useTheme.js (shared)                             │
│   └── useTheme(isDarkMode), useSemanticTheme(isDarkMode)          │
│       Dùng khi đã có isDarkMode (từ App useTheme)                 │
├─────────────────────────────────────────────────────────────────┤
│ src/shared/constants/designSystem.js                              │
│   └── BRAND_COLORS, SEMANTIC_COLORS, TYPOGRAPHY, COMPONENT_VARIANTS│
├─────────────────────────────────────────────────────────────────┤
│ src/shared/styles/miaDesignSystem.css                             │
│   └── CSS variables (--mia-*), classes (.theme-*, .mia-btn-*)     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Khi nào dùng gì

| Nhu cầu | Import | Ghi chú |
|---------|--------|---------|
| `isDarkMode`, `themeClasses`, `toggleTheme` | `useTheme` từ `App` hoặc `hooks/useTheme` | Trong component React (cần Context) |
| Theme classes cho component, có sẵn `isDarkMode` | `useSemanticTheme(isDarkMode)` từ `shared/hooks/useTheme` | OrderRow, OrdersSearchBar |
| Chỉ cần map `isDarkMode` → classes | `getThemeClasses(isDarkMode)` từ `shared/constants/theme` | Charts, Map |
| Brand/tokens, variants | `useMiaDesignSystem()`, `designSystem.js` | MiaUI, custom components |

---

## 3. useTheme (Context – chuẩn dùng trong app)

**Import chuẩn cho component trong app:**

```js
// Từ App.js (layout, pages, components gần root)
import { useTheme } from '../App'

// Hoặc từ src/hooks/useTheme (charts, widgets)
import { useTheme } from '../../hooks/useTheme'
```

**API:**

```js
const { isDarkMode, themeClasses, toggleTheme } = useTheme()

// themeClasses: { background, surface, border, text, card, form, status, ... }
```

---

## 4. useSemanticTheme (shared – khi đã có isDarkMode)

**Import:**

```js
import { useSemanticTheme } from '../../../../shared/hooks/useTheme'
import { useTheme } from '../../../../App'

const { isDarkMode } = useTheme()
const theme = useSemanticTheme(isDarkMode)

// theme.card.default, theme.form.input, theme.status.success, ...
```

**Không dùng `useAuth().isDarkMode`** – `useAuth` không cung cấp `isDarkMode`. Luôn dùng `useTheme().isDarkMode`.

---

## 5. theme.js – tokens & helpers

- **`getThemeClasses(isDarkMode)`** – trả về object classes (background, surface, text, card, form, …)
- **`getStatusColor(status, isDarkMode)`** – màu theo trạng thái
- **`getSidebarClasses`, `getCardClasses`, `getButtonClasses`** – cho layout & component cụ thể
- **`THEME_CONSTANTS.theme`** – semantic classes (`theme-surface-primary`, `theme-text-muted`, …)

---

## 6. Quy ước class naming

| Prefix | Ví dụ | Dùng cho |
|--------|-------|----------|
| `theme-` | `theme-surface-primary`, `theme-text-muted` | Semantic tokens, dùng qua `theme.js` |
| `mia-` | `mia-btn-primary`, `mia-card` | MIA design system, component variants |

`theme-*` và `mia-*` được định nghĩa trong `miaDesignSystem.css`.

---

## 7. designSystem.js

- **BRAND_COLORS** – primary, secondary, accent (hex)
- **SEMANTIC_COLORS** – success, warning, error, info
- **TYPOGRAPHY**, **COMPONENT_VARIANTS** – dùng với `useMiaDesignSystem`

---

## 8. Checklist nhanh

- [ ] Component cần dark/light → `useTheme` từ App hoặc `hooks/useTheme`
- [ ] Cần semantic classes (card, form, status) → `useSemanticTheme(isDarkMode)` với `isDarkMode` từ `useTheme`
- [ ] Charts/map cần wrapper styling → `getThemeClasses(isDarkMode)`
- [ ] Không dùng `useAuth().isDarkMode` – dùng `useTheme().isDarkMode`

---

## 9. File tham chiếu

```
src/
├── App.js                    # ThemeProvider, useTheme export
├── hooks/useTheme.js         # Re-export useTheme (charts, widgets)
├── shared/
│   ├── constants/
│   │   ├── theme.js          # getThemeClasses, tokens
│   │   └── designSystem.js   # BRAND_COLORS, useMiaDesignSystem
│   ├── hooks/
│   │   └── useTheme.js       # useTheme(isDarkMode), useSemanticTheme
│   └── styles/
│       └── miaDesignSystem.css  # CSS variables, .theme-*, .mia-*
```
