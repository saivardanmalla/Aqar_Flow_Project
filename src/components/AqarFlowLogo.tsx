import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showCompany?: boolean;
}

export const AqarFlowLogo: React.FC<LogoProps> = ({
  className = '',
  variant = 'light',
  size = 'md',
  showCompany = true,
}) => {
  const isDark = variant === 'dark';
  
  const iconSize = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const titleSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';
  const subSize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[10px]';

  return (
    <div className={`flex items-center gap-2.5 font-sans select-none ${className}`}>
      {/* Custom Geometric Logo Icon matching image_c021d3a8.png */}
      <div className={`relative ${iconSize} flex items-center justify-center shrink-0`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Outer green arch/pentagon roof */}
          <path
            d="M20 4L4 16V34C4 35.1046 4.89543 36 6 36H34C35.1046 36 36 35.1046 36 34V16L20 4Z"
            stroke="#10B981"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Inner roof chevron / peak */}
          <path
            d="M20 12L12 18V28H28V18L20 12Z"
            fill="#10B981"
            fillOpacity="0.2"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* White/accent doorway arch */}
          <path
            d="M16 28V20C16 17.7909 17.7909 16 20 16C22.2091 16 24 17.7909 24 20V28"
            stroke={isDark ? '#FFFFFF' : '#0F172A'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-1.5">
          <span className={`font-extrabold tracking-tight ${titleSize} ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Aqar<span className="text-emerald-500">Flow</span>
          </span>
        </div>
        {showCompany && (
          <span className={`font-medium tracking-wider uppercase ${subSize} ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            by <strong className={isDark ? 'text-emerald-400 font-semibold' : 'text-slate-700 font-semibold'}>VIRELEO</strong>
          </span>
        )}
      </div>
    </div>
  );
};
