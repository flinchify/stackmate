'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface ClientLogo {
  name: string;
  src: string;
  url?: string;
}

const CLIENT_LOGOS: ClientLogo[] = [
  { name: 'U-Move Australia', src: '/umove-logo.png', url: 'https://umove.lol' },
];

export default function ClientLogoStrip() {
  if (CLIENT_LOGOS.length === 0) return null;

  // If few logos, duplicate for marquee effect
  const logos = CLIENT_LOGOS.length < 6
    ? [...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS]
    : [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex items-center gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {logos.map((logo, i) => (
          <a
            key={`${logo.name}-${i}`}
            href={logo.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 opacity-50 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
          >
            <Image
              src={logo.src}
              alt={logo.name}
              width={120}
              height={40}
              className="h-8 w-auto object-contain invert"
            />
          </a>
        ))}
      </motion.div>
    </div>
  );
}
