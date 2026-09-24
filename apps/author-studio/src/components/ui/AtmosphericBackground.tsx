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
      {/* 1. Base Rich Obsidian / Graphite Canvas */}
      <div className="absolute inset-0 bg-[#06070a]" />

      {/* 2. Top Horizon Adobe Crimson & Coral Light Beam (Dramatic Studio Illumination) */}
      <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-[#eb1000]/25 via-[#ff284d]/10 to-transparent rounded-full blur-[130px] opacity-90" />

      {/* 3. Deep Accent Glows - Arctic Cyan & Ambient Rose */}
      <div className="absolute top-[20%] -left-36 w-[600px] h-[600px] bg-[#00e5ff]/08 rounded-full blur-[170px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[850px] h-[600px] bg-[#eb1000]/08 rounded-full blur-[180px]" />

      {/* 4. Top Horizon Architectural Border Laser */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#eb1000]/70 to-transparent shadow-[0_0_15px_rgba(235,16,0,0.8)]" />

      {/* 5. Precision Architectural Grid */}
      <div className="absolute inset-0 architectural-grid opacity-80" />

      {/* 6. Dot Matrix Precision Layer */}
      <div className="absolute inset-0 dot-matrix opacity-60" />

      {/* 7. Dynamic Cursor Spotlight (Follows Mouse Coordinates) */}
      <div className="absolute inset-0 cursor-spotlight" />

      {/* 8. Fine Film Grain Tactile Noise Texture */}
      <div className="absolute inset-0 noise-overlay opacity-30 mix-blend-overlay" />

      {/* 9. Subtle Studio Technical Coordinate Watermark (Fixed corners) */}
      <div className="absolute top-4 right-8 font-mono text-[9px] uppercase tracking-[0.25em] text-white/10 hidden xl:block">
        ADOBE ENTERPRISE ARCHITECTURE // RAG EMBEDDING FABRIC V3.4
      </div>
      <div className="absolute bottom-4 left-8 font-mono text-[9px] uppercase tracking-[0.25em] text-white/10 hidden xl:block">
        SENSEI AI ORCHESTRATOR // PGVECTOR COSINE SEARCH NODE
      </div>
    </div>
  );
}
