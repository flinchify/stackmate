'use client';

import { useState } from 'react';
import QuoteModal from './QuoteModal';

export default function QuoteButton({ className = '', children }: { className?: string; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        {children || 'Get a Quote'}
      </button>
      <QuoteModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
