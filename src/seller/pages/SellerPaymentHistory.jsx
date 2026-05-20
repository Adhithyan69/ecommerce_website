import React, { useState } from 'react';
import { CreditCard, Smartphone, Banknote, CheckCircle, Clock, XCircle, Download, Filter } from 'lucide-react';

const PAYMENT_METHODS = {
  'Bank Transfer': { icon: <CreditCard size={15} />, color: 'text-blue-400 bg-blue-500/10' },
  'UPI': { icon: <Smartphone size={15} />, color: 'text-emerald-400 bg-emerald-500/10' },
  'COD': { icon: <Banknote size={15} />, color: 'text-amber-400 bg-amber-500/10' },
  'Wallet': { icon: <CreditCard size={15} />, color: 'text-purple-400 bg-purple-500/10' },
};

const MOCK_PAYMENTS = [
  { id: 'PAY-1051', date: '2026-03-21', type: 'order', description: 'ORD-2201 — Wireless Earbuds Pro', method: 'UPI', amount: 1799, status: 'settled', customer: 'Rahul Sharma', paymentRef: 'UPI-9823441' },
  { id: 'PAY-1050', date: '2026-03-20', type: 'order', description: 'ORD-2200 — Magnetic Car Mount', method: 'COD', amount: 599, status: 'pending_cod', customer: 'Priya Mehta', paymentRef: 'COD-7781234' },
  { id: 'PAY-1049', date: '2026-03-20', type: 'order', description: 'ORD-2199 — Wireless Earbuds Pro', method: 'Bank Transfer', amount: 1799, status: 'settled', customer: 'Arjun Kumar', paymentRef: 'TXN-883912' },
  { id: 'PAY-1048', date: '2026-03-18', type: 'payout', description: 'Payout — Bank Account ending 4512', method: 'Bank Transfer', amount: -15000, status: 'completed', customer: '', paymentRef: 'UTR884234' },
  { id: 'PAY-1047', date: '2026-03-17', type: 'order', description: 'ORD-2196 — Magnetic Car Mount', method: 'UPI', amount: 599, status: 'settled', customer: 'Sneha Patel', paymentRef: 'UPI-7723890' },
  { id: 'PAY-1046', date: '2026-03-15', type: 'order', description: 'ORD-2188 — Bamboo Charger', method: 'COD', amount: 799, status: 'cod_failed', customer: 'Vikram Singh', paymentRef: 'COD-6642891' },
  { id: 'PAY-1045', date: '2026-03-14', type: 'payout', description: 'Payout — UPI ID seller@upi', method: 'UPI', amount: -12000, status: 'completed', customer: '', paymentRef: 'UPI993812' },
  { id: 'PAY-1044', date: '2026-03-12', type: 'order', description: 'ORD-2180 — Earbuds Pro', method: 'Wallet', amount: 1799, status: 'settled', customer: 'Meera Nair', paymentRef: 'WLT-448821' },
];

const STATUS_CONFIG = {
  settled:     { label: 'Settled', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', icon: <CheckCircle size={11} /> },
  completed:   { label: 'Completed', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', icon: <CheckCircle size={11} /> },
  pending_cod: { label: 'COD Pending', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', icon: <Clock size={11} /> },
  cod_failed:  { label: 'COD Failed', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', icon: <XCircle size={11} /> },
  processing:  { label: 'Processing', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', icon: <Clock size={11} /> },
};

const MONTH_SUMMARY = [
  { month: 'March 2026', orders: 18, revenue: 28450, payouts: 15000, cod: 4, codPending: 1 },
  { month: 'February 2026', orders: 22, revenue: 34800, payouts: 12000, cod: 6, codPending: 0 },
  { month: 'January 2026', orders: 16, revenue: 24200, payouts: 10000, cod: 3, codPending: 0 },
];

const SellerPaymentHistory = () => {
  const [filter, setFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = MOCK_PAYMENTS.filter(p => {
    const matchFilter = filter === 'All' || p.status === filter || (filter === 'payout' && p.type === 'payout') || (filter === 'order' && p.type === 'order');
    const matchMethod = methodFilter === 'All' || p.method === methodFilter;
    const matchSearch = !search || p.description.toLowerCase().includes(search.toLowerCase()) || p.paymentRef.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchMethod && matchSearch;
  });

  const totalRevenue = MOCK_PAYMENTS.filter(p => p.type === 'order' && p.status !== 'cod_failed').reduce((a, p) => a + p.amount, 0);
  const totalPayout = Math.abs(MOCK_PAYMENTS.filter(p => p.type === 'payout').reduce((a, p) => a + p.amount, 0));
  const codPending = MOCK_PAYMENTS.filter(p => p.status === 'pending_cod').reduce((a, p) => a + p.amount, 0);
  const codFailed = MOCK_PAYMENTS.filter(p => p.status === 'cod_failed').length;

  return (
    <div className="p-6 space-y-6 animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Payment History</h1>
          <p className="text-slate-400 text-sm mt-1">All transactions — orders, payouts, COD settlements</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-700/60 border border-slate-600/50 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-all">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Collected', value: `₹${totalRevenue.toLocaleString('en-IN')}`, sub: 'All settled orders', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'COD Pending', value: `₹${codPending.toLocaleString('en-IN')}`, sub: 'Awaiting collection', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'COD Failed', value: `${codFailed} orders`, sub: 'Delivery refused', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
          { label: 'Total Paid Out', value: `₹${totalPayout.toLocaleString('en-IN')}`, sub: 'Withdrawn to bank/UPI', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
        ].map(c => (
          <div key={c.label} className={`${c.bg} border rounded-2xl p-4`}>
            <p className="text-xs text-slate-400 mb-1">{c.label}</p>
            <p className={`text-xl font-bold ${c.color}`}>{c.value}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* COD Management Banner */}
      {codPending > 0 && (
        <div className="flex items-center gap-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <Banknote size={18} className="text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-amber-300 text-sm">COD Collection Pending</p>
            <p className="text-slate-400 text-xs mt-0.5">₹{codPending.toLocaleString('en-IN')} from {MOCK_PAYMENTS.filter(p => p.status === 'pending_cod').length} orders awaiting courier collection confirmation.</p>
          </div>
          <button className="flex-shrink-0 px-4 py-2 bg-amber-500/20 hover:bg-amber-500 border border-amber-500/40 text-amber-300 hover:text-white rounded-xl text-xs font-bold transition-all">
            View COD Orders
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID or description..." className="w-full pl-9 pr-4 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'order', 'payout', 'pending_cod', 'cod_failed'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all capitalize whitespace-nowrap ${filter === s ? 'bg-emerald-600 text-white' : 'bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white'}`}>
              {s === 'pending_cod' ? 'COD Pending' : s === 'cod_failed' ? 'COD Failed' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
          <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)} className="px-3 py-2 rounded-xl text-xs bg-slate-800/60 border border-slate-700/50 text-slate-400 focus:outline-none">
            {['All Methods', 'UPI', 'Bank Transfer', 'COD', 'Wallet'].map(m => <option key={m} value={m === 'All Methods' ? 'All' : m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/60 bg-slate-800/80">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Payment ID</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Description</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Method</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filtered.map(p => {
                const sc = STATUS_CONFIG[p.status] || STATUS_CONFIG.settled;
                const mc = PAYMENT_METHODS[p.method] || PAYMENT_METHODS['Bank Transfer'];
                const isCODPending = p.status === 'pending_cod';
                return (
                  <tr key={p.id} className={`hover:bg-slate-700/20 transition-colors ${isCODPending ? 'bg-amber-500/5' : ''}`}>
                    <td className="px-5 py-4">
                      <div className="font-mono text-xs font-bold text-emerald-400">{p.id}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{p.paymentRef}</div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="text-slate-200 text-sm">{p.description}</div>
                      {p.customer && <div className="text-xs text-slate-500">{p.customer}</div>}
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold ${mc.color}`}>
                        {mc.icon} {p.method}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400 hidden lg:table-cell">{p.date}</td>
                    <td className="px-5 py-4 text-right font-bold text-base">
                      <span className={p.amount < 0 ? 'text-rose-400' : isCODPending ? 'text-amber-400' : 'text-white'}>
                        {p.amount < 0 ? '-' : '+'} ₹{Math.abs(p.amount).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-bold ${sc.color}`}>
                        {sc.icon} {sc.label}
                      </div>
                      {isCODPending && (
                        <button className="ml-2 text-[10px] text-amber-400 hover:text-amber-300 underline transition-colors">Mark Collected</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
        <h3 className="font-bold text-white mb-4">Monthly Summary</h3>
        <div className="space-y-4">
          {MONTH_SUMMARY.map(m => (
            <div key={m.month} className="grid grid-cols-5 gap-3 p-4 bg-slate-700/30 rounded-xl text-sm">
              <div className="col-span-5 sm:col-span-1">
                <p className="font-semibold text-white">{m.month}</p>
                <p className="text-xs text-slate-400">{m.orders} orders</p>
              </div>
              {[['Revenue', `₹${m.revenue.toLocaleString('en-IN')}`, 'text-white'], ['Payouts', `₹${m.payouts.toLocaleString('en-IN')}`, 'text-indigo-400'], ['COD Orders', `${m.cod}`, 'text-amber-400'], ['COD Pending', `${m.codPending}`, m.codPending > 0 ? 'text-rose-400' : 'text-slate-500']].map(([l, v, c]) => (
                <div key={l}><p className="text-[11px] text-slate-500">{l}</p><p className={`font-bold ${c}`}>{v}</p></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerPaymentHistory;
