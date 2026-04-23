import React, { useState, useEffect } from 'react';
import { FileText, Plus, X } from 'lucide-react';
import { get, post, apiCall } from '../utils/api';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState({ client_name: '', amount: '', due_date: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get('/invoice/invoices')
      .then(r => r.ok && r.json())
      .then(d => d && setInvoices(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await post('/invoice/invoices', {
      client_name: form.client_name,
      amount: parseFloat(form.amount),
      due_date: form.due_date,
    });
    if (res.ok) {
      const data = await res.json();
      setInvoices(prev => [data, ...prev]);
      setForm({ client_name: '', amount: '', due_date: '' });
      setShowForm(false);
    }
  };

  const handlePay = async (id) => {
    const invoice = invoices.find(i => i.id === id);
    const res = await apiCall(`/invoice/invoices/${id}/pay`, {
      method: 'POST',
      body: JSON.stringify({ amount: invoice?.amount || 0 }),
    });
    if (res.ok) {
      setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'paid' } : inv));
    }
  };

  const pending = invoices.filter(i => i.status === 'pending');
  const paid = invoices.filter(i => i.status === 'paid');
  const totalPending = pending.reduce((a, i) => a + (i.amount || 0), 0);

  return (
    <div className="page-wrapper">
      <div className="page-header-row">
        <div>
          <h1>Invoice Tracking</h1>
          <p>Manage client invoices and receivables.</p>
        </div>
        <button className="btn" onClick={() => setShowForm(true)} id="create-invoice-btn">
          <Plus size={16} /> Create Invoice
        </button>
      </div>

      <div className="finance-summary">
        <div className="finance-summary-item">
          <span>Total Invoices</span>
          <strong>{invoices.length}</strong>
        </div>
        <div className="finance-summary-item">
          <span>Pending</span>
          <strong style={{ color: 'var(--warning)' }}>{pending.length}</strong>
        </div>
        <div className="finance-summary-item">
          <span>Paid</span>
          <strong style={{ color: 'var(--success)' }}>{paid.length}</strong>
        </div>
        <div className="finance-summary-item">
          <span>Pending Amount</span>
          <strong style={{ color: 'var(--warning)' }}>${totalPending.toLocaleString()}</strong>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 16 }}>All Invoices</h3>
        {loading ? (
          <div className="loading-state">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="empty-state">
            <FileText size={40} color="var(--text-muted)" />
            <p>No invoices yet. Create your first one!</p>
          </div>
        ) : (
          <div className="data-table">
            <div className="table-head" style={{gridTemplateColumns:'1.5fr 1fr 1fr 1fr 1fr'}}>
              <span>Client</span>
              <span>Due Date</span>
              <span>Amount</span>
              <span>Status</span>
              <span style={{ textAlign: 'right' }}>Action</span>
            </div>
            {invoices.map(inv => (
              <div key={inv.id} className="table-row" style={{gridTemplateColumns:'1.5fr 1fr 1fr 1fr 1fr'}}>
                <span style={{ fontWeight: 500 }}>{inv.client_name}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{inv.due_date}</span>
                <span style={{ fontWeight: 600 }}>${inv.amount?.toLocaleString()}</span>
                <span>
                  <span className={`badge badge-${inv.status === 'paid' ? 'success' : 'warning'}`}>
                    {inv.status}
                  </span>
                </span>
                <span style={{ textAlign: 'right' }}>
                  {inv.status === 'pending' ? (
                    <button
                      className="btn-sm"
                      onClick={() => handlePay(inv.id)}
                      id={`pay-invoice-${inv.id}`}
                    >
                      Mark Paid
                    </button>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>—</span>
                  )}
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
              <h3>Create Invoice</h3>
              <button className="icon-btn" onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Client Name</label>
                <input type="text" required className="input-field" placeholder="Acme Corp"
                  value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Amount ($)</label>
                <input type="number" required className="input-field" placeholder="0.00"
                  value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input type="date" required className="input-field"
                  value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />
              </div>
              <button type="submit" className="btn" style={{ width: '100%' }}>Send Invoice</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
