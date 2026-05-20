import React, { useState, useEffect } from 'react';
import { Send, Package, Truck, CheckCircle, Clock, RefreshCw, MapPin } from 'lucide-react';
import { sellerOrdersAPI } from '../services/sellerAPI';

const STATUS_CONFIG = {
  Processing: { color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', icon: <Clock size={12} /> },
  Shipped: { color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', icon: <Truck size={12} /> },
  Delivered: { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', icon: <CheckCircle size={12} /> },
  Cancelled: { color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', icon: <Package size={12} /> },
};
const SUPPLIER_STATUS = { Forwarded: 'text-blue-400', Shipped: 'text-purple-400', Delivered: 'text-emerald-400', Pending: 'text-amber-400' };

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [forwarding, setForwarding] = useState(null);

  useEffect(() => { sellerOrdersAPI.getAll().then(r => { setOrders(r.orders); setLoading(false); }); }, []);

  const filtered = orders.filter(o => filter === 'All' || o.status === filter);

  const handleForward = async (id) => {
    setForwarding(id);
    const res = await sellerOrdersAPI.forwardToSupplier(id);
    setOrders(os => os.map(o => o.id === id ? { ...o, supplierStatus: res.supplierStatus } : o));
    setForwarding(null);
  };

  const stats = {
    total: orders.length,
    processing: orders.filter(o => o.status === 'Processing').length,
    shipped: orders.filter(o => o.status === 'Shipped').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-slate-400 text-sm mt-1">{orders.length} total orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[['Total', stats.total, 'text-white bg-slate-700/40 border-slate-600/30'], ['Processing', stats.processing, 'text-amber-400 bg-amber-500/10 border-amber-500/20'], ['Shipped', stats.shipped, 'text-blue-400 bg-blue-500/10 border-blue-500/20'], ['Delivered', stats.delivered, 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20']].map(([label, val, cls]) => (
          <div key={label} className={`flex flex-col items-center p-3 rounded-xl border ${cls}`}>
            <div className="text-2xl font-bold">{val}</div>
            <div className="text-xs text-slate-400">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${filter === s ? 'bg-emerald-600 text-white' : 'bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white'}`}>{s}</button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {loading ? [...Array(3)].map((_, i) => <div key={i} className="h-36 skeleton rounded-2xl" />) :
          filtered.map(o => (
            <div key={o.id} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-emerald-400 text-sm">{o.id}</span>
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-bold ${STATUS_CONFIG[o.status]?.color}`}>{STATUS_CONFIG[o.status]?.icon}{o.status}</span>
                  </div>
                  <p className="text-white font-semibold">{o.product}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-slate-400"><MapPin size={11} />{o.address}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-white font-bold">₹{o.sellingPrice}</div>
                  <div className="text-emerald-400 text-xs font-semibold">+₹{o.profit} profit</div>
                  <div className="text-slate-400 text-xs">{o.date}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-slate-500">Supplier: </span>
                    <span className={`font-semibold ${SUPPLIER_STATUS[o.supplierStatus] || 'text-slate-400'}`}>{o.supplierStatus}</span>
                  </div>
                  {o.trackingId && (
                    <div><span className="text-slate-500">Track: </span><span className="text-indigo-400 font-mono text-[11px]">{o.trackingId}</span></div>
                  )}
                </div>
                {o.supplierStatus === 'Pending' && (
                  <button onClick={() => handleForward(o.id)} disabled={forwarding === o.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-400 hover:text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50">
                    {forwarding === o.id ? <RefreshCw size={12} className="animate-spin" /> : <Send size={12} />}
                    Forward to Supplier
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SellerOrders;
