import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useWarehouse } from "../../../context/WarehouseContext";
import { useAuth } from "../../../context/AuthContext";
import { 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  RefreshCw, 
  Shield, 
  Trash2, 
  CheckCircle 
} from 'lucide-react';
import './Header.css';

/**
 * Dynamic titles based on the current route
 */
const pageTitles = {
  '/': 'Dashboard',
  '/detection': 'Object Detection',
  '/inventory': 'Inventory Management',
  '/alerts': 'Alert Center',
  '/ai-detection': 'AI Pest Detection',
  '/settings': 'System Settings',
};

/**
 * Animated search suggestions for the placeholder
 */
const searchSuggestions = [
  'Look up camera feeds...',
  'Search inventory items...',
  'Find alerts by zone...',
  'Search activity logs...',
];

/**
 * Custom hook for search typewriter effect
 */
function useTypingAnimation(texts) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const indexRef = useRef(0);
  const charRef = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const animate = () => {
      const currentText = texts[indexRef.current];
      if (isTyping) {
        if (charRef.current < currentText.length) {
          charRef.current += 1;
          setDisplayText(currentText.slice(0, charRef.current));
          timeoutRef.current = setTimeout(animate, 70);
        } else {
          timeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
        }
      } else {
        if (charRef.current > 0) {
          charRef.current -= 1;
          setDisplayText(currentText.slice(0, charRef.current));
          timeoutRef.current = setTimeout(animate, 40);
        } else {
          indexRef.current = (indexRef.current + 1) % texts.length;
          setIsTyping(true);
          timeoutRef.current = setTimeout(animate, 500);
        }
      }
    };
    timeoutRef.current = setTimeout(animate, 500);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [isTyping, texts]);

  return displayText;
}

export default function Header() {
  const location = useLocation();
  const { state, dispatch } = useWarehouse(); // Global state & dispatch for real-time updates
  const { logout, isAuthenticated } = useAuth();
  
  const [isFocused, setIsFocused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [toast, setToast] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const settingsRef = useRef(null);
  const alertsRef = useRef(null);
  const searchInputRef = useRef(null);
  const typingText = useTypingAnimation(searchSuggestions);

  const title = pageTitles[location.pathname] || 'Smart Warehouse';
  const unreadAlerts = state.alerts.filter(a => a.status === 'unread' || !a.read);

  /**
   * Triggers a temporary visual feedback notification
   */
  const triggerToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  /**
   * REAL-TIME ADMIN HANDLER
   * This logic directly impacts the DashboardPage.jsx KPI cards
   */
  const handleAdminAction = (type) => {
    switch (type) {
      case 'SYNC':
        triggerToast("Syncing database with IoT sensors...");
        // Real-time Simulation: Increment 'Pest Detections Today' by random amount
        setTimeout(() => {
          const randomInc = Math.floor(Math.random() * 3) + 1;
          dispatch({ 
            type: 'UPDATE_STATS', 
            payload: { today: state.detectionStats.today + randomInc } 
          });
          triggerToast(`Success: ${randomInc} new detection records synchronized.`);
        }, 1500);
        break;

      case 'AUDIT':
        setIsAuditing(true);
        triggerToast("Running deep system health diagnostic...");
        // Real-time Simulation: Resets UI state awareness after audit
        setTimeout(() => {
          setIsAuditing(false);
          triggerToast("Security Audit Complete: All hardware online.");
        }, 4000);
        break;

      case 'PURGE':
        // REAL-TIME ACTION: Clears alerts list
        // Effect: Box "Active Alerts" in DashboardPage will immediately drop to 0
        dispatch({ type: 'CLEAR_ALERTS' }); 
        triggerToast("Admin Action: All alert logs purged from system.");
        break;

      default:
        break;
    }
    setShowSettings(false);
  };

  useEffect(() => { setHasMounted(true); }, []);

  /**
   * Shortcut Listener: Ctrl+K to focus search
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault(); 
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /**
   * Click Outside Logic to close dropdowns
   */
  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) setShowSettings(false);
      if (alertsRef.current && !alertsRef.current.contains(event.target)) setShowAlerts(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <header className="header">
      {/* Toast Feedback */}
      {toast && (
        <div className="toast-notification">
          <CheckCircle size={16} /> <span>{toast}</span>
        </div>
      )}

      {/* Header Left */}
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        <p className="header-date">{dateStr}</p>
      </div>

      {/* Header Center (Search) */}
      <div className="header-center">
        <div className="header-search">
          <Search size={16} className="header-search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={isFocused ? 'Start typing...' : typingText}
            className="header-search-input"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <kbd className="header-search-kbd">Ctrl+K</kbd>
        </div>
      </div>

      {/* Header Right */}
      <div className="header-right">
        <div className="header-actions">
          
          {/* Notifications Dropdown */}
          <div className="dropdown-wrapper" ref={alertsRef}>
            <button className="header-action-btn" onClick={() => setShowAlerts(!showAlerts)}>
              <Bell size={18} />
              {unreadAlerts.length > 0 && <span className="header-notification-dot">{unreadAlerts.length}</span>}
            </button>

            {showAlerts && (
              <div className="dropdown-menu-alerts">
                <div className="dropdown-header">Recent Alerts</div>
                {unreadAlerts.length > 0 ? (
                  unreadAlerts.slice(0, 5).map(alert => (
                    <div key={alert.id} className="dropdown-item-alert">
                      <span className="alert-badge">Active</span>
                      <p>{alert.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="dropdown-empty" style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                    No pending alerts.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Settings Dropdown (Real-time Controls) */}
          <div className="dropdown-wrapper" ref={settingsRef}>
            <button className="header-action-btn" onClick={() => setShowSettings(!showSettings)}>
              <Settings size={18} />
            </button>

            {showSettings && (
              <div className="dropdown-menu-settings">
                <div className="dropdown-header">System Admin</div>
                <button className="dropdown-item" onClick={() => handleAdminAction('SYNC')}>
                  <RefreshCw size={14} style={{ color: '#10b981' }} /> <span>Sync Database</span>
                </button>
                <button className="dropdown-item" onClick={() => handleAdminAction('AUDIT')}>
                  <Shield size={14} style={{ color: '#6366f1' }} /> <span>Security Audit</span>
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item danger" onClick={() => handleAdminAction('PURGE')}>
                  <Trash2 size={14} /> <span>Purge Alert Logs</span>
                </button>
              </div>
            )}
          </div>

          {/* Logout */}
          {isAuthenticated && (
            <button className="header-action-btn" onClick={() => logout()}>
              <LogOut size={18} />
            </button>
          )}

          {/* System Status (Reacts to Audit) */}
          <div className={`header-status ${isAuditing ? 'auditing' : ''}`}>
            <span className={`status-dot ${isAuditing ? 'scanning' : 'online'}`}></span>
            <span className="header-status-text">
              {isAuditing ? 'Auditing...' : 'System Online'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}