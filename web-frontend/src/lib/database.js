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
  limit as firestoreLimit,
  deleteDoc,
  addDoc
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

// --- 9. ZONE MANAGEMENT (CREATE, UPDATE, DELETE) ---
export const createZone = async (zoneData) => {
  try {
    const docRef = await addDoc(collection(db, 'zones'), {
      ...zoneData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...zoneData };
  } catch (error) {
    console.error("[Database Service] Error creating zone:", error);
    throw error;
  }
};

export const updateZone = async (zoneId, zoneData) => {
  try {
    const zoneRef = doc(db, 'zones', zoneId);
    await updateDoc(zoneRef, {
      ...zoneData,
      updatedAt: serverTimestamp()
    });
    return { id: zoneId, ...zoneData };
  } catch (error) {
    console.error("[Database Service] Error updating zone:", error);
    throw error;
  }
};

export const deleteZone = async (zoneId) => {
  try {
    await deleteDoc(doc(db, 'zones', zoneId));
    return true;
  } catch (error) {
    console.error("[Database Service] Error deleting zone:", error);
    throw error;
  }
};

// --- 10. INVENTORY MANAGEMENT (CREATE, UPDATE, DELETE) ---
export const createInventoryItem = async (itemData) => {
  try {
    const docRef = await addDoc(collection(db, 'inventory'), {
      ...itemData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...itemData };
  } catch (error) {
    console.error("[Database Service] Error creating inventory item:", error);
    throw error;
  }
};

export const updateInventoryItem = async (itemId, itemData) => {
  try {
    const itemRef = doc(db, 'inventory', itemId);
    await updateDoc(itemRef, {
      ...itemData,
      updatedAt: serverTimestamp()
    });
    return { id: itemId, ...itemData };
  } catch (error) {
    console.error("[Database Service] Error updating inventory item:", error);
    throw error;
  }
};

export const deleteInventoryItem = async (itemId) => {
  try {
    await deleteDoc(doc(db, 'inventory', itemId));
    return true;
  } catch (error) {
    console.error("[Database Service] Error deleting inventory item:", error);
    throw error;
  }
};

// --- 11. ANALYTICS: DETECTION & THREAT DATA ---
export const fetchDetectionsByDay = async (days = 7) => {
  try {
    const q = query(
      collection(db, 'activity_logs'),
      where('category', '==', 'AI_ALARM'),
      orderBy('createdAt', 'desc'),
      firestoreLimit(200)
    );
    const snap = await getDocs(q);
    const data = snap.docs.map(d => d.data());
    
    const grouped = {};
    const now = new Date();
    for (let i = 0; i < days; i += 1) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const label = date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
      grouped[label] = 0;
    }
    
    data.forEach(log => {
      const date = log.createdAt?.toDate?.() || new Date(log.createdAt);
      if (Number.isNaN(date.getTime())) return;
      const label = date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
      if (label in grouped) grouped[label] += 1;
    });

    return {
      labels: Object.keys(grouped).reverse(),
      data: Object.values(grouped).reverse()
    };
  } catch (error) {
    console.error("[Database Service] Error fetching detections by day:", error);
    return { labels: [], data: [] };
  }
};

export const fetchPestDistribution = async () => {
  try {
    const q = query(
      collection(db, 'activity_logs'),
      where('category', '==', 'AI_ALARM')
    );
    const snap = await getDocs(q);
    const data = snap.docs.map(d => d.data());
    
    const distribution = { snake: 0, cat: 0, gecko: 0, other: 0 };
    data.forEach(log => {
      const pestType = log.label?.toLowerCase() || (log.action || '').replace(/^Alert:\s*/i, '').toLowerCase();
      if (pestType in distribution) {
        distribution[pestType]++;
      } else {
        distribution.other += 1;
      }
    });
    
    return distribution;
  } catch (error) {
    console.error("[Database Service] Error fetching pest distribution:", error);
    return { snake: 0, cat: 0, gecko: 0, other: 0 };
  }
};

export const fetchAlertsByZone = async () => {
  try {
    const q = query(collection(db, 'alerts'));
    const snap = await getDocs(q);
    const data = snap.docs.map(d => d.data());
    
    const grouped = {};
    data.forEach(alert => {
      const zone = alert.zone_name || alert.zone || 'Unknown';
      grouped[zone] = (grouped[zone] || 0) + 1;
    });
    
    return {
      labels: Object.keys(grouped),
      data: Object.values(grouped)
    };
  } catch (error) {
    console.error("[Database Service] Error fetching alerts by zone:", error);
    return { labels: [], data: [] };
  }
};

export const fetchThreatTrend = async (weeks = 4) => {
  try {
    const q = query(
      collection(db, 'activity_logs'),
      where('category', '==', 'AI_ALARM'),
      orderBy('createdAt', 'desc'),
      firestoreLimit(500)
    );
    const snap = await getDocs(q);
    const data = snap.docs.map(d => d.data());
    
    const trendMap = {};
    data.forEach(log => {
      const dateObj = log.createdAt?.toDate?.() || new Date(log.createdAt);
      if (Number.isNaN(dateObj.getTime())) return;
      const weekStart = new Date(dateObj);
      weekStart.setHours(0, 0, 0, 0);
      weekStart.setDate(dateObj.getDate() - dateObj.getDay());
      const key = weekStart.getTime();
      const label = weekStart.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
      if (!trendMap[key]) trendMap[key] = { label, count: 0 };
      trendMap[key].count += 1;
    });
    
    const sortedWeeks = Object.keys(trendMap)
      .map(Number)
      .sort((a, b) => a - b)
      .slice(-weeks);
    
    const labels = sortedWeeks.map((key) => trendMap[key].label);
    const detected = sortedWeeks.map((key) => trendMap[key].count);
    const resolved = sortedWeeks.map(() => 0);
    
    return { labels, detected, resolved };
  } catch (error) {
    console.error("[Database Service] Error fetching threat trend:", error);
    return { labels: [], detected: [], resolved: [] };
  }
};

// --- 12. REAL-TIME ANALYTICS: COUNTER SYNC ---
/**
 * Fetch total detections count (all time)
 */
export const fetchTotalDetections = async () => {
  try {
    const q = query(
      collection(db, 'activity_logs'),
      where('category', '==', 'AI_ALARM')
    );
    const snap = await getDocs(q);
    return snap.size;
  } catch (error) {
    console.error("[Database Service] Error fetching total detections:", error);
    return 0;
  }
};

/**
 * Fetch detections for today only
 */
export const fetchDetectionsToday = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const q = query(
      collection(db, 'activity_logs'),
      where('category', '==', 'AI_ALARM')
    );
    const snap = await getDocs(q);
    
    let count = 0;
    snap.forEach(doc => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate?.() || new Date(data.createdAt);
      if (createdAt >= today) {
        count++;
      }
    });
    return count;
  } catch (error) {
    console.error("[Database Service] Error fetching detections today:", error);
    return 0;
  }
};

/**
 * Fetch hourly detection data for chart
 */
export const fetchDetectionsByHour = async () => {
  try {
    const q = query(
      collection(db, 'activity_logs'),
      where('category', '==', 'AI_ALARM'),
      orderBy('createdAt', 'desc'),
      firestoreLimit(100)
    );
    const snap = await getDocs(q);
    
    const hourlyData = {};
    snap.forEach(doc => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate?.() || new Date(data.createdAt);
      const hour = `${String(createdAt.getHours()).padStart(2, '0')}:00`;
      hourlyData[hour] = (hourlyData[hour] || 0) + 1;
    });
    
    const labels = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
    const data = labels.map(label => hourlyData[label] || 0);
    
    return { labels, data };
  } catch (error) {
    console.error("[Database Service] Error fetching hourly data:", error);
    return { labels: [], data: [] };
  }
};

/**
 * Real-time subscription to detection counters
 */
export const subscribeToRealTimeCounters = (callback) => {
  const q = query(
    collection(db, 'activity_logs'),
    where('category', '==', 'AI_ALARM'),
    orderBy('createdAt', 'desc'),
    firestoreLimit(1000)
  );
  
  return onSnapshot(q, (snapshot) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let total = 0;
    let todayCount = 0;
    const hourlyData = {};
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate?.() || new Date(data.createdAt);
      
      total++;
      if (createdAt >= today) {
        todayCount++;
      }
      
      const hour = `${String(createdAt.getHours()).padStart(2, '0')}:00`;
      hourlyData[hour] = (hourlyData[hour] || 0) + 1;
    });
    
    callback({ total, todayCount, hourlyData });
  }, (error) => {
    console.error("[Database Service] Subscription error:", error);
  });
};