-- ============================================
-- SMART WAREHOUSE - Seed Data for Demo
-- Run this AFTER schema.sql in Supabase SQL Editor
-- Populates zones, cameras, inventory, and sample alerts
-- ============================================

-- Zones (6 warehouse zones)
INSERT INTO zones (name, description, color, capacity, current_load, status, x, y, width, height) VALUES
  ('Zone A -- Inbound Dock',     'Receiving area for incoming shipments',             '#4a90d9', 500, 120, 'active', 0.02, 0.02, 0.30, 0.45),
  ('Zone B -- Cold Storage',     'Temperature controlled storage for perishables',    '#3db8a9', 300,  85, 'active', 0.34, 0.02, 0.30, 0.45),
  ('Zone C -- General Storage',  'Main warehouse storage area for general goods',     '#e5a035', 800, 340, 'active', 0.66, 0.02, 0.30, 0.45),
  ('Zone D -- Packing Area',     'Order processing and packing station',              '#7c6cf0', 200,  60, 'active', 0.02, 0.52, 0.30, 0.45),
  ('Zone E -- Outbound Dock',    'Shipping and dispatch staging area',                '#d95459', 400, 150, 'active', 0.34, 0.52, 0.30, 0.45),
  ('Zone F -- Admin Office',     'Office space and system monitoring room',            '#64748b', 50,  10, 'active', 0.66, 0.52, 0.30, 0.45);

-- Cameras (8 surveillance cameras linked to zones)
INSERT INTO cameras (zone_id, name, status, resolution, fps)
SELECT z.id, cam.name, cam.status, cam.resolution, cam.fps
FROM (VALUES
  ('Zone A -- Inbound Dock',     'CAM-01 Dock Entry',       'online',  '1920x1080', 30),
  ('Zone A -- Inbound Dock',     'CAM-02 Dock Overview',    'online',  '1920x1080', 30),
  ('Zone B -- Cold Storage',     'CAM-03 Cold Room',        'online',  '1280x720',  24),
  ('Zone C -- General Storage',  'CAM-04 Aisle North',      'online',  '1920x1080', 30),
  ('Zone C -- General Storage',  'CAM-05 Aisle South',      'online',  '1920x1080', 30),
  ('Zone D -- Packing Area',     'CAM-06 Packing Station',  'online',  '1280x720',  24),
  ('Zone E -- Outbound Dock',    'CAM-07 Shipping Lane',    'online',  '1920x1080', 30),
  ('Zone F -- Admin Office',     'CAM-08 Office Monitor',   'offline', '1280x720',  24)
) AS cam(zone_name, name, status, resolution, fps)
JOIN zones z ON z.name = cam.zone_name;

-- Inventory items (warehouse safety and pest control equipment)
INSERT INTO inventory (zone_id, item_code, name, category, quantity, min_stock, status, weight)
SELECT z.id, item.item_code, item.name, item.category, item.quantity, item.min_stock, item.status, item.weight
FROM (VALUES
  ('Zone A -- Inbound Dock',    'PT-001', 'Snake Trap Type A',        'Pest Control',    12,  5, 'in-stock', 2.5),
  ('Zone A -- Inbound Dock',    'PT-002', 'Rodent Bait Station',      'Pest Control',     8,  4, 'in-stock', 1.8),
  ('Zone B -- Cold Storage',    'EQ-001', 'Thermal Camera Sensor',    'Equipment',         3,  2, 'in-stock', 0.4),
  ('Zone C -- General Storage', 'PT-003', 'Gecko Glue Board',         'Pest Control',    24, 10, 'in-stock', 0.3),
  ('Zone C -- General Storage', 'PT-004', 'UV Insect Killer',         'Pest Control',     6,  3, 'in-stock', 3.2),
  ('Zone D -- Packing Area',    'SF-001', 'Safety Gloves (Box)',      'Safety Gear',     15,  5, 'in-stock', 1.0),
  ('Zone D -- Packing Area',    'SF-002', 'First Aid Kit',            'Safety Gear',      4,  2, 'in-stock', 2.0),
  ('Zone E -- Outbound Dock',   'EQ-002', 'Motion Sensor Alarm',      'Equipment',         5,  2, 'in-stock', 0.6),
  ('Zone E -- Outbound Dock',   'PT-005', 'Cat Deterrent Spray',      'Pest Control',    10,  4, 'in-stock', 0.5),
  ('Zone F -- Admin Office',    'AD-001', 'Pest Incident Logbook',    'Documentation',    2,  1, 'in-stock', 0.8)
) AS item(zone_name, item_code, name, category, quantity, min_stock, status, weight)
JOIN zones z ON z.name = item.zone_name;

-- Sample alerts (recent pest detection events)
INSERT INTO alerts (type, severity, title, message, zone_id, animal_type, status, created_at)
SELECT a.type, a.severity, a.title, a.message, z.id, a.animal_type, a.status,
       NOW() - (a.hours_ago || ' hours')::interval
FROM (VALUES
  ('critical', 'high',   'Snake Detected via AI Scan',  'AI detected snake (96.2% confidence) in Zone A. Immediate response recommended.',  'Zone A -- Inbound Dock',    'snake', 'unread',  2),
  ('warning',  'medium', 'Cat Detected via AI Scan',    'AI detected cat (91.5% confidence) in Zone C. Monitor and respond.',               'Zone C -- General Storage', 'cat',   'unread',  5),
  ('warning',  'medium', 'Gecko Detected via AI Scan',  'AI detected gecko (88.3% confidence) in Zone D. Low risk, monitor situation.',      'Zone D -- Packing Area',    'gecko', 'read',   12),
  ('critical', 'high',   'Snake Detected via AI Scan',  'AI detected snake (94.7% confidence) in Zone E. Immediate response recommended.',  'Zone E -- Outbound Dock',   'snake', 'read',   24),
  ('info',     'low',    'System Health Check',         'All 7 cameras online. AI model YOLOv8 running normally.',                           'Zone F -- Admin Office',    NULL,    'read',   48),
  ('warning',  'medium', 'Cat Detected via AI Scan',    'AI detected cat (89.1% confidence) in Zone B. Cold storage area, high priority.',  'Zone B -- Cold Storage',    'cat',   'read',   72)
) AS a(type, severity, title, message, zone_name, animal_type, status, hours_ago)
JOIN zones z ON z.name = a.zone_name;

-- Sample detection sessions (to populate analytics charts)
INSERT INTO detections (total_objects, inference_time_ms, model_version, created_at) VALUES
  (2, 142, 'YOLOv8', NOW() - interval '2 hours'),
  (1, 98,  'YOLOv8', NOW() - interval '5 hours'),
  (1, 115, 'YOLOv8', NOW() - interval '12 hours'),
  (3, 187, 'YOLOv8', NOW() - interval '1 day'),
  (1, 105, 'YOLOv8', NOW() - interval '2 days'),
  (2, 134, 'YOLOv8', NOW() - interval '3 days');

-- Sample detection results (individual pest detections for analytics)
-- Uses a DO block to reliably link results to detection sessions
DO $$
DECLARE
  det_ids UUID[];
BEGIN
  SELECT array_agg(id ORDER BY created_at DESC) INTO det_ids FROM detections;

  IF array_length(det_ids, 1) >= 6 THEN
    -- Detection 1 (2 hours ago): snake + gecko
    INSERT INTO detection_results (detection_id, class_name, confidence, x, y, width, height, created_at) VALUES
      (det_ids[1], 'snake', 0.962, 120.5, 85.3, 210.0, 95.0, NOW() - interval '2 hours'),
      (det_ids[1], 'gecko', 0.883, 450.2, 220.1, 80.0, 55.0, NOW() - interval '2 hours');

    -- Detection 2 (5 hours ago): cat
    INSERT INTO detection_results (detection_id, class_name, confidence, x, y, width, height, created_at) VALUES
      (det_ids[2], 'cat', 0.915, 200.0, 150.0, 180.0, 200.0, NOW() - interval '5 hours');

    -- Detection 3 (12 hours ago): gecko
    INSERT INTO detection_results (detection_id, class_name, confidence, x, y, width, height, created_at) VALUES
      (det_ids[3], 'gecko', 0.871, 380.0, 300.0, 70.0, 50.0, NOW() - interval '12 hours');

    -- Detection 4 (1 day ago): snake + cat + gecko
    INSERT INTO detection_results (detection_id, class_name, confidence, x, y, width, height, created_at) VALUES
      (det_ids[4], 'snake', 0.947, 100.0, 60.0, 230.0, 85.0, NOW() - interval '1 day'),
      (det_ids[4], 'cat',   0.891, 500.0, 180.0, 160.0, 190.0, NOW() - interval '1 day'),
      (det_ids[4], 'gecko', 0.845, 320.0, 350.0, 65.0, 45.0, NOW() - interval '1 day');

    -- Detection 5 (2 days ago): snake
    INSERT INTO detection_results (detection_id, class_name, confidence, x, y, width, height, created_at) VALUES
      (det_ids[5], 'snake', 0.934, 150.0, 90.0, 200.0, 80.0, NOW() - interval '2 days');

    -- Detection 6 (3 days ago): cat + snake
    INSERT INTO detection_results (detection_id, class_name, confidence, x, y, width, height, created_at) VALUES
      (det_ids[6], 'cat',   0.908, 280.0, 200.0, 170.0, 185.0, NOW() - interval '3 days'),
      (det_ids[6], 'snake', 0.876, 50.0, 50.0, 240.0, 100.0, NOW() - interval '3 days');
  END IF;
END $$;

-- Activity log entries
INSERT INTO activity_log (user_name, action, target, type, created_at) VALUES
  ('Sultan', 'AI Pest Scan: 2 detections',  'Snake, Gecko',           'detection', NOW() - interval '2 hours'),
  ('Sultan', 'AI Pest Scan: 1 detection',   'Cat',                    'detection', NOW() - interval '5 hours'),
  ('System', 'Camera CAM-08 went offline',  'Office Monitor',         'system',    NOW() - interval '8 hours'),
  ('Sultan', 'AI Pest Scan: 1 detection',   'Gecko',                  'detection', NOW() - interval '12 hours'),
  ('Misha',  'Added inventory item',        'Snake Trap Type A',      'create',    NOW() - interval '1 day'),
  ('Sultan', 'AI Pest Scan: 3 detections',  'Snake, Cat, Gecko',      'detection', NOW() - interval '1 day'),
  ('Fathir', 'Marked alert as read',        'Snake Detected in E',    'update',    NOW() - interval '1 day'),
  ('Sultan', 'AI Pest Scan: 1 detection',   'Snake',                  'detection', NOW() - interval '2 days'),
  ('Risly',  'Exported alerts report',      'CSV Export',             'export',    NOW() - interval '2 days'),
  ('Sultan', 'AI Pest Scan: 2 detections',  'Cat, Snake',             'detection', NOW() - interval '3 days');
