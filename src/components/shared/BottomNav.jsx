import React from 'react';
import { Home, Search, Heart, ShoppingCart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';
import useWishlistStore from '../../store/useWishlistStore';
import useAuthStore from '../../store/useAuthStore';

const BottomNav = () => {
  const location = useLocation();
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const cartCount = (cartItems || []).reduce((acc, item) => acc + (item.quantity || 1), 0);
  const wishCount = (wishlistItems || []).length;

  const navItems = [
    { icon: <Home size={22} />, label: 'Home', path: '/' },
    { icon: <Search size={22} />, label: 'Search', path: '/category/all' },
    { icon: <Heart size={22} />, label: 'Wishlist', path: '/wishlist', badge: wishCount },
    { icon: <ShoppingCart size={22} />, label: 'Cart', path: '/cart', badge: cartCount },
    { icon: <User size={22} />, label: 'Profile', path: isAuthenticated ? '/dashboard' : '/auth/login' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border z-50 md:hidden pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-accent' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <div className="relative">
                {item.icon}
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-dark-card">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium leading-none ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
