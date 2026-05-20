import React, { useState, useEffect } from 'react';
import { Plus, Send, MessageCircle } from 'lucide-react';
import { sellerSupportAPI } from '../services/sellerAPI';

const STATUS_STYLE = { Open: 'text-amber-400 bg-amber-500/10 border-amber-500/30', Resolved: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', 'In Progress': 'text-blue-400 bg-blue-500/10 border-blue-500/30' };

const SellerSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newModal, setNewModal] = useState(false);
  const [viewTicket, setViewTicket] = useState(null);
  const [newForm, setNewForm] = useState({ subject: '', orderRef: '', message: '' });
  const [reply, setReply] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => { sellerSupportAPI.getTickets().then(r => { setTickets(r.tickets); setLoading(false); }); }, []);

  const handleCreate = async () => {
    if (!newForm.subject || !newForm.message) return;
    setCreating(true);
    const ticket = await sellerSupportAPI.createTicket(newForm);
    setTickets(ts => [ticket, ...ts]);
    setNewForm({ subject: '', orderRef: '', message: '' });
    setNewModal(false);
    setCreating(false);
  };

  const handleReply = async () => {
    if (!reply.trim() || !viewTicket) return;
    await sellerSupportAPI.reply(viewTicket.id, reply);
    const msg = { from: 'seller', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const updated = { ...viewTicket, messages: [...viewTicket.messages, msg] };
    setTickets(ts => ts.map(t => t.id === viewTicket.id ? updated : t));
    setViewTicket(updated);
    setReply('');
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Support</h1><p className="text-slate-400 text-sm mt-1">Raise issues and track resolutions</p></div>
        <button onClick={() => setNewModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all">
          <Plus size={16} /> New Ticket
        </button>
      </div>

      <div className="space-y-3">
        {loading ? [...Array(2)].map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />) :
          tickets.map(t => (
            <div key={t.id} onClick={() => setViewTicket(t)} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 cursor-pointer hover:border-emerald-500/30 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-emerald-400 font-bold">{t.id}</span>
                    {t.orderRef && <span className="text-xs text-slate-500">· {t.orderRef}</span>}
                  </div>
                  <p className="font-semibold text-white">{t.subject}</p>
                  <p className="text-xs text-slate-400 mt-1">{t.date} · {t.messages.length} message{t.messages.length !== 1 ? 's' : ''}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold ${STATUS_STYLE[t.status]}`}>{t.status}</span>
              </div>
            </div>
          ))}
      </div>

      {/* New Ticket Modal */}
      {newModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setNewModal(false)}>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h2 className="font-bold text-white text-lg">Raise Support Ticket</h2>
            {[['Subject', 'subject', 'e.g. Wrong item delivered'], ['Order Reference', 'orderRef', 'e.g. ORD-2201']].map(([l, k, ph]) => (
              <div key={k}><label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">{l}</label><input value={newForm[k]} onChange={e => setNewForm(f => ({ ...f, [k]: e.target.value }))} placeholder={ph} className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-all" /></div>
            ))}
            <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Message</label><textarea rows={4} value={newForm.message} onChange={e => setNewForm(f => ({ ...f, message: e.target.value }))} placeholder="Describe your issue..." className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 resize-none transition-all" /></div>
            <div className="flex gap-3">
              <button onClick={() => setNewModal(false)} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-all">Cancel</button>
              <button onClick={handleCreate} disabled={creating} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-all">
                {creating ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Ticket Modal */}
      {viewTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setViewTicket(null)}>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div><span className="font-mono text-xs text-emerald-400 font-bold">{viewTicket.id}</span><h3 className="font-bold text-white">{viewTicket.subject}</h3></div>
              <span className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold ${STATUS_STYLE[viewTicket.status]}`}>{viewTicket.status}</span>
            </div>
            <div className="space-y-3 overflow-y-auto flex-1">
              {viewTicket.messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'admin' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.from === 'admin' ? 'bg-slate-700 text-slate-200' : 'bg-emerald-600 text-white'}`}>
                    <div className="font-semibold text-xs mb-1 opacity-70">{m.from === 'admin' ? 'Support Team' : 'You'}</div>
                    <div>{m.text}</div>
                    <div className="text-[10px] opacity-60 mt-1">{m.time}</div>
                  </div>
                </div>
              ))}
            </div>
            {viewTicket.status !== 'Resolved' && (
              <div className="flex gap-2">
                <input value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleReply()} placeholder="Type a reply..." className="flex-1 bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-all" />
                <button onClick={handleReply} className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center justify-center text-white transition-all"><Send size={14} /></button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerSupport;
