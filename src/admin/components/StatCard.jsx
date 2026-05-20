import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, change, changeLabel, icon, color = 'indigo', prefix = '', suffix = '', loading = false }) => {
  const colors = {
    indigo: { bg: 'bg-indigo-500/10 border-indigo-500/20', icon: 'text-indigo-400 bg-indigo-500/15', glow: 'shadow-indigo-500/10' },
    emerald: { bg: 'bg-emerald-500/10 border-emerald-500/20', icon: 'text-emerald-400 bg-emerald-500/15', glow: 'shadow-emerald-500/10' },
    amber: { bg: 'bg-amber-500/10 border-amber-500/20', icon: 'text-amber-400 bg-amber-500/15', glow: 'shadow-amber-500/10' },
    rose: { bg: 'bg-rose-500/10 border-rose-500/20', icon: 'text-rose-400 bg-rose-500/15', glow: 'shadow-rose-500/10' },
    purple: { bg: 'bg-purple-500/10 border-purple-500/20', icon: 'text-purple-400 bg-purple-500/15', glow: 'shadow-purple-500/10' },
    cyan: { bg: 'bg-cyan-500/10 border-cyan-500/20', icon: 'text-cyan-400 bg-cyan-500/15', glow: 'shadow-cyan-500/10' },
  };
  const c = colors[color] || colors.indigo;
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <div className={`relative bg-slate-800/60 border ${c.bg} rounded-2xl p-5 hover:bg-slate-700/60 transition-all duration-200 group overflow-hidden shadow-lg ${c.glow}`}>
      {/* Shimmer on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-shine bg-[length:200%_100%] group-hover:animate-shine pointer-events-none rounded-2xl" />

      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <div className={`w-9 h-9 rounded-xl ${c.icon} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
      </div>

      {loading ? (
        <div className="h-8 w-28 skeleton rounded-lg mb-2" />
      ) : (
        <div className="text-2xl font-display font-bold text-white mb-2">
          {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}{suffix}
        </div>
      )}

      {change !== undefined && (
        <div className={`flex items-center gap-1.5 text-xs font-semibold ${isNeutral ? 'text-slate-400' : isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isNeutral ? <Minus size={12} /> : isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{isPositive ? '+' : ''}{change}%</span>
          {changeLabel && <span className="text-slate-500 font-normal">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
