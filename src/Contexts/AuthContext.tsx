// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  role: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [user, setUser] = useState<User | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
   const token = localStorage.getItem('token')
   if (!token) {
      setUser(null)
      setLoading(false)
      return
   }

   axios.get<User>('/auth/me')
      .then(res => {
         setUser(res.data)
      })
      .catch(() => {
         setUser(null)
      })
      .finally(() => {
         setLoading(false)
      })
   }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
