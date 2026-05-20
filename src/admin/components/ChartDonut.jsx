import React, { useState } from 'react';

/**
 * SVG Donut Chart — no dependencies needed
 * Props: data = [{ name, value, color }]
 */
const ChartDonut = ({ data = [], size = 160, thickness = 28, showLegend = true }) => {
  const [hovered, setHovered] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const R = (size / 2) - thickness / 2;
  const circumference = 2 * Math.PI * R;
  const cx = size / 2;
  const cy = size / 2;

  let offset = 0;
  const slices = data.map((d, i) => {
    const pct = d.value / total;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const slice = { ...d, dash, gap, offset: offset * circumference, pct };
    offset += pct;
    return slice;
  });

  const hoveredSlice = hovered !== null ? slices[hovered] : null;

  return (
    <div className={`flex ${showLegend ? 'items-center gap-6' : 'justify-center'} flex-wrap`}>
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          {/* Background ring */}
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="#1E293B" strokeWidth={thickness} />

          {slices.map((s, i) => (
            <circle
              key={i}
              cx={cx} cy={cy} r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={hovered === i ? thickness + 4 : thickness}
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={-(s.offset - circumference * 0.25)}
              strokeLinecap="round"
              className="transition-all duration-300 cursor-pointer"
              style={{ transformOrigin: 'center', transform: hovered === i ? 'scale(1.05)' : 'scale(1)' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <title>{s.name}: {s.value}%</title>
            </circle>
          ))}

          {/* Center text */}
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize={hoveredSlice ? 13 : 18} fill="white" fontWeight="700">
            {hoveredSlice ? `${hoveredSlice.value}%` : `${total}%`}
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize={9} fill="#64748B">
            {hoveredSlice ? hoveredSlice.name : 'Total'}
          </text>
        </svg>
      </div>

      {showLegend && (
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {slices.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-2.5 cursor-pointer transition-opacity duration-200 ${hovered !== null && hovered !== i ? 'opacity-40' : ''}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-xs text-slate-400 truncate flex-1">{s.name}</span>
              <span className="text-xs font-bold text-white">{s.value}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChartDonut;
