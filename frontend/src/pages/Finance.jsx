import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, X } from 'lucide-react';
import { get, post } from '../utils/api';

export default function Finance() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ amount: '', type: 'income', category: '', description: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    get('/finance/transactions')
      .then(r => r.ok && r.json())
      .then(d => d && setTransactions(d))
      .catch(() => setFetchError('Failed to load transactions.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      const res = await post('/finance/transactions', {
        amount: parseFloat(form.amount),
        type: form.type,
        category: form.category,
        description: form.description || null,
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(prev => [data, ...prev]);
        setForm({ amount: '', type: 'income', category: '', description: '' });
        setShowForm(false);
      } else {
        const err = await res.json();
        setFormError(err.detail || `Error ${res.status}: Failed to add transaction.`);
      }
    } catch (e) {
      setFormError('Network error. Is the backend running?');
    }
  };

  const total = transactions.reduce((acc, t) =>
    t.type === 'income' ? acc + t.amount : acc - t.amount, 0);

  return (
    <div className="page-wrapper">
      <div className="page-header-row">
        <div>
          <h1>Finance Management</h1>
          <p>Record and track all financial transactions.</p>
        </div>
        <button className="btn" onClick={() => { setShowForm(true); setFormError(''); }} id="add-transaction-btn">
          <Plus size={16} /> Add Transaction
        </button>
      </div>

      {/* Summary strip */}
      {fetchError && <div className="alert-banner">{fetchError}</div>}
        <div className="finance-summary-item">
          <span>Net Balance</span>
          <strong style={{ color: total >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {total >= 0 ? '+' : ''}${total.toLocaleString()}
          </strong>
        </div>
        <div className="finance-summary-item">
          <span>Transactions</span>
          <strong>{transactions.length}</strong>
        </div>
        <div className="finance-summary-item">
          <span>Income entries</span>
          <strong style={{ color: 'var(--success)' }}>
            {transactions.filter(t => t.type === 'income').length}
          </strong>
        </div>
        <div className="finance-summary-item">
          <span>Expense entries</span>
          <strong style={{ color: 'var(--danger)' }}>
            {transactions.filter(t => t.type === 'expense').length}
          </strong>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 16 }}>All Transactions</h3>
        {loading ? (
          <div className="loading-state">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <DollarSign size={40} color="var(--text-muted)" />
            <p>No transactions yet. Add your first one!</p>
          </div>
        ) : (
          <div className="data-table">
            <div className="table-head" style={{gridTemplateColumns:'1.2fr 1.5fr 1fr 0.8fr 1fr'}}>
              <span>Category</span>
              <span>Description</span>
              <span>Date</span>
              <span>Type</span>
              <span style={{ textAlign: 'right' }}>Amount</span>
            </div>
            {transactions.map(t => (
              <div key={t.id} className="table-row" style={{gridTemplateColumns:'1.2fr 1.5fr 1fr 0.8fr 1fr'}}>
                <span style={{ fontWeight: 500 }}>{t.category}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{t.description || '—'}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{t.date || '—'}</span>
                <span>
                  <span className={`badge badge-${t.type === 'income' ? 'success' : 'danger'}`}>
                    {t.type}
                  </span>
                </span>
                <span style={{ fontWeight: 600, textAlign: 'right', color: t.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                  {t.type === 'income' ? '+' : '-'}${t.amount?.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Transaction</h3>
              <button className="icon-btn" onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            {formError && <div className="login-error">{formError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="input-field" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Amount ($)</label>
                <input type="number" required className="input-field" placeholder="0.00"
                  value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input type="text" required className="input-field" placeholder="e.g. Software, Sales"
                  value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input type="text" className="input-field" placeholder="Optional note"
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <button type="submit" className="btn" style={{ width: '100%' }}>Record Transaction</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
