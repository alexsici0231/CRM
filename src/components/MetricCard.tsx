import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CountUp } from 'countup.js';

interface MetricCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend: number;
  trendLabel?: string;
  sparklineData: number[];
  delay?: number;
}

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 30;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;
  const color = positive ? '#D97706' : '#EF4444';

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-gradient-${positive ? 'up' : 'down'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={areaPoints}
        fill={`url(#spark-gradient-${positive ? 'up' : 'down'})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MetricCard({
  label,
  value,
  prefix = '',
  suffix = '',
  trend,
  sparklineData,
  delay = 0,
}: MetricCardProps) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated && valueRef.current) {
          setHasAnimated(true);
          const countUp = new CountUp(valueRef.current, value, {
            duration: 2,
            prefix,
            suffix,
            enableScrollSpy: false,
          });
          setTimeout(() => countUp.start(), delay * 1000);
        }
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [value, prefix, suffix, hasAnimated, delay]);

  const isPositive = trend >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? '#22C55E' : '#EF4444';

  return (
    <motion.div
      ref={cardRef}
      className="rounded-xl p-5 transition-all duration-200 cursor-default"
      style={{
        backgroundColor: '#151D2E',
        border: '1px solid rgba(148,163,184,0.1)',
      }}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      whileHover={{
        borderColor: 'rgba(148,163,184,0.2)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      }}
    >
      {/* Label row */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-medium uppercase tracking-[0.05em]"
          style={{ color: '#64748B' }}
        >
          {label}
        </span>
        <div className="flex items-center gap-1">
          <TrendIcon size={12} style={{ color: trendColor }} />
          <span className="text-xs font-medium" style={{ color: trendColor }}>
            {isPositive ? '+' : ''}{trend}%
          </span>
        </div>
      </div>

      {/* Value */}
      <span
        ref={valueRef}
        className="block text-[32px] font-bold tracking-[-0.02em] mb-3"
        style={{ color: '#F1F5F9' }}
      >
        {prefix}0{suffix}
      </span>

      {/* Sparkline */}
      <Sparkline data={sparklineData} positive={isPositive} />
    </motion.div>
  );
}
