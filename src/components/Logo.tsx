import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false, className = '' }) => {
  const sizeClasses = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', badge: 'text-[9px] px-1.5 py-0.5' },
    md: { icon: 'w-10 h-10', text: 'text-2xl', badge: 'text-[10px] px-2 py-0.5' },
    lg: { icon: 'w-14 h-14', text: 'text-3xl', badge: 'text-xs px-2.5 py-1' },
    xl: { icon: 'w-20 h-20', text: 'text-5xl', badge: 'text-sm px-3 py-1' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Brand Icon - Stylized Hot Pizza Slice in Hexagonal Shield */}
      <div className={`relative ${sizeClasses.icon} flex items-center justify-center shrink-0`}>
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-rose-600 to-amber-500 rounded-2xl rotate-3 shadow-lg shadow-red-950/60 transition-transform group-hover:rotate-6" />
        <div className="absolute inset-0.5 bg-stone-950 rounded-[14px] flex items-center justify-center overflow-hidden">
          {/* Pizza Slice SVG */}
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-3/4 h-3/4 drop-shadow-[0_2px_4px_rgba(239,68,68,0.5)]"
          >
            {/* Crust Arc */}
            <path
              d="M8 12C16 8 32 8 40 12"
              stroke="#F59E0B"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Slice Body */}
            <path
              d="M9 13L24 42L39 13C33 11 15 11 9 13Z"
              fill="#E11D48"
            />
            {/* Cheese Melt Layers */}
            <path
              d="M12 16L24 38L36 16C31 15 17 15 12 16Z"
              fill="#FBBF24"
            />
            {/* Pepperoni Slices */}
            <circle cx="21" cy="22" r="3" fill="#991B1B" />
            <circle cx="27" cy="25" r="2.5" fill="#991B1B" />
            <circle cx="23" cy="31" r="2.2" fill="#991B1B" />
            {/* Cheese Drops / Drips */}
            <path
              d="M16 19C16 22 18 22 18 19"
              stroke="#FEF08A"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 font-black tracking-tight leading-none">
          <span className={`bg-gradient-to-r from-red-500 via-amber-400 to-yellow-300 bg-clip-text text-transparent font-black ${sizeClasses.text}`}>
            GO PIZZA
          </span>
          <span className={`bg-amber-400 text-stone-950 rounded font-black uppercase tracking-wider ${sizeClasses.badge}`}>
            SHOP
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase mt-0.5">
            Fresh • Hot • Fast Delivery
          </span>
        )}
      </div>
    </div>
  );
};
