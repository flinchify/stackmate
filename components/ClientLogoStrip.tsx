'use client';

import Image from 'next/image';

interface ClientProject {
  name: string;
  heroSrc: string;
  url: string;
  description: string;
}

const CLIENT_PROJECTS: ClientProject[] = [
  { name: 'U-Move Australia', heroSrc: '/client-umove-hero.jpg', url: 'https://umove.lol', description: 'E-commerce & logistics platform' },
  { name: 'HireACreator', heroSrc: '/client-hireacreator-hero.jpg', url: 'https://hireacreator.ai', description: 'Creator hiring marketplace' },
  { name: 'WhipSpec', heroSrc: '/client-whipspec-hero.jpg', url: 'https://www.whipspec.com/', description: 'Automotive builds platform' },
];

export default function ClientLogoStrip() {
  if (CLIENT_PROJECTS.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {CLIENT_PROJECTS.map((project) => (
        <a
          key={project.name}
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block shimmer-border-subtle border border-white/[0.06] rounded-xl overflow-hidden hover:border-sm-accent/30 transition-all duration-300"
        >
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <Image
              src={project.heroSrc}
              alt={project.name}
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="p-4 bg-sm-surface/30">
            <div className="font-display font-semibold text-sm">{project.name}</div>
            <div className="text-xs text-sm-muted mt-1">{project.description}</div>
          </div>
        </a>
      ))}
    </div>
  );
}
