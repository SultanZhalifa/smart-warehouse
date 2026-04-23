import { useEffect, useRef, useCallback } from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import { OBJECT_CLASSES, ZONES } from '../../data/mockData';

const EVENTS = [
  { type: 'detection', getMessage: () => {
    const obj = OBJECT_CLASSES[Math.floor(Math.random() * OBJECT_CLASSES.length)];
    const zone = ZONES[Math.floor(Math.random() * ZONES.length)];
    return { title: 'Object Detected', message: `${obj.name} detected in ${zone.name.split('—')[0].trim()}`, toastType: 'info' };
  }},
  { type: 'alert', getMessage: () => ({
    title: 'Zone Capacity Warning',
    message: `Zone ${['A','B','C','D'][Math.floor(Math.random()*4)]} approaching max capacity`,
    toastType: 'warning',
  })},
  { type: 'system', getMessage: () => ({
    title: 'Camera Update',
    message: `Camera ${Math.floor(Math.random()*8)+1} stream reconnected`,
    toastType: 'info',
  })},
  { type: 'inventory', getMessage: () => ({
    title: 'Inventory Update',
    message: `${Math.floor(Math.random()*50)+5} new items scanned via object detection`,
    toastType: 'success',
  })},
];

export default function LiveEventSimulator() {
  const { dispatch, addToast } = useWarehouse();
  const intervalRef = useRef(null);

  const simulateEvent = useCallback(() => {
    const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    const { title, message, toastType } = event.getMessage();

    // Add to activity log
    dispatch({
      type: 'ADD_ACTIVITY',
      payload: {
        id: `LOG-RT-${Date.now()}`,
        user: 'System',
        action: title.replace(/[^\w\s]/g, '').trim(),
        target: message,
        timestamp: new Date().toISOString(),
        type: event.type === 'detection' ? 'detection' : event.type === 'alert' ? 'alert' : 'system',
      },
    });

    // Show toast notification
    addToast({ type: toastType, title, message });
  }, [dispatch, addToast]);

  useEffect(() => {
    // Fire first event after 15 seconds, then every 25-45 seconds
    const timeout = setTimeout(() => {
      simulateEvent();
      intervalRef.current = setInterval(simulateEvent, 25000 + Math.random() * 20000);
    }, 15000);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [simulateEvent]);

  return null; // This is a headless component
}
