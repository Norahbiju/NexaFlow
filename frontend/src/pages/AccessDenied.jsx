import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AccessDenied() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="access-denied-page">
      <div className="access-denied-card">
        <div className="access-denied-icon">
          <ShieldOff size={48} color="#ef4444" />
        </div>
        <h1 className="access-denied-title">Access Denied</h1>
        <p className="access-denied-desc">
          Your <strong>{user?.role}</strong> account doesn't have permission to view this page.
          {user?.role === 'admin' && ' Admin accounts can only access the User Management section.'}
        </p>
        <button
          className="btn"
          onClick={() => navigate(user?.role === 'admin' ? '/users' : '/')}
        >
          <ArrowLeft size={16} /> Go to {user?.role === 'admin' ? 'User Management' : 'Dashboard'}
        </button>
      </div>
    </div>
  );
}
