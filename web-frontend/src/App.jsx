import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WarehouseProvider } from './context/WarehouseContext';
import { VisionProvider } from './context/VisionContext';
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
import VisionControl from './pages/VisionControl/VisionControl';

/**
 * ERROR BOUNDARY COMPONENT
 * Functional safety net to catch JavaScript errors anywhere in the child component tree.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("System Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">System Malfunction</h1>
          <p className="mt-2 text-slate-600">The module failed to load. Please refresh the dashboard.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-700"
          >
            Reload System
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * ProtectedRoute Component
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="flex h-screen items-center justify-center font-bold text-indigo-600">
      <div className="animate-pulse">Syncing Security Credentials...</div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
}

/**
 * PublicRoute Component
 */
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return children;
}

/**
 * RoleRoute Component
 */
function RoleRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

/**
 * AppRoutes Component
 */
function AppRoutes() {
  return (
    <ErrorBoundary>
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
        
        {/* MAIN SYSTEM ROUTES */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          
          {/* VISION CONTROL HUB - The AI Pest Detection Module */}
          <Route path="/vision" element={<VisionControl />} />
          
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/zones" element={<ZonesPage />} />
          
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
          
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

/**
 * AppInner Component
 */
function AppInner() {
  const { user, loading } = useAuth(); 
  
  return (
    <WarehouseProvider isAuthenticated={!!user} userProfile={user} loading={loading}>
      <VisionProvider>
        <AppRoutes />
      </VisionProvider>
    </WarehouseProvider>
  );
}

/**
 * Main Entry Point
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