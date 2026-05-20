import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import ChartLine from '../components/ChartLine';
import ChartBar from '../components/ChartBar';
import ChartDonut from '../components/ChartDonut';
import { BarChart3, TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';
import { adminAnalyticsAPI } from '../services/adminAPI';

const PERIODS = ['7 days', '30 days', '3 months', '1 year'];

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [period, setPeriod] = useState('30 days');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminAnalyticsAPI.getStats(),
      adminAnalyticsAPI.getRevenueChart(),
      adminAnalyticsAPI.getOrdersByDay(),
      adminAnalyticsAPI.getCategoryRevenue(),
    ]).then(([s, r, o, c]) => {
      setStats(s); setRevenueData(r); setOrdersData(o); setCategoryData(c); setLoading(false);
    });
  }, []);

  const funnelData = [
    { label: 'Visitors', value: 42850, pct: 100, color: '#6366F1' },
    { label: 'Product Views', value: 18420, pct: 43, color: '#8B5CF6' },
    { label: 'Add to Cart', value: 5240, pct: 12, color: '#EC4899' },
    { label: 'Checkout', value: 2180, pct: 5, color: '#F59E0B' },
    { label: 'Purchased', value: 1284, pct: 3, color: '#10B981' },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">Full performance overview</p>
        </div>
        <div className="flex gap-2">
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${period === p ? 'bg-indigo-600 text-white' : 'bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white'}`}>{p}</button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? [...Array(4)].map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl" />) : [
          { title: 'Total Revenue', value: stats?.totalRevenue, prefix: '₹', change: stats?.revenueGrowth, icon: <DollarSign size={18} />, color: 'indigo' },
          { title: 'Total Orders', value: stats?.totalOrders, change: stats?.ordersGrowth, icon: <ShoppingCart size={18} />, color: 'emerald' },
          { title: 'Total Users', value: stats?.totalUsers, change: stats?.usersGrowth, icon: <Users size={18} />, color: 'purple' },
          { title: 'Conversion Rate', value: `${stats?.conversionRate}%`, change: stats?.conversionGrowth, icon: <TrendingUp size={18} />, color: 'amber' },
        ].map(k => <StatCard key={k.title} {...k} changeLabel="vs prev period" />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-1">Revenue Trend</h3>
          <p className="text-slate-400 text-xs mb-4">Monthly revenue for the last 6 months</p>
          {loading ? <div className="h-44 skeleton rounded-xl" /> : <ChartLine data={revenueData} height={180} color="#6366F1" />}
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-1">Orders by Day</h3>
          <p className="text-slate-400 text-xs mb-4">Weekly order volume</p>
          {loading ? <div className="h-44 skeleton rounded-xl" /> : <ChartBar data={ordersData.map(d => ({ label: d.day, value: d.orders }))} height={160} color="#8B5CF6" />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* category */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-1">Revenue by Category</h3>
          <p className="text-slate-400 text-xs mb-5">Percentage contribution</p>
          {loading ? <div className="h-44 skeleton rounded-xl" /> : <ChartDonut data={categoryData} size={160} thickness={28} />}
        </div>

        {/* Conversion Funnel */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-1">Conversion Funnel</h3>
          <p className="text-slate-400 text-xs mb-5">Visitor to purchase journey</p>
          <div className="space-y-3">
            {funnelData.map((f, i) => (
              <div key={f.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{f.label}</span>
                  <span className="font-bold text-white">{f.value.toLocaleString()} <span className="text-slate-500 font-normal">({f.pct}%)</span></span>
                </div>
                <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${f.pct}%`, backgroundColor: f.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Table */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
        <h3 className="font-bold text-white mb-4">Monthly Revenue Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700/50">
              <tr className="text-slate-400 text-xs"><th className="pb-3 text-left">Month</th><th className="pb-3 text-right">Revenue</th><th className="pb-3 text-right">Orders</th><th className="pb-3 text-right">Avg Order</th><th className="pb-3 text-right">Growth</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {revenueData.map((d, i) => (
                <tr key={d.month} className="hover:bg-slate-700/20 transition-colors">
                  <td className="py-3 font-medium text-white">{d.month}</td>
                  <td className="py-3 text-right font-bold text-white">₹{d.revenue?.toLocaleString('en-IN')}</td>
                  <td className="py-3 text-right text-slate-300">{d.orders}</td>
                  <td className="py-3 text-right text-slate-300">₹{Math.round(d.revenue / d.orders).toLocaleString('en-IN')}</td>
                  <td className={`py-3 text-right text-xs font-bold ${i === 0 ? 'text-slate-400' : revenueData[i].revenue > revenueData[i-1].revenue ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {i === 0 ? '—' : `${((revenueData[i].revenue - revenueData[i-1].revenue) / revenueData[i-1].revenue * 100).toFixed(1)}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
