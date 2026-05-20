import React, { useState, useEffect } from 'react';
import { Search, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import AdminModal from '../components/AdminModal';
import { adminComplaintsAPI } from '../services/adminAPI';

const TICKET_STATUSES = ['All', 'Open', 'In Progress', 'Resolved'];

const AdminComplaints = () => {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [viewTicket, setViewTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { adminComplaintsAPI.getAll().then(r => { setTickets(r.tickets); setLoading(false); }); }, []);

  const filtered = tickets.filter(t => {
    const ms = t.user.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search);
    const mf = filter === 'All' || t.status === filter;
    return ms && mf;
  });

  const handleReply = async () => {
    if (!replyText.trim() || !viewTicket) return;
    setSending(true);
    await adminComplaintsAPI.reply(viewTicket.id, replyText);
    const newMsg = { from: 'admin', text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const updated = { ...viewTicket, status: 'In Progress', messages: [...(viewTicket.messages || []), newMsg] };
    setTickets(ts => ts.map(t => t.id === viewTicket.id ? updated : t));
    setViewTicket(updated);
    setReplyText('');
    setSending(false);
  };

  const closeTicket = async (id) => {
    await adminComplaintsAPI.updateStatus(id, 'Resolved');
    const updated = tickets.map(t => t.id === id ? { ...t, status: 'Resolved' } : t);
    setTickets(updated);
    if (viewTicket?.id === id) setViewTicket(v => ({ ...v, status: 'Resolved' }));
  };

  const counts = TICKET_STATUSES.slice(1).reduce((a, s) => ({ ...a, [s]: tickets.filter(t => t.status === s).length }), {});

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Support Tickets</h1>
          <p className="text-slate-400 text-sm mt-1">{tickets.length} total tickets</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[['Open', counts.Open || 0, 'text-rose-400', <AlertCircle size={16} />], ['In Progress', counts['In Progress'] || 0, 'text-amber-400', <Clock size={16} />], ['Resolved', counts.Resolved || 0, 'text-emerald-400', <CheckCircle size={16} />]].map(([label, count, cls, icon]) => (
          <div key={label} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
            <span className={cls}>{icon}</span>
            <div><div className={`text-xl font-bold ${cls}`}>{count}</div><div className="text-slate-400 text-xs">{label}</div></div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-xs w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets..." className="w-full pl-9 pr-4 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all" />
        </div>
        <div className="flex gap-2">
          {TICKET_STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${filter === s ? 'bg-indigo-600 text-white' : 'bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white'}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {loading ? [...Array(3)].map((_, i) => <div key={i} className="h-20 skeleton rounded-2xl" />) :
          filtered.map(ticket => (
            <div key={ticket.id} onClick={() => setViewTicket(ticket)} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 hover:border-indigo-500/40 cursor-pointer transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-indigo-400 font-bold">{ticket.id}</span>
                    <StatusBadge status={ticket.priority} />
                  </div>
                  <h3 className="font-semibold text-white mb-1">{ticket.subject}</h3>
                  <p className="text-xs text-slate-400">{ticket.user} · {ticket.type} · {ticket.date}</p>
                </div>
                <StatusBadge status={ticket.status} />
              </div>
            </div>
          ))
        }
      </div>

      {/* Ticket Detail Modal */}
      <AdminModal open={!!viewTicket} onClose={() => setViewTicket(null)} title={viewTicket?.id} size="lg">
        {viewTicket && (
          <div className="flex flex-col space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-white text-base">{viewTicket.subject}</h3>
                <p className="text-sm text-slate-400">{viewTicket.user} · {viewTicket.email} · Order: {viewTicket.orderId}</p>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={viewTicket.priority} />
                <StatusBadge status={viewTicket.status} />
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {viewTicket.messages?.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.from === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                    <div className="font-medium mb-0.5">{m.from === 'admin' ? 'Admin' : viewTicket.user}</div>
                    <div>{m.text}</div>
                    <div className="text-[11px] opacity-60 mt-1">{m.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Area */}
            {viewTicket.status !== 'Resolved' && (
              <div>
                <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={3} placeholder="Type your reply..." className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 resize-none transition-all" />
                <div className="flex gap-3 mt-3">
                  <button onClick={() => closeTicket(viewTicket.id)} className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-600/40 text-emerald-400 hover:text-white rounded-xl text-sm font-semibold transition-all">
                    Mark Resolved
                  </button>
                  <button onClick={handleReply} disabled={sending || !replyText.trim()} className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-all">
                    <Send size={14} /> {sending ? 'Sending...' : 'Reply'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </AdminModal>
    </div>
  );
};

export default AdminComplaints;
