import React from 'react';

interface LogoProps {
  variant?: 'mark' | 'full';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  subtitle?: string;
  badge?: string;
  className?: string;
}

export default function Logo({
  variant = 'full',
  size = 'md',
  subtitle = 'Adobe Experience Fabric',
  badge = 'AI',
  className = '',
}: LogoProps) {
  const sizeMap = {
    sm: { icon: 28, text: 'text-sm', badge: 'text-[8px] px-1 py-0.2', sub: 'text-[9px]' },
    md: { icon: 34, text: 'text-base', badge: 'text-[9px] px-1.5 py-0.5', sub: 'text-[10px]' },
    lg: { icon: 42, text: 'text-xl', badge: 'text-[10px] px-1.5 py-0.5', sub: 'text-xs' },
    xl: { icon: 54, text: 'text-2xl', badge: 'text-xs px-2 py-0.5', sub: 'text-sm' },
  };

  const dim = sizeMap[size];

  // Stylized "C" with neural node & forward vector prism
  const MarkIcon = (
    <div
      className="relative shrink-0 flex items-center justify-center rounded-xl overflow-hidden group"
      style={{ width: dim.icon, height: dim.icon }}
    >
      {/* Outer ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#E8380D] via-[#F56E40] to-[#FFB347] opacity-80 blur-[6px] group-hover:opacity-100 group-hover:blur-[10px] transition-all duration-300" />

      {/* Surface backing with specular ring */}
      <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-[#161921] via-[#0f1117] to-[#09090b] border border-white/20 p-[1px] shadow-lg shadow-black/60 flex items-center justify-center">
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[78%] h-[78%]"
        >
          <defs>
            <linearGradient id="cp-arc-grad" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFB347" />
              <stop offset="45%" stopColor="#F56E40" />
              <stop offset="100%" stopColor="#E8380D" />
            </linearGradient>
            <linearGradient id="cp-core-grad" x1="12" y1="12" x2="26" y2="26" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F56E40" />
            </linearGradient>
            <filter id="cp-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Main "C" Precision Orbital Arc */}
          <path
            d="M26.5 10C24 7.2 20.2 5.5 16 5.5C8.82 5.5 3 11.32 3 18.5C3 25.68 8.82 31.5 16 31.5C20.5 31.5 24.4 29.6 27 26.5"
            stroke="url(#cp-arc-grad)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Inner Vector Energy Rail */}
          <path
            d="M23 14C21.2 12.5 18.7 11.5 16 11.5C12.13 11.5 9 14.63 9 18.5C9 22.37 12.13 25.5 16 25.5C18.5 25.5 20.8 24.6 22.5 23"
            stroke="url(#cp-arc-grad)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeOpacity="0.45"
            strokeDasharray="2 3"
          />

          {/* Neural Node Core (Nucleus) */}
          <circle
            cx="19"
            cy="18.5"
            r="3.2"
            fill="url(#cp-core-grad)"
            filter="url(#cp-glow)"
          />

          {/* Forward Impulse Arrow / Vector Ray */}
          <path
            d="M22 18.5L33 18.5M33 18.5L28.5 14M33 18.5L28.5 23"
            stroke="url(#cp-arc-grad)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );

  if (variant === 'mark') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        {MarkIcon}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {MarkIcon}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`font-bold tracking-tight text-white leading-none ${dim.text}`}>
            ContentPilot
          </span>
          {badge && (
            <span
              className={`rounded-md font-mono font-semibold tracking-wide uppercase bg-gradient-to-r from-[#E8380D]/20 to-[#F56E40]/20 text-[#FFB347] border border-[#E8380D]/30 shadow-sm shadow-[#E8380D]/10 ${dim.badge}`}
            >
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <span
            className={`font-mono text-zinc-400 font-medium tracking-wider uppercase mt-0.5 block ${dim.sub}`}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
