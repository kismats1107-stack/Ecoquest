import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Droplets,
  Globe2,
  Leaf,
  Recycle,
  Search,
  Sparkles,
  Trophy,
  Users,
  Wind,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { DemoStartModal } from '@/components/DemoStartModal';
import { EarthHandsHeroArt } from '@/components/brand/EarthlyArt';
import { QuickPinModal } from '@/components/quiz/QuickPinModal';
import { Avatar } from '@/components/ui/Avatar';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { paths } from '@/lib/paths';
import { useApp } from '@/store/context';
import type { ExperienceMode } from '@/types';

export function Landing() {
  const { profile } = useApp();
  const navigate = useNavigate();
  const [demoOpen, setDemoOpen] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useDocumentTitle('EcoQuest · Gamified Environmental Learning Platform');

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const enter = (mode: ExperienceMode) => {
    if (profile) navigate(paths(mode).home);
    else navigate(`/start?mode=${mode}`);
  };

  const continueHref = profile ? paths(profile.activeMode).home : '/start';

  // 5 pastel topic cards directly matching the Earthly Design System (Image 4 top-left)
  const TOPICS = [
    {
      id: 'climate-change',
      title: 'Climate Change',
      quizzes: '12 Quizzes',
      icon: Globe2,
      cardBg: 'bg-[#E8F5E9] hover:bg-[#DEF0E0] border-[#C8E6C9] text-[#1B5E20]',
      iconBg: 'bg-[#C8E6C9] text-[#1B5E20]',
      mode: 'plus' as const,
    },
    {
      id: 'biodiversity-ecosystems',
      title: 'Biodiversity',
      quizzes: '10 Quizzes',
      icon: Leaf,
      cardBg: 'bg-[#EDE7F6] hover:bg-[#E1D8EE] border-[#D1C4E9] text-[#4A148C]',
      iconBg: 'bg-[#D1C4E9] text-[#4A148C]',
      mode: 'plus' as const,
    },
    {
      id: 'renewable-energy',
      title: 'Renewable Energy',
      quizzes: '8 Quizzes',
      icon: Wind,
      cardBg: 'bg-[#E1F5FE] hover:bg-[#D4EEFC] border-[#B3E5FC] text-[#01579B]',
      iconBg: 'bg-[#B3E5FC] text-[#01579B]',
      mode: 'plus' as const,
    },
    {
      id: 'circular-economy-waste',
      title: 'Waste Management',
      quizzes: '9 Quizzes',
      icon: Recycle,
      cardBg: 'bg-[#FDEED9] hover:bg-[#F9E2C6] border-[#FFE0B2] text-[#E65100]',
      iconBg: 'bg-[#FFE0B2] text-[#E65100]',
      mode: 'plus' as const,
    },
    {
      id: 'oceans-water',
      title: 'Water Conservation',
      quizzes: '7 Quizzes',
      icon: Droplets,
      cardBg: 'bg-[#E0F7FA] hover:bg-[#D0F1F5] border-[#B2EBF2] text-[#006064]',
      iconBg: 'bg-[#B2EBF2] text-[#006064]',
      mode: 'plus' as const,
    },
  ];

  return (
    <div className="min-h-dvh bg-[#FAF7F2] text-slate-900 selection:bg-[#52B788] selection:text-white font-sans">

      {/* ═══════════════════════════════════════════════
           PALOMAR-STYLE FIXED NAVBAR
      ═══════════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          navScrolled ? 'bg-brand-cream/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
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
                Solutions
                <svg className="w-3.5 h-3.5 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <a href="#experiences" className="text-sm text-brand-dark tracking-wide uppercase hover:opacity-70 transition-opacity">Experiences</a>
              <a href="#features" className="text-sm text-brand-dark tracking-wide uppercase hover:opacity-70 transition-opacity">Features</a>
            </div>

            {/* Center Logo (Absolute Centered) */}
            <a
              href="/"
              className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 animate-fade-down stagger-2 select-none"
              aria-label="EcoQuest Home"
            >
              <svg className="w-5 h-5 text-brand-dark fill-brand-dark" viewBox="0 0 24 24"><polygon points="12 2 22 20 2 20"/></svg>
              <span className="text-xl text-brand-dark tracking-tight font-helvetica-neue font-medium">
                EcoQuest
              </span>
            </a>

            {/* Desktop CTA (Right) */}
            <a
              href="/start"
              className="hidden md:inline-flex items-center ml-auto px-5 py-2.5 bg-brand-dark text-white text-sm tracking-wide uppercase rounded-full hover:bg-brand-green transition-colors animate-fade-down stagger-3 select-none"
            >
              Try It Free
            </a>

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
                    mobileMenuOpen ? 'top-[6px] rotate-45 translate-y-[5px]' : 'top-[6px]'
                  }`}
                />
                <span
                  className={`absolute left-0 w-6 h-[2px] bg-brand-dark rounded transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
                    mobileMenuOpen ? 'top-[13px] -rotate-45' : 'top-[13px]'
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
            <button type="button" onClick={() => { setMobileMenuOpen(false); navigate('/start'); }} className="text-3xl text-brand-dark tracking-tight">Solutions</button>
            <a href="#experiences" onClick={() => setMobileMenuOpen(false)} className="text-3xl text-brand-dark tracking-tight">Experiences</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-3xl text-brand-dark tracking-tight">Features</a>
            <a href="/start" className="mt-4 inline-flex items-center px-8 py-3.5 bg-brand-dark text-white text-lg tracking-wide rounded-full hover:bg-brand-green transition-colors">
              Try It Free
            </a>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════
           PALOMAR-STYLE FULL-VIEWPORT VIDEO HERO
      ═══════════════════════════════════════════════ */}
      <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-brand-cream">
        {/* Full-bleed video */}
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

        {/* Left-aligned content column */}
        <div className="relative z-10 flex flex-col items-start max-w-7xl mx-auto pt-28 md:pt-36 px-6 lg:px-8">
          {/* Announcement pill */}
          <a
            href="/start"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-dark/15 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors mb-5 md:mb-6 animate-fade-up stagger-3"
          >
            <span className="text-sm text-brand-dark font-normal">Live for everyone today! Explore eco-quests and win badges.</span>
            <svg className="w-3.5 h-3.5 text-brand-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>

          {/* Headline */}
          <h1 className="text-left text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-brand-dark leading-[1.05] tracking-tight max-w-4xl font-helvetica-neue font-light animate-fade-up stagger-4">
            One unified platform to learn,
            <br className="hidden sm:block" /> play, master, and protect Earth
          </h1>

          {/* Backed by / trusted by wordmarks */}
          <div className="w-full mt-8 md:mt-10 animate-fade-up stagger-5">
            <p className="text-left text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-6 md:mb-8 font-helvetica-neue">
              Backed by
            </p>
            <div className="flex flex-wrap items-center justify-start gap-6 md:gap-12 lg:gap-16 animate-fade-up stagger-6">
              <span className="text-lg md:text-xl lg:text-2xl text-brand-dark/80 whitespace-nowrap font-playfair font-bold">Meridian</span>
              <span className="text-lg md:text-xl lg:text-2xl text-brand-dark/80 whitespace-nowrap font-oswald uppercase font-medium">STELLEX</span>
              <span className="text-lg md:text-xl lg:text-2xl text-brand-dark/80 whitespace-nowrap font-montserrat font-bold">Luminar</span>
              <span className="text-lg md:text-xl lg:text-2xl text-brand-dark/80 whitespace-nowrap font-roboto-slab uppercase font-semibold">OVERLAND</span>
              <span className="text-lg md:text-xl lg:text-2xl text-brand-dark/80 whitespace-nowrap font-raleway font-bold">Kinetic</span>
            </div>
          </div>
        </div>
      </section>


      <main>
        {/* HERO SECTION - Exact Earthly Design (Image 4 top-left) */}
        <section className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20">
          {/* Subtle nature aura */}
          <div
            className="pointer-events-none absolute -top-40 -right-40 size-[600px] rounded-full bg-[radial-gradient(circle,#D8F3DC_0%,transparent_70%)] opacity-70"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-20 size-[500px] rounded-full bg-[radial-gradient(circle,#E8F5E9_0%,transparent_70%)] opacity-60"
            aria-hidden
          />

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-8 lg:grid-cols-[1.1fr_1fr]">
            {/* Left Content Column */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 rounded-full bg-[#E8F5E9] px-3.5 py-1.5 text-xs font-black text-[#1B5E20] border border-[#C8E6C9] mb-5 shadow-sm"
              >
                <Sparkles className="size-3.5 text-amber-500" />
                <span>Environmental Gamified Education</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#13382B] leading-[1.08]"
              >
                Small Quizzes <br />
                <span className="relative inline-flex items-center gap-3">
                  <span>Big Impact</span>
                  <motion.span
                    animate={{ rotate: [0, 8, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                    className="inline-block"
                  >
                    <Leaf className="size-9 sm:size-12 text-[#52B788] fill-[#52B788]/20" />
                  </motion.span>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-5 text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed font-medium"
              >
                Learn about our planet, earn points, collect badges and be a part of a greener tomorrow!
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <Link
                  to={continueHref}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#1B4332] px-8 py-3.5 text-sm sm:text-base font-black text-white shadow-xl shadow-[#1B4332]/25 transition hover:bg-[#2D6A4F] hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="size-5" />
                </Link>

                <button
                  type="button"
                  onClick={() => setDemoOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#D8EDE2] bg-white px-6 py-3.5 text-sm sm:text-base font-bold text-[#13382B] shadow-sm transition hover:bg-[#EAF6F0] hover:border-[#B7E4C7]"
                >
                  <span>🎓 Demo Student</span>
                </button>
              </motion.div>

              {/* 3 Social Proof Counters (Direct from Image 4 Hero) */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6 pt-4 border-t border-[#E8E2D8]"
              >
                {/* 100+ Quizzes */}
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-full bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9]">
                    <BookOpen className="size-4" />
                  </div>
                  <div>
                    <span className="block text-sm font-black text-[#13382B]">100+</span>
                    <span className="block text-xs font-semibold text-slate-500">Quizzes</span>
                  </div>
                </div>

                {/* 50+ Badges */}
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-full bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9]">
                    <Award className="size-4" />
                  </div>
                  <div>
                    <span className="block text-sm font-black text-[#13382B]">50+</span>
                    <span className="block text-xs font-semibold text-slate-500">Badges</span>
                  </div>
                </div>

                {/* 10K+ Green Learners */}
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-full bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9]">
                    <Users className="size-4" />
                  </div>
                  <div>
                    <span className="block text-sm font-black text-[#13382B]">10K+</span>
                    <span className="block text-xs font-semibold text-slate-500">Green Learners</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Handcrafted Earthly Vector Art */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="relative flex items-center justify-center"
            >
              <div className="w-full max-w-[500px]">
                <EarthHandsHeroArt className="w-full h-auto drop-shadow-2xl" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* CHOOSE YOUR TOPIC - Exact Earthly Pastel Cards (Image 4 top-left) */}
        <section className="relative mx-auto max-w-7xl px-4 sm:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#13382B]">
                Choose Your Topic
              </h2>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-600">
                Explore interactive challenges curated by environmental science themes
              </p>
            </div>
            <Link
              to="/plus/learn"
              className="inline-flex items-center gap-1.5 text-sm font-black text-[#2D6A4F] hover:text-[#1B4332] transition group"
            >
              <span>View All</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* 5 Pastel Rounded Cards Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {TOPICS.map((topic, i) => {
              const Icon = topic.icon;
              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    to={paths(topic.mode).learn}
                    className={`flex flex-col justify-between h-44 rounded-3xl border-2 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${topic.cardBg}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`flex size-11 items-center justify-center rounded-2xl shadow-sm ${topic.iconBg}`}>
                        <Icon className="size-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider opacity-60">
                        {topic.quizzes}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-black leading-snug">
                        {topic.title}
                      </h3>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-black opacity-80 group-hover:opacity-100">
                        Explore <ArrowRight className="size-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* TWO TAILORED LEARNING PATHS (Earthly 15+ & EcoQuest Kids) */}
        <section id="experiences" className="relative mx-auto max-w-7xl px-4 sm:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-black text-[#1B5E20] border border-[#C8E6C9]">
              One Mission · Two Bespoke Experiences
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-[#13382B]">
              Age-Appropriate Environmental Learning
            </h2>
            <p className="mt-2 text-sm sm:text-base font-semibold text-slate-600">
              Tailored learning loops, gamification models, and science depth built for each stage.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Path 1: EcoQuest Adult (15+) */}
            <article className="relative overflow-hidden rounded-[2.5rem] border-2 border-[#13382B] bg-[#13382B] text-white p-7 sm:p-9 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="inline-block rounded-full bg-[#2D6A4F] px-3 py-1 text-xs font-black text-[#A7F3D0]">
                      For Teens & Adults (15+)
                    </span>
                    <h3 className="mt-2 text-3xl font-black tracking-tight text-white">
                      EcoQuest 15+
                    </h3>
                  </div>
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-[#2D6A4F] text-[#95D5B2]">
                    <Leaf className="size-7" />
                  </div>
                </div>

                <p className="mt-4 text-sm text-[#B7E4C7] leading-relaxed font-medium">
                  “Small Quizzes, Big Impact.” Dive deep into real-world carbon math, biodiversity trade-offs, circular economy data, and university & college leaderboards.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs sm:text-sm font-semibold text-[#D8EDE2]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-[#52B788] shrink-0" />
                    <span>Real-world environmental scenario & data challenges</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-[#52B788] shrink-0" />
                    <span>Rapid 10-second games: Carbon Footprint & Food Web Puzzle</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-[#52B788] shrink-0" />
                    <span>Global, Friends, and College rankings with medal podiums</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-[#52B788] shrink-0" />
                    <span>Topic mastery metrics & verified environmental badges</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <Button
                  onClick={() => enter('plus')}
                  className="rounded-full bg-[#52B788] hover:bg-[#40916C] text-white font-black px-7 py-3 text-sm shadow-md"
                >
                  Enter EcoQuest (15+) <ArrowRight className="size-4 ml-1.5" />
                </Button>
                <span className="text-xs font-bold text-[#86BEA0]">
                  Deep Science & Scenarios
                </span>
              </div>
            </article>

            {/* Path 2: EcoQuest Kids (Ages 6-14) */}
            <article className="relative overflow-hidden rounded-[2.5rem] border-2 border-[#B7E4C7] bg-gradient-to-br from-[#E8F5E9] via-[#FAF7F2] to-[#E1F5FE] p-7 sm:p-9 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="inline-block rounded-full bg-[#C8E6C9] px-3 py-1 text-xs font-black text-[#1B5E20]">
                      For Young Explorers (Ages 6–14)
                    </span>
                    <h3 className="mt-2 text-3xl font-black tracking-tight text-[#13382B]">
                      EcoQuest Kids
                    </h3>
                  </div>
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-md border border-[#C8E6C9]">
                    <span className="text-3xl">🌍</span>
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-600 leading-relaxed font-medium">
                  “Small Steps Make a Big Planet!” A fun, colorful, non-competitive realm with cheerful mascots, bite-sized lessons, interactive ocean cleaning, and star badges.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span>Eco Journey adventure map with collectible stars</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span>Playful mini-games: Recycle Sort & Ocean Cleanup</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span>Encouraging Eco Heroes board with positive reinforcement</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span>Water Warrior, Tree Hugger & Energy Saver badges</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-4">
                <Button
                  onClick={() => enter('kids')}
                  className="rounded-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-black px-7 py-3 text-sm shadow-md"
                >
                  Enter EcoQuest Kids <ArrowRight className="size-4 ml-1.5" />
                </Button>
                <span className="text-xs font-bold text-slate-500">
                  Playful & Mascot-Led
                </span>
              </div>
            </article>
          </div>
        </section>

        {/* WHY STAND OUT / CORE FEATURES */}
        <section className="relative mx-auto max-w-7xl px-4 sm:px-8 py-12">
          <div className="rounded-[2.5rem] border border-[#E8E2D8] bg-white p-8 sm:p-12 shadow-sm">
            <div className="max-w-xl">
              <span className="text-xs font-black uppercase tracking-wider text-[#2D6A4F]">
                Architecture & Innovation
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#13382B]">
                Engineered for Hackathon Excellence
              </h2>
              <p className="mt-2 text-sm font-semibold text-slate-600">
                Beyond static questions — a complete educational ecosystem operating entirely client-first with seamless AI enhancements.
              </p>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-100 bg-[#FAF7F2] p-5">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#1B5E20]">
                  <Sparkles className="size-5" />
                </div>
                <h3 className="mt-3 text-base font-black text-[#13382B]">AI Quiz Engine</h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed font-medium">
                  Generate fresh, curriculum-aligned questions on any subject or upload a study document.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-[#FAF7F2] p-5">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#EDE7F6] text-[#4A148C]">
                  <Zap className="size-5" />
                </div>
                <h3 className="mt-3 text-base font-black text-[#13382B]">10-Second Games</h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed font-medium">
                  Quick-fire sensory mini-games woven into quiz sessions to reinforce learning concepts.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-[#FAF7F2] p-5">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#E1F5FE] text-[#01579B]">
                  <Trophy className="size-5" />
                </div>
                <h3 className="mt-3 text-base font-black text-[#13382B]">Live Gamification</h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed font-medium">
                  Streaks, level XP progression, 14 milestone badges, and real-time podium leaderboards.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-[#FAF7F2] p-5">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#FDEED9] text-[#E65100]">
                  <CheckCircle2 className="size-5" />
                </div>
                <h3 className="mt-3 text-base font-black text-[#13382B]">100% Offline Ready</h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed font-medium">
                  Zero external database blockers required — complete local persistence and multi-profile switching.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM MOTTO CALLOUT (Matching Earthly Motto) */}
        <section className="relative mx-auto max-w-7xl px-4 sm:px-8 py-10">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[#1B4332] p-8 sm:p-12 text-white text-center shadow-xl">
            <div className="max-w-2xl mx-auto">
              <span className="text-3xl">🌱</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-white">
                “Every quiz brings you closer to a greener planet!”
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#B7E4C7] font-medium">
                Join thousands of learners making conscious daily choices through interactive environmental discovery.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to={continueHref}
                  className="rounded-full bg-[#52B788] hover:bg-[#40916C] text-white font-black px-8 py-3.5 text-sm sm:text-base shadow-lg transition"
                >
                  Start Your Eco Journey <ArrowRight className="size-4 inline ml-1.5" />
                </Link>
                <Link
                  to="/start"
                  className="rounded-full border border-white/40 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 text-sm sm:text-base transition"
                >
                  Switch / Pick Profile
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#E8E2D8] bg-[#FAF7F2] py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-8 sm:flex-row text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-xl bg-[#1B4332] text-white">
              <Leaf className="size-3.5 text-[#95D5B2]" />
            </div>
            <span className="font-black text-slate-800 text-sm">EcoQuest</span>
          </div>
          <p>© {new Date().getFullYear()} EcoQuest. Small steps, big planet 💚</p>
        </div>
      </footer>

      {/* Demo Student & Quick PIN Modals */}
      <DemoStartModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      <QuickPinModal open={pinOpen} onClose={() => setPinOpen(false)} />
    </div>
  );
}

function Button({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-all active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}
