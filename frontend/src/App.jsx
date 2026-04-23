import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute, AdminRoute, PublicRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Finance from './pages/Finance';
import Invoices from './pages/Invoices';
import Inventory from './pages/Inventory';
import AIPredictions from './pages/AIPredictions';
import Recommendations from './pages/Recommendations';
import AdminUsers from './pages/AdminUsers';
import AccessDenied from './pages/AccessDenied';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/ai-predictions" element={<AIPredictions />} />
              <Route path="/recommendations" element={<Recommendations />} />
            </Route>
          </Route>
          <Route element={<AdminRoute />}>
            <Route element={<Layout />}>
              <Route path="/users" element={<AdminUsers />} />
            </Route>
          </Route>
          <Route element={<Layout />}>
            <Route path="/access-denied" element={<AccessDenied />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
