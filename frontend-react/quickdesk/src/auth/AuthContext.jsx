import React, { createContext, useContext, useEffect, useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await API.get('/auth/users/me/');
      setUser({
        ...response.data,
        role: response.data.role ||  'user',
      });
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) fetchUser();
    else setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await API.post('/auth/jwt/create/', { username, password });
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      await fetchUser();
      return true;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
    navigate('/login');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};