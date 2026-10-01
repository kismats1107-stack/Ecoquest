import { ArrowRight, ChevronDown, Triangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function Landing() {
  useDocumentTitle('EcoQuest - One Unified Platform for Environmental Learning');
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navbar scroll background trigger
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const closeMenuAndNavigate = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="font-helvetica-neue bg-brand-cream text-brand-dark min-h-screen selection:bg-brand-green selection:text-white">
      {/* 1) NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition duration-300 ${
          scrolled ? 'bg-brand-cream/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative flex items-center h-16 md:h-20">
            {/* Desktop Left Links */}
            <div className="hidden md:flex items-center gap-8 animate-fade-down stagger-1">
              <button
                type="button"
                onClick={() => navigate('/start')}
                className="text-sm text-brand-dark tracking-wide uppercase hover:opacity-70 transition-opacity flex items-center gap-1 cursor-pointer"
              >
                <span>Solutions</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <Link
                to="/start"
                className="text-sm text-brand-dark tracking-wide uppercase hover:opacity-70 transition-opacity"
              >
                Curriculum
              </Link>
              <Link
                to="/start"
                className="text-sm text-brand-dark tracking-wide uppercase hover:opacity-70 transition-opacity"
              >
                Impact
              </Link>
            </div>

            {/* Center Logo (Absolute Centered) */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 animate-fade-down stagger-2 select-none"
              aria-label="EcoQuest Home"
            >
              <Triangle className="w-5 h-5 text-brand-dark fill-brand-dark" />
              <span className="text-xl text-brand-dark tracking-tight font-helvetica-neue font-medium">
                EcoQuest
              </span>
            </Link>

            {/* Desktop CTA (Right) */}
            <Link
              to="/start"
              className="hidden md:inline-flex items-center ml-auto px-5 py-2.5 bg-brand-dark text-white text-sm tracking-wide uppercase rounded-full hover:bg-brand-green transition-colors animate-fade-down stagger-3 select-none"
            >
              Try It Free
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              className="md:hidden ml-auto z-50 w-10 h-10 flex items-center justify-center relative focus:outline-hidden"
            >
              <div className="relative w-6 h-5">
                <span
                  className={`absolute left-0 w-6 h-[2px] bg-brand-dark rounded transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
                    mobileMenuOpen
                      ? 'top-[6px] rotate-45 translate-y-[5px]'
                      : 'top-[6px] rotate-0 translate-y-0'
                  }`}
                />
                <span
                  className={`absolute left-0 w-6 h-[2px] bg-brand-dark rounded transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
                    mobileMenuOpen
                      ? 'top-[13px] -rotate-45 translate-y-0'
                      : 'top-[13px] rotate-0 translate-y-0'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Fullscreen Overlay */}
        <div
          className={`md:hidden fixed inset-0 bg-brand-cream z-40 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            className={`flex flex-col items-center justify-center h-full gap-8 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] delay-100 ${
              mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
            }`}
          >
            <button
              type="button"
              onClick={() => closeMenuAndNavigate('/start')}
              className="text-3xl text-brand-dark tracking-tight cursor-pointer"
            >
              Solutions
            </button>
            <button
              type="button"
              onClick={() => closeMenuAndNavigate('/start')}
              className="text-3xl text-brand-dark tracking-tight cursor-pointer"
            >
              Curriculum
            </button>
            <button
              type="button"
              onClick={() => closeMenuAndNavigate('/start')}
              className="text-3xl text-brand-dark tracking-tight cursor-pointer"
            >
              Impact
            </button>

            <button
              type="button"
              onClick={() => closeMenuAndNavigate('/start')}
              className="mt-4 inline-flex items-center px-8 py-3.5 bg-brand-dark text-white text-lg tracking-wide rounded-full hover:bg-brand-green transition-colors"
            >
              Try It Free
            </button>
          </div>
        </div>
      </nav>

      {/* 2) HERO SECTION */}
      <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-brand-cream">
        {/* Video Layer */}
        <div className="absolute inset-0">
          <video
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260820_010308_b1636845-4c15-4ab6-b0c9-9a29bfb0c6e3.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-bottom"
          />
        </div>

        {/* Content Column (Sits on top of video, left-aligned, not vertically centered) */}
        <div className="relative z-10 flex flex-col items-start max-w-7xl mx-auto pt-28 md:pt-36 px-6 lg:px-8">
          {/* Announcement Pill */}
          <Link
            to="/start"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-dark/15 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors mb-5 md:mb-6 animate-fade-up stagger-3"
          >
            <span className="text-sm text-brand-dark font-normal">
              Live for everyone today! Offering interactive climate quests.
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-dark" />
          </Link>

          {/* Headline */}
          <h1 className="text-left text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-brand-dark leading-[1.05] tracking-tight max-w-4xl font-helvetica-neue font-light animate-fade-up stagger-4">
            One unified system to learn,
            <br className="hidden sm:block" /> play, master, and protect Earth
          </h1>

          {/* 3) TRUSTED BY (Inside Hero, under headline) */}
          <div className="w-full mt-8 md:mt-10 animate-fade-up stagger-5">
            <p className="text-left text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-6 md:mb-8 font-helvetica-neue">
              Backed by
            </p>

            <div className="flex flex-wrap items-center justify-start gap-6 md:gap-12 lg:gap-16 animate-fade-up stagger-6">
              <span className="text-lg md:text-xl lg:text-2xl text-brand-dark/80 whitespace-nowrap font-playfair font-bold">
                Meridian
              </span>
              <span className="text-lg md:text-xl lg:text-2xl text-brand-dark/80 whitespace-nowrap font-oswald uppercase font-medium">
                STELLEX
              </span>
              <span className="text-lg md:text-xl lg:text-2xl text-brand-dark/80 whitespace-nowrap font-montserrat font-bold">
                Luminar
              </span>
              <span className="text-lg md:text-xl lg:text-2xl text-brand-dark/80 whitespace-nowrap font-roboto-slab uppercase font-semibold">
                OVERLAND
              </span>
              <span className="text-lg md:text-xl lg:text-2xl text-brand-dark/80 whitespace-nowrap font-raleway font-bold">
                Kinetic
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
