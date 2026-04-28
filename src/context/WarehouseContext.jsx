import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import * as db from '../lib/database';

const WarehouseContext = createContext(null);

const initialState = {
  inventory: [],
  alerts: [],
  activityLog: [],
  zones: [],
  cameras: [],
  detectionStats: { today: 0, week: 0, total: 0, camerasOnline: 0, camerasTotal: 0 },
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

    case 'ADD_INVENTORY_ITEM':
      return { ...state, inventory: [action.payload, ...state.inventory] };

    case 'UPDATE_INVENTORY_ITEM':
      return {
        ...state,
        inventory: state.inventory.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload } : item
        ),
      };

    case 'DELETE_INVENTORY_ITEM':
      return {
        ...state,
        inventory: state.inventory.filter((item) => item.id !== action.payload),
      };

    case 'SET_ALERTS':
      return { ...state, alerts: action.payload };

    case 'ADD_ALERT':
      return { ...state, alerts: [action.payload, ...state.alerts] };

    case 'MARK_ALERT_READ':
      return {
        ...state,
        alerts: state.alerts.map((alert) =>
          alert.id === action.payload ? { ...alert, status: 'read' } : alert
        ),
      };

    case 'SET_ZONES':
      return { ...state, zones: action.payload };

    case 'SET_ACTIVITY_LOG':
      return { ...state, activityLog: action.payload };

    case 'ADD_ACTIVITY':
      return { ...state, activityLog: [action.payload, ...state.activityLog] };

    case 'SET_DETECTION_STATS':
      return { ...state, detectionStats: action.payload };

    case 'SET_CAMERAS':
      return { ...state, cameras: action.payload };

    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, { ...action.payload, id: Date.now() }] };

    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };

    default:
      return state;
  }
}

// protection for warehouseId: if user is not authenticated or doesn't have warehouseId, we set loading to false but keep data empty
export function WarehouseProvider({ children, isAuthenticated, userProfile }) {
  const [state, dispatch] = useReducer(warehouseReducer, initialState);

  const loadData = useCallback(async () => {
  // 1. LOG UNTUK CEK STATUS AUTH
  console.log("DEBUG AUTH:", { isAuthenticated, userProfile });

  // 2. PAKSA JALANIN TANPA CEK AUTH (UNTUK TESTING DOANG)
  const warehouseId = userProfile?.warehouseId || "WH-001";
  console.log("Mencoba narik data buat ID:", warehouseId);

  try {
    const [zones, cameras, alerts, inventory, activityLog, detectionStats] = await Promise.all([
      db.fetchZones(warehouseId),
      db.fetchCameras(warehouseId),
      db.fetchAlerts(warehouseId),
      db.fetchInventory(warehouseId),
      db.fetchActivityLog(warehouseId),
      db.fetchDetectionStats(warehouseId),
    ]);

    console.log("DATA BERHASIL DITARIK:", detectionStats);

    dispatch({
      type: 'SET_DATA',
      payload: { zones, cameras, alerts, inventory, activityLog, detectionStats },
    });
  } catch (err) {
    console.error('Failed to load warehouse data:', err);
    dispatch({ type: 'SET_DATA', payload: { loading: false } });
  }
}, [isAuthenticated, userProfile]);

  useEffect(() => {
    loadData();
    // logic real time for detections is now handled in DetectionPage.jsx, so we don't need to subscribe here anymore
  }, [loadData]);

  const addToast = useCallback((toast) => {
    const id = Date.now();
    dispatch({ type: 'ADD_TOAST', payload: { ...toast, id } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 4000);
  }, []);

  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  return (
    <WarehouseContext.Provider value={{ state, dispatch, addToast, refreshData }}>
      {children}
    </WarehouseContext.Provider>
  );
}

export function useWarehouse() {
  const context = useContext(WarehouseContext);
  if (!context) throw new Error('useWarehouse must be used within WarehouseProvider');
  return context;
}