import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, ShoppingCart, DollarSign,
  Store, Bell, HeadphonesIcon, Star, Megaphone, Search, LogOut,
  ExternalLink, Zap, Menu, ChevronLeft, ChevronRight, TrendingUp,
  CreditCard, RotateCcw
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useSellerStore from '../store/useSellerStore';

const NAV_SECTIONS = [
  {
    title: 'Overview',
    items: [
      { to: '/seller', icon: <LayoutDashboard size={18} />, label: 'Dashboard', end: true },
    ],
  },
  {
    title: 'Products',
    items: [
      { to: '/seller/sourcing', icon: <Search size={18} />, label: 'Find Products' },
      { to: '/seller/products', icon: <Package size={18} />, label: 'My Products' },
    ],
  },
  {
    title: 'Business',
    items: [
      { to: '/seller/orders', icon: <ShoppingCart size={18} />, label: 'Orders' },
      { to: '/seller/returns', icon: <RotateCcw size={18} />, label: 'Returns & Refunds' },
      { to: '/seller/earnings', icon: <DollarSign size={18} />, label: 'Earnings' },
      { to: '/seller/payments', icon: <CreditCard size={18} />, label: 'Payment History' },
    ],
  },
  {
    title: 'Grow',
    items: [
      { to: '/seller/reviews', icon: <Star size={18} />, label: 'Reviews' },
      { to: '/seller/marketing', icon: <Megaphone size={18} />, label: 'Marketing' },
    ],
  },
  {
    title: 'Account',
    items: [
      { to: '/seller/store', icon: <Store size={18} />, label: 'Store Settings' },
      { to: '/seller/notifications', icon: <Bell size={18} />, label: 'Notifications' },
      { to: '/seller/support', icon: <HeadphonesIcon size={18} />, label: 'Support' },
    ],
  },
];

const SellerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { store, notifications } = useSellerStore();
  const navigate = useNavigate();
  const unread = notifications?.filter(n => !n.read).length || 0;

  const handleLogout = () => { logout(); navigate('/auth/login'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-4 border-b border-emerald-700/30 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
          <TrendingUp size={17} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="font-bold text-white text-sm leading-tight truncate max-w-[140px]">{store?.name || user?.displayName || 'My Store'}</div>
            <div className="text-[10px] text-emerald-400 font-medium uppercase tracking-widest">Seller Panel</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5 no-scrollbar">
        {NAV_SECTIONS.map(section => (
          <div key={section.title}>
            {!collapsed && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-2">{section.title}</p>
            )}
            <div className="space-y-0.5">
              {section.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                      isActive
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                    } ${collapsed ? 'justify-center' : ''}`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && item.label === 'Notifications' && unread > 0 && (
                    <span className="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">{unread}</span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700/50 p-3 space-y-1">
        <a href="/" target="_blank" rel="noreferrer" className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all ${collapsed ? 'justify-center' : ''}`}>
          <ExternalLink size={16} />
          {!collapsed && <span>View Storefront</span>}
        </a>
        <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}>
          <LogOut size={16} />
          {!collapsed && <span>Sign Out</span>}
        </button>
        {!collapsed && (
          <div className="mt-3 flex items-center gap-3 px-3 py-2.5 bg-slate-700/40 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.displayName?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-white truncate">{user?.displayName || 'Seller'}</div>
              <div className="text-[11px] text-slate-400 truncate">{user?.email || ''}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col flex-shrink-0 bg-slate-800/80 border-r border-slate-700/50 transition-all duration-300 relative ${collapsed ? 'w-16' : 'w-64'}`}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-600 border border-slate-500 flex items-center justify-center text-slate-300 hover:bg-slate-500 transition-all z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-10 w-64 bg-slate-800 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex-shrink-0 h-16 bg-slate-800/60 border-b border-slate-700/50 flex items-center px-4 lg:px-6 gap-4 backdrop-blur-sm">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-slate-400 hover:text-white transition-colors">
            <Menu size={20} />
          </button>
          <div className="flex-1 hidden sm:block">
            <div className="text-sm font-medium text-emerald-400">Welcome back, {user?.displayName?.split(' ')[0] || 'Seller'} 👋</div>
            <div className="text-xs text-slate-500">Manage your store and grow your business</div>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <NavLink to="/seller/notifications" className="relative w-9 h-9 rounded-xl bg-slate-700/60 border border-slate-600/40 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Bell size={17} />
              {unread > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">{unread}</span>}
            </NavLink>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:opacity-90 transition-opacity">
              {user?.displayName?.charAt(0)?.toUpperCase() || 'S'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
