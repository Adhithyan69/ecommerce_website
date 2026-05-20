import React, { useState, useEffect } from 'react';
import { Search, Eye, RefreshCw, Download } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import AdminModal from '../components/AdminModal';
import { adminOrdersAPI } from '../services/adminAPI';

const STATUSES = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewOrder, setViewOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { adminOrdersAPI.getAll().then(r => { setOrders(r.orders); setLoading(false); }); }, []);

  const filtered = orders.filter(o => {
    const ms = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === 'All' || o.status === statusFilter;
    return ms && mf;
  });

  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    await adminOrdersAPI.updateStatus(id, newStatus);
    setOrders(os => os.map(o => o.id === id ? { ...o, status: newStatus } : o));
    setUpdatingId(null);
    if (viewOrder?.id === id) setViewOrder(v => ({ ...v, status: newStatus }));
  };

  const statusCounts = STATUSES.slice(1).reduce((acc, s) => ({ ...acc, [s]: orders.filter(o => o.status === s).length }), {});

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Orders</h1>
          <p className="text-slate-400 text-sm mt-1">{orders.length} orders total</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-700/60 hover:bg-slate-700 border border-slate-600/50 text-slate-300 rounded-xl text-sm transition-all">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Status Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(statusCounts).map(([s, count]) => (
          <div key={s} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 cursor-pointer hover:border-indigo-500/40 transition-all" onClick={() => setStatusFilter(s)}>
            <div className="text-2xl font-bold text-white">{count}</div>
            <StatusBadge status={s} />
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-xs w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search order ID or customer..." className="w-full pl-9 pr-4 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${statusFilter === s ? 'bg-indigo-600 text-white' : 'bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white'}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-700/40 border-b border-slate-700/50">
              <tr className="text-slate-400 text-xs">
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Date</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Items</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Payment</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {loading ? [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={8} className="px-4 py-4"><div className="h-10 skeleton rounded-lg" /></td></tr>
              )) : filtered.map(o => (
                <tr key={o.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-indigo-400 text-xs">{o.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{o.customer}</div>
                    <div className="text-xs text-slate-400">{o.email}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-400 hidden sm:table-cell">{o.date}</td>
                  <td className="px-4 py-3 text-right text-slate-300 hidden md:table-cell">{o.items}</td>
                  <td className="px-4 py-3 text-right font-bold text-white">₹{o.total?.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3 text-slate-400 text-xs hidden sm:table-cell">{o.payment}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={o.status}
                        onChange={e => updateStatus(o.id, e.target.value)}
                        disabled={updatingId === o.id}
                        className="bg-slate-700 border border-slate-600/50 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500/50 cursor-pointer disabled:opacity-50"
                      >
                        {STATUSES.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button onClick={() => setViewOrder(o)} className="w-8 h-8 rounded-lg bg-slate-700/60 hover:bg-indigo-600 text-slate-400 hover:text-white flex items-center justify-center transition-all">
                        <Eye size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Order Modal */}
      <AdminModal open={!!viewOrder} onClose={() => setViewOrder(null)} title={`Order ${viewOrder?.id}`} size="md">
        {viewOrder && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              {[['Customer', viewOrder.customer], ['Email', viewOrder.email], ['Date', viewOrder.date], ['Payment', viewOrder.payment], ['Items', viewOrder.items], ['Total', `₹${viewOrder.total?.toLocaleString('en-IN')}`]].map(([k, v]) => (
                <div key={k}><p className="text-xs text-slate-400 mb-0.5">{k}</p><p className="font-semibold text-white">{v}</p></div>
              ))}
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2">Status</p>
              <div className="flex gap-2 flex-wrap">
                {STATUSES.slice(1).map(s => (
                  <button key={s} onClick={() => updateStatus(viewOrder.id, s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewOrder.status === s ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
};

export default AdminOrders;
