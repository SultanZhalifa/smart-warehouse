import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import * as db from '../lib/database';

const WarehouseContext = createContext(null);

/**
 * Global state for the Smart Warehouse ecosystem.
 * Designed for real-time synchronization with AI Inference engines.
 */
const initialState = {
  inventory: [],
  alerts: [],
  activityLog: [],
  zones: [],
  cameras: [],
  // Real-time KPI metrics updated by AI detections
  detectionStats: { 
    today: 0,       
    week: 0,        
    total: 0,       
    camerasOnline: 0, 
    camerasTotal: 0 
  },
  toasts: [],
  sidebarCollapsed: false,
  loading: true,
};

function warehouseReducer(state, action) {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, ...action.payload, loading: false };

    case 'SET_INVENTORY':
      return { ...state, inventory: action.payload };

    /**
     * AI AUTOMATION: Dynamically adds an alert triggered by the Vision system.
     * This ensures the Red Badge in the sidebar updates instantly.
     */
    case 'ADD_ALERT':
      return { 
        ...state, 
        alerts: [action.payload, ...state.alerts],
        // Automatically increment 'today' stats when a new alert is added
        detectionStats: {
          ...state.detectionStats,
          today: state.detectionStats.today + 1,
          total: state.detectionStats.total + 1
        }
      };

    case 'CLEAR_ALERTS':
      return { ...state, alerts: [] };

    case 'MARK_ALERT_READ':
      return {
        ...state,
        alerts: state.alerts.map((alert) =>
          alert.id === action.payload ? { ...alert, status: 'read' } : alert
        ),
      };

    case 'SET_DETECTION_STATS':
      return { ...state, detectionStats: action.payload };

    /**
     * LIVE STATS SYNC: Updates KPI cards (Dashboard) in real-time
     * without re-fetching the entire database.
     */
    case 'UPDATE_STATS':
      return {
        ...state,
        detectionStats: {
          ...state.detectionStats,
          ...action.payload
        }
      };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };

    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, { ...action.payload, id: Date.now() }] };

    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };

    default:
      return state;
  }
}

export function WarehouseProvider({ children, isAuthenticated, userProfile }) {
  const [state, dispatch] = useReducer(warehouseReducer, initialState);

  /**
   * CORE LOAD: Fetches the baseline data from Firebase.
   */
  const loadData = useCallback(async () => {
    const warehouseId = userProfile?.warehouseId || "WH-001";
    try {
      const [zones, cameras, alerts, inventory, activityLog, detectionStats] = await Promise.all([
        db.fetchZones(warehouseId),
        db.fetchCameras(warehouseId),
        db.fetchAlerts(warehouseId),
        db.fetchInventory(warehouseId),
        db.fetchActivityLog(warehouseId),
        db.fetchDetectionStats(warehouseId),
      ]);

      dispatch({
        type: 'SET_DATA',
        payload: { zones, cameras, alerts, inventory, activityLog, detectionStats },
      });
    } catch (err) {
      console.error('[WarehouseContext] Initialization Error:', err);
      dispatch({ type: 'SET_DATA', payload: { loading: false } });
    }
  }, [userProfile]);

  /**
   * REAL-TIME SUBSCRIPTION (AI HUB)
   * This effect listens for global events. If you use Firebase, 
   * replace this with onSnapshot listeners for 100% automation.
   */
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      
      // Example of an Autonomous Firebase Listener for Alerts
      // const unsubscribe = db.subscribeToLiveAlerts((newAlert) => {
      //   dispatch({ type: 'ADD_ALERT', payload: newAlert });
      //   addToast({ title: 'AI Detection', message: newAlert.msg, type: 'error' });
      // });
      // return () => unsubscribe();
    }
  }, [loadData, isAuthenticated]);

  const addToast = useCallback((toast) => {
    const id = Date.now();
    dispatch({ type: 'ADD_TOAST', payload: { ...toast, id } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 4000);
  }, []);

  return (
    <WarehouseContext.Provider value={{ state, dispatch, addToast, refreshData: loadData }}>
      {children}
    </WarehouseContext.Provider>
  );
}

export function useWarehouse() {
  const context = useContext(WarehouseContext);
  if (!context) throw new Error('useWarehouse must be used within a WarehouseProvider');
  return context;
}