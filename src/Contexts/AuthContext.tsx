// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { api, getMe } from '../API/api';    // import thêm helper getMe()
import type { AxiosError } from 'axios';

interface User {
  id:    string;
  name:  string;
  email: string;
  phone: string;
  role:  string;
}

interface AuthContextValue {
  user:    User | null;
  loading: boolean;
  login:   (token: string) => void;
  logout:  () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  user:    null,
  loading: true,
  login:   () => {},
  logout:  () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token,   setToken]   = useState<string | null>(
    localStorage.getItem('token')
  );

  // logout helper để tái sử dụng
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  // Khi token thay đổi → set header + fetch profile
  useEffect(() => {
    if (!token) {
      // không có token thì chắc chắn logout
      logout();
      setLoading(false);
      return;
    }

    // 1) Gắn header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setLoading(true);

    // 2) Fetch profile qua helper getMe()
    (async () => {
      try {
        const profile = await getMe();
        setUser(profile);
      //   console.log('[Auth] Profile fetched:', profile);
      } catch (err) {
        console.error('Fetch profile error:', err);
        // 401 hoặc không xác thực thì logout
        const axiosErr = err as AxiosError;
        if (axiosErr.response?.status === 401) {
          logout();
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  // login: lưu token mới và trigger effect
  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
