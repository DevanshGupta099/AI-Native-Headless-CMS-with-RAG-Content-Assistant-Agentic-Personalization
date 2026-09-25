import React from 'react';
import AtmosphericBackground from '@/components/ui/AtmosphericBackground';
import LandingHeader from '@/components/landing/LandingHeader';
import HeroSection from '@/components/landing/HeroSection';
import ArchitectureGrid from '@/components/landing/ArchitectureGrid';
import FeatureShowcase from '@/components/landing/FeatureShowcase';
import TechStack from '@/components/landing/TechStack';
import HowItWorks from '@/components/landing/HowItWorks';
import MetricsSection from '@/components/landing/MetricsSection';
import ComparisonTable from '@/components/landing/ComparisonTable';
import CTAFooter from '@/components/landing/CTAFooter';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#09090b] text-[#F5F5F7] overflow-x-hidden">
      {/* Dynamic Studio Background with Atmospheric Beam & Spotlight */}
      <AtmosphericBackground />

      {/* Fixed Sticky Header */}
      <LandingHeader />

      {/* Main Multi-Section Landing Stream */}
      <main className="relative z-10 flex flex-col">
        {/* Section 1: 3D Constellation Hero */}
        <HeroSection />

        {/* Section 2: Four Architectural Pillars */}
        <ArchitectureGrid />

        {/* Section 3: Interactive Live Feature Showcase */}
        <FeatureShowcase />

        {/* Section 4: Enterprise Tech Stack */}
        <TechStack />

        {/* Section 5: How It Works Lifecycle */}
        <HowItWorks />

        {/* Section 6: Quality & Benchmark Telemetry */}
        <MetricsSection />

        {/* Section 7: Adobe Experience Cloud Parity Comparison */}
        <ComparisonTable />
      </main>

      {/* Section 8: Call-to-Action & Enterprise Footer */}
      <CTAFooter />
    </div>
  );
}
