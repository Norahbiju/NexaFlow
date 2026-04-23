import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('nexaflow_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch (_) {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    // Try real backend login endpoint
    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        const userData = {
          email,
          role: data.role || role,
          name: data.name || email.split('@')[0],
          token: data.access_token || data.token,
        };
        persist(userData);
        return { success: true };
      }
    } catch (_) {
      // Backend unavailable — use mock auth (demo mode)
    }

    // Mock auth fallback — accepts any credentials
    const mockToken = btoa(`${email}:${role}:${Date.now()}`);
    const userData = {
      email,
      role,
      name: role === 'admin' ? 'Admin User' : email.split('@')[0],
      token: mockToken,
    };
    persist(userData);
    return { success: true };
  };

  const persist = (userData) => {
    localStorage.setItem('nexaflow_token', userData.token);
    localStorage.setItem('nexaflow_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('nexaflow_token');
    localStorage.removeItem('nexaflow_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
