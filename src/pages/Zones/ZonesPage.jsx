import { useState } from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import { Map, Edit3, BarChart3, AlertTriangle, CheckCircle, MapPin, Layers } from 'lucide-react';
import './ZonesPage.css';

function ZoneCard({ zone, index }) {
  const used = zone.current_load || 0;
  const cap = zone.capacity || 1;
  const utilization = Math.round((used / cap) * 100);
  const utilizationColor = utilization > 80 ? 'var(--color-accent-danger)' : utilization > 60 ? 'var(--color-accent-warning)' : 'var(--color-accent-success)';

  return (
    <div className="zone-card" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="zone-card-header">
        <div className="zone-color-indicator" style={{ background: zone.color }}></div>
        <div className="zone-card-title">
          <h3>{zone.name}</h3>
          <p>{zone.description}</p>
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
          <div className="zone-util-fill" style={{ width: `${utilization}%`, background: utilizationColor }}></div>
        </div>
        <div className="zone-util-detail">
          <span>{used.toLocaleString()} used</span>
          <span>{cap.toLocaleString()} capacity</span>
        </div>
      </div>

      <div className="zone-card-stats">
        <div className="zone-stat">
          <span className="zone-stat-value">{zone.capacity}</span>
          <span className="zone-stat-label">Capacity</span>
        </div>
        <div className="zone-stat">
          <span className="zone-stat-value">{used}</span>
          <span className="zone-stat-label">In Use</span>
        </div>
        <div className="zone-stat">
          <span className="zone-stat-value">{cap - used}</span>
          <span className="zone-stat-label">Available</span>
        </div>
      </div>
    </div>
  );
}

export default function ZonesPage() {
  const { state } = useWarehouse();
  const zones = state.zones;

  const totalCapacity = zones.reduce((s, z) => s + (z.capacity || 0), 0);
  const totalUsed = zones.reduce((s, z) => s + (z.current_load || 0), 0);
  const avgUtil = totalCapacity > 0 ? Math.round((totalUsed / totalCapacity) * 100) : 0;

  return (
    <div className="page zones-page">
      <div className="page-header">
        <div>
          <h1>Zone Management</h1>
          <p>Configure and monitor warehouse zones</p>
        </div>
      </div>

      {/* Zone Map */}
      <div className="zone-map-container">
        <div className="zone-map-header">
          <h2><Layers size={18} /> Warehouse Floor Plan</h2>
          <div className="zone-map-stats">
            <span>Total Capacity: <strong>{totalCapacity.toLocaleString()}</strong></span>
            <span>Avg Utilization: <strong style={{ color: avgUtil > 70 ? 'var(--color-accent-warning)' : 'var(--color-accent-success)' }}>{avgUtil}%</strong></span>
          </div>
        </div>
        <div className="zone-map">
          <div className="zone-map-grid"></div>
          {zones.map((zone) => {
            const util = zone.capacity > 0 ? Math.round(((zone.current_load || 0) / zone.capacity) * 100) : 0;
            return (
              <div
                key={zone.id}
                className={`zone-map-item ${zone.status}`}
                style={{
                  left: `${zone.x}%`,
                  top: `${zone.y}%`,
                  width: `${zone.width}%`,
                  height: `${zone.height}%`,
                  borderColor: zone.color,
                  background: `${zone.color}10`,
                }}
              >
                <div className="zone-map-label" style={{ color: zone.color }}>
                  <MapPin size={12} />
                  <span>{zone.name.split('—')[0].trim()}</span>
                </div>
                <div className="zone-map-util">{util}%</div>
                {/* Simulated items */}
                <div className="zone-map-dots">
                  {Array.from({ length: Math.min(Math.floor((zone.current_load || 0) / 80), 12) }).map((_, i) => (
                    <div
                      key={i}
                      className="zone-map-dot"
                      style={{
                        left: `${15 + Math.random() * 70}%`,
                        top: `${25 + Math.random() * 55}%`,
                        background: zone.color,
                        animationDelay: `${i * 200}ms`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zone Cards */}
      <div className="zone-cards-grid">
        {zones.map((zone, i) => (
          <ZoneCard key={zone.id} zone={zone} index={i} />
        ))}
      </div>
    </div>
  );
}
