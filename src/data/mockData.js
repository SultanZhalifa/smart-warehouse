// ============================================
// SMART WAREHOUSE — Mock Data
// ============================================

export const OBJECT_CLASSES = [
  { id: 1, name: 'Cardboard Box', color: '#4a90d9', icon: 'Package' },
  { id: 2, name: 'Wooden Pallet', color: '#7c6cf0', icon: 'Layers' },
  { id: 3, name: 'Forklift', color: '#3db8a9', icon: 'Truck' },
  { id: 4, name: 'Worker', color: '#e5a035', icon: 'HardHat' },
  { id: 5, name: 'Barrel', color: '#d95459', icon: 'Cylinder' },
  { id: 6, name: 'Crate', color: '#c86d99', icon: 'BoxSelect' },
  { id: 7, name: 'Conveyor Belt', color: '#f97316', icon: 'Cog' },
  { id: 8, name: 'Shelf Unit', color: '#14b8a6', icon: 'LayoutGrid' },
];

export const ZONES = [
  { id: 'zone-a', name: 'Zone A — Receiving', color: '#4a90d9', x: 5, y: 5, width: 40, height: 30, capacity: 500, used: 387, status: 'active', description: 'Incoming shipment receiving area' },
  { id: 'zone-b', name: 'Zone B — Storage', color: '#7c6cf0', x: 50, y: 5, width: 45, height: 30, capacity: 1200, used: 940, status: 'active', description: 'Main storage area with shelving units' },
  { id: 'zone-c', name: 'Zone C — Processing', color: '#3db8a9', x: 5, y: 40, width: 35, height: 30, capacity: 300, used: 210, status: 'active', description: 'Order processing and packaging' },
  { id: 'zone-d', name: 'Zone D — Shipping', color: '#e5a035', x: 45, y: 40, width: 50, height: 30, capacity: 400, used: 334, status: 'active', description: 'Outbound shipping and loading docks' },
  { id: 'zone-e', name: 'Zone E — Hazardous', color: '#d95459', x: 5, y: 75, width: 25, height: 20, capacity: 100, used: 45, status: 'warning', description: 'Restricted hazardous materials storage' },
  { id: 'zone-f', name: 'Zone F — Cold Storage', color: '#3b82f6', x: 35, y: 75, width: 30, height: 20, capacity: 200, used: 178, status: 'active', description: 'Temperature-controlled refrigeration unit' },
];

export const INVENTORY_ITEMS = [
  { id: 'INV-001', name: 'Electronic Components Pack A', category: 'Electronics', zone: 'zone-a', quantity: 450, minStock: 100, status: 'in-stock', lastDetected: '2026-04-16T10:30:00', weight: 2.5 },
  { id: 'INV-002', name: 'Industrial Lubricant 5L', category: 'Chemicals', zone: 'zone-e', quantity: 38, minStock: 50, status: 'low-stock', lastDetected: '2026-04-16T09:15:00', weight: 5.2 },
  { id: 'INV-003', name: 'Steel Bearings Box', category: 'Mechanical', zone: 'zone-b', quantity: 1200, minStock: 200, status: 'in-stock', lastDetected: '2026-04-16T11:00:00', weight: 15.0 },
  { id: 'INV-004', name: 'Frozen Food Containers', category: 'Perishable', zone: 'zone-f', quantity: 85, minStock: 100, status: 'low-stock', lastDetected: '2026-04-16T08:45:00', weight: 3.0 },
  { id: 'INV-005', name: 'Automotive Parts Set B', category: 'Automotive', zone: 'zone-b', quantity: 620, minStock: 150, status: 'in-stock', lastDetected: '2026-04-16T10:00:00', weight: 8.3 },
  { id: 'INV-006', name: 'Packaging Material Roll', category: 'Supplies', zone: 'zone-c', quantity: 0, minStock: 50, status: 'out-of-stock', lastDetected: '2026-04-15T16:30:00', weight: 1.2 },
  { id: 'INV-007', name: 'Server Rack Equipment', category: 'Electronics', zone: 'zone-b', quantity: 24, minStock: 10, status: 'in-stock', lastDetected: '2026-04-16T07:20:00', weight: 45.0 },
  { id: 'INV-008', name: 'Safety Helmet Batch', category: 'Safety', zone: 'zone-a', quantity: 300, minStock: 50, status: 'in-stock', lastDetected: '2026-04-16T11:30:00', weight: 0.4 },
  { id: 'INV-009', name: 'Cleaning Solution 10L', category: 'Chemicals', zone: 'zone-e', quantity: 12, minStock: 20, status: 'low-stock', lastDetected: '2026-04-16T06:00:00', weight: 10.5 },
  { id: 'INV-010', name: 'Wooden Pallet Stack', category: 'Logistics', zone: 'zone-d', quantity: 890, minStock: 100, status: 'in-stock', lastDetected: '2026-04-16T12:00:00', weight: 22.0 },
  { id: 'INV-011', name: 'LED Panel Lights', category: 'Electronics', zone: 'zone-b', quantity: 156, minStock: 30, status: 'in-stock', lastDetected: '2026-04-16T09:45:00', weight: 1.8 },
  { id: 'INV-012', name: 'Hydraulic Pump Unit', category: 'Mechanical', zone: 'zone-c', quantity: 8, minStock: 5, status: 'in-stock', lastDetected: '2026-04-16T10:15:00', weight: 35.0 },
];

export const ALERT_DATA = [
  { id: 'ALT-001', type: 'critical', title: 'Unauthorized Object Detected', message: 'Unknown object detected in Zone E (Hazardous area). Immediate inspection required.', timestamp: '2026-04-16T12:30:00', zone: 'zone-e', read: false },
  { id: 'ALT-002', type: 'warning', title: 'Low Stock Alert', message: 'Industrial Lubricant 5L (INV-002) has fallen below minimum stock level.', timestamp: '2026-04-16T11:45:00', zone: 'zone-e', read: false },
  { id: 'ALT-003', type: 'info', title: 'Detection Model Updated', message: 'Object detection model v2.4.1 has been deployed successfully across all cameras.', timestamp: '2026-04-16T11:00:00', zone: null, read: true },
  { id: 'ALT-004', type: 'warning', title: 'Zone Capacity Warning', message: 'Zone B — Storage is approaching maximum capacity (78% utilized).', timestamp: '2026-04-16T10:30:00', zone: 'zone-b', read: true },
  { id: 'ALT-005', type: 'critical', title: 'Camera 4 Offline', message: 'Camera 4 in Zone C has gone offline. Object detection coverage gap detected.', timestamp: '2026-04-16T09:15:00', zone: 'zone-c', read: false },
  { id: 'ALT-006', type: 'info', title: 'Scheduled Maintenance', message: 'System maintenance scheduled for April 17 at 02:00 AM — 04:00 AM UTC.', timestamp: '2026-04-16T08:00:00', zone: null, read: true },
  { id: 'ALT-007', type: 'warning', title: 'Temperature Anomaly', message: 'Cold Storage (Zone F) temperature rose to -12°C. Expected range: -18°C to -15°C.', timestamp: '2026-04-16T07:30:00', zone: 'zone-f', read: false },
  { id: 'ALT-008', type: 'info', title: 'New Items Registered', message: '45 new items have been registered through object detection in the past hour.', timestamp: '2026-04-16T07:00:00', zone: null, read: true },
];

export const ACTIVITY_LOG = [
  { id: 'LOG-001', user: 'Risly Worung', action: 'Updated inventory count', target: 'INV-003 (Steel Bearings Box)', timestamp: '2026-04-16T12:45:00', type: 'update' },
  { id: 'LOG-002', user: 'System', action: 'Object detected', target: 'Forklift in Zone D', timestamp: '2026-04-16T12:30:00', type: 'detection' },
  { id: 'LOG-003', user: 'Misha Andalusia', action: 'Added new item', target: 'INV-012 (Hydraulic Pump Unit)', timestamp: '2026-04-16T12:15:00', type: 'create' },
  { id: 'LOG-004', user: 'System', action: 'Alert triggered', target: 'Unauthorized Object in Zone E', timestamp: '2026-04-16T12:00:00', type: 'alert' },
  { id: 'LOG-005', user: 'Fathir Barhouti', action: 'Modified zone settings', target: 'Zone B — Storage', timestamp: '2026-04-16T11:45:00', type: 'update' },
  { id: 'LOG-006', user: 'Sultan Musyaffa', action: 'Exported analytics report', target: 'Weekly Detection Summary', timestamp: '2026-04-16T11:30:00', type: 'export' },
  { id: 'LOG-007', user: 'System', action: 'Model deployment complete', target: 'Detection Model v2.4.1', timestamp: '2026-04-16T11:00:00', type: 'system' },
  { id: 'LOG-008', user: 'Risly Worung', action: 'Approved stock transfer', target: 'Zone A → Zone B (150 units)', timestamp: '2026-04-16T10:30:00', type: 'approval' },
  { id: 'LOG-009', user: 'System', action: 'Camera reconnected', target: 'Camera 2 (Zone A)', timestamp: '2026-04-16T10:00:00', type: 'system' },
  { id: 'LOG-010', user: 'Misha Andalusia', action: 'Deleted expired item', target: 'INV-006 (Packaging Material Roll)', timestamp: '2026-04-16T09:45:00', type: 'delete' },
  { id: 'LOG-011', user: 'System', action: 'Batch detection complete', target: '127 objects scanned in Zone B', timestamp: '2026-04-16T09:30:00', type: 'detection' },
  { id: 'LOG-012', user: 'Fathir Barhouti', action: 'Updated user permissions', target: 'Operator role access modified', timestamp: '2026-04-16T09:00:00', type: 'update' },
];

export const DETECTION_STATS = {
  today: 1247,
  yesterday: 1103,
  week: 8451,
  month: 34209,
  accuracy: 97.3,
  avgProcessingTime: 42,
  camerasOnline: 7,
  camerasTotal: 8,
};

export const CHART_DATA = {
  detectionsByHour: {
    labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
    data: [12, 8, 5, 23, 89, 156, 178, 192, 167, 134, 98, 45],
  },
  detectionsByDay: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [1103, 1247, 1089, 1342, 1198, 876, 596],
  },
  objectDistribution: {
    labels: ['Cardboard Box', 'Pallet', 'Forklift', 'Worker', 'Barrel', 'Crate'],
    data: [340, 280, 45, 180, 95, 307],
  },
  zoneActivity: {
    labels: ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E', 'Zone F'],
    data: [234, 456, 189, 312, 67, 145],
  },
  inventoryTrend: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      { label: 'Items In', data: [1200, 1450, 1300, 1580] },
      { label: 'Items Out', data: [1100, 1380, 1250, 1420] },
    ],
  },
};

export const USERS = [
  { id: 'user-1', name: 'Risly Maria Theresia Worung', email: 'risly@warehouse.io', role: 'admin', studentId: '001202400069', avatar: 'RW' },
  { id: 'user-2', name: 'Misha Andalusia', email: 'misha@warehouse.io', role: 'manager', studentId: '001202400040', avatar: 'MA' },
  { id: 'user-3', name: 'Fathir Barhouti Awlya', email: 'fathir@warehouse.io', role: 'operator', studentId: '001202400054', avatar: 'FB' },
  { id: 'user-4', name: 'Sultan Zhalifunnas Musyaffa', email: 'sultan@warehouse.io', role: 'admin', studentId: '001202400200', avatar: 'SM' },
];

export const CAMERAS = [
  { id: 'cam-1', name: 'Camera 1', zone: 'zone-a', status: 'online', resolution: '1920x1080', fps: 30 },
  { id: 'cam-2', name: 'Camera 2', zone: 'zone-a', status: 'online', resolution: '1920x1080', fps: 30 },
  { id: 'cam-3', name: 'Camera 3', zone: 'zone-b', status: 'online', resolution: '2560x1440', fps: 30 },
  { id: 'cam-4', name: 'Camera 4', zone: 'zone-c', status: 'offline', resolution: '1920x1080', fps: 0 },
  { id: 'cam-5', name: 'Camera 5', zone: 'zone-d', status: 'online', resolution: '1920x1080', fps: 30 },
  { id: 'cam-6', name: 'Camera 6', zone: 'zone-d', status: 'online', resolution: '2560x1440', fps: 30 },
  { id: 'cam-7', name: 'Camera 7', zone: 'zone-e', status: 'online', resolution: '1920x1080', fps: 30 },
  { id: 'cam-8', name: 'Camera 8', zone: 'zone-f', status: 'online', resolution: '1920x1080', fps: 30 },
];
