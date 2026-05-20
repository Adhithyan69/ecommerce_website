import React, { useState } from 'react';

/**
 * SVG Line/Area Chart — no dependencies needed
 * Props: data = [{ label, revenue, orders }], height
 */
const ChartLine = ({ data = [], height = 180, color = '#6366F1', secondColor = '#8B5CF6', showArea = true }) => {
  const [hovered, setHovered] = useState(null);
  if (!data.length) return null;

  const W = 600;
  const H = height;
  const PAD = { top: 20, right: 20, bottom: 30, left: 50 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const values = data.map(d => d.revenue || d.value || 0);
  const maxV = Math.max(...values, 1);
  const minV = 0;

  const xScale = (i) => PAD.left + (i / (data.length - 1)) * chartW;
  const yScale = (v) => PAD.top + chartH - ((v - minV) / (maxV - minV)) * chartH;

  const points = data.map((d, i) => ({ x: xScale(i), y: yScale(d.revenue || d.value || 0), ...d }));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaD = `${pathD} L ${points[points.length-1].x.toFixed(1)} ${(PAD.top + chartH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(PAD.top + chartH).toFixed(1)} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({ v: minV + t * (maxV - minV), y: yScale(minV + t * (maxV - minV)) }));

  const fmtV = (v) => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : v >= 1000 ? `₹${(v/1000).toFixed(0)}k` : `₹${v}`;

  return (
    <div className="w-full relative">
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map(({ v, y }) => (
          <g key={v}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#334155" strokeWidth={1} strokeDasharray="4,4" />
            <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize={9} fill="#64748B">{fmtV(v)}</text>
          </g>
        ))}

        {/* X labels */}
        {points.map((p, i) => (
          <text key={i} x={p.x} y={H - 4} textAnchor="middle" fontSize={9} fill="#64748B">{p.month || p.day || p.label || i}</text>
        ))}

        {/* Area fill */}
        {showArea && <path d={areaD} fill="url(#lineAreaGrad)" />}

        {/* Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots + hover */}
        {points.map((p, i) => (
          <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <circle cx={p.x} cy={p.y} r={hovered === i ? 6 : 4} fill={color} stroke="white" strokeWidth={2} className="transition-all duration-150 cursor-pointer" />
            <rect x={p.x - 20} y={p.y - 20} width={40} height={40} fill="transparent" />
            {hovered === i && (
              <g>
                <rect x={p.x - 40} y={p.y - 38} width={80} height={26} rx={5} fill="#1E293B" stroke="#334155" strokeWidth={1} />
                <text x={p.x} y={p.y - 22} textAnchor="middle" fontSize={10} fill="white" fontWeight="600">{fmtV(p.revenue || p.value || 0)}</text>
                <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize={9} fill="#94A3B8">{p.month || p.day || p.label}</text>
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default ChartLine;
