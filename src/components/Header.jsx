import React, { useState, useEffect, useRef } from "react";
import { Search, Heart, ShoppingCart, LayoutGrid, X, Menu } from "lucide-react";
import { Link } from 'react-router-dom';
import { useCart } from '../viewmodels/CartContext';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dropdownRef = useRef(null);
  const drawerRef = useRef(null);

  // Effect to handle clicks outside the user dropdown
  // and mobile drawer
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      // Also close the drawer if clicking outside of it
      if (isDrawerOpen && drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsDrawerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDrawerOpen, isDropdownOpen]); // Add isDropdownOpen to dependency array

  const { count } = useCart();
  return (
    <header className="bg-[#171d27] shadow-md fixed top-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between p-4 gap-4">
        <div className="flex items-center gap-4">
          {/* Mobile Drawer Menu Icon */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="text-gray-300 hover:text-white md:hidden"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-white">AN Shopy</h1>
        </div>
        
        {/* Desktop Search Bar & Navigation */}
        <div className="hidden md:flex items-center gap-6 flex-grow">
          <div className="relative flex-grow max-w-sm">
            <input 
              type="text" 
              placeholder="Search for products..." 
              className="w-full pl-10 pr-4 py-1 rounded-lg border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <nav className="flex gap-6 text-gray-300">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/category" className="hover:text-white">Shop</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
          </nav>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          {/* Mobile Search Icon */}
          <button className="text-gray-300 hover:text-white md:hidden">
            <Search size={22} />
          </button>
          <button className="text-gray-300 hover:text-white">
            <Heart size={22} />
          </button>
          <Link to="/cart" className="relative text-gray-300 hover:text-white hidden md:block">
            <ShoppingCart size={22} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">{count}</span>
            )}
          </Link>

          {/* Desktop User Icon and Dropdown */}
          <div className="relative hidden md:block" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-gray-300 hover:text-white"
            >
              <LayoutGrid size={22} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Account</Link>
                <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</Link>
                <Link to="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">About Us</Link>
                <Link to="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Contact Us</Link>
                <Link to="/return-policy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Return Policy</Link>
                <div className="border-t border-gray-100 my-1"></div>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold text-lg">Menu</h2>
          <button onClick={() => setIsDrawerOpen(false)} className="text-gray-600 hover:text-accent">
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-2">
          <Link to="/account" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">My Account</Link>
          <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Orders</Link>
          <Link to="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">About Us</Link>
          <Link to="/contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Contact Us</Link>
          <Link to="/return-policy" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Return Policy</Link>
          <div className="border-t border-gray-200 pt-2 mt-2"></div>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Logout</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
