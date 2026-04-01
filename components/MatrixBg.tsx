'use client';

import { useEffect, useRef } from 'react';

export default function MatrixBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const chars = '01{}[]()<>:;/\\|=+-*&%$#@!?';
    const fontSize = 13;
    let columns: number;
    let drops: number[];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      columns = Math.floor(canvas!.width / (fontSize * 2));
      drops = Array(columns).fill(0).map(() => Math.random() * -150);
    }

    function draw() {
      ctx!.fillStyle = 'rgba(10, 10, 10, 0.04)';
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      ctx!.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize * 2;
        const y = drops[i] * fontSize;
        
        const alpha = Math.max(0, Math.min(0.07, 0.07 - (y / canvas!.height) * 0.04));
        ctx!.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx!.fillText(char, x, y);

        if (y > canvas!.height && Math.random() > 0.99) {
          drops[i] = 0;
        }
        drops[i] += 0.15 + Math.random() * 0.1;
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  );
}
