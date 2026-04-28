import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  addDoc,
} from 'firebase/firestore';

// ============= USER PROFILES =============
export const createUserProfile = async (userId, profileData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const fetchProfile = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...updates,
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// ============= DETECTIONS/ALERTS =============
export const createDetection = async (detectionData) => {
  try {
    const docRef = await addDoc(collection(db, 'detections'), {
      ...detectionData,
      createdAt: new Date(),
      timestamp: new Date(),
    });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error('Error creating detection:', error);
    throw error;
  }
};

export const fetchDetections = async (warehouseId, limit = 100) => {
  try {
    const q = query(
      collection(db, 'detections'),
      where('warehouseId', '==', warehouseId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching detections:', error);
    throw error;
  }
};

export const subscribeToDetections = (warehouseId, callback) => {
  try {
    const q = query(
      collection(db, 'detections'),
      where('warehouseId', '==', warehouseId)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(data);
    });
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to detections:', error);
    throw error;
  }
};

// ============= INVENTORY =============
export const createInventoryItem = async (itemData) => {
  try {
    const docRef = await addDoc(collection(db, 'inventory'), {
      ...itemData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error('Error creating inventory item:', error);
    throw error;
  }
};

export const fetchInventory = async (warehouseId) => {
  try {
    const q = query(
      collection(db, 'inventory'),
      where('warehouseId', '==', warehouseId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
};

export const updateInventoryItem = async (itemId, updates) => {
  try {
    await updateDoc(doc(db, 'inventory', itemId), {
      ...updates,
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }
};

// ============= ALERTS/NOTIFICATIONS =============
export const createAlert = async (alertData) => {
  try {
    const docRef = await addDoc(collection(db, 'alerts'), {
      ...alertData,
      createdAt: new Date(),
      read: false,
    });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
};

export const fetchAlerts = async (warehouseId) => {
  try {
    const q = query(
      collection(db, 'alerts'),
      where('warehouseId', '==', warehouseId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
};

export const markAlertAsRead = async (alertId) => {
  try {
    await updateDoc(doc(db, 'alerts', alertId), {
      read: true,
      readAt: new Date(),
    });
  } catch (error) {
    console.error('Error marking alert as read:', error);
    throw error;
  }
};

// ============= ZONES =============
export const createZone = async (zoneData) => {
  try {
    const docRef = await addDoc(collection(db, 'zones'), {
      ...zoneData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error('Error creating zone:', error);
    throw error;
  }
};

export const fetchZones = async (warehouseId) => {
  try {
    const q = query(
      collection(db, 'zones'),
      where('warehouseId', '==', warehouseId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching zones:', error);
    throw error;
  }
};

export const updateZone = async (zoneId, updates) => {
  try {
    await updateDoc(doc(db, 'zones', zoneId), {
      ...updates,
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating zone:', error);
    throw error;
  }
};

export const deleteZone = async (zoneId) => {
  try {
    await deleteDoc(doc(db, 'zones', zoneId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting zone:', error);
    throw error;
  }
};

// ============= WAREHOUSES =============
export const createWarehouse = async (warehouseData) => {
  try {
    const docRef = await addDoc(collection(db, 'warehouses'), {
      ...warehouseData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error('Error creating warehouse:', error);
    throw error;
  }
};

export const fetchWarehouse = async (warehouseId) => {
  try {
    const docRef = doc(db, 'warehouses', warehouseId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching warehouse:', error);
    throw error;
  }
};

// ============= ANALYTICS FUNCTIONS =============
export const fetchDetectionsByDay = async (warehouseId, days = 7) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const q = query(
      collection(db, 'detections'),
      where('warehouseId', '==', warehouseId),
      where('timestamp', '>=', startDate)
    );
    
    const querySnapshot = await getDocs(q);
    const detectionsByDay = {};
    
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      const date = data.timestamp?.toDate?.()?.toLocaleDateString() || new Date(data.timestamp).toLocaleDateString();
      detectionsByDay[date] = (detectionsByDay[date] || 0) + 1;
    });
    
    return detectionsByDay;
  } catch (error) {
    console.error('Error fetching detections by day:', error);
    throw error;
  }
};

export const fetchPestDistribution = async (warehouseId) => {
  try {
    const q = query(
      collection(db, 'detections'),
      where('warehouseId', '==', warehouseId)
    );
    
    const querySnapshot = await getDocs(q);
    const distribution = {};
    
    querySnapshot.docs.forEach(doc => {
      const pestType = doc.data().pestType || 'unknown';
      distribution[pestType] = (distribution[pestType] || 0) + 1;
    });
    
    return distribution;
  } catch (error) {
    console.error('Error fetching pest distribution:', error);
    throw error;
  }
};

export const fetchAlertsByZone = async (warehouseId) => {
  try {
    const q = query(
      collection(db, 'alerts'),
      where('warehouseId', '==', warehouseId)
    );
    
    const querySnapshot = await getDocs(q);
    const alertsByZone = {};
    
    querySnapshot.docs.forEach(doc => {
      const zone = doc.data().zone || 'unknown';
      alertsByZone[zone] = (alertsByZone[zone] || 0) + 1;
    });
    
    return alertsByZone;
  } catch (error) {
    console.error('Error fetching alerts by zone:', error);
    throw error;
  }
};

export const fetchThreatTrend = async (warehouseId, months = 4) => {
  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    
    const q = query(
      collection(db, 'detections'),
      where('warehouseId', '==', warehouseId),
      where('timestamp', '>=', startDate)
    );
    
    const querySnapshot = await getDocs(q);
    const trendData = {};
    
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      const month = data.timestamp?.toDate?.()?.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) 
        || new Date(data.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      trendData[month] = (trendData[month] || 0) + 1;
    });
    
    return trendData;
  } catch (error) {
    console.error('Error fetching threat trend:', error);
    throw error;
  }
};

export const fetchDetectionsByHour = async (warehouseId) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const q = query(
      collection(db, 'detections'),
      where('warehouseId', '==', warehouseId),
      where('timestamp', '>=', today)
    );
    
    const querySnapshot = await getDocs(q);
    const detectionsByHour = {};
    
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      const hour = data.timestamp?.toDate?.()?.getHours?.() ?? new Date(data.timestamp).getHours();
      const hourKey = `${hour}:00`;
      detectionsByHour[hourKey] = (detectionsByHour[hourKey] || 0) + 1;
    });
    
    return detectionsByHour;
  } catch (error) {
    console.error('Error fetching detections by hour:', error);
    throw error;
  }
};

export const updateWarehouse = async (warehouseId, updates) => {
  try {
    await updateDoc(doc(db, 'warehouses', warehouseId), {
      ...updates,
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating warehouse:', error);
    throw error;
  }
};
