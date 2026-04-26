import { NavLink, useLocation } from 'react-router-dom';
import { useWarehouse } from '../../context/WarehouseContext';
import { useAuth } from '../../context/AuthContext';
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
  { path: '/analytics', icon: BarChart3, label: 'Analytics', roles: ['admin', 'manager'] },
  { path: '/zones', icon: Map, label: 'Zones', roles: null },
  { path: '/activity', icon: ClipboardList, label: 'Activity Log', roles: ['admin', 'manager'] },
  { path: '/settings', icon: Settings, label: 'Settings', roles: null },
];

export default function Sidebar() {
  const { state, dispatch } = useWarehouse();
  const { user, logout } = useAuth();
  const location = useLocation();
  const collapsed = state.sidebarCollapsed;
  const unreadAlerts = state.alerts.filter((a) => a.status === 'unread').length;

  // Filter nav items by role
  const visibleItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role);
  });

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
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

      {/* Nav */}
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

      {/* User & Toggle */}
      <div className="sidebar-footer">
        {user && (
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user.avatar}</div>
            {!collapsed && (
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{user.name.split(' ')[0]}</span>
                <span className="sidebar-user-role">{user.role}</span>
              </div>
            )}
            {!collapsed && (
              <button className="sidebar-logout" onClick={logout} title="Logout">
                <LogOut size={16} />
              </button>
            )}
          </div>
        )}
        <button
          className="sidebar-toggle"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
