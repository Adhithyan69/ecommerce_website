import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, MessageSquare, Tag, Image,
  BarChart3, Bell, Shield, Grid3X3, Star, ChevronLeft, ChevronRight,
  LogOut, ExternalLink, Zap, Menu, ClipboardCheck
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const NAV_SECTIONS = [
  {
    title: 'Overview',
    items: [
      { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard', end: true },
      { to: '/admin/analytics', icon: <BarChart3 size={18} />, label: 'Analytics' },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { to: '/admin/products', icon: <Package size={18} />, label: 'Products' },
      { to: '/admin/product-requests', icon: <ClipboardCheck size={18} />, label: 'Product Requests', badge: 3 },
      { to: '/admin/categories', icon: <Grid3X3 size={18} />, label: 'Categories' },
      { to: '/admin/reviews', icon: <Star size={18} />, label: 'Reviews' },
    ],
  },
  {
    title: 'Commerce',
    items: [
      { to: '/admin/orders', icon: <ShoppingCart size={18} />, label: 'Orders' },
      { to: '/admin/coupons', icon: <Tag size={18} />, label: 'Coupons' },
    ],
  },
  {
    title: 'Users',
    items: [
      { to: '/admin/users', icon: <Users size={18} />, label: 'Users' },
      { to: '/admin/complaints', icon: <MessageSquare size={18} />, label: 'Support' },
    ],
  },
  {
    title: 'Content',
    items: [
      { to: '/admin/banners', icon: <Image size={18} />, label: 'Banners' },
      { to: '/admin/notifications', icon: <Bell size={18} />, label: 'Notifications' },
    ],
  },
  {
    title: 'System',
    items: [
      { to: '/admin/roles', icon: <Shield size={18} />, label: 'Roles & Access' },
    ],
  },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/auth/login'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-4 border-b border-slate-700/50 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
          <Zap size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="font-display font-bold text-white text-sm leading-tight">Anti-Gravity</div>
            <div className="text-[10px] text-indigo-400 font-medium uppercase tracking-widest">Admin Panel</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6 no-scrollbar">
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
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                    } ${collapsed ? 'justify-center' : ''}`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span className="flex-1">{item.label}</span>}
                  {!collapsed && item.badge > 0 && (
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">{item.badge}</span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User + Actions */}
      <div className="border-t border-slate-700/50 p-3 space-y-1">
        <a href="/" target="_blank" rel="noreferrer" className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all ${collapsed ? 'justify-center' : ''}`}>
          <ExternalLink size={16} />
          {!collapsed && <span>View Store</span>}
        </a>
        <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}>
          <LogOut size={16} />
          {!collapsed && <span>Sign Out</span>}
        </button>
        {!collapsed && (
          <div className="mt-3 flex items-center gap-3 px-3 py-2.5 bg-slate-700/40 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.displayName?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-white truncate">{user?.displayName || 'Admin'}</div>
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
      <aside className={`hidden lg:flex flex-col flex-shrink-0 bg-slate-800/80 border-r border-slate-700/50 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        <div className="relative flex-1 flex flex-col overflow-hidden">
          <SidebarContent />
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-600 border border-slate-500 flex items-center justify-center text-slate-300 hover:bg-slate-500 transition-all z-10"
          >
            {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-10 w-64 bg-slate-800 flex flex-col animate-slide-in-right">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex-shrink-0 h-16 bg-slate-800/60 border-b border-slate-700/50 flex items-center px-4 lg:px-6 gap-4 backdrop-blur-sm">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-slate-400 hover:text-white transition-colors">
            <Menu size={20} />
          </button>

          <div className="flex-1 flex items-center gap-3">
            <div className="relative max-w-xs w-full hidden sm:block">
              <input
                type="text"
                placeholder="Search products, orders, users..."
                className="w-full h-9 bg-slate-700/60 border border-slate-600/50 rounded-xl pl-4 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl bg-slate-700/60 border border-slate-600/40 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Bell size={17} />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">3</span>
            </button>

            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:opacity-90 transition-opacity">
              {user?.displayName?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
