import { useWarehouse } from '../../context/WarehouseContext';
import {
  ScanSearch, Package, AlertTriangle, Camera, TrendingUp,
  Activity, Clock, Zap, ArrowUpRight, ArrowDownRight,
  Eye, Shield, Cpu, Bug
} from 'lucide-react';
import { SnakeIcon, CatIcon, GeckoIcon, StatusDot } from '../../components/icons/PestIcons';
import './DashboardPage.css';

function KPICard({ icon: Icon, label, value, change, changeType, color, delay }) {
  return (
    <div className="kpi-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="kpi-card-top">
        <div className="kpi-icon" style={{ background: `${color}15`, color: color, boxShadow: `0 0 20px ${color}20` }}>
          <Icon size={20} />
        </div>
        {change && (
          <span className={`kpi-change ${changeType}`}>
            {changeType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {change}
          </span>
        )}
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-card-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${color}08, transparent 70%)` }}></div>
    </div>
  );
}

function CameraFeed({ camera, index }) {
  const isOnline = camera.status === 'online';
  const zoneName = camera.zones?.name || 'Unknown Zone';
  
  return (
    <div className={`camera-feed ${!isOnline ? 'offline' : ''}`} style={{ animationDelay: `${index * 80}ms` }}>
      <div className="camera-feed-display">
        {isOnline ? (
          <>
            <div className="camera-scanline"></div>
            <div className="camera-grid-overlay"></div>
            <div className="camera-corner camera-corner-tl"></div>
            <div className="camera-corner camera-corner-tr"></div>
            <div className="camera-corner camera-corner-bl"></div>
            <div className="camera-corner camera-corner-br"></div>
            {/* Zone badge */}
            <div className="camera-zone-badge">{zoneName.split('\u2014')[0]?.trim()}</div>
          </>
        ) : (
          <div className="camera-offline-text">
            <Camera size={24} />
            <span>OFFLINE</span>
          </div>
        )}
      </div>
      <div className="camera-feed-info">
        <div className="camera-feed-name">
          <StatusDot status={isOnline ? 'online' : 'offline'} />
          {camera.name}
        </div>
        <span className="camera-feed-res">{camera.resolution}</span>
      </div>
    </div>
  );
}

function ActivityItem({ log, index }) {
  const typeColors = {
    detection: 'var(--color-accent-primary)',
    create: 'var(--color-accent-success)',
    update: 'var(--color-accent-info)',
    delete: 'var(--color-accent-danger)',
    alert: 'var(--color-accent-warning)',
    export: 'var(--color-accent-secondary)',
    system: 'var(--color-text-tertiary)',
    approval: 'var(--color-accent-success)',
  };

  const time = new Date(log.created_at).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="activity-item" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="activity-dot" style={{ background: typeColors[log.type] || 'var(--color-text-tertiary)' }}></div>
      <div className="activity-content">
        <p className="activity-action">
          <strong>{log.user_name || 'System'}</strong> {log.action}
        </p>
        <p className="activity-target">{log.target}</p>
      </div>
      <span className="activity-time">{time}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { state } = useWarehouse();
  const stats = state.detectionStats;
  const recentLogs = state.activityLog.slice(0, 8);
  const unreadAlerts = state.alerts.filter((a) => a.status === 'unread');

  const totalInventory = state.inventory.reduce((sum, item) => sum + item.quantity, 0);
  const camerasOnline = stats.camerasOnline || state.cameras.filter(c => c.status === 'online').length;
  const camerasTotal = stats.camerasTotal || state.cameras.length;

  return (
    <div className="page dashboard-page">
      {/* KPI Cards */}
      <div className="grid-4 kpi-grid">
        <KPICard
          icon={Bug}
          label="Pest Detections Today"
          value={stats.today.toLocaleString()}
          change={stats.today > 0 ? 'Active' : 'Clear'}
          changeType={stats.today > 0 ? 'down' : 'up'}
          color="#d95459"
          delay={0}
        />
        <KPICard
          icon={Package}
          label="Total Inventory"
          value={totalInventory.toLocaleString()}
          change={totalInventory > 0 ? 'Tracked' : 'Empty'}
          changeType="up"
          color="#7c6cf0"
          delay={80}
        />
        <KPICard
          icon={AlertTriangle}
          label="Active Alerts"
          value={unreadAlerts.length}
          change={unreadAlerts.length > 0 ? 'Action needed' : 'All clear'}
          changeType={unreadAlerts.length > 0 ? 'down' : 'up'}
          color={unreadAlerts.length > 0 ? '#d95459' : '#10b981'}
          delay={160}
        />
        <KPICard
          icon={Camera}
          label="Cameras Online"
          value={`${camerasOnline}/${camerasTotal}`}
          change={camerasTotal > 0 ? `${Math.round((camerasOnline / camerasTotal) * 100)}%` : '0%'}
          changeType={camerasOnline === camerasTotal ? 'up' : 'down'}
          color="#3db8a9"
          delay={240}
        />
      </div>

      {/* Stats Row */}
      <div className="dashboard-stats-row">
        <div className="stat-pill">
          <Zap size={14} />
          <span>Model: <strong>YOLOv8</strong></span>
        </div>
        <div className="stat-pill">
          <Clock size={14} />
          <span>Target Species: <strong>Snake, Cat, Gecko</strong></span>
        </div>
        <div className="stat-pill">
          <Activity size={14} />
          <span>This Week: <strong>{stats.week.toLocaleString()}</strong> detections</span>
        </div>
        <div className="stat-pill">
          <TrendingUp size={14} />
          <span>Total: <strong>{stats.total.toLocaleString()}</strong> detections</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Camera Feeds */}
        <div className="dashboard-section cameras-section">
          <div className="section-header">
            <h2><Eye size={18} /> Live Camera Feeds</h2>
            <span className="badge badge-success">
              <span className="status-dot online"></span>
              {camerasOnline} Online
            </span>
          </div>
          <div className="camera-grid">
            {state.cameras.map((camera, i) => (
              <CameraFeed key={camera.id} camera={camera} index={i} />
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="dashboard-section activity-section">
          <div className="section-header">
            <h2><Activity size={18} /> Recent Activity</h2>
            <span className="badge badge-primary">{state.activityLog.length} events</span>
          </div>
          <div className="activity-feed">
            {recentLogs.length > 0 ? (
              recentLogs.map((log, i) => (
                <ActivityItem key={log.id} log={log} index={i} />
              ))
            ) : (
              <div className="empty-state-mini">
                <Activity size={32} />
                <p>No activity yet</p>
                <span>Activity will appear here as you use the system</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="dashboard-section system-health-section">
        <div className="section-header">
          <h2><Cpu size={18} /> System Health</h2>
        </div>
        <div className="health-grid">
          <div className="health-card">
            <div className="health-bar-wrapper">
              <div className="health-bar-label">
                <span>AI Model Status</span>
                <span style={{ color: '#10b981' }}>Active</span>
              </div>
              <div className="health-bar">
                <div className="health-bar-fill" style={{ width: '100%', background: 'var(--gradient-success)' }}></div>
              </div>
            </div>
          </div>
          <div className="health-card">
            <div className="health-bar-wrapper">
              <div className="health-bar-label">
                <span>Database Connection</span>
                <span style={{ color: '#10b981' }}>Connected</span>
              </div>
              <div className="health-bar">
                <div className="health-bar-fill" style={{ width: '100%', background: 'var(--gradient-primary)' }}></div>
              </div>
            </div>
          </div>
          <div className="health-card">
            <div className="health-bar-wrapper">
              <div className="health-bar-label">
                <span>Camera Coverage</span>
                <span>{camerasTotal > 0 ? Math.round((camerasOnline / camerasTotal) * 100) : 0}%</span>
              </div>
              <div className="health-bar">
                <div className="health-bar-fill" style={{ width: `${camerasTotal > 0 ? Math.round((camerasOnline / camerasTotal) * 100) : 0}%`, background: 'var(--gradient-secondary)' }}></div>
              </div>
            </div>
          </div>
          <div className="health-card">
            <div className="health-bar-wrapper">
              <div className="health-bar-label">
                <span>Alert Response</span>
                <span>{unreadAlerts.length === 0 ? '100%' : `${Math.round(((state.alerts.length - unreadAlerts.length) / Math.max(state.alerts.length, 1)) * 100)}%`}</span>
              </div>
              <div className="health-bar">
                <div className="health-bar-fill" style={{ width: `${unreadAlerts.length === 0 ? 100 : Math.round(((state.alerts.length - unreadAlerts.length) / Math.max(state.alerts.length, 1)) * 100)}%`, background: 'linear-gradient(90deg, #3db8a9, #e5a035)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
