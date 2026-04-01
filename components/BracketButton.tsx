'use client';

export default function BracketButton({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button onClick={onClick} className={`group relative px-8 py-4 font-display font-semibold text-lg text-sm-light hover:text-white transition-colors duration-200 ${className}`}>
      {/* Corner brackets */}
      <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-sm-muted group-hover:border-white group-hover:w-4 group-hover:h-4 transition-all duration-300" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-sm-muted group-hover:border-white group-hover:w-4 group-hover:h-4 transition-all duration-300" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-sm-muted group-hover:border-white group-hover:w-4 group-hover:h-4 transition-all duration-300" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-sm-muted group-hover:border-white group-hover:w-4 group-hover:h-4 transition-all duration-300" />
      {children}
    </button>
  );
}
