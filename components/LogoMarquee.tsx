'use client';

interface LogoItem {
  name: string;
  svg: string;
}

interface LogoMarqueeProps {
  items: LogoItem[];
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
}

export default function LogoMarquee({ items, direction = 'left', speed = 40, className = '' }: LogoMarqueeProps) {
  const doubled = [...items, ...items];

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="flex items-center gap-12 whitespace-nowrap"
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
        }}
      >
        {doubled.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            className="shrink-0 flex items-center gap-2.5 opacity-40 hover:opacity-100 transition-opacity duration-300"
          >
            <div className="w-6 h-6 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: item.svg }} />
            <span className="text-sm text-sm-light font-medium">{item.name}</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
