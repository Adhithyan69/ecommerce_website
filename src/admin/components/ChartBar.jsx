import React from 'react';

/**
 * SVG Bar Chart — no dependencies needed
 * Props: data = [{ label, value }], color, height
 */
const ChartBar = ({ data = [], color = '#6366F1', height = 160, showValues = true }) => {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => d.value), 1);
  const barW = 100 / data.length;
  const gap = barW * 0.25;

  return (
    <div className="w-full">
      <svg width="100%" height={height + 40} viewBox={`0 0 ${data.length * 60} ${height + 40}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`barGrad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {data.map((d, i) => {
          const barH = Math.max((d.value / max) * height, 4);
          const x = i * 60 + 5;
          const y = height - barH + 10;
          return (
            <g key={i}>
              <rect
                x={x} y={y} width={50} height={barH}
                rx={6} ry={6}
                fill={`url(#barGrad-${color.replace('#','')})`}
                className="transition-all duration-500"
              >
                <title>{d.label}: {d.value}</title>
              </rect>
              {/* Hover highlight */}
              <rect x={x} y={10} width={50} height={height} rx={6} ry={6} fill="transparent" className="cursor-pointer" />
              <text x={x + 25} y={height + 28} textAnchor="middle" fontSize={10} fill="#94A3B8">{d.label}</text>
              {showValues && barH > 20 && (
                <text x={x + 25} y={y - 4} textAnchor="middle" fontSize={9} fill={color} fontWeight="600">
                  {d.value >= 1000 ? `${(d.value/1000).toFixed(0)}k` : d.value}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ChartBar;
