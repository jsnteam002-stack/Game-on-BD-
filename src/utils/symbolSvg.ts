// Vector SVG Symbol Renderer for Western Slot and Game Engines (No Emojis)

export function getSymbolSvg(symbolId: string, className = 'w-10 h-10 sm:w-14 sm:h-14'): string {
  switch (symbolId) {
    case 'cowboy_hat':
    case 'hat':
      return `
        <svg viewBox="0 0 100 100" class="${className} filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]">
          <path d="M 30 55 C 30 28, 40 18, 50 18 C 60 18, 70 28, 70 55 Z" fill="#92400E" stroke="#381303" stroke-width="3" />
          <path d="M 42 20 C 48 28, 52 28, 58 20" fill="none" stroke="#78350F" stroke-width="3" stroke-linecap="round" />
          <rect x="30" y="50" width="40" height="7" rx="2" fill="#B91C1C" />
          <circle cx="50" cy="53.5" r="3" fill="#FDE047" stroke="#78350F" />
          <path d="M 64 50 Q 78 35, 75 22 Q 68 35, 66 50" fill="#1E3A8A" />
          <path d="M 10 62 C 25 54, 75 54, 90 62 C 94 68, 78 72, 50 72 C 22 72, 6 68, 10 62 Z" fill="#78350F" stroke="#381303" stroke-width="3" />
          <path d="M 14 63 C 30 58, 70 58, 86 63" fill="none" stroke="#B45309" stroke-width="2" />
        </svg>
      `;

    case 'horseshoe':
      return `
        <svg viewBox="0 0 100 100" class="${className} filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]">
          <defs>
            <linearGradient id="hsMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFFFFF" />
              <stop offset="40%" stop-color="#D1D5DB" />
              <stop offset="70%" stop-color="#6B7280" />
              <stop offset="100%" stop-color="#374151" />
            </linearGradient>
          </defs>
          <path
            d="M 28 80 L 22 45 C 22 25, 35 15, 50 15 C 65 15, 78 25, 78 45 L 72 80 L 58 78 L 62 48 C 62 34, 56 28, 50 28 C 44 28, 38 34, 38 48 L 42 78 Z"
            fill="url(#hsMetal)"
            stroke="#111827"
            stroke-width="3"
          />
          <circle cx="30" cy="40" r="3.5" fill="#F59E0B" stroke="#78350F" />
          <circle cx="32" cy="55" r="3.5" fill="#F59E0B" stroke="#78350F" />
          <circle cx="34" cy="70" r="3.5" fill="#F59E0B" stroke="#78350F" />
          <circle cx="70" cy="40" r="3.5" fill="#F59E0B" stroke="#78350F" />
          <circle cx="68" cy="55" r="3.5" fill="#F59E0B" stroke="#78350F" />
          <circle cx="66" cy="70" r="3.5" fill="#F59E0B" stroke="#78350F" />
        </svg>
      `;

    case 'sheriff_badge':
    case 'badge':
      return `
        <svg viewBox="0 0 100 100" class="${className} filter drop-shadow-[0_4px_10px_rgba(245,158,11,0.6)]">
          <defs>
            <linearGradient id="badgeGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFFBEB" />
              <stop offset="30%" stop-color="#FDE047" />
              <stop offset="70%" stop-color="#D97706" />
              <stop offset="100%" stop-color="#78350F" />
            </linearGradient>
          </defs>
          <path
            d="M 50 10 L 61 32 L 85 25 L 75 48 L 95 62 L 70 68 L 72 92 L 50 78 L 28 92 L 30 68 L 5 62 L 25 48 L 15 25 L 39 32 Z"
            fill="url(#badgeGold)"
            stroke="#451A03"
            stroke-width="3"
          />
          <circle cx="50" cy="10" r="4" fill="#FDE047" />
          <circle cx="85" cy="25" r="4" fill="#FDE047" />
          <circle cx="95" cy="62" r="4" fill="#FDE047" />
          <circle cx="72" cy="92" r="4" fill="#FDE047" />
          <circle cx="28" cy="92" r="4" fill="#FDE047" />
          <circle cx="5" cy="62" r="4" fill="#FDE047" />
          <circle cx="15" cy="25" r="4" fill="#FDE047" />
          <circle cx="50" cy="50" r="18" fill="#451A03" stroke="#FDE047" stroke-width="2" />
          <text x="50" y="54" text-anchor="middle" fill="#FDE047" font-size="9" font-weight="900" font-family="'Rye', serif">
            SHERIFF
          </text>
        </svg>
      `;

    case 'dynamite':
      return `
        <svg viewBox="0 0 100 100" class="${className} filter drop-shadow-[0_4px_8px_rgba(239,68,68,0.7)]">
          <g transform="rotate(-15 50 50)">
            <rect x="28" y="25" width="12" height="50" rx="3" fill="#DC2626" stroke="#450A0A" stroke-width="2" />
            <rect x="44" y="20" width="12" height="55" rx="3" fill="#EF4444" stroke="#450A0A" stroke-width="2" />
            <rect x="60" y="28" width="12" height="47" rx="3" fill="#B91C1C" stroke="#450A0A" stroke-width="2" />
            <rect x="25" y="42" width="50" height="8" fill="#111827" />
            <path d="M 50 20 C 50 10, 65 15, 60 5" fill="none" stroke="#FEF08A" stroke-width="3" stroke-dasharray="3,2" />
            <circle cx="60" cy="5" r="5" fill="#F59E0B" />
            <circle cx="60" cy="5" r="2.5" fill="#FFFFFF" />
          </g>
        </svg>
      `;

    case 'money_bag':
      return `
        <svg viewBox="0 0 100 100" class="${className} filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]">
          <path d="M 50 25 C 60 25, 72 30, 77 40 C 84 55, 82 80, 50 82 C 18 80, 16 55, 23 40 C 28 30, 40 25, 50 25 Z" fill="#D97706" stroke="#451A03" stroke-width="3" />
          <rect x="42" y="32" width="16" height="6" rx="2" fill="#B91C1C" />
          <path d="M 40 20 C 42 28, 58 28, 60 20 Z" fill="#B45309" stroke="#451A03" stroke-width="2" />
          <text x="50" y="62" text-anchor="middle" fill="#FEF08A" font-size="28" font-weight="bold" font-family="'Cinzel', serif" stroke="#78350F" stroke-width="1">
            $
          </text>
        </svg>
      `;

    case 'bull_skull':
      return `
        <svg viewBox="0 0 100 100" class="${className} filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]">
          <path d="M 50 45 C 30 40, 10 25, 5 15 C 20 20, 35 32, 45 38" fill="#F59E0B" stroke="#451A03" stroke-width="2" />
          <path d="M 50 45 C 70 40, 90 25, 95 15 C 80 20, 65 32, 55 38" fill="#F59E0B" stroke="#451A03" stroke-width="2" />
          <polygon points="35,35 65,35 58,60 50,75 42,60" fill="#F3F4F6" stroke="#1F2937" stroke-width="3" />
          <ellipse cx="42" cy="48" rx="5" ry="7" fill="#111827" />
          <ellipse cx="58" cy="48" rx="5" ry="7" fill="#111827" />
          <polygon points="48,64 52,64 50,70" fill="#111827" />
        </svg>
      `;

    case 'wagon':
      return `
        <svg viewBox="0 0 100 100" class="${className} filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]">
          <path d="M 20 45 C 20 20, 80 20, 80 45 Z" fill="#FEF3C7" stroke="#92400E" stroke-width="3" />
          <path d="M 35 25 Q 35 45, 35 45 M 50 21 Q 50 45, 50 45 M 65 25 Q 65 45, 65 45" stroke="#D97706" stroke-width="2" fill="none" />
          <rect x="18" y="45" width="64" height="20" rx="3" fill="#78350F" stroke="#451A03" stroke-width="3" />
          <line x1="18" y1="55" x2="82" y2="55" stroke="#451A03" stroke-width="2" />
          <circle cx="30" cy="68" r="14" fill="#B45309" stroke="#451A03" stroke-width="3" />
          <circle cx="30" cy="68" r="4" fill="#FDE047" />
          <circle cx="70" cy="68" r="14" fill="#B45309" stroke="#451A03" stroke-width="3" />
          <circle cx="70" cy="68" r="4" fill="#FDE047" />
        </svg>
      `;

    case 'wild':
      return `
        <svg viewBox="0 0 100 100" class="${className} filter drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]">
          <defs>
            <linearGradient id="wildGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FDE047" />
              <stop offset="50%" stop-color="#F59E0B" />
              <stop offset="100%" stop-color="#B45309" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="44" fill="url(#wildGrad)" stroke="#FFFBEB" stroke-width="3" />
          <polygon points="50,15 80,30 80,70 50,88 20,70 20,30" fill="#180E07" stroke="#FDE047" stroke-width="2.5" />
          <text x="50" y="56" text-anchor="middle" fill="#FDE047" font-size="20" font-weight="900" font-family="'Rye', serif">
            WILD
          </text>
        </svg>
      `;

    case 'jackpot':
    case 'seven':
      return `
        <svg viewBox="0 0 100 100" class="${className} filter drop-shadow-[0_0_15px_rgba(250,204,21,0.9)]">
          <defs>
            <linearGradient id="jpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFFBEB" />
              <stop offset="40%" stop-color="#FDE047" />
              <stop offset="100%" stop-color="#D97706" />
            </linearGradient>
          </defs>
          <rect x="15" y="22" width="70" height="58" rx="10" fill="url(#jpGrad)" stroke="#451A03" stroke-width="4" />
          <rect x="22" y="29" width="56" height="44" rx="6" fill="#381303" />
          <path d="M 30 22 L 35 12 L 50 18 L 65 12 L 70 22 Z" fill="#FDE047" stroke="#451A03" stroke-width="2" />
          <text x="50" y="48" text-anchor="middle" fill="#FDE047" font-size="14" font-weight="900" font-family="'Rye', serif">
            GOLD
          </text>
          <text x="50" y="64" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="900" font-family="'Rye', serif">
            JACKPOT
          </text>
        </svg>
      `;

    default:
      return `
        <svg viewBox="0 0 100 100" class="${className}">
          <circle cx="50" cy="50" r="40" fill="#D97706" />
        </svg>
      `;
  }
}
