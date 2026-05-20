import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, GripVertical } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import AdminModal from '../components/AdminModal';
import { adminBannersAPI } from '../services/adminAPI';

const EMPTY_BANNER = { title: '', subtitle: '', image: '', link: '', status: 'draft', order: 1 };

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_BANNER);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { adminBannersAPI.getAll().then(r => { setBanners(r.banners); setLoading(false); }); }, []);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openEdit = (b) => { setForm(b); setModal('edit'); };
  const openAdd = () => { setForm(EMPTY_BANNER); setModal('add'); };

  const handleSave = async () => {
    setSaving(true);
    if (modal === 'edit' && form.id) {
      await adminBannersAPI.update(form.id, form);
      setBanners(bs => bs.map(b => b.id === form.id ? form : b));
    } else {
      const created = await adminBannersAPI.create(form);
      setBanners(bs => [...bs, { ...form, id: created.id }]);
    }
    setSaving(false);
    setModal(null);
  };

  const handleDelete = async (id) => {
    await adminBannersAPI.delete(id);
    setBanners(bs => bs.filter(b => b.id !== id));
  };

  const toggleStatus = (b) => {
    const ns = b.status === 'active' ? 'draft' : 'active';
    setBanners(bs => bs.map(x => x.id === b.id ? { ...x, status: ns } : x));
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Homepage Banners</h1>
          <p className="text-slate-400 text-sm mt-1">Control what appears in the hero slider</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all">
          <Plus size={16} /> Add Banner
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? [...Array(2)].map((_, i) => <div key={i} className="h-40 skeleton rounded-2xl" />) :
          banners.sort((a, b) => a.order - b.order).map(banner => (
            <div key={banner.id} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden flex flex-col sm:flex-row hover:border-indigo-500/30 transition-all">
              <div className="relative w-full sm:w-64 h-36 sm:h-auto flex-shrink-0">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-end p-3">
                  <StatusBadge status={banner.status} />
                </div>
              </div>
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-lg">{banner.title}</h3>
                    <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded-lg font-mono">Order: {banner.order}</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">{banner.subtitle}</p>
                  <p className="text-xs text-indigo-400 mt-1 font-mono">→ {banner.link}</p>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <button onClick={() => toggleStatus(banner)} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
                    {banner.status === 'active' ? <ToggleRight size={20} className="text-indigo-400" /> : <ToggleLeft size={20} />}
                    {banner.status === 'active' ? 'Live' : 'Draft'}
                  </button>
                  <button onClick={() => openEdit(banner)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-lg text-sm transition-all">
                    <Edit2 size={13} /> Edit
                  </button>
                  <button onClick={() => handleDelete(banner.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-rose-600 text-slate-400 hover:text-white rounded-lg text-sm transition-all">
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <AdminModal open={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Add New Banner' : 'Edit Banner'} size="md">
        <div className="space-y-4">
          {[['Title', 'title', 'text', 'e.g. Spring Sale 2026'], ['Subtitle', 'subtitle', 'text', 'e.g. Up to 50% off'], ['Image URL', 'image', 'text', 'https://...'], ['Link', 'link', 'text', '/offers']].map(([label, key, type, placeholder]) => (
            <div key={key}>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">{label}</label>
              <input type={type} value={form[key] || ''} onChange={e => set(key, e.target.value)} placeholder={placeholder} className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Display Order</label>
              <input type="number" value={form.order} onChange={e => set('order', Number(e.target.value))} className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all">
                <option value="active">Active (Live)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>
          {form.image && <img src={form.image} alt="Preview" className="w-full h-32 object-cover rounded-xl" onError={e => e.target.style.display='none'} />}
          <div className="flex gap-3">
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-all">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50">
              {saving ? 'Saving...' : modal === 'add' ? 'Add Banner' : 'Update Banner'}
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default AdminBanners;
