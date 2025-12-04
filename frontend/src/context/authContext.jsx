import React, { createContext, useState, useEffect } from 'react';
import { io} from 'socket.io-client';

import axios from 'axios';

axios.defaults.baseURL = 'https://skillswap-backend-ta8t.onrender.com';

export const socket = io("https://skillswap-backend-ta8t.onrender.com");

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component to wrap around the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve user data from localStorage if available
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Function to update user state and localStorage
const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

const updateUserField = (userData) => {
  setUser((prev) => {
    const updated = { ...prev, ...userData };
    localStorage.setItem('user', JSON.stringify(updated));
    return updated;
  });
};

  // Function to clear user data (e.g., on logout)
const clearUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, updateUser, clearUser , updateUserField}}>
      {children}
    </AuthContext.Provider>
  );
};

