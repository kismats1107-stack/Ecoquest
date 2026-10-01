import { cn } from '@/lib/cn';

/** Illustrated character with digital tablet and sparkles (inspired by Quiz editor in Image 1) */
export function StudentTabletIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('size-28 sm:size-32', className)} aria-hidden>
      {/* Sparkles */}
      <path d="M130 35L132 42L139 44L132 46L130 53L128 46L121 44L128 42Z" fill="#FDE047" />
      <path d="M28 60L29.5 65L34.5 66.5L29.5 68L28 73L26.5 68L21.5 66.5L26.5 65Z" fill="#67E8F9" />
      <circle cx="140" cy="80" r="3" fill="#A7F3D0" />
      <circle cx="20" cy="30" r="2.5" fill="#FDE047" />

      {/* Head and Hair */}
      <circle cx="80" cy="65" r="32" fill="#FEF3C7" stroke="#1E293B" strokeWidth="4" />
      {/* Hair */}
      <path
        d="M52 58C52 42 62 30 80 30C98 30 108 42 108 58C108 59 104 52 98 52C92 52 88 56 82 54C76 52 70 48 62 52C56 55 54 58 52 58Z"
        fill="#1E293B"
      />
      {/* Cute face eyes and smile */}
      <ellipse cx="70" cy="65" rx="3.5" ry="5" fill="#1E293B" />
      <ellipse cx="90" cy="65" rx="3.5" ry="5" fill="#1E293B" />
      <path d="M75 75C78 78 82 78 85 75" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
      {/* Rosy cheeks */}
      <circle cx="64" cy="70" r="4" fill="#FDA4AF" opacity="0.6" />
      <circle cx="96" cy="70" r="4" fill="#FDA4AF" opacity="0.6" />

      {/* Body / Shirt */}
      <path d="M52 97C52 97 60 92 80 92C100 92 108 97 108 97L116 130H44L52 97Z" fill="#F8FAFC" stroke="#1E293B" strokeWidth="4" />

      {/* Tablet */}
      <rect x="50" y="112" width="60" height="38" rx="6" fill="#0F766E" stroke="#1E293B" strokeWidth="4" transform="rotate(-6 80 131)" />
      <rect x="55" y="116" width="50" height="28" rx="3" fill="#CCFBF1" transform="rotate(-6 80 131)" />
      {/* Screen glow rays */}
      <path d="M72 110L68 98" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M80 108L80 95" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M88 110L92 98" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />

      {/* Hands on tablet */}
      <ellipse cx="58" cy="126" rx="6" ry="5" fill="#FEF3C7" stroke="#1E293B" strokeWidth="3" />
      <ellipse cx="102" cy="122" rx="6" ry="5" fill="#FEF3C7" stroke="#1E293B" strokeWidth="3" />
    </svg>
  );
}

/** Illustrated character pointing and smiling with sparkles (inspired by AI Quiz in Image 1) */
export function StudentPointingIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('size-28 sm:size-32', className)} aria-hidden>
      {/* AI Stars & Aura */}
      <path d="M136 45L138.5 54L147.5 56.5L138.5 59L136 68L133.5 59L124.5 56.5L133.5 54Z" fill="#38BDF8" />
      <path d="M25 40L26.5 45L31.5 46.5L26.5 48L25 53L23.5 48L18.5 46.5L23.5 45Z" fill="#FDE047" />
      <circle cx="145" cy="90" r="3" fill="#F472B6" />
      <circle cx="22" cy="85" r="3" fill="#67E8F9" />

      {/* Head and Hair */}
      <circle cx="80" cy="65" r="32" fill="#FEF3C7" stroke="#1E293B" strokeWidth="4" />
      {/* Hair */}
      <path
        d="M52 56C52 40 64 30 80 30C96 30 108 40 108 56C108 57 102 50 96 50C90 50 86 54 80 52C74 50 68 46 60 50C54 53 53 56 52 56Z"
        fill="#1E293B"
      />
      {/* Eyes & Big confident smile */}
      <ellipse cx="70" cy="65" rx="3.5" ry="5" fill="#1E293B" />
      <ellipse cx="90" cy="65" rx="3.5" ry="5" fill="#1E293B" />
      <path d="M74 74C77 80 83 80 86 74" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
      {/* Rosy cheeks */}
      <circle cx="64" cy="71" r="4" fill="#FDA4AF" opacity="0.6" />
      <circle cx="96" cy="71" r="4" fill="#FDA4AF" opacity="0.6" />

      {/* Body / Shirt */}
      <path d="M52 97C52 97 60 92 80 92C100 92 108 97 108 97L116 130H44L52 97Z" fill="#F8FAFC" stroke="#1E293B" strokeWidth="4" />

      {/* Pointing hand gesture */}
      <path
        d="M102 108L118 95C121 92 125 94 124 98L118 108"
        stroke="#1E293B"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="120" cy="94" r="5" fill="#FEF3C7" stroke="#1E293B" strokeWidth="3" />
      {/* Magic zap from finger */}
      <path d="M128 88L134 82M134 94L140 92M126 98L132 104" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
