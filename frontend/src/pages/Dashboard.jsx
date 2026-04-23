import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet, FileText, Package, BrainCircuit, Lightbulb, Users,
  TrendingUp, TrendingDown, AlertTriangle, ArrowRight, Activity,
  DollarSign, BarChart3
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { get } from '../utils/api';

const services = [
  {
    id: 'finance', icon: <Wallet size={24} />, label: 'Finance Service',
    desc: 'Track income, expenses, and balance in real time.',
    color: '#4f46e5', bg: '#ede9fe', route: '/finance',
  },
  {
    id: 'invoices', icon: <FileText size={24} />, label: 'Invoice Service',
    desc: 'Manage client invoices and payment statuses.',
    color: '#0891b2', bg: '#e0f2fe', route: '/invoices',
  },
  {
    id: 'inventory', icon: <Package size={24} />, label: 'Inventory Service',
    desc: 'Monitor stock levels and trigger restocks.',
    color: '#059669', bg: '#d1fae5', route: '/inventory',
  },
  {
    id: 'ai', icon: <BrainCircuit size={24} />, label: 'AI Predictions',
    desc: 'Risk scoring and 30-day cashflow forecasting.',
    color: '#7c3aed', bg: '#ede9fe', route: '/ai-predictions',
  },
  {
    id: 'recommendations', icon: <Lightbulb size={24} />, label: 'Recommendations',
    desc: 'AI-generated financial insights and alerts.',
    color: '#d97706', bg: '#fef3c7', route: '/recommendations',
  },
  {
    id: 'users', icon: <Users size={24} />, label: 'User Service',
    desc: 'User management and business profiles.',
    color: '#dc2626', bg: '#fee2e2', route: '/users',
  },
];

const chartData = [
  { name: 'Jan', income: 42000, expense: 28000 },
  { name: 'Feb', income: 38000, expense: 22000 },
  { name: 'Mar', income: 55000, expense: 41000 },
  { name: 'Apr', income: 47000, expense: 31000 },
  { name: 'May', income: 63000, expense: 38000 },
  { name: 'Jun', income: 58000, expense: 33000 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState({ total_income: 0, total_expense: 0, current_balance: 0 });
  const [aiState, setAiState] = useState({ risk_score: 'Low', days_to_negative: -1, predicted_cashflow_30d: 0 });
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    get('/finance/balance').then(r => r.ok && r.json()).then(d => d && setBalance(d)).catch(() => {});
    get('/ai/predictions/risk-score').then(r => r.ok && r.json()).then(d => d && setAiState(d)).catch(() => {});
    get('/recommendation/recommendations').then(r => r.ok && r.json()).then(d => d && setRecommendations(d)).catch(() => {});
  }, []);

  const riskColor = aiState.risk_score === 'High' ? 'var(--danger)'
    : aiState.risk_score === 'Medium' ? 'var(--warning)' : 'var(--success)';

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Financial Overview</h1>
        <p>Monitor your financial health and AI-driven insights in real time.</p>
      </div>

      {/* Stats Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon-wrap" style={{ background: '#ede9fe' }}>
              <DollarSign size={20} color="#4f46e5" />
            </div>
            <span className="trend-badge trend-up"><TrendingUp size={12} /> +2.5%</span>
          </div>
          <div className="stat-value">${balance.current_balance.toLocaleString()}</div>
          <div className="stat-label">Current Balance</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon-wrap" style={{ background: '#d1fae5' }}>
              <TrendingUp size={20} color="#10b981" />
            </div>
            <span className="trend-badge trend-up"><TrendingUp size={12} /> +5.1%</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>${balance.total_income.toLocaleString()}</div>
          <div className="stat-label">Total Income</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon-wrap" style={{ background: '#fee2e2' }}>
              <TrendingDown size={20} color="#ef4444" />
            </div>
            <span className="trend-badge trend-down"><TrendingDown size={12} /> -1.2%</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--danger)' }}>${balance.total_expense.toLocaleString()}</div>
          <div className="stat-label">Total Expenses</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon-wrap" style={{ background: '#e0f2fe' }}>
              <BarChart3 size={20} color="#0891b2" />
            </div>
            <span className="trend-badge" style={{ color: '#0891b2', background: '#e0f2fe' }}>AI</span>
          </div>
          <div className="stat-value" style={{ color: aiState.predicted_cashflow_30d < 0 ? 'var(--danger)' : '#0891b2' }}>
            ${aiState.predicted_cashflow_30d.toLocaleString()}
          </div>
          <div className="stat-label">30-Day Forecast</div>
        </div>
      </div>

      {/* Services Overview */}
      <div className="section-header">
        <h2>Microservices Overview</h2>
        <p>Click any service to navigate to its dedicated management page.</p>
      </div>
      <div className="services-grid">
        {services.map(svc => (
          <div
            key={svc.id}
            className="service-card"
            onClick={() => navigate(svc.route)}
            id={`service-card-${svc.id}`}
          >
            <div className="service-card-icon" style={{ background: svc.bg, color: svc.color }}>
              {svc.icon}
            </div>
            <div className="service-card-body">
              <div className="service-card-title">{svc.label}</div>
              <div className="service-card-desc">{svc.desc}</div>
            </div>
            <div className="service-card-arrow" style={{ color: svc.color }}>
              <ArrowRight size={18} />
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Risk */}
      <div className="dashboard-bottom-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Cash Flow Trend</h3>
            <span className="badge badge-primary">Last 6 Months</span>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }} />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fill="url(#gradIncome)" name="Income" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="url(#gradExpense)" name="Expense" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card risk-card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BrainCircuit size={18} color="#7c3aed" /> AI Risk Monitor
            </h3>
            <span className={`badge badge-${aiState.risk_score === 'High' ? 'danger' : aiState.risk_score === 'Medium' ? 'warning' : 'success'}`}>
              {aiState.risk_score} Risk
            </span>
          </div>
          <div className="risk-display">
            <div className="risk-circle" style={{ borderColor: riskColor, boxShadow: `0 0 0 8px ${riskColor}18` }}>
              <div className="risk-circle-val" style={{ color: riskColor }}>
                {aiState.days_to_negative === -1 ? '∞' : aiState.days_to_negative}
              </div>
              <div className="risk-circle-sub">days</div>
            </div>
            <p className="risk-caption">Estimated days until negative balance</p>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Activity size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
            AI Recommendations
          </h3>
          <span className="badge badge-primary">{recommendations.length} alerts</span>
        </div>
        {recommendations.length === 0 ? (
          <div className="empty-state-sm">
            <span>✅</span> No critical alerts at this time. Your finances look healthy!
          </div>
        ) : (
          <div className="list-container">
            {recommendations.map(rec => (
              <div key={rec.id} className={`list-item ${rec.priority?.toLowerCase()}-priority`}>
                <div className="list-icon">
                  <AlertTriangle size={18} color={rec.priority === 'High' ? 'var(--danger)' : 'var(--warning)'} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{rec.priority} Priority Alert</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{rec.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
