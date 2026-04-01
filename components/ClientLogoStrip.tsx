'use client';

import Image from 'next/image';

interface ClientLogo {
  name: string;
  src: string;
  url?: string;
}

const CLIENT_LOGOS: ClientLogo[] = [
  { name: 'U-Move Australia', src: '/umove-logo.png', url: 'https://umove.lol' },
  { name: 'HireACreator', src: '/hireacreator-logo.png', url: 'https://hireacreator.ai' },
];

export default function ClientLogoStrip() {
  if (CLIENT_LOGOS.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-10">
      {CLIENT_LOGOS.map((logo) => (
        <a
          key={logo.name}
          href={logo.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-50 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
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
    </div>
  );
}
