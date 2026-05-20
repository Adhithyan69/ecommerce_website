import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ToggleLeft, ToggleRight, Tag, Zap } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import AdminModal from '../components/AdminModal';
import { adminCouponsAPI } from '../services/adminAPI';

const EMPTY_COUPON = { code: '', type: 'percent', value: '', minOrder: '', maxUses: '', expiry: '', categories: 'All' };

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY_COUPON);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { adminCouponsAPI.getAll().then(r => { setCoupons(r.coupons); setLoading(false); }); }, []);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCreate = async () => {
    if (!form.code || !form.value) return;
    setSaving(true);
    const created = await adminCouponsAPI.create({ ...form, value: Number(form.value), minOrder: Number(form.minOrder), maxUses: Number(form.maxUses) });
    setCoupons(cs => [created, ...cs]);
    setForm(EMPTY_COUPON);
    setModal(false);
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await adminCouponsAPI.delete(id);
    setCoupons(cs => cs.filter(c => c.id !== id));
  };

  const toggleStatus = async (coupon) => {
    const newStatus = coupon.status === 'active' ? 'paused' : 'active';
    await adminCouponsAPI.toggleStatus(coupon.id, newStatus);
    setCoupons(cs => cs.map(c => c.id === coupon.id ? { ...c, status: newStatus } : c));
  };

  const usagePct = (c) => c.maxUses > 0 ? ((c.used / c.maxUses) * 100).toFixed(0) : 0;

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Coupons & Discounts</h1>
          <p className="text-slate-400 text-sm mt-1">{coupons.filter(c => c.status === 'active').length} active coupons</p>
        </div>
        <button onClick={() => setModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all">
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      {/* Coupon Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? [...Array(3)].map((_, i) => <div key={i} className="h-48 skeleton rounded-2xl" />) :
          coupons.map(c => (
            <div key={c.id} className={`bg-slate-800/60 border rounded-2xl p-5 transition-all relative overflow-hidden ${c.status === 'active' ? 'border-indigo-500/30' : 'border-slate-700/50 opacity-70'}`}>
              {/* Dashed divider design */}
              <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-slate-600/50" />
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900" />

              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-indigo-400" />
                    <span className="font-mono font-black text-white text-lg tracking-widest">{c.code}</span>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <div className="text-3xl font-black text-white mb-1">
                  {c.type === 'percent' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                </div>
                <p className="text-xs text-slate-400 mb-4">Min order ₹{c.minOrder} · {c.categories}</p>

                {/* Usage Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>{c.used} used</span>
                    <span>/ {c.maxUses}</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${usagePct(c)}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Expires: {c.expiry}</span>
                  <div className="flex gap-2">
                    <button onClick={() => toggleStatus(c)} className="text-slate-400 hover:text-indigo-400 transition-colors">
                      {c.status === 'active' ? <ToggleRight size={22} className="text-indigo-400" /> : <ToggleLeft size={22} />}
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="text-slate-400 hover:text-rose-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Create Coupon Modal */}
      <AdminModal open={modal} onClose={() => setModal(false)} title="Create New Coupon" size="md">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Coupon Code</label>
            <input value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} placeholder="e.g. SUMMER30" className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white font-mono font-bold text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all uppercase tracking-widest" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)} className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all">
                <option value="percent">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Value</label>
              <input type="number" value={form.value} onChange={e => set('value', e.target.value)} placeholder={form.type === 'percent' ? '20' : '100'} className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Min Order (₹)</label>
              <input type="number" value={form.minOrder} onChange={e => set('minOrder', e.target.value)} placeholder="0" className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Max Uses</label>
              <input type="number" value={form.maxUses} onChange={e => set('maxUses', e.target.value)} placeholder="100" className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Expiry Date</label>
            <input type="date" value={form.expiry} onChange={e => set('expiry', e.target.value)} className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(false)} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-all">Cancel</button>
            <button onClick={handleCreate} disabled={saving} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50">
              {saving ? 'Creating...' : 'Create Coupon'}
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default AdminCoupons;
