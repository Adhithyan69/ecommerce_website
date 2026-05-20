import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Package, Tag, MessageSquare, Heart, XCircle, Check, CheckCheck, Trash2, ShoppingCart } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'order', title: 'Order Delivered!', message: 'Your order AG-8832 (Sony Headphones) was delivered successfully.', time: '2 hours ago', read: false, link: '/user/orders/AG-8832', icon: <Package size={18} className="text-success" /> },
  { id: 2, type: 'offer', title: '🔥 Flash Sale — 40% Off!', message: 'Limited time deals on Electronics. Ends tonight at midnight!', time: '5 hours ago', read: false, link: '/offers', icon: <Tag size={18} className="text-amber-500" /> },
  { id: 3, type: 'support', title: 'Support Ticket Resolved', message: 'Your ticket TIC-8810 (Refund) has been resolved. ₹4,899 refunded!', time: '1 day ago', read: true, link: '/user/complaints', icon: <MessageSquare size={18} className="text-blue-500" /> },
  { id: 4, type: 'wishlist', title: 'Price Drop on Wishlist Item!', message: 'Apple AirPods Pro is now ₹24,999 — ₹5,000 cheaper than before!', time: '2 days ago', read: true, link: '/wishlist', icon: <Heart size={18} className="text-rose-500" /> },
  { id: 5, type: 'order', title: 'Order Shipped 🚚', message: 'Your order AG-8512 is on its way. Track with ID: BLUEDART987654', time: '3 days ago', read: true, link: '/user/orders/AG-8512', icon: <ShoppingCart size={18} className="text-indigo-500" /> },
];

const FILTER_TABS = ['All', 'Unread', 'Orders', 'Offers', 'Support'];

const Notifications = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState('All');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return !n.read;
    if (activeFilter === 'Orders') return n.type === 'order';
    if (activeFilter === 'Offers') return n.type === 'offer';
    if (activeFilter === 'Support') return n.type === 'support';
    return true;
  });

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const deleteNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));
  const clearAll = () => setNotifications([]);

  return (
    <div className="container-custom py-8 pb-28 max-w-3xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Bell size={26} className={unreadCount > 0 ? 'text-accent animate-bounce-subtle' : 'text-gray-400'} />
            Notifications
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent text-white text-xs font-bold">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{unreadCount} unread notifications</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="btn-secondary text-sm h-9 flex items-center gap-2 px-3">
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={clearAll} className="btn-ghost text-sm h-9 flex items-center gap-1.5 px-3 text-error hover:bg-error/5">
              <Trash2 size={14} /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeFilter === tab
                ? 'bg-accent text-white shadow-glow'
                : 'bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border text-gray-600 dark:text-gray-400 hover:border-accent/40 hover:text-accent'
            }`}
          >
            {tab}
            {tab === 'Unread' && unreadCount > 0 && (
              <span className="ml-1.5 text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      {filteredNotifications.length === 0 ? (
        <div className="py-20 text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-gray-100 dark:bg-dark-card rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={36} className="text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No notifications</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">You're all caught up! Check back later.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notif, i) => (
            <div
              key={notif.id}
              className={`relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 group cursor-pointer animate-fade-in-up hover:shadow-card-hover ${
                !notif.read
                  ? 'bg-accent/5 dark:bg-accent/10 border-accent/20 dark:border-accent/20'
                  : 'bg-white dark:bg-dark-card border-gray-100 dark:border-dark-border'
              }`}
              style={{ animationDelay: `${i * 60}ms` }}
              onClick={() => markRead(notif.id)}
            >
              {/* Unread dot */}
              {!notif.read && (
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent" />
              )}

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-dark-bg flex items-center justify-center flex-shrink-0 mt-0.5">
                {notif.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pr-6">
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-0.5">{notif.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{notif.message}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[11px] text-gray-400">{notif.time}</span>
                  <Link to={notif.link} className="text-[11px] text-accent font-medium hover:underline" onClick={e => e.stopPropagation()}>
                    View →
                  </Link>
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={e => { e.stopPropagation(); deleteNotification(notif.id); }}
                className="opacity-0 group-hover:opacity-100 absolute top-3 right-7 text-gray-300 hover:text-error transition-all"
              >
                <XCircle size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
