import { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import { exportToCSV } from '../utils/exportUtils';
import {
  ClipboardList, Search, Filter, Download, RefreshCw,
  Eye, Edit3, Trash2, Plus, Upload, Shield, AlertTriangle,
  CheckCircle, ScanSearch, FileText, UserCheck
} from 'lucide-react';
import './ActivityPage.css';

const TYPE_CONFIG = {
  detection: { icon: ScanSearch, color: 'var(--color-accent-primary)', label: 'Detection' },
  create: { icon: Plus, color: 'var(--color-accent-success)', label: 'Create' },
  update: { icon: Edit3, color: 'var(--color-accent-info)', label: 'Update' },
  delete: { icon: Trash2, color: 'var(--color-accent-danger)', label: 'Delete' },
  alert: { icon: AlertTriangle, color: 'var(--color-accent-warning)', label: 'Alert' },
  export: { icon: Download, color: 'var(--color-accent-secondary)', label: 'Export' },
  system: { icon: Shield, color: 'var(--color-text-tertiary)', label: 'System' },
  approval: { icon: UserCheck, color: 'var(--color-accent-success)', label: 'Approval' },
};

export default function ActivityPage() {
  const { state } = useWarehouse();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = state.activityLog.filter((log) => {
    const matchSearch = log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || log.type === typeFilter;
    return matchSearch && matchType;
  });

  const types = ['all', ...new Set(state.activityLog.map((l) => l.type))];

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="page activity-page">
      <div className="page-header">
        <div>
          <h1>Activity Log</h1>
          <p>Complete audit trail of all system activities</p>
        </div>
        <button className="btn btn-secondary" onClick={() => {
          exportToCSV(filtered, 'activity_log_export', [
            { key: 'id', label: 'ID' }, { key: 'user', label: 'User' },
            { key: 'action', label: 'Action' }, { key: 'target', label: 'Target' },
            { key: 'timestamp', label: 'Timestamp' }, { key: 'type', label: 'Type' },
          ]);
        }}>
          <Download size={16} /> Export Log
        </button>
      </div>

      {/* Filters */}
      <div className="activity-filters">
        <div className="activity-search">
          <Search size={16} />
          <input
            type="text"
            className="input"
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="activity-type-filters">
          {types.map((t) => {
            const config = TYPE_CONFIG[t];
            return (
              <button
                key={t}
                className={`activity-type-btn ${typeFilter === t ? 'active' : ''}`}
                onClick={() => setTypeFilter(t)}
              >
                {config && <config.icon size={13} />}
                {t === 'all' ? 'All' : config?.label || t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="activity-timeline">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <ClipboardList size={48} />
            <h3>No activities found</h3>
            <p>Try adjusting your search or filter</p>
          </div>
        ) : (
          filtered.map((log, i) => {
            const config = TYPE_CONFIG[log.type] || TYPE_CONFIG.system;
            const Icon = config.icon;
            return (
              <div key={log.id} className="timeline-item" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="timeline-line"></div>
                <div className="timeline-icon" style={{ background: `${config.color}15`, color: config.color }}>
                  <Icon size={16} />
                </div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className="timeline-user">{log.user}</span>
                    <span className="timeline-time">{formatTime(log.timestamp)}</span>
                  </div>
                  <p className="timeline-action">{log.action}</p>
                  <p className="timeline-target">{log.target}</p>
                  <span className={`badge badge-${log.type === 'delete' ? 'danger' : log.type === 'alert' ? 'warning' : log.type === 'create' || log.type === 'approval' ? 'success' : 'info'}`}>
                    {config.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary footer */}
      <div className="activity-summary">
        <span>Showing {filtered.length} of {state.activityLog.length} activities</span>
      </div>
    </div>
  );
}
