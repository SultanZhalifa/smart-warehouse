import { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import * as db from '../lib/database';
import { exportToCSV } from '../utils/exportUtils';
import {
  Package, Plus, Search, Filter, Edit3, Trash2, X,
  AlertTriangle, CheckCircle, XCircle, ArrowUpDown, Download
} from 'lucide-react';
import './InventoryPage.css';

const CATEGORIES = ['All', 'Electronics', 'Chemicals', 'Mechanical', 'Perishable', 'Automotive', 'Supplies', 'Safety', 'Logistics'];

function statusBadge(status) {
  const map = {
    'in-stock': { cls: 'badge-success', icon: CheckCircle, label: 'In Stock' },
    'low-stock': { cls: 'badge-warning', icon: AlertTriangle, label: 'Low Stock' },
    'out-of-stock': { cls: 'badge-danger', icon: XCircle, label: 'Out of Stock' },
  };
  const s = map[status] || map['in-stock'];
  return (
    <span className={`badge ${s.cls}`}>
      <s.icon size={11} />
      {s.label}
    </span>
  );
}

export default function InventoryPage() {
  const { state, dispatch, addToast, refreshData } = useWarehouse();
  const zones = state.zones;
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [sortField, setSortField] = useState('item_code');
  const [sortDir, setSortDir] = useState('asc');

  // Form state
  const [form, setForm] = useState({ name: '', category: 'Electronics', zone_id: zones[0]?.id || '', quantity: 0, min_stock: 0, weight: 0 });

  const filteredItems = state.inventory
    .filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || (item.item_code || '').toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'All' || item.category === category;
      const matchZone = zoneFilter === 'All' || item.zone_id === zoneFilter;
      return matchSearch && matchCategory && matchZone;
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'number') return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      return sortDir === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });

  const handleSort = (field) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: '', category: 'Electronics', zone_id: zones[0]?.id || '', quantity: 0, min_stock: 0, weight: 0 });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, category: item.category, zone_id: item.zone_id, quantity: item.quantity, min_stock: item.min_stock, weight: item.weight });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { addToast({ type: 'error', title: 'Validation Error', message: 'Item name is required' }); return; }
    const status = Number(form.quantity) <= 0 ? 'out-of-stock' : Number(form.quantity) < Number(form.min_stock) ? 'low-stock' : 'in-stock';

    try {
      if (editItem) {
        const updated = await db.updateInventoryItem(editItem.id, {
          name: form.name,
          category: form.category,
          zone_id: form.zone_id,
          quantity: Number(form.quantity),
          min_stock: Number(form.min_stock),
          weight: Number(form.weight),
          status,
        });
        dispatch({ type: 'UPDATE_INVENTORY_ITEM', payload: updated });
        addToast({ type: 'success', title: 'Item Updated', message: `${form.name} has been updated successfully` });
      } else {
        const newItem = await db.createInventoryItem({
          item_code: `INV-${String(state.inventory.length + 1).padStart(3, '0')}`,
          name: form.name,
          category: form.category,
          zone_id: form.zone_id,
          quantity: Number(form.quantity),
          min_stock: Number(form.min_stock),
          weight: Number(form.weight),
          status,
          last_detected: new Date().toISOString(),
        });
        dispatch({ type: 'ADD_INVENTORY_ITEM', payload: newItem });
        addToast({ type: 'success', title: 'Item Created', message: `${form.name} has been added to inventory` });
      }
      setShowModal(false);
      refreshData();
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleDelete = async (item) => {
    try {
      await db.deleteInventoryItem(item.id);
      dispatch({ type: 'DELETE_INVENTORY_ITEM', payload: item.id });
      addToast({ type: 'warning', title: 'Item Deleted', message: `${item.name} has been removed from inventory` });
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const totalItems = state.inventory.reduce((s, i) => s + i.quantity, 0);
  const lowStock = state.inventory.filter((i) => i.status === 'low-stock').length;
  const outOfStock = state.inventory.filter((i) => i.status === 'out-of-stock').length;

  return (
    <div className="page inventory-page">
      <div className="page-header">
        <div>
          <h1>Inventory Management</h1>
          <p>Track and manage warehouse inventory items</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button className="btn btn-secondary" onClick={() => {
            exportToCSV(filteredItems, 'inventory_export', [
              { key: 'item_code', label: 'ID' }, { key: 'name', label: 'Name' },
              { key: 'category', label: 'Category' }, { key: 'zone_id', label: 'Zone' },
              { key: 'quantity', label: 'Quantity' }, { key: 'min_stock', label: 'Min Stock' },
              { key: 'status', label: 'Status' }, { key: 'weight', label: 'Weight (kg)' },
            ]);
            addToast({ type: 'success', message: `Exported ${filteredItems.length} items to CSV` });
          }}>
            <Download size={16} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} /> Add Item
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="inventory-stats">
        <div className="inv-stat-card">
          <Package size={20} style={{ color: 'var(--color-accent-primary)' }} />
          <div>
            <span className="inv-stat-value">{state.inventory.length}</span>
            <span className="inv-stat-label">Unique Items</span>
          </div>
        </div>
        <div className="inv-stat-card">
          <CheckCircle size={20} style={{ color: 'var(--color-accent-success)' }} />
          <div>
            <span className="inv-stat-value">{totalItems.toLocaleString()}</span>
            <span className="inv-stat-label">Total Units</span>
          </div>
        </div>
        <div className="inv-stat-card">
          <AlertTriangle size={20} style={{ color: 'var(--color-accent-warning)' }} />
          <div>
            <span className="inv-stat-value">{lowStock}</span>
            <span className="inv-stat-label">Low Stock</span>
          </div>
        </div>
        <div className="inv-stat-card">
          <XCircle size={20} style={{ color: 'var(--color-accent-danger)' }} />
          <div>
            <span className="inv-stat-value">{outOfStock}</span>
            <span className="inv-stat-label">Out of Stock</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="inventory-filters">
        <div className="inventory-search">
          <Search size={16} />
          <input type="text" placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} className="input" />
        </div>
        <div className="inventory-categories">
          {CATEGORIES.map((cat) => (
            <button key={cat} className={`inv-cat-btn ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
        <div className="inventory-zone-filter">
          <Filter size={14} />
          <select className="input" value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} style={{ width: 150 }}>
            <option value="All">All Zones</option>
            {zones.map((z) => <option key={z.id} value={z.id}>{z.name.split('—')[0].trim()}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} className="sortable">ID <ArrowUpDown size={12} /></th>
              <th onClick={() => handleSort('name')} className="sortable">Name <ArrowUpDown size={12} /></th>
              <th>Category</th>
              <th>Zone</th>
              <th onClick={() => handleSort('quantity')} className="sortable">Qty <ArrowUpDown size={12} /></th>
              <th>Min Stock</th>
              <th>Status</th>
              <th>Weight (kg)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const zone = zones.find((z) => z.id === item.zone_id);
              return (
                <tr key={item.id}>
                  <td><code style={{ color: 'var(--color-accent-primary)', fontSize: 'var(--font-size-xs)' }}>{item.item_code}</code></td>
                  <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.name}</td>
                  <td><span className="badge badge-info">{item.category}</span></td>
                  <td>{zone ? zone.name.split('—')[0].trim() : item.zone}</td>
                  <td style={{ fontWeight: 600 }}>{(item.quantity || 0).toLocaleString()}</td>
                  <td>{item.min_stock}</td>
                  <td>{statusBadge(item.status)}</td>
                  <td>{item.weight}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(item)}><Edit3 size={14} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(item)} style={{ color: 'var(--color-accent-danger)' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredItems.length === 0 && (
          <div className="empty-state">
            <Package size={40} />
            <h3>No items found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editItem ? 'Edit Item' : 'Add New Item'}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div className="input-group">
                <label>Item Name</label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter item name" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                <div className="input-group">
                  <label>Category</label>
                  <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Zone</label>
                  <select className="input" value={form.zone_id} onChange={(e) => setForm({ ...form, zone_id: e.target.value })}>
                    {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)' }}>
                <div className="input-group">
                  <label>Quantity</label>
                  <input className="input" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                </div>
                <div className="input-group">
                  <label>Min Stock</label>
                  <input className="input" type="number" value={form.min_stock} onChange={(e) => setForm({ ...form, min_stock: e.target.value })} />
                </div>
                <div className="input-group">
                  <label>Weight (kg)</label>
                  <input className="input" type="number" step="0.1" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editItem ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
