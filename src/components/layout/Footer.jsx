import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, ArrowRight, Zap } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const QUICK_LINKS = [
    { to: '/category/new', label: 'New Arrivals' },
    { to: '/category/electronics', label: 'Electronics' },
    { to: '/category/fashion', label: 'Trending Fashion' },
    { to: '/category/home', label: 'Home & Living' },
    { to: '/offers', label: '🔥 Special Offers' },
  ];

  const SUPPORT_LINKS = [
    { to: '/support', label: 'Help Center' },
    { to: '/user/orders', label: 'Track Order' },
    { to: '/user/complaints', label: 'Support Tickets' },
    { to: '/returns', label: 'Returns & Refunds' },
    { to: '/shipping', label: 'Shipping Policy' },
  ];

  const SOCIALS = [
    { icon: <Facebook size={16} />, href: '#', label: 'Facebook' },
    { icon: <Twitter size={16} />, href: '#', label: 'Twitter' },
    { icon: <Instagram size={16} />, href: '#', label: 'Instagram' },
    { icon: <Youtube size={16} />, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-8 border-t border-gray-800 md:mb-0 mb-16">
      <div className="container-custom">

        {/* Top Banner */}
        <div className="bg-gradient-to-r from-accent/20 to-purple-600/20 border border-accent/20 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">Get ₹200 off your first order</h3>
            <p className="text-gray-400 text-sm">Subscribe to our newsletter for exclusive deals and early access to new arrivals.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 md:w-60 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
              required
            />
            <button type="submit" className="btn-primary px-5 py-2.5 flex items-center gap-2 whitespace-nowrap ripple">
              {subscribed ? '✓ Subscribed!' : <><Zap size={14} /> Subscribe</>}
            </button>
          </form>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="text-2xl font-display font-bold tracking-tight text-white flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent to-purple-500 text-white flex items-center justify-center text-base font-black shadow-lg shadow-accent/30">A</span>
              Anti-Gravity
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your ultimate destination for premium curated products. Delivered directly from top verified suppliers worldwide.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {SOCIALS.map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-accent hover:text-white hover:border-accent transition-all duration-200 hover:-translate-y-0.5"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Shop</h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all text-accent" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all text-accent" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={14} className="text-accent" />
                </div>
                <span className="text-sm text-gray-500 leading-relaxed">123 Innovation Drive, Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={14} className="text-accent" />
                </div>
                <span className="text-sm text-gray-500">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={14} className="text-accent" />
                </div>
                <span className="text-sm text-gray-500">support@antigravity.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600 text-center sm:text-left">
            © {new Date().getFullYear()} Anti-Gravity. Made with ❤️ in India. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-gray-600">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(link => (
              <Link key={link} to="#" className="hover:text-gray-400 transition-colors">{link}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
