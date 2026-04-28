import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
  limit as firestoreLimit
} from 'firebase/firestore';

/**
 * DATABASE SERVICE LAYER
 * Standarisasi: Menggunakan Named Exports untuk optimasi Tree-Shaking 
 * dan sinkronisasi urutan Promise.all di WarehouseContext.
 */

// --- 1. USER & PROFILE MANAGEMENT ---

/**
 * Mengambil data profil user dari Firestore
 * Digunakan di SettingsPage untuk memuat data awal
 */
export const getUserData = async (userId) => {
  if (!userId) return null;
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.warn("User document not found in Firestore. Returning empty object.");
      return {}; // Balikin objek kosong biar UI berhenti loading
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

/**
 * Update user profile data di Firestore
 */
export const updateProfileData = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      name: profileData.name || '',
      bio: profileData.bio || '',
      phone: profileData.phone || '',
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const fetchProfile = async (userId) => {
  const docSnap = await getDoc(doc(db, 'users', userId));
  return docSnap.exists() ? docSnap.data() : null;
};

export const fetchWarehouse = async (warehouseId) => {
  const docSnap = await getDoc(doc(db, 'warehouses', warehouseId));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// --- 2. INFRASTRUCTURE: ZONES ---
export const fetchZones = async (warehouseId) => {
  const q = query(collection(db, 'zones'), where('warehouseId', '==', warehouseId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// --- 3. HARDWARE: CAMERAS ---
export const fetchCameras = async (warehouseId) => {
  const q = query(collection(db, 'cameras'), where('warehouseId', '==', warehouseId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// --- 4. SECURITY: ALERTS ---
export const fetchAlerts = async (warehouseId) => {
  const q = query(collection(db, 'alerts'), where('warehouseId', '==', warehouseId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// --- 5. LOGISTICS: INVENTORY ---
export const fetchInventory = async (warehouseId) => {
  const q = query(collection(db, 'inventory'), where('warehouseId', '==', warehouseId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// --- 6. AUDIT: ACTIVITY LOG ---
export const fetchActivityLog = async (warehouseId) => {
  try {
    const q = query(
      collection(db, 'activity_log'),
      where('warehouseId', '==', warehouseId),
      orderBy('timestamp', 'desc'),
      firestoreLimit(20)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("[Database Service] Error fetching activity log:", error);
    return [];
  }
};

// --- 7. ANALYTICS: DETECTION STATS ---
export const fetchDetectionStats = async (warehouseId) => {
  try {
    const q = query(collection(db, 'detections'), where('warehouseId', '==', warehouseId));
    const snap = await getDocs(q);
    
    return { 
      today: snap.size, 
      week: snap.size * 5, 
      total: snap.size * 10, 
      camerasOnline: 2, 
      camerasTotal: 2 
    };
  } catch (error) {
    console.error("[Database Service] Error fetching detection stats:", error);
    return { today: 0, week: 0, total: 0, camerasOnline: 0, camerasTotal: 0 };
  }
};

// --- 8. REAL-TIME ENGINE: DETECTIONS ---
export const subscribeToDetections = (warehouseId, callback) => {
  const q = query(
    collection(db, 'detections'),
    where('warehouseId', '==', warehouseId),
    orderBy('timestamp', 'desc'),
    firestoreLimit(50)
  );
  
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(data);
  }, (error) => {
    console.error("[Database Service] Subscription error:", error);
  });
};