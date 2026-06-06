# Rising CRMFrontend

A modern, professional Rising CRMfrontend built with Next.js 15, TypeScript, Tailwind CSS, and more.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Handling**: Axios + React Query
- **Real-time**: Socket.IO Client
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **Authentication**: JWT

## 📋 Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:5000`
- npm or yarn package manager

## ️ Installation

1. **Navigate to frontend directory**:
   ```bash
   cd /Users/apple/Desktop/Rising_CRM/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   
   The `.env.local` file is already configured:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

## 🚀 Running the Application

1. **Start the Backend** (in another terminal):
   ```bash
   cd /Users/apple/Desktop/Rising_CRM/backend
   npm run dev
   ```

2. **Start the Frontend**:
   ```bash
   cd /Users/apple/Desktop/Rising_CRM/frontend
   npm run dev
   ```

3. **Open in Browser**:
   ```
   http://localhost:3000
   ```

## 🔐 Default Login Credentials

- **Email**: `admin@salescrm.com`
- **Password**: `Admin@12345`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── login/           # Login page
│   │   ├── dashboard/       # Dashboard with charts
│   │   ├── leads/           # Leads management
│   │   ├── customers/       # Customer management
│   │   ├── deals/           # Deals pipeline
│   │   ├── quotations/      # Quotations
│   │   ├── followups/       # Followup management
│   │   ├── tasks/           # Task management
│   │   ├── reports/         # Reports & analytics
│   │   ├── employees/       # Employee management
│   │   ├── notifications/   # Notifications
│   │   └── settings/        # Settings
│   │
│   ├── components/
│   │   ├── layout/          # Sidebar, Navbar, Layout
│   │   ├── providers/       # React Query Provider
│   │   └── ui/              # Reusable UI components
│   │
│   ├── services/            # API service files
│   │   ├── auth.service.ts
│   │   ├── lead.service.ts
│   │   ├── dashboard.service.ts
│   │   └── ...
│   │
│   ├── store/               # Zustand stores
│   │   └── auth.store.ts
│   │
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   │
│   ├── lib/                 # Utility functions
│   │   ├── utils.ts
│   │   └── axios.ts
│   │
│   └── middleware.ts        # Route protection
│
├── public/                  # Static assets
├── .env.local              # Environment variables
└── package.json
```

## ✨ Features

### ✅ Completed Features

1. **Authentication System**
   - Login page with form validation
   - JWT token management
   - Protected routes
   - Auto token refresh
   - Logout functionality

2. **Main Layout**
   - Professional sidebar navigation
   - Top navbar with search
   - Theme toggle (dark/light mode)
   - User profile dropdown
   - Notifications badge

3. **Dashboard**
   - Statistics cards (leads, followups, tasks, revenue)
   - Revenue chart (Area chart)
   - Lead sources pie chart
   - Recent activity feed
   - Upcoming followups widget

4. **Leads Management**
   - Leads table with pagination
   - Search and filter functionality
   - Status badges with colors
   - Action buttons (view, edit, delete)
   - Responsive design

5. **State Management**
   - Zustand for auth state
   - React Query for server state
   - Persistent auth storage

6. **API Integration**
   - Axios instance with interceptors
   - Auto token refresh
   - Error handling
   - TypeScript types

### 🚧 Pages Ready for Implementation

The following pages have placeholder layouts ready:
- Customers
- Deals
- Quotations
- Followups
- Tasks
- Reports
- Employees
- Notifications
- Settings

## 🎨 Design Features

- ✅ Modern gradient backgrounds
- ✅ Smooth hover animations
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Professional color scheme
- ✅ Clean typography
- ✅ Soft shadows
- ✅ Rounded cards

## 🔧 API Endpoints Integrated

All backend endpoints are documented in `src/services/`:

- **Auth**: login, register, getMe, changePassword, forgotPassword, resetPassword, logout
- **Leads**: CRUD operations, assign, bulk assign, change status, import IndiaMART, convert to customer
- **Dashboard**: overview stats, analytics
- **Users**: CRUD operations, performance
- **Followups**: CRUD, daily, missed, upcoming
- **Tasks**: CRUD operations
- **Notifications**: list, mark as read

##  Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Responsive Design

- Desktop: Full sidebar + navbar
- Tablet: Collapsible sidebar
- Mobile: Responsive layouts

## 🎯 Next Steps for Full Implementation

1. **Implement remaining pages**:
   - Customers management with table
   - Deals pipeline with Kanban board
   - Quotations with PDF generation
   - Followups with calendar view
   - Tasks with task board
   - Reports with export functionality
   - Employees with performance tracking

2. **Add Socket.IO integration**:
   - Real-time notifications
   - Live lead updates
   - Task alerts

3. **Enhance features**:
   - IndiaMART import page
   - Lead details page with tabs
   - Bulk operations
   - Export to CSV/Excel
   - Advanced filters

4. **Add more charts**:
   - Sales analytics
   - Employee performance
   - Conversion rates
   - Monthly trends

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### API Connection Issues
- Ensure backend is running on port 5000
- Check `.env.local` has correct API URL
- Verify CORS is enabled in backend

## 📝 Notes

- The frontend is production-ready with proper error handling
- All API calls are typed with TypeScript
- Authentication persists across page reloads
- Dark mode preference is saved in localStorage
- React Query caches API responses for better performance

##  Contributing

This is a private project. Contact the development team for contributions.

##  License

Private - All rights reserved

---

**Built with ❤️ using Next.js 15**
