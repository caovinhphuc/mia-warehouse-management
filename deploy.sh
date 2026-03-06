#!/bin/bash

# ==================== MIA WAREHOUSE DEPLOYMENT SCRIPT ====================
# Tự động commit, push và deploy lên Vercel

set -e  # Exit on error

echo "🚀 Bắt đầu deployment process..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Git chưa được khởi tạo!${NC}"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI chưa được cài đặt.${NC}"
    echo "   Cài đặt bằng: npm install -g vercel"
    echo ""
    echo "   Hoặc deploy qua Vercel Dashboard:"
    echo "   1. Mở https://vercel.com"
    echo "   2. Import project từ GitHub"
    echo "   3. Cấu hình environment variables"
    echo ""
    read -p "Tiếp tục với Git commit/push? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    SKIP_VERCEL=true
else
    SKIP_VERCEL=false
fi

# Step 1: Build test
echo -e "${GREEN}📦 Bước 1: Build test...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ Build thành công!${NC}"
else
    echo -e "${RED}❌ Build thất bại! Vui lòng kiểm tra lỗi.${NC}"
    exit 1
fi
echo ""

# Step 2: Git status
echo -e "${GREEN}📋 Bước 2: Kiểm tra Git status...${NC}"
git status --short
echo ""

# Step 3: Add all changes
echo -e "${GREEN}📝 Bước 3: Thêm các file vào staging...${NC}"
git add .
echo ""

# Step 4: Commit (chỉ khi có thay đổi)
echo -e "${GREEN}💾 Bước 4: Commit changes...${NC}"
if git diff --staged --quiet 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Không có thay đổi để commit (working tree clean). Bỏ qua bước commit.${NC}"
else
    read -p "Nhập commit message (hoặc Enter để dùng message mặc định): " COMMIT_MSG

    if [ -z "$COMMIT_MSG" ]; then
        COMMIT_MSG="🚀 Deploy: Update authentication to support email/login + latest features"
    fi

    git commit -m "$COMMIT_MSG"
    echo -e "${GREEN}✅ Đã commit: $COMMIT_MSG${NC}"
fi
echo ""

# Step 5: Push to GitHub
echo -e "${GREEN}📤 Bước 5: Push lên GitHub...${NC}"
read -p "Push lên GitHub? (y/n) " -n 1 -r
echo
# Xóa ký tự thừa trong buffer (tránh bước 6 đọc nhầm)
read -r DUMMY 2>/dev/null || true
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push origin main
    echo -e "${GREEN}✅ Đã push lên GitHub thành công!${NC}"
else
    echo -e "${YELLOW}⚠️  Bỏ qua push lên GitHub${NC}"
fi
echo ""

# Step 6: Deploy to Vercel
if [ "$SKIP_VERCEL" = false ]; then
    echo -e "${GREEN}🚀 Bước 6: Deploy lên Vercel...${NC}"
    read -p "Deploy lên Vercel? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}⚠️  Đảm bảo đã cấu hình environment variables trong Vercel Dashboard!${NC}"
        echo ""
        vercel --prod
        echo -e "${GREEN}✅ Đã deploy lên Vercel!${NC}"
    else
        echo -e "${YELLOW}⚠️  Bỏ qua deploy Vercel${NC}"
    fi
else
    echo -e "${YELLOW}📝 Bước 6: Deploy qua Vercel Dashboard${NC}"
    echo ""
    echo "   Sau khi push code lên GitHub:"
    echo "   1. Mở https://vercel.com/dashboard"
    echo "   2. Project sẽ tự động deploy (nếu đã kết nối GitHub)"
    echo "   3. Hoặc click 'Redeploy' để deploy lại"
    echo ""
fi

echo ""
echo -e "${GREEN}🎉 Hoàn thành deployment process!${NC}"
echo ""
echo "📋 Environment Variables cần cấu hình trong Vercel:"
echo "   • REACT_APP_GOOGLE_SHEETS_API_KEY"
echo "   • REACT_APP_GOOGLE_SHEETS_ID"
echo "   • REACT_APP_AUDIT_WEBHOOK_URL (optional)"
echo "   • REACT_APP_PROFILE_UPDATE_WEBHOOK_URL (optional)"
echo ""
echo "🔗 Xem chi tiết trong: FINAL_DEPLOYMENT_GUIDE.md"
echo ""

