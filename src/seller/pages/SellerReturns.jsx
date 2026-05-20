import React, { useState } from 'react';
import { RotateCcw, Package, CheckCircle, XCircle, Clock, AlertTriangle, ChevronRight, MessageSquare } from 'lucide-react';

const MOCK_RETURNS = [
  {
    id: 'RET-101', orderId: 'ORD-2188', date: '2026-03-19', product: 'Wireless Earbuds Pro',
    customer: 'Vikram Singh', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=80',
    reason: 'Wrong color variant received (White instead of Black)',
    type: 'return', amount: 1799, status: 'requested', paymentMethod: 'UPI',
    timeline: [{ event: 'Return Requested', time: '2026-03-19 10:22 AM', done: true }, { event: 'Seller Approved', time: '', done: false }, { event: 'Item Picked Up', time: '', done: false }, { event: 'Refund Processed', time: '', done: false }],
  },
  {
    id: 'RET-102', orderId: 'ORD-2175', date: '2026-03-14', product: 'Magnetic Car Mount',
    customer: 'Anita Roy', image: 'https://images.unsplash.com/photo-1544866092-1935c5ef2a8f?auto=format&fit=crop&q=80&w=80',
    reason: 'Product stopped working after 2 days',
    type: 'replace', amount: 599, status: 'approved',
    timeline: [{ event: 'Return Requested', time: '2026-03-14', done: true }, { event: 'Seller Approved', time: '2026-03-15', done: true }, { event: 'Item Picked Up', time: '', done: false }, { event: 'Replacement Shipped', time: '', done: false }],
  },
  {
    id: 'RET-103', orderId: 'ORD-2161', date: '2026-03-08', product: 'Wireless Earbuds Pro',
    customer: 'Karan Mehta', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=80',
    reason: 'Changed mind — no longer needed',
    type: 'return', amount: 1799, status: 'rejected',
    rejectionReason: 'Return window of 7 days has expired. Item opened.',
    timeline: [{ event: 'Return Requested', time: '2026-03-08', done: true }, { event: 'Rejected by Seller', time: '2026-03-09', done: true, rejected: true }],
  },
  {
    id: 'RET-104', orderId: 'ORD-2199', date: '2026-03-20', product: 'Wireless Earbuds Pro',
    customer: 'Arjun Kumar', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=80',
    reason: "Battery doesn't last more than 2 hours",
    type: 'replace', amount: 1799, status: 'completed',
    timeline: [{ event: 'Return Requested', time: '2026-03-17', done: true }, { event: 'Seller Approved', time: '2026-03-17', done: true }, { event: 'Item Picked Up', time: '2026-03-18', done: true }, { event: 'Replacement Shipped', time: '2026-03-20', done: true }],
  },
];

const STATUS_CONF = {
  requested: { label: 'Requested', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', icon: <Clock size={12} /> },
  approved:  { label: 'Approved', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', icon: <CheckCircle size={12} /> },
  rejected:  { label: 'Rejected', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', icon: <XCircle size={12} /> },
  completed: { label: 'Completed', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', icon: <CheckCircle size={12} /> },
};

const SellerReturns = () => {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [rejectText, setRejectText] = useState('');

  const filtered = MOCK_RETURNS.filter(r => filter === 'All' || r.status === filter || (filter === 'return' && r.type === 'return') || (filter === 'replace' && r.type === 'replace'));

  const stats = {
    requested: MOCK_RETURNS.filter(r => r.status === 'requested').length,
    approved: MOCK_RETURNS.filter(r => r.status === 'approved').length,
    completed: MOCK_RETURNS.filter(r => r.status === 'completed').length,
    rejected: MOCK_RETURNS.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="p-6 space-y-5 animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Returns & Replacements</h1>
        <p className="text-slate-400 text-sm mt-1">Manage customer return and replacement requests</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3">
        {[['Pending', stats.requested, 'text-amber-400 bg-amber-500/10 border-amber-500/20'], ['Approved', stats.approved, 'text-blue-400 bg-blue-500/10 border-blue-500/20'], ['Completed', stats.completed, 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'], ['Rejected', stats.rejected, 'text-rose-400 bg-rose-500/10 border-rose-500/20']].map(([label, val, cls]) => (
          <div key={label} className={`flex flex-col items-center p-3.5 rounded-xl border ${cls}`}>
            <div className="text-2xl font-black">{val}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['All', 'requested', 'approved', 'completed', 'rejected', 'return', 'replace'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all capitalize whitespace-nowrap ${filter === s ? 'bg-emerald-600 text-white' : 'bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white'}`}>
            {s === 'replace' ? '↔ Replace' : s === 'return' ? '↩ Return' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Return Cards */}
      <div className="space-y-4">
        {filtered.map(ret => {
          const sc = STATUS_CONF[ret.status];
          return (
            <div key={ret.id} className={`bg-slate-800/60 border rounded-2xl overflow-hidden transition-all ${ret.status === 'requested' ? 'border-amber-500/30' : 'border-slate-700/50'}`}>
              <div className="p-5">
                {/* Top Row */}
                <div className="flex items-start gap-4">
                  <img src={ret.image} alt={ret.product} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-emerald-400 font-bold">{ret.id}</span>
                          <span className="text-xs text-slate-500">·</span>
                          <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-lg ${ret.type === 'replace' ? 'text-blue-400 bg-blue-500/10' : 'text-purple-400 bg-purple-500/10'}`}>{ret.type === 'replace' ? '↔ Replace' : '↩ Return'}</span>
                        </div>
                        <p className="font-semibold text-white mt-0.5">{ret.product}</p>
                        <p className="text-xs text-slate-400">{ret.customer} · {ret.orderId} · {ret.date}</p>
                      </div>
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-bold flex-shrink-0 ${sc.color}`}>{sc.icon} {sc.label}</span>
                    </div>
                    <div className="mt-2 flex items-start gap-2 px-3 py-2 bg-slate-700/40 rounded-xl">
                      <MessageSquare size={12} className="text-slate-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-300">{ret.reason}</p>
                    </div>
                    {ret.rejectionReason && (
                      <div className="mt-2 flex items-start gap-2 px-3 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                        <AlertTriangle size={12} className="text-rose-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-rose-300">{ret.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div className="mt-4 ml-2">
                  <div className="flex items-center gap-0">
                    {ret.timeline.map((t, i) => (
                      <React.Fragment key={i}>
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${t.done ? (t.rejected ? 'bg-rose-500' : 'bg-emerald-500') : 'bg-slate-700 border-2 border-slate-600'}`}>
                            {t.done ? (t.rejected ? '✗' : '✓') : <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />}
                          </div>
                          <div className="text-[10px] text-slate-500 text-center mt-1 max-w-[64px] leading-snug">{t.event}</div>
                          {t.time && <div className="text-[9px] text-slate-600 text-center">{t.time.split(' ')[0]}</div>}
                        </div>
                        {i < ret.timeline.length - 1 && (
                          <div className={`flex-1 h-0.5 mb-6 mx-1 ${t.done && ret.timeline[i + 1]?.done ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {ret.status === 'requested' && (
                  <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <input value={rejectText} onChange={e => setRejectText(e.target.value)} placeholder="Rejection reason (optional)" className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-rose-500/50 transition-all" />
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-600/30 text-emerald-400 hover:text-white rounded-xl text-xs font-bold transition-all">
                        <CheckCircle size={13} /> Approve {ret.type === 'replace' ? 'Replacement' : 'Return'}
                      </button>
                      <button className="flex items-center gap-1.5 px-4 py-2 bg-rose-600/20 hover:bg-rose-600 border border-rose-600/30 text-rose-400 hover:text-white rounded-xl text-xs font-bold transition-all">
                        <XCircle size={13} /> Reject
                      </button>
                    </div>
                  </div>
                )}

                {/* Amount */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>Order Value: <span className="text-white font-bold">₹{ret.amount.toLocaleString('en-IN')}</span></span>
                  <span>Payment: <span className="text-slate-300">{ret.paymentMethod}</span></span>
                  {ret.status === 'completed' && ret.type === 'return' && <span className="text-emerald-400 font-semibold">Refund Issued ✓</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SellerReturns;
