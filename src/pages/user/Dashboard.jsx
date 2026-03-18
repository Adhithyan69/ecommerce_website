import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Heart, Settings, LogOut, User, MapPin, CreditCard, Bell, ChevronRight, TrendingUp } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const Dashboard = () => {
  const { user, logout } = useAuthStore();

  const STATS = [
    { label: 'Total Orders', value: '12', icon: <Package size={20} />, bg: 'bg-blue-500' },
    { label: 'Wishlist', value: '05', icon: <Heart size={20} />, bg: 'bg-rose-500' },
    { label: 'Pending', value: '01', icon: <Bell size={20} />, bg: 'bg-amber-500' },
  ];

  return (
    <div className="container-custom py-12 pb-24">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-6 sticky top-28">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-accent to-purple-600 p-[2px] mb-3">
                <div className="w-full h-full rounded-full bg-white dark:bg-dark-card flex items-center justify-center overflow-hidden">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-accent">{(user?.email || 'U')[0].toUpperCase()}</span>
                  )}
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{user?.displayName || 'User'}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>

            <nav className="space-y-2">
              <Link to="/user/dashboard" className="flex items-center gap-3 p-3 rounded-xl bg-accent/10 text-accent font-medium transition-colors">
                <User size={18} /> My Dashboard
              </Link>
              <Link to="/user/orders" className="flex items-center gap-3 p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                <Package size={18} /> Orders
              </Link>
              <Link to="/wishlist" className="flex items-center gap-3 p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                <Heart size={18} /> Wishlist
              </Link>
              <Link to="/user/inbox" className="flex items-center gap-3 p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                <Bell size={18} /> Inbox
              </Link>
              <div className="h-px bg-gray-100 dark:bg-dark-border my-2"></div>
              <button onClick={logout} className="w-full flex items-center gap-3 p-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors">
                <LogOut size={18} /> Sign Out
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4 space-y-8">

          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-dark-card dark:to-black rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute right-0 top-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-display font-bold mb-2">Welcome back, {user?.displayName || 'Traveler'}!</h1>
              <p className="text-white/70 max-w-lg mb-6">Track your orders, manage your addresses, and discover new products tailored just for you.</p>
              <Link to="/category/all" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-xl transition-colors font-medium">
                Explore New Arrivals <TrendingUp size={16} />
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STATS.map((stat, i) => (
              <div key={i} className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} text-white flex items-center justify-center shadow-lg`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h4>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders Stub */}
          <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h2>
              <Link to="/user/orders" className="text-sm text-accent hover:underline">View All</Link>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <div className="w-12 h-12 bg-white dark:bg-dark-card rounded-lg flex items-center justify-center border border-gray-200 dark:border-dark-border">
                    <Package size={20} className="text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Order #AG-8832</h4>
                    <p className="text-xs text-gray-500">Placed on March 15, 2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">Delivered</span>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;