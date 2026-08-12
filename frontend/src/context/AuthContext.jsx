import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('difi_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await api.auth.getMe();
      setUser(data.user);
      setContributions(data.contributions || []);
      setLoans(data.loans || []);
    } catch (err) {
      console.error('Failed to fetch user state:', err);
      localStorage.removeItem('difi_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email, password) => {
    const data = await api.auth.login(email, password);
    localStorage.setItem('difi_token', data.token);
    setUser(data.user);
    showNotification(`Welcome back, ${data.user.username}!`);
    await refreshUser();
    return data;
  };

  const register = async (payload) => {
    const data = await api.auth.register(payload);
    showNotification('Account created successfully! Please login.');
    return data;
  };

  const logout = () => {
    localStorage.removeItem('difi_token');
    setUser(null);
    setContributions([]);
    setLoans([]);
    showNotification('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        contributions,
        loans,
        loading,
        notification,
        showNotification,
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
