import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WarehouseProvider } from './context/WarehouseContext';
import Layout from './components/layout/MainLayout/Layout';
import LoginPage from './pages/Login/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import DetectionPage from './pages/Detection/DetectionPage';
import AIDetectionPage from './pages/AIDetection/AIDetectionPage';
import InventoryPage from './pages/Inventory/InventoryPage';
import AlertsPage from './pages/Alerts/AlertsPage';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import ZonesPage from './pages/Zones/ZonesPage';
import ActivityPage from './pages/Activity/ActivityPage';
import SettingsPage from './pages/Settings/SettingsPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

// Role-based route guard
function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/detection" element={<DetectionPage />} />
        <Route path="/ai-detection" element={<AIDetectionPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/analytics" element={
          <RoleRoute allowedRoles={['admin', 'manager']}>
            <AnalyticsPage />
          </RoleRoute>
        } />
        <Route path="/zones" element={<ZonesPage />} />
        <Route path="/activity" element={
          <RoleRoute allowedRoles={['admin', 'manager']}>
            <ActivityPage />
          </RoleRoute>
        } />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppInner() {
  const { isAuthenticated, user } = useAuth(); // Ambil user di sini
  return (
    // send user to warehouse provider so it can use userProfile.warehouseId to load data
    <WarehouseProvider isAuthenticated={isAuthenticated} userProfile={user}>
      <AppRoutes />
    </WarehouseProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </BrowserRouter>
  );
}
