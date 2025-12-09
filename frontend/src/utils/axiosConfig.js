// // src/utils/axiosConfig.js
// import axios from 'axios';
// import { getUserToken } from './authHelpers'; // optional helper to get token

// const instance = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_URI,
//   withCredentials: true // for cookie-based auth
// });

// // Automatically attach token if available
// instance.interceptors.request.use(
//   config => {
//     const token = getUserToken(); // or get from AuthContext
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => Promise.reject(error)
// );

// export default instance;



// src/utils/axiosConfig.js
// import axios from 'axios';

// // Create an axios instance
// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_URI, // your backend URL from .env
//   withCredentials: true, // send cookies
// });

// // Optional: Add Authorization header automatically if you store token in localStorage
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token'); // adjust key if needed
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default axiosInstance;
