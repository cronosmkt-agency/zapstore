import type { CSSProperties } from "react";

interface BrandLogoProps {
  height?: number;
  showText?: boolean;
  className?: string;
  style?: CSSProperties;
  dark?: boolean;
}

export function BrandLogo({
  height = 40,
  showText = true,
  className = "",
  style,
  dark = false,
}: BrandLogoProps) {
  const iconSize = height;

  return (
    <div
      className={`flex items-center gap-2.5 select-none ${className}`}
      style={style}
    >
      {/* Ícone Apple-style Titanium Squircle com Dedo de Deus */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform hover:scale-105 duration-200"
      >
        <defs>
          <linearGradient id="tp-chassis" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="tp-rim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="40%" stopColor="#38BDF8" />
            <stop offset="70%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
          <linearGradient id="tp-peak" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#E2E8F0" />
            <stop offset="70%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="tp-ridge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1E293B" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Chassis Squircle com Rim Titânio */}
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          rx="24"
          fill="url(#tp-chassis)"
          stroke="url(#tp-rim)"
          strokeWidth="3.5"
        />

        {/* Anel de precisão laser / micro-graduação Apple Watch */}
        <circle
          cx="50"
          cy="50"
          r="38"
          stroke="#38BDF8"
          strokeOpacity="0.25"
          strokeWidth="1.2"
          strokeDasharray="2 3"
        />

        {/* Cume da Serra dos Órgãos / Silhueta do Dedo de Deus */}
        {/* Cristas laterais */}
        <path
          d="M20 74 L32 58 L42 66 L50 48 L58 66 L68 58 L80 74 Z"
          fill="url(#tp-ridge)"
        />
        {/* Monólito vertical Dedo de Deus (Pico central icônico de Teresópolis) */}
        <path
          d="M45.5 74 L45.5 32 Q45.5 24 50 24 Q54.5 24 54.5 32 L54.5 74 Z"
          fill="url(#tp-peak)"
        />
        {/* Detalhe de luz no topo da rocha */}
        <circle cx="50" cy="27" r="2.5" fill="#FFFFFF" />
        <line
          x1="50"
          y1="34"
          x2="50"
          y2="66"
          stroke="#FFFFFF"
          strokeOpacity="0.4"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Wordmark */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center text-lg sm:text-xl font-black tracking-tight">
            <span style={{ color: dark ? "#FFFFFF" : "var(--text-primary, #0D1B3E)" }}>
              TERE
            </span>
            <span
              style={{
                background: "linear-gradient(135deg, #1A6FE8 0%, #2979FF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              className="ml-0.5"
            >
              PHONES
            </span>
          </div>
          <span
            className="text-[9px] uppercase font-bold tracking-[0.22em] mt-0.5"
            style={{ color: dark ? "#94A3B8" : "var(--text-muted, #64748B)" }}
          >
            TERESÓPOLIS • RJ
          </span>
        </div>
      )}
    </div>
  );
}

export default BrandLogo;
