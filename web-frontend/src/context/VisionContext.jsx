import React, { createContext, useContext, useState, useEffect } from 'react';
import { socket } from '../services/socket';
import { db, auth } from '../lib/firebase';
import {
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  limit, 
  onSnapshot 
} from 'firebase/firestore';

const VisionContext = createContext();

/**
 * VISION PROVIDER
 * The central heartbeat of the application. 
 * Manages persistent AI streams and real-time Firebase activity logging.
 */
export const VisionProvider = ({ children }) => {
  // --- CORE STATES ---
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [streamFrame, setStreamFrame] = useState(null);
  const [detections, setDetections] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState([]);

  // --- FIREBASE: PUSH ACTIVITY LOG ---
  /**
   * Saves user or system actions to Firestore for audit trails.
   */
  const addActivityLog = async (action, category, status = 'Success') => {
    const newLog = {
      timestamp: new Date().toLocaleTimeString('id-ID'),
      action,
      category, // e.g., 'SYSTEM', 'AI_ALARM', 'UI'
      status,
      user: auth.currentUser?.email || 'System'
    };

    try {
      // Permanent record in Firestore
      await addDoc(collection(db, 'activity_logs'), {
        ...newLog,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Firebase Sync Error: ", e);
    }
  };

  // --- FIREBASE: REAL-TIME LOG SYNC ---
  /**
   * Listen to Firestore updates and refresh the activity log feed.
   */
  useEffect(() => {
    const q = query(
      collection(db, 'activity_logs'), 
      orderBy('createdAt', 'desc'), 
      limit(10)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLogs = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setLogs(fetchedLogs);
    });

    return () => unsubscribe();
  }, []);

  // --- SOCKET.IO: PERSISTENT BACKGROUND LISTENER ---
  useEffect(() => {
    // Force manual connection
    socket.connect();

    socket.on('connect', () => {
      setIsConnected(true);
      addActivityLog('AI Backend Connection Established', 'SYSTEM');
    });

    socket.on('vision_state', (data) => {
      setIsAIEnabled(data.is_detecting);
      addActivityLog(
        data.is_detecting ? 'System Online' : 'System Offline',
        'SYSTEM'
      );
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      setIsAIEnabled(false);
      setStreamFrame(null);
      addActivityLog('AI Backend Connection Lost', 'SYSTEM', 'Error');
    });

    /**
     * GLOBAL DATA LISTENER
     * This continues to receive data even if the user is on the Dashboard or Inventory page.
     */
    socket.on('vision_data', (data) => {
      if (data.image) setStreamFrame(data.image);
      if (data.detections) {
        setDetections(data.detections);
        
        // AUTO-LOG: High confidence threats are saved to Firebase immediately
        data.detections.forEach(d => {
          if (d.confidence > 0.85) { 
            addActivityLog(
              `Alert: High confidence ${d.class} detected`, 
              'AI_ALARM', 
              'Warning'
            );
          }
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // --- ACTIONS ---
  /**
   * Toggles the Python AI Inference engine on/off.
   */
  const toggleAI = () => {
    if (!isAIEnabled) {
      socket.emit('start_detection');
      setIsAIEnabled(true);
      addActivityLog('AI Inference Engine Started', 'SYSTEM');
    } else {
      socket.emit('stop_detection');
      setIsAIEnabled(false);
      setStreamFrame(null);
      setDetections([]);
      addActivityLog('AI Inference Engine Stopped', 'SYSTEM');
    }
  };

  return (
    <VisionContext.Provider value={{ 
      isAIEnabled, 
      streamFrame, 
      detections, 
      isConnected, 
      logs, 
      toggleAI, 
      addActivityLog 
    }}>
      {children}
    </VisionContext.Provider>
  );
};

export const useVision = () => useContext(VisionContext);