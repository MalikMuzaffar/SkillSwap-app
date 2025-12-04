// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <h1 className="text-7xl font-bold text-indigo-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
