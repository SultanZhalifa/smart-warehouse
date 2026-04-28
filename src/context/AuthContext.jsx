import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { fetchProfile, createUserProfile } from '../lib/database';
import { Warehouse } from 'lucide-react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';

const AuthContext = createContext(null);

/** Build user object from Firebase auth */
function buildUserFromAuth(firebaseUser, profileData = null) {
  const displayName = profileData?.full_name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
  const initials = profileData?.avatar_initials
    || String(displayName).replace(/\s+/g, '').slice(0, 2).toUpperCase();
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    name: displayName,
    role: profileData?.role || 'operator',
    avatar: initials,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Setup persistence
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(console.error);
  }, []);

  // Load profile data
  const loadProfile = async (firebaseUser) => {
    try {
      const profileData = await fetchProfile(firebaseUser.uid);
      setProfile(profileData);
      setUser(buildUserFromAuth(firebaseUser, profileData));
    } catch (err) {
      console.error('Error loading profile:', err);
      // Use Firebase user data if profile doesn't exist yet
      setUser(buildUserFromAuth(firebaseUser));
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    let timeoutId;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setIsAuthenticated(true);
          await loadProfile(firebaseUser);
        } else {
          setUser(null);
          setProfile(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    // Timeout fallback
    timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, fullName = '', role = 'operator') => {
    try {
      setError(null);
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Create profile in Firestore
      const profileData = {
        email: firebaseUser.email,
        full_name: fullName || email.split('@')[0],
        role: role,
        avatar_initials: (fullName || email).slice(0, 2).toUpperCase(),
      };

      await createUserProfile(firebaseUser.uid, profileData);

      return { success: true, user: firebaseUser };
    } catch (err) {
      console.error('Register error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
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
    <AuthContext.Provider value={{ user, profile, isAuthenticated, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
