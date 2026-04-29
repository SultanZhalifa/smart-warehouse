import { useState, useMemo, useEffect } from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import { useAuth } from '../../context/AuthContext';
import * as db from '../../lib/database';
import { exportToCSV } from '../../utils/exportUtils';
import {
  Bug, Plus, Search, Filter, Edit3, X,
  AlertTriangle, ShieldCheck, Flame, Download, 
  Activity, MapPin, Hash, Info, ChevronRight,
  TrendingUp, AlertCircle, LayoutGrid
} from 'lucide-react';
import './InventoryPage.css';

const PEST_CATEGORIES = ['All', 'Rodents', 'Insects', 'Flying Pests', 'Birds', 'Microbial', 'Reptiles'];

function ThreatBadge({ status }) {
  const map = {
    'safe': { cls: 'badge-success', icon: ShieldCheck, label: 'Controlled' },
    'warning': { cls: 'badge-warning', icon: AlertTriangle, label: 'Warning' },
    'critical': { cls: 'badge-danger', icon: Flame, label: 'Critical' },
  };
  const s = map[status] || map['safe'];
  return (
    <span className={`badge ${s.cls}`}>
      <s.icon size={11} />
      {s.label}
    </span>
  );
}

export default function InventoryPage() {
  const { state, dispatch, addToast, refreshData } = useWarehouse();
  const { profile } = useAuth();
  
  // Ambil zones dari state global
  const zones = state.zones || [];
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [form, setForm] = useState({ 
    name: '', category: 'Insects', zone_id: '', quantity: 0, min_stock: 5 
  });

  // Logika Filter Tabel
  const filteredItems = useMemo(() => {
    return (state.inventory || []).filter((item) => {
      const isSameWarehouse = item.warehouseId === profile?.warehouseId;
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'All' || item.category === category;
      return isSameWarehouse && matchSearch && matchCategory;
    });
  }, [state.inventory, search, category, profile?.warehouseId]);

  // Statistik Ringkas
  const stats = useMemo(() => ({
    total: filteredItems.length,
    critical: filteredItems.filter(i => i.status === 'critical').length,
    activeZones: new Set(filteredItems.map(i => i.zone_id)).size
  }), [filteredItems]);

  // Handler Buka Modal (Tambah / Edit)
  const handleOpenModal = (item = null) => {
    if (item) {
      setEditItem(item);
      setForm(item);
    } else {
      setEditItem(null);
      setForm({ 
        name: '', 
        category: 'Insects', 
        // Otomatis pilih zona pertama jika tersedia
        zone_id: zones.length > 0 ? zones[0].id : '', 
        quantity: 0, 
        min_stock: 5 
      });
    }
    setShowModal(true);
  };

  // Simpan Data ke Database
  const handleSave = async () => {
    if (!form.name.trim() || !form.zone_id) { 
      addToast({ type: 'error', title: 'Error', message: 'Lengkapi nama dan pilih zona!' }); 
      return; 
    }
    const qty = Number(form.quantity);
    const threshold = Number(form.min_stock);
    const status = qty === 0 ? 'safe' : qty >= threshold ? 'critical' : 'warning';

    try {
      const payload = { 
        ...form, 
        warehouseId: profile.warehouseId, 
        quantity: qty, 
        min_stock: threshold, 
        status, 
        updatedAt: new Date().toISOString() 
      };

      if (editItem) {
        const updated = await db.updateInventoryItem(editItem.id, payload);
        dispatch({ type: 'UPDATE_INVENTORY_ITEM', payload: updated });
      } else {
        const newItem = await db.createInventoryItem({ 
          ...payload, 
          item_code: `LOG-${Date.now().toString().slice(-6)}`, 
          createdAt: new Date().toISOString() 
        });
        dispatch({ type: 'ADD_INVENTORY_ITEM', payload: newItem });
      }
      
      setShowModal(false);
      refreshData();
      addToast({ type: 'success', title: 'Success', message: 'Data berhasil diperbarui' });
    } catch (err) {
      addToast({ type: 'error', title: 'Database Error', message: err.message });
    }
  };

  return (
    <div className="inventory-container">
      {/* 1. HEADER SECTON */}
      <div className="inventory-header">
        <div className="header-title">
          <h1>Inventory Management</h1>
          <p>Tuesday, April 28, 2026</p>
        </div>
        <div className="header-btns">
          <button className="btn-csv" onClick={() => exportToCSV(filteredItems, 'report')}>
            <Download size={16}/> Export CSV
          </button>
          <button className="btn-add" onClick={() => handleOpenModal()}>
            <Plus size={16}/> New Detection
          </button>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="stats-row">
        <div className="card-stat">
          <div className="icon-bg blue"><TrendingUp size={20}/></div>
          <div><label>Total Species</label><h3>{stats.total}</h3></div>
        </div>
        <div className="card-stat">
          <div className="icon-bg red"><AlertCircle size={20}/></div>
          <div><label>Critical Threats</label><h3>{stats.critical}</h3></div>
        </div>
        <div className="card-stat">
          <div className="icon-bg purple"><LayoutGrid size={20}/></div>
          <div><label>Infected Zones</label><h3>{stats.activeZones}</h3></div>
        </div>
      </div>

      {/* 3. MAIN TABLE CARD */}
      <div className="main-content-card">
        <div className="filter-bar">
          <div className="search-input">
            <Search size={18} />
            <input 
              placeholder="Search detection logs..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {PEST_CATEGORIES.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ITEM CODE</th>
                <th>SPECIES NAME</th>
                <th>CLASSIFICATION</th>
                <th>ZONE</th>
                <th>COUNT</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? filteredItems.map(item => (
                <tr key={item.id}>
                  <td><span className="tag-code">{item.item_code}</span></td>
                  <td><strong>{item.name}</strong></td>
                  <td><span className="tag-cat">{item.category}</span></td>
                  <td>{zones.find(z => z.id === item.zone_id)?.name || 'Unknown'}</td>
                  <td>{item.quantity}</td>
                  <td><ThreatBadge status={item.status} /></td>
                  <td>
                    <button className="btn-edit-small" onClick={() => handleOpenModal(item)}>
                      <Edit3 size={14}/>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="td-empty">No detections found in this warehouse.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MODAL (DIRENDER TERPISAH) */}
      {showModal && (
        <div className="force-modal-overlay">
          <div className="force-modal-card">
            <div className="f-header">
              <div className="f-title">
                <div className="f-icon-box"><Bug size={20}/></div>
                <div>
                  <h3>{editItem ? 'Update Log' : 'Log Detection'}</h3>
                  <p>Bio-hazard surveillance data</p>
                </div>
              </div>
              <X className="f-close" onClick={() => setShowModal(false)} />
            </div>
            
            <div className="f-body">
              <div className="f-field">
                <label><Info size={14}/> Species Name</label>
                <input 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  placeholder="e.g. Snake, Rat" 
                />
              </div>

              <div className="f-row">
                <div className="f-field half">
                  <label><Filter size={14}/> Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {PEST_CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="f-field half">
                  <label><MapPin size={14}/> Zone</label>
                  <select 
                    value={form.zone_id} 
                    onChange={e => setForm({...form, zone_id: e.target.value})}
                  >
                    {zones.length > 0 ? (
                      zones.map(z => (
                        <option key={z.id} value={z.id}>{z.name}</option>
                      ))
                    ) : (
                      <option disabled>No zones found</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="f-highlight">
                <div className="f-row">
                  <div className="f-field half">
                    <label><Activity size={14}/> Current Count</label>
                    <input 
                      type="number" 
                      value={form.quantity} 
                      onChange={e => setForm({...form, quantity: e.target.value})} 
                    />
                  </div>
                  <div className="f-field half">
                    <label><Hash size={14}/> Alert Threshold</label>
                    <input 
                      type="number" 
                      value={form.min_stock} 
                      onChange={e => setForm({...form, min_stock: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="f-footer">
              <button className="f-btn-cancel" onClick={() => setShowModal(false)}>Discard</button>
              <button className="f-btn-save" onClick={handleSave}>
                {editItem ? 'Update' : 'Save Detection'} <ChevronRight size={16}/>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}