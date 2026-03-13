import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  BadgePercent,
  Lock,
  Star,
} from "lucide-react";

const SLIDES = [
  {
    id: 1,
    tag: "HORECA Grade",
    title: "Premium Commercial\nKitchen Equipment",
    subtitle: "Trusted by 10,000+ Restaurants, Hotels & Caterers across India",
    cta: "Shop Now",
    ctaPath: "/new-arrivals",
    ghost: "Explore Categories",
    ghostPath: "/all-subcategories",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=80",
    overlay:
      "linear-gradient(90deg, rgba(8,2,2,0.94) 0%, rgba(8,2,2,0.82) 35%, rgba(8,2,2,0.30) 62%, rgba(8,2,2,0.0) 100%)",
  },
  {
    id: 2,
    tag: "Best Sellers",
    title: "Professional Kitchen\nTools & Appliances",
    subtitle: "Industry-leading equipment built for speed, hygiene and durability",
    cta: "Shop Best Sellers",
    ctaPath: "/most-selling-all",
    ghost: "New Arrivals",
    ghostPath: "/new-arrivals",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80",
    overlay:
      "linear-gradient(90deg, rgba(8,2,2,0.95) 0%, rgba(8,2,2,0.83) 35%, rgba(8,2,2,0.30) 62%, rgba(8,2,2,0.0) 100%)",
  },
  {
    id: 3,
    tag: "500+ Products",
    title: "Everything Your\nKitchen Needs",
    subtitle: "From cookware to cold equipment — all categories under one roof",
    cta: "Browse All",
    ctaPath: "/all-subcategories",
    ghost: "View Deals",
    ghostPath: "/most-selling-all",
    image:
      "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=1600&q=80",
    overlay:
      "linear-gradient(90deg, rgba(8,2,2,0.94) 0%, rgba(8,2,2,0.80) 35%, rgba(8,2,2,0.25) 62%, rgba(8,2,2,0.0) 100%)",
  },
];

const TRUST = [
  { icon: ShieldCheck, label: "10,000+ Happy Customers" },
  { icon: Truck,       label: "Fast Delivery" },
  { icon: BadgePercent,label: "Best Price Guaranteed" },
  { icon: Lock,        label: "100% Secure Payments" },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading]   = useState(false);
  const navigate = useNavigate();

  const goTo = useCallback(
    (index) => {
      if (fading) return;
      setFading(true);
      setTimeout(() => {
        setCurrent(index);
        setFading(false);
      }, 280);
    },
    [fading]
  );

  const next = useCallback(
    () => goTo((current + 1) % SLIDES.length),
    [current, goTo]
  );
  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <div className="relative w-full" aria-label="Hero banner">

      {/* ══════════════════════════════════════════════════════════
          MAIN HERO SLIDE
      ══════════════════════════════════════════════════════════ */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(380px, 52vw, 540px)" }}
      >
        {/* Background kitchen photo */}
        <img
          key={slide.id}
          src={slide.image}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ${
            fading ? "opacity-0" : "opacity-100"
          }`}
          style={{ transitionDuration: "300ms" }}
        />

        {/* Gradient overlay — keeps text legible */}
        <div
          className="absolute inset-0"
          style={{ background: slide.overlay }}
        />

        {/* Red bottom-edge accent strip */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#B91C1C]" />

        {/* ── Text content ──────────────────────────────────── */}
        <div
          className={`absolute inset-0 flex flex-col justify-center transition-all duration-300
                      px-6 sm:px-10 lg:px-16 xl:px-24 ${
            fading ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          <div className="w-full">
            <div className="max-w-[520px]">

              {/* Tag */}
              <span className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-full
                               bg-[#B91C1C] text-white text-[11px] font-bold uppercase tracking-widest">
                <Star size={10} fill="currentColor" />
                {slide.tag}
              </span>

              {/* Headline */}
              <h1
                className="text-white font-display font-black leading-[1.08] mb-3 sm:mb-4
                           text-[24px] xs:text-[28px] sm:text-[42px] md:text-[52px]"
                style={{ whiteSpace: "pre-line" }}
              >
                {slide.title}
              </h1>

              {/* Subtitle */}
              <p className="text-white/75 font-body text-xs sm:text-base md:text-[17px] leading-relaxed mb-5 sm:mb-7 max-w-md hidden xs:block">
                {slide.subtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-5 sm:mb-8">
                <button
                  onClick={() => navigate(slide.ctaPath)}
                  className="inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white
                             bg-[#B91C1C] rounded-lg hover:bg-red-700
                             hover:shadow-[0_6px_24px_rgba(185,28,28,0.50)]
                             transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                >
                  {slide.cta}
                  <ArrowRight size={13} />
                </button>
                <button
                  onClick={() => navigate(slide.ghostPath)}
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold
                             text-white border border-white/30 rounded-lg
                             hover:bg-white/10 hover:border-white/50
                             transition-all duration-200"
                >
                  {slide.ghost}
                </button>
              </div>

              {/* Inline trust micro-badges */}
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {TRUST.slice(0, 3).map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-1.5 text-white/60 text-xs">
                    <Icon size={13} className="text-[#ef4444]" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Slide controls ────────────────────────────────── */}
        <div className="absolute bottom-5 right-6 flex items-center gap-2">
          <button
            onClick={prev}
            aria-label="Previous"
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 border border-white/15
                       flex items-center justify-center text-white transition-colors backdrop-blur-sm"
          >
            <ChevronLeft size={14} />
          </button>

          <div className="flex items-center gap-1.5 px-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? "20px" : "6px",
                  height: "6px",
                  backgroundColor:
                    i === current ? "#B91C1C" : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next"
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 border border-white/15
                       flex items-center justify-center text-white transition-colors backdrop-blur-sm"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* ── Auto-progress bar ─────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/20 z-10">
          <div
            key={current}
            className="h-full bg-[#B91C1C]"
            style={{ animation: "heroProgress 6s linear forwards" }}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          TRUST BAR — below the slide
      ══════════════════════════════════════════════════════════ */}
      <div className="bg-[#f9f7f5] border-t border-b border-stone-200 overflow-x-auto scrollbar-hide">
        <div className="container-main">
          <div className="flex items-center min-w-max sm:min-w-0 sm:grid sm:grid-cols-4 divide-x divide-stone-200">
            {TRUST.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center justify-center gap-2 py-3 px-3 sm:px-4"
                style={{ minWidth: "140px" }}
              >
                <Icon size={15} className="text-[#B91C1C] flex-shrink-0" />
                <span className="text-stone-700 text-[11px] sm:text-[12px] font-semibold whitespace-nowrap">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
