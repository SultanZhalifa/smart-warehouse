import { useWarehouse } from '../../context/WarehouseContext';
import {
  Package, AlertTriangle, Camera, TrendingUp,
  Activity, Clock, Zap, ArrowUpRight, ArrowDownRight,
  Eye, Cpu, Bug
} from 'lucide-react';
import { StatusDot } from '../../components/icons/PestIcons';
import './DashboardPage.css';

const MAX_ACTIVITY = 8;
const SPECIES_PREVIEW = 3;

/**
 * KPI CARD COMPONENT
 * Reusable card for high-level warehouse metrics.
 */
function KPICard({ icon: Icon, label, value, subValue, change, changeType, color, delay }) {
  return (
    <div className="kpi-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="kpi-icon" style={{ background: `${color}15`, color: color }}>
        <Icon size={20} />
      </div>
      <div className="kpi-value">{value}</div>
      {subValue && <div className="kpi-subvalue">{subValue}</div>}
      <div className="kpi-label-group">
        <span className="kpi-label">{label}</span>
        {change && (
          <span className={`kpi-change ${changeType}`}>
            {changeType === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * CAMERA FEED COMPONENT
 * Simulates a live feed interface with scanning animations.
 */
function CameraFeed({ camera, index }) {
  const isOnline = camera?.status === 'online';
  const zoneName = camera?.zones?.name?.split('—')?.[0]?.trim() || 'Unknown Zone';

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
            <div className="camera-zone-badge">{zoneName}</div>
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
          {camera?.name ?? 'Unnamed Camera'}
        </div>
        <span className="camera-feed-res">{camera?.resolution ?? '-'}</span>
      </div>
    </div>
  );
}

/**
 * ACTIVITY ITEM COMPONENT
 * Displays real-time system events with type-specific coloring.
 */
function ActivityItem({ log, index }) {
  const typeColors = {
    detection: 'var(--color-accent-primary)',
    create: 'var(--color-accent-success)',
    update: 'var(--color-accent-info)',
    delete: 'var(--color-accent-danger)',
    alert: 'var(--color-accent-warning)',
    system: 'var(--color-text-tertiary)',
  };

  const time = log?.created_at
    ? new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  return (
    <div className="activity-item" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="activity-dot" style={{ background: typeColors[log?.type] || 'var(--color-text-tertiary)' }}></div>
      <div className="activity-content">
        <p className="activity-action">
          <strong>{log?.user_name || 'AI System'}</strong> {log?.action}
        </p>
        <p className="activity-target">{log?.target}</p>
      </div>
      <span className="activity-time">{time}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { state } = useWarehouse();

  // DESTUCTURING STATE FROM CONTEXT
  const { detectionStats, alerts, inventory, cameras, activityLog } = state;

  const allSpecies = ['Snake', 'Rat', 'Cat', 'Gecko', 'Cockroach', 'Spider'];
  const displayedSpecies = allSpecies.slice(0, SPECIES_PREVIEW).join(', ');
  const remainingCount = allSpecies.length - SPECIES_PREVIEW;

  // DATA FILTERING & CALCULATIONS
  const recentLogs = activityLog.slice(0, MAX_ACTIVITY);
  const unreadAlerts = alerts.filter(a => a?.status === 'unread');
  const totalInventory = inventory.reduce((sum, item) => sum + (item?.quantity ?? 0), 0);
  const camerasOnline = cameras.filter(c => c?.status === 'online').length;
  const camerasTotal = cameras.length;

  const cameraCoveragePercent = camerasTotal > 0 ? Math.round((camerasOnline / camerasTotal) * 100) : 0;
  const alertResponsePercent = alerts.length === 0 ? 100 : Math.round(((alerts.length - unreadAlerts.length) / alerts.length) * 100);

  return (
    <div className="page dashboard-page">
      {/* 1. KPI GRID - Real-time metrics */}
      <div className="kpi-grid">
        <KPICard
          icon={Bug}
          label="Pest Detections Today"
          value={detectionStats.today.toLocaleString()}
          change={detectionStats.today > 0 ? 'Active Monitoring' : 'No Threat'}
          changeType={detectionStats.today > 0 ? 'down' : 'up'}
          color="#d95459"
          delay={0}
        />
        <KPICard
          icon={Package}
          label="Total Inventory"
          value={totalInventory.toLocaleString()}
          change="Auto-Synced"
          changeType="up"
          color="#7c6cf0"
          delay={80}
        />
        <KPICard
          icon={AlertTriangle}
          label="Active Alerts"
          value={unreadAlerts.length}
          change={unreadAlerts.length > 0 ? 'Action Required' : 'Secure'}
          changeType={unreadAlerts.length > 0 ? 'down' : 'up'}
          color={unreadAlerts.length > 0 ? '#d95459' : '#10b981'}
          delay={160}
        />
        <KPICard
          icon={Camera}
          label="Cameras Online"
          value={camerasOnline}
          subValue={`of ${camerasTotal} total`}
          change={`${cameraCoveragePercent}% active`}
          changeType={camerasOnline === camerasTotal ? 'up' : 'down'}
          color="#3db8a9"
          delay={240}
        />
      </div>

      {/* 2. SYSTEM STATUS PILLS */}
      <div className="dashboard-stats-row">
        <div className="stat-pill"><Zap size={14} /> <span>Engine: <strong>YOLOv8</strong></span></div>
        <div className="stat-pill">
          <Clock size={14} />
          <span>Targets: <strong>{displayedSpecies}</strong> {remainingCount > 0 && `+${remainingCount} more`}</span>
        </div>
        <div className="stat-pill"><Activity size={14} /> <span>This Week: <strong>{detectionStats.week}</strong></span></div>
        <div className="stat-pill"><TrendingUp size={14} /> <span>Lifetime: <strong>{detectionStats.total}</strong></span></div>
      </div>

      {/* 3. MAIN CONTENT: CAMERAS & ACTIVITY */}
      <div className="dashboard-grid">
        <div className="dashboard-section cameras-section">
          <div className="section-header">
            <h2><Eye size={18} /> Live AI Feeds</h2>
            <span className="badge badge-success">Live Stream Active</span>
          </div>
          <div className="camera-grid">
            {cameras.map((camera, i) => <CameraFeed key={camera.id || i} camera={camera} index={i} />)}
          </div>
        </div>

        <div className="dashboard-section activity-section">
          <div className="section-header">
            <h2><Activity size={18} /> AI Event Log</h2>
          </div>
          <div className="activity-feed">
            {recentLogs.map((log, i) => <ActivityItem key={log.id || i} log={log} index={i} />)}
          </div>
        </div>
      </div>

      {/* 4. SYSTEM HEALTH - Dynamic Bars */}
      <div className="dashboard-section system-health-section">
        <div className="section-header"><h2><Cpu size={18} /> Autonomous Health</h2></div>
        <div className="health-grid">
          <HealthCard label="Inference Engine" status="Optimized" value={100} color="#10b981" />
          <HealthCard label="Database Sync" status="Real-time" value={100} color="#7c6cf0" />
          <HealthCard label="Camera Coverage" status={`${cameraCoveragePercent}%`} value={cameraCoveragePercent} color="#3db8a9" />
          <HealthCard label="Alert Response" status={`${alertResponsePercent}%`} value={alertResponsePercent} color="#e5a035" />
        </div>
      </div>
    </div>
  );
}

/**
 * HEALTH CARD COMPONENT
 * Renders a progress bar representing system stability.
 */
function HealthCard({ label, status, value, color }) {
  return (
    <div className="health-card">
      <div className="health-bar-label"><span>{label}</span><span style={{ color }}>{status}</span></div>
      <div className="health-bar"><div className="health-bar-fill" style={{ width: `${value}%`, background: color }}></div></div>
    </div>
  );
}