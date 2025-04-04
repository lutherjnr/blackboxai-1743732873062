import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get('/api/auth/token/verify/', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.status === 200) {
            await fetchUserProfile();
          }
        }
      } catch (err) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get('/api/auth/profile/');
      setUser(res.data);
    } catch (err) {
      logout();
    }
  };

  const login = async (credentials) => {
    try {
      const res = await axios.post('/api/auth/token/', credentials);
      localStorage.setItem('token', res.data.access);
      await fetchUserProfile();
      navigate(user?.role === 'ADMIN' ? '/admin' : '/transactions');
      toast.success('Logged in successfully');
    } catch (err) {
      toast.error('Invalid credentials');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};