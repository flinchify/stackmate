'use client';

import { motion } from 'framer-motion';

interface LogoMarqueeProps {
  items: { name: string; color?: string }[];
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
}

export default function LogoMarquee({ items, direction = 'left', speed = 30, className = '' }: LogoMarqueeProps) {
  const doubled = [...items, ...items];

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex items-center gap-8 whitespace-nowrap"
        animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item.name}-${i}`}
            className="text-sm font-semibold tracking-wide shrink-0 px-5 py-2.5 rounded-lg border border-sm-border bg-sm-card/40 text-sm-light hover:text-white hover:border-white/20 transition-colors duration-200"
            style={item.color ? { borderColor: `${item.color}30`, color: item.color } : undefined}
          >
            {item.name}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
