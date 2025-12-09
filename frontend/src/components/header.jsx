// import React, { useEffect, useState, useContext } from "react";
// import { Bell, Menu, X } from "lucide-react";
// import '../index.css';
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { AuthContext } from "../context/authContext.jsx";
// import axios from "axios";
// import toast from "react-hot-toast";

// const Header = () => {
//   const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
//   const [isNotificationOpen, setNotificationOpen] = useState(false);
//   const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);

//   const { user, clearUser } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const currentPath = location.pathname;

//   const isAdmin = user?.user?.role === "admin";

//   const toggleProfileDropdown = () => {
//     setProfileDropdownOpen(prev => {
//       if (!prev) setNotificationOpen(false);
//       return !prev;
//     });
//   };

//   const toggleNotification = () => {
//     setNotificationOpen(prev => {
//       if (!prev) setProfileDropdownOpen(false);
//       return !prev;
//     });
//   };

//   const handleLogOut = async () => {
//     try {
//       const response = await axios.post("/users/logout", {}, {
//         withCredentials: true
//       });
//       clearUser();
//       if (response.data.success) {
//         toast.success("Logout Successful");
//        navigate('/')
//       }
//     } catch {
//       toast.error("Logout failed");
//     }
//   };

//   const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const res = await axios.get(`/notification/${user?.user?._id}`, {
//           withCredentials: true
//         });
//         setNotifications(res.data.data.slice(0, 2));
//       } catch (err) {
//         console.error("Failed to fetch notifications", err);
//       }
//     };
//     if (user?.accessToken) fetchNotifications();
//   }, [user]);

//   return (
//     <header className="bg-[#0f172a] shadow-lg sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//         <Link to="/" className="text-3xl font-extrabold text-indigo-500 font-serif tracking-wider cursor-pointer select-none">
//           Skill<span className="text-white">Swap</span>
//         </Link>

//         <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-300">
//           <Link to="/" className={`hover:text-indigo-500 pb-1 transition ${currentPath === "/" ? "border-b-2 border-indigo-500 text-white" : "border-b-2 border-transparent"}`}>Home</Link>

//           {user?.accessToken ? (
//             <>  {/* Authenticated */}
//               {!isAdmin ? (
//                 <>
            
//   <Link to="/explore" className={`hover:text-indigo-500 pb-1 transition ${currentPath === "/explore" ? "border-b-2 border-indigo-500 text-white" : "border-b-2 border-transparent"}`}>Explore</Link>


//                   <Link to="/dashboard" className={`hover:text-indigo-500 pb-1 transition ${currentPath === "/dashboard" ? "border-b-2 border-indigo-500 text-white" : "border-b-2 border-transparent"}`}>Dashboard</Link>
//                   <Link to="/chat" className={`hover:text-indigo-500 pb-1 transition ${currentPath.startsWith("/chat") ? "border-b-2 border-indigo-500 text-white" : "border-b-2 border-transparent"}`}>Message</Link>
//                 </>
//               ) : (
//                 <>
//                   <Link to="/admin/dashboard" className={`hover:text-indigo-500 pb-1 transition ${currentPath === "/admin/dashboard" ? "border-b-2 border-indigo-500 text-white" : "border-b-2 border-transparent"}`}>Admin Dashboard</Link>
//                     <Link to="/admin/category" className={`hover:text-indigo-500 pb-1 transition ${currentPath === "/admin/category" ? "border-b-2 border-indigo-500 text-white" : "border-b-2 border-transparent"}`}>Category</Link>
//                   <Link to="/admin/report" className={`hover:text-indigo-500 pb-1 transition ${currentPath === "/admin/report" ? "border-b-2 border-indigo-500 text-white" : "border-b-2 border-transparent"}`}>Reports</Link>
//                   <Link to="/admin/skill-request" className={`hover:text-indigo-500 pb-1 transition ${currentPath === "/admin/skill-request" ? "border-b-2 border-indigo-500 text-white" : "border-b-2 border-transparent"}`}>Skill Requests</Link>
//                 </>
//               )}

//               {/* Notification & Profile */}
//                <div className="relative cursor-pointer">
//                 <Bell className="w-6 h-6 hover:text-indigo-400 text-gray-300 transition" onClick={toggleNotification} />
//                 {notifications.length > 0 && <span className="absolute top-0 right-0 block w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-[#0f172a]"></span>}
//                 {isNotificationOpen && (
//                   <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl z-20 p-4 text-gray-700 ring-1 ring-gray-300">
//                     <p className="font-semibold text-lg mb-3 border-b border-gray-200 pb-2">Notifications</p>
//                     {notifications.length ? (
//                       <>
//                         {notifications.map(note => (
//                           <div key={note._id} className="text-sm text-gray-600 py-1 border-b last:border-none">{note.message}</div>
//                         ))}
//                         <button onClick={() => { setNotificationOpen(false); navigate("/notifications"); }} className="text-indigo-600 hover:underline text-sm mt-3 w-full text-left">See All →</button>
//                       </>
//                     ) : (
//                       <p className="text-sm text-gray-500">No new notifications.</p>
//                     )}
//                   </div>
//                 )}
//               </div> 

//               <div className="relative cursor-pointer">
//                 <img onClick={toggleProfileDropdown} src={user.user.profileImage} alt="Profile" className="w-10 h-10 rounded-full border-2 border-indigo-500 hover:shadow-lg transition-shadow" />
//                 {isProfileDropdownOpen && (
//                   <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl z-20 ring-1 ring-gray-300">
//                     <div className="px-5 py-3 text-sm text-gray-700 border-b border-gray-200 font-medium">{user.user.email}</div>
//                     <Link to={isAdmin ? "/admin/dashboard" : "/dashboard"} className="block px-5 py-3 hover:bg-indigo-50">Dashboard</Link>
//                     <Link to="/edit-profile" className="block px-5 py-3 hover:bg-indigo-50">Edit Profile</Link>
//                     <button className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50" onClick={handleLogOut}>Logout</button>
//                   </div>
//                 )}
//               </div>
//             </>
//           ) : (
//             <>  {/* Logged out */}
//               <Link to="/explore" className={`hover:text-indigo-500 pb-1 transition ${currentPath === "/explore" ? "border-b-2 border-indigo-500 text-white" : "border-b-2 border-transparent"}`}>Explore</Link>
//               <Link to="/signup" className={`hover:text-indigo-500 pb-1 transition ${currentPath === "/signup" ? "border-b-2 border-indigo-500 text-white" : "border-b-2 border-transparent"}`}>Sign Up</Link>
//             </>

//           )}
//         </nav>

//         <button onClick={toggleMobileMenu} className="md:hidden text-gray-300 hover:text-indigo-400">
//           {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
//         </button>
//       </div>

//       {isMobileMenuOpen && (
//         <div className="md:hidden bg-[#0f172a] px-6 pb-6 shadow-lg text-gray-300 rounded-b-lg">
//           <Link to="/" className={`block py-3 text-base ${currentPath === "/" ? "text-indigo-400 font-bold" : "hover:text-indigo-400"}`}>Home</Link>
//           <Link to="/explore" className={`block py-3 text-base ${currentPath === "/explore" ? "text-indigo-400 font-bold" : "hover:text-indigo-400"}`}>Explore</Link>

//           {user?.accessToken ? (
//             <> {/* Authenticated mobile */}
//               {!isAdmin ? (
//                 <>
//                   <Link to="/dashboard" className={`block py-3 text-base ${currentPath === "/dashboard" ? "text-indigo-400 font-bold" : "hover:text-indigo-400"}`}>Dashboard</Link>
//                   <Link to="/chat" className={`block py-3 text-base ${currentPath.startsWith("/chat") ? "text-indigo-400 font-bold" : "hover:text-indigo-400"}`}>Message</Link>
//                 </>
//               ) : (
//                 <>
//                   <Link to="/admin/dashboard" className={`block py-3 text-base ${currentPath === "/admin/dashboard" ? "text-indigo-400 font-bold" : "hover:text-indigo-400"}`}>Admin Dashboard</Link>
//                   <Link to="/admin/report" className={`block py-3 text-base ${currentPath === "/admin/report" ? "text-indigo-400 font-bold" : "hover:text-indigo-400"}`}>Reports</Link>
//                   <Link to="/admin/skill-request" className={`block py-3 text-base ${currentPath === "/admin/skill-request" ? "text-indigo-400 font-bold" : "hover:text-indigo-400"}`}>Skill Requests</Link>
//                 </>
//               )}
//               <div className="border-t border-indigo-700 my-4"></div>
//               <div className="text-base mb-2 font-semibold">{user.user.email}</div>
//               <Link to="/edit-profile" className="block py-3 text-base hover:text-indigo-400">Edit Profile</Link>
//               <button onClick={handleLogOut} className="block py-3 text-base text-red-500 hover:text-red-600 w-full text-left">Logout</button>
//             </>
//           ) : (
//             <Link to="/signup" className={`block py-3 text-base ${currentPath === "/register" ? "text-indigo-400 font-bold" : "hover:text-indigo-400"}`}>Sign up</Link>
//           )}
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;


/////////////      NEW GPT CODE       ///////////////////////////


import React, { useEffect, useState, useContext } from "react";
import { Bell, Menu, X } from "lucide-react";
import '../index.css';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/authContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";

const Header = () => {
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const { user, clearUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isAdmin = user?.user?.role === "admin";

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(prev => {
      if (!prev) setNotificationOpen(false);
      return !prev;
    });
  };

  const toggleNotification = () => {
    setNotificationOpen(prev => {
      if (!prev) setProfileDropdownOpen(false);
      return !prev;
    });
  };

  const handleLogOut = async () => {
    try {
      const response = await axios.post("/users/logout", {}, {
        withCredentials: true
      });
      clearUser();
      if (response.data.success) {
        toast.success("Logout Successful");
       navigate('/')
      }
    } catch {
      toast.error("Logout failed");
    }
  };

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`/notification/${user?.user?._id}`, {
          withCredentials: true
        });
        setNotifications(res.data.data.slice(0, 2));
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    if (user?.accessToken) fetchNotifications();
  }, [user]);

  return (
    <header className="bg-[#0f172a] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-3xl font-extrabold text-indigo-500 font-serif tracking-wider cursor-pointer select-none">
          Skill<span className="text-white">Swap</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-300">
          <Link to="/" className={`hover:text-indigo-500 pb-1 transition ${currentPath === "/" ? "border-b-2 border-indigo-500 text-white" : "border-b-2 border-transparent"}`}>Home</Link>

          {user?.accessToken ? (
            <>  {/* Authenticated */}
              {!isAdmin ? (
                <>
                  <Link to="/explore" className={`hover:text-indigo-500 pb-1 transition ${currentPath === "/explore" ? "border-b-2 border-indigo-500 text-white" : "border-b-2 border-transparent"}`}>Explore</Link>
                  <Link to="/dashboard" className={`hover:text-indigo-500 pb-1 transition ${currentPath === "/dashboard" ? "border-b-2 border-indigo-500 text-white" : "border-b-2 border-transparent"}`}>Dashboard</Link>
                  <Link to="/chat" className={`hover:text-indigo-500 pb-1 transition ${currentPath.startsWith("/chat") ? "border-b-2 border-indigo-500 text-white" : "border-b-2 border-transparent"}`}>Message</Link>
                </>
              ) : (
                <>
                  <Link to="/admin/dashboard" className={`hover:text-indigo-500 pb-1 transition ${currentPath === "/admin/dashboard" ? "border-b-2 border-indigo-500 text-white" : "border-b-2 border-transparent"}`}>Admin Dashboard</Link>
                  <Link to="/admin/category" className={`hover:text-indigo-500 pb-1 transition ${currentPath === "/admin/category" ? "border-b-2 border-indigo-500 text-white" : "border-b-2 border-transparent"}`}>Category</Link>
                  <Link to="/admin/report" className={`hover:text-indigo-500 pb-1 transition ${currentPath === "/admin/report" ? "border-b-2 border-indigo-500 text-white" : "border-b-2 border-transparent"}`}>Reports</Link>
                  <Link to="/admin/skill-request" className={`hover:text-indigo-500 pb-1 transition ${currentPath === "/admin/skill-request" ? "border-b-2 border-indigo-500 text-white" : "border-b-2 border-transparent"}`}>Skill Requests</Link>
                </>
              )}

              {/* Notification & Profile */}
               <div className="relative cursor-pointer">
                <Bell className="w-6 h-6 hover:text-indigo-400 text-gray-300 transition" onClick={toggleNotification} />
                {notifications.length > 0 && <span className="absolute top-0 right-0 block w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-[#0f172a]"></span>}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl z-20 p-4 text-gray-700 ring-1 ring-gray-300">
                    <p className="font-semibold text-lg mb-3 border-b border-gray-200 pb-2">Notifications</p>
                    {notifications.length ? (
                      <>
                        {notifications.map(note => (
                          <div key={note._id} className="text-sm text-gray-600 py-1 border-b last:border-none">{note.message}</div>
                        ))}
                        <button onClick={() => { setNotificationOpen(false); navigate("/notifications"); }} className="text-indigo-600 hover:underline text-sm mt-3 w-full text-left">See All →</button>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">No new notifications.</p>
                    )}
                  </div>
                )}
              </div> 

              <div className="relative cursor-pointer">
                <img 
                  onClick={toggleProfileDropdown} 
                  src={user.user.profileImage?.trim() ? user.user.profileImage : "/default-profile.png"} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full border-2 border-indigo-500 hover:shadow-lg transition" 
                />
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl z-20 ring-1 ring-gray-300">
                    <div className="px-5 py-3 text-sm text-gray-700 border-b border-gray-200 font-medium">{user.user.email}</div>
                    <Link to={isAdmin ? "/admin/dashboard" : "/dashboard"} className="block px-5 py-3 hover:bg-indigo-50">Dashboard</Link>
                    <Link to="/edit-profile" className="block px-5 py-3 hover:bg-indigo-50">Edit Profile</Link>
                    <button className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50" onClick={handleLogOut}>Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>  {/* Logged out */}
              <Link to="/explore" className={`hover:text-indigo-500 pb-1 transition ${currentPath === "/explore" ? "border-b-2 border-indigo-500 text-white" : "border-b-2 border-transparent"}`}>Explore</Link>
              <Link to="/signup" className={`hover:text-indigo-500 pb-1 transition ${currentPath === "/signup" ? "border-b-2 border-indigo-500 text-white" : "border-b-2 border-transparent"}`}>Sign Up</Link>
            </>
          )}
        </nav>

        <button onClick={toggleMobileMenu} className="md:hidden text-gray-300 hover:text-indigo-400">
          {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0f172a] px-6 pb-6 shadow-lg text-gray-300 rounded-b-lg">
          <Link to="/" className={`block py-3 text-base ${currentPath === "/" ? "text-indigo-400 font-bold" : "hover:text-indigo-400"}`}>Home</Link>
          <Link to="/explore" className={`block py-3 text-base ${currentPath === "/explore" ? "text-indigo-400 font-bold" : "hover:text-indigo-400"}`}>Explore</Link>

          {user?.accessToken ? (
            <> {/* Authenticated mobile */}
              {!isAdmin ? (
                <>
                  <Link to="/dashboard" className={`block py-3 text-base ${currentPath === "/dashboard" ? "text-indigo-400 font-bold" : "hover:text-indigo-400"}`}>Dashboard</Link>
                  <Link to="/chat" className={`block py-3 text-base ${currentPath.startsWith("/chat") ? "text-indigo-400 font-bold" : "hover:text-indigo-400"}`}>Message</Link>
                </>
              ) : (
                <>
                  <Link to="/admin/dashboard" className={`block py-3 text-base ${currentPath === "/admin/dashboard" ? "text-indigo-400 font-bold" : "hover:text-indigo-400"}`}>Admin Dashboard</Link>
                  <Link to="/admin/report" className={`block py-3 text-base ${currentPath === "/admin/report" ? "text-indigo-400 font-bold" : "hover:text-indigo-400"}`}>Reports</Link>
                  <Link to="/admin/skill-request" className={`block py-3 text-base ${currentPath === "/admin/skill-request" ? "text-indigo-400 font-bold" : "hover:text-indigo-400"}`}>Skill Requests</Link>
                </>
              )}
              <div className="border-t border-indigo-700 my-4"></div>
              <div className="text-base mb-2 font-semibold">{user.user.email}</div>
              <Link to="/edit-profile" className="block py-3 text-base hover:text-indigo-400">Edit Profile</Link>
              <button onClick={handleLogOut} className="block py-3 text-base text-red-500 hover:text-red-600 w-full text-left">Logout</button>
            </>
          ) : (
            <Link to="/signup" className={`block py-3 text-base ${currentPath === "/register" ? "text-indigo-400 font-bold" : "hover:text-indigo-400"}`}>Sign up</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
