import { Link } from 'react-router';

export function BubblyLogo({ to = '/kids', className = '' }: { to?: string; className?: string }) {
  // Letters: E c o Q u e s t with colorful pop & black outline matching Image 1
  const letters = [
    { char: 'E', bg: 'bg-[#FF6B6B]', text: 'text-white' },
    { char: 'c', bg: 'bg-[#4ECDC4]', text: 'text-white' },
    { char: 'o', bg: 'bg-[#FFE66D]', text: 'text-slate-900' },
    { char: 'Q', bg: 'bg-[#FF8E72]', text: 'text-white' },
    { char: 'u', bg: 'bg-[#2ECC71]', text: 'text-white' },
    { char: 'e', bg: 'bg-[#54A0FF]', text: 'text-white' },
    { char: 's', bg: 'bg-[#A55EEA]', text: 'text-white' },
    { char: 't', bg: 'bg-[#FF9FF3]', text: 'text-slate-900' },
  ];

  return (
    <Link to={to} className={`group inline-flex items-center gap-0.5 select-none ${className}`} aria-label="EcoQuest Kids Home">
      <div className="flex items-center -space-x-1">
        {letters.map((item, index) => (
          <span
            key={index}
            style={{
              filter: 'drop-shadow(0 2px 0 #1E293B)',
            }}
            className={`relative inline-flex items-center justify-center size-8 sm:size-9 rounded-xl font-black text-lg sm:text-xl border-2 border-slate-900 ${item.bg} ${item.text} transition-transform duration-150 group-hover:scale-105 group-hover:-translate-y-0.5`}
          >
            {item.char}
            {/* White cartoon highlight glare on top left */}
            <span className="absolute top-1 left-1.5 size-1.5 rounded-full bg-white/70 pointer-events-none" />
          </span>
        ))}
      </div>
      <span className="ml-1.5 text-xs font-black text-slate-800 tracking-wider uppercase bg-[#FFE66D] border border-slate-900 px-1.5 py-0.5 rounded-md shadow-[1px_1px_0_#1E293B]">
        .com
      </span>
    </Link>
  );
}
