import React, { useState } from 'react';
import { Tag, Plus, Copy, Trash2, Share2 } from 'lucide-react';

const SAMPLE_COUPONS = [
  { code: 'WELCOME20', type: 'percent', value: 20, minOrder: 500, used: 12, maxUses: 100, expiry: '2026-04-30', active: true },
  { code: 'FLAT100', type: 'flat', value: 100, minOrder: 1000, used: 5, maxUses: 50, expiry: '2026-03-31', active: false },
];

const SellerMarketing = () => {
  const [coupons, setCoupons] = useState(SAMPLE_COUPONS);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percent', value: '', minOrder: '', maxUses: '', expiry: '' });
  const [copied, setCopied] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCreate = () => {
    if (!form.code || !form.value) return;
    setCoupons(cs => [{ ...form, value: Number(form.value), minOrder: Number(form.minOrder), maxUses: Number(form.maxUses), used: 0, active: true }, ...cs]);
    setForm({ code: '', type: 'percent', value: '', minOrder: '', maxUses: '', expiry: '' });
    setModal(false);
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Marketing Tools</h1><p className="text-slate-400 text-sm mt-1">Grow your sales with coupons and promotions</p></div>
        <button onClick={() => setModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all">
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      {/* Coupons */}
      <div>
        <h2 className="font-bold text-white mb-3">Discount Coupons</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coupons.map((c, i) => (
            <div key={i} className={`bg-slate-800/60 border rounded-2xl p-5 relative overflow-hidden ${c.active ? 'border-emerald-500/30' : 'border-slate-700/50 opacity-60'}`}>
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900" />
              <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-slate-600/40" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-black text-white text-xl tracking-widest">{c.code}</span>
                  <button onClick={() => copyCode(c.code)} className="text-xs text-emerald-400 hover:text-white flex items-center gap-1 transition-colors">
                    {copied === c.code ? '✓ Copied' : <><Copy size={12} /> Copy</>}
                  </button>
                </div>
                <div className={`text-2xl font-black mb-2 ${c.active ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {c.type === 'percent' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                </div>
                <div className="text-xs text-slate-400">Min ₹{c.minOrder} · Expires {c.expiry}</div>
                <div className="mt-3"><div className="h-1.5 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(c.used/c.maxUses)*100}%` }} /></div><div className="text-xs text-slate-500 mt-1">{c.used}/{c.maxUses} uses</div></div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setCoupons(cs => cs.map((x, j) => j === i ? { ...x, active: !x.active } : x))} className={`text-xs px-2 py-1 rounded-lg font-semibold transition-all ${c.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>{c.active ? 'Active' : 'Paused'}</button>
                  <button onClick={() => setCoupons(cs => cs.filter((_, j) => j !== i))} className="ml-auto text-slate-400 hover:text-rose-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Sharing */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
        <h2 className="font-bold text-white mb-4 flex items-center gap-2"><Share2 size={16} className="text-emerald-400" /> Product Sharing</h2>
        <div className="bg-slate-700/40 rounded-xl p-3 flex items-center gap-3">
          <code className="flex-1 text-xs text-slate-300 font-mono truncate">https://shop.anti-gravity.in/products/wireless-earbuds-pro</code>
          <button onClick={() => copyCode('share-link')} className="text-xs text-emerald-400 hover:text-white px-3 py-1.5 bg-emerald-600/20 border border-emerald-500/30 rounded-lg font-semibold transition-all">
            {copied === 'share-link' ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {['📱 WhatsApp', '📘 Facebook', '🐦 Twitter', '📸 Instagram'].map(s => (
            <button key={s} className="px-3 py-1.5 bg-slate-700/60 hover:bg-slate-600 border border-slate-600/40 text-white rounded-lg text-xs font-medium transition-all">{s}</button>
          ))}
        </div>
      </div>

      {/* SEO Fields */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
        <h2 className="font-bold text-white mb-4">SEO Settings</h2>
        <div className="space-y-3">
          {[['Meta Title', 'Best Wireless Earbuds — My Seller Store'], ['Meta Description', 'Shop premium wireless earbuds with 30hr battery life...']].map(([l, ph]) => (
            <div key={l}>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">{l}</label>
              <input placeholder={ph} className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-all" />
            </div>
          ))}
        </div>
      </div>

      {/* Create Coupon Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setModal(false)}>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h2 className="font-bold text-white text-lg">Create Coupon</h2>
            <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Code</label><input value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} placeholder="SUMMER20" className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white font-mono font-bold text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-all uppercase tracking-widest" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Type</label><select value={form.type} onChange={e => set('type', e.target.value)} className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/60 transition-all"><option value="percent">Percent (%)</option><option value="flat">Flat (₹)</option></select></div>
              <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Value</label><input type="number" value={form.value} onChange={e => set('value', e.target.value)} placeholder="20" className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-3 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-all" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Min Order</label><input type="number" value={form.minOrder} onChange={e => set('minOrder', e.target.value)} placeholder="500" className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-3 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-all" /></div>
              <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Max Uses</label><input type="number" value={form.maxUses} onChange={e => set('maxUses', e.target.value)} placeholder="100" className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-3 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-all" /></div>
            </div>
            <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Expiry</label><input type="date" value={form.expiry} onChange={e => set('expiry', e.target.value)} className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/60 transition-all" /></div>
            <div className="flex gap-3"><button onClick={() => setModal(false)} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-all">Cancel</button><button onClick={handleCreate} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all">Create</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerMarketing;
