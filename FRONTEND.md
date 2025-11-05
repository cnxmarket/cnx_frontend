# FX Trading Frontend - Knowledge Transfer Document

## Project Overview
This is a React-based FX (Forex) trading frontend application built with Vite, featuring real-time trading charts, order management, and position tracking. The application uses TradingView charts, WebSocket connections for live data, and a modern dark-themed UI with Tailwind CSS.

## Technology Stack
- **Framework**: React 19.1.1 with React Router DOM 7.9.4
- **Build Tool**: Vite 7.1.7
- **Styling**: Tailwind CSS 3.4.1
- **Charts**: TradingView Widget (lightweight-charts 5.0.9)
- **Icons**: Heroicons React 1.0.6
- **Authentication**: JWT-based with refresh tokens
- **State Management**: React hooks (useState, useEffect, useContext)

## Project Structure & File Organization

### Root Configuration Files
```
fx-core/frontend/
├── package.json                    # Dependencies and scripts
├── vite.config.js                  # Vite build configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── eslint.config.js                # ESLint configuration
├── index.html                      # Main HTML entry point
└── README.md                       # Project documentation
```

### Source Code Structure
```
src/
├── main.jsx                        # React application entry point
├── App.jsx                         # Main application component with routing
├── App.css                         # Global application styles
├── index.css                       # Global CSS and Tailwind imports
├── api/                           # API layer
│   ├── auth.js                     # Authentication functions
│   ├── config.js                   # API configuration
│   ├── trading.js                  # Trading API functions
│   └── url.js                      # URL utilities
├── components/                     # Reusable UI components
│   ├── Chart/
│   │   └── TradingViewChart.jsx    # TradingView chart wrapper
│   ├── Header/
│   │   ├── TickerTopbar.jsx        # Live price ticker
│   │   └── Topbar.jsx              # Main header component
│   ├── Orders/
│   │   ├── OrderPanel.jsx          # Basic order panel
│   │   └── OrderPanelPro.jsx       # Advanced order panel
│   ├── Sidebar/
│   │   └── Sidebar.jsx             # Navigation sidebar
│   ├── Tables/
│   │   ├── HistoryTable.jsx        # Trade history table
│   │   ├── PositionsTable.jsx      # Open positions table
│   │   └── TradesPanel.jsx         # Live trades panel
│   ├── Chart.jsx                   # Chart component wrapper
│   ├── Header.jsx                  # Header component wrapper
│   ├── LivePrice.jsx               # Live price display component
│   ├── OrderTable.jsx              # Order management table
│   └── TimeframeSelector.jsx       # Chart timeframe selector
├── pages/                          # Page components
│   ├── Dashboard.jsx               # Main trading dashboard
│   └── Login.jsx                   # Authentication page
├── routes/
│   └── ProtectedRoute.jsx          # Route protection wrapper
└── ws/
    └── userStream.js               # WebSocket connection handler
```

## Key Features & Components

### 1. Authentication System
- **Login Page**: Email/password authentication with social login options
- **Protected Routes**: JWT-based route protection
- **Token Management**: Automatic token refresh and storage

### 2. Trading Dashboard
- **Live Charts**: TradingView integration with real-time price data
- **Order Management**: Place, modify, and cancel orders
- **Position Tracking**: Real-time position monitoring
- **Trade History**: Historical trade data display

### 3. Real-time Data
- **WebSocket Integration**: Live price feeds and trade updates
- **Live Price Ticker**: Multi-symbol price display
- **Auto-refresh**: Automatic data updates

### 4. Responsive Design
- **Mobile-first**: Responsive layout for all screen sizes
- **Dark Theme**: Professional trading interface
- **Sidebar Navigation**: Collapsible navigation for different screen sizes

## File Request Instructions for AI Assistant

When working with this project, request files in the following order for complete understanding:

### Phase 1: Project Setup & Configuration
1. `package.json` - Dependencies and project configuration
2. `vite.config.js` - Build configuration
3. `tailwind.config.js` - Styling configuration
4. `index.html` - HTML entry point

### Phase 2: Core Application Structure
5. `src/main.jsx` - React application entry point
6. `src/App.jsx` - Main application component and routing
7. `src/App.css` - Global application styles
8. `src/index.css` - Global CSS and Tailwind imports

### Phase 3: API Layer
9. `src/api/config.js` - API configuration and base URLs
10. `src/api/auth.js` - Authentication functions and token management
11. `src/api/trading.js` - Trading API functions (orders, positions, fills)
12. `src/api/url.js` - URL utility functions

### Phase 4: Routing & Authentication
13. `src/routes/ProtectedRoute.jsx` - Route protection wrapper
14. `src/pages/Login.jsx` - Authentication page with form handling

### Phase 5: Core Pages
15. `src/pages/Dashboard.jsx` - Main trading dashboard layout

### Phase 6: Navigation & Layout
16. `src/components/Sidebar/Sidebar.jsx` - Navigation sidebar with symbol selection
17. `src/components/Header/Header.jsx` - Header component wrapper
18. `src/components/Header/TickerTopbar.jsx` - Live price ticker component

### Phase 7: Chart Components
19. `src/components/Chart/Chart.jsx` - Chart component wrapper
20. `src/components/Chart/TradingViewChart.jsx` - TradingView chart integration
21. `src/components/TimeframeSelector.jsx` - Chart timeframe selection

### Phase 8: Trading Components
22. `src/components/LivePrice.jsx` - Live price display component
23. `src/components/Orders/OrderPanel.jsx` - Basic order panel
24. `src/components/Orders/OrderPanelPro.jsx` - Advanced order panel
25. `src/components/OrderTable.jsx` - Order management table

### Phase 9: Data Tables
26. `src/components/Tables/TradesPanel.jsx` - Live trades display
27. `src/components/Tables/PositionsTable.jsx` - Open positions table
28. `src/components/Tables/HistoryTable.jsx` - Trade history table

### Phase 10: WebSocket Integration
29. `src/ws/userStream.js` - WebSocket connection and data handling

## Key Dependencies

### Production Dependencies
- `react`: 19.1.1 - React framework
- `react-dom`: 19.1.1 - React DOM rendering
- `react-router-dom`: 7.9.4 - Client-side routing
- `@heroicons/react`: 1.0.6 - Icon library
- `lightweight-charts`: 5.0.9 - Charting library

### Development Dependencies
- `vite`: 7.1.7 - Build tool and dev server
- `@vitejs/plugin-react`: 5.0.3 - React plugin for Vite
- `tailwindcss`: 3.4.1 - CSS framework
- `autoprefixer`: 10.4.21 - CSS vendor prefixing
- `postcss`: 8.5.6 - CSS post-processing
- `eslint`: 9.36.0 - Code linting

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Setup
1. Node.js (version 18+ recommended)
2. npm or yarn package manager
3. Modern browser with WebSocket support

## Important Notes for AI Assistant

1. **State Management**: The app uses React hooks for state management. Symbol selection is lifted to the App component and passed down via context.

2. **Authentication**: JWT tokens are stored in localStorage. The `authFetch` function handles automatic token refresh.

3. **Real-time Data**: WebSocket connections are used for live price feeds and trade updates.

4. **Responsive Design**: The app uses Tailwind CSS with responsive breakpoints. The sidebar collapses on smaller screens.

5. **Chart Integration**: TradingView widgets are dynamically loaded and managed with proper cleanup.

6. **API Structure**: All API calls go through the `authFetch` wrapper for automatic authentication.

7. **File Organization**: Components are organized by feature/functionality in subdirectories.

8. **Styling**: Uses Tailwind CSS with custom dark theme colors and backdrop blur effects.

## Request Pattern for AI Assistant

When requesting files, use this format:
```
Please provide the code for [FILE_PATH] so I can understand [SPECIFIC_ASPECT].
```

Example:
```
Please provide the code for src/components/Chart/TradingViewChart.jsx so I can understand how the TradingView integration works.
```

This document provides a complete roadmap for understanding the FX Trading Frontend project structure and functionality.
