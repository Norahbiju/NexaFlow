import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Eye, EyeOff, Zap, Shield, BarChart3, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    const result = await login(email, password, role);
    setLoading(false);
    if (result.success) {
      navigate(role === 'admin' ? '/users' : '/');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const features = [
    { icon: <BarChart3 size={18} />, text: 'Real-time financial analytics' },
    { icon: <Zap size={18} />, text: 'AI-driven risk predictions' },
    { icon: <Shield size={18} />, text: 'Microservices architecture' },
    { icon: <Users size={18} />, text: 'Role-based access control' },
  ];

  return (
    <div className="login-page">
      {/* Left Panel */}
      <div className="login-left">
        <div className="login-left-inner">
          <div className="login-brand">
            <div className="login-logo-icon">
              <BrainCircuit size={28} color="white" />
            </div>
            <span className="login-logo-text">NexaFlow</span>
          </div>

          <div className="login-hero">
            <h1 className="login-headline">
              AI-Powered Financial Intelligence for Modern Business
            </h1>
            <p className="login-subheadline">
              Monitor, predict, and optimize your financial operations with real-time microservices insights.
            </p>
          </div>

          <div className="login-features">
            {features.map((f, i) => (
              <div key={i} className="login-feature-item">
                <div className="login-feature-icon">{f.icon}</div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Decorative shapes */}
          <div className="login-deco login-deco-1" />
          <div className="login-deco login-deco-2" />
          <div className="login-deco login-deco-3" />
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <div className="login-form-wrap">
          <div className="login-form-header">
            <h2>Welcome back 👋</h2>
            <p>Sign in to your NexaFlow account</p>
          </div>

          {error && (
            <div className="login-error">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="input-field"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-icon-btn"
                  onClick={() => setShowPass(!showPass)}
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Sign in as</label>
              <div className="role-toggle">
                <button
                  type="button"
                  className={`role-btn ${role === 'user' ? 'active' : ''}`}
                  onClick={() => setRole('user')}
                  id="role-user"
                >
                  <Users size={16} /> User
                </button>
                <button
                  type="button"
                  className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                  onClick={() => setRole('admin')}
                  id="role-admin"
                >
                  <Shield size={16} /> Admin
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn login-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="login-spinner" />
              ) : (
                'Sign In to NexaFlow'
              )}
            </button>
          </form>

          <div className="login-demo-hint">
            <span>🔑</span>
            <span>Demo mode: any email &amp; password accepted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
