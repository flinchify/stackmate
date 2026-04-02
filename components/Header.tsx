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
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 20);
    if (latest < 100) {
      setVisible(true);
    } else if (latest > lastScrollY) {
      setVisible(false);
      setMobileOpen(false);
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
    { label: 'Services', href: '#services' },
    { label: 'Process', href: '#process' },
    { label: 'Why Us', href: '#compare' },
    { label: 'Clients', href: '#integrations' },
    { label: 'Tools', href: '/tools' },
    { label: 'Blog', href: '/blog' },
  ];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40"
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.06]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <Image src="/logo.png" alt="Stackmate" width={36} height={36} className="invert" />
            <span className="font-display font-bold text-lg tracking-tight text-white">
              stackmate
            </span>
          </a>

          {/* Desktop Nav — centered */}
          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-sm text-sm-muted hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/[0.03]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="/audit"
              className="px-4 py-2 text-sm text-sm-muted hover:text-white transition-colors duration-200"
            >
              Free Audit
            </a>
            <button
              onClick={onQuoteClick}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-[0_0_24px_rgba(245,158,11,0.25)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Get a Quote
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-2 relative z-50"
            aria-label="Menu"
          >
            <span
              className={`block w-6 h-[1.5px] bg-white transition-all duration-300 ${
                mobileOpen ? 'rotate-45 translate-y-[7px]' : ''
              }`}
            />
            <span
              className={`block w-6 h-[1.5px] bg-white transition-all duration-300 ${
                mobileOpen ? 'opacity-0 scale-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-[1.5px] bg-white transition-all duration-300 ${
                mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          className="lg:hidden fixed inset-0 top-0 bg-[#050505]/98 backdrop-blur-2xl z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <nav className="flex flex-col items-center justify-center min-h-screen gap-6">
            {navItems.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-display font-semibold text-sm-muted hover:text-white transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {item.label}
              </motion.a>
            ))}
            <motion.div
              className="flex flex-col gap-3 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onQuoteClick();
                }}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-display font-bold text-lg rounded-lg"
              >
                Get a Quote
              </button>
              <a
                href="/audit"
                onClick={() => setMobileOpen(false)}
                className="px-8 py-3.5 border border-white/10 text-white font-display font-semibold text-lg rounded-lg text-center hover:bg-white/5 transition-colors"
              >
                Free AI Audit
              </a>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
