# 🏭 MIA Warehouse Management System

Modern warehouse management system built with React.js and Python backend automation.

## 🚀 Live Demo

**Production URL:** `https://warehouse-mia.vercel.app` (coming soon)

## ✨ Features

- 📊 **Real-time Dashboard** - Comprehensive warehouse overview
- 📦 **Orders Management** - Smart order processing and SLA tracking
- 🎯 **Smart Picking** - Optimized picking routes and workflows
- 📈 **Analytics & Reports** - Advanced data visualization with Chart.js
- 🚨 **Real-time Alerts** - Instant notifications and monitoring
- 📋 **Inventory Management** - Stock levels and warehouse mapping
- 👥 **Staff Management** - Team coordination and scheduling
- 🚚 **Shipping SLA** - Delivery performance tracking
- 🤖 **Automation** - ONE system integration and automated workflows

## 🏗️ Technology Stack

### Frontend

- **React 18** - Modern UI library
- **React Router 6** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Chart.js** - Data visualization
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Modern icons

### Backend

- **Python** - Automation scripts
- **FastAPI** - API bridge
- **Selenium** - Browser automation
- **Google Sheets API** - Data integration

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- Python 3.8+
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/warehouse-management-template-jsx.git
cd warehouse-management-template-jsx

# Install frontend dependencies
npm install

# Setup Python environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys
```

### Development

```bash
# Start frontend
npm start

# Start backend (separate terminal)
./start_backend.sh
```

### Production Build

```bash
# Build for production
npm run build

# Test production build
npx serve -s build
```

## 📱 Responsive Design

- ✅ **Mobile** - Optimized for phones
- ✅ **Tablet** - Perfect for warehouse tablets
- ✅ **Desktop** - Full feature management
- ✅ **Dark Mode** - Eye-friendly interface

## 🔐 Security

- Environment variables for API keys
- Google Sheets authentication
- Audit logging system
- Session management

## 📖 Documentation

- [📚 Complete Documentation Index](docs/README.md)
- [🚀 Project Optimization Summary](PROJECT_OPTIMIZATION_SUMMARY.md)
- [📁 Clean Project Structure](PROJECT_CLEAN_STRUCTURE.md)
- [📊 API Documentation](docs/API_DOCUMENTATION.md)
- [🔧 Setup Guides](docs/setup/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 📧 Contact

**Email:** <warehouse@mia.vn>
**Project:** [Repository Link](https://github.com/YOUR_USERNAME/warehouse-management-template-jsx)

---

**Built with ❤️ for efficient warehouse management**

- ✅ **Real Data Only** - Không còn demo data, chỉ dữ liệu thật
- ✅ **Environment Config** - Quản lý credentials qua .env
- ✅ **Logging System** - Ghi log chi tiết vào thư mục logs/

### 🔗 API Endpoints

- `GET /health` - Health check
- `POST /api/automation/start` - Bắt đầu automation
- `GET /api/automation/status` - Trạng thái automation
- `GET /api/orders` - Danh sách đơn hàng đã lấy

### 📖 Tài liệu

Xem thêm tài liệu chi tiết trong [docs/README.md](docs/README.md)

### 🆘 Support

- 📧 Email: <support@mia.vn>
- 📱 Hotline: 1900-xxxx
- 📚 Docs: [docs/](docs/)

---

_MIA Warehouse Management System v2.0 - Python Backend_
