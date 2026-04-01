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
    { label: 'Services', href: '/services' },
    { label: 'Process', href: '/process' },
    { label: 'Why Us', href: '/why-us' },
    { label: 'Clients', href: '/clients' },
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
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <Image src="/logo.png" alt="Stackmate" width={40} height={40} className="invert" />
          <span className="font-display font-bold text-xl tracking-tight">stackmate</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-sm-light hover:text-white transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={onQuoteClick}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
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
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          className="md:hidden fixed inset-0 top-20 bg-sm-dark/95 backdrop-blur-xl z-30"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <nav className="flex flex-col items-center gap-8 pt-16">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-lg text-sm-light hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => { setMobileOpen(false); onQuoteClick(); }}
              className="px-8 py-3 bg-white text-black font-semibold rounded-lg"
            >
              Get a Quote
            </button>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
