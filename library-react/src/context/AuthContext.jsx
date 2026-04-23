import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../api/services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('session');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (userId, password) => {
    const result = await authService.login(userId, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const loginByRole = async (role, userId) => {
    // For convenience in dev, we can still use this but maybe just call login with high-privilege credentials
    // For now, let's keep it as is or map it to a bypass if needed, but the backend doesn't support this.
    // Better to just let them login manually or provide a mock login if absolutely necessary.
    console.warn('loginByRole is deprecated. Please use real login.');
    return false;
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center',
        background: '#0f172a', color: '#e2e8f0', fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📚</div>
          <p>Loading BiblioTech LMS...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, loginByRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
