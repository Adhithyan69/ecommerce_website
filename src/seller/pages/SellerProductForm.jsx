import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Save, Send, ArrowLeft, Calculator, Plus, X } from 'lucide-react';
import { sellerProductsAPI } from '../services/sellerAPI';
import useSellerStore from '../store/useSellerStore';

const CATEGORIES = ['Electronics', 'Accessories', 'Gaming', 'Health', 'Home', 'Office', 'Fashion', 'Beauty', 'Sports'];

const SellerProductForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addProduct, updateProduct } = useSellerStore();
  const prefill = location.state?.prefill;
  const editProduct = location.state?.product;

  const isEdit = !!editProduct;
  const isResubmit = editProduct?.status === 'rejected';

  const [form, setForm] = useState({
    name: '', description: '', image: '', category: 'Electronics', costPrice: '', sellingPrice: '', tags: [], variants: [],
    ...(prefill || {}),
    ...(editProduct || {}),
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const profit = form.sellingPrice && form.costPrice ? Number(form.sellingPrice) - Number(form.costPrice) : 0;
  const margin = profit > 0 && form.sellingPrice ? ((profit / form.sellingPrice) * 100).toFixed(1) : 0;

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      set('tags', [...form.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleDraft = async () => {
    setSaving(true);
    if (isEdit) {
      await sellerProductsAPI.update(editProduct.id, { ...form, status: 'draft' });
      updateProduct(editProduct.id, { ...form, status: 'draft' });
    } else {
      const created = await sellerProductsAPI.create({ ...form, status: 'draft' });
      addProduct(created);
    }
    setSaving(false);
    navigate('/seller/products');
  };

  const handleSubmit = async () => {
    if (!form.name || !form.sellingPrice || !form.costPrice) return;
    setSubmitting(true);
    if (isEdit && isResubmit) {
      const updated = await sellerProductsAPI.resubmit(editProduct.id, { ...form });
      updateProduct(editProduct.id, { ...updated });
    } else if (isEdit) {
      await sellerProductsAPI.update(editProduct.id, { ...form, status: 'pending_approval' });
      updateProduct(editProduct.id, { ...form, status: 'pending_approval' });
    } else {
      const created = await sellerProductsAPI.create({ ...form });
      addProduct(created);
    }
    setSubmitting(false);
    navigate('/seller/products');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">
            {isResubmit ? 'Edit & Resubmit Product' : isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {isResubmit ? 'Fix the issues and resubmit for admin approval' : 'Submit for admin review before going live'}
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-6 text-sm text-amber-300 flex items-start gap-2">
        <span className="text-base">ℹ️</span>
        <span>Your product will be reviewed by an admin before going live. You'll receive a notification once it's approved or rejected.</span>
      </div>

      <div className="space-y-5">
        {/* Basic Info */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 space-y-4">
          <h2 className="font-bold text-white">Product Information</h2>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Product Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Wireless Bluetooth Earbuds Pro" className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-all" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} placeholder="Describe your product..." className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 resize-none transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/60 transition-all">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Image URL</label>
              <input value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-all" />
            </div>
          </div>
          {form.image && <img src={form.image} alt="Preview" className="w-28 h-28 object-cover rounded-xl" onError={e => e.target.style.display='none'} />}
        </div>

        {/* Pricing — This is the most important section */}
        <div className="bg-slate-800/60 border border-emerald-500/20 rounded-2xl p-5 space-y-4">
          <h2 className="font-bold text-white flex items-center gap-2"><Calculator size={16} className="text-emerald-400" /> Pricing & Profit</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Supplier Cost Price (₹) *</label>
              <input type="number" value={form.costPrice} onChange={e => set('costPrice', e.target.value)} placeholder="850" className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Your Selling Price (₹) *</label>
              <input type="number" value={form.sellingPrice} onChange={e => set('sellingPrice', e.target.value)} placeholder="1799" className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-all" />
            </div>
          </div>

          {/* Auto Profit Calculation */}
          {profit !== 0 && (
            <div className="grid grid-cols-3 gap-3">
              <div className={`text-center p-3 rounded-xl ${profit > 0 ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-rose-500/10 border border-rose-500/20'}`}>
                <div className="text-xs text-slate-400 mb-1">Profit per Sale</div>
                <div className={`text-lg font-bold ${profit > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>₹{profit.toLocaleString('en-IN')}</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <div className="text-xs text-slate-400 mb-1">Profit Margin</div>
                <div className="text-lg font-bold text-indigo-400">{margin}%</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-slate-700/40 border border-slate-600/30">
                <div className="text-xs text-slate-400 mb-1">Break Even</div>
                <div className="text-sm font-bold text-white">₹{form.costPrice}</div>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 space-y-3">
          <h2 className="font-bold text-white">Tags</h2>
          <div className="flex gap-2">
            <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add tag and press Enter" className="flex-1 bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-all" />
            <button onClick={addTag} className="px-3 py-2.5 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 rounded-xl hover:bg-emerald-600 hover:text-white text-sm transition-all"><Plus size={16} /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map(t => (
              <span key={t} className="flex items-center gap-1.5 px-3 py-1 bg-slate-700 text-white text-xs rounded-lg">
                {t}
                <button onClick={() => set('tags', form.tags.filter(x => x !== t))} className="text-slate-400 hover:text-rose-400"><X size={11} /></button>
              </span>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <button onClick={handleDraft} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50">
            <Save size={16} /> {saving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button onClick={handleSubmit} disabled={submitting || !form.name || !form.sellingPrice || !form.costPrice} className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all disabled:opacity-40">
            <Send size={16} /> {submitting ? 'Submitting...' : isResubmit ? 'Resubmit for Approval' : 'Submit for Approval'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerProductForm;
