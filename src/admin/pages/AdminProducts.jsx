import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Package, ChevronUp, ChevronDown } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import AdminModal from '../components/AdminModal';
import { adminProductsAPI } from '../services/adminAPI';

const CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Books'];

const ProductForm = ({ initial = {}, onSave, onCancel, loading }) => {
  const [form, setForm] = useState({ name: '', category: 'Electronics', price: '', stock: '', image: '', ...initial });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Product Name</label>
        <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Sony WH-1000XM5" className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Category</label>
          <select value={form.category} onChange={e => set('category', e.target.value)} className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Price (₹)</label>
          <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Stock Qty</label>
          <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="0" className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Original Price (₹)</label>
          <input type="number" value={form.originalPrice || ''} onChange={e => set('originalPrice', e.target.value)} placeholder="0 (optional)" className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all" />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Image URL</label>
        <input value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all" />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Description</label>
        <textarea value={form.description || ''} onChange={e => set('description', e.target.value)} rows={3} placeholder="Product description..." className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all resize-none" />
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-all">Cancel</button>
        <button onClick={() => onSave(form)} disabled={loading} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50">
          {loading ? 'Saving...' : initial.id ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </div>
  );
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [modal, setModal] = useState(null); // null | 'add' | product object
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [sortBy, setSortBy] = useState({ key: '', dir: 'asc' });

  useEffect(() => { adminProductsAPI.getAll().then(r => { setProducts(r.products); setLoading(false); }); }, []);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortBy.key) return 0;
    const va = a[sortBy.key], vb = b[sortBy.key];
    return sortBy.dir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
  });

  const toggleSort = (key) => setSortBy(s => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));
  const SortIcon = ({ k }) => sortBy.key === k ? (sortBy.dir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null;

  const handleSave = async (form) => {
    setSaving(true);
    if (modal?.id) {
      const updated = await adminProductsAPI.update(modal.id, form);
      setProducts(ps => ps.map(p => p.id === modal.id ? { ...p, ...form } : p));
    } else {
      const created = await adminProductsAPI.create({ ...form, price: Number(form.price), stock: Number(form.stock) });
      setProducts(ps => [{ ...created, status: Number(form.stock) > 0 ? 'active' : 'out_of_stock', sold: 0, rating: 0 }, ...ps]);
    }
    setSaving(false);
    setModal(null);
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    await adminProductsAPI.delete(id);
    setProducts(ps => ps.filter(p => p.id !== id));
    setDeleting(null);
  };

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const bulkDelete = async () => {
    await Promise.all(selected.map(id => adminProductsAPI.delete(id)));
    setProducts(ps => ps.filter(p => !selected.includes(p.id)));
    setSelected([]);
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Products</h1>
          <p className="text-slate-400 text-sm mt-1">{products.length} products total</p>
        </div>
        <button onClick={() => setModal('add')} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-glow">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-4 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', ...CATEGORIES].map(c => (
            <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${catFilter === c ? 'bg-indigo-600 text-white' : 'bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white'}`}>{c}</button>
          ))}
        </div>
        {selected.length > 0 && (
          <button onClick={bulkDelete} className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all">
            Delete {selected.length} selected
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-700/40 border-b border-slate-700/50">
              <tr className="text-slate-400 text-xs">
                <th className="px-4 py-3 text-left w-8"><input type="checkbox" className="rounded" onChange={e => setSelected(e.target.checked ? filtered.map(p => p.id) : [])} /></th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left cursor-pointer hover:text-white" onClick={() => toggleSort('category')}>
                  <span className="flex items-center gap-1">Category <SortIcon k="category" /></span>
                </th>
                <th className="px-4 py-3 text-right cursor-pointer hover:text-white" onClick={() => toggleSort('price')}>
                  <span className="flex items-center justify-end gap-1">Price <SortIcon k="price" /></span>
                </th>
                <th className="px-4 py-3 text-right cursor-pointer hover:text-white hidden sm:table-cell" onClick={() => toggleSort('stock')}>
                  <span className="flex items-center justify-end gap-1">Stock <SortIcon k="stock" /></span>
                </th>
                <th className="px-4 py-3 text-right hidden md:table-cell cursor-pointer hover:text-white" onClick={() => toggleSort('sold')}>
                  <span className="flex items-center justify-end gap-1">Sold <SortIcon k="sold" /></span>
                </th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}><td colSpan={8} className="px-4 py-4"><div className="h-10 skeleton rounded-lg" /></td></tr>
                ))
              ) : sorted.length === 0 ? (
                <tr><td colSpan={8} className="py-16 text-center text-slate-400"><Package size={32} className="mx-auto mb-2 opacity-30" />No products found</td></tr>
              ) : sorted.map(p => (
                <tr key={p.id} className={`hover:bg-slate-700/20 transition-colors ${selected.includes(p.id) ? 'bg-indigo-500/5' : ''}`}>
                  <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} className="rounded" /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0 bg-slate-700" />
                      <span className="font-medium text-white line-clamp-1 max-w-[160px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{p.category}</td>
                  <td className="px-4 py-3 text-right font-bold text-white">₹{p.price?.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell">
                    <span className={p.stock === 0 ? 'text-rose-400' : p.stock < 10 ? 'text-amber-400' : 'text-slate-300'}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-300 hidden md:table-cell">{p.sold?.toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setModal(p)} className="w-8 h-8 rounded-lg bg-slate-700/60 hover:bg-indigo-600 text-slate-400 hover:text-white flex items-center justify-center transition-all">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="w-8 h-8 rounded-lg bg-slate-700/60 hover:bg-rose-600 text-slate-400 hover:text-white flex items-center justify-center transition-all disabled:opacity-50">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AdminModal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal === 'add' ? 'Add New Product' : 'Edit Product'}
        size="lg"
      >
        {modal !== null && (
          <ProductForm
            initial={modal === 'add' ? {} : modal}
            onSave={handleSave}
            onCancel={() => setModal(null)}
            loading={saving}
          />
        )}
      </AdminModal>
    </div>
  );
};

export default AdminProducts;
