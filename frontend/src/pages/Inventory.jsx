import React, { useState, useEffect } from 'react';
import { Package, Plus, X, RotateCcw } from 'lucide-react';
import { get, post, apiCall } from '../utils/api';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', sku: '', cost_price: '', selling_price: '', stock_quantity: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () =>
    get('/inventory/inventory')
      .then(r => r.ok && r.json())
      .then(d => d && setProducts(d))
      .catch(() => {});

  useEffect(() => {
    fetchProducts().finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await post('/inventory/inventory', {
      name: form.name,
      sku: form.sku || `SKU-${Math.floor(Math.random() * 9000) + 1000}`,
      cost_price: parseFloat(form.cost_price),
      selling_price: parseFloat(form.selling_price),
      stock_quantity: parseInt(form.stock_quantity, 10),
    });
    if (res.ok) {
      await fetchProducts();
      setForm({ name: '', sku: '', cost_price: '', selling_price: '', stock_quantity: '' });
      setShowForm(false);
    }
  };

  const handleRestock = async (id) => {
    const res = await apiCall(`/inventory/inventory/${id}/restock`, {
      method: 'POST',
      body: JSON.stringify({ quantity: 50, unit_cost: 10.0 }),
    });
    if (res.ok) fetchProducts();
  };

  const lowStock = products.filter(p => p.stock_quantity < 20);

  return (
    <div className="page-wrapper">
      <div className="page-header-row">
        <div>
          <h1>Inventory Operations</h1>
          <p>Manage stock levels and product catalog.</p>
        </div>
        <button className="btn" onClick={() => setShowForm(true)} id="add-product-btn">
          <Plus size={16} /> Add Product
        </button>
      </div>

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
          <strong>{products.reduce((a, p) => a + (p.stock_quantity || 0), 0).toLocaleString()}</strong>
        </div>
        <div className="finance-summary-item">
          <span>Avg Margin</span>
          <strong style={{ color: 'var(--success)' }}>
            {products.length > 0
              ? Math.round(products.reduce((a, p) =>
                a + ((p.selling_price - p.cost_price) / p.selling_price * 100), 0) / products.length)
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
            <div className="table-head" style={{gridTemplateColumns:'1.5fr 1fr 0.8fr 0.8fr 1fr 1fr'}}>
              <span>Product</span>
              <span>SKU</span>
              <span>Cost</span>
              <span>Price</span>
              <span>Stock</span>
              <span style={{ textAlign: 'right' }}>Action</span>
            </div>
            {products.map(p => (
              <div key={p.id} className="table-row" style={{gridTemplateColumns:'1.5fr 1fr 0.8fr 0.8fr 1fr 1fr'}}>
                <span style={{ fontWeight: 500 }}>{p.name}</span>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.sku}</span>
                <span>${p.cost_price?.toFixed(2)}</span>
                <span>${p.selling_price?.toFixed(2)}</span>
                <span>
                  <span className={`badge badge-${p.stock_quantity < 20 ? 'danger' : 'success'}`}>
                    {p.stock_quantity} units
                  </span>
                </span>
                <span style={{ textAlign: 'right' }}>
                  <button
                    className="btn-sm btn-outline"
                    onClick={() => handleRestock(p.id)}
                    id={`restock-${p.id}`}
                    title="Restock 50 units"
                  >
                    <RotateCcw size={12} /> Restock
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
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input type="text" required className="input-field" placeholder="e.g. Laptop Pro 15"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">SKU (optional)</label>
                <input type="text" className="input-field" placeholder="Auto-generated if blank"
                  value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Initial Stock</label>
                <input type="number" required className="input-field" placeholder="100"
                  value={form.stock_quantity} onChange={e => setForm({ ...form, stock_quantity: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Cost Price ($)</label>
                  <input type="number" required className="input-field" placeholder="0.00"
                    value={form.cost_price} onChange={e => setForm({ ...form, cost_price: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Sell Price ($)</label>
                  <input type="number" required className="input-field" placeholder="0.00"
                    value={form.selling_price} onChange={e => setForm({ ...form, selling_price: e.target.value })} />
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
