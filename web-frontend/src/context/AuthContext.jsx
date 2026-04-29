import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';

const AuthContext = createContext();

/**
 * Custom hook to access Auth Context easily across components.
 */
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Complex Registration Logic:
   * 1. Creates a security credential in Firebase Authentication.
   * 2. Synchronizes profile data to Firestore to ensure team visibility.
   * 3. Assigns a permanent Warehouse ID (WH-001) for centralized data access.
   */
  const register = async (email, password, fullName, role, warehouseId) => {
    try {
      // Step 1: Create the auth account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Step 2: Prepare the Firestore document reference using the unique Auth UID
      const userDocRef = doc(db, "users", newUser.uid);

      // Step 3: Write extended profile data to Firestore
      // This is crucial so teammates can see the same warehouse data
      const profileData = {
        uid: newUser.uid,
        name: fullName,
        email: email,
        role: role || 'operator',
        warehouseId: warehouseId || "WH-001", // Forces the team into one warehouse environment
        status: 'active',
        lastLogin: serverTimestamp(),
        createdAt: serverTimestamp()
      };

      await setDoc(userDocRef, profileData);

      return { success: true, user: newUser };
    } catch (error) {
      console.error("CRITICAL: Registration flow failed:", error.message);
      return { success: false, error: error.message };
    }
  };

  /**
   * Standard Login Logic:
   * Authenticates the user. Profile synchronization happens in the onAuthStateChanged listener.
   */
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      console.error("AUTH_ERROR: Login attempt failed:", error.message);
      return { success: false, error: error.message };
    }
  };

  /**
   * Destroys the current session.
   */
  const logout = () => {
    return signOut(auth);
  };

  /**
   * Sends a password recovery link to the specified staff email.
   */
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Persistent Session Listener:
   * Automatically runs on app load and whenever auth state changes.
   * Fetches Firestore profile data to merge with Auth data for full context.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Fetch the supplementary profile from Firestore
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          
          if (userDoc.exists()) {
            // Merge Auth object with Firestore data (role, warehouseId, etc.)
            setUser({ ...currentUser, ...userDoc.data() });
          } else {
            // Fallback for accounts created without a Firestore document
            console.warn("WARN: Auth account exists but no Firestore profile found.");
            setUser(currentUser);
          }
        } catch (err) {
          console.error("DB_ERROR: Failed to sync user profile:", err);
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const value = {
    user,
    register,
    login,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Ensure the app only renders once the initial auth check is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
}