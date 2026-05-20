import React from 'react';

const STATUS_CONFIGS = {
  // Orders
  'Delivered': { bg: 'bg-emerald-500/15 border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  'Shipped': { bg: 'bg-blue-500/15 border-blue-500/30', text: 'text-blue-400', dot: 'bg-blue-400' },
  'Processing': { bg: 'bg-amber-500/15 border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400' },
  'Cancelled': { bg: 'bg-rose-500/15 border-rose-500/30', text: 'text-rose-400', dot: 'bg-rose-400' },
  // Products
  'active': { bg: 'bg-emerald-500/15 border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  'low_stock': { bg: 'bg-amber-500/15 border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400' },
  'out_of_stock': { bg: 'bg-rose-500/15 border-rose-500/30', text: 'text-rose-400', dot: 'bg-rose-400' },
  'draft': { bg: 'bg-slate-500/15 border-slate-500/30', text: 'text-slate-400', dot: 'bg-slate-400' },
  // Tickets
  'Open': { bg: 'bg-rose-500/15 border-rose-500/30', text: 'text-rose-400', dot: 'bg-rose-400' },
  'In Progress': { bg: 'bg-amber-500/15 border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400' },
  'Resolved': { bg: 'bg-emerald-500/15 border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  // Coupons/Banners
  'expired': { bg: 'bg-slate-500/15 border-slate-500/30', text: 'text-slate-400', dot: 'bg-slate-400' },
  // Users
  'blocked': { bg: 'bg-rose-500/15 border-rose-500/30', text: 'text-rose-400', dot: 'bg-rose-400' },
  // Reviews
  'pending': { bg: 'bg-amber-500/15 border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400' },
  'approved': { bg: 'bg-emerald-500/15 border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  'rejected': { bg: 'bg-rose-500/15 border-rose-500/30', text: 'text-rose-400', dot: 'bg-rose-400' },
  'flagged': { bg: 'bg-orange-500/15 border-orange-500/30', text: 'text-orange-400', dot: 'bg-orange-400' },
  // Priority
  'High': { bg: 'bg-rose-500/15 border-rose-500/30', text: 'text-rose-400', dot: 'bg-rose-400' },
  'Medium': { bg: 'bg-amber-500/15 border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400' },
  'Low': { bg: 'bg-slate-500/15 border-slate-500/30', text: 'text-slate-400', dot: 'bg-slate-400' },
};

const StatusBadge = ({ status, showDot = true }) => {
  const cfg = STATUS_CONFIGS[status] || { bg: 'bg-slate-500/10 border-slate-500/20', text: 'text-slate-400', dot: 'bg-slate-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide border ${cfg.bg} ${cfg.text}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
      {status}
    </span>
  );
};

export default StatusBadge;
