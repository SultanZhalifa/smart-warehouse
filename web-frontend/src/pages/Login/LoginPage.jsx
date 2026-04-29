import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Warehouse, Eye, EyeOff, ArrowRight, Mail, ShieldCheck, Activity, UserCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { user, login, register, resetPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard'); // if after login user is set, redirect to dashboard
    }
  }, [user, navigate]);

  const [mode, setMode] = useState('login'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('operator'); 
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
        const result = await resetPassword(email);
        if (!result.success) setError(result.error);
        else setSuccess('Reset link sent to security email.');
      } else if (mode === 'register') {
        // Register dengan Role & Warehouse ID WH-001
        const result = await register(email, password, fullName, role, "WH-001");
        if (!result.success) setError(result.error);
        else {
          setSuccess('Staff Account Registered Successfully.');
          setMode('login');
        }
      } else {
        const result = await login(email, password);
        if (!result.success) setError(result.error);
      }
    } catch (err) {
      setError('Internal server authentication error.');
    }
    setLoading(false);
  };

  return (
    <div className="login-page" style={{ background: '#f1f5f9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      
      <div className="login-container" style={{ 
        display: 'flex', 
        width: '1050px', 
        minHeight: '720px', 
        background: 'white', 
        borderRadius: '40px', 
        overflow: 'hidden', 
        boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.12)' 
      }}>
        
        {/* LEFT BRANDING SECTION */}
        <div className="login-branding" style={{ 
          background: '#4f46e5', 
          width: '42%', 
          padding: '70px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '48px', backdropFilter: 'blur(8px)' }}>
              <Warehouse size={28} color="white" />
            </div>
            
            <h1 style={{ color: 'white', fontSize: '64px', fontWeight: '900', letterSpacing: '-3px', lineHeight: '0.8', marginBottom: '24px' }}>
              Smart<br/><span style={{ opacity: 0.4 }}>Warehouse</span>
            </h1>
            
            <p style={{ color: 'white', fontSize: '18px', fontWeight: '300', opacity: 0.7, lineHeight: '1.5', maxWidth: '260px' }}>
              Next-generation bio-hazard surveillance infrastructure.
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#a5b4fc', fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '32px' }}>
              <Activity size={14} /> System Operational
            </div>
            <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ color: 'white', fontSize: '9px', opacity: 0.3, fontWeight: '600', letterSpacing: '0.5px' }}>
                BUILD 2026.04.28 / STABLE RELEASE
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="login-form-section" style={{ width: '58%', padding: '60px 80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '400px' }}>
            
            <div className="form-header" style={{ marginBottom: '32px' }}>
              <div style={{ color: '#4f46e5', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <ShieldCheck size={16} /> {mode === 'register' ? 'Registry Protocol' : 'Authorized Access'}
              </div>
              <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px' }}>
                {mode === 'login' ? 'System Access' : mode === 'register' ? 'Staff Registry' : 'Account Recovery'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '14px', fontSize: '13px', fontWeight: '600', borderLeft: '4px solid #dc2626' }}>{error}</div>}
              {success && <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '12px', borderRadius: '14px', fontSize: '13px', fontWeight: '600', borderLeft: '4px solid #16a34a' }}>{success}</div>}

              {mode === 'register' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Full Name</label>
                    <input type="text" placeholder="e.g. Username" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ width: '100%', padding: '14px 20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', fontSize: '14px', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Assigned Role</label>
                    <div style={{ position: 'relative' }}>
                      <UserCog size={18} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '14px 20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', fontSize: '14px', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                        <option value="operator">Field Operator</option>
                        <option value="supervisor">Warehouse Supervisor</option>
                        <option value="admin">System Administrator</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Staff Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '14px 20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', fontSize: '14px', outline: 'none' }} />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Access Key</label>
                  <div style={{ position: 'relative' }}>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', zIndex: 10 }}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '14px 20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', fontSize: '14px', outline: 'none' }} />
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div style={{ textAlign: 'right' }}>
                  <button type="button" onClick={() => setMode('forgot')} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Forgot Password?</button>
                </div>
              )}

              <button type="submit" disabled={loading} style={{ 
                width: '100%', 
                background: '#4f46e5', 
                color: 'white', 
                padding: '16px', 
                borderRadius: '16px', 
                border: 'none', 
                fontWeight: '700', 
                fontSize: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '12px',
                cursor: 'pointer',
                boxShadow: '0 20px 40px -10px rgba(79, 70, 229, 0.4)',
                marginTop: '10px'
              }}>
                {loading ? 'Processing...' : (mode === 'login' ? 'Enter System' : 'Initialize Staff Account')}
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>

            <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
              {mode === 'login' ? (
                <p>New operator? <button onClick={() => setMode('register')} style={{ color: '#4f46e5', background: 'none', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Register Account</button></p>
              ) : (
                <button onClick={() => setMode('login')} style={{ color: '#4f46e5', background: 'none', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Back to Secure Sign-In</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}