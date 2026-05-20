import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Flag, Star } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { adminReviewsAPI } from '../services/adminAPI';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [busy, setBusy] = useState(null);

  useEffect(() => { adminReviewsAPI.getAll().then(r => { setReviews(r.reviews); setLoading(false); }); }, []);

  const filtered = reviews.filter(r => filter === 'All' || r.status === filter.toLowerCase());

  const act = async (id, action) => {
    setBusy(id);
    if (action === 'approve') await adminReviewsAPI.approve(id);
    else await adminReviewsAPI.reject(id);
    setReviews(rs => rs.map(r => r.id === id ? { ...r, status: action === 'approve' ? 'approved' : 'rejected' } : r));
    setBusy(null);
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Review Moderation</h1>
          <p className="text-slate-400 text-sm mt-1">{reviews.filter(r => r.status === 'pending').length} pending reviews</p>
        </div>
      </div>

      <div className="flex gap-2">
        {['All', 'Pending', 'Approved', 'Rejected', 'Flagged'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${filter === s ? 'bg-indigo-600 text-white' : 'bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white'}`}>{s}</button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? [...Array(3)].map((_, i) => <div key={i} className="h-32 skeleton rounded-2xl" />) :
          filtered.map(r => (
            <div key={r.id} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 hover:border-indigo-500/20 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">{r.user.charAt(0)}</div>
                    <div>
                      <span className="font-semibold text-white text-sm">{r.user}</span>
                      <span className="text-slate-400 text-xs ml-2">on {r.product}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < r.rating ? 'currentColor' : 'none'} className={i < r.rating ? 'text-yellow-400' : 'text-slate-600'} />)}
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-2">{r.review}</p>
                  <p className="text-xs text-slate-500">{r.date}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>

              {r.status === 'pending' || r.status === 'flagged' ? (
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700/50">
                  <button onClick={() => act(r.id, 'approve')} disabled={busy === r.id} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-600/30 text-emerald-400 hover:text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50">
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button onClick={() => act(r.id, 'reject')} disabled={busy === r.id} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-rose-600/20 hover:bg-rose-600 border border-rose-600/30 text-rose-400 hover:text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50">
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              ) : null}
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminReviews;
