import React, { useState } from 'react';
import { Send, Bell, Users, CheckCircle, Clock } from 'lucide-react';
import { adminNotificationsAPI } from '../services/adminAPI';

const NOTIFICATION_TYPES = [
  { value: 'all', label: 'All Users', icon: <Users size={16} />, count: '8,492' },
  { value: 'active', label: 'Active Users (30d)', icon: <Bell size={16} />, count: '4,280' },
  { value: 'highvalue', label: 'High-Value Users', icon: <Users size={16} />, count: '892' },
];

const HISTORY = [
  { id: 'n1', title: '🔥 Flash Sale — 40% Off Electronics!', target: 'All Users', sent: '2026-03-20 10:00', recipients: 8492, opened: 3140 },
  { id: 'n2', title: '📦 Your order AG-8820 has been shipped', target: 'All Users', sent: '2026-03-19 15:30', recipients: 1, opened: 1 },
  { id: 'n3', title: '🎉 New Collection Launched!', target: 'Active Users', sent: '2026-03-15 09:00', recipients: 4280, opened: 1890 },
];

const AdminNotifications = () => {
  const [form, setForm] = useState({ title: '', body: '', type: 'all', link: '', scheduled: false, scheduledAt: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSend = async () => {
    if (!form.title || !form.body) return;
    setSending(true);
    const result = await adminNotificationsAPI.broadcast(form);
    setSent(result);
    setSending(false);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Notifications</h1>
        <p className="text-slate-400 text-sm mt-1">Broadcast push notifications to your users</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Compose */}
        <div className="lg:col-span-3 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-5 flex items-center gap-2"><Bell size={18} className="text-indigo-400" /> Compose Notification</h2>

          {sent ? (
            <div className="text-center py-10 animate-zoom-in">
              <div className="w-16 h-16 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-emerald-400" />
              </div>
              <h3 className="font-bold text-white text-xl mb-2">Sent Successfully!</h3>
              <p className="text-slate-400">Delivered to <span className="text-white font-bold">{sent.recipients?.toLocaleString()}</span> users</p>
              <button onClick={() => { setSent(null); setForm({ title: '', body: '', type: 'all', link: '', scheduled: false, scheduledAt: '' }); }} className="mt-5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all">
                Send Another
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Notification Title</label>
                <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. 🔥 Flash Sale — 40% Off!" className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Message Body</label>
                <textarea value={form.body} onChange={e => set('body', e.target.value)} rows={3} placeholder="Your notification message..." className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 resize-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Link (optional)</label>
                <input value={form.link} onChange={e => set('link', e.target.value)} placeholder="/offers" className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all" />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 block">Target Audience</label>
                <div className="space-y-2">
                  {NOTIFICATION_TYPES.map(t => (
                    <label key={t.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${form.type === t.value ? 'bg-indigo-600/15 border-indigo-500/40' : 'bg-slate-700/40 border-slate-600/40 hover:border-slate-500'}`}>
                      <input type="radio" name="type" value={t.value} checked={form.type === t.value} onChange={e => set('type', e.target.value)} className="sr-only" />
                      <span className="text-indigo-400 flex-shrink-0">{t.icon}</span>
                      <span className="flex-1 text-sm text-white">{t.label}</span>
                      <span className="text-xs text-slate-400">{t.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={handleSend} disabled={sending || !form.title || !form.body} className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all disabled:opacity-40">
                <Send size={16} /> {sending ? 'Sending...' : `Send to ${NOTIFICATION_TYPES.find(t => t.type === form.type)?.count || NOTIFICATION_TYPES[0].count} users`}
              </button>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 mb-5">
            <h3 className="font-bold text-white mb-4 text-sm">Preview</h3>
            <div className="bg-slate-700/60 rounded-2xl p-4 border border-slate-600/40">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Bell size={16} className="text-white" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm mb-0.5">{form.title || 'Notification Title'}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{form.body || 'Your message will appear here...'}</div>
                  <div className="text-[11px] text-slate-500 mt-2">Anti-Gravity · just now</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h3 className="font-bold text-white mb-4 text-sm flex items-center gap-2"><Clock size={14} className="text-slate-400" /> Recent History</h3>
            <div className="space-y-3">
              {HISTORY.map(h => (
                <div key={h.id} className="flex flex-col border-b border-slate-700/40 pb-3 last:border-0 last:pb-0">
                  <p className="text-sm text-white font-medium line-clamp-1">{h.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-slate-500">{h.sent}</span>
                    <span className="text-xs text-slate-400">{h.opened}/{h.recipients} opened</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
