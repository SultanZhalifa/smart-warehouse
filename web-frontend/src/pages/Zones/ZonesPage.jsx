import { useState, useMemo, useCallback } from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import { useAuth } from '../../context/AuthContext';
import * as db from '../../lib/database';
import { 
  Plus, Layers, MapPin, X, ChevronRight, 
  Palette, CheckCircle, AlertTriangle 
} from 'lucide-react';
import './ZonesPage.css';

// Initial form state for reset and default values
const INITIAL_FORM = {
  name: '',
  description: '',
  x: 0,
  y: 0,
  width: 20,
  height: 20,
  color: '#6366f1',
  capacity: 100
};

/**
 * ZoneCard Component: Standardized UI for zone details in the grid
 */
const ZoneCard = ({ zone, index }) => {
  const utilization = useMemo(() => {
    const used = zone.current_load || 0;
    const cap = zone.capacity || 1;
    return Math.round((used / cap) * 100);
  }, [zone.current_load, zone.capacity]);

  const utilizationColor = utilization > 80 
    ? 'var(--color-accent-danger)' 
    : utilization > 60 
      ? 'var(--color-accent-warning)' 
      : 'var(--color-accent-success)';

  return (
    <div className="zone-card" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="zone-card-header">
        <div className="zone-color-indicator" style={{ background: zone.color }}></div>
        <div className="zone-card-title">
          <h3>{zone.name}</h3>
          <p>{zone.description || 'No description provided'}</p>
        </div>
        <span className={`badge ${zone.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
          {zone.status === 'active' ? <CheckCircle size={11} /> : <AlertTriangle size={11} />}
          {zone.status}
        </span>
      </div>

      <div className="zone-utilization">
        <div className="zone-util-header">
          <span>Utilization</span>
          <span style={{ color: utilizationColor, fontWeight: 700 }}>{utilization}%</span>
        </div>
        <div className="zone-util-bar">
          <div 
            className="zone-util-fill" 
            style={{ width: `${utilization}%`, background: utilizationColor }}
          ></div>
        </div>
      </div>

      <div className="zone-card-stats">
        <div className="zone-stat">
          <span className="zone-stat-value">{zone.capacity}</span>
          <span className="zone-stat-label">Max Capacity</span>
        </div>
        <div className="zone-stat">
          <span className="zone-stat-value">{zone.current_load || 0}</span>
          <span className="zone-stat-label">In Use</span>
        </div>
      </div>
    </div>
  );
};

export default function ZonesPage() {
  const { state, dispatch, addToast } = useWarehouse();
  const { profile } = useAuth();
  const zones = state.zones || [];

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Global calculations memoized for performance
  const metrics = useMemo(() => {
    const totalCap = zones.reduce((s, z) => s + (Number(z.capacity) || 0), 0);
    const totalUsed = zones.reduce((s, z) => s + (Number(z.current_load) || 0), 0);
    const avgUtil = totalCap > 0 ? Math.round((totalUsed / totalCap) * 100) : 0;
    return { totalCap, totalUsed, avgUtil };
  }, [zones]);

  /**
   * Logical validation for warehouse boundary constraints
   */
  const validateForm = useCallback(() => {
    if (!form.name.trim()) throw new Error("Zone name is required.");
    if (form.capacity <= 0) throw new Error("Capacity must be at least 1 unit.");
    if (Number(form.x) + Number(form.width) > 100 || Number(form.y) + Number(form.height) > 100) {
      throw new Error("Zone placement exceeds warehouse floor boundaries.");
    }
    return true;
  }, [form]);

  /**
   * Handles database persistence and state synchronization
   */
  const handleSaveZone = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      validateForm();

      const payload = {
        ...form,
        name: form.name.trim(),
        x: Number(form.x),
        y: Number(form.y),
        width: Number(form.width),
        height: Number(form.height),
        capacity: Number(form.capacity),
        warehouseId: profile.warehouseId,
        status: 'active',
        current_load: 0,
        createdAt: new Date().toISOString()
      };

      const newZone = await db.createZone(payload);
      dispatch({ type: 'ADD_ZONE', payload: newZone });
      
      addToast({ type: 'success', message: 'Mapping updated successfully!' });
      setForm(INITIAL_FORM);
      setShowModal(false);
    } catch (err) {
      addToast({ type: 'error', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="zones-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Zone Management</h1>
          <p>Define spatial coordinates for AI tracking</p>
        </div>
        <button className="btn-add-zone" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Define New Zone
        </button>
      </div>

      <div className="zone-map-container">
        <div className="zone-map-header">
          <h2><Layers size={18} /> Warehouse Floor Plan</h2>
          <div className="zone-map-stats">
            <span>Capacity: <strong>{metrics.totalCap}</strong></span>
            <span>Avg Util: <strong style={{ color: metrics.avgUtil > 75 ? 'orange' : '#10b981' }}>{metrics.avgUtil}%</strong></span>
          </div>
        </div>
        
        <div className="zone-map">
          <div className="zone-map-grid"></div>
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="zone-map-item"
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: `${zone.width}%`,
                height: `${zone.height}%`,
                borderColor: zone.color,
                backgroundColor: `${zone.color}15`,
              }}
            >
              <div className="zone-map-label" style={{ color: zone.color }}>
                <MapPin size={10} />
                <span>{zone.name}</span>
              </div>
              <div className="zone-map-util">
                {Math.round(((zone.current_load || 0) / (zone.capacity || 1)) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="zone-cards-grid">
        {zones.length > 0 ? (
          zones.map((zone, i) => <ZoneCard key={zone.id} zone={zone} index={i} />)
        ) : (
          <div className="empty-state-card">
            <Layers size={40} opacity={0.3} />
            <p>No warehouse zones mapped yet.</p>
          </div>
        )}
      </div>

      {/* --- STANDARDIZED MODAL --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <MapPin size={18} className="icon-accent" />
                <div>
                  <h3>Map New Zone</h3>
                  <p>Configure spatial coordinates (0-100%)</p>
                </div>
              </div>
              <X className="modal-close" onClick={() => setShowModal(false)} />
            </div>
            
            <div className="modal-body">
              <div className="modal-field">
                <label>Zone Identity</label>
                <input 
                  autoFocus
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  placeholder="e.g. Rack A-1, Heavy Goods Area" 
                />
              </div>

              <div className="modal-row">
                <div className="modal-field half">
                  <label>X-Axis Pos (%)</label>
                  <input type="number" value={form.x} onChange={e => setForm({...form, x: e.target.value})} />
                </div>
                <div className="modal-field half">
                  <label>Y-Axis Pos (%)</label>
                  <input type="number" value={form.y} onChange={e => setForm({...form, y: e.target.value})} />
                </div>
              </div>

              <div className="modal-row">
                <div className="modal-field half">
                  <label>Width (%)</label>
                  <input type="number" value={form.width} onChange={e => setForm({...form, width: e.target.value})} />
                </div>
                <div className="modal-field half">
                  <label>Height (%)</label>
                  <input type="number" value={form.height} onChange={e => setForm({...form, height: e.target.value})} />
                </div>
              </div>

              <div className="modal-row">
                <div className="modal-field half">
                  <label>Capacity</label>
                  <input type="number" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} />
                </div>
                <div className="modal-field half">
                  <label>Theme Color</label>
                  <input type="color" className="color-picker-input" value={form.color} onChange={e => setForm({...form, color: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveZone} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Confirm Mapping'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}