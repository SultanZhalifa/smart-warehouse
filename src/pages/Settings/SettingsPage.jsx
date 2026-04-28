import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWarehouse } from '../../context/WarehouseContext';
import {
  User, Mail, Shield, Key, Bell, Monitor, Palette,
  Save, Camera, Globe, Clock, Lock, Eye, EyeOff, CheckCircle
} from 'lucide-react';
import './SettingsPage.css';

export default function SettingsPage() {
  const { user } = useAuth();
  const { addToast } = useWarehouse();

  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);

  // Profile form state
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    studentId: user?.studentId || '',
    role: user?.role || '',
    bio: 'Warehouse management team member at President University.',
    phone: '+62 812 xxxx xxxx',
    timezone: 'Asia/Jakarta (UTC+7)',
  });

  // Notification prefs
  const [notifPrefs, setNotifPrefs] = useState({
    criticalAlerts: true,
    warnings: true,
    infoAlerts: false,
    detectionEvents: true,
    inventoryUpdates: true,
    systemUpdates: false,
    emailDigest: true,
    soundEnabled: true,
  });

  // Appearance prefs
  const [appearance, setAppearance] = useState({
    theme: 'dark',
    accentColor: '#4a90d9',
    compactMode: false,
    animations: true,
    showCameraOverlays: true,
    autoRefresh: true,
    refreshInterval: 30,
  });

  const handleSaveProfile = () => {
    addToast({ type: 'success', message: 'Profile updated successfully!' });
  };

  const handleSaveNotifications = () => {
    addToast({ type: 'success', message: 'Notification preferences saved!' });
  };

  const handleSaveAppearance = () => {
    addToast({ type: 'success', message: 'Appearance settings saved!' });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="page settings-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account and application preferences</p>
        </div>
      </div>

      <div className="settings-layout">
        {/* Tabs */}
        <div className="settings-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="settings-content">
          {/* ===== PROFILE TAB ===== */}
          {activeTab === 'profile' && (
            <div className="settings-section" style={{ animationDelay: '0ms' }}>
              <div className="settings-section-header">
                <h2>Profile Information</h2>
                <p>Update your personal details and contact information</p>
              </div>

              {/* Avatar Card */}
              <div className="profile-avatar-card">
                <div className="profile-avatar-large">
                  <span>{user?.avatar}</span>
                </div>
                <div className="profile-avatar-info">
                  <h3>{user?.name}</h3>
                  <span className={`badge badge-${user?.role === 'admin' ? 'info' : user?.role === 'manager' ? 'warning' : 'success'}`}>
                    <Shield size={11} /> {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </span>
                  <p className="profile-joined">Member since April 2026</p>
                </div>
                <button className="btn btn-secondary">
                  <Camera size={14} /> Change Avatar
                </button>
              </div>

              {/* Form */}
              <div className="settings-form">
                <div className="settings-form-row">
                  <div className="settings-field">
                    <label><User size={14} /> Full Name</label>
                    <input className="input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  </div>
                  <div className="settings-field">
                    <label><Mail size={14} /> Email Address</label>
                    <input className="input" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                  </div>
                </div>
                <div className="settings-form-row">
                  <div className="settings-field">
                    <label><Shield size={14} /> Student ID</label>
                    <input className="input" value={profile.studentId} disabled />
                  </div>
                  <div className="settings-field">
                    <label><Globe size={14} /> Phone</label>
                    <input className="input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                  </div>
                </div>
                <div className="settings-field">
                  <label><Clock size={14} /> Timezone</label>
                  <input className="input" value={profile.timezone} disabled />
                </div>
                <div className="settings-field">
                  <label>Bio</label>
                  <textarea className="input settings-textarea" rows={3} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
                </div>
                <button className="btn btn-primary" onClick={handleSaveProfile}>
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </div>
          )}

          {/* ===== NOTIFICATIONS TAB ===== */}
          {activeTab === 'notifications' && (
            <div className="settings-section" style={{ animationDelay: '0ms' }}>
              <div className="settings-section-header">
                <h2>Notification Preferences</h2>
                <p>Control which notifications you receive</p>
              </div>
              <div className="settings-toggles">
                {[
                  { key: 'criticalAlerts', label: 'Critical Alerts', desc: 'Unauthorized objects, system failures', important: true },
                  { key: 'warnings', label: 'Warnings', desc: 'Low stock, capacity warnings, temperature anomalies' },
                  { key: 'infoAlerts', label: 'Info Notifications', desc: 'Model updates, scheduled maintenance' },
                  { key: 'detectionEvents', label: 'Detection Events', desc: 'New object detections across all zones' },
                  { key: 'inventoryUpdates', label: 'Inventory Changes', desc: 'Stock additions, removals, and transfers' },
                  { key: 'systemUpdates', label: 'System Updates', desc: 'Camera status changes, model deployments' },
                  { key: 'emailDigest', label: 'Daily Email Digest', desc: 'Summary of all daily activities via email' },
                  { key: 'soundEnabled', label: 'Sound Alerts', desc: 'Play audio notification for critical events' },
                ].map((item) => (
                  <div key={item.key} className={`settings-toggle-row ${item.important ? 'important' : ''}`}>
                    <div className="settings-toggle-info">
                      <span className="settings-toggle-label">{item.label}</span>
                      <span className="settings-toggle-desc">{item.desc}</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifPrefs[item.key]}
                        onChange={(e) => setNotifPrefs({ ...notifPrefs, [item.key]: e.target.checked })}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" onClick={handleSaveNotifications}>
                <Save size={14} /> Save Preferences
              </button>
            </div>
          )}

          {/* ===== APPEARANCE TAB ===== */}
          {activeTab === 'appearance' && (
            <div className="settings-section" style={{ animationDelay: '0ms' }}>
              <div className="settings-section-header">
                <h2>Appearance</h2>
                <p>Customize the look and feel of the application</p>
              </div>

              {/* Theme */}
              <div className="settings-subsection">
                <h3>Theme</h3>
                <div className="theme-options">
                  {['dark', 'midnight', 'ocean'].map((t) => (
                    <button
                      key={t}
                      className={`theme-option ${appearance.theme === t ? 'active' : ''}`}
                      onClick={() => setAppearance({ ...appearance, theme: t })}
                    >
                      <div className={`theme-preview theme-${t}`}>
                        <div className="theme-preview-sidebar"></div>
                        <div className="theme-preview-content">
                          <div className="theme-preview-bar"></div>
                          <div className="theme-preview-cards">
                            <div></div><div></div>
                          </div>
                        </div>
                      </div>
                      <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                      {appearance.theme === t && <CheckCircle size={14} className="theme-check" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div className="settings-subsection">
                <h3>Accent Color</h3>
                <div className="accent-colors">
                  {[
                    { color: '#4a90d9', name: 'Blue' },
                    { color: '#7c6cf0', name: 'Purple' },
                    { color: '#3db8a9', name: 'Green' },
                    { color: '#f59e0b', name: 'Amber' },
                    { color: '#d95459', name: 'Red' },
                    { color: '#c86d99', name: 'Pink' },
                    { color: '#3b82f6', name: 'Blue' },
                  ].map((c) => (
                    <button
                      key={c.color}
                      className={`accent-option ${appearance.accentColor === c.color ? 'active' : ''}`}
                      style={{ '--accent': c.color }}
                      onClick={() => setAppearance({ ...appearance, accentColor: c.color })}
                      title={c.name}
                    >
                      <div className="accent-swatch" style={{ background: c.color }}></div>
                      {appearance.accentColor === c.color && <CheckCircle size={12} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="settings-toggles">
                {[
                  { key: 'animations', label: 'Enable Animations', desc: 'Smooth transitions and micro-animations' },
                  { key: 'compactMode', label: 'Compact Mode', desc: 'Reduce spacing for more content density' },
                  { key: 'showCameraOverlays', label: 'Camera Overlays', desc: 'Show detection bounding boxes on live feeds' },
                  { key: 'autoRefresh', label: 'Auto-Refresh Data', desc: 'Automatically update dashboard data' },
                ].map((item) => (
                  <div key={item.key} className="settings-toggle-row">
                    <div className="settings-toggle-info">
                      <span className="settings-toggle-label">{item.label}</span>
                      <span className="settings-toggle-desc">{item.desc}</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={appearance[item.key]}
                        onChange={(e) => setAppearance({ ...appearance, [item.key]: e.target.checked })}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" onClick={handleSaveAppearance}>
                <Save size={14} /> Save Appearance
              </button>
            </div>
          )}

          {/* ===== SECURITY TAB ===== */}
          {activeTab === 'security' && (
            <div className="settings-section" style={{ animationDelay: '0ms' }}>
              <div className="settings-section-header">
                <h2>Security</h2>
                <p>Manage your password and security settings</p>
              </div>

              <div className="settings-form">
                <div className="settings-field">
                  <label><Key size={14} /> Current Password</label>
                  <div className="password-field">
                    <input className="input" type={showPassword ? 'text' : 'password'} placeholder="Enter current password" />
                    <button className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="settings-form-row">
                  <div className="settings-field">
                    <label><Lock size={14} /> New Password</label>
                    <input className="input" type="password" placeholder="Enter new password" />
                  </div>
                  <div className="settings-field">
                    <label><Lock size={14} /> Confirm Password</label>
                    <input className="input" type="password" placeholder="Confirm new password" />
                  </div>
                </div>
                <button className="btn btn-primary" onClick={() => addToast({ type: 'success', message: 'Password updated!' })}>
                  <Save size={14} /> Update Password
                </button>
              </div>

              {/* Sessions */}
              <div className="settings-subsection" style={{ marginTop: 'var(--space-xl)' }}>
                <h3>Active Sessions</h3>
                <div className="session-list">
                  {[
                    { device: 'Windows PC — Chrome', location: 'Jakarta, Indonesia', time: 'Current session', current: true },
                    { device: 'MacBook Pro — Safari', location: 'Cikarang, Indonesia', time: '2 hours ago', current: false },
                  ].map((s, i) => (
                    <div key={i} className={`session-item ${s.current ? 'current' : ''}`}>
                      <Monitor size={18} />
                      <div className="session-info">
                        <span className="session-device">{s.device}</span>
                        <span className="session-meta">{s.location} · {s.time}</span>
                      </div>
                      {s.current ? (
                        <span className="badge badge-success"><CheckCircle size={11} /> Active</span>
                      ) : (
                        <button className="btn btn-secondary btn-sm" onClick={() => addToast({ type: 'info', message: 'Session revoked' })}>
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
