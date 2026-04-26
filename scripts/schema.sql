-- ============================================
-- SMART WAREHOUSE — Bio-Hazard & Pest Detection
-- Copy this ENTIRE script into Supabase SQL Editor
-- Run it in ONE go
-- ============================================

-- Step 1: Clean up (drop existing tables if any)
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS detection_results CASCADE;
DROP TABLE IF EXISTS detections CASCADE;
DROP TABLE IF EXISTS cameras CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS zones CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Step 2: Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'operator',
  student_id TEXT,
  avatar_initials TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Warehouse Zones
CREATE TABLE zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#4a90d9',
  capacity INTEGER DEFAULT 0,
  current_load INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  x REAL DEFAULT 0,
  y REAL DEFAULT 0,
  width REAL DEFAULT 0,
  height REAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 4: Surveillance Cameras
CREATE TABLE cameras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'online',
  resolution TEXT DEFAULT '1920x1080',
  fps INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 5: AI Detection Sessions
CREATE TABLE detections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  image_url TEXT,
  total_objects INTEGER DEFAULT 0,
  inference_time_ms INTEGER DEFAULT 0,
  model_version TEXT DEFAULT 'YOLOv8',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 6: Individual Detected Objects
CREATE TABLE detection_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  detection_id UUID REFERENCES detections(id) ON DELETE CASCADE,
  class_name TEXT NOT NULL,
  confidence REAL NOT NULL,
  x REAL NOT NULL,
  y REAL NOT NULL,
  width REAL NOT NULL,
  height REAL NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 7: Alerts
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  severity TEXT DEFAULT 'medium',
  title TEXT NOT NULL,
  message TEXT,
  zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
  animal_type TEXT,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 8: Activity Log
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT,
  action TEXT NOT NULL,
  target TEXT,
  details TEXT,
  type TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 9: Inventory Items
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
  quantity INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  status TEXT DEFAULT 'in-stock',
  weight REAL DEFAULT 0,
  last_detected TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 10: User Settings
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  setting_key TEXT NOT NULL,
  setting_value TEXT,
  UNIQUE(user_id, setting_key)
);

-- Step 11: Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE cameras ENABLE ROW LEVEL SECURITY;
ALTER TABLE detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE detection_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Step 12: RLS Policies
CREATE POLICY "profiles_select" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "zones_all" ON zones FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "cameras_all" ON cameras FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "detections_all" ON detections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "detection_results_all" ON detection_results FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "alerts_all" ON alerts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "activity_log_all" ON activity_log FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "inventory_all" ON inventory FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "user_settings_all" ON user_settings FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Step 13: Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, avatar_initials)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'operator'),
    UPPER(LEFT(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 2))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 14: Seed initial zone data
INSERT INTO zones (name, description, color, capacity, current_load, status, x, y, width, height) VALUES
('Zone A — Receiving', 'Incoming shipment receiving area', '#4a90d9', 500, 387, 'active', 5, 5, 40, 30),
('Zone B — Storage', 'Main storage area with shelving units', '#7c6cf0', 1200, 940, 'active', 50, 5, 45, 30),
('Zone C — Processing', 'Order processing and packaging', '#3db8a9', 300, 210, 'active', 5, 40, 35, 30),
('Zone D — Shipping', 'Outbound shipping and loading docks', '#e5a035', 400, 334, 'active', 45, 40, 50, 30),
('Zone E — Hazardous', 'Restricted hazardous materials storage', '#d95459', 100, 45, 'warning', 5, 75, 25, 20),
('Zone F — Cold Storage', 'Temperature-controlled refrigeration unit', '#3b82f6', 200, 178, 'active', 35, 75, 30, 20);

-- Step 15: Seed cameras
INSERT INTO cameras (name, zone_id, status, resolution, fps)
SELECT 'Camera 1', id, 'online', '1920x1080', 30 FROM zones WHERE name LIKE '%Receiving%' LIMIT 1;
INSERT INTO cameras (name, zone_id, status, resolution, fps)
SELECT 'Camera 2', id, 'online', '1920x1080', 30 FROM zones WHERE name LIKE '%Receiving%' LIMIT 1;
INSERT INTO cameras (name, zone_id, status, resolution, fps)
SELECT 'Camera 3', id, 'online', '2560x1440', 30 FROM zones WHERE name LIKE 'Zone B%' LIMIT 1;
INSERT INTO cameras (name, zone_id, status, resolution, fps)
SELECT 'Camera 4', id, 'offline', '1920x1080', 0 FROM zones WHERE name LIKE '%Processing%' LIMIT 1;
INSERT INTO cameras (name, zone_id, status, resolution, fps)
SELECT 'Camera 5', id, 'online', '1920x1080', 30 FROM zones WHERE name LIKE '%Shipping%' LIMIT 1;
INSERT INTO cameras (name, zone_id, status, resolution, fps)
SELECT 'Camera 6', id, 'online', '2560x1440', 30 FROM zones WHERE name LIKE '%Shipping%' LIMIT 1;
INSERT INTO cameras (name, zone_id, status, resolution, fps)
SELECT 'Camera 7', id, 'online', '1920x1080', 30 FROM zones WHERE name LIKE '%Hazardous%' LIMIT 1;
INSERT INTO cameras (name, zone_id, status, resolution, fps)
SELECT 'Camera 8', id, 'online', '1920x1080', 30 FROM zones WHERE name LIKE '%Cold%' LIMIT 1;
