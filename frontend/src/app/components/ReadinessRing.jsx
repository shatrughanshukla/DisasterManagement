'use client';

export default function ReadinessRing({ value = 0, label = 'Progress', size = 56 }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="inline-flex flex-col items-center gap-1" role="img" aria-label={`${label}: ${pct} percent complete`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E8E2CF"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#B5372F"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className="font-body font-semibold"
          style={{ fontSize: size * 0.28, fill: '#1E3A5F' }}
        >
          {pct}%
        </text>
      </svg>
    </div>
  );
}
