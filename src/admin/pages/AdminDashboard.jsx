import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, ShoppingCart, Users, Package, AlertCircle, Clock,
  ArrowRight, RefreshCw, DollarSign, Activity, Star, Eye, BarChart3
} from 'lucide-react';
import StatCard from '../components/StatCard';
import ChartLine from '../components/ChartLine';
import ChartBar from '../components/ChartBar';
import ChartDonut from '../components/ChartDonut';
import StatusBadge from '../components/StatusBadge';
import { adminAnalyticsAPI, adminOrdersAPI, ADMIN_MOCK } from '../services/adminAPI';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [s, r, o, c, ord] = await Promise.all([
        adminAnalyticsAPI.getStats(),
        adminAnalyticsAPI.getRevenueChart(),
        adminAnalyticsAPI.getOrdersByDay(),
        adminAnalyticsAPI.getCategoryRevenue(),
        adminOrdersAPI.getAll(),
      ]);
      setStats(s);
      setRevenueData(r);
      setOrdersData(o);
      setCategoryData(c);
      setRecentOrders(ord.orders?.slice(0, 5) || []);
      setLoading(false);
    };
    load();
  }, []);

  const KPIs = stats ? [
    { title: 'Total Revenue', value: stats.totalRevenue, prefix: '₹', change: stats.revenueGrowth, changeLabel: 'vs last month', icon: <DollarSign size={18} />, color: 'indigo' },
    { title: 'Total Orders', value: stats.totalOrders, change: stats.ordersGrowth, changeLabel: 'vs last month', icon: <ShoppingCart size={18} />, color: 'emerald' },
    { title: 'Total Users', value: stats.totalUsers, change: stats.usersGrowth, changeLabel: 'vs last month', icon: <Users size={18} />, color: 'purple' },
    { title: 'Conversion Rate', value: `${stats.conversionRate}%`, change: stats.conversionGrowth, changeLabel: 'vs last month', icon: <Activity size={18} />, color: 'amber' },
  ] : [];

  const ALERTS = stats ? [
    { label: 'Pending Orders', value: stats.pendingOrders, to: '/admin/orders', color: 'text-amber-400', bg: 'bg-amber-500/10', icon: <Clock size={14} /> },
    { label: 'Open Support Tickets', value: stats.openTickets, to: '/admin/complaints', color: 'text-rose-400', bg: 'bg-rose-500/10', icon: <AlertCircle size={14} /> },
    { label: 'Low Stock Products', value: stats.lowStockProducts, to: '/admin/products', color: 'text-orange-400', bg: 'bg-orange-500/10', icon: <Package size={14} /> },
    { label: "Today's Revenue", value: `₹${stats.todayRevenue?.toLocaleString('en-IN')}`, to: '/admin/analytics', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: <TrendingUp size={14} /> },
  ] : [];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-3 py-2 bg-slate-700/60 hover:bg-slate-700 border border-slate-600/50 text-slate-300 rounded-xl text-sm transition-all">
            <RefreshCw size={14} /> Refresh
          </button>
          <Link to="/admin/analytics" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-all">
            <BarChart3 size={14} /> Full Report
          </Link>
        </div>
      </div>

      {/* Alert Chips */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {ALERTS.map(a => (
            <Link key={a.label} to={a.to} className={`flex items-center gap-3 px-4 py-3 ${a.bg} border border-white/5 rounded-xl hover:opacity-80 transition-opacity`}>
              <span className={a.color}>{a.icon}</span>
              <div>
                <div className={`font-bold text-sm ${a.color}`}>{a.value}</div>
                <div className="text-slate-400 text-[11px]">{a.label}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="h-32 skeleton rounded-2xl" />)
        ) : (
          KPIs.map(kpi => <StatCard key={kpi.title} loading={loading} {...kpi} />)
        )}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-white">Revenue Overview</h3>
              <p className="text-slate-400 text-xs mt-0.5">Last 6 months performance</p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-indigo-500/15 text-indigo-400 rounded-lg font-medium border border-indigo-500/20">Monthly</span>
          </div>
          {loading ? <div className="h-44 skeleton rounded-xl" /> : <ChartLine data={revenueData} height={180} color="#6366F1" />}
        </div>

        {/* Category Donut */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <div className="mb-5">
            <h3 className="font-bold text-white">Revenue by Category</h3>
            <p className="text-slate-400 text-xs mt-0.5">All time distribution</p>
          </div>
          {loading ? <div className="h-44 skeleton rounded-xl" /> : (
            <ChartDonut data={categoryData} size={140} thickness={24} />
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Bar Chart */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <div className="mb-4">
            <h3 className="font-bold text-white">Orders This Week</h3>
            <p className="text-slate-400 text-xs mt-0.5">Daily order volume</p>
          </div>
          {loading ? <div className="h-40 skeleton rounded-xl" /> : <ChartBar data={ordersData.map(d => ({ label: d.day, value: d.orders }))} height={140} color="#8B5CF6" />}
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white">Recent Orders</h3>
              <p className="text-slate-400 text-xs mt-0.5">Latest {recentOrders.length} transactions</p>
            </div>
            <Link to="/admin/orders" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-12 skeleton rounded-xl" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 text-xs">
                    <th className="text-left pb-3 font-medium">Order</th>
                    <th className="text-left pb-3 font-medium hidden sm:table-cell">Customer</th>
                    <th className="text-left pb-3 font-medium">Status</th>
                    <th className="text-right pb-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="py-3 font-mono font-bold text-indigo-400 text-xs">{order.id}</td>
                      <td className="py-3 text-slate-300 hidden sm:table-cell">{order.customer}</td>
                      <td className="py-3"><StatusBadge status={order.status} /></td>
                      <td className="py-3 text-right font-bold text-white">₹{order.total?.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-white">Top Products</h3>
            <p className="text-slate-400 text-xs mt-0.5">By total units sold</p>
          </div>
          <Link to="/admin/products" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium">
            Manage <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ADMIN_MOCK.products.slice(0, 3).map(p => (
            <div key={p.id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:bg-slate-700/50 transition-colors">
              <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400">{p.sold} sold</span>
                  <span className="text-xs text-yellow-400 flex items-center gap-0.5"><Star size={10} fill="currentColor" /> {p.rating}</span>
                </div>
              </div>
              <div className="text-sm font-bold text-white flex-shrink-0">₹{(p.price / 100).toFixed(0)}x</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
