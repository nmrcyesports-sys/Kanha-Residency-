export function BrandLogo({
  size = 'md',
  showTagline = false,
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}) {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-sm tracking-[0.25em]',
    md: 'text-base tracking-[0.28em]',
    lg: 'text-xl tracking-[0.3em]',
    xl: 'text-3xl tracking-[0.32em]',
  };

  const subSizes = {
    sm: 'text-[9px] tracking-[0.3em]',
    md: 'text-[10px] tracking-[0.35em]',
    lg: 'text-xs tracking-[0.4em]',
    xl: 'text-sm tracking-[0.45em]',
  };

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* Exquisite Stylized Lotus & Peacock Emblem */}
      <svg
        className={`${iconSizes[size]} text-[#C5A880] mb-1.5 transition-transform duration-500 hover:scale-105`}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Central Lotus Petal */}
        <path
          d="M24 6C24 6 28.5 16 28.5 24C28.5 28 26.5 32 24 34C21.5 32 19.5 28 19.5 24C19.5 16 24 6 24 6Z"
          fill="url(#goldGrad)"
          stroke="#C5A880"
          strokeWidth="1.2"
        />
        {/* Left Petal */}
        <path
          d="M24 16C19 16 12 21 12 28C12 32 16 35 20 34C17 31 16 26 21 21L24 16Z"
          fill="url(#goldGrad)"
          fillOpacity="0.85"
          stroke="#C5A880"
          strokeWidth="1"
        />
        {/* Right Petal */}
        <path
          d="M24 16C29 16 36 21 36 28C36 32 32 35 28 34C31 31 32 26 27 21L24 16Z"
          fill="url(#goldGrad)"
          fillOpacity="0.85"
          stroke="#C5A880"
          strokeWidth="1"
        />
        {/* Outer Flares / Peacock Crest */}
        <path
          d="M14 26C8 28 6 34 8 38C11 39 16 37 18 34C14 34 11 31 14 26Z"
          fill="#C5A880"
          fillOpacity="0.6"
        />
        <path
          d="M34 26C40 28 42 34 40 38C37 39 32 37 30 34C34 34 37 31 34 26Z"
          fill="#C5A880"
          fillOpacity="0.6"
        />
        {/* Base Lotus Pedestal */}
        <path
          d="M17 37C21 39 27 39 31 37C28 41 20 41 17 37Z"
          fill="#E5C79E"
        />
        {/* Subtle Radiance Dot */}
        <circle cx="24" cy="12" r="1.5" fill="#FFF2DC" />

        <defs>
          <linearGradient id="goldGrad" x1="12" y1="6" x2="36" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F3E7D3" />
            <stop offset="0.45" stopColor="#C5A880" />
            <stop offset="1" stopColor="#8C6E42" />
          </linearGradient>
        </defs>
      </svg>

      {/* Brand Name */}
      <span className={`font-serif font-semibold uppercase text-[#FAF7F2] ${textSizes[size]}`}>
        Kanha Residency
      </span>

      {/* Location / Subtitle */}
      <span className={`font-sans font-medium uppercase text-[#C5A880] ${subSizes[size]}`}>
        Mathura
      </span>

      {showTagline && (
        <span className="font-serif italic text-xs text-[#A3998C] mt-1 tracking-wider">
          A refined stay in the heart of Mathura.
        </span>
      )}
    </div>
  );
}
