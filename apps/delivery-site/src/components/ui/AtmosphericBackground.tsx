'use client';

import React, { useEffect } from 'react';

export default function AtmosphericBackground() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Base Obsidian Canvas */}
      <div className="absolute inset-0 bg-[#06070a]" />

      {/* 2. Top Edge Luminous Beacon */}
      <div className="absolute -top-44 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-[#00e5ff]/20 via-[#eb1000]/10 to-transparent rounded-full blur-[140px] opacity-90" />
      <div className="absolute top-[35%] -left-48 w-[650px] h-[650px] bg-[#00e5ff]/08 rounded-full blur-[170px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[550px] bg-[#eb1000]/08 rounded-full blur-[180px]" />

      {/* 3. Top Horizon Laser Line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00e5ff]/70 to-transparent shadow-[0_0_15px_rgba(0,229,255,0.8)]" />

      {/* 4. Precision Architectural Hairline Grid */}
      <div className="absolute inset-0 architectural-grid opacity-80" />

      {/* 5. Precision Dot Matrix */}
      <div className="absolute inset-0 dot-matrix opacity-60" />

      {/* 6. Dynamic Cursor Spotlight */}
      <div className="absolute inset-0 cursor-spotlight" />

      {/* 7. Tactile Film Grain Noise Overlay */}
      <div className="absolute inset-0 noise-overlay opacity-35 mix-blend-overlay" />

      {/* 8. Technical Watermark */}
      <div className="absolute top-4 right-8 font-mono text-[9px] uppercase tracking-[0.25em] text-white/10 hidden xl:block">
        CONTENTPILOT EDGE FABRIC // GLOBAL REPLICATION ACTIVE
      </div>
    </div>
  );
}
