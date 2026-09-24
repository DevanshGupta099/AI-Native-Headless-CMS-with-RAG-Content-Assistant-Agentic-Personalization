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

      {/* 2. Radiant Aurora Light Orbs */}
      {/* Top Center Adobe Crimson Ambient Beam */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-[#eb1000]/15 via-[#ff284d]/08 to-transparent rounded-full blur-[140px]" />
      
      {/* Left Spectrum Iris Glow */}
      <div className="absolute top-1/3 -left-48 w-[600px] h-[600px] bg-[#7c3aed]/10 rounded-full blur-[160px]" />

      {/* Bottom Right Cyan Pulse */}
      <div className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[500px] bg-[#06b6d4]/07 rounded-full blur-[160px]" />

      {/* 3. Architectural Hairline Grid with Radial Vignette */}
      <div className="absolute inset-0 architectural-grid opacity-70" />

      {/* 4. Interactive Mouse Spotlight */}
      <div className="absolute inset-0 cursor-spotlight" />

      {/* 5. Tactile Film Grain Noise Overlay */}
      <div className="absolute inset-0 noise-overlay opacity-40 mix-blend-overlay" />
    </div>
  );
}
