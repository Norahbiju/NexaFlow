import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  BrainCircuit, LayoutDashboard, Wallet, FileText, Package,
  Zap, Lightbulb, Users, BellRing, Search, ChevronDown,
  LogOut, User, Settings, X, Menu
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const userNavLinks = [
  { to: '/', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/finance', icon: <Wallet size={18} />, label: 'Finance' },
  { to: '/invoices', icon: <FileText size={18} />, label: 'Invoices' },
  { to: '/inventory', icon: <Package size={18} />, label: 'Inventory' },
  { to: '/ai-predictions', icon: <BrainCircuit size={18} />, label: 'AI Predictions' },
  { to: '/recommendations', icon: <Lightbulb size={18} />, label: 'Recommendations' },
];

const adminNavLinks = [
  { to: '/users', icon: <Users size={18} />, label: 'User Management' },
];

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { user } = useAuth();
  const links = user?.role === 'admin' ? adminNavLinks : userNavLinks;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon-wrap">
              <BrainCircuit size={20} color="white" />
            </div>
            <span className="logo-text">NexaFlow</span>
          </div>
          <button className="icon-btn sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Role badge */}
        <div className="sidebar-role-badge">
          <span className={`role-pill ${user?.role}`}>
            {user?.role === 'admin' ? '⚙️ Admin' : '👤 User'} Access
          </span>
        </div>

        {/* Nav Section Label */}
        <div className="sidebar-section-label">Navigation</div>

        {/* Links */}
        <nav className="sidebar-nav">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-link-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar avatar-sm">{(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || 'User'}</div>
              <div className="sidebar-user-email">{user?.email}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function TopNav({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropRef = useRef();
  const notifRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="top-nav">
      <div className="top-nav-left">
        <button
          className="icon-btn hamburger-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          id="hamburger-menu"
        >
          <Menu size={20} />
        </button>
        <div className="logo-container">
          <div className="logo-icon-wrap">
            <BrainCircuit size={18} color="white" />
          </div>
          <span className="logo-text">NexaFlow</span>
        </div>
      </div>

      <div className="search-bar">
        <Search size={16} />
        <input type="text" placeholder="Search transactions, invoices, services..." id="global-search" />
      </div>

      <div className="top-nav-actions">
        {/* Notifications */}
        <div className="notif-wrapper" ref={notifRef}>
          <button
            className="icon-btn notif-btn"
            onClick={() => setNotifOpen(!notifOpen)}
            id="notifications-btn"
          >
            <BellRing size={20} />
            <span className="notif-dot" />
          </button>
          {notifOpen && (
            <div className="notif-dropdown">
              <div className="notif-header">Notifications</div>
              <div className="notif-item">
                <div className="notif-icon notif-warning">⚠️</div>
                <div>
                  <div className="notif-title">High risk score detected</div>
                  <div className="notif-time">2 minutes ago</div>
                </div>
              </div>
              <div className="notif-item">
                <div className="notif-icon notif-info">📊</div>
                <div>
                  <div className="notif-title">New AI prediction ready</div>
                  <div className="notif-time">15 minutes ago</div>
                </div>
              </div>
              <div className="notif-item">
                <div className="notif-icon notif-success">✅</div>
                <div>
                  <div className="notif-title">Invoice #1042 marked paid</div>
                  <div className="notif-time">1 hour ago</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="profile-wrapper" ref={dropRef}>
          <button
            className="profile-trigger"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            id="profile-dropdown-btn"
          >
            <div className="avatar">{(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}</div>
            <div className="profile-info">
              <div className="profile-name">{user?.name || 'User'}</div>
              <div className="profile-role">{user?.role}</div>
            </div>
            <ChevronDown size={16} className={`profile-chevron ${dropdownOpen ? 'rotated' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-user-info">
                <div className="avatar avatar-lg">{(user?.name?.[0] || 'U').toUpperCase()}</div>
                <div>
                  <div className="dropdown-name">{user?.name}</div>
                  <div className="dropdown-email">{user?.email}</div>
                </div>
              </div>
              <div className="dropdown-divider" />
              <button className="dropdown-item">
                <User size={16} /> Profile Settings
              </button>
              <button className="dropdown-item">
                <Settings size={16} /> Preferences
              </button>
              <div className="dropdown-divider" />
              <button
                className="dropdown-item dropdown-item-danger"
                onClick={handleLogout}
                id="logout-btn"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <TopNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="body-layout">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
