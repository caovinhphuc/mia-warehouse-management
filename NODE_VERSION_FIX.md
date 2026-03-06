# 🔧 Sửa Lỗi Node.js Compatibility

## ⚠️ Vấn Đề

Lỗi: `TypeError: atLeastNode is not a function`
- Node.js quá mới hoặc không tương thích
- `react-scripts 5.0.1` cần Node 18–20 (hoặc 22 với overrides trong package.json)

## ✅ Giải Pháp

### Giải Pháp 1: Sử dụng mise (Khuyến nghị - dự án đã có mise.toml)

```bash
# Cài mise nếu chưa có: https://mise.jdx.dev
# Cài Node 22 như cấu hình trong mise.toml
mise install

# Verify
node --version  # v22.x.x

# Reinstall dependencies
rm -rf node_modules
npm install

# Start
npm start
```

### Giải Pháp 2: Sử dụng nvm

```bash
# Cài đặt nvm nếu chưa có
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Cài Node.js 18 (LTS - tương thích tốt)
nvm install 18
nvm use 18

# Verify
node --version  # Should show v18.x.x

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Start app
npm start
```

### Giải Pháp 3: Update react-scripts

```bash
# Update react-scripts lên version mới hơn
npm install react-scripts@latest

# Reinstall
rm -rf node_modules package-lock.json
npm install

# Start app
npm start
```

### Giải Pháp 4: Sử dụng Yarn (Alternative)

```bash
# Cài yarn
npm install -g yarn

# Xóa node_modules
rm -rf node_modules package-lock.json

# Install với yarn
yarn install

# Start
yarn start
```

## 📋 Đã Thực Hiện

1. ✅ Đã thêm `overrides` và `resolutions` vào `package.json`
2. ✅ Đã xóa và reinstall `node_modules`
3. ✅ Đã clear npm cache

## 🎯 Khuyến Nghị

**Dự án dùng mise + Node 22** (xem `mise.toml`). Cách đơn giản nhất:

```bash
mise install
npm start
```

**Nếu dùng nvm**: Node 18 LTS hoặc 20 LTS tương thích tốt với `react-scripts 5.0.1`:

```bash
nvm install 20
nvm use 20
npm start
```

---

**Cập nhật:** 2025-03-07
