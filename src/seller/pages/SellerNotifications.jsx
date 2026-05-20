import React, { useState, useEffect } from 'react';
import { Bell, ShoppingCart, CheckCircle, XCircle, Truck, DollarSign } from 'lucide-react';
import { sellerNotificationsAPI } from '../services/sellerAPI';

const TYPE_CONFIG = {
  order:    { icon: <ShoppingCart size={16} />, color: 'bg-blue-500/15 text-blue-400' },
  approved: { icon: <CheckCircle size={16} />, color: 'bg-emerald-500/15 text-emerald-400' },
  rejected: { icon: <XCircle size={16} />, color: 'bg-rose-500/15 text-rose-400' },
  shipping: { icon: <Truck size={16} />, color: 'bg-purple-500/15 text-purple-400' },
  payout:   { icon: <DollarSign size={16} />, color: 'bg-amber-500/15 text-amber-400' },
};

const SellerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { sellerNotificationsAPI.getAll().then(r => { setNotifications(r.notifications); setLoading(false); }); }, []);
  const markRead = async (id) => {
    await sellerNotificationsAPI.markRead(id);
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  };
  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  const unread = notifications.filter(n => !n.read).length;
  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Notifications</h1><p className="text-slate-400 text-sm mt-1">{unread} unread</p></div>
        {unread > 0 && <button onClick={markAllRead} className="text-xs text-emerald-400 hover:text-white transition-colors font-medium">Mark all read</button>}
      </div>
      <div className="space-y-3">
        {loading ? [...Array(3)].map((_, i) => <div key={i} className="h-20 skeleton rounded-2xl" />) :
          notifications.map(n => {
            const tc = TYPE_CONFIG[n.type] || TYPE_CONFIG.order;
            return (
              <div key={n.id} onClick={() => markRead(n.id)} className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${!n.read ? 'bg-slate-800/80 border-slate-600/60 hover:border-emerald-500/30' : 'bg-slate-800/30 border-slate-700/30 opacity-60 hover:opacity-80'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tc.color}`}>{tc.icon}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-white text-sm">{n.title}</p>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{n.body}</p>
                  <p className="text-[11px] text-slate-500 mt-1.5">{n.time}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SellerNotifications;
