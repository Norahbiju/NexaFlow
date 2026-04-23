import React, { useState, useEffect } from 'react';
import { Package, Plus, X, RotateCcw } from 'lucide-react';
import { get, post, apiCall } from '../utils/api';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', cost: '', price: '', stock: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const fetchProducts = async () => {
    try {
      const r = await get('/inventory/inventory');
      if (r.ok) setProducts(await r.json());
    } catch (e) { setError('Failed to load inventory.'); }
  };

  useEffect(() => { fetchProducts().finally(() => setLoading(false)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      // Backend expects: name, description, stock, cost, price
      const res = await post('/inventory/inventory', {
        name: form.name,
        description: form.description || null,
        stock: parseInt(form.stock, 10),
        cost: parseFloat(form.cost),
        price: parseFloat(form.price),
      });
      if (res.ok) {
        await fetchProducts();
        setForm({ name: '', description: '', cost: '', price: '', stock: '' });
        setShowForm(false);
      } else {
        const err = await res.json();
        setFormError(err.detail || `Error ${res.status}: Failed to add product.`);
      }
    } catch (e) {
      setFormError('Network error. Is the backend running?');
    }
  };

  const handleRestock = async (id) => {
    try {
      const res = await apiCall(`/inventory/inventory/${id}/restock`, {
        method: 'POST',
        body: JSON.stringify({ quantity: 50 }),
      });
      if (res.ok) await fetchProducts();
    } catch (e) {}
  };

  const lowStock = products.filter(p => p.stock < 20);

  return (
    <div className="page-wrapper">
      <div className="page-header-row">
        <div>
          <h1>Inventory Operations</h1>
          <p>Manage stock levels and product catalog.</p>
        </div>
        <button className="btn" onClick={() => { setShowForm(true); setFormError(''); }} id="add-product-btn">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {error && <div className="alert-banner">{error}</div>}

      {lowStock.length > 0 && (
        <div className="alert-banner">
          <Package size={16} />
          <span><strong>{lowStock.length} product(s)</strong> are running low on stock (&lt; 20 units)</span>
        </div>
      )}

      <div className="finance-summary">
        <div className="finance-summary-item">
          <span>Total Products</span>
          <strong>{products.length}</strong>
        </div>
        <div className="finance-summary-item">
          <span>Low Stock</span>
          <strong style={{ color: 'var(--danger)' }}>{lowStock.length}</strong>
        </div>
        <div className="finance-summary-item">
          <span>Total Units</span>
          <strong>{products.reduce((a, p) => a + (p.stock || 0), 0).toLocaleString()}</strong>
        </div>
        <div className="finance-summary-item">
          <span>Avg Margin</span>
          <strong style={{ color: 'var(--success)' }}>
            {products.length > 0
              ? Math.round(products.reduce((a, p) =>
                  a + ((p.price - p.cost) / (p.price || 1) * 100), 0) / products.length)
              : 0}%
          </strong>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 16 }}>Product Catalog</h3>
        {loading ? (
          <div className="loading-state">Loading inventory...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <Package size={40} color="var(--text-muted)" />
            <p>No products yet. Add your first one!</p>
          </div>
        ) : (
          <div className="data-table">
            <div className="table-head" style={{ gridTemplateColumns: '1.5fr 0.8fr 0.8fr 1fr 1fr' }}>
              <span>Product</span>
              <span>Cost</span>
              <span>Price</span>
              <span>Stock</span>
              <span style={{ textAlign: 'right' }}>Action</span>
            </div>
            {products.map(p => (
              <div key={p.id} className="table-row" style={{ gridTemplateColumns: '1.5fr 0.8fr 0.8fr 1fr 1fr' }}>
                <span>
                  <div style={{ fontWeight: 500 }}>{p.name}</div>
                  {p.description && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.description}</div>}
                </span>
                <span>${p.cost?.toFixed(2)}</span>
                <span>${p.price?.toFixed(2)}</span>
                <span>
                  <span className={`badge badge-${p.stock < 20 ? 'danger' : 'success'}`}>
                    {p.stock} units
                  </span>
                </span>
                <span style={{ textAlign: 'right' }}>
                  <button className="btn-sm btn-outline" onClick={() => handleRestock(p.id)} id={`restock-${p.id}`}>
                    <RotateCcw size={12} /> +50
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Product</h3>
              <button className="icon-btn" onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            {formError && <div className="login-error">{formError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input type="text" required className="input-field" placeholder="e.g. Laptop Pro 15"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input type="text" className="input-field" placeholder="Optional"
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Initial Stock *</label>
                <input type="number" required min="0" className="input-field" placeholder="100"
                  value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Cost ($) *</label>
                  <input type="number" required step="0.01" min="0" className="input-field" placeholder="0.00"
                    value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Price ($) *</label>
                  <input type="number" required step="0.01" min="0" className="input-field" placeholder="0.00"
                    value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn" style={{ width: '100%' }}>Add to Inventory</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
