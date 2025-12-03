#!/bin/bash

# 🚀 Development Start Script
# Tự động switch sang Node.js 18 và start app

echo "🚀 Starting MIA Warehouse Management System..."
echo ""

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Check if Node 18 is installed
if ! nvm list | grep -q "v18"; then
  echo "📦 Node.js 18 chưa được cài đặt. Đang cài đặt..."
  nvm install 18
fi

# Switch to Node 18
echo "🔄 Switching to Node.js 18..."
nvm use 18

# Verify Node version
echo "✅ Node version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 node_modules không tồn tại. Đang cài đặt dependencies..."
  npm install
fi

# Start app
echo "🎯 Starting React app..."
echo ""
npm start
