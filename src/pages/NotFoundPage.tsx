import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-7xl font-display font-bold text-primary-500 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Page Not Found</h2>
      <p className="text-gray-400 max-w-lg mx-auto mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Link
          to="/"
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Home size={18} />
          <span>Go Home</span>
        </Link>
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;