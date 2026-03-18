import React, { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const PageFallback = () => (
  <div className="flex-1 flex items-center justify-center min-h-[60vh]">
    <Loader2 className="w-10 h-10 text-accent animate-spin" />
  </div>
);

const Layout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text transition-colors duration-300">
      <Navbar />

      {/* 
        The main content wrapper. 
        pt-[80px] ensures content is not hidden behind the fixed Navbar.
      */}
      <main className="flex-1 w-full flex flex-col pt-[80px]">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
