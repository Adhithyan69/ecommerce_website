import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingCart, TrendingUp, Clock, Package, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { sellerAnalyticsAPI, sellerOrdersAPI, SELLER_MOCK } from '../services/sellerAPI';

// Simple SVG Line Chart
const MiniLineChart = ({ data, color = '#10B981', height = 120 }) => {
  if (!data.length) return null;
  const W = 500; const H = height;
  const pad = { top: 10, right: 10, bottom: 22, left: 44 };
  const cW = W - pad.left - pad.right; const cH = H - pad.top - pad.bottom;
  const maxV = Math.max(...data.map(d => d.revenue), 1);
  const xScale = i => pad.left + (i / (data.length - 1)) * cW;
  const yScale = v => pad.top + cH - (v / maxV) * cH;
  const pts = data.map((d, i) => ({ x: xScale(i), y: yScale(d.revenue), ...d }));
  const lineD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaD = `${lineD} L ${pts[pts.length-1].x} ${pad.top+cH} L ${pts[0].x} ${pad.top+cH} Z`;
  const fmt = v => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : v >= 1000 ? `₹${(v/1000).toFixed(0)}k` : `₹${v}`;
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map(t => {
        const v = t * maxV; const y = yScale(v);
        return <g key={t}><line x1={pad.left} y1={y} x2={W-pad.right} y2={y} stroke="#334155" strokeWidth={1} strokeDasharray="3,3" /><text x={pad.left-4} y={y+4} textAnchor="end" fontSize={9} fill="#64748B">{fmt(v)}</text></g>;
      })}
      {pts.map((p, i) => <text key={i} x={p.x} y={H-4} textAnchor="middle" fontSize={9} fill="#64748B">{p.month}</text>)}
      <path d={areaD} fill={`url(#sg1)`} />
      <path d={lineD} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={4} fill={color} stroke="white" strokeWidth={2} />)}
    </svg>
  );
};

const KPICard = ({ title, value, change, icon, color, prefix = '' }) => {
  const cols = { emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400', amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400', rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400' };
  const c = cols[color] || cols.emerald;
  return (
    <div className={`bg-slate-800/60 border rounded-2xl p-5 hover:bg-slate-700/50 transition-all ${c}`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${c}`}>{icon}</div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</div>
      {change !== undefined && (
        <div className={`text-xs font-semibold ${change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs last month
        </div>
      )}
    </div>
  );
};

const SellerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [chart, setChart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([sellerAnalyticsAPI.getStats(), sellerAnalyticsAPI.getRevenueChart(), sellerOrdersAPI.getAll()])
      .then(([s, c, o]) => { setStats(s); setChart(c); setOrders(o.orders.slice(0, 4)); setLoading(false); });
  }, []);

  const STATUS_STYLE = { Processing: 'text-amber-400 bg-amber-500/10', Shipped: 'text-blue-400 bg-blue-500/10', Delivered: 'text-emerald-400 bg-emerald-500/10', Cancelled: 'text-rose-400 bg-rose-500/10' };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Seller Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Track your store performance in real-time</p>
        </div>
        <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-3 py-2 bg-slate-700/60 border border-slate-600/50 text-slate-300 rounded-xl text-sm hover:bg-slate-700 transition-all">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Alert Chips */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Pending Orders', value: stats.pendingOrders, to: '/seller/orders', color: 'text-amber-400 bg-amber-500/10', icon: <Clock size={14} /> },
            { label: 'Awaiting Approval', value: stats.pendingApproval, to: '/seller/products', color: 'text-purple-400 bg-purple-500/10', icon: <AlertTriangle size={14} /> },
            { label: "Today's Orders", value: stats.todayOrders, to: '/seller/orders', color: 'text-blue-400 bg-blue-500/10', icon: <ShoppingCart size={14} /> },
            { label: "Today's Revenue", value: `₹${stats.todayRevenue?.toLocaleString('en-IN')}`, to: '/seller/earnings', color: 'text-emerald-400 bg-emerald-500/10', icon: <TrendingUp size={14} /> },
          ].map(a => (
            <Link key={a.label} to={a.to} className={`flex items-center gap-3 px-4 py-3 ${a.color} border border-white/5 rounded-xl hover:opacity-80 transition-opacity`}>
              <span>{a.icon}</span>
              <div><div className="font-bold text-sm">{a.value}</div><div className="text-slate-400 text-[11px]">{a.label}</div></div>
            </Link>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? [...Array(4)].map((_, i) => <div key={i} className="h-32 skeleton rounded-2xl" />) : [
          { title: 'Total Revenue', value: stats.totalRevenue, prefix: '₹', change: stats.revenueGrowth, icon: <DollarSign size={16} />, color: 'emerald' },
          { title: 'Total Orders', value: stats.totalOrders, change: stats.ordersGrowth, icon: <ShoppingCart size={16} />, color: 'indigo' },
          { title: 'Total Profit', value: stats.totalProfit, prefix: '₹', change: stats.profitGrowth, icon: <TrendingUp size={16} />, color: 'amber' },
          { title: 'Products Live', value: SELLER_MOCK.myProducts.filter(p => p.status === 'approved' && p.enabled).length, icon: <Package size={16} />, color: 'rose' },
        ].map(k => <KPICard key={k.title} {...k} />)}
      </div>

      {/* Charts + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="font-bold text-white">Revenue & Profit</h3><p className="text-slate-400 text-xs mt-0.5">6-month trend</p></div>
            <div className="flex gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Revenue</span>
            </div>
          </div>
          {loading ? <div className="h-36 skeleton rounded-xl" /> : <MiniLineChart data={chart} color="#10B981" height={130} />}
        </div>

        {/* Profit Summary */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white mb-1">Profit Summary</h3>
            <p className="text-slate-400 text-xs mb-5">All time earnings breakdown</p>
          </div>
          {loading ? <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-10 skeleton rounded-xl" />)}</div> :
            <div className="space-y-4">
              {[['Revenue', stats.totalRevenue, 'text-white'], ['Supplier Cost', stats.totalRevenue - stats.totalProfit, 'text-rose-400'], ['Net Profit', stats.totalProfit, 'text-emerald-400']].map(([l, v, c]) => (
                <div key={l} className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">{l}</span>
                  <span className={`font-bold ${c}`}>₹{v.toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className="border-t border-slate-700/50 pt-3">
                <div className="text-xs text-slate-400 mb-1">Profit Margin</div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats ? ((stats.totalProfit / (stats.totalRevenue || 1)) * 100).toFixed(0) : 0}%` }} />
                </div>
                <div className="text-xs text-emerald-400 font-bold mt-1">{stats ? ((stats.totalProfit / (stats.totalRevenue || 1)) * 100).toFixed(1) : 0}% margin</div>
              </div>
            </div>
          }
          <Link to="/seller/earnings" className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-400 hover:text-white rounded-xl text-sm font-semibold transition-all">
            Request Payout <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div><h3 className="font-bold text-white">Recent Orders</h3><p className="text-slate-400 text-xs mt-0.5">Latest transactions</p></div>
          <Link to="/seller/orders" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium">View all <ArrowRight size={12} /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-slate-400 text-xs border-b border-slate-700/50">
              <th className="pb-3 text-left">Order ID</th><th className="pb-3 text-left hidden sm:table-cell">Customer</th><th className="pb-3 text-left hidden md:table-cell">Product</th><th className="pb-3 text-right">Profit</th><th className="pb-3 text-left">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-700/30">
              {loading ? [...Array(3)].map((_, i) => <tr key={i}><td colSpan={5} className="py-3"><div className="h-8 skeleton rounded" /></td></tr>) :
                orders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="py-3 font-mono text-xs font-bold text-emerald-400">{o.id}</td>
                    <td className="py-3 text-slate-300 hidden sm:table-cell">{o.customer}</td>
                    <td className="py-3 text-slate-400 hidden md:table-cell truncate max-w-[150px]">{o.product}</td>
                    <td className="py-3 text-right font-bold text-emerald-400">₹{o.profit.toLocaleString('en-IN')}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-lg text-[11px] font-bold ${STATUS_STYLE[o.status] || 'text-slate-400'}`}>{o.status}</span>
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

export default SellerDashboard;
