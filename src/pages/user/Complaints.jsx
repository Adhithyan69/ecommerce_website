import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Package, Heart, MapPin, AlertCircle, LogOut,
  Upload, MessageSquare, ChevronDown, X, Clock,
  CheckCircle2, AlertTriangle, RefreshCw, Paperclip,
  Send, ChevronLeft
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const MOCK_TICKETS = [
  {
    id: 'TIC-9921',
    issue: 'Missing Item in Order',
    status: 'Open',
    date: 'Mar 20, 2026',
    orderId: 'AG-8832',
    issueType: 'Missing Item',
    description: 'I ordered 3 items but only received 2. The Sony Headphones were missing from the package. The box was sealed properly but the headphones were not inside.',
    timeline: [
      { action: 'Ticket Raised', time: 'Mar 20, 2026 – 10:30 AM', by: 'You', note: 'Submitted complaint about missing headphones.' },
      { action: 'Under Review', time: 'Mar 20, 2026 – 2:15 PM', by: 'Support Team', note: 'We have received your complaint and a specialist is reviewing it.' },
    ],
    replies: [
      { from: 'Support Agent (Priya)', time: 'Mar 20, 2026 – 2:15 PM', text: 'Hello, thank you for reaching out! We are sorry to hear about this. Could you please provide a photo of the package you received?' },
    ],
  },
  {
    id: 'TIC-8810',
    issue: 'Refund not processed',
    status: 'Resolved',
    date: 'Feb 15, 2026',
    orderId: 'AG-7541',
    issueType: 'Refund Issue',
    description: 'I returned the defective product 10 days ago but the refund has not been credited to my account.',
    timeline: [
      { action: 'Ticket Raised', time: 'Feb 15, 2026 – 11:00 AM', by: 'You', note: '' },
      { action: 'Refund Processed', time: 'Feb 18, 2026 – 3:00 PM', by: 'Finance Team', note: 'Refund of ₹4,899 has been processed. It will reflect in 3-5 business days.' },
      { action: 'Resolved', time: 'Feb 22, 2026 – 9:00 AM', by: 'Support Team', note: 'Ticket marked resolved after refund confirmation.' },
    ],
    replies: [
      { from: 'Support Agent (Raj)', time: 'Feb 16, 2026 – 10:00 AM', text: 'We can see the return was received. Our finance team will process the refund within 3 business days.' },
      { from: 'You', time: 'Feb 22, 2026 – 8:45 AM', text: 'Refund received. Thank you!' },
    ],
  },
];

const MOCK_ORDERS = [
  { id: 'AG-8832', date: 'Mar 15, 2026' },
  { id: 'AG-8512', date: 'Mar 10, 2026' },
];

const STATUS_CONFIG = {
  Open: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: <Clock size={12} /> },
  'In Progress': { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: <RefreshCw size={12} /> },
  Resolved: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: <CheckCircle2 size={12} /> },
};

// ---- Ticket Detail View ----
const TicketDetail = ({ ticket, onBack }) => {
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState(ticket.replies || []);

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplies([...replies, { from: 'You', time: 'Just now', text: replyText }]);
    setReplyText('');
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors text-gray-500 dark:text-gray-400"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">{ticket.id}</h2>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${STATUS_CONFIG[ticket.status]?.color}`}>
              {STATUS_CONFIG[ticket.status]?.icon} {ticket.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{ticket.issue}</p>
        </div>
      </div>

      {/* Ticket Info Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Issue Type', value: ticket.issueType },
          { label: 'Raised On', value: ticket.date },
          { label: 'Order ID', value: ticket.orderId !== 'General' ? ticket.orderId : '—' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 dark:bg-dark-bg rounded-xl p-3 border border-gray-100 dark:border-dark-border">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-4 border border-gray-100 dark:border-dark-border mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
          <AlertTriangle size={14} className="text-amber-500" /> Description
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{ticket.description}</p>
      </div>

      {/* Timeline */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Activity Timeline</h3>
        <div className="relative space-y-4 pl-6 before:absolute before:left-[7px] before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-200 dark:before:bg-dark-border">
          {ticket.timeline.map((event, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[25px] w-3.5 h-3.5 rounded-full bg-accent mt-0.5 border-2 border-white dark:border-dark-card shadow-md shadow-accent/30" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{event.action}
                <span className="ml-2 text-xs font-normal text-gray-500">by {event.by}</span>
              </p>
              <p className="text-xs text-gray-400 mb-1">{event.time}</p>
              {event.note && <p className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-dark-bg rounded-lg px-3 py-2 border border-gray-100 dark:border-dark-border">{event.note}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Conversation */}
      <div className="border border-gray-200 dark:border-dark-border rounded-2xl overflow-hidden">
        <div className="bg-gray-50 dark:bg-dark-bg px-4 py-3 border-b border-gray-200 dark:border-dark-border">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare size={14} /> Conversation ({replies.length})
          </h3>
        </div>
        <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
          {replies.map((reply, i) => (
            <div key={i} className={`flex flex-col gap-1 ${reply.from === 'You' ? 'items-end' : 'items-start'}`}>
              <span className="text-xs text-gray-500">{reply.from} · {reply.time}</span>
              <div className={`max-w-[80%] text-sm px-4 py-2.5 rounded-2xl leading-relaxed ${
                reply.from === 'You'
                  ? 'bg-accent text-white rounded-br-sm'
                  : 'bg-gray-100 dark:bg-dark-bg text-gray-800 dark:text-gray-200 rounded-bl-sm'
              }`}>
                {reply.text}
              </div>
            </div>
          ))}
          {replies.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No messages yet.</p>
          )}
        </div>
        {/* Reply Input */}
        {ticket.status !== 'Resolved' && (
          <form onSubmit={handleSendReply} className="p-4 border-t border-gray-200 dark:border-dark-border flex gap-3 items-end">
            <textarea
              rows={2}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="input-field resize-none flex-1 text-sm"
            />
            <button type="submit" className="btn-primary h-10 px-4 flex-shrink-0 flex items-center gap-2">
              <Send size={16} /> Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// ---- Main Component ----
const Complaints = () => {
  const { user, logout } = useAuthStore();
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [isRaising, setIsRaising] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [formData, setFormData] = useState({
    issueType: 'Delivery Delay', orderId: '', description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTicket = {
      id: `TIC-${Math.floor(Math.random() * 9000) + 1000}`,
      issue: formData.issueType,
      status: 'Open',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      orderId: formData.orderId || 'General',
      issueType: formData.issueType,
      description: formData.description,
      timeline: [{ action: 'Ticket Raised', time: 'Just now', by: 'You', note: formData.description }],
      replies: [],
    };
    setTickets([newTicket, ...tickets]);
    setIsRaising(false);
    setFormData({ issueType: 'Delivery Delay', orderId: '', description: '' });
  };

  const NAV_ITEMS = [
    { to: '/user/dashboard', icon: <User size={18} />, label: 'My Dashboard' },
    { to: '/user/orders', icon: <Package size={18} />, label: 'Orders' },
    { to: '/user/addresses', icon: <MapPin size={18} />, label: 'Saved Addresses' },
    { to: '/user/complaints', icon: <AlertCircle size={18} />, label: 'Complaints', active: true },
    { to: '/wishlist', icon: <Heart size={18} />, label: 'Wishlist' },
  ];

  return (
    <div className="container-custom py-10 pb-28">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-6 sticky top-24 shadow-sm">
            <div className="flex flex-col items-center mb-7">
              <div className="w-18 h-18 w-[72px] h-[72px] rounded-full bg-gradient-to-tr from-accent to-purple-600 p-[2.5px] mb-3 shadow-lg shadow-accent/20">
                <div className="w-full h-full rounded-full bg-white dark:bg-dark-card flex items-center justify-center overflow-hidden">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-accent">{(user?.email || 'U')[0].toUpperCase()}</span>
                  )}
                </div>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">{user?.displayName || 'User'}</h3>
              <p className="text-xs text-gray-500 truncate max-w-[160px]">{user?.email}</p>
            </div>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    item.active
                      ? 'bg-accent/10 text-accent'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-bg hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
              <div className="h-px bg-gray-100 dark:bg-dark-border my-2" />
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-6 md:p-8 shadow-sm">

            {/* If viewing a ticket detail */}
            {selectedTicket ? (
              <TicketDetail ticket={selectedTicket} onBack={() => setSelectedTicket(null)} />
            ) : isRaising ? (
              /* Raise Ticket Form */
              <form onSubmit={handleSubmit} className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <button type="button" onClick={() => setIsRaising(false)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors text-gray-500">
                    <ChevronLeft size={20} />
                  </button>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">New Support Ticket</h2>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-text">Issue Type</label>
                      <div className="relative">
                        <select required className="input-field appearance-none pr-10" value={formData.issueType} onChange={e => setFormData({ ...formData, issueType: e.target.value })}>
                          <option>Delivery Delay</option>
                          <option value="Missing Item">Missing Item in Order</option>
                          <option value="Defective Product">Defective Product received</option>
                          <option value="Refund Issue">Refund not processed</option>
                          <option value="Other">Other / General Query</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={18} />
                      </div>
                    </div>
                    <div>
                      <label className="label-text">Related Order (Optional)</label>
                      <div className="relative">
                        <select className="input-field appearance-none pr-10" value={formData.orderId} onChange={e => setFormData({ ...formData, orderId: e.target.value })}>
                          <option value="">Select an order...</option>
                          {MOCK_ORDERS.map(order => (
                            <option key={order.id} value={order.id}>{order.id} — {order.date}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={18} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="label-text">Detailed Description</label>
                    <textarea required rows="5" className="input-field resize-none" placeholder="Describe your issue in detail..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                  </div>

                  <div>
                    <label className="label-text">Attachments (Optional)</label>
                    <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer group">
                      <Upload size={22} className="mx-auto text-gray-400 group-hover:text-accent mb-2 transition-colors" />
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG or PDF up to 5MB</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-dark-border">
                  <button type="button" onClick={() => setIsRaising(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary flex items-center gap-2"><Send size={16} /> Submit Ticket</button>
                </div>
              </form>
            ) : (
              /* Tickets List */
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Support & Complaints</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Raise tickets and track their resolution status</p>
                  </div>
                  <button onClick={() => setIsRaising(true)} className="btn-primary flex items-center gap-2 h-10">
                    <MessageSquare size={16} /> Raise Ticket
                  </button>
                </div>

                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-bg hover:shadow-md hover:border-accent/30 transition-all cursor-pointer group"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                          <span className="font-bold text-gray-900 dark:text-white text-sm">{ticket.id}</span>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${STATUS_CONFIG[ticket.status]?.color}`}>
                            {STATUS_CONFIG[ticket.status]?.icon} {ticket.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 truncate">{ticket.issue}</h4>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><Clock size={11} /> {ticket.date}</span>
                          {ticket.orderId && ticket.orderId !== 'General' && (
                            <span className="flex items-center gap-1">
                              <Paperclip size={11} /> Order: <span className="text-accent font-medium">{ticket.orderId}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        className="mt-4 sm:mt-0 sm:ml-4 text-sm font-medium text-accent hover:text-indigo-700 dark:hover:text-indigo-400 flex items-center gap-1 group-hover:gap-2 transition-all flex-shrink-0"
                        onClick={(e) => { e.stopPropagation(); setSelectedTicket(ticket); }}
                      >
                        View Details
                      </button>
                    </div>
                  ))}

                  {tickets.length === 0 && (
                    <div className="py-16 text-center">
                      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-dark-bg flex items-center justify-center mx-auto mb-4">
                        <MessageSquare size={28} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">No support tickets yet</p>
                      <p className="text-sm text-gray-400 mt-1">Click "Raise Ticket" to get help from our team</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complaints;
