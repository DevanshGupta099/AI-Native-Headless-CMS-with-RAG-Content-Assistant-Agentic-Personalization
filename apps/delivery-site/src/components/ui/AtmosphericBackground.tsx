'use client';

import React, { useEffect } from 'react';

export default function AtmosphericBackground() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Base Obsidian Void Canvas */}
      <div className="absolute inset-0 bg-[#09090b]" />

      {/* 2. Top Horizon Firefly Amber & Coral Light Beam */}
      <div className="absolute -top-52 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-[#E8380D]/20 via-[#F56E40]/10 to-transparent rounded-full blur-[140px] opacity-85" />

      {/* 3. Deep Accent Glows - Electric Blue & Warm Amber */}
      <div className="absolute top-[20%] -left-48 w-[650px] h-[650px] bg-[#3B82F6]/[0.05] rounded-full blur-[180px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[900px] h-[650px] bg-[#E8380D]/[0.06] rounded-full blur-[190px]" />

      {/* 4. Top Horizon Precision Laser Rail */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#F56E40]/60 to-transparent shadow-[0_0_12px_rgba(232,56,13,0.6)]" />

      {/* 5. Precision Architectural Grid */}
      <div className="absolute inset-0 architectural-grid opacity-75" />

      {/* 6. Dot Matrix Precision Layer */}
      <div className="absolute inset-0 dot-matrix opacity-50" />

      {/* 7. Dynamic Cursor Spotlight */}
      <div className="absolute inset-0 cursor-spotlight" />

      {/* 8. Fine Film Grain Noise */}
      <div className="absolute inset-0 noise-overlay opacity-30 mix-blend-overlay" />
    </div>
  );
}
