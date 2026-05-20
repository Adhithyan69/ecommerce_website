import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Wallet, ArrowDownToLine, CheckCircle, Clock } from 'lucide-react';
import { sellerEarningsAPI } from '../services/sellerAPI';

const SellerEarnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payoutModal, setPayoutModal] = useState(false);
  const [payoutForm, setPayoutForm] = useState({ amount: '', method: 'Bank Transfer', accountNumber: '', ifsc: '', upi: '' });
  const [requesting, setRequesting] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const set = (k, v) => setPayoutForm(f => ({ ...f, [k]: v }));

  useEffect(() => { sellerEarningsAPI.get().then(d => { setEarnings(d); setLoading(false); }); }, []);

  const handlePayout = async () => {
    if (!payoutForm.amount) return;
    setRequesting(true);
    await sellerEarningsAPI.requestPayout(payoutForm);
    setRequesting(false);
    setPayoutSuccess(true);
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Earnings & Payouts</h1>
          <p className="text-slate-400 text-sm mt-1">Track your revenue and request withdrawals</p>
        </div>
        <button onClick={() => { setPayoutModal(true); setPayoutSuccess(false); }} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all">
          <ArrowDownToLine size={16} /> Request Payout
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? [...Array(4)].map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl" />) : [
          { label: 'Total Revenue', value: earnings.totalRevenue, color: 'text-white', bg: 'bg-slate-800/60 border-slate-700/50', icon: <DollarSign size={16} /> },
          { label: 'Net Profit', value: earnings.totalProfit, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: <TrendingUp size={16} /> },
          { label: 'Pending Payout', value: earnings.pendingPayout, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: <Clock size={16} /> },
          { label: 'Total Withdrawn', value: earnings.withdrawnTotal, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20', icon: <Wallet size={16} /> },
        ].map(k => (
          <div key={k.label} className={`${k.bg} border rounded-2xl p-5`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">{k.label}</p>
              <span className={k.color}>{k.icon}</span>
            </div>
            <div className={`text-xl font-bold ${k.color}`}>₹{k.value?.toLocaleString('en-IN')}</div>
          </div>
        ))}
      </div>

      {/* Revenue Breakdown */}
      {earnings && (
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4">Revenue Breakdown</h3>
          <div className="space-y-3">
            {[['Total Revenue', earnings.totalRevenue, 100, 'bg-slate-500'], ['Supplier Cost', earnings.totalCost, (earnings.totalCost/earnings.totalRevenue*100), 'bg-rose-500'], ['Net Profit', earnings.totalProfit, (earnings.totalProfit/earnings.totalRevenue*100), 'bg-emerald-500']].map(([label, val, pct, bar]) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">{label}</span>
                  <div className="flex gap-2">
                    <span className="font-bold text-white">₹{val.toLocaleString('en-IN')}</span>
                    <span className="text-slate-500 text-xs self-end pb-0.5">{pct.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${bar} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payout History */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
        <h3 className="font-bold text-white mb-4">Payout History</h3>
        {loading ? <div className="h-24 skeleton rounded-xl" /> : (
          <div className="space-y-3">
            {earnings.payouts.map(p => (
              <div key={p.id} className="flex items-center justify-between py-3 border-b border-slate-700/40 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${p.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                    {p.status === 'completed' ? <CheckCircle size={15} /> : <Clock size={15} />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">₹{p.amount.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-slate-400">{p.method} · {p.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-bold px-2 py-1 rounded-lg ${p.status === 'completed' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'}`}>{p.status}</div>
                  {p.utr && <div className="text-[10px] text-slate-500 mt-0.5">{p.utr}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payout Modal */}
      {payoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setPayoutModal(false)}>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            {payoutSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={32} className="text-emerald-400" /></div>
                <h3 className="font-bold text-white text-xl mb-2">Payout Requested!</h3>
                <p className="text-slate-400 text-sm">₹{payoutForm.amount} will be processed in 2-3 working days.</p>
                <button onClick={() => setPayoutModal(false)} className="mt-5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all">Done</button>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="font-bold text-white text-lg">Request Payout</h2>
                {earnings && <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">Available: ₹{earnings.pendingPayout.toLocaleString('en-IN')}</div>}
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Amount (₹)</label>
                  <input type="number" value={payoutForm.amount} onChange={e => set('amount', e.target.value)} placeholder="Enter amount" className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Payment Method</label>
                  <select value={payoutForm.method} onChange={e => set('method', e.target.value)} className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/60 transition-all">
                    <option>Bank Transfer</option>
                    <option>UPI</option>
                  </select>
                </div>
                {payoutForm.method === 'Bank Transfer' ? (
                  <div className="grid grid-cols-2 gap-3">
                    {[['Account Number', 'accountNumber', '123456789012'], ['IFSC Code', 'ifsc', 'SBIN0001234']].map(([l, k, ph]) => (
                      <div key={k}><label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">{l}</label><input value={payoutForm[k]} onChange={e => set(k, e.target.value)} placeholder={ph} className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-3 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-all" /></div>
                    ))}
                  </div>
                ) : (
                  <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">UPI ID</label><input value={payoutForm.upi} onChange={e => set('upi', e.target.value)} placeholder="name@upi" className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-all" /></div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setPayoutModal(false)} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-all">Cancel</button>
                  <button onClick={handlePayout} disabled={requesting || !payoutForm.amount} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-all">
                    {requesting ? 'Processing...' : 'Request Payout'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerEarnings;
