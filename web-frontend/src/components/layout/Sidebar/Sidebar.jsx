import { NavLink } from 'react-router-dom';
import { useWarehouse } from '../../../context/WarehouseContext';
import { useAuth } from '../../../context/AuthContext';
import {
  LayoutDashboard, Package, Bell, BarChart3,
  Map, ClipboardList, ChevronLeft, ChevronRight,
  LogOut, Warehouse, Settings, Camera
} from 'lucide-react';
import './Sidebar.css';

/**
 * Global Navigation Configuration
 * Synchronized with App.jsx routes for centralized control.
 */
const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', roles: null },
  /** 
   * VISION CONTROL HUB
   * Replaces separate detection paths with the unified Vision module.
   */
  { path: '/vision', icon: Camera, label: 'Vision Control', roles: null },
  { path: '/inventory', icon: Package, label: 'Inventory', roles: null },
  { path: '/alerts', icon: Bell, label: 'Alerts', roles: null },
  { path: '/zones', icon: Map, label: 'Zones', roles: null },
  { 
    path: '/analytics', 
    icon: BarChart3, 
    label: 'Analytics', 
    roles: ['admin', 'supervisor'] 
  },
  { 
    path: '/activity', 
    icon: ClipboardList, 
    label: 'Activity Log', 
    roles: ['admin', 'supervisor'] 
  },
  { path: '/settings', icon: Settings, label: 'Settings', roles: null },
];

export default function Sidebar() {
  const { state, dispatch } = useWarehouse();
  const { user, logout, loading } = useAuth();

  // Sidebar expansion state from global context
  const collapsed = state?.sidebarCollapsed ?? false;

  // Real-time notification counter for the Alerts badge
  const unreadAlerts = (state?.alerts ?? []).filter(
    (a) => a?.status === 'unread'
  ).length;

  /**
   * Access Control Filter
   * Only renders menu items permitted by the user's assigned role.
   */
  const visibleItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role);
  });

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>

      {/* LOGO SECTION */}
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

      {/* NAVIGATION LINKS */}
      <nav className="sidebar-nav">
        {visibleItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              <div className="sidebar-nav-icon">
                <Icon size={20} />
              </div>

              {!collapsed && (
                <span className="sidebar-nav-label">
                  {item.label}
                </span>
              )}

              {/* DYNAMIC ALERT BADGE */}
              {item.path === '/alerts' && unreadAlerts > 0 && (
                <span className="sidebar-badge">
                  {collapsed ? '' : unreadAlerts}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* SIDEBAR FOOTER & USER PROFILE */}
      <div className="sidebar-footer">

        {!loading && user && (
          <div className="sidebar-user">

            {/* Initial Avatar Fallback */}
            <div className="sidebar-avatar">
              {user?.name?.charAt(0)?.toUpperCase()
                || user?.email?.charAt(0)?.toUpperCase()
                || '?'}
            </div>

            {!collapsed && (
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">
                  {user?.name?.split(/\s+/)[0]
                    || user?.email?.split('@')[0]
                    || 'Staff'}
                </span>

                <span className="sidebar-user-role">
                  {user?.role ?? 'operator'}
                </span>
              </div>
            )}

            {/* AUTHENTICATION ACTION */}
            <button
              type="button"
              className={`sidebar-logout ${
                !collapsed ? 'sidebar-logout--labeled' : ''
              }`}
              onClick={logout}
              aria-label="Logout"
            >
              <LogOut size={16} />
              {!collapsed && (
                <span className="sidebar-logout-text">
                  Logout
                </span>
              )}
            </button>
          </div>
        )}

        {/* LAYOUT TOGGLE BUTTON */}
        <button
          className="sidebar-toggle"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          aria-label="Toggle Sidebar"
        >
          {collapsed
            ? <ChevronRight size={18} />
            : <ChevronLeft size={18} />}
        </button>

      </div>
    </aside>
  );
}