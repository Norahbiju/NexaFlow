import React, { useState, useEffect } from 'react';
import { BrainCircuit, RefreshCw } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import { get } from '../utils/api';

const forecastData = [
  { day: 'Day 1', cashflow: 45000 }, { day: 'Day 5', cashflow: 42000 },
  { day: 'Day 10', cashflow: 38000 }, { day: 'Day 15', cashflow: 35000 },
  { day: 'Day 20', cashflow: 28000 }, { day: 'Day 25', cashflow: 22000 },
  { day: 'Day 30', cashflow: 18000 },
];

export default function AIPredictions() {
  const [data, setData] = useState({ risk_score: 'Low', days_to_negative: -1, predicted_cashflow_30d: 0 });
  const [cashflow, setCashflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [riskRes, stateRes] = await Promise.all([
        get('/ai/predictions/risk-score'),
        get('/ai/predictions/state'),
      ]);
      if (riskRes.ok) setData(await riskRes.json());
      if (stateRes.ok) setCashflow(await stateRes.json());
    } catch (_) {}
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const refresh = () => { setRefreshing(true); fetchData(); };

  const riskColor = data.risk_score === 'High' ? '#ef4444'
    : data.risk_score === 'Medium' ? '#f59e0b' : '#10b981';

  const riskBg = data.risk_score === 'High' ? '#fee2e2'
    : data.risk_score === 'Medium' ? '#fef3c7' : '#d1fae5';

  return (
    <div className="page-wrapper">
      <div className="page-header-row">
        <div>
          <h1>AI Predictions</h1>
          <p>Machine-learning powered financial risk analysis and forecasting.</p>
        </div>
        <button className="btn btn-outline-blue" onClick={refresh} disabled={refreshing} id="refresh-predictions-btn">
          <RefreshCw size={16} className={refreshing ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="loading-state" style={{ height: 200 }}>Fetching AI predictions...</div>
      ) : (
        <>
          {/* Risk + Days cards */}
          <div className="ai-cards-grid">
            <div className="ai-hero-card" style={{ borderTop: `4px solid ${riskColor}` }}>
              <div className="ai-hero-icon" style={{ background: riskBg, color: riskColor }}>
                <BrainCircuit size={32} />
              </div>
              <div className="ai-hero-label">Risk Level</div>
              <div className="ai-hero-value" style={{ color: riskColor }}>{data.risk_score}</div>
              <div className="ai-hero-sub">Based on current financial patterns</div>
            </div>

            <div className="ai-hero-card" style={{ borderTop: '4px solid #4f46e5' }}>
              <div className="ai-hero-icon" style={{ background: '#ede9fe', color: '#4f46e5' }}>
                <span style={{ fontSize: 28, fontWeight: 800 }}>📅</span>
              </div>
              <div className="ai-hero-label">Days to Negative Balance</div>
              <div className="ai-hero-value" style={{ color: '#4f46e5' }}>
                {data.days_to_negative === -1 ? '∞' : data.days_to_negative}
              </div>
              <div className="ai-hero-sub">
                {data.days_to_negative === -1 ? 'Finances are stable' : `${data.days_to_negative} days remaining`}
              </div>
            </div>

            <div className="ai-hero-card" style={{ borderTop: '4px solid #10b981' }}>
              <div className="ai-hero-icon" style={{ background: '#d1fae5', color: '#10b981' }}>
                <span style={{ fontSize: 28, fontWeight: 800 }}>📈</span>
              </div>
              <div className="ai-hero-label">30-Day Cash Forecast</div>
              <div className="ai-hero-value" style={{ color: data.predicted_cashflow_30d < 0 ? '#ef4444' : '#10b981' }}>
                ${data.predicted_cashflow_30d?.toLocaleString()}
              </div>
              <div className="ai-hero-sub">Predicted net cashflow</div>
            </div>
          </div>

          {/* Cashflow forecast chart */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">30-Day Cash Flow Projection</h3>
              <span className="badge badge-primary">AI Generated</span>
            </div>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cashflow?.projections || forecastData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }}
                    formatter={(v) => [`$${v?.toLocaleString()}`, 'Cash Flow']}
                  />
                  <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Zero', fill: '#ef4444', fontSize: 11 }} />
                  <Line
                    type="monotone"
                    dataKey="cashflow"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    dot={{ fill: '#4f46e5', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk factors */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Risk Factor Analysis</h3>
            </div>
            <div className="risk-factors">
              {[
                { label: 'Cash Burn Rate', level: 72, color: '#f59e0b' },
                { label: 'Invoice Aging', level: 45, color: '#10b981' },
                { label: 'Stock Turnover', level: 60, color: '#4f46e5' },
                { label: 'Payment Delays', level: 30, color: '#10b981' },
              ].map(factor => (
                <div key={factor.label} className="risk-factor-row">
                  <span className="risk-factor-label">{factor.label}</span>
                  <div className="risk-factor-bar-wrap">
                    <div
                      className="risk-factor-bar"
                      style={{ width: `${factor.level}%`, background: factor.color }}
                    />
                  </div>
                  <span className="risk-factor-pct">{factor.level}%</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
