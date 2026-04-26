import { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import * as db from '../lib/database';
import {
  Bell, CheckCheck, Filter, AlertTriangle, AlertOctagon,
  Info, Clock, MapPin, Eye, EyeOff
} from 'lucide-react';
import './AlertsPage.css';

const SEVERITY_CONFIG = {
  critical: { icon: AlertOctagon, color: 'var(--color-accent-danger)', bg: 'rgba(239,68,68,0.08)', label: 'Critical' },
  warning: { icon: AlertTriangle, color: 'var(--color-accent-warning)', bg: 'rgba(251,191,36,0.08)', label: 'Warning' },
  info: { icon: Info, color: 'var(--color-accent-info)', bg: 'rgba(59,130,246,0.08)', label: 'Info' },
};

export default function AlertsPage() {
  const { state, dispatch, refreshData } = useWarehouse();
  const zones = state.zones;
  const [filter, setFilter] = useState('all');
  const [showRead, setShowRead] = useState(true);

  const filtered = state.alerts.filter((a) => {
    if (filter !== 'all' && a.type !== filter) return false;
    if (!showRead && a.status === 'read') return false;
    return true;
  });

  const unreadCount = state.alerts.filter((a) => a.status === 'unread').length;
  const criticalCount = state.alerts.filter((a) => a.type === 'critical' && a.status === 'unread').length;

  const markRead = async (id) => {
    await db.markAlertRead(id);
    dispatch({ type: 'MARK_ALERT_READ', payload: id });
  };
  const markAllRead = async () => {
    await db.markAllAlertsRead();
    dispatch({ type: 'MARK_ALL_ALERTS_READ' });
  };

  const timeAgo = (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="page alerts-page">
      <div className="page-header">
        <div>
          <h1>Alert Center</h1>
          <p>Monitor and manage warehouse alerts and notifications</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button className="btn btn-secondary" onClick={() => setShowRead(!showRead)}>
            {showRead ? <EyeOff size={16} /> : <Eye size={16} />}
            {showRead ? 'Hide Read' : 'Show All'}
          </button>
          <button className="btn btn-primary" onClick={markAllRead} disabled={unreadCount === 0}>
            <CheckCheck size={16} /> Mark All Read
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="alert-stats">
        <div className={`alert-stat-card ${criticalCount > 0 ? 'critical-pulse' : ''}`}>
          <AlertOctagon size={20} style={{ color: 'var(--color-accent-danger)' }} />
          <div>
            <span className="alert-stat-value">{criticalCount}</span>
            <span className="alert-stat-label">Critical</span>
          </div>
        </div>
        <div className="alert-stat-card">
          <AlertTriangle size={20} style={{ color: 'var(--color-accent-warning)' }} />
          <div>
            <span className="alert-stat-value">{state.alerts.filter((a) => a.type === 'warning' && a.status === 'unread').length}</span>
            <span className="alert-stat-label">Warnings</span>
          </div>
        </div>
        <div className="alert-stat-card">
          <Bell size={20} style={{ color: 'var(--color-accent-primary)' }} />
          <div>
            <span className="alert-stat-value">{unreadCount}</span>
            <span className="alert-stat-label">Unread</span>
          </div>
        </div>
        <div className="alert-stat-card">
          <CheckCheck size={20} style={{ color: 'var(--color-accent-success)' }} />
          <div>
            <span className="alert-stat-value">{state.alerts.length - unreadCount}</span>
            <span className="alert-stat-label">Resolved</span>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="alert-filters">
        {['all', 'critical', 'warning', 'info'].map((f) => (
          <button key={f} className={`alert-filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All Alerts' : SEVERITY_CONFIG[f]?.label || f}
            <span className="alert-filter-count">
              {f === 'all' ? state.alerts.length : state.alerts.filter((a) => a.type === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="alert-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <Bell size={48} />
            <h3>No alerts to display</h3>
            <p>All caught up! Adjust filters to see more alerts.</p>
          </div>
        ) : (
          filtered.map((alert, i) => {
            const config = SEVERITY_CONFIG[alert.type] || SEVERITY_CONFIG.info;
            const Icon = config.icon;
            const zone = alert.zones || zones.find((z) => z.id === alert.zone_id);
            return (
              <div
                key={alert.id}
                className={`alert-card ${alert.status === 'read' ? 'read' : 'unread'} alert-${alert.type}`}
                style={{ animationDelay: `${i * 60}ms` }}
                onClick={() => alert.status === 'unread' && markRead(alert.id)}
              >
                <div className="alert-icon-wrapper" style={{ background: config.bg, color: config.color }}>
                  <Icon size={20} />
                </div>
                <div className="alert-content">
                  <div className="alert-title-row">
                    <h3 className="alert-title">{alert.title}</h3>
                    {alert.status === 'unread' && <span className="alert-unread-dot"></span>}
                  </div>
                  <p className="alert-message">{alert.message}</p>
                  <div className="alert-meta">
                    <span className="alert-meta-item">
                      <Clock size={12} /> {timeAgo(alert.created_at)}
                    </span>
                    {zone && (
                      <span className="alert-meta-item">
                        <MapPin size={12} /> {zone?.name || ''}
                      </span>
                    )}
                    <span className={`badge badge-${alert.type === 'critical' ? 'danger' : alert.type === 'warning' ? 'warning' : 'info'}`} style={{ marginLeft: 'auto' }}>
                      {config.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
