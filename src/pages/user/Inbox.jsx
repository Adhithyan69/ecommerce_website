import React from 'react';
import { Bell, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Inbox = () => {
  return (
    <div className="container-custom py-12 pb-24">
      <div className="mb-8">
        <Link to="/user/dashboard" className="text-sm text-gray-500 hover:text-accent flex items-center gap-1 mb-2">
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Inbox</h1>
      </div>
      <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-dark-bg rounded-full flex items-center justify-center text-gray-400 mb-4"><Bell size={32} /></div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">All Caught Up!</h2>
        <p className="text-gray-500">You have no new notifications or messages at this time.</p>
      </div>
    </div>
  );
};

export default Inbox;