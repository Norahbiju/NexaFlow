import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  FileText, 
  Package, 
  BrainCircuit, 
  BellRing,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

const mockCashflowData = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 2000, expense: 9800 },
  { name: 'Apr', income: 2780, expense: 3908 },
  { name: 'May', income: 1890, expense: 4800 },
  { name: 'Jun', income: 2390, expense: 3800 },
  { name: 'Jul', income: 3490, expense: 4300 },
];

const mockRecommendations = [
  { id: 1, message: "Warning: Cash flow trending downwards. Review upcoming expenses.", priority: "Medium", action_type: "monitor" },
  { id: 2, message: "URGENT: High risk of negative cash flow in 14 days. Immediate action required to collect pending invoices.", priority: "High", action_type: "urgent_review" }
];

function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3rem' }}>
        <BrainCircuit size={32} color="#8b5cf6" />
        <h2 className="text-gradient" style={{ margin: 0 }}>NexaFlow AI</h2>
      </div>

      <nav>
        <Link to="/" className={`nav-link ${path === '/' ? 'active' : ''}`}>
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link to="/finance" className={`nav-link ${path === '/finance' ? 'active' : ''}`}>
          <Wallet size={20} /> Finance & Cashflow
        </Link>
        <Link to="/invoices" className={`nav-link ${path === '/invoices' ? 'active' : ''}`}>
          <FileText size={20} /> Invoices
        </Link>
        <Link to="/inventory" className={`nav-link ${path === '/inventory' ? 'active' : ''}`}>
          <Package size={20} /> Inventory
        </Link>
        <Link to="/ai-risk" className={`nav-link ${path === '/ai-risk' ? 'active' : ''}`}>
          <BrainCircuit size={20} /> AI Risk Predictor
        </Link>
      </nav>

      <div style={{ marginTop: 'auto', background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <BellRing size={18} color="#8b5cf6" />
          <strong style={{ color: '#e2e8f0' }}>AI Alert</strong>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
          High risk of negative balance detected in 14 days.
        </p>
      </div>
    </div>
  );
}

function Dashboard() {
  const [balance, setBalance] = useState({ total_income: 124500, total_expense: 84300, current_balance: 40200 });
  const [aiState, setAiState] = useState({ risk_score: "High", days_to_negative: 14, predicted_cashflow_30d: -5400 });

  // In real app, we would fetch from API
  // useEffect(() => {
  //   fetch('/api/finance/balance').then(r => r.json()).then(setBalance);
  //   fetch('/api/ai/predictions/risk-score').then(r => r.json()).then(setAiState);
  // }, []);

  return (
    <div className="main-content">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Overview Overview</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Here's your business financial summary.</p>
        </div>
        <button className="btn">Generate Report</button>
      </header>

      <div className="dashboard-grid">
        <div className="glass-card">
          <h3>Total Balance</h3>
          <div className="stat-value">${balance.current_balance.toLocaleString()}</div>
          <p style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <TrendingUp size={16} /> +12.5% from last month
          </p>
        </div>
        
        <div className="glass-card">
          <h3>Total Income</h3>
          <div className="stat-value success">${balance.total_income.toLocaleString()}</div>
          <p style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <TrendingUp size={16} /> +8.2% from last month
          </p>
        </div>

        <div className="glass-card">
          <h3>Total Expenses</h3>
          <div className="stat-value danger">${balance.total_expense.toLocaleString()}</div>
          <p style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <TrendingUp size={16} /> +15.4% from last month
          </p>
        </div>
      </div>

      <div className="dashboard-grid wide-grid">
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem' }}>Cash Flow Trend</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockCashflowData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: '#fff' }} />
                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BrainCircuit color="var(--accent)" /> AI Risk Predictor
          </h3>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '4rem', fontWeight: '800', lineHeight: 1, color: aiState.risk_score === 'High' ? 'var(--danger)' : 'var(--success)' }}>
              {aiState.days_to_negative}
            </div>
            <div style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginTop: '8px' }}>
              Days to Negative Balance
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Risk Score</span>
              <span className={`badge ${aiState.risk_score === 'High' ? 'high-risk' : 'low-risk'}`}>{aiState.risk_score}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>30-Day Forecast</span>
              <span style={{ color: aiState.predicted_cashflow_30d < 0 ? 'var(--danger)' : 'var(--success)' }}>
                ${aiState.predicted_cashflow_30d.toLocaleString()}
              </span>
            </div>
          </div>

          <h4 style={{ marginBottom: '1rem', marginTop: 'auto' }}>Smart Recommendations</h4>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {mockRecommendations.map(rec => (
              <div key={rec.id} className={`ai-recommendation ${rec.priority.toLowerCase()}`}>
                <AlertTriangle size={20} color={rec.priority === 'High' ? 'var(--danger)' : 'var(--accent)'} style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '0.9rem' }}>{rec.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderPage({ title }) {
  return (
    <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{title}</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
          This module connects via RabbitMQ to process live events from the backend microservices.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/finance" element={<PlaceholderPage title="Finance Management" />} />
          <Route path="/invoices" element={<PlaceholderPage title="Invoice Tracking" />} />
          <Route path="/inventory" element={<PlaceholderPage title="Inventory Operations" />} />
          <Route path="/ai-risk" element={<PlaceholderPage title="Deep AI Risk Analysis" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
