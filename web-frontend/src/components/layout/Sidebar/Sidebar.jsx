import { NavLink } from 'react-router-dom';
import { useWarehouse } from '../../../context/WarehouseContext';
import { useAuth } from '../../../context/AuthContext';
import {
  LayoutDashboard, ScanSearch, Package, Bell, BarChart3,
  Map, ClipboardList, ChevronLeft, ChevronRight, LogOut, Warehouse, Settings, Zap
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', roles: null },
  { path: '/detection', icon: ScanSearch, label: 'Pest Simulator', roles: null },
  { path: '/ai-detection', icon: Zap, label: 'AI Detection', roles: null },
  { path: '/inventory', icon: Package, label: 'Inventory', roles: null },
  { path: '/alerts', icon: Bell, label: 'Alerts', roles: null },
  { path: '/analytics', icon: BarChart3, label: 'Analytics', roles: ['admin', 'supervisor'] }, // Updated roles to match LoginPage
  { path: '/zones', icon: Map, label: 'Zones', roles: null },
  { path: '/activity', icon: ClipboardList, label: 'Activity Log', roles: ['admin', 'supervisor'] }, // Updated roles to match LoginPage
  { path: '/settings', icon: Settings, label: 'Settings', roles: null },
];

export default function Sidebar() {
  const { state, dispatch } = useWarehouse();
  /** 
   * Extract user data and logout function. 
   * Ensure 'user' is checked as the primary condition for showing user actions.
   */
  const { user, logout, loading } = useAuth(); 
  const collapsed = state.sidebarCollapsed;
  const unreadAlerts = state.alerts.filter((a) => a.status === 'unread').length;

  // Filter navigation items based on the user's assigned role
  const visibleItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role);
  });

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand Identity Section */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Warehouse size={24} />
        </div>
        {!collapsed && (
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-title">SmartWH</span>
            <span className="sidebar-logo-subtitle">Pest Detection</span>
          </div>
        )}
      </div>

      {/* Main Navigation Menu */}
      <nav className="sidebar-nav">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            <div className="sidebar-nav-icon">
              <item.icon size={20} />
            </div>
            {!collapsed && <span className="sidebar-nav-label">{item.label}</span>}
            {item.path === '/alerts' && unreadAlerts > 0 && (
              <span className={`sidebar-badge ${collapsed ? 'sidebar-badge-dot' : ''}`}>
                {collapsed ? '' : unreadAlerts}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer: User Profile, Logout, and Toggle Sidebar */}
      <div className="sidebar-footer">
        {/* 
          Conditional rendering: Show user profile and logout ONLY if user data is available 
          and the authentication loading state is finished.
        */}
        {!loading && user && (
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?'}
            </div>
            {!collapsed && (
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">
                  {user?.name?.split(/\s+/)[0] || user?.email?.split('@')[0] || 'Staff'}
                </span>
                <span className="sidebar-user-role">{user?.role ?? 'operator'}</span>
              </div>
            )}
            <button
              type="button"
              className={`sidebar-logout ${!collapsed ? 'sidebar-logout--labeled' : ''}`}
              onClick={logout}
              title="Logout from System"
              aria-label="Logout"
            >
              <LogOut size={16} />
              {!collapsed && <span className="sidebar-logout-text">Logout</span>}
            </button>
          </div>
        )}
        
        {/* Sidebar Collapse Toggle Button */}
        <button
          className="sidebar-toggle"
          style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '10px 0' }}
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}