import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useWarehouse } from '../../context/WarehouseContext';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, Settings, LogOut } from 'lucide-react';
import './Header.css';

const pageTitles = {
  '/': 'Dashboard',
  '/detection': 'Object Detection',
  '/inventory': 'Inventory Management',
  '/alerts': 'Alert Center',
  '/analytics': 'Analytics & Reports',
  '/zones': 'Zone Management',
  '/activity': 'Activity Log',
  '/settings': 'Settings',
  '/ai-detection': 'AI Pest Detection',
};

const searchSuggestions = [
  'Search inventory items...',
  'Find alerts by zone...',
  'Look up camera feeds...',
  'Search activity logs...',
  'Find items by category...',
  'Search warehouse zones...',
];

function useTypingAnimation(texts, typingSpeed = 60, deletingSpeed = 35, pauseDuration = 2200) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const indexRef = useRef(0);
  const charRef = useRef(0);
  const timeoutRef = useRef(null);

  const animate = useCallback(() => {
    const currentText = texts[indexRef.current];

    if (isTyping) {
      if (charRef.current < currentText.length) {
        charRef.current += 1;
        setDisplayText(currentText.slice(0, charRef.current));
        timeoutRef.current = setTimeout(animate, typingSpeed + Math.random() * 40);
      } else {
        timeoutRef.current = setTimeout(() => setIsTyping(false), pauseDuration);
      }
    } else {
      if (charRef.current > 0) {
        charRef.current -= 1;
        setDisplayText(currentText.slice(0, charRef.current));
        timeoutRef.current = setTimeout(animate, deletingSpeed);
      } else {
        indexRef.current = (indexRef.current + 1) % texts.length;
        setIsTyping(true);
        timeoutRef.current = setTimeout(animate, 400);
      }
    }
  }, [isTyping, texts, typingSpeed, deletingSpeed, pauseDuration]);

  useEffect(() => {
    timeoutRef.current = setTimeout(animate, 500);
    return () => clearTimeout(timeoutRef.current);
  }, [animate]);

  return displayText;
}

export default function Header() {
  const location = useLocation();
  const { state } = useWarehouse();
  const { logout } = useAuth();
  const unreadAlerts = state.alerts.filter((a) => !a.read).length;
  const title = pageTitles[location.pathname] || 'Smart Warehouse';
  const [isFocused, setIsFocused] = useState(false);

  const typingText = useTypingAnimation(searchSuggestions);

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
            placeholder={isFocused ? 'Type to search...' : typingText}
            className="header-search-input"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {!isFocused && (
            <span className="header-search-cursor" aria-hidden="true">|</span>
          )}
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

          <button
            type="button"
            className="header-action-btn header-logout-mobile"
            onClick={() => logout()}
            title="Logout"
            aria-label="Logout"
          >
            <LogOut size={18} />
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
