import { useEffect, useRef, useCallback } from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import * as db from '../../lib/database';

// Pest-themed live events
const PEST_SPECIES = ['Snake', 'Cat', 'Gecko'];

const EVENTS = [
  { type: 'detection', getMessage: (zones) => {
    const pest = PEST_SPECIES[Math.floor(Math.random() * PEST_SPECIES.length)];
    const zone = zones.length > 0 ? zones[Math.floor(Math.random() * zones.length)] : { name: 'Zone A' };
    return {
      title: `${pest} Detected!`,
      message: `${pest} spotted in ${zone.name.split('\u2014')[0].trim()} \u2014 confirm and respond`,
      toastType: pest === 'Snake' ? 'error' : 'warning',
      animal_type: pest,
      zone_id: zone.id,
    };
  }},
  { type: 'system', getMessage: () => ({
    title: 'Camera Update',
    message: `Camera ${Math.floor(Math.random()*8)+1} stream reconnected`,
    toastType: 'info',
  })},
  { type: 'system', getMessage: () => ({
    title: 'AI Model Check',
    message: 'Pest detection model YOLOv8 is running normally',
    toastType: 'success',
  })},
];

export default function LiveEventSimulator() {
  const { state, dispatch, addToast } = useWarehouse();
  const intervalRef = useRef(null);

  const simulateEvent = useCallback(async () => {
    const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    const { title, message, toastType, animal_type, zone_id } = event.getMessage(state.zones);

    // Add to activity log in Supabase
    try {
      await db.logActivity({
        user_name: 'System',
        action: title,
        target: message,
        type: event.type,
      });
    } catch (err) {
      // Non-critical, don't block
    }

    // Add to local activity log
    dispatch({
      type: 'ADD_ACTIVITY',
      payload: {
        id: `LOG-RT-${Date.now()}`,
        user_name: 'System',
        action: title,
        target: message,
        created_at: new Date().toISOString(),
        type: event.type,
      },
    });

    // If pest detection, create an alert too
    if (event.type === 'detection' && animal_type) {
      try {
        const alert = await db.createAlert({
          type: 'critical',
          severity: animal_type === 'Snake' ? 'high' : 'medium',
          title: title,
          message: message,
          zone_id: zone_id,
          animal_type: animal_type.toLowerCase(),
          status: 'unread',
        });
        dispatch({ type: 'ADD_ALERT', payload: alert });
      } catch (err) {
        // Non-critical
      }
    }

    // Show toast notification
    addToast({ type: toastType, title, message });
  }, [state.zones, dispatch, addToast]);

  useEffect(() => {
    // Fire first event after 20 seconds, then every 30-60 seconds
    const timeout = setTimeout(() => {
      simulateEvent();
      intervalRef.current = setInterval(simulateEvent, 30000 + Math.random() * 30000);
    }, 20000);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [simulateEvent]);

  return null; // Headless component
}
