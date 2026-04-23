import { useWarehouse } from '../context/WarehouseContext';
import { DETECTION_STATS, CAMERAS, CHART_DATA } from '../data/mockData';
import {
  ScanSearch, Package, AlertTriangle, Camera, TrendingUp,
  Activity, Clock, Zap, ArrowUpRight, ArrowDownRight,
  Box, Eye, Shield, Cpu
} from 'lucide-react';
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
            {/* Simulated detection boxes */}
            {index % 2 === 0 && (
              <div className="camera-detect-box" style={{ left: '15%', top: '30%', width: '30%', height: '40%' }}>
                <span className="camera-detect-label">Box 97%</span>
              </div>
            )}
            {index % 3 === 0 && (
              <div className="camera-detect-box detect-yellow" style={{ left: '55%', top: '20%', width: '25%', height: '50%' }}>
                <span className="camera-detect-label">Pallet 94%</span>
              </div>
            )}
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
          <span className={`status-dot ${isOnline ? 'online' : 'danger'}`}></span>
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

  const time = new Date(log.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="activity-item" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="activity-dot" style={{ background: typeColors[log.type] || 'var(--color-text-tertiary)' }}></div>
      <div className="activity-content">
        <p className="activity-action">
          <strong>{log.user}</strong> {log.action}
        </p>
        <p className="activity-target">{log.target}</p>
      </div>
      <span className="activity-time">{time}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { state } = useWarehouse();
  const stats = DETECTION_STATS;
  const recentLogs = state.activityLog.slice(0, 8);
  const criticalAlerts = state.alerts.filter((a) => a.type === 'critical' && !a.read);

  const totalInventory = state.inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = state.inventory.filter((i) => i.status === 'low-stock' || i.status === 'out-of-stock').length;

  return (
    <div className="page dashboard-page">
      {/* KPI Cards */}
      <div className="grid-4 kpi-grid">
        <KPICard
          icon={ScanSearch}
          label="Detections Today"
          value={stats.today.toLocaleString()}
          change="13.1%"
          changeType="up"
          color="#4a90d9"
          delay={0}
        />
        <KPICard
          icon={Package}
          label="Total Inventory"
          value={totalInventory.toLocaleString()}
          change="3.2%"
          changeType="up"
          color="#7c6cf0"
          delay={80}
        />
        <KPICard
          icon={AlertTriangle}
          label="Active Alerts"
          value={criticalAlerts.length}
          change={criticalAlerts.length > 0 ? 'Action needed' : 'All clear'}
          changeType={criticalAlerts.length > 0 ? 'down' : 'up'}
          color={criticalAlerts.length > 0 ? '#d95459' : '#10b981'}
          delay={160}
        />
        <KPICard
          icon={Camera}
          label="Cameras Online"
          value={`${stats.camerasOnline}/${stats.camerasTotal}`}
          change={`${Math.round((stats.camerasOnline / stats.camerasTotal) * 100)}%`}
          changeType={stats.camerasOnline === stats.camerasTotal ? 'up' : 'down'}
          color="#3db8a9"
          delay={240}
        />
      </div>

      {/* Stats Row */}
      <div className="dashboard-stats-row">
        <div className="stat-pill">
          <Zap size={14} />
          <span>Accuracy: <strong>{stats.accuracy}%</strong></span>
        </div>
        <div className="stat-pill">
          <Clock size={14} />
          <span>Avg Processing: <strong>{stats.avgProcessingTime}ms</strong></span>
        </div>
        <div className="stat-pill">
          <Activity size={14} />
          <span>This Week: <strong>{stats.week.toLocaleString()}</strong> detections</span>
        </div>
        <div className="stat-pill">
          <TrendingUp size={14} />
          <span>This Month: <strong>{stats.month.toLocaleString()}</strong> detections</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Camera Feeds */}
        <div className="dashboard-section cameras-section">
          <div className="section-header">
            <h2><Eye size={18} /> Live Camera Feeds</h2>
            <span className="badge badge-success">
              <span className="status-dot online"></span>
              {stats.camerasOnline} Online
            </span>
          </div>
          <div className="camera-grid">
            {CAMERAS.map((camera, i) => (
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
            {recentLogs.map((log, i) => (
              <ActivityItem key={log.id} log={log} index={i} />
            ))}
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
                <span>CPU Usage</span>
                <span>34%</span>
              </div>
              <div className="health-bar">
                <div className="health-bar-fill" style={{ width: '34%', background: 'var(--gradient-success)' }}></div>
              </div>
            </div>
          </div>
          <div className="health-card">
            <div className="health-bar-wrapper">
              <div className="health-bar-label">
                <span>Memory</span>
                <span>62%</span>
              </div>
              <div className="health-bar">
                <div className="health-bar-fill" style={{ width: '62%', background: 'var(--gradient-primary)' }}></div>
              </div>
            </div>
          </div>
          <div className="health-card">
            <div className="health-bar-wrapper">
              <div className="health-bar-label">
                <span>GPU (Detection)</span>
                <span>78%</span>
              </div>
              <div className="health-bar">
                <div className="health-bar-fill" style={{ width: '78%', background: 'var(--gradient-secondary)' }}></div>
              </div>
            </div>
          </div>
          <div className="health-card">
            <div className="health-bar-wrapper">
              <div className="health-bar-label">
                <span>Storage</span>
                <span>45%</span>
              </div>
              <div className="health-bar">
                <div className="health-bar-fill" style={{ width: '45%', background: 'linear-gradient(90deg, #3db8a9, #e5a035)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
