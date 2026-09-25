'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink, Menu, X } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#09090b]/85 backdrop-blur-2xl border-b border-white/[0.08] shadow-xl shadow-black/40 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="hover:opacity-95 transition">
          <Logo size="md" subtitle="Adobe Experience Fabric" badge="AI" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-300">
          <a href="#architecture" className="hover:text-white transition">
            Architecture
          </a>
          <a href="#features" className="hover:text-white transition">
            Platform Modules
          </a>
          <a href="#compare" className="hover:text-white transition">
            Adobe Parity
          </a>
          <a
            href="http://localhost:3002"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition"
          >
            <span>Delivery Edge</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="btn-firefly px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 group shadow-md shadow-[#E8380D]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Command Center</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-white/[0.05] text-zinc-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden surface-overlay border-b border-white/10 px-6 py-5 space-y-4 text-sm mt-2">
          <a
            href="#architecture"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-white"
          >
            Architecture
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-white"
          >
            Platform Modules
          </a>
          <a
            href="#compare"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-300 hover:text-white"
          >
            Adobe Parity
          </a>
          <a
            href="http://localhost:3002"
            target="_blank"
            rel="noreferrer"
            className="block text-zinc-300 hover:text-white"
          >
            Delivery Edge
          </a>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="btn-firefly w-full py-2.5 rounded-xl text-center font-semibold text-xs flex items-center justify-center gap-2"
          >
            <span>Launch Command Center</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </header>
  );
}
