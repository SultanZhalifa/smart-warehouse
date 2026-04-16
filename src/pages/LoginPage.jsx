import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Warehouse, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import './LoginPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const result = login(email, password);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  const quickLogin = (email) => {
    setEmail(email);
    setPassword('admin123');
  };

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-bg-orb login-bg-orb-1"></div>
        <div className="login-bg-orb login-bg-orb-2"></div>
        <div className="login-bg-orb login-bg-orb-3"></div>
        <div className="login-grid"></div>
      </div>

      <div className="login-container">
        {/* Left — Branding */}
        <div className="login-branding">
          <div className="login-brand-content">
            <div className="login-brand-icon">
              <Warehouse size={40} />
            </div>
            <h1 className="login-brand-title">
              Smart<span>Warehouse</span>
            </h1>
            <p className="login-brand-subtitle">
              AI-Powered Object Detection & Inventory Management System
            </p>
            <div className="login-brand-features">
              <div className="login-brand-feature">
                <div className="login-feature-dot"></div>
                <span>Real-time object detection with 97.3% accuracy</span>
              </div>
              <div className="login-brand-feature">
                <div className="login-feature-dot"></div>
                <span>6 warehouse zones with live monitoring</span>
              </div>
              <div className="login-brand-feature">
                <div className="login-feature-dot"></div>
                <span>Automated inventory tracking & alerts</span>
              </div>
              <div className="login-brand-feature">
                <div className="login-feature-dot"></div>
                <span>Advanced analytics & reporting dashboard</span>
              </div>
            </div>
          </div>
          <div className="login-brand-footer">
            <p>© 2026 SmartWarehouse — President University</p>
            <p>Software Engineering Project — Group 5</p>
          </div>
        </div>

        {/* Right — Form */}
        <div className="login-form-section">
          <div className="login-form-wrapper">
            <div className="login-form-header">
              <Shield size={20} className="login-shield" />
              <h2>Welcome Back</h2>
              <p>Sign in to access the warehouse management system</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && (
                <div className="login-error">
                  <span>{error}</span>
                </div>
              )}

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  placeholder="name@warehouse.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="login-password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`btn btn-primary btn-lg login-submit ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <div className="login-spinner"></div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Quick access */}
            <div className="login-quick">
              <p className="login-quick-label">Quick Access (Demo)</p>
              <div className="login-quick-buttons">
                <button className="login-quick-btn" onClick={() => quickLogin('risly@warehouse.io')}>
                  <span className="login-quick-avatar">RW</span>
                  <div>
                    <span className="login-quick-name">Risly</span>
                    <span className="login-quick-role">Admin</span>
                  </div>
                </button>
                <button className="login-quick-btn" onClick={() => quickLogin('misha@warehouse.io')}>
                  <span className="login-quick-avatar" style={{ background: 'var(--gradient-success)' }}>MA</span>
                  <div>
                    <span className="login-quick-name">Misha</span>
                    <span className="login-quick-role">Manager</span>
                  </div>
                </button>
                <button className="login-quick-btn" onClick={() => quickLogin('fathir@warehouse.io')}>
                  <span className="login-quick-avatar" style={{ background: 'var(--gradient-danger)' }}>FB</span>
                  <div>
                    <span className="login-quick-name">Fathir</span>
                    <span className="login-quick-role">Operator</span>
                  </div>
                </button>
                <button className="login-quick-btn" onClick={() => quickLogin('sultan@warehouse.io')}>
                  <span className="login-quick-avatar" style={{ background: 'linear-gradient(135deg, #fbbf24, #f97316)' }}>SM</span>
                  <div>
                    <span className="login-quick-name">Sultan</span>
                    <span className="login-quick-role">Admin</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
