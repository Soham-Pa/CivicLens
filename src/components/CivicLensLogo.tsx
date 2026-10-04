import React from 'react';

interface CivicLensLogoProps {
  className?: string;
  size?: number;
}

export const CivicLensLogo: React.FC<CivicLensLogoProps> = ({
  className = 'w-10 h-10',
  size = 40,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CivicLens Logo: Location Pin with Camera Lens"
    >
      {/* Outer Pin Body */}
      <path
        d="M24 3C14.0589 3 6 11.0589 6 21C6 32.25 21.2 44.1 22.8 45.3C23.5 45.8 24.5 45.8 25.2 45.3C26.8 44.1 42 32.25 42 21C42 11.0589 33.9411 3 24 3Z"
        fill="#0B3C7A"
        stroke="#FFFFFF"
        strokeWidth="2"
      />
      {/* Saffron Top Accent */}
      <path
        d="M24 5C32.8366 5 40 12.1634 40 21C40 23.5 39.4 25.8 38.3 28L9.7 28C8.6 25.8 8 23.5 8 21C8 12.1634 15.1634 5 24 5Z"
        fill="#0B3C7A"
      />
      {/* Camera Lens Outer Ring */}
      <circle
        cx="24"
        cy="20"
        r="11"
        fill="#FFFFFF"
        stroke="#FF9933"
        strokeWidth="2.5"
      />
      {/* Camera Lens Middle Aperture */}
      <circle
        cx="24"
        cy="20"
        r="7.5"
        fill="#0B3C7A"
      />
      {/* Lens Core & Reflection */}
      <circle
        cx="24"
        cy="20"
        r="4.5"
        fill="#138808"
      />
      <circle
        cx="22.5"
        cy="18.5"
        r="1.8"
        fill="#FFFFFF"
        opacity="0.9"
      />
      {/* Crosshair marks */}
      <line x1="24" y1="6" x2="24" y2="8" stroke="#FF9933" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="37" y1="20" x2="35" y2="20" stroke="#FF9933" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="20" x2="13" y2="20" stroke="#FF9933" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};
