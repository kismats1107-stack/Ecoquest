/**
 * Handcrafted vector artwork for the EcoQuest Kids experience (Image 6):
 * - KidsHeroArt: Boy and girl hugging a smiling Earth globe on lush rolling hills.
 * - WaterDropletMascot: Cute smiling water droplet character with rosy cheeks.
 * - EarthMascotArt: Cute smiling Earth character for question headers.
 * - KidsFoliageFooterArt: Grassy wildflower border framing screens.
 * - 6 Kids Badge Vector Badges: Water Warrior, Tree Hugger, Energy Saver, Recycling Champ, Climate Hero, Nature Explorer.
 */

export function KidsHeroArt({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 500 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Soft Sun Aura */}
        <radialGradient id="sunAura" cx="80%" cy="20%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#FEF9C3" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>

        {/* Earth Gradient */}
        <linearGradient id="kidsEarthOcean" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="50%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        <linearGradient id="kidsEarthLand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>

        {/* Rolling Hills Gradient */}
        <linearGradient id="backHills" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="100%" stopColor="#4ADE80" />
        </linearGradient>

        <linearGradient id="frontHills" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>

        <filter id="kidShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0F766E" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Sun glow */}
      <circle cx="420" cy="80" r="70" fill="url(#sunAura)" />
      <circle cx="420" cy="80" r="28" fill="#FACC15" />

      {/* Fluffy clouds */}
      <path
        d="M70 70 C80 50 110 50 120 65 C130 60 145 70 140 82 C140 90 70 90 70 82 Z"
        fill="#FFFFFF"
        opacity="0.9"
      />
      <path
        d="M330 90 C340 75 365 75 372 87 C382 82 395 90 392 100 C392 108 330 108 330 100 Z"
        fill="#FFFFFF"
        opacity="0.8"
      />

      {/* Background Hill */}
      <path
        d="M-20 420 Q120 220 280 260 T520 240 L520 420 Z"
        fill="url(#backHills)"
        opacity="0.85"
      />

      {/* Foreground Rolling Lush Hill */}
      <path
        d="M-20 420 Q180 260 360 280 T520 290 L520 420 Z"
        fill="url(#frontHills)"
      />

      {/* Wildflowers on the grass */}
      <circle cx="60" cy="380" r="5" fill="#FDE047" />
      <circle cx="110" cy="360" r="4.5" fill="#F472B6" />
      <circle cx="410" cy="370" r="5" fill="#FDE047" />
      <circle cx="460" cy="350" r="4" fill="#38BDF8" />
      <circle cx="380" cy="390" r="4.5" fill="#F472B6" />

      {/* CENTERPIECE: Smiling Earth Globe */}
      <g filter="url(#kidShadow)">
        {/* Globe Body */}
        <circle cx="250" cy="220" r="95" fill="url(#kidsEarthOcean)" />

        {/* Continents with Cute Shapes */}
        <g clipPath="url(#kidsGlobeClip)">
          {/* North America / Europe */}
          <path
            d="M200 150 C215 140 235 150 250 145 C265 140 290 155 295 170 C300 190 285 200 270 205 C250 210 235 195 220 200 C205 205 190 190 195 170 Z"
            fill="url(#kidsEarthLand)"
          />
          {/* South America */}
          <path
            d="M215 220 C230 215 245 225 250 240 C255 260 240 285 225 295 C215 290 210 270 205 250 C205 235 210 225 215 220 Z"
            fill="url(#kidsEarthLand)"
          />
          {/* Asia / Australia */}
          <path
            d="M290 210 C310 205 325 215 330 230 C335 245 320 260 305 255 C295 250 290 235 290 210 Z"
            fill="url(#kidsEarthLand)"
          />
          <circle cx="310" cy="275" r="10" fill="url(#kidsEarthLand)" />

          {/* Sparkle reflection */}
          <ellipse cx="215" cy="170" rx="40" ry="20" fill="#FFFFFF" opacity="0.25" transform="rotate(-30 215 170)" />
        </g>

        {/* Globe Cute Happy Face! */}
        {/* Rosy Cheeks */}
        <ellipse cx="215" cy="235" rx="9" ry="6" fill="#F87171" opacity="0.5" />
        <ellipse cx="285" cy="235" rx="9" ry="6" fill="#F87171" opacity="0.5" />

        {/* Eyes (Happy Closed Curves) */}
        <path
          d="M210 220 Q220 210 230 220"
          stroke="#0F172A"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M270 220 Q280 210 290 220"
          stroke="#0F172A"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Big Smile */}
        <path
          d="M235 235 Q250 252 265 235"
          stroke="#0F172A"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Cute Tongue */}
        <path
          d="M244 243 Q250 250 256 243 Z"
          fill="#FB7185"
        />
      </g>

      <clipPath id="kidsGlobeClip">
        <circle cx="250" cy="220" r="95" />
      </clipPath>

      {/* LEFT CHARACTER: Cute Girl with Ponytails Hugging Earth */}
      <g filter="url(#kidShadow)">
        {/* Girl Body / Yellow Shirt */}
        <path
          d="M140 280 C150 210 180 180 210 190 L210 270 L140 280 Z"
          fill="#FACC15"
        />
        {/* Arm hugging globe */}
        <path
          d="M180 210 C200 215 220 230 230 250 C220 255 190 240 180 230 Z"
          fill="#F5D0B5"
          stroke="#E2A682"
          strokeWidth="1.5"
        />

        {/* Girl Head */}
        <circle cx="170" cy="160" r="28" fill="#F5D0B5" />

        {/* Girl Hair (Brown Ponytails) */}
        <circle cx="170" cy="148" r="30" fill="#451A03" />
        {/* Ponytail Left */}
        <ellipse cx="132" cy="140" rx="16" ry="24" fill="#451A03" transform="rotate(-20 132 140)" />
        {/* Red hair tie */}
        <circle cx="144" cy="145" r="5" fill="#EF4444" />
        {/* Face Cutout Hair Bangs */}
        <path
          d="M148 152 Q170 140 192 152 Q170 135 148 152 Z"
          fill="#451A03"
        />

        {/* Girl Face */}
        {/* Eye */}
        <circle cx="175" cy="162" r="3" fill="#0F172A" />
        <circle cx="176" cy="160" r="1" fill="#FFFFFF" />
        {/* Cheek */}
        <circle cx="168" cy="170" r="4.5" fill="#FB7185" opacity="0.6" />
        {/* Smile */}
        <path d="M176 172 Q182 178 186 170" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>

      {/* RIGHT CHARACTER: Cute Boy with Spiky Hair Hugging Earth */}
      <g filter="url(#kidShadow)">
        {/* Boy Body / Blue Shirt */}
        <path
          d="M360 280 C350 210 320 180 290 190 L290 270 L360 280 Z"
          fill="#38BDF8"
        />
        {/* Arm hugging globe */}
        <path
          d="M320 210 C300 215 280 230 270 250 C280 255 310 240 320 230 Z"
          fill="#F5D0B5"
          stroke="#E2A682"
          strokeWidth="1.5"
        />

        {/* Boy Head */}
        <circle cx="330" cy="160" r="28" fill="#F5D0B5" />

        {/* Boy Hair (Short Brown Tousled) */}
        <path
          d="M305 155 C305 130 325 125 345 130 C360 135 365 150 360 165 C355 150 345 145 330 145 C320 145 315 150 305 155 Z"
          fill="#451A03"
        />
        {/* Tuft */}
        <path d="M335 128 Q345 118 350 126 Z" fill="#451A03" />

        {/* Boy Face */}
        {/* Eye */}
        <circle cx="325" cy="162" r="3" fill="#0F172A" />
        <circle cx="324" cy="160" r="1" fill="#FFFFFF" />
        {/* Cheek */}
        <circle cx="332" cy="170" r="4.5" fill="#FB7185" opacity="0.6" />
        {/* Smile */}
        <path d="M315 170 Q320 178 326 172" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>

      {/* Floating Little Heart Above */}
      <g transform="translate(245, 95) scale(0.9)">
        <path
          d="M10 5 C5 -5 -10 -5 -10 5 C-10 15 10 28 10 28 C10 28 30 15 30 5 C30 -5 15 -5 10 5 Z"
          fill="#F43F5E"
        />
      </g>
    </svg>
  );
}

/** Cute Animated Water Droplet Mascot with Rosy Cheeks and Tiny Hands */
export function WaterDropletMascot({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="dropGrad" x1="0.3" y1="0.1" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="60%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
      </defs>

      {/* Droplet Body */}
      <path
        d="M60 15 C60 15 20 65 20 90 C20 112 38 125 60 125 C82 125 100 112 100 90 C100 65 60 15 60 15 Z"
        fill="url(#dropGrad)"
        stroke="#0284C7"
        strokeWidth="3"
      />

      {/* Highlight reflection */}
      <path
        d="M40 70 C35 78 35 88 40 95"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />

      {/* Rosy Cheeks */}
      <ellipse cx="42" cy="92" rx="6" ry="4" fill="#FB7185" opacity="0.6" />
      <ellipse cx="78" cy="92" rx="6" ry="4" fill="#FB7185" opacity="0.6" />

      {/* Big Cute Eyes */}
      <circle cx="48" cy="82" r="5" fill="#0F172A" />
      <circle cx="47" cy="80" r="2" fill="#FFFFFF" />

      <circle cx="72" cy="82" r="5" fill="#0F172A" />
      <circle cx="71" cy="80" r="2" fill="#FFFFFF" />

      {/* Cheerful Smile */}
      <path
        d="M54 90 Q60 98 66 90"
        stroke="#0F172A"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Little waving left hand */}
      <path
        d="M22 88 Q10 85 14 74 Q20 78 24 84"
        fill="#38BDF8"
        stroke="#0284C7"
        strokeWidth="2.5"
      />

      {/* Little right hand */}
      <path
        d="M98 88 Q110 85 106 74 Q100 78 96 84"
        fill="#38BDF8"
        stroke="#0284C7"
        strokeWidth="2.5"
      />
    </svg>
  );
}

/** Earth Mascot Header Circle */
export function EarthMascotArt({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="40" cy="40" r="36" fill="#38BDF8" stroke="#0284C7" strokeWidth="2.5" />
      {/* Land shapes */}
      <path
        d="M20 30 C25 25 35 28 40 25 C45 22 55 30 52 40 C48 45 42 42 35 48 C28 52 22 45 20 30 Z"
        fill="#4ADE80"
      />
      <circle cx="50" cy="55" r="7" fill="#4ADE80" />
      {/* Cheeks */}
      <circle cx="30" cy="42" r="3" fill="#FB7185" opacity="0.6" />
      <circle cx="50" cy="42" r="3" fill="#FB7185" opacity="0.6" />
      {/* Eyes */}
      <circle cx="33" cy="36" r="3" fill="#0F172A" />
      <circle cx="32" cy="35" r="1" fill="#FFFFFF" />
      <circle cx="47" cy="36" r="3" fill="#0F172A" />
      <circle cx="46" cy="35" r="1" fill="#FFFFFF" />
      {/* Smile */}
      <path d="M37 42 Q40 46 43 42" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** Bottom Foliage for Badges & Leaderboard */
export function KidsFoliageFooterArt({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full ${className}`}
      preserveAspectRatio="none"
    >
      <path
        d="M0 70 L0 45 Q30 20 60 45 T120 35 T180 50 T240 25 T300 45 T360 30 T420 50 T480 30 T540 45 T600 35 L600 70 Z"
        fill="#22C55E"
        opacity="0.8"
      />
      <path
        d="M0 70 L0 55 Q40 35 80 55 T160 45 T240 60 T320 40 T400 55 T480 40 T560 55 T600 48 L600 70 Z"
        fill="#16A34A"
      />
      {/* Wildflowers */}
      <circle cx="95" cy="40" r="5" fill="#FACC15" />
      <circle cx="210" cy="42" r="4.5" fill="#F472B6" />
      <circle cx="340" cy="35" r="5" fill="#FACC15" />
      <circle cx="450" cy="45" r="4.5" fill="#38BDF8" />
      <circle cx="530" cy="38" r="5" fill="#FACC15" />
    </svg>
  );
}
