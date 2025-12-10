// src/components/ProtectedRoute.jsx
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import LoaderComp from './loader';
import { AuthContext } from '../context/authContext';

const ProtectedRoute = ({ children }) => {
  const {user,clearUser} = useContext(AuthContext)
  const [auth, setAuth] = useState(null); // null = loading, true/false = result
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/users/check-auth', {
          withCredentials: true,
        });
        setAuth(response.data.success); // assume success = true if authenticated
        if(response.data.success){
        }else{
            clearUser()
        }
      } catch (error) {
        setAuth(false);
        clearUser()
      }
    };

    checkAuth();
  }, []);
  // ⏳ Show loading while checking auth
  if (auth === null) {
    return <LoaderComp/>;
  }

  // 🏠 Allow public access to home page
  if (location.pathname === '/') {
    return children;
  }

  // 🔐 Redirect if not authenticated
  // if (!auth) {
  //   return <Navigate to="/signin" replace />;
  // }

  // ✅ Authenticated → render children
  return children;
};

export default ProtectedRoute;


//////    NEW    CODE    GPT      /////////
// src/components/ProtectedRoute.jsx
// import React, { useContext, useEffect, useState } from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import LoaderComp from './loader';
// import { AuthContext } from '../context/authContext';

// const ProtectedRoute = ({ children }) => {
//   const { user, clearUser } = useContext(AuthContext);
//   const [auth, setAuth] = useState(null); // null = loading, true/false = result
//   const location = useLocation();

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const response = await axios.get('/users/check-auth', {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${user?.accessToken || ''}` // safely send token if available
//           }
//         });

//         if (response.data.success) {
//           setAuth(true);
//         } else {
//           setAuth(false);
//           clearUser();
//         }
//       } catch (error) {
//         setAuth(false);
//         clearUser();
//       }
//     };

//     checkAuth();
//   }, [user, clearUser]);

//   // ⏳ Show loader while checking auth
//   if (auth === null) {
//     return <LoaderComp />;
//   }

//   // 🏠 Allow public access to home page
//   if (location.pathname === '/') {
//     return children;
//   }

//   // 🔐 Redirect if not authenticated
//   if (!auth) {
//     return <Navigate to="/signin" replace />;
//   }

//   // ✅ Authenticated → render children
//   return children;
// };

// export default ProtectedRoute;
