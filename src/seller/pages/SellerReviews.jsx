import React, { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';
import { sellerReviewsAPI } from '../services/sellerAPI';

const SellerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});
  const [doing, setDoing] = useState(null);
  useEffect(() => { sellerReviewsAPI.getAll().then(r => { setReviews(r.reviews); setLoading(false); }); }, []);
  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : 0;

  const handleReply = async (id) => {
    const text = replyText[id];
    if (!text?.trim()) return;
    setDoing(id);
    await sellerReviewsAPI.reply(id, text);
    setReviews(rs => rs.map(r => r.id === id ? { ...r, replied: true, reply: text } : r));
    setDoing(null);
    setReplyText(t => ({ ...t, [id]: '' }));
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Product Reviews</h1><p className="text-slate-400 text-sm mt-1">{reviews.length} total reviews — ⭐ {avgRating} avg rating</p></div>
      </div>
      {/* Rating Summary */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 flex items-center gap-6">
        <div className="text-center">
          <div className="text-5xl font-black text-white">{avgRating}</div>
          <div className="flex items-center justify-center gap-0.5 mt-1">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < Math.round(avgRating) ? 'currentColor' : 'none'} className={i < Math.round(avgRating) ? 'text-yellow-400' : 'text-slate-600'} />)}
          </div>
          <div className="text-xs text-slate-400 mt-1">{reviews.length} reviews</div>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map(star => {
            const count = reviews.filter(r => r.rating === star).length;
            const pct = reviews.length ? (count / reviews.length * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 w-4">{star}</span>
                <Star size={10} fill="currentColor" className="text-yellow-400" />
                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} /></div>
                <span className="text-slate-400 w-4 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? [...Array(2)].map((_, i) => <div key={i} className="h-32 skeleton rounded-2xl" />) :
          reviews.map(r => (
            <div key={r.id} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">{r.customer.charAt(0)}</div>
                  <div>
                    <div className="font-semibold text-white text-sm">{r.customer}</div>
                    <div className="text-xs text-slate-400">{r.product} · {r.date}</div>
                  </div>
                </div>
                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={13} fill={i < r.rating ? 'currentColor' : 'none'} className={i < r.rating ? 'text-yellow-400' : 'text-slate-600'} />)}</div>
              </div>
              <p className="text-slate-300 text-sm">{r.text}</p>
              {r.replied && r.reply && (
                <div className="ml-4 pl-4 border-l-2 border-emerald-500/30">
                  <div className="text-xs text-emerald-400 font-semibold mb-1">Your Reply</div>
                  <p className="text-slate-400 text-sm">{r.reply}</p>
                </div>
              )}
              {!r.replied && (
                <div className="flex gap-2 pt-2 border-t border-slate-700/40">
                  <input value={replyText[r.id] || ''} onChange={e => setReplyText(t => ({ ...t, [r.id]: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleReply(r.id)} placeholder="Write a reply..." className="flex-1 bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-all" />
                  <button onClick={() => handleReply(r.id)} disabled={doing === r.id} className="w-9 h-9 bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-50"><Send size={14} /></button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default SellerReviews;
