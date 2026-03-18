import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border pt-16 pb-8 transition-colors duration-300">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & About */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-display font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center">A</span>
              Anti-Gravity
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Your ultimate destination for premium dropshipped products. Curated collections, exclusive deals, and seamless shopping experience.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-border flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-accent hover:text-white dark:hover:bg-accent dark:hover:text-white transition-all">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-border flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-accent hover:text-white dark:hover:bg-accent dark:hover:text-white transition-all">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-border flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-accent hover:text-white dark:hover:bg-accent dark:hover:text-white transition-all">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-border flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-accent hover:text-white dark:hover:bg-accent dark:hover:text-white transition-all">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/about" className="hover:text-accent dark:hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-accent dark:hover:text-accent transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-accent dark:hover:text-accent transition-colors">FAQ & Help Center</Link></li>
              <li><Link to="/returns" className="hover:text-accent dark:hover:text-accent transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/shipping" className="hover:text-accent dark:hover:text-accent transition-colors">Shipping Policy</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-6">Top Categories</h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/category/new" className="hover:text-accent dark:hover:text-accent transition-colors">New Arrivals</Link></li>
              <li><Link to="/category/electronics" className="hover:text-accent dark:hover:text-accent transition-colors">Electronics</Link></li>
              <li><Link to="/category/fashion" className="hover:text-accent dark:hover:text-accent transition-colors">Trending Fashion</Link></li>
              <li><Link to="/category/home" className="hover:text-accent dark:hover:text-accent transition-colors">Home & Living</Link></li>
              <li><Link to="/offers" className="hover:text-accent dark:hover:text-accent transition-colors">Special Offers</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-6">Get In Touch</h3>
            <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                <span>123 Innovation Drive, Tech Valley, CA 94043, USA</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-accent shrink-0" />
                <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-accent shrink-0" />
                <span>support@antigravity.sh</span>
              </li>
            </ul>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Subscribe to our newsletter</h4>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="input-field rounded-r-none border-r-0 focus:ring-0 focus:border-gray-300 dark:focus:border-dark-border"
                  required
                />
                <button type="submit" className="btn-primary rounded-l-none px-4">
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 dark:border-dark-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Anti-Gravity E-Commerce. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
