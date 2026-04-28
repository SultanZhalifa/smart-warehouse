import React, { useState, useEffect } from 'react';
import { 
  User, Bell, Palette, Shield, Camera, Save, RefreshCcw, Mail 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserData, updateProfileData } from '../../lib/database';
import './SettingsPage.css';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: ''
  });

  useEffect(() => {
    let isMounted = true;

    const loadUserData = async () => {
      // 1. Kasih timeout biar gak loading selamanya
      const timeout = setTimeout(() => {
        if (isMounted && loading) {
          console.warn("LOG [Settings]: Timeout reached. Forcing loader to stop.");
          setLoading(false);
        }
      }, 3500);

      if (!user?.uid) {
        console.log("LOG [Settings]: Menunggu Auth...");
        return;
      }

      try {
        console.log("LOG [Settings]: Fetching profile for UID:", user.uid);
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
          console.log("LOG [Settings]: Load Complete.");
        }
      } catch (error) {
        console.error("LOG [Settings]: Error fetching data:", error);
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
      alert('Settings saved!');
    } catch (err) {
      alert('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <RefreshCcw className="spinner" size={40} />
          <p>Connecting to Warehouse Network...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'profile':
        return (
          <div className="fade-in">
            <div className="profile-header-card">
              <div className="avatar-container">
                <div className="avatar-main">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <button className="avatar-edit-btn"><Camera size={16} /></button>
              </div>
              <div className="user-meta">
                <h3>{formData.name || 'Operator'}</h3>
                <span className="role-tag"><Shield size={12} /> System Admin</span>
              </div>
            </div>

            <form className="settings-form" onSubmit={handleSave}>
              <div className="form-grid">
                <div className="form-group">
                  <label><User size={14} /> Display Name</label>
                  <input 
                    type="text" className="form-input" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label><Mail size={14} /> Email</label>
                  <input type="text" className="form-input" value={user?.email || ''} disabled />
                </div>
                <div className="form-group full-width">
                  <label>Bio</label>
                  <textarea 
                    className="form-input" rows="3"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  />
                </div>
              </div>
              <button type="submit" className="btn-save" disabled={saving}>
                {saving ? <RefreshCcw className="spinner" size={16} /> : <Save size={16} />} Save
              </button>
            </form>
          </div>
        );
      case 'alerts': return <div className="fade-in"><h3>Alert Settings</h3><p>Notifications are active.</p></div>;
      case 'interface': return <div className="fade-in"><h3>Interface</h3><p>Dark mode is standard.</p></div>;
      case 'security': return <div className="fade-in"><h3>Security</h3><button className="btn-secondary">Reset Password</button></div>;
      default: return null;
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div className="header-content">
          <h1>System Settings</h1>
          <p>April 29, 2026</p>
        </div>
      </div>
      <div className="settings-layout">
        <aside className="settings-sidebar">
          <nav className="settings-tabs">
            <button className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}><User size={18}/> Profile</button>
            <button className={`settings-tab ${activeTab === 'alerts' ? 'active' : ''}`} onClick={() => setActiveTab('alerts')}><Bell size={18}/> Alerts</button>
            <button className={`settings-tab ${activeTab === 'interface' ? 'active' : ''}`} onClick={() => setActiveTab('interface')}><Palette size={18}/> Interface</button>
            <button className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}><Shield size={18}/> Security</button>
          </nav>
        </aside>
        <main className="settings-content">{renderContent()}</main>
      </div>
    </div>
  );
};

export default SettingsPage;