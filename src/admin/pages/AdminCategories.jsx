import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import AdminModal from '../components/AdminModal';
import StatusBadge from '../components/StatusBadge';
import { adminCategoriesAPI } from '../services/adminAPI';

const EMPTY = { name: '', slug: '', icon: '📦', status: 'active' };

const AdminCategories = () => {
  const [cats, setCats] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { adminCategoriesAPI.getAll().then(r => { setCats(r.categories); setLoading(false); }); }, []);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const autoSlug = (name) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleSave = async () => {
    setSaving(true);
    if (form.id) {
      await adminCategoriesAPI.update(form.id, form);
      setCats(cs => cs.map(c => c.id === form.id ? form : c));
    } else {
      const created = await adminCategoriesAPI.create(form);
      setCats(cs => [...cs, { ...created, products: 0 }]);
    }
    setSaving(false);
    setModal(null);
  };

  const handleDelete = async (id) => {
    await adminCategoriesAPI.delete(id);
    setCats(cs => cs.filter(c => c.id !== id));
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Categories</h1>
          <p className="text-slate-400 text-sm mt-1">{cats.length} categories</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setModal('add'); }} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? [...Array(4)].map((_, i) => <div key={i} className="h-32 skeleton rounded-2xl" />) :
          cats.map(c => (
            <div key={c.id} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 hover:border-indigo-500/30 transition-all group">
              <div className="text-3xl mb-3">{c.icon}</div>
              <h3 className="font-bold text-white mb-1">{c.name}</h3>
              <p className="text-xs text-slate-400 font-mono mb-2">/{c.slug}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{c.products} products</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setForm(c); setModal('edit'); }} className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-indigo-600 text-slate-400 hover:text-white flex items-center justify-center transition-all">
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-rose-600 text-slate-400 hover:text-white flex items-center justify-center transition-all">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <AdminModal open={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Add Category' : 'Edit Category'} size="sm">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Icon (Emoji)</label>
            <input value={form.icon} onChange={e => set('icon', e.target.value)} className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-2xl text-center focus:outline-none focus:border-indigo-500/60 transition-all" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Name</label>
            <input value={form.name} onChange={e => { set('name', e.target.value); if (!form.id) set('slug', autoSlug(e.target.value)); }} placeholder="Category name" className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Slug</label>
            <input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="url-slug" className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-all">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50">
              {saving ? 'Saving...' : form.id ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default AdminCategories;
