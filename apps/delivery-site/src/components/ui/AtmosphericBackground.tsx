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
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. Base Obsidian Canvas */}
      <div className="absolute inset-0 bg-[#06070a]" />

      {/* 2. Radiant Luminous Orbs */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-[#00e5ff]/12 via-[#6366f1]/08 to-transparent rounded-full blur-[140px]" />
      <div className="absolute top-1/2 -left-48 w-[600px] h-[600px] bg-[#7c3aed]/09 rounded-full blur-[160px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[500px] bg-[#00e5ff]/07 rounded-full blur-[160px]" />

      {/* 3. Architectural Hairline Grid with Radial Vignette */}
      <div className="absolute inset-0 architectural-grid opacity-75" />

      {/* 4. Tactile Film Grain Noise Overlay */}
      <div className="absolute inset-0 noise-overlay opacity-40 mix-blend-overlay" />
    </div>
  );
}
