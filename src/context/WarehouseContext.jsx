import { createContext, useContext, useReducer, useCallback } from 'react';
import { INVENTORY_ITEMS, ALERT_DATA, ACTIVITY_LOG, ZONES, DETECTION_STATS } from '../data/mockData';

const WarehouseContext = createContext(null);

const initialState = {
  inventory: INVENTORY_ITEMS,
  alerts: ALERT_DATA,
  activityLog: ACTIVITY_LOG,
  zones: ZONES,
  detectionStats: DETECTION_STATS,
  toasts: [],
  sidebarCollapsed: false,
};

function warehouseReducer(state, action) {
  switch (action.type) {
    case 'ADD_INVENTORY_ITEM':
      return {
        ...state,
        inventory: [action.payload, ...state.inventory],
        activityLog: [
          {
            id: `LOG-${Date.now()}`,
            user: 'Current User',
            action: 'Added new item',
            target: `${action.payload.id} (${action.payload.name})`,
            timestamp: new Date().toISOString(),
            type: 'create',
          },
          ...state.activityLog,
        ],
      };

    case 'UPDATE_INVENTORY_ITEM':
      return {
        ...state,
        inventory: state.inventory.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload } : item
        ),
        activityLog: [
          {
            id: `LOG-${Date.now()}`,
            user: 'Current User',
            action: 'Updated item',
            target: `${action.payload.id} (${action.payload.name})`,
            timestamp: new Date().toISOString(),
            type: 'update',
          },
          ...state.activityLog,
        ],
      };

    case 'DELETE_INVENTORY_ITEM':
      return {
        ...state,
        inventory: state.inventory.filter((item) => item.id !== action.payload),
        activityLog: [
          {
            id: `LOG-${Date.now()}`,
            user: 'Current User',
            action: 'Deleted item',
            target: action.payload,
            timestamp: new Date().toISOString(),
            type: 'delete',
          },
          ...state.activityLog,
        ],
      };

    case 'MARK_ALERT_READ':
      return {
        ...state,
        alerts: state.alerts.map((alert) =>
          alert.id === action.payload ? { ...alert, read: true } : alert
        ),
      };

    case 'MARK_ALL_ALERTS_READ':
      return {
        ...state,
        alerts: state.alerts.map((alert) => ({ ...alert, read: true })),
      };

    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, { ...action.payload, id: Date.now() }],
      };

    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload),
      };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };

    case 'UPDATE_ZONE':
      return {
        ...state,
        zones: state.zones.map((zone) =>
          zone.id === action.payload.id ? { ...zone, ...action.payload } : zone
        ),
      };

    case 'ADD_ACTIVITY':
      return {
        ...state,
        activityLog: [action.payload, ...state.activityLog],
      };

    default:
      return state;
  }
}

export function WarehouseProvider({ children }) {
  const [state, dispatch] = useReducer(warehouseReducer, initialState);

  const addToast = useCallback((toast) => {
    const id = Date.now();
    dispatch({ type: 'ADD_TOAST', payload: { ...toast, id } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 4000);
  }, []);

  return (
    <WarehouseContext.Provider value={{ state, dispatch, addToast }}>
      {children}
    </WarehouseContext.Provider>
  );
}

export function useWarehouse() {
  const context = useContext(WarehouseContext);
  if (!context) throw new Error('useWarehouse must be used within WarehouseProvider');
  return context;
}
