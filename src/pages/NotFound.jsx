import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Zap } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[90vh] flex items-center justify-center py-16 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 dark:opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="text-center relative z-10 animate-fade-in-up">
        {/* 404 Number */}
        <div className="relative mb-6 inline-block">
          <div className="text-[9rem] sm:text-[12rem] font-display font-black leading-none select-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-accent via-purple-500 to-pink-500">
              404
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center animate-spin-slow">
              <Zap size={32} className="text-accent" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
          Page not found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto mb-10 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="btn-primary h-12 px-8 flex items-center gap-2 shadow-glow">
            <Home size={18} /> Back to Home
          </Link>
          <Link to="/category/all" className="btn-secondary h-12 px-8 flex items-center gap-2">
            <Search size={18} /> Browse Products
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-400">
          Or go <button onClick={() => window.history.back()} className="text-accent hover:underline font-medium">back to previous page</button>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
