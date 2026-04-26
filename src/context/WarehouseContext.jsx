import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import * as db from '../lib/database';
import { supabase } from '../lib/supabase';

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

    case 'MARK_ALL_ALERTS_READ':
      return {
        ...state,
        alerts: state.alerts.map((alert) => ({ ...alert, status: 'read' })),
      };

    case 'SET_ZONES':
      return { ...state, zones: action.payload };

    case 'UPDATE_ZONE':
      return {
        ...state,
        zones: state.zones.map((zone) =>
          zone.id === action.payload.id ? { ...zone, ...action.payload } : zone
        ),
      };

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

export function WarehouseProvider({ children, isAuthenticated }) {
  const [state, dispatch] = useReducer(warehouseReducer, initialState);

  // Load all data from Supabase once authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // Reset to initial state when logged out
      dispatch({ type: 'SET_DATA', payload: { ...initialState, loading: false } });
      return;
    }

    async function loadData() {
      try {
        const [zones, cameras, alerts, inventory, activityLog, detectionStats] = await Promise.all([
          db.fetchZones(),
          db.fetchCameras(),
          db.fetchAlerts(),
          db.fetchInventory(),
          db.fetchActivityLog(),
          db.fetchDetectionStats(),
        ]);

        dispatch({
          type: 'SET_DATA',
          payload: { zones, cameras, alerts, inventory, activityLog, detectionStats },
        });
      } catch (err) {
        console.error('Failed to load warehouse data:', err);
        dispatch({ type: 'SET_DATA', payload: { loading: false } });
      }
    }
    loadData();

    // Real-time subscription for new alerts
    const channel = supabase
      .channel('realtime-alerts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alerts' }, (payload) => {
        dispatch({ type: 'ADD_ALERT', payload: payload.new });
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' }, (payload) => {
        dispatch({ type: 'ADD_ACTIVITY', payload: payload.new });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  const addToast = useCallback((toast) => {
    const id = Date.now();
    dispatch({ type: 'ADD_TOAST', payload: { ...toast, id } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 4000);
  }, []);

  // Refresh data from Supabase
  const refreshData = useCallback(async () => {
    try {
      const [zones, cameras, alerts, inventory, activityLog, detectionStats] = await Promise.all([
        db.fetchZones(),
        db.fetchCameras(),
        db.fetchAlerts(),
        db.fetchInventory(),
        db.fetchActivityLog(),
        db.fetchDetectionStats(),
      ]);
      dispatch({
        type: 'SET_DATA',
        payload: { zones, cameras, alerts, inventory, activityLog, detectionStats },
      });
    } catch (err) {
      console.error('Failed to refresh data:', err);
    }
  }, []);

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
