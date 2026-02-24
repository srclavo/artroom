'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { usePayment } from '@/hooks/usePayment';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

/* ─── Types ────────────────────────────────────────────── */

interface Skill {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  category: string;
  icon: string;
  iconBg: string;
  creator: string;
  creatorHandle: string;
  level: 1 | 2 | 3;
  installs: number;
  rating: number;
  capabilities: string[];
}

/* ─── Mock Data ────────────────────────────────────────── */

const MOCK_SKILLS: Skill[] = [
  {
    id: 's1',
    name: 'Brand System Builder',
    description: 'Generates full brand identity systems from a brief — logos, palettes, type pairings, and usage rules.',
    longDescription: 'This skill transforms any creative brief into a comprehensive brand identity system. It generates logo concepts with variations, curates color palettes with accessibility checks, suggests type pairings from premium foundries, and produces usage guidelines. Perfect for agencies and freelancers who need to deliver polished brand kits fast.',
    price: 49,
    category: 'branding',
    icon: '◆',
    iconBg: '#FFB3C6',
    creator: 'Maya Chen',
    creatorHandle: '@maya',
    level: 2,
    installs: 2840,
    rating: 4.9,
    capabilities: ['Logo Generation', 'Color Systems', 'Type Pairing', 'Brand Guidelines', 'Asset Export'],
  },
  {
    id: 's2',
    name: 'Component Architect',
    description: 'Designs accessible, token-driven UI components following atomic design principles.',
    longDescription: 'Component Architect takes your design tokens and generates production-ready UI components following atomic design methodology. Every component ships with accessibility baked in (WCAG 2.1 AA), responsive variants, dark mode support, and interaction states. Outputs to Figma, code, or both.',
    price: 79,
    category: 'ui-ux',
    icon: '⬡',
    iconBg: '#1B4FE8',
    creator: 'James Rivera',
    creatorHandle: '@james',
    level: 3,
    installs: 4120,
    rating: 4.8,
    capabilities: ['Atomic Design', 'Design Tokens', 'A11y Audit', 'Responsive Variants', 'Dark Mode'],
  },
  {
    id: 's3',
    name: 'Type Scale Engine',
    description: 'Calculates harmonious type scales and generates fluid typography systems.',
    longDescription: 'Type Scale Engine uses mathematical ratios and optical corrections to build fluid typography systems that look beautiful at every viewport. Supports variable fonts, generates CSS clamp() values, and includes vertical rhythm calculations. Pairs fonts with precision using weight and x-height analysis.',
    price: 29,
    category: 'typography',
    icon: 'Aa',
    iconBg: '#FFE500',
    creator: 'Kira Tanaka',
    creatorHandle: '@kira',
    level: 1,
    installs: 1560,
    rating: 4.7,
    capabilities: ['Fluid Scales', 'Font Pairing', 'Vertical Rhythm', 'Variable Fonts', 'CSS Output'],
  },
  {
    id: 's4',
    name: 'Illustration Styler',
    description: 'Applies consistent illustration styles across assets — flat, isometric, hand-drawn, and more.',
    longDescription: 'Illustration Styler ensures visual consistency across all your illustration work. Feed it a reference and it learns the style — stroke weights, color treatment, shading approach, and compositional patterns. Supports flat, isometric, hand-drawn, geometric, and editorial styles with batch processing.',
    price: 59,
    category: 'illustration',
    icon: '✦',
    iconBg: '#FF5F1F',
    creator: 'Orion Vale',
    creatorHandle: '@orion',
    level: 2,
    installs: 1980,
    rating: 4.6,
    capabilities: ['Style Transfer', 'Batch Processing', 'Stroke Analysis', 'Color Harmony', 'SVG Export'],
  },
  {
    id: 's5',
    name: 'Motion Choreographer',
    description: 'Creates micro-interaction sequences and transition choreography for UI animations.',
    longDescription: 'Motion Choreographer designs fluid micro-interactions and page transition choreography. It analyzes your layout and suggests entrance, exit, and state-change animations with proper easing curves, stagger timing, and spring physics. Exports to CSS, Framer Motion, GSAP, or Lottie.',
    price: 69,
    category: 'motion',
    icon: '▸',
    iconBg: '#1A7A3C',
    creator: 'Alex Storm',
    creatorHandle: '@alex',
    level: 2,
    installs: 2210,
    rating: 4.8,
    capabilities: ['Micro-interactions', 'Page Transitions', 'Spring Physics', 'Easing Curves', 'Lottie Export'],
  },
  {
    id: 's6',
    name: 'Design Critic',
    description: 'Provides structured design critiques with actionable feedback on hierarchy, spacing, and color.',
    longDescription: 'Design Critic analyzes any design and provides structured, actionable feedback across multiple dimensions: visual hierarchy, spacing consistency, color contrast, typography usage, alignment grids, and cognitive load. Each critique includes severity ratings, before/after suggestions, and links to relevant design principles.',
    price: 39,
    category: 'critique',
    icon: '◎',
    iconBg: '#E8D5B0',
    creator: 'Nova Kim',
    creatorHandle: '@nova',
    level: 1,
    installs: 3450,
    rating: 4.9,
    capabilities: ['Hierarchy Analysis', 'Spacing Audit', 'Color Contrast', 'Grid Check', 'Actionable Fixes'],
  },
  {
    id: 's7',
    name: 'Layout Composer',
    description: 'Generates editorial and marketing layouts with balanced whitespace and grid systems.',
    longDescription: 'Layout Composer creates publication-quality layouts for editorial, marketing, and web. It balances whitespace, establishes grid systems, and places content with typographic precision. Supports multi-page spreads, responsive breakpoints, and integrates with your existing design tokens.',
    price: 59,
    category: 'ui-ux',
    icon: '⊞',
    iconBg: '#1B4FE8',
    creator: 'James Rivera',
    creatorHandle: '@james',
    level: 2,
    installs: 1870,
    rating: 4.5,
    capabilities: ['Grid Systems', 'Whitespace Balance', 'Multi-page', 'Responsive', 'Token Integration'],
  },
  {
    id: 's8',
    name: 'Palette Alchemist',
    description: 'Creates accessible color palettes from mood boards, photos, or text descriptions.',
    longDescription: 'Palette Alchemist extracts and generates color palettes from any input — mood boards, photographs, brand adjectives, or even music. Every palette ships with WCAG contrast ratios, semantic color roles (primary, secondary, surface, error), dark mode variants, and P3 wide-gamut alternatives.',
    price: 19,
    category: 'branding',
    icon: '◉',
    iconBg: '#FFB3C6',
    creator: 'Maya Chen',
    creatorHandle: '@maya',
    level: 1,
    installs: 5230,
    rating: 4.7,
    capabilities: ['Mood Extraction', 'WCAG Contrast', 'Semantic Roles', 'Dark Mode', 'P3 Gamut'],
  },
  {
    id: 's9',
    name: 'Motion Prototype',
    description: 'Converts static mockups into animated prototypes with realistic physics and timing.',
    longDescription: 'Motion Prototype brings static designs to life. Upload screens and it generates interactive prototypes with realistic spring physics, gesture recognition, scroll-linked animations, and parallax effects. Outputs shareable preview links and developer-ready animation specs.',
    price: 89,
    category: 'motion',
    icon: '⟐',
    iconBg: '#1A7A3C',
    creator: 'Alex Storm',
    creatorHandle: '@alex',
    level: 3,
    installs: 1340,
    rating: 4.9,
    capabilities: ['Static-to-Motion', 'Spring Physics', 'Gesture Support', 'Scroll Animations', 'Dev Handoff'],
  },
];

/* ─── Hero Skill Chips (for the visual panel) ──────────── */

const HERO_CHIPS = [
  { icon: '◆', name: 'Brand Builder', desc: 'Identity systems', price: '$49', active: false },
  { icon: '⬡', name: 'Component Architect', desc: 'UI components', price: '$79', active: true },
  { icon: 'Aa', name: 'Type Engine', desc: 'Typography scales', price: '$29', active: false },
  { icon: '✦', name: 'Illustration Styler', desc: 'Style transfer', price: '$59', active: false },
];

/* ─── Filter Categories ────────────────────────────────── */

const FILTER_CATEGORIES = [
  { id: 'all', label: 'All Skills', color: '#0a0a0a', textColor: '#fff' },
  { id: 'branding', label: 'Branding', color: '#FFB3C6', textColor: '#0a0a0a' },
  { id: 'ui-ux', label: 'UI/UX', color: '#1B4FE8', textColor: '#fff' },
  { id: 'typography', label: 'Typography', color: '#FFE500', textColor: '#0a0a0a' },
  { id: 'illustration', label: 'Illustration', color: '#FF5F1F', textColor: '#fff' },
  { id: 'motion', label: 'Motion', color: '#1A7A3C', textColor: '#fff' },
  { id: 'critique', label: 'Critique', color: '#E8D5B0', textColor: '#0a0a0a' },
];

/* ─── Hero Badges ──────────────────────────────────────── */

const HERO_BADGES = [
  { label: 'Plug-and-play for any AI workflow', dotColor: '#1B4FE8' },
  { label: 'Created by verified designers', dotColor: '#1A7A3C' },
  { label: 'Earn with every install', dotColor: '#FF5F1F' },
];

/* ─── Level Config ─────────────────────────────────────── */

const LEVEL_CONFIG: Record<1 | 2 | 3, { label: string; bg: string; text: string }> = {
  1: { label: 'Level 1', bg: '#1B4FE8', text: '#fff' },
  2: { label: 'Level 2', bg: '#FFE500', text: '#6B5400' },
  3: { label: 'Level 3', bg: '#0a0a0a', text: '#fff' },
};

/* ─── Component ────────────────────────────────────────── */

export default function SkillsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const { isOpen, paymentIntent, openPayment, closePayment } = usePayment();

  /* ── Filtered Skills ──────────────────────────────────── */

  const filteredSkills = useMemo(() => {
    if (activeFilter === 'all') return MOCK_SKILLS;
    return MOCK_SKILLS.filter((s) => s.category === activeFilter);
  }, [activeFilter]);

  /* ── Intersection Observer for staggered entry ────────── */

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-skill-id');
            if (id) {
              setVisibleCards((prev) => new Set(prev).add(id));
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    cardRefs.current.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [filteredSkills]);

  /* ── Card ref setter ──────────────────────────────────── */

  const setCardRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) {
        cardRefs.current.set(id, el);
      } else {
        cardRefs.current.delete(id);
      }
    },
    []
  );

  /* ── Purchase handler ─────────────────────────────────── */

  const handlePurchase = (skill: Skill) => {
    openPayment({
      itemName: skill.name,
      itemPrice: skill.price,
      creatorUsername: skill.creatorHandle.replace('@', ''),
      designId: skill.id,
    });
  };

  /* ── Detail modal close ───────────────────────────────── */

  const closeDetail = useCallback(() => {
    setSelectedSkill(null);
    document.body.style.overflow = '';
  }, []);

  const openDetail = useCallback((skill: Skill) => {
    setSelectedSkill(skill);
    document.body.style.overflow = 'hidden';
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedSkill) closeDetail();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedSkill, closeDetail]);

  /* ── Render ───────────────────────────────────────────── */

  return (
    <>
      <Navbar />
      <main className="page-content">

        {/* ═══════════════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 gap-0 px-7 py-10 min-[800px]:grid-cols-2 min-[800px]:gap-10 min-[800px]:py-14">

          {/* Left Column */}
          <div className="max-w-[520px]">
            {/* Eyebrow */}
            <div className="font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.15em] text-[#1B4FE8] mb-3 flex items-center gap-2">
              <span className="w-4 h-[1.5px] bg-[#1B4FE8]" />
              AI Creative Skills
            </div>

            {/* Title */}
            <h1 className="font-[family-name:var(--font-syne)] text-[clamp(30px,4.5vw,52px)] font-extrabold tracking-[-0.03em] leading-[1.08] mb-4">
              Give your AI real creative skills.
            </h1>

            {/* Subtitle */}
            <p className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#888] leading-[1.75] max-w-[420px] mb-6">
              Install plug-and-play creative skills made by top designers. Brand systems, type engines, motion choreography -- all running inside your AI workflow.
            </p>

            {/* Hero Badges */}
            <div className="flex flex-col gap-2.5">
              {HERO_BADGES.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2.5 font-[family-name:var(--font-dm-sans)] text-[12px] text-[#555]"
                >
                  <span
                    className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                    style={{ backgroundColor: badge.dotColor }}
                  />
                  {badge.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual Panel */}
          <div className="hidden min-[800px]:flex flex-col justify-center">
            <div className="bg-[#f7f7f7] rounded-[16px] p-5 relative overflow-hidden">
              {/* Skill Chips */}
              <div className="flex flex-col gap-2">
                {HERO_CHIPS.map((chip, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 transition-all duration-300',
                      chip.active
                        ? 'bg-[#0a0a0a] text-white'
                        : 'bg-white border border-[#e8e8e8]'
                    )}
                  >
                    <span
                      className={cn(
                        'w-[32px] h-[32px] rounded-[8px] flex items-center justify-center text-[14px] flex-shrink-0',
                        chip.active ? 'bg-white/15' : 'bg-[#f5f5f5]'
                      )}
                    >
                      {chip.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div
                        className={cn(
                          'font-[family-name:var(--font-syne)] text-[12px] font-bold truncate',
                          chip.active ? 'text-white' : 'text-[#0a0a0a]'
                        )}
                      >
                        {chip.name}
                      </div>
                      <div
                        className={cn(
                          'font-[family-name:var(--font-dm-sans)] text-[10px] truncate',
                          chip.active ? 'text-white/55' : 'text-[#999]'
                        )}
                      >
                        {chip.desc}
                      </div>
                    </div>
                    <div
                      className={cn(
                        'font-[family-name:var(--font-syne)] text-[13px] font-extrabold flex-shrink-0',
                        chip.active ? 'text-white' : 'text-[#0a0a0a]'
                      )}
                    >
                      {chip.price}
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Line */}
              <div className="mt-4 pt-3 border-t border-[#e8e8e8] flex items-center gap-2">
                <span className="relative flex h-[7px] w-[7px]">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
                  <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-[#22c55e]" />
                </span>
                <span
                  className="font-[family-name:var(--font-dm-mono)] text-[10px] font-medium bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #0a0a0a, #1B4FE8)',
                    WebkitBackgroundClip: 'text',
                  }}
                >
                  AI agent ready -- 4 skills loaded
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            FILTER BAR
        ═══════════════════════════════════════════════════ */}
        <div className="px-7 py-3 border-y border-[#e8e8e8] flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {FILTER_CATEGORIES.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setActiveFilter(f.id);
                setVisibleCards(new Set());
              }}
              className={cn(
                'font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.06em]',
                'px-4 py-[7px] rounded-full border-none cursor-pointer whitespace-nowrap',
                'transition-all hover:opacity-[0.78] active:scale-[0.95]',
                activeFilter !== f.id && activeFilter !== 'all' && 'opacity-[0.28]'
              )}
              style={{ backgroundColor: f.color, color: f.textColor }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════
            SKILLS GRID
        ═══════════════════════════════════════════════════ */}
        <div className="px-7 py-3 text-[11px] text-[#999] font-[family-name:var(--font-dm-sans)]">
          {filteredSkills.length} skill{filteredSkills.length !== 1 ? 's' : ''} available
        </div>

        <div className="grid grid-cols-1 min-[660px]:grid-cols-2 min-[1000px]:grid-cols-3 gap-3.5 px-7 pb-8">
          {filteredSkills.map((skill, index) => {
            const level = LEVEL_CONFIG[skill.level];
            const isVisible = visibleCards.has(skill.id);

            return (
              <div
                key={skill.id}
                ref={setCardRef(skill.id)}
                data-skill-id={skill.id}
                onClick={() => openDetail(skill)}
                className="group bg-white border border-[#e8e8e8] rounded-[14px] overflow-hidden cursor-pointer hover:border-[#ccc] hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.5s ease ${index * 0.06}s, transform 0.5s ease ${index * 0.06}s, border-color 0.2s, box-shadow 0.2s`,
                }}
              >
                {/* Card Head */}
                <div className="p-4 pb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Icon */}
                    <div
                      className="w-[46px] h-[46px] rounded-[11px] flex items-center justify-center text-[18px] flex-shrink-0"
                      style={{ backgroundColor: skill.iconBg }}
                    >
                      {skill.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="font-[family-name:var(--font-syne)] text-[15px] font-bold text-[#0a0a0a] leading-tight truncate">
                        {skill.name}
                      </div>
                      <div className="font-[family-name:var(--font-dm-sans)] text-[11px] text-[#bbb] mt-0.5">
                        {skill.creatorHandle}
                      </div>
                    </div>
                  </div>
                  <div className="font-[family-name:var(--font-syne)] text-[16px] font-[800] text-[#0a0a0a] flex-shrink-0 pt-0.5">
                    ${skill.price}
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-4 pb-3">
                  <p className="font-[family-name:var(--font-dm-sans)] text-[12px] text-[#777] leading-[1.65] mb-3 line-clamp-2">
                    {skill.description}
                  </p>

                  {/* Capability Tags */}
                  <div className="flex flex-wrap gap-1">
                    {skill.capabilities.slice(0, 4).map((cap) => (
                      <span
                        key={cap}
                        className="font-[family-name:var(--font-dm-mono)] text-[10px] text-[#666] bg-[#f5f5f5] border border-[#e8e8e8] rounded-full px-2 py-[3px] whitespace-nowrap"
                      >
                        {cap}
                      </span>
                    ))}
                    {skill.capabilities.length > 4 && (
                      <span className="font-[family-name:var(--font-dm-mono)] text-[10px] text-[#bbb] px-1 py-[3px]">
                        +{skill.capabilities.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 py-3 border-t border-[#f0f0f0] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Level Badge */}
                    <span
                      className="font-[family-name:var(--font-dm-mono)] text-[9px] font-bold uppercase tracking-[0.06em] px-2 py-[3px] rounded-full"
                      style={{ backgroundColor: level.bg, color: level.text }}
                    >
                      {level.label}
                    </span>

                    {/* Stats */}
                    <span className="font-[family-name:var(--font-dm-sans)] text-[11px] text-[#bbb] flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="opacity-50">
                        <path d="M8 1L10.5 6H15L11.5 9.5L13 15L8 11.5L3 15L4.5 9.5L1 6H5.5L8 1Z" fill="currentColor" />
                      </svg>
                      {skill.rating}
                    </span>
                    <span className="font-[family-name:var(--font-dm-sans)] text-[11px] text-[#bbb]">
                      {skill.installs >= 1000
                        ? `${(skill.installs / 1000).toFixed(1)}k`
                        : skill.installs}{' '}
                      installs
                    </span>
                  </div>

                  {/* Install button (hover reveal) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePurchase(skill);
                    }}
                    className="font-[family-name:var(--font-syne)] text-[10px] font-bold uppercase tracking-[0.04em] bg-[#0a0a0a] text-white px-4 py-[6px] rounded-full border-none cursor-pointer opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:bg-[#333] active:scale-[0.95]"
                  >
                    Install
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </main>

      <Footer />

      {/* ═══════════════════════════════════════════════════
          SKILL DETAIL OVERLAY
      ═══════════════════════════════════════════════════ */}
      {selectedSkill && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(10,10,10,0.55)] backdrop-blur-[6px] animate-[fadeIn_0.2s_ease]"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDetail();
          }}
        >
          <div className="bg-white rounded-[20px] w-[520px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-80px)] overflow-y-auto shadow-[0_24px_80px_rgba(0,0,0,0.18)] animate-[slideUp_0.3s_ease] relative">
            {/* Close button */}
            <button
              onClick={closeDetail}
              className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-[#f5f5f5] text-[#888] flex items-center justify-center hover:bg-[#e8e8e8] transition-colors cursor-pointer z-10"
            >
              <X size={14} />
            </button>

            {/* Detail Header */}
            <div className="p-6 pb-4 border-b border-[#f0f0f0]">
              <div className="flex items-start gap-4">
                <div
                  className="w-[56px] h-[56px] rounded-[13px] flex items-center justify-center text-[22px] flex-shrink-0"
                  style={{ backgroundColor: selectedSkill.iconBg }}
                >
                  {selectedSkill.icon}
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <div className="font-[family-name:var(--font-syne)] text-[20px] font-extrabold text-[#0a0a0a] leading-tight mb-1">
                    {selectedSkill.name}
                  </div>
                  <div className="font-[family-name:var(--font-dm-sans)] text-[12px] text-[#bbb]">
                    by {selectedSkill.creator} &middot; {selectedSkill.creatorHandle}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <div className="font-[family-name:var(--font-syne)] text-[26px] font-extrabold text-[#0a0a0a]">
                  ${selectedSkill.price}
                </div>
                <span
                  className="font-[family-name:var(--font-dm-mono)] text-[9px] font-bold uppercase tracking-[0.06em] px-2 py-[3px] rounded-full"
                  style={{
                    backgroundColor: LEVEL_CONFIG[selectedSkill.level].bg,
                    color: LEVEL_CONFIG[selectedSkill.level].text,
                  }}
                >
                  {LEVEL_CONFIG[selectedSkill.level].label}
                </span>
              </div>
            </div>

            {/* Detail Body */}
            <div className="p-6">
              {/* Description */}
              <div className="mb-5">
                <div className="font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.1em] text-[#999] mb-2">
                  About this Skill
                </div>
                <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#555] leading-[1.8]">
                  {selectedSkill.longDescription}
                </p>
              </div>

              {/* Capabilities */}
              <div className="mb-5">
                <div className="font-[family-name:var(--font-syne)] text-[11px] font-bold uppercase tracking-[0.1em] text-[#999] mb-2">
                  Capabilities
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSkill.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="font-[family-name:var(--font-dm-mono)] text-[10px] text-[#555] bg-[#f5f5f5] border border-[#e8e8e8] rounded-full px-3 py-[5px]"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-[#f7f7f7] rounded-[10px] p-3 text-center">
                  <div className="font-[family-name:var(--font-syne)] text-[18px] font-extrabold text-[#0a0a0a]">
                    {selectedSkill.installs >= 1000
                      ? `${(selectedSkill.installs / 1000).toFixed(1)}k`
                      : selectedSkill.installs}
                  </div>
                  <div className="font-[family-name:var(--font-dm-sans)] text-[10px] text-[#999] uppercase tracking-[0.06em] mt-0.5">
                    Installs
                  </div>
                </div>
                <div className="bg-[#f7f7f7] rounded-[10px] p-3 text-center">
                  <div className="font-[family-name:var(--font-syne)] text-[18px] font-extrabold text-[#0a0a0a]">
                    {selectedSkill.rating}
                  </div>
                  <div className="font-[family-name:var(--font-dm-sans)] text-[10px] text-[#999] uppercase tracking-[0.06em] mt-0.5">
                    Rating
                  </div>
                </div>
                <div className="bg-[#f7f7f7] rounded-[10px] p-3 text-center">
                  <div className="font-[family-name:var(--font-syne)] text-[18px] font-extrabold text-[#0a0a0a]">
                    {selectedSkill.capabilities.length}
                  </div>
                  <div className="font-[family-name:var(--font-dm-sans)] text-[10px] text-[#999] uppercase tracking-[0.06em] mt-0.5">
                    Features
                  </div>
                </div>
              </div>

              {/* Install Button */}
              <button
                onClick={() => {
                  closeDetail();
                  handlePurchase(selectedSkill);
                }}
                className="w-full font-[family-name:var(--font-syne)] text-[12px] font-bold uppercase tracking-[0.06em] bg-[#0a0a0a] text-white py-3.5 rounded-full border-none cursor-pointer hover:bg-[#333] active:scale-[0.97] transition-all"
              >
                Install for ${selectedSkill.price}
              </button>

              <p className="text-center font-[family-name:var(--font-dm-sans)] text-[10px] text-[#bbb] mt-2">
                One-time purchase. Runs inside your ArtRoom AI agent.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          PAYMENT MODAL
      ═══════════════════════════════════════════════════ */}
      <PaymentModal
        isOpen={isOpen}
        onClose={closePayment}
        paymentIntent={paymentIntent}
      />

      {/* ═══════════════════════════════════════════════════
          KEYFRAME STYLES
      ═══════════════════════════════════════════════════ */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}
