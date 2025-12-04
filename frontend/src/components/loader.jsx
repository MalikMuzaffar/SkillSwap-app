import React from 'react';
import { Loader } from 'lucide-react';

const LoaderComp = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <Loader className="h-10 w-10 text-indigo-600 animate-spin" />
        <p className="text-sm text-gray-600">Loading, please wait...</p>
      </div>
    </div>
  );
};

export default LoaderComp;
