import { createContext, useContext, useState, useEffect } from 'react';
// Added 'db' to the import from your firebase config
import { auth, db } from '../lib/firebase'; 
import { doc, setDoc } from "firebase/firestore";
import { fetchProfile } from '../lib/database';
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

  // Load profile data from Firestore
  const loadProfile = async (firebaseUser) => {
    try {
      const profileData = await fetchProfile(firebaseUser.uid);
      setProfile(profileData);
      setUser(buildUserFromAuth(firebaseUser, profileData));
    } catch (err) {
      console.error('Error loading profile:', err);
      // Fallback to basic auth data if profile fetch fails
      setUser(buildUserFromAuth(firebaseUser));
    }
  };

  // Listen for auth state changes
  useEffect(() => {
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

    return () => unsubscribe();
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

  const register = async (email, password, fullName, role, warehouseId) => {
    try {
      setError(null);
      console.log("Step 1: Creating user in Firebase Auth...");
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = res.user;
      console.log("Step 2: Auth created with UID:", newUser.uid);

      const initials = fullName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

      console.log("Step 3: Writing profile to Firestore 'users' collection...");
      // Using 'db' which is now imported correctly
      await setDoc(doc(db, "users", newUser.uid), {
        uid: newUser.uid,
        email: email,
        full_name: fullName, // Adjusted to match fetchProfile expected fields
        role: role,             
        warehouseId: warehouseId, 
        avatar_initials: initials,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log("Step 4: Registration complete!");
      return { success: true };
    } catch (err) {
      console.error('Registration error details:', err.code, err.message);
      setError(err.message);
      return { success: false, error: err.message };
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