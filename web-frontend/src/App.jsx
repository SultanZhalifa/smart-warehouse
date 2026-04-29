import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WarehouseProvider } from './context/WarehouseContext';
import Layout from './components/layout/MainLayout/Layout';

// Page Imports
import LoginPage from './pages/Login/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import InventoryPage from './pages/Inventory/InventoryPage';
import AlertsPage from './pages/Alerts/AlertsPage';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import ZonesPage from './pages/Zones/ZonesPage';
import ActivityPage from './pages/Activity/ActivityPage';
import SettingsPage from './pages/Settings/SettingsPage';

/** 
 * NEW HEART OF THE SYSTEM 
 * Integrated AI Monitoring, Simulator, and Live Feed
 */
import VisionControl from './pages/VisionControl/VisionControl';

/**
 * ProtectedRoute Component
 * Prevents unauthorized users from accessing the system.
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="flex h-screen items-center justify-center font-bold">
      Syncing Security Credentials...
    </div>
  );
  
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
}

/**
 * PublicRoute Component
 * Redirects authenticated users away from the login page.
 */
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  
  return children;
}

/**
 * RoleRoute Component
 * Restricts access based on user authorization levels (admin, supervisor, operator).
 */
function RoleRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* AUTHENTICATION ROUTE */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      
      {/* MAIN SYSTEM ROUTES (Wrapped in Layout & Security) */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Core Dashboard */}
        <Route path="/" element={<DashboardPage />} />
        
        /** 
         * VISION CONTROL MODULE
         * Replaced separate 'Detection' and 'AIDetection' pages with 
         * a unified enterprise-grade monitoring hub.
         */
        <Route path="/vision" element={<VisionControl />} />
        
        {/* Warehouse Management */}
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/zones" element={<ZonesPage />} />
        
        {/* Analytics & Activity - Restricted to Admin/Supervisor */}
        <Route path="/analytics" element={
          <RoleRoute allowedRoles={['admin', 'supervisor']}>
            <AnalyticsPage />
          </RoleRoute>
        } />
        
        <Route path="/activity" element={
          <RoleRoute allowedRoles={['admin', 'supervisor']}>
            <ActivityPage />
          </RoleRoute>
        } />
        
        {/* System Configuration */}
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      
      {/* 404 Redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/**
 * AppInner Component
 * Handles Context Provider initialization with user profile data.
 */
function AppInner() {
  const { user, loading } = useAuth(); 
  
  return (
    <WarehouseProvider isAuthenticated={!!user} userProfile={user} loading={loading}>
      <AppRoutes />
    </WarehouseProvider>
  );
}

/**
 * Main Entry Point
 * Wraps the entire application in Router and Auth context.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </BrowserRouter>
  );
}