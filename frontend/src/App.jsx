import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Wallet, FileText, Package, BrainCircuit, 
  BellRing, TrendingUp, TrendingDown, AlertTriangle, UserCircle,
  Search, Menu, ArrowRight, Activity, DollarSign, ShoppingCart
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line
} from 'recharts';

// Top Navigation
function TopNav() {
  return (
    <div className="top-nav">
      <div className="logo-container">
        <BrainCircuit size={28} color="var(--primary)" />
        <span>NexaFlow</span>
      </div>
      
      <div className="search-bar">
        <Search size={18} />
        <input type="text" placeholder="Search transactions, invoices, etc..." />
      </div>

      <div className="top-nav-actions">
        <button className="icon-btn"><BellRing size={20} /></button>
        <div className="avatar">A</div>
      </div>
    </div>
  );
}

// Sidebar Navigation
function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="sidebar">
      <div style={{ padding: '8px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Menu
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Link to="/" className={`nav-link ${path === '/' ? 'active' : ''}`}>
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link to="/finance" className={`nav-link ${path === '/finance' ? 'active' : ''}`}>
          <Wallet size={18} /> Finance
        </Link>
        <Link to="/invoices" className={`nav-link ${path === '/invoices' ? 'active' : ''}`}>
          <FileText size={18} /> Invoices
        </Link>
        <Link to="/inventory" className={`nav-link ${path === '/inventory' ? 'active' : ''}`}>
          <Package size={18} /> Inventory
        </Link>
        <Link to="/profile" className={`nav-link ${path === '/profile' ? 'active' : ''}`}>
          <UserCircle size={18} /> Profile
        </Link>
      </nav>
    </div>
  );
}

// Microservices Architecture Component
function ArchitecturePanel() {
  return (
    <div className="card" style={{ gridColumn: '1 / -1' }}>
      <div className="card-header">
        <h3 className="card-title">Live Microservices Event Flow</h3>
        <span className="badge badge-success">System Active</span>
      </div>
      
      <div className="architecture-container" style={{ padding: '40px 20px' }}>
        {/* Horizontal line across */}
        <div className="connector-line" style={{ width: '80%', left: '10%', top: '50%' }}></div>
        
        <div className="service-node" title="Finance Service: Processes Income & Expenses">
          <div className="service-icon"><Wallet size={24} /></div>
          <div className="service-node-title">Finance</div>
        </div>

        <div className="service-node" title="Invoice Service: Tracks Receivables">
          <div className="service-icon"><FileText size={24} /></div>
          <div className="service-node-title">Invoices</div>
        </div>

        <div className="service-node" title="Inventory Service: Tracks Stock & COGS">
          <div className="service-icon"><Package size={24} /></div>
          <div className="service-node-title">Inventory</div>
        </div>

        <div className="service-node ai-node" title="AI Service: Analyzes events for risk prediction">
          <div className="service-icon"><BrainCircuit size={24} /></div>
          <div className="service-node-title" style={{ color: 'var(--purple)' }}>AI Predictor</div>
        </div>

        <div className="service-node" title="Recommendation Service: Dispatches Alerts">
          <div className="service-icon"><Activity size={24} /></div>
          <div className="service-node-title">Insights</div>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard
function Dashboard() {
  const [balance, setBalance] = useState({ total_income: 0, total_expense: 0, current_balance: 0 });
  const [aiState, setAiState] = useState({ risk_score: "Low", days_to_negative: -1, predicted_cashflow_30d: 0 });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for charts
  const chartData = [
    { name: 'Jan', income: 4000, expense: 2400 },
    { name: 'Feb', income: 3000, expense: 1398 },
    { name: 'Mar', income: 2000, expense: 9800 },
    { name: 'Apr', income: 2780, expense: 3908 },
    { name: 'May', income: 1890, expense: 4800 },
    { name: 'Jun', income: balance.total_income || 2390, expense: balance.total_expense || 3800 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balRes = await fetch('/api/finance/balance');
        if (balRes.ok) setBalance(await balRes.json());

        const aiRes = await fetch('/api/ai/predictions/risk-score');
        if (aiRes.ok) setAiState(await aiRes.json());

        const recRes = await fetch('/api/recommendation/recommendations');
        if (recRes.ok) setRecommendations(await recRes.json());
      } catch (e) {
        console.error("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="main-content">
      <div className="page-header">
        <h1>Overview</h1>
        <p>Monitor your financial health and AI-driven insights.</p>
      </div>

      <div className="grid-4">
        <div className="card">
          <h3 className="card-title">Current Balance</h3>
          <div className="stat-value">${balance.current_balance.toLocaleString()}</div>
          <div className="trend-indicator trend-up"><TrendingUp size={14} /> +2.5%</div>
        </div>
        <div className="card">
          <h3 className="card-title">Total Income</h3>
          <div className="stat-value" style={{ color: 'var(--success)' }}>${balance.total_income.toLocaleString()}</div>
          <div className="trend-indicator trend-up"><TrendingUp size={14} /> +5.1%</div>
        </div>
        <div className="card">
          <h3 className="card-title">Total Expenses</h3>
          <div className="stat-value" style={{ color: 'var(--danger)' }}>${balance.total_expense.toLocaleString()}</div>
          <div className="trend-indicator trend-down"><TrendingDown size={14} /> -1.2%</div>
        </div>
        <div className="card">
          <h3 className="card-title">30-Day Forecast</h3>
          <div className="stat-value" style={{ color: aiState.predicted_cashflow_30d < 0 ? 'var(--danger)' : 'var(--primary)' }}>
            ${aiState.predicted_cashflow_30d.toLocaleString()}
          </div>
          <div className="trend-indicator" style={{ color: 'var(--text-muted)' }}>AI Generated</div>
        </div>
      </div>

      <ArchitecturePanel />

      <div className="grid-2-1">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Cash Flow Trend</h3>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--success)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }} />
                <Area type="monotone" dataKey="income" stroke="var(--success)" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="var(--danger)" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card risk-hero" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div className="card-header" style={{ width: '100%' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--purple)' }}>
              <BrainCircuit size={18} /> AI Risk Predictor
            </h3>
            <span className={`badge badge-${aiState.risk_score === 'High' ? 'danger' : aiState.risk_score === 'Medium' ? 'warning' : 'success'}`}>
              {aiState.risk_score} Risk
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '24px 0' }}>
            <div className="risk-circle-container" style={{ borderColor: aiState.risk_score === 'High' ? 'var(--danger)' : 'var(--success)' }}>
              <div className="risk-circle-val" style={{ color: aiState.risk_score === 'High' ? 'var(--danger)' : 'var(--success)' }}>
                {aiState.days_to_negative === -1 ? '∞' : aiState.days_to_negative}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', width: '100%', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Days until estimated negative balance
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Actionable AI Recommendations</h3>
        </div>
        <div className="list-container">
          {recommendations.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', padding: '16px' }}>No critical alerts at this time.</p>
          ) : recommendations.map(rec => (
            <div key={rec.id} className={`list-item ${rec.priority.toLowerCase()}-priority`}>
              <div className="list-icon">
                <AlertTriangle size={18} color={rec.priority === 'High' ? 'var(--danger)' : 'var(--warning)'} />
              </div>
              <div>
                <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>{rec.priority} Priority Alert</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{rec.message}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Finance Module
function FinancePage() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ amount: '', type: 'income', category: '', description: '' });

  useEffect(() => {
    fetch('/api/finance/transactions').then(r => r.json()).then(setTransactions).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/finance/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: parseFloat(form.amount), type: form.type, category: form.category, description: form.description })
    });
    if (res.ok) {
      const data = await res.json();
      setTransactions([...transactions, data]);
      setForm({ amount: '', type: 'income', category: '', description: '' });
    }
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <h1>Finance Management</h1>
        <p>Record transactions to update your balance.</p>
      </div>

      <div className="grid-2-1">
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '16px' }}>Recent Transactions</h3>
          <div className="list-container">
            {transactions.map(t => (
              <div key={t.id} className="list-item" style={{ borderLeftColor: t.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                <div className="list-icon">
                  <DollarSign size={18} color={t.type === 'income' ? 'var(--success)' : 'var(--danger)'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{t.category}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t.date}</div>
                </div>
                <div style={{ fontWeight: 600, color: t.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                  {t.type === 'income' ? '+' : '-'}${t.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '16px' }}>Add Transaction</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="input-field" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Amount ($)</label>
              <input type="number" required className="input-field" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input type="text" required className="input-field" value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="e.g. Software, Sales" />
            </div>
            <button className="btn" type="submit" style={{ width: '100%' }}>Record Transaction</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Invoices Module
function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState({ client_name: '', amount: '', due_date: '' });

  useEffect(() => {
    fetch('/api/invoice/invoices').then(r => r.json()).then(setInvoices).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/invoice/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_name: form.client_name, amount: parseFloat(form.amount), due_date: form.due_date })
    });
    if (res.ok) {
      const data = await res.json();
      setInvoices([...invoices, data]);
      setForm({ client_name: '', amount: '', due_date: '' });
    }
  };

  const handlePay = async (id) => {
    const res = await fetch(`/api/invoice/invoices/${id}/pay`, { method: 'POST' });
    if (res.ok) {
      setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'paid' } : inv));
    }
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <h1>Invoice Tracking</h1>
        <p>Manage receivables and client payments.</p>
      </div>

      <div className="grid-2-1">
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '16px' }}>All Invoices</h3>
          <div className="list-container">
            {invoices.map(inv => (
              <div key={inv.id} className={`list-item ${inv.status === 'paid' ? 'low-priority' : 'medium-priority'}`}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{inv.client_name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Due: {inv.due_date} | ${inv.amount}</div>
                </div>
                <div>
                  {inv.status === 'pending' ? (
                    <button className="btn" style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => handlePay(inv.id)}>Mark Paid</button>
                  ) : (
                    <span className="badge badge-success">Paid</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '16px' }}>Create Invoice</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Client Name</label>
              <input type="text" required className="input-field" value={form.client_name} onChange={e => setForm({...form, client_name: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Amount ($)</label>
              <input type="number" required className="input-field" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Due Date (YYYY-MM-DD)</label>
              <input type="text" required className="input-field" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} />
            </div>
            <button className="btn" type="submit" style={{ width: '100%' }}>Send Invoice</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Inventory Module
function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', sku: '', cost_price: '', selling_price: '', stock_quantity: '' });

  useEffect(() => {
    fetch('/api/inventory/inventory').then(r => r.json()).then(setProducts).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      sku: form.sku || `SKU-${Math.floor(Math.random()*1000)}`,
      cost_price: parseFloat(form.cost_price),
      selling_price: parseFloat(form.selling_price),
      stock_quantity: parseInt(form.stock_quantity, 10)
    };
    const res = await fetch('/api/inventory/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      setProducts([...products, data]);
      setForm({ name: '', sku: '', cost_price: '', selling_price: '', stock_quantity: '' });
    }
  };

  const handleRestock = async (id) => {
    const res = await fetch(`/api/inventory/inventory/${id}/restock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: 50, unit_cost: 10.0 })
    });
    if (res.ok) {
      fetch('/api/inventory/inventory').then(r => r.json()).then(setProducts);
    }
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <h1>Inventory Operations</h1>
        <p>Manage stock levels and COGS data.</p>
      </div>

      <div className="grid-2-1">
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '16px' }}>Current Stock</h3>
          <div className="list-container">
            {products.map(p => (
              <div key={p.id} className="list-item" style={{ borderLeftColor: p.stock_quantity < 20 ? 'var(--danger)' : 'var(--primary)' }}>
                <div className="list-icon">
                  <ShoppingCart size={18} color="var(--primary)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{p.name} <span style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>({p.sku})</span></div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Cost: ${p.cost_price} | Sell: ${p.selling_price}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <span className={`badge badge-${p.stock_quantity < 20 ? 'danger' : 'success'}`}>{p.stock_quantity} Units</span>
                  <button className="btn" style={{ fontSize: '0.7rem', padding: '4px 8px', background: 'var(--bg-main)', color: 'var(--primary)', border: '1px solid var(--border-color)' }} onClick={() => handleRestock(p.id)}>Restock 50</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '16px' }}>Add Product</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Product Name</label>
              <input type="text" required className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Initial Stock</label>
              <input type="number" required className="input-field" value={form.stock_quantity} onChange={e => setForm({...form, stock_quantity: e.target.value})} />
            </div>
            <div className="grid-2" style={{ marginBottom: 0 }}>
              <div className="form-group">
                <label className="form-label">Cost ($)</label>
                <input type="number" required className="input-field" value={form.cost_price} onChange={e => setForm({...form, cost_price: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Price ($)</label>
                <input type="number" required className="input-field" value={form.selling_price} onChange={e => setForm({...form, selling_price: e.target.value})} />
              </div>
            </div>
            <button className="btn" type="submit" style={{ width: '100%' }}>Add Product</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// User Profile
function UserProfile() {
  const [formData, setFormData] = useState({ full_name: '', email: '', company_name: '', industry: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      const res = await fetch('/api/user/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('Profile saved successfully!');
        setFormData({ full_name: '', email: '', company_name: '', industry: '' });
      } else {
        const error = await res.json();
        setStatus(`Error: ${error.detail}`);
      }
    } catch (err) {
      setStatus('Failed to connect to backend.');
    }
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <h1>Business Profile</h1>
        <p>Manage your company settings and user details.</p>
      </div>
      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" required className="input-field" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" required className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Company Name</label>
            <input type="text" required className="input-field" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Industry</label>
            <input type="text" className="input-field" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} />
          </div>
          <button type="submit" className="btn">Save Profile</button>
        </form>
        {status && <p style={{ marginTop: '16px', color: status.includes('Error') ? 'var(--danger)' : 'var(--success)' }}>{status}</p>}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <TopNav />
        <div className="body-layout">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
