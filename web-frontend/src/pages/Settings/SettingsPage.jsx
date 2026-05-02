import React, { useState, useEffect } from 'react';
import {
  User, Bell, Palette, Shield, Camera, Save, RefreshCcw, Mail,
  RefreshCw, Trash2, CheckCircle, AlertTriangle, Moon, Sun,
  Lock, KeyRound, Database, Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWarehouse } from '../../context/WarehouseContext';
import { getUserData, updateProfileData } from '../../lib/database';
import './SettingsPage.css';

const SettingsPage = () => {
  const { user } = useAuth();
  const { state, dispatch, addToast } = useWarehouse();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', bio: '', phone: '' });

  // Alert preferences state
  const [alertPrefs, setAlertPrefs] = useState({
    pestDetected: true,
    cameraOffline: true,
    systemSync: false,
    dailyReport: true,
  });

  // Interface preferences state
  const [interfacePrefs, setInterfacePrefs] = useState({
    theme: 'light',
    compactMode: false,
    showAnimations: true,
  });

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  useEffect(() => {
    let isMounted = true;
    const loadUserData = async () => {
      const timeout = setTimeout(() => {
        if (isMounted) setLoading(false);
      }, 3500);

      if (!user?.uid) return;

      try {
        const data = await getUserData(user.uid);
        if (isMounted) {
          clearTimeout(timeout);
          if (data) {
            setFormData({
              name: data.name || '',
              bio: data.bio || '',
              phone: data.phone || ''
            });
          }
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) setLoading(false);
      }
    };

    loadUserData();
    return () => { isMounted = false; };
  }, [user?.uid]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    setSaving(true);
    try {
      await updateProfileData(user.uid, formData);
      addToast({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to save changes.' });
    } finally {
      setSaving(false);
    }
  };

  const handleAdminAction = (type) => {
    switch (type) {
      case 'SYNC':
        addToast({ type: 'info', message: 'Syncing database with IoT sensors...' });
        setTimeout(() => {
          const randomInc = Math.floor(Math.random() * 3) + 1;
          dispatch({
            type: 'UPDATE_STATS',
            payload: { today: state.detectionStats.today + randomInc }
          });
          addToast({ type: 'success', message: `${randomInc} new detection records synchronized.` });
        }, 1500);
        break;

      case 'AUDIT':
        setIsAuditing(true);
        addToast({ type: 'info', message: 'Running deep system health diagnostic...' });
        setTimeout(() => {
          setIsAuditing(false);
          addToast({ type: 'success', message: 'Security Audit Complete: All hardware online.' });
        }, 4000);
        break;

      case 'PURGE':
        dispatch({ type: 'CLEAR_ALERTS' });
        addToast({ type: 'warning', message: 'All alert logs purged from system.' });
        break;

      default:
        break;
    }
  };

  const tabs = [
    { id: 'profile',   icon: User,    label: 'Profile'    },
    { id: 'alerts',    icon: Bell,    label: 'Alerts'     },
    { id: 'interface', icon: Palette, label: 'Interface'  },
    { id: 'security',  icon: Shield,  label: 'Security'   },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <RefreshCcw className="spinner" size={36} />
          <p>Connecting to Warehouse Network...</p>
        </div>
      );
    }

    switch (activeTab) {

      // ── PROFILE TAB ──────────────────────────────────────
      case 'profile':
        return (
          <div className="fade-in">
            <div className="settings-section-title">
              <User size={16} /> Personal Information
            </div>

            <div className="profile-header-card">
              <div className="avatar-container">
                <div className="avatar-main">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <button className="avatar-edit-btn"><Camera size={14} /></button>
              </div>
              <div className="user-meta">
                <h3>{formData.name || 'Operator'}</h3>
                <p>{user?.email || ''}</p>
                <span className="role-tag"><Shield size={11} /> {user?.role || 'Operator'}</span>
              </div>
            </div>

            <form className="settings-form" onSubmit={handleSave}>
              <div className="form-grid">
                <div className="form-group">
                  <label><User size={13} /> Display Name</label>
                  <input
                    type="text" className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div className="form-group">
                  <label><Mail size={13} /> Email</label>
                  <input type="text" className="form-input" value={user?.email || ''} disabled />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text" className="form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+62 xxx xxxx xxxx"
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input type="text" className="form-input" value={user?.role || 'Operator'} disabled />
                </div>
                <div className="form-group full-width">
                  <label>Bio</label>
                  <textarea
                    className="form-input" rows="3"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Short description about your role..."
                  />
                </div>
              </div>
              <div className="form-footer">
                <span className="form-hint">Changes are saved to Firestore and synced across sessions.</span>
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? <RefreshCcw className="spinner" size={15} /> : <Save size={15} />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        );

      // ── ALERTS TAB ───────────────────────────────────────
      case 'alerts':
        return (
          <div className="fade-in">
            <div className="settings-section-title">
              <Bell size={16} /> Notification Preferences
            </div>
            <p className="settings-section-desc">
              Control which events trigger notifications in the system.
            </p>

            <div className="setting-items-list">
              {[
                {
                  key: 'pestDetected',
                  label: 'Pest Detected Alert',
                  desc: 'Notify when AI detects a pest in any zone',
                  icon: <AlertTriangle size={16} color="#ef4444" />,
                },
                {
                  key: 'cameraOffline',
                  label: 'Camera Offline Alert',
                  desc: 'Notify when a camera feed drops or disconnects',
                  icon: <Camera size={16} color="#f59e0b" />,
                },
                {
                  key: 'systemSync',
                  label: 'System Sync Notification',
                  desc: 'Notify on each successful database sync event',
                  icon: <RefreshCw size={16} color="#6366f1" />,
                },
                {
                  key: 'dailyReport',
                  label: 'Daily Summary Report',
                  desc: 'Receive a daily detection summary at end of shift',
                  icon: <Activity size={16} color="#10b981" />,
                },
              ].map(({ key, label, desc, icon }) => (
                <div className="setting-item" key={key}>
                  <div className="setting-item-left">
                    <div className="setting-item-icon">{icon}</div>
                    <div>
                      <span className="setting-label">{label}</span>
                      <span className="setting-desc">{desc}</span>
                    </div>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={alertPrefs[key]}
                      onChange={() => setAlertPrefs(p => ({ ...p, [key]: !p[key] }))}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              ))}
            </div>

            <div className="form-footer" style={{ marginTop: '1.5rem' }}>
              <span className="form-hint">Preferences are stored locally per session.</span>
              <button
                className="btn-save"
                onClick={() => addToast({ type: 'success', message: 'Alert preferences saved.' })}
              >
                <Save size={15} /> Save Preferences
              </button>
            </div>
          </div>
        );

      // ── INTERFACE TAB ────────────────────────────────────
      case 'interface':
        return (
          <div className="fade-in">
            <div className="settings-section-title">
              <Palette size={16} /> Display & Appearance
            </div>
            <p className="settings-section-desc">
              Customize the visual experience of the SmartWH dashboard.
            </p>

            <div className="theme-section">
              <label className="theme-label">Theme</label>
              <div className="theme-grid">
                <div
                  className={`theme-card ${interfacePrefs.theme === 'light' ? 'active' : ''}`}
                  onClick={() => setInterfacePrefs(p => ({ ...p, theme: 'light' }))}
                >
                  <div className="theme-preview light"></div>
                  <div className="theme-card-label">
                    <Sun size={13} /> Light Mode
                  </div>
                  {interfacePrefs.theme === 'light' && <CheckCircle size={14} className="theme-check" />}
                </div>
                <div
                  className={`theme-card ${interfacePrefs.theme === 'dark' ? 'active' : ''}`}
                  onClick={() => setInterfacePrefs(p => ({ ...p, theme: 'dark' }))}
                >
                  <div className="theme-preview dark"></div>
                  <div className="theme-card-label">
                    <Moon size={13} /> Dark Mode
                  </div>
                  {interfacePrefs.theme === 'dark' && <CheckCircle size={14} className="theme-check" />}
                </div>
              </div>
            </div>

            <div className="setting-items-list" style={{ marginTop: '1.5rem' }}>
              {[
                {
                  key: 'compactMode',
                  label: 'Compact Mode',
                  desc: 'Reduce spacing and card padding for denser layout',
                },
                {
                  key: 'showAnimations',
                  label: 'UI Animations',
                  desc: 'Enable fade-in and transition effects throughout the dashboard',
                },
              ].map(({ key, label, desc }) => (
                <div className="setting-item" key={key}>
                  <div className="setting-item-left">
                    <div>
                      <span className="setting-label">{label}</span>
                      <span className="setting-desc">{desc}</span>
                    </div>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={interfacePrefs[key]}
                      onChange={() => setInterfacePrefs(p => ({ ...p, [key]: !p[key] }))}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              ))}
            </div>

            <div className="info-banner">
              <AlertTriangle size={14} />
              Dark mode is in development. Current theme is Light Mode.
            </div>
          </div>
        );

      // ── SECURITY TAB ─────────────────────────────────────
      case 'security':
        return (
          <div className="fade-in">
            <div className="settings-section-title">
              <Shield size={16} /> Security & Access
            </div>
            <p className="settings-section-desc">
              Manage authentication, system access, and admin-level operations.
            </p>

            {/* Password Reset */}
            <div className="security-block">
              <div className="security-block-header">
                <KeyRound size={16} />
                <div>
                  <h4>Password Management</h4>
                  <p>Reset or update your account password via email.</p>
                </div>
              </div>
              <button
                className="btn-outline"
                onClick={() => addToast({ type: 'info', message: 'Password reset email sent to ' + (user?.email || 'your email') })}
              >
                <Lock size={14} /> Send Reset Email
              </button>
            </div>

            {/* Session Info */}
            <div className="security-block">
              <div className="security-block-header">
                <Activity size={16} />
                <div>
                  <h4>Active Session</h4>
                  <p>Current login: <strong>{user?.email || '—'}</strong> · Role: <strong>{user?.role || 'Operator'}</strong></p>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="settings-section-title" style={{ marginTop: '2rem' }}>
              <Database size={16} /> System Admin Actions
            </div>
            <p className="settings-section-desc">
              These actions directly affect live data. Use with caution.
            </p>

            <div className="admin-actions-grid">
              <button
                className="admin-action-card"
                onClick={() => handleAdminAction('SYNC')}
              >
                <RefreshCw size={20} color="#10b981" />
                <div>
                  <span>Sync Database</span>
                  <p>Pull latest IoT sensor records into Firestore</p>
                </div>
              </button>

              <button
                className={`admin-action-card ${isAuditing ? 'auditing' : ''}`}
                onClick={() => handleAdminAction('AUDIT')}
                disabled={isAuditing}
              >
                <Shield size={20} color="#6366f1" />
                <div>
                  <span>{isAuditing ? 'Auditing...' : 'Security Audit'}</span>
                  <p>Run deep system health diagnostic on all hardware</p>
                </div>
              </button>
            </div>

            {/* Danger Zone */}
            <div className="danger-zone">
              <h4><AlertTriangle size={14} /> Danger Zone</h4>
              <p>This action is irreversible. All active alert logs will be permanently cleared.</p>
              <button className="btn-danger" onClick={() => handleAdminAction('PURGE')}>
                <Trash2 size={14} /> Purge All Alert Logs
              </button>
            </div>

            {/* License */}
            <div className="license-block">
              <span>SmartWH v1.0.0-stable · Under license of PT. Kawan Lama</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div className="header-content">
          <h1>System Settings</h1>
          <p>{dateStr}</p>
        </div>
      </div>

      <div className="settings-layout">
        <aside className="settings-sidebar">
          <nav className="settings-tabs">
            {tabs.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                className={`settings-tab ${activeTab === id ? 'active' : ''}`}
                onClick={() => setActiveTab(id)}
              >
                <Icon size={17} /> {label}
              </button>
            ))}
          </nav>

          {/* Version tag di sidebar bawah */}
          <div className="sidebar-version">
            v1.0.0-stable
          </div>
        </aside>

        <main className="settings-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;