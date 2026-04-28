import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Warehouse, Eye, EyeOff, ArrowRight, UserPlus, Mail, KeyRound } from 'lucide-react';
import './LoginPage.css';

export default function LoginPage() {
  const { login, register, resetPassword } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'forgot') {
        if (!email.trim()) {
          setError('Please enter your email address');
          setLoading(false);
          return;
        }
        const result = await resetPassword(email);
        if (!result.success) {
          setError(result.error);
        } else {
          setSuccess('Password reset link sent! Check your email inbox.');
        }
      } else if (mode === 'register') {
        if (!fullName.trim()) {
          setError('Full name is required');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        const result = await register(email, password, fullName);
        if (!result.success) {
          setError(result.error);
        } else {
          setSuccess('Account created! You can now sign in.');
          setMode('login');
          setPassword('');
        }
      } else {
        const result = await login(email, password);
        if (!result.success) {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
    setLoading(false);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
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
              Smart<span>WH</span>
            </h1>
            <p className="login-brand-subtitle">
              Bio-Hazard & Pest Detection System
            </p>
            <p className="login-brand-company">
              PT. Kawan Lama
            </p>
            <div className="login-brand-features">
              <div className="login-brand-feature">
                <div className="login-feature-dot"></div>
                <span>AI-powered detection of snakes, cats & geckos</span>
              </div>
              <div className="login-brand-feature">
                <div className="login-feature-dot"></div>
                <span>6 warehouse zones with live surveillance</span>
              </div>
              <div className="login-brand-feature">
                <div className="login-feature-dot"></div>
                <span>Real-time threat alerts & rapid response</span>
              </div>
              <div className="login-brand-feature">
                <div className="login-feature-dot"></div>
                <span>Risk mitigation analytics & reporting</span>
              </div>
            </div>
          </div>
          <div className="login-brand-footer">
            <p>&copy; 2026 SmartWH — PT. Kawan Lama</p>
            <p>Bio-Hazard & Pest Detection for Warehouse Safety</p>
          </div>
        </div>

        {/* Right — Form */}
        <div className="login-form-section">
          <div className="login-form-wrapper">
            <div className="login-form-header">
              <h2>
                {mode === 'forgot' ? 'Reset Password' : mode === 'register' ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p>
                {mode === 'forgot'
                  ? 'Enter your email and we\'ll send you a reset link'
                  : mode === 'register'
                    ? 'Register to access the pest detection system'
                    : 'Sign in to access the warehouse monitoring system'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && (
                <div className="login-error">
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="login-success">
                  <span>{success}</span>
                </div>
              )}

              {mode === 'register' && (
                <div className="input-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    className="input"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {mode !== 'forgot' && (
                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <div className="login-password-wrapper">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className="input"
                      placeholder={mode === 'register' ? 'Min. 6 characters' : 'Enter your password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={mode === 'register' ? 6 : undefined}
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
              )}

              {mode === 'login' && (
                <div className="login-forgot-row">
                  <button
                    type="button"
                    className="login-forgot-btn"
                    onClick={() => switchMode('forgot')}
                  >
                    <KeyRound size={13} /> Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className={`btn btn-primary btn-lg login-submit ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <div className="login-spinner"></div>
                ) : (
                  <>
                    {mode === 'forgot' ? 'Send Reset Link' : mode === 'register' ? 'Create Account' : 'Sign In'}
                    {mode === 'forgot' ? <Mail size={18} /> : mode === 'register' ? <UserPlus size={18} /> : <ArrowRight size={18} />}
                  </>
                )}
              </button>
            </form>

            {/* Toggle Login/Register/Forgot */}
            <div className="login-toggle">
              {mode === 'forgot' ? (
                <p>
                  Remember your password?{' '}
                  <button className="login-toggle-btn" onClick={() => switchMode('login')}>
                    Back to Sign In
                  </button>
                </p>
              ) : mode === 'register' ? (
                <p>
                  Already have an account?{' '}
                  <button className="login-toggle-btn" onClick={() => switchMode('login')}>
                    Sign In
                  </button>
                </p>
              ) : (
                <p>
                  Don&apos;t have an account?{' '}
                  <button className="login-toggle-btn" onClick={() => switchMode('register')}>
                    Create Account
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
