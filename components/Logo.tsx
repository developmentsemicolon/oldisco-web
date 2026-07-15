'use client';

import React, { useEffect, useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

const LOGO_STATIC = '/images/logo.png';
const LOGO_GIF = '/logo.gif';

function Logo({ className, size = 'md' }: LogoProps) {
  const [hovered, setHovered] = useState(false);

  const sizeClasses = {
    sm: 'h-12 w-auto',
    md: 'h-20 w-auto',
    lg: 'h-32 w-auto',
    hero: 'w-full max-w-[500px] h-auto',
  };

  useEffect(() => {
    const img = new Image();
    img.src = LOGO_GIF;
  }, []);

  return (
    <div
      className={`flex items-center justify-center ${className ?? ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <img
        src={hovered ? LOGO_GIF : LOGO_STATIC}
        alt="Oldisco"
        className={`${sizeClasses[size]} object-contain filter contrast-125 brightness-110 drop-shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.4)] transition-all duration-700`}
        style={{ imageRendering: 'auto' }}
      />
    </div>
  );
}

export { Logo };
export default Logo;
