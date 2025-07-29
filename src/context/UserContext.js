'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const defaultUser = {
  email: '',
  isLogin: false,
  isReport: false,
  name: '',
  patient_id: null,
  role: '',
  userId: null,
};


export function UserProvider({ children }) {
  const [user, setUser] = useState(defaultUser);

  // Optional: Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Optional: Save user to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
