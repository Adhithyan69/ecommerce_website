import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, Heart, X, LogOut } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useCartStore from '../../store/useCartStore';
import SearchModal from './SearchModal';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const { user, isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();
  
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Listen to scroll events for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-dark-bg/80 backdrop-blur-lg shadow-sm border-b border-gray-200 dark:border-dark-border py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-gray-700 dark:text-gray-300 hover:text-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="text-2xl font-display font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center">A</span>
              Anti-Gravity
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/category/new" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-accent dark:hover:text-accent transition-colors">New Arrivals</Link>
            <Link to="/category/electronics" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-accent dark:hover:text-accent transition-colors">Electronics</Link>
            <Link to="/category/fashion" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-accent dark:hover:text-accent transition-colors">Fashion</Link>
            <Link to="/offers" className="text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1">
              Offers 
              <span className="px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[10px] font-bold">SALE</span>
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-gray-700 dark:text-gray-300 hover:text-accent transition-colors hidden sm:block"
            >
              <Search size={20} />
            </button>
            <Link to="/wishlist" className="text-gray-700 dark:text-gray-300 hover:text-accent transition-colors hidden sm:block">
              <Heart size={20} />
            </Link>
            <Link to="/cart" className="relative text-gray-700 dark:text-gray-300 hover:text-accent transition-colors">
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-accent text-white text-xs font-bold shadow-sm ring-2 ring-white dark:ring-dark-bg">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative hidden sm:block">
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 border border-accent/20 text-accent transition-colors overflow-hidden"
                >
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold">{(user?.displayName || user?.email || 'U')[0].toUpperCase()}</span>
                  )}
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-xl shadow-lg border border-gray-100 dark:border-dark-border py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-dark-border">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.displayName}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link to="/user/dashboard" onClick={() => setIsProfileDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-bg">Dashboard</Link>
                    <Link to="/orders" onClick={() => setIsProfileDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-bg">Orders</Link>
                    <button 
                      onClick={() => { setIsProfileDropdownOpen(false); logout(); }}
                      className="w-full text-left px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 flex items-center gap-2"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth/login" className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-border transition-colors">
                <User size={18} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-y-0 left-0 w-3/4 max-w-sm bg-white dark:bg-dark-card shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="p-5 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
            <Link to="/" className="text-xl font-display font-bold text-gray-900 dark:text-white">Anti-Gravity</Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              <X size={20} />
            </button>
          </div>
          <div className="p-5 flex flex-col gap-4">
            <div className="relative mb-4">
              <input type="text" placeholder="Search products..." className="input-field pl-10 py-2.5 text-sm" />
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>
            <Link to="/category/new" className="py-2 text-gray-800 dark:text-gray-200 font-medium">New Arrivals</Link>
            <Link to="/category/electronics" className="py-2 text-gray-800 dark:text-gray-200 font-medium">Electronics</Link>
            <Link to="/category/fashion" className="py-2 text-gray-800 dark:text-gray-200 font-medium">Fashion</Link>
            <div className="h-px bg-gray-100 dark:bg-dark-border my-2"></div>
            {isAuthenticated ? (
              <>
                <Link to="/user/dashboard" className="py-2 text-gray-800 dark:text-gray-200 font-medium flex items-center gap-2">
                  <User size={18} /> My Dashboard
                </Link>
                <button onClick={logout} className="py-2 text-rose-500 font-medium flex items-center gap-2 text-left">
                  <LogOut size={18} /> Sign Out
                </button>
              </>
            ) : (
              <Link to="/auth/login" className="py-2 text-gray-800 dark:text-gray-200 font-medium flex items-center gap-2">
                <User size={18} /> Sign In / Register
              </Link>
            )}
            <Link to="/wishlist" className="py-2 text-gray-800 dark:text-gray-200 font-medium flex items-center gap-2">
              <Heart size={18} /> Wishlist
            </Link>
          </div>
        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

    </header>
  );
};

export default Navbar;
