/**
 * Handcrafted SVG vector art assets matching the Earthly design language
 * Provides high-DPI, ultra-crisp botanical vines, panoramic landscapes,
 * trophies, and badge shields for the Adult (15+) experience.
 */

export function LandscapeBannerArt({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full object-cover ${className}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EAF6F0" />
          <stop offset="100%" stopColor="#D8EDE2" />
        </linearGradient>
        <linearGradient id="hillBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#95D5B2" />
          <stop offset="100%" stopColor="#74C69D" />
        </linearGradient>
        <linearGradient id="hillMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#52B788" />
          <stop offset="100%" stopColor="#40916C" />
        </linearGradient>
        <linearGradient id="hillFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2D6A4F" />
          <stop offset="100%" stopColor="#1B4332" />
        </linearGradient>
      </defs>

      {/* Sky Background */}
      <rect width="600" height="160" fill="url(#skyGrad)" />

      {/* Stylized Sun */}
      <circle cx="510" cy="45" r="28" fill="#FDE047" opacity="0.6" />
      <circle cx="510" cy="45" r="20" fill="#FACC15" />

      {/* Distant Clouds */}
      <path
        d="M80 50 C90 40, 115 40, 125 50 C135 48, 145 56, 140 64 C130 68, 85 68, 75 64 C70 56, 75 48, 80 50 Z"
        fill="#FFFFFF"
        opacity="0.8"
      />
      <path
        d="M320 35 C330 27, 350 27, 360 35 C370 33, 378 40, 374 47 C365 50, 325 50, 315 47 C310 40, 315 33, 320 35 Z"
        fill="#FFFFFF"
        opacity="0.7"
      />

      {/* Background Hills */}
      <path
        d="M-20 160 Q120 70 260 110 T620 90 L620 160 Z"
        fill="url(#hillBack)"
        opacity="0.7"
      />

      {/* Wind Turbines on Distant Hills */}
      {/* Turbine 1 */}
      <line x1="380" y1="105" x2="380" y2="60" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="380" cy="60" r="3" fill="#FFFFFF" />
      <line x1="380" y1="60" x2="368" y2="42" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="380" y1="60" x2="395" y2="52" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="380" y1="60" x2="378" y2="78" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />

      {/* Turbine 2 */}
      <line x1="430" y1="95" x2="430" y2="45" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <circle cx="430" cy="45" r="3.5" fill="#FFFFFF" />
      <line x1="430" y1="45" x2="415" y2="24" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <line x1="430" y1="45" x2="448" y2="35" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <line x1="430" y1="45" x2="427" y2="66" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

      {/* Turbine 3 */}
      <line x1="475" y1="100" x2="475" y2="65" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <circle cx="475" cy="65" r="2.5" fill="#FFFFFF" />
      <line x1="475" y1="65" x2="465" y2="50" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="475" y1="65" x2="487" y2="58" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="475" y1="65" x2="473" y2="79" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

      {/* Midground Hills */}
      <path
        d="M-20 160 Q80 100 220 125 T480 115 T620 130 L620 160 Z"
        fill="url(#hillMid)"
        opacity="0.9"
      />

      {/* Clustered Trees on Midground */}
      <circle cx="160" cy="118" r="14" fill="#40916C" />
      <circle cx="175" cy="115" r="16" fill="#2D6A4F" />
      <circle cx="190" cy="119" r="12" fill="#40916C" />
      <circle cx="280" cy="122" r="12" fill="#2D6A4F" />
      <circle cx="295" cy="120" r="15" fill="#1B4332" />

      {/* Foreground Rolling Pasture */}
      <path
        d="M-20 160 Q150 115 350 145 T620 135 L620 160 Z"
        fill="url(#hillFront)"
      />

      {/* Foreground Tree Accents */}
      <circle cx="50" cy="140" r="22" fill="#1B4332" />
      <circle cx="70" cy="136" r="26" fill="#2D6A4F" />
      <circle cx="92" cy="142" r="18" fill="#40916C" />
    </svg>
  );
}

export function BotanicalSidebarArt({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Tall Stem with Leaves */}
      <path
        d="M30 130 Q45 80 40 30"
        stroke="#52B788"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M40 30 Q55 35 60 50 Q45 55 40 30 Z"
        fill="#74C69D"
      />
      <path
        d="M36 60 Q15 65 15 80 Q32 80 36 60 Z"
        fill="#52B788"
      />
      <path
        d="M38 90 Q60 90 62 105 Q42 108 38 90 Z"
        fill="#74C69D"
      />

      {/* Second Branch with Yellow Flowers */}
      <path
        d="M75 130 Q80 95 95 65"
        stroke="#74C69D"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M85 85 Q100 80 108 92 Q92 98 85 85 Z"
        fill="#95D5B2"
      />

      {/* Cheerful Yellow Wildflowers */}
      <g transform="translate(95, 65)">
        <circle cx="0" cy="0" r="5" fill="#F59E0B" />
        <circle cx="0" cy="-8" r="4" fill="#FCD34D" />
        <circle cx="7" cy="-3" r="4" fill="#FCD34D" />
        <circle cx="5" cy="6" r="4" fill="#FCD34D" />
        <circle cx="-5" cy="6" r="4" fill="#FCD34D" />
        <circle cx="-7" cy="-3" r="4" fill="#FCD34D" />
      </g>

      <g transform="translate(55, 45) scale(0.7)">
        <circle cx="0" cy="0" r="5" fill="#F59E0B" />
        <circle cx="0" cy="-8" r="4" fill="#FCD34D" />
        <circle cx="7" cy="-3" r="4" fill="#FCD34D" />
        <circle cx="5" cy="6" r="4" fill="#FCD34D" />
        <circle cx="-5" cy="6" r="4" fill="#FCD34D" />
        <circle cx="-7" cy="-3" r="4" fill="#FCD34D" />
      </g>

      {/* Bushy Leaves at Base */}
      <path
        d="M10 130 Q25 110 40 130 Z"
        fill="#2D6A4F"
      />
      <path
        d="M60 130 Q85 105 110 130 Z"
        fill="#40916C"
      />
      <path
        d="M110 130 Q130 115 150 130 Z"
        fill="#52B788"
      />
    </svg>
  );
}

export function BotanicalVinesArt({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Elegant Curved Stem */}
      <path
        d="M50 0 C45 70 70 120 45 190 C25 250 65 310 50 400"
        stroke="#40916C"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Leaves along vine */}
      {/* Node 1 */}
      <path d="M47 35 Q70 20 75 40 Q55 50 47 35 Z" fill="#74C69D" />
      {/* Node 2 */}
      <path d="M46 75 Q20 65 20 85 Q40 92 46 75 Z" fill="#52B788" />
      {/* Purple Little Flower */}
      <g transform="translate(68, 115) scale(0.8)">
        <circle cx="0" cy="0" r="4" fill="#FBBF24" />
        <circle cx="0" cy="-6" r="3.5" fill="#A855F7" />
        <circle cx="5" cy="-2" r="3.5" fill="#A855F7" />
        <circle cx="4" cy="5" r="3.5" fill="#A855F7" />
        <circle cx="-4" cy="5" r="3.5" fill="#A855F7" />
        <circle cx="-5" cy="-2" r="3.5" fill="#A855F7" />
      </g>
      {/* Node 3 */}
      <path d="M50 150 Q75 140 80 160 Q60 170 50 150 Z" fill="#40916C" />
      {/* Node 4 */}
      <path d="M40 210 Q15 200 15 220 Q35 228 40 210 Z" fill="#74C69D" />
      {/* Yellow Wildflower */}
      <g transform="translate(65, 260) scale(0.85)">
        <circle cx="0" cy="0" r="4.5" fill="#D97706" />
        <circle cx="0" cy="-6.5" r="4" fill="#FBBF24" />
        <circle cx="6" cy="-2" r="4" fill="#FBBF24" />
        <circle cx="4" cy="5.5" r="4" fill="#FBBF24" />
        <circle cx="-4" cy="5.5" r="4" fill="#FBBF24" />
        <circle cx="-6" cy="-2" r="4" fill="#FBBF24" />
      </g>
      {/* Node 5 */}
      <path d="M55 300 Q80 295 85 315 Q65 325 55 300 Z" fill="#52B788" />
      {/* Node 6 */}
      <path d="M52 350 Q25 345 25 365 Q45 372 52 350 Z" fill="#40916C" />
      {/* Clustered Base Buds */}
      <circle cx="45" cy="385" r="6" fill="#F87171" />
      <circle cx="55" cy="390" r="5" fill="#FCD34D" />
    </svg>
  );
}

export function GoldenTrophyArt({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
        <linearGradient id="cupShine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#A16207" />
        </linearGradient>
      </defs>

      {/* Laurel Wreath */}
      <path
        d="M30 95 C25 60 45 35 60 25"
        stroke="#40916C"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path d="M30 75 Q15 65 22 55 Q35 65 30 75 Z" fill="#52B788" />
      <path d="M38 55 Q26 42 36 35 Q45 46 38 55 Z" fill="#74C69D" />
      <path d="M50 38 Q42 24 54 20 Q60 32 50 38 Z" fill="#52B788" />

      <path
        d="M130 95 C135 60 115 35 100 25"
        stroke="#40916C"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path d="M130 75 Q145 65 138 55 Q125 65 130 75 Z" fill="#52B788" />
      <path d="M122 55 Q134 42 124 35 Q115 46 122 55 Z" fill="#74C69D" />
      <path d="M110 38 Q118 24 106 20 Q100 32 110 38 Z" fill="#52B788" />

      {/* Trophy Handles */}
      <path
        d="M50 50 C28 50 28 80 50 82"
        stroke="url(#goldGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M110 50 C132 50 132 80 110 82"
        stroke="url(#goldGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Main Trophy Cup */}
      <path
        d="M48 40 L112 40 C112 75 96 95 80 95 C64 95 48 75 48 40 Z"
        fill="url(#cupShine)"
        stroke="#A16207"
        strokeWidth="2"
      />
      {/* Cup Rim */}
      <ellipse cx="80" cy="40" rx="32" ry="7" fill="#FEF08A" stroke="#A16207" strokeWidth="2" />

      {/* Stem */}
      <path d="M74 95 L72 115 L88 115 L86 95 Z" fill="url(#goldGrad)" stroke="#A16207" strokeWidth="1.5" />

      {/* Base */}
      <path
        d="M60 115 L100 115 L106 130 L54 130 Z"
        fill="#78350F"
        stroke="#451A03"
        strokeWidth="2"
      />
      <rect x="52" y="130" width="56" height="8" rx="2" fill="#451A03" />

      {/* Star Emblem on Cup */}
      <polygon
        points="80,55 83,63 91,63 85,68 87,76 80,71 73,76 75,68 69,63 77,63"
        fill="#FFFFFF"
        opacity="0.9"
      />

      {/* Little Sparkles */}
      <circle cx="38" cy="28" r="2.5" fill="#FDE047" />
      <circle cx="125" cy="22" r="3" fill="#FDE047" />
      <polygon points="128,48 130,53 135,55 130,57 128,62 126,57 121,55 126,53" fill="#FBBF24" />
    </svg>
  );
}

/**
 * Centerpiece hero illustration from Earthly:
 * Two gentle hands holding the Earth globe with trees, wind turbines, clouds, sun,
 * and a curved ribbon badge "A Greener Future Starts With You".
 */
export function EarthHandsHeroArt({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 540 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Sky / Glow radial */}
        <radialGradient id="heroAtmosphere" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#C8F5DC" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#E8F9F0" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0" />
        </radialGradient>

        {/* Earth ocean gradient */}
        <linearGradient id="oceanGrad" x1="0.2" y1="0.1" x2="0.8" y2="0.9">
          <stop offset="0%" stopColor="#64B5F6" />
          <stop offset="40%" stopColor="#42A5F5" />
          <stop offset="100%" stopColor="#1E88E5" />
        </linearGradient>

        {/* Continents gradient */}
        <linearGradient id="landGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#81C784" />
          <stop offset="100%" stopColor="#4CAF50" />
        </linearGradient>

        {/* Hands skin tone gradient */}
        <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5D0B5" />
          <stop offset="100%" stopColor="#E8BA9B" />
        </linearGradient>

        <linearGradient id="cuffGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2D6A4F" />
          <stop offset="100%" stopColor="#1B4332" />
        </linearGradient>

        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#1B4332" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Atmospheric Soft Aura */}
      <circle cx="270" cy="220" r="220" fill="url(#heroAtmosphere)" />

      {/* Radiant Sun in Upper Right */}
      <g transform="translate(420, 90)">
        <circle cx="0" cy="0" r="34" fill="#FEF08A" opacity="0.5" />
        <circle cx="0" cy="0" r="24" fill="#FDE047" />
        <circle cx="0" cy="0" r="16" fill="#FACC15" />
        {/* Sun rays */}
        <line x1="0" y1="-32" x2="0" y2="-40" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
        <line x1="24" y1="-24" x2="30" y2="-30" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
        <line x1="32" y1="0" x2="40" y2="0" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
        <line x1="24" y1="24" x2="30" y2="30" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
        <line x1="0" y1="32" x2="0" y2="40" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
        <line x1="-24" y1="24" x2="-30" y2="30" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
        <line x1="-32" y1="0" x2="-40" y2="0" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
        <line x1="-24" y1="-24" x2="-30" y2="-30" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Floating Fluffy Clouds */}
      <g opacity="0.9">
        {/* Cloud Left */}
        <path
          d="M90 140 C100 120 128 120 138 135 C148 130 162 140 160 152 C160 162 90 162 90 152 C82 148 85 142 90 140 Z"
          fill="#FFFFFF"
        />
        {/* Cloud Right */}
        <path
          d="M360 160 C370 145 394 145 402 158 C412 154 425 162 422 172 C422 180 360 180 360 172 C352 168 355 162 360 160 Z"
          fill="#FFFFFF"
        />
      </g>

      {/* Soaring Birds */}
      <path d="M140 95 Q148 85 156 95 Q164 85 172 95" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.75" />
      <path d="M165 75 Q171 67 177 75 Q183 67 189 75" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* THE EARTH GLOBE (Centered) */}
      <g filter="url(#softShadow)">
        {/* Globe Base Ocean */}
        <circle cx="270" cy="220" r="125" fill="url(#oceanGrad)" />

        {/* Continents & Landforms */}
        <g clipPath="url(#globeClip)">
          {/* North America / Eurasia */}
          <path
            d="M210 140 C230 130 250 145 270 135 C290 125 320 140 330 160 C340 180 330 200 310 205 C290 210 270 195 250 200 C230 205 210 190 205 170 C200 150 200 145 210 140 Z"
            fill="url(#landGrad)"
          />
          {/* South America / Africa */}
          <path
            d="M235 220 C250 215 265 225 275 240 C285 255 275 285 260 295 C245 305 230 290 225 270 C220 250 225 230 235 220 Z"
            fill="url(#landGrad)"
          />
          {/* Asia / Island Group */}
          <path
            d="M320 215 C335 210 350 220 355 235 C360 250 345 265 330 260 C320 255 315 240 320 215 Z"
            fill="url(#landGrad)"
          />
          <circle cx="365" cy="245" r="7" fill="url(#landGrad)" />
          <circle cx="355" cy="275" r="9" fill="url(#landGrad)" />

          {/* Globe Atmosphere Sheen */}
          <ellipse cx="230" cy="160" rx="90" ry="50" fill="#FFFFFF" opacity="0.2" transform="rotate(-25 230 160)" />
        </g>
      </g>

      <clipPath id="globeClip">
        <circle cx="270" cy="220" r="125" />
      </clipPath>

      {/* TOP DECORATIONS ON GLOBE (Trees & Windmills sprouting from Earth) */}
      <g>
        {/* Wind Turbine 1 (Center-Left) */}
        <line x1="240" y1="135" x2="240" y2="70" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="240" cy="70" r="4.5" fill="#FFFFFF" />
        <line x1="240" y1="70" x2="222" y2="45" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="240" y1="70" x2="258" y2="58" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="240" y1="70" x2="238" y2="95" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

        {/* Wind Turbine 2 (Center-Right, Taller) */}
        <line x1="295" y1="125" x2="295" y2="50" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
        <circle cx="295" cy="50" r="5" fill="#FFFFFF" />
        <line x1="295" y1="50" x2="272" y2="25" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        <line x1="295" y1="50" x2="318" y2="38" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        <line x1="295" y1="50" x2="292" y2="80" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

        {/* Lush Green Trees Sprouting on North of Globe */}
        {/* Tree 1 */}
        <rect x="208" y="115" width="5" height="15" fill="#78350F" rx="2" />
        <circle cx="210" cy="110" r="16" fill="#2D6A4F" />
        <circle cx="218" cy="106" r="12" fill="#52B788" />

        {/* Tree 2 */}
        <rect x="268" y="110" width="6" height="18" fill="#78350F" rx="2" />
        <circle cx="271" cy="102" r="20" fill="#1B4332" />
        <circle cx="265" cy="98" r="16" fill="#40916C" />
        <circle cx="280" cy="98" r="14" fill="#74C69D" />

        {/* Tree 3 */}
        <rect x="330" y="120" width="5" height="14" fill="#78350F" rx="2" />
        <circle cx="332" cy="115" r="15" fill="#2D6A4F" />
        <circle cx="340" cy="112" r="11" fill="#52B788" />
      </g>

      {/* TWO GENTLE HANDS CRADLING THE GLOBE */}
      <g filter="url(#softShadow)">
        {/* Left Arm & Sleeve */}
        <path
          d="M130 480 L160 410 C160 410 180 395 210 390 L210 480 Z"
          fill="url(#cuffGrad)"
        />
        {/* Left Hand & Fingers Cradling Earth */}
        <path
          d="M175 410 C185 365 200 320 220 280 C223 274 231 275 233 282 C236 295 234 320 230 345 C237 325 244 300 252 285 C255 280 263 281 264 288 C266 303 260 328 255 350 C262 335 272 315 280 305 C284 300 291 303 291 310 C290 325 280 355 270 375 C260 395 240 420 205 435 Z"
          fill="url(#skinGrad)"
          stroke="#E2A682"
          strokeWidth="1.5"
        />

        {/* Right Arm & Sleeve */}
        <path
          d="M410 480 L380 410 C380 410 360 395 330 390 L330 480 Z"
          fill="url(#cuffGrad)"
        />
        {/* Right Hand & Fingers Cradling Earth */}
        <path
          d="M365 410 C355 365 340 320 320 280 C317 274 309 275 307 282 C304 295 306 320 310 345 C303 325 296 300 288 285 C285 280 277 281 276 288 C274 303 280 328 285 350 C278 335 268 315 260 305 C256 300 249 303 249 310 C250 325 260 355 270 375 C280 395 300 420 335 435 Z"
          fill="url(#skinGrad)"
          stroke="#E2A682"
          strokeWidth="1.5"
        />

        {/* Palms Joining at Base */}
        <path
          d="M210 410 C240 435 300 435 330 410 C310 445 230 445 210 410 Z"
          fill="#E2A682"
        />
      </g>

      {/* Floating Green Leaves Around the Hands */}
      <g>
        <path d="M110 340 Q130 325 140 345 Q120 355 110 340 Z" fill="#52B788" />
        <path d="M430 330 Q410 315 400 335 Q420 345 430 330 Z" fill="#40916C" />
        <path d="M125 260 Q145 250 150 270 Q130 278 125 260 Z" fill="#74C69D" />
        <path d="M415 250 Q395 240 390 260 Q410 268 415 250 Z" fill="#52B788" />
      </g>

      {/* Curved Motto Ribbon / Badge: "A Greener Future Starts With You" */}
      <g transform="translate(350, 370)">
        <rect
          x="0"
          y="0"
          width="170"
          height="54"
          rx="18"
          fill="#FFFFFF"
          stroke="#D8EDE2"
          strokeWidth="2"
          filter="url(#softShadow)"
        />
        <circle cx="22" cy="27" r="12" fill="#E8F9F0" />
        <path d="M18 31 Q22 19 28 23 Q24 29 18 31 Z" fill="#2D6A4F" />
        <text
          x="42"
          y="23"
          fill="#13382B"
          fontSize="11"
          fontWeight="800"
          fontFamily="system-ui, sans-serif"
        >
          A Greener Future
        </text>
        <text
          x="42"
          y="39"
          fill="#52B788"
          fontSize="11"
          fontWeight="800"
          fontFamily="system-ui, sans-serif"
        >
          Starts With You 💚
        </text>
      </g>
    </svg>
  );
}

