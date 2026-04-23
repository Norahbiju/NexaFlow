import React, { useState, useEffect } from 'react';
import { Users, Search, UserCheck, Calendar } from 'lucide-react';
import { get } from '../utils/api';
export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    get('/user/users')
      .then(r => r.ok && r.json())
      .then(d => setUsers(d || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    !search ||
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.company_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <div className="page-header-row">
        <div>
          <h1>User Management</h1>
          <p>View and manage all registered business accounts.</p>
        </div>
        <div className="admin-badge">
          <span>⚙️ Admin View</span>
        </div>
      </div>

      <div className="finance-summary">
        <div className="finance-summary-item">
          <span>Total Users</span>
          <strong>{users.length}</strong>
        </div>
        <div className="finance-summary-item">
          <span>Active This Month</span>
          <strong style={{ color: 'var(--success)' }}>{users.length}</strong>
        </div>
        <div className="finance-summary-item">
          <span>Industries</span>
          <strong>{new Set(users.map(u => u.industry)).size}</strong>
        </div>
        <div className="finance-summary-item">
          <span>Newest Join</span>
          <strong style={{ color: '#0891b2' }}>
            {users.length > 0
              ? new Date(Math.max(...users.map(u => new Date(u.created_at || 0)))).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : '—'
            }
          </strong>
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ marginBottom: 16 }}>
          <h3 className="card-title">Registered Users</h3>
          <div className="search-bar" style={{ width: 260 }}>
            <Search size={14} />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              id="user-search"
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading users...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Users size={40} color="var(--text-muted)" />
            <p>No users found.</p>
          </div>
        ) : (
          <div className="data-table">
            <div className="table-head" style={{gridTemplateColumns:'1.5fr 1.5fr 1.2fr 1fr 1fr 0.8fr'}}>
              <span>Name</span>
              <span>Email</span>
              <span>Company</span>
              <span>Industry</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={13} /> Joined
              </span>
              <span>Status</span>
            </div>
            {filtered.map(u => (
              <div key={u.id} className="table-row" style={{gridTemplateColumns:'1.5fr 1.5fr 1.2fr 1fr 1fr 0.8fr'}}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="avatar avatar-sm">{(u.full_name?.[0] || u.email?.[0] || 'U').toUpperCase()}</div>
                  <span style={{ fontWeight: 500 }}>{u.full_name}</span>
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>{u.email}</span>
                <span>{u.company_name}</span>
                <span>
                  <span className="badge badge-primary">{u.industry}</span>
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {u.created_at ? new Date(u.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                </span>
                <span>
                  <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <UserCheck size={11} /> Active
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
