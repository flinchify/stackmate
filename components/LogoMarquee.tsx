'use client';

import { motion } from 'framer-motion';

interface LogoItem {
  name: string;
  icon: string; // simple-icons slug
}

interface LogoMarqueeProps {
  items: LogoItem[];
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
}

export default function LogoMarquee({ items, direction = 'left', speed = 30, className = '' }: LogoMarqueeProps) {
  const doubled = [...items, ...items];

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex items-center gap-10 whitespace-nowrap"
        animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            className="shrink-0 flex items-center gap-2.5 opacity-40 hover:opacity-100 transition-opacity duration-300"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://cdn.simpleicons.org/${item.icon}/ffffff`}
              alt={item.name}
              className="h-6 w-6"
              loading="lazy"
            />
            <span className="text-sm text-sm-light font-medium">{item.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
