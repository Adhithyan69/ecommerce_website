import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Edit2, Eye, AlertTriangle, Tag, User } from 'lucide-react';
import AdminModal from '../components/AdminModal';
import StatusBadge from '../components/StatusBadge';
import { adminProductRequestsAPI } from '../../seller/services/sellerAPI';

const AdminProductRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [viewRequest, setViewRequest] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [editForm, setEditForm] = useState({ adminPrice: '', commission: 0 });
  const [rejectReason, setRejectReason] = useState('');
  const [busy, setBusy] = useState(null);

  useEffect(() => { adminProductRequestsAPI.getAll().then(r => { setRequests(r.requests); setLoading(false); }); }, []);

  const filtered = requests.filter(r => filter === 'All' || r.status === filter);
  const pendingCount = requests.filter(r => r.status === 'pending_approval').length;

  const handleApprove = async (req, { adminPrice, commission } = {}) => {
    setBusy(req.id + '-approve');
    await adminProductRequestsAPI.approve(req.id, { adminPrice: adminPrice || null, commission: commission || 0 });
    setRequests(rs => rs.map(r => r.id === req.id ? { ...r, status: 'approved', adminPrice: adminPrice || null, commission: commission || 0 } : r));
    setViewRequest(null);
    setEditModal(false);
    setBusy(null);
  };

  const handleReject = async (req) => {
    if (!rejectReason.trim()) return;
    setBusy(req.id + '-reject');
    await adminProductRequestsAPI.reject(req.id, rejectReason);
    setRequests(rs => rs.map(r => r.id === req.id ? { ...r, status: 'rejected', rejectionReason: rejectReason } : r));
    setRejectModal(false);
    setViewRequest(null);
    setRejectReason('');
    setBusy(null);
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-3">
            Product Requests
            {pendingCount > 0 && <span className="px-2.5 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">{pendingCount} pending</span>}
          </h1>
          <p className="text-slate-400 text-sm mt-1">Review, approve, or reject seller product submissions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['All', 'pending_approval', 'approved', 'rejected'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all capitalize ${filter === s ? 'bg-indigo-600 text-white' : 'bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white'}`}>
            {s === 'pending_approval' ? 'Pending Review' : s} {s !== 'All' && `(${requests.filter(r => r.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Product Requests List */}
      <div className="space-y-3">
        {loading ? [...Array(3)].map((_, i) => <div key={i} className="h-36 skeleton rounded-2xl" />) :
          filtered.map(req => (
            <div key={req.id} className={`bg-slate-800/60 rounded-2xl border transition-all ${req.status === 'pending_approval' ? 'border-amber-500/30 shadow-sm shadow-amber-500/5' : 'border-slate-700/50'}`}>
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <img src={req.image} alt={req.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-white">{req.name}</h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                          <User size={11} />
                          <span>{req.sellerName} · {req.sellerEmail}</span>
                          <span className="text-slate-600">·</span>
                          <Tag size={11} />
                          <span>{req.category}</span>
                        </div>
                      </div>
                      <StatusBadge status={req.status === 'pending_approval' ? 'pending' : req.status} />
                    </div>

                    <p className="text-slate-400 text-sm line-clamp-2 mb-3">{req.description}</p>

                    {/* Pricing */}
                    <div className="flex gap-3 flex-wrap text-xs">
                      <div className="bg-slate-700/40 px-3 py-1.5 rounded-lg"><span className="text-slate-400">Cost: </span><span className="font-bold text-rose-400">₹{req.costPrice}</span></div>
                      <div className="bg-slate-700/40 px-3 py-1.5 rounded-lg"><span className="text-slate-400">Seller Price: </span><span className="font-bold text-white">₹{req.sellingPrice}</span></div>
                      {req.adminPrice && <div className="bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg"><span className="text-slate-400">Admin Price: </span><span className="font-bold text-indigo-400">₹{req.adminPrice}</span></div>}
                      <div className="bg-emerald-500/10 px-3 py-1.5 rounded-lg"><span className="text-slate-400">Profit: </span><span className="font-bold text-emerald-400">₹{(req.sellingPrice - req.costPrice).toLocaleString('en-IN')}</span></div>
                    </div>

                    {/* Tags */}
                    {req.tags?.length > 0 && (
                      <div className="flex gap-1.5 mt-3 flex-wrap">
                        {req.tags.map(t => <span key={t} className="px-2 py-0.5 bg-slate-700 text-slate-300 text-[10px] rounded-lg">{t}</span>)}
                      </div>
                    )}

                    <div className="text-xs text-slate-500 mt-2">Submitted: {req.submittedAt}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                {req.status === 'pending_approval' && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700/50">
                    {/* Quick Approve */}
                    <button
                      onClick={() => handleApprove(req)}
                      disabled={busy === req.id + '-approve'}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-600/30 text-emerald-400 hover:text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                    >
                      <CheckCircle size={14} /> Approve
                    </button>

                    {/* Approve with Price Override */}
                    <button
                      onClick={() => { setViewRequest(req); setEditForm({ adminPrice: req.sellingPrice, commission: 0 }); setEditModal(true); }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-600/30 text-indigo-400 hover:text-white rounded-xl text-sm font-semibold transition-all"
                    >
                      <Edit2 size={14} /> Edit & Approve
                    </button>

                    {/* Reject */}
                    <button
                      onClick={() => { setViewRequest(req); setRejectModal(true); }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-rose-600/20 hover:bg-rose-600 border border-rose-600/30 text-rose-400 hover:text-white rounded-xl text-sm font-semibold transition-all"
                    >
                      <XCircle size={14} /> Reject
                    </button>

                    {/* View Full */}
                    <button
                      onClick={() => setViewRequest(req)}
                      className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-slate-700/60 hover:bg-slate-600 text-slate-400 hover:text-white rounded-xl text-sm transition-all"
                    >
                      <Eye size={14} /> View
                    </button>
                  </div>
                )}

                {req.status === 'approved' && (
                  <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-emerald-400"><CheckCircle size={13} /> Product is now live</div>
                    {req.commission > 0 && <span className="text-xs text-indigo-400">Commission: {req.commission}%</span>}
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* Edit & Approve Modal */}
      <AdminModal open={editModal} onClose={() => setEditModal(false)} title="Edit & Approve Product" size="md">
        {viewRequest && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-700/40 rounded-xl">
              <img src={viewRequest.image} alt={viewRequest.name} className="w-12 h-12 rounded-lg object-cover" />
              <div><div className="font-semibold text-white text-sm">{viewRequest.name}</div><div className="text-xs text-slate-400">{viewRequest.sellerName}</div></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700/30 rounded-xl p-3"><div className="text-xs text-slate-400 mb-1">Supplier Cost</div><div className="font-bold text-rose-400">₹{viewRequest.costPrice}</div></div>
              <div className="bg-slate-700/30 rounded-xl p-3"><div className="text-xs text-slate-400 mb-1">Seller's Price</div><div className="font-bold text-white">₹{viewRequest.sellingPrice}</div></div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Admin Selling Price (₹) <span className="text-indigo-400 normal-case font-normal">— overrides seller price if set</span></label>
              <input type="number" value={editForm.adminPrice} onChange={e => setEditForm(f => ({ ...f, adminPrice: e.target.value }))} className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Platform Commission (%)</label>
              <input type="number" value={editForm.commission} onChange={e => setEditForm(f => ({ ...f, commission: e.target.value }))} min={0} max={50} placeholder="0" className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
            </div>

            {editForm.adminPrice && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-sm">
                <div className="text-slate-400 mb-1 text-xs">Profit after commission:</div>
                <div className="font-bold text-emerald-400">
                  ₹{(editForm.adminPrice - viewRequest.costPrice - (editForm.adminPrice * editForm.commission / 100)).toFixed(0)} per sale
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditModal(false)} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-all">Cancel</button>
              <button onClick={() => handleApprove(viewRequest, { adminPrice: Number(editForm.adminPrice), commission: Number(editForm.commission) })} disabled={busy === viewRequest.id + '-approve'} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-all">
                {busy === viewRequest.id + '-approve' ? 'Approving...' : 'Approve Product'}
              </button>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Reject Modal */}
      <AdminModal open={rejectModal} onClose={() => setRejectModal(false)} title="Reject Product" size="sm">
        {viewRequest && (
          <div className="space-y-4">
            <div className="flex items-start gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <AlertTriangle size={14} className="text-rose-400 flex-shrink-0 mt-0.5" />
              <p className="text-rose-300 text-sm">The seller will see this reason and can edit + resubmit.</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Rejection Reason *</label>
              <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} placeholder="e.g. Price too high. Suggest max ₹1,299. Please resubmit." className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-rose-500/60 resize-none transition-all" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setRejectModal(false)} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-all">Cancel</button>
              <button onClick={() => handleReject(viewRequest)} disabled={!rejectReason.trim() || busy === viewRequest.id + '-reject'} className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold disabled:opacity-40 transition-all">
                Reject Product
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
};

export default AdminProductRequests;
