// ============================================
// SMART WAREHOUSE — Database Helper Functions
// All Supabase CRUD operations in one place
// ============================================

import { supabase } from './supabase';

// ─── ZONES ──────────────────────────────────
export async function fetchZones() {
  const { data, error } = await supabase
    .from('zones')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
}

export async function updateZone(id, updates) {
  const { data, error } = await supabase
    .from('zones')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── CAMERAS ────────────────────────────────
export async function fetchCameras() {
  const { data, error } = await supabase
    .from('cameras')
    .select('*, zones(name)')
    .order('name');
  if (error) throw error;
  return data;
}

// ─── DETECTIONS ─────────────────────────────
export async function createDetection(detection) {
  const { data, error } = await supabase
    .from('detections')
    .insert(detection)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createDetectionResults(results) {
  const { data, error } = await supabase
    .from('detection_results')
    .insert(results)
    .select();
  if (error) throw error;
  return data;
}

export async function fetchDetections(limit = 50) {
  const { data, error } = await supabase
    .from('detections')
    .select('*, detection_results(*)')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function fetchDetectionStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [todayRes, weekRes, totalRes] = await Promise.all([
    supabase.from('detection_results').select('id', { count: 'exact' }).gte('created_at', todayStart),
    supabase.from('detection_results').select('id', { count: 'exact' }).gte('created_at', weekStart),
    supabase.from('detection_results').select('id', { count: 'exact' }),
  ]);

  const camerasRes = await supabase.from('cameras').select('status');
  const cameras = camerasRes.data || [];
  const online = cameras.filter(c => c.status === 'online').length;

  return {
    today: todayRes.count || 0,
    week: weekRes.count || 0,
    total: totalRes.count || 0,
    camerasOnline: online,
    camerasTotal: cameras.length,
  };
}

// ─── ALERTS ─────────────────────────────────
export async function fetchAlerts() {
  const { data, error } = await supabase
    .from('alerts')
    .select('*, zones(name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createAlert(alert) {
  const { data, error } = await supabase
    .from('alerts')
    .insert(alert)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function markAlertRead(id) {
  const { error } = await supabase
    .from('alerts')
    .update({ status: 'read' })
    .eq('id', id);
  if (error) throw error;
}

export async function markAllAlertsRead() {
  const { error } = await supabase
    .from('alerts')
    .update({ status: 'read' })
    .eq('status', 'unread');
  if (error) throw error;
}

// ─── INVENTORY ──────────────────────────────
export async function fetchInventory() {
  const { data, error } = await supabase
    .from('inventory')
    .select('*, zones(name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createInventoryItem(item) {
  const { data, error } = await supabase
    .from('inventory')
    .insert(item)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateInventoryItem(id, updates) {
  const { data, error } = await supabase
    .from('inventory')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteInventoryItem(id) {
  const { error } = await supabase
    .from('inventory')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ─── ACTIVITY LOG ───────────────────────────
export async function fetchActivityLog(limit = 50) {
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function logActivity(entry) {
  const { error } = await supabase
    .from('activity_log')
    .insert(entry);
  if (error) console.error('Failed to log activity:', error);
}

// ─── USER SETTINGS ──────────────────────────
export async function fetchUserSettings(userId) {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}

export async function upsertUserSetting(userId, key, value) {
  const { error } = await supabase
    .from('user_settings')
    .upsert({ user_id: userId, setting_key: key, setting_value: value }, { onConflict: 'user_id,setting_key' });
  if (error) throw error;
}

// ─── PROFILES ───────────────────────────────
export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── ANALYTICS QUERIES ──────────────────────
export async function fetchPestDistribution() {
  const { data, error } = await supabase
    .from('detection_results')
    .select('class_name');
  if (error) throw error;
  const counts = {};
  (data || []).forEach(r => {
    const cls = (r.class_name || 'unknown').toLowerCase();
    counts[cls] = (counts[cls] || 0) + 1;
  });
  return counts;
}

export async function fetchDetectionsByDay(days = 7) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('detection_results')
    .select('created_at')
    .gte('created_at', since)
    .order('created_at');
  if (error) throw error;

  const buckets = {};
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    buckets[key] = { label: dayNames[d.getDay()], count: 0 };
  }
  (data || []).forEach(r => {
    const key = r.created_at.slice(0, 10);
    if (buckets[key]) buckets[key].count++;
  });
  const entries = Object.values(buckets);
  return { labels: entries.map(e => e.label), data: entries.map(e => e.count) };
}

export async function fetchDetectionsByHour() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const { data, error } = await supabase
    .from('detection_results')
    .select('created_at')
    .gte('created_at', todayStart.toISOString());
  if (error) throw error;

  const hours = Array(12).fill(0);
  (data || []).forEach(r => {
    const h = new Date(r.created_at).getHours();
    const idx = Math.floor(h / 2);
    if (idx < 12) hours[idx]++;
  });
  const labels = Array.from({ length: 12 }, (_, i) => `${String(i * 2).padStart(2, '0')}:00`);
  return { labels, data: hours };
}

export async function fetchAlertsByZone() {
  const { data, error } = await supabase
    .from('alerts')
    .select('zone_id, zones(name)');
  if (error) throw error;

  const counts = {};
  (data || []).forEach(a => {
    const name = a.zones?.name?.split('\u2014')[0]?.trim() || 'Unassigned';
    counts[name] = (counts[name] || 0) + 1;
  });
  return { labels: Object.keys(counts), data: Object.values(counts) };
}

export async function fetchThreatTrend(weeks = 4) {
  const since = new Date(Date.now() - weeks * 7 * 24 * 60 * 60 * 1000).toISOString();

  const [detRes, alertRes] = await Promise.all([
    supabase.from('detection_results').select('created_at').gte('created_at', since),
    supabase.from('alerts').select('created_at, status').gte('created_at', since),
  ]);

  const detected = Array(weeks).fill(0);
  const resolved = Array(weeks).fill(0);
  const now = Date.now();

  (detRes.data || []).forEach(r => {
    const wk = Math.floor((now - new Date(r.created_at).getTime()) / (7 * 24 * 60 * 60 * 1000));
    const idx = weeks - 1 - wk;
    if (idx >= 0 && idx < weeks) detected[idx]++;
  });
  (alertRes.data || []).forEach(a => {
    if (a.status === 'read') {
      const wk = Math.floor((now - new Date(a.created_at).getTime()) / (7 * 24 * 60 * 60 * 1000));
      const idx = weeks - 1 - wk;
      if (idx >= 0 && idx < weeks) resolved[idx]++;
    }
  });

  const labels = Array.from({ length: weeks }, (_, i) => `Week ${i + 1}`);
  return { labels, detected, resolved };
}
