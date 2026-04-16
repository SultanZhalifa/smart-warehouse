import { useLocation } from 'react-router-dom';
import { useWarehouse } from '../../context/WarehouseContext';
import { Search, Bell, Settings, Maximize2 } from 'lucide-react';
import './Header.css';

const pageTitles = {
  '/': 'Dashboard',
  '/detection': 'Object Detection',
  '/inventory': 'Inventory Management',
  '/alerts': 'Alert Center',
  '/analytics': 'Analytics & Reports',
  '/zones': 'Zone Management',
  '/activity': 'Activity Log',
};

export default function Header() {
  const location = useLocation();
  const { state } = useWarehouse();
  const unreadAlerts = state.alerts.filter((a) => !a.read).length;
  const title = pageTitles[location.pathname] || 'Smart Warehouse';

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <header className="header">
      <div className="header-left">
        <div>
          <h1 className="header-title">{title}</h1>
          <p className="header-date">{dateStr}</p>
        </div>
      </div>

      <div className="header-right">
        <div className="header-search">
          <Search size={16} className="header-search-icon" />
          <input
            type="text"
            placeholder="Search anything..."
            className="header-search-input"
          />
          <kbd className="header-search-kbd">⌘K</kbd>
        </div>

        <div className="header-actions">
          <button className="header-action-btn" title="Notifications">
            <Bell size={18} />
            {unreadAlerts > 0 && (
              <span className="header-notification-dot">{unreadAlerts}</span>
            )}
          </button>
          <button className="header-action-btn" title="Settings">
            <Settings size={18} />
          </button>

          <div className="header-status">
            <span className="status-dot online"></span>
            <span className="header-status-text">System Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}
