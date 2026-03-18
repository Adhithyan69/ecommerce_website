import React from 'react';
import { Home, ClipboardList, ShoppingCart, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../viewmodels/CartContext';
import './BottomNav.css';

const BottomNav = () => {
  const { count } = useCart();
  const linkClass = ({ isActive }) => `bottom-nav__link ${isActive ? 'bottom-nav__link--active' : ''}`;
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={linkClass} end>
        <Home className="bottom-nav__icon" />
        <span className="bottom-nav__text">Home</span>
      </NavLink>
      <NavLink to="/orders" className={linkClass}>
        <ClipboardList className="bottom-nav__icon" />
        <span className="bottom-nav__text">Orders</span>
      </NavLink>
      <NavLink to="/cart" className={linkClass}>
        <div className="relative">
          <ShoppingCart className="bottom-nav__icon" />
          {count > 0 && (
            <span className="absolute -top-2 -right-3 bg-accent text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center">{count}</span>
          )}
        </div>
        <span className="bottom-nav__text">Cart</span>
      </NavLink>
      <NavLink to="/account" className={linkClass}>
        <User className="bottom-nav__icon" />
        <span className="bottom-nav__text">Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;