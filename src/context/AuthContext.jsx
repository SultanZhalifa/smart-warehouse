import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { fetchProfile } from '../lib/database';
import { Warehouse } from 'lucide-react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load profile data from the profiles table
  const loadProfile = async (authUser) => {
    try {
      const profileData = await fetchProfile(authUser.id);
      setProfile(profileData);
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: profileData.full_name,
        role: profileData.role,
        studentId: profileData.student_id,
        avatar: profileData.avatar_initials,
      });
    } catch (err) {
      // Profile might not exist yet (trigger delay), use email as fallback
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
        role: authUser.user_metadata?.role || 'operator',
        studentId: null,
        avatar: (authUser.user_metadata?.full_name || authUser.email).substring(0, 2).toUpperCase(),
      });
    }
  };

  useEffect(() => {
    let resolved = false;

    // 1) Get existing session on mount — with 3s timeout
    const sessionPromise = supabase.auth.getSession().then(({ data: { session } }) => {
      if (resolved) return;
      resolved = true;
      if (session?.user) {
        setIsAuthenticated(true);
        loadProfile(session.user).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }).catch(() => {
      if (!resolved) { resolved = true; setLoading(false); }
    });

    // Timeout fallback — never hang more than 3 seconds
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        console.warn('Auth session check timed out — showing login');
        setLoading(false);
      }
    }, 3000);

    // 2) Listen for future auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
          await loadProfile(session.user);
        } else {
          setUser(null);
          setProfile(null);
          setIsAuthenticated(false);
        }
        setLoading(false);
      }
    );

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { success: false, error: error.message };
    return { success: true, user: data.user };
  };

  const register = async (email, password, fullName, role = 'operator') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
          avatar_initials: fullName.substring(0, 2).toUpperCase(),
        },
      },
    });
    if (error) return { success: false, error: error.message };
    return { success: true, user: data.user };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#f0f4f8',
        color: '#334155',
        fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem', color: '#4a90d9' }}><Warehouse size={36} /></div>
          <p>Loading SmartWH...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, profile, isAuthenticated, login, register, logout, resetPassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
