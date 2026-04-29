import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WarehouseProvider } from './context/WarehouseContext';
import Layout from './components/layout/MainLayout/Layout'; // Pastikan path ini sesuai struktur baru lo
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

// Satpam untuk halaman yang WAJIB login
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth(); // Pakai 'user' dan 'loading'
  
  if (loading) return <div className="flex h-screen items-center justify-center font-bold">Syncing Security Credentials...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
}

// Mencegah user yang sudah login balik lagi ke halaman login
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  
  return children;
}

// Batasi akses berdasarkan Role (admin, supervisor, operator)
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
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      
      {/* Semua route di bawah ini dibungkus Layout dan ProtectedRoute */}
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
        
        {/* Analytics & Activity hanya untuk Admin dan Supervisor */}
        <Route path="/analytics" element={
          <RoleRoute allowedRoles={['admin', 'supervisor']}>
            <AnalyticsPage />
          </RoleRoute>
        } />
        
        <Route path="/zones" element={<ZonesPage />} />
        
        <Route path="/activity" element={
          <RoleRoute allowedRoles={['admin', 'supervisor']}>
            <ActivityPage />
          </RoleRoute>
        } />
        
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      
      {/* Redirect jika path tidak ditemukan */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppInner() {
  const { user, loading } = useAuth(); 
  
  return (
    // WarehouseProvider butuh userProfile.warehouseId untuk fetch data gudang yang sama
    <WarehouseProvider isAuthenticated={!!user} userProfile={user} loading={loading}>
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