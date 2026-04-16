import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WarehouseProvider } from './context/WarehouseContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DetectionPage from './pages/DetectionPage';
import InventoryPage from './pages/InventoryPage';
import AlertsPage from './pages/AlertsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ZonesPage from './pages/ZonesPage';
import ActivityPage from './pages/ActivityPage';

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
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/zones" element={<ZonesPage />} />
        <Route path="/activity" element={<ActivityPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WarehouseProvider>
          <AppRoutes />
        </WarehouseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
