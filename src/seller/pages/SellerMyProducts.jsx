import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, AlertTriangle, CheckCircle, Clock, XCircle, Eye, RotateCcw } from 'lucide-react';
import { sellerProductsAPI } from '../services/sellerAPI';

const STATUS_CONFIG = {
  approved:         { label: 'Approved', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', icon: <CheckCircle size={12} /> },
  pending_approval: { label: 'Pending Review', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', icon: <Clock size={12} /> },
  rejected:         { label: 'Rejected', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', icon: <XCircle size={12} /> },
  draft:            { label: 'Draft', color: 'text-slate-400 bg-slate-500/10 border-slate-500/30', icon: <Edit2 size={12} /> },
  inactive:         { label: 'Inactive', color: 'text-gray-400 bg-gray-500/10 border-gray-500/30', icon: <Eye size={12} /> },
};

const FILTERS = ['All', 'approved', 'pending_approval', 'rejected', 'draft'];

const SellerMyProducts = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => { sellerProductsAPI.getAll().then(r => { setProducts(r.products); setLoading(false); }); }, []);

  const filtered = products.filter(p => filter === 'All' || p.status === filter);

  const handleDelete = async (id) => {
    await sellerProductsAPI.delete(id);
    setProducts(ps => ps.filter(p => p.id !== id));
  };

  const handleToggle = async (p) => {
    if (p.status !== 'approved') return;
    await sellerProductsAPI.toggleEnabled(p.id, !p.enabled);
    setProducts(ps => ps.map(x => x.id === p.id ? { ...x, enabled: !x.enabled } : x));
  };

  const counts = FILTERS.slice(1).reduce((a, s) => ({ ...a, [s]: products.filter(p => p.status === s).length }), {});

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Products</h1>
          <p className="text-slate-400 text-sm mt-1">{products.length} total products</p>
        </div>
        <Link to="/seller/products/new" className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter('All')} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${filter === 'All' ? 'bg-emerald-600 text-white' : 'bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white'}`}>
          All ({products.length})
        </button>
        {FILTERS.slice(1).map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all capitalize ${filter === s ? 'bg-emerald-600 text-white' : 'bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white'}`}>
            {STATUS_CONFIG[s]?.label} {counts[s] > 0 && `(${counts[s]})`}
          </button>
        ))}
      </div>

      {/* Products List */}
      <div className="space-y-3">
        {loading ? [...Array(3)].map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl" />) :
          filtered.map(p => (
            <div key={p.id} className={`bg-slate-800/60 border rounded-2xl p-4 transition-all ${p.status === 'rejected' ? 'border-rose-500/30' : p.status === 'pending_approval' ? 'border-amber-500/20' : 'border-slate-700/50 hover:border-emerald-500/20'}`}>
              <div className="flex items-start gap-4">
                <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-white text-sm">{p.name}</h3>
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-bold flex-shrink-0 ${STATUS_CONFIG[p.status]?.color}`}>
                      {STATUS_CONFIG[p.status]?.icon}
                      {STATUS_CONFIG[p.status]?.label}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-400">
                    <span>Cost: <span className="text-rose-400 font-semibold">₹{p.costPrice}</span></span>
                    <span>Selling:{' '}
                      {p.adminPrice ? (
                        <><span className="text-slate-500 line-through">₹{p.sellingPrice}</span>{' '}<span className="text-white font-semibold">₹{p.adminPrice} <span className="text-[10px] text-indigo-400">(Admin)</span></span></>
                      ) : (
                        <span className="text-emerald-400 font-semibold">₹{p.sellingPrice}</span>
                      )}
                    </span>
                    <span>Profit: <span className="text-emerald-400 font-semibold">₹{p.profit}</span></span>
                    {p.status === 'approved' && <span>Sold: <span className="text-white font-semibold">{p.sold}</span></span>}
                  </div>

                  {/* Rejection Reason */}
                  {p.status === 'rejected' && p.rejectionReason && (
                    <div className="mt-2 flex items-start gap-2 px-3 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                      <AlertTriangle size={12} className="text-rose-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-rose-300">{p.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700/50">
                {p.status === 'approved' && (
                  <button onClick={() => handleToggle(p)} className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${p.enabled ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}>
                    {p.enabled ? <ToggleRight size={18} className="text-emerald-400" /> : <ToggleLeft size={18} />}
                    {p.enabled ? 'Live' : 'Disabled'}
                  </button>
                )}
                {(p.status === 'rejected' || p.status === 'draft') && (
                  <Link to={`/seller/products/${p.id}/edit`} state={{ product: p }} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-600 border border-amber-500/30 text-amber-400 hover:text-white rounded-lg text-xs font-semibold transition-all">
                    <RotateCcw size={12} /> {p.status === 'rejected' ? 'Edit & Resubmit' : 'Edit & Submit'}
                  </Link>
                )}
                {(p.status === 'approved' || p.status === 'pending_approval') && (
                  <Link to={`/seller/products/${p.id}/edit`} state={{ product: p }} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-600 text-slate-400 hover:text-white rounded-lg text-xs font-semibold transition-all">
                    <Edit2 size={12} /> Edit
                  </Link>
                )}
                <button onClick={() => handleDelete(p.id)} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 text-rose-400 hover:text-white rounded-lg text-xs font-semibold transition-all">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SellerMyProducts;
