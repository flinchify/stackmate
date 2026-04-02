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
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    // Check if scrolled for glass effect
    setScrolled(latest > 50);

    // Hide/show logic
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
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navItems = [
    { label: 'Services', href: '#services' },
    { label: 'Process', href: '#process' },
    { label: 'Why Us', href: '#compare' },
    { label: 'Clients', href: '/clients' },
    { label: 'Tools', href: '/tools' },
    { label: 'Blog', href: '/blog' },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-sm-bg/80 backdrop-blur-xl border-b border-white/[0.06]' 
          : 'bg-transparent'
      }`}
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
        {/* Logo */}
        <motion.a 
          href="/" 
          className="flex items-center gap-3 group z-20"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Image src="/logo.png" alt="Stackmate" width={40} height={40} className="invert" />
          <span className="font-display font-bold text-xl tracking-tight">stackmate</span>
        </motion.a>

        {/* Desktop Nav - Centered */}
        <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-sm-muted hover:text-sm-text transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-4">
          <motion.button
            onClick={onQuoteClick}
            className="px-6 py-2.5 bg-gradient-to-r from-sm-accent to-sm-accent-light text-white text-sm font-semibold rounded-full hover:shadow-[0_0_20px_rgba(255,122,0,0.3)] transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get a Quote
          </motion.button>
          <a
            href="/audit"
            className="text-sm text-sm-muted hover:text-sm-text transition-colors duration-200"
          >
            Free Audit
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden flex flex-col gap-1.5 p-2 z-20"
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu overlay */}
      <motion.div
        className={`lg:hidden fixed inset-0 z-10 ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: mobileOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-sm-bg/95 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
        
        <motion.nav 
          className="relative h-full flex flex-col items-center justify-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mobileOpen ? 1 : 0, y: mobileOpen ? 0 : 20 }}
          transition={{ duration: 0.3, staggerChildren: 0.05 }}
        >
          {navItems.map((item, index) => (
            <motion.a
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="text-xl text-sm-muted hover:text-sm-text transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: mobileOpen ? 1 : 0, 
                y: mobileOpen ? 0 : 20 
              }}
              transition={{ 
                duration: 0.3, 
                delay: mobileOpen ? index * 0.05 : 0 
              }}
            >
              {item.label}
            </motion.a>
          ))}
          
          <motion.div 
            className="flex flex-col gap-4 items-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: mobileOpen ? 1 : 0, 
              y: mobileOpen ? 0 : 20 
            }}
            transition={{ 
              duration: 0.3, 
              delay: mobileOpen ? navItems.length * 0.05 : 0 
            }}
          >
            <button
              onClick={() => { 
                setMobileOpen(false); 
                onQuoteClick(); 
              }}
              className="px-8 py-3 bg-gradient-to-r from-sm-accent to-sm-accent-light text-white font-semibold rounded-full"
            >
              Get a Quote
            </button>
            <a
              href="/audit"
              onClick={() => setMobileOpen(false)}
              className="text-sm-muted hover:text-sm-text transition-colors"
            >
              Free AI Audit
            </a>
          </motion.div>
        </motion.nav>
      </motion.div>
    </motion.header>
  );
}