'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Image from 'next/image';

interface HeaderProps {
  onQuoteClick: () => void;
}

export default function Header({ onQuoteClick }: HeaderProps) {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    // At top: always show. Scrolling down: hide. Scrolling up: show.
    if (latest < 100) {
      setVisible(true);
    } else if (latest > lastScrollY) {
      setVisible(false);
    } else {
      setVisible(true);
    }
    setLastScrollY(latest);
  });

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  const navItems = [
    { label: 'ENTERPRISE', href: '/services' },
    { label: 'PROCESS', href: '#process' },
    { label: 'CLIENTS', href: '/clients' },
    { label: 'TOOLS', href: '/tools' },
    { label: 'BLOG', href: '/blog' },
  ];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40"
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Floating header container */}
      <div className="mx-auto max-w-6xl mt-4 px-6">
        <div className="shimmer-border-subtle rounded-xl p-4 bg-sm-bg/90 backdrop-blur-xl border border-white/[0.06]">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <Image src="/logo.png" alt="Stackmate" width={32} height={32} className="invert" />
              <span className="font-display font-bold text-lg tracking-tight">stackmate</span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="font-mono text-xs uppercase tracking-wider text-sm-muted hover:text-sm-accent transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
              <button
                onClick={onQuoteClick}
                className="px-4 py-2 bg-sm-accent text-sm-bg font-mono text-xs uppercase tracking-wider rounded-lg hover:bg-sm-accent-light transition-all duration-200 font-medium"
              >
                Get a Quote
              </button>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Menu"
            >
              <span className={`block w-6 h-0.5 bg-sm-text transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-sm-text transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-sm-text transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <motion.div
          className="md:hidden fixed inset-0 top-0 bg-sm-bg z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex flex-col h-full">
            {/* Mobile header */}
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <Image src="/logo.png" alt="Stackmate" width={32} height={32} className="invert" />
                <span className="font-display font-bold text-lg">stackmate</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2"
                aria-label="Close menu"
              >
                <span className="block w-6 h-0.5 bg-sm-text rotate-45 translate-y-2" />
                <span className="block w-6 h-0.5 bg-sm-text -rotate-45 -translate-y-2" />
              </button>
            </div>

            {/* Mobile nav */}
            <nav className="flex flex-col items-center gap-8 pt-16 flex-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-mono text-sm uppercase tracking-wider text-sm-muted hover:text-sm-accent transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <button
                onClick={() => { setMobileOpen(false); onQuoteClick(); }}
                className="px-8 py-3 bg-sm-accent text-sm-bg font-mono text-sm uppercase tracking-wider rounded-lg font-medium mt-8"
              >
                Get a Quote
              </button>
            </nav>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}