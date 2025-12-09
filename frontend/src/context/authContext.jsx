// import React, { createContext, useState, useEffect } from 'react';
// import { io} from 'socket.io-client';

// import axios from 'axios';

// axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URI;


// console.log('======AUTH ENV===',import.meta.VITE_BACKEND_URI)
// console.log('======AUTH ENV VITE_SOCKET_URI ===',import.meta.VITE_SOCKET_URI)


// export const socket = io(import.meta.env.VITE_SOCKET_URI);

// // Create the AuthContext
// export const AuthContext = createContext();

// // AuthProvider component to wrap around the app
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     // Retrieve user data from localStorage if available
//     const storedUser = localStorage.getItem('user');
//     return storedUser ? JSON.parse(storedUser) : null;
//   });

//   // Function to update user state and localStorage
// const updateUser = (userData) => {
//     setUser(userData);
//     localStorage.setItem('user', JSON.stringify(userData));
//   };

// const updateUserField = (userData) => {
//   setUser((prev) => {
//     const updated = { ...prev, ...userData };
//     localStorage.setItem('user', JSON.stringify(updated));
//     return updated;
//   });
// };

//   // Function to clear user data (e.g., on logout)
// const clearUser = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//   };

//   return (
//     <AuthContext.Provider value={{ user, updateUser, clearUser , updateUserField}}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

////////  NEW    GPT     CODE      ///////////////////////////

import React, { createContext, useState } from 'react';
import { io } from 'socket.io-client';
import axios from './axios'; // use your axios file

export const socket = io(import.meta.env.VITE_SOCKET_URI);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const updateUserField = (fields) => {
    setUser(prev => {
      const updated = { ...prev, ...fields };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');  // <-- ADD THIS
  };

  return (
    <AuthContext.Provider value={{ user, updateUser, clearUser, updateUserField }}>
      {children}
    </AuthContext.Provider>
  );
};


