/**
 * CategorySection — 4 unique layouts auto-detected from category name.
 * API logic & navigation untouched.
 *
 * COLD EQUIPMENT  → ColdLayout    (hero left | 4-col scrollable grid right)
 * HOT EQUIPMENT   → HotLayout     (center hero | left col auto-scroll ↓ | right col auto-scroll ↑)
 * POLYRATTAN BASKET → PolyrattanLayout (right big card | left 2 stacked cards)
 * ACCESSORIES     → AccessoriesLayout (left 3×3 | center card | right 3×3)
 */
import React, { useEffect, useState, useRef, memo } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./utils/api";
import Slider from "react-slick";
import logo from "./images/piclogo.png";
import { ArrowRight, Tag, ChevronLeft, ChevronRight } from "lucide-react";

/* ─── Layout detector ──────────────────────────────────────────── */
const getVariant = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("cold")) return "cold";
  if (n.includes("hot")) return "hot";
  if (n.includes("polyrattan") || n.includes("poly rattan")) return "polyrattan";
  if (n.includes("accessor")) return "accessories";
  return "default";
};

/* ─── Loading skeleton ─────────────────────────────────────────── */
const LoadingSkeleton = () => (
  <section className="py-10 bg-white border-b border-gray-100">
    <div className="container-main">
      <div className="h-72 rounded-3xl bg-gray-100 animate-pulse" />
    </div>
  </section>
);

/* ─── Sub-navigation helper ────────────────────────────────────── */
const goToSub = (sub, navigate) => {
  if (sub.subsubcategories?.length > 0) {
    navigate(`/subsubcategories/${sub.id}`);
  } else {
    navigate(`/products/subcategory/${sub.id}`);
  }
};

/* ─── Shared: small subcategory card ──────────────────────────── */
const SubCard = memo(({ sub, navigate, size = "md" }) => {
  const pad = size === "sm" ? "p-1.5" : "p-3";
  const fs = size === "sm" ? "text-[8px]" : "text-[10px]";

  return (
    <button
      onClick={() => goToSub(sub, navigate)}
      className="group w-full flex flex-col items-center outline-none"
    >
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-100 shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 group-hover:border-[#B91C1C]/30 transition-all duration-300 will-change-transform">
        <img
          src={sub.image || logo}
          alt={sub.name}
          loading="lazy"
          onError={(e) => { e.target.onerror = null; e.target.src = logo; }}
          className={`w-full h-full object-contain ${pad} group-hover:scale-110 transition-transform duration-400`}
        />
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-1 bg-[#B91C1C] text-white text-[7px] font-black uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          View
        </div>
      </div>
      <p className={`mt-1.5 text-center ${fs} font-bold uppercase tracking-wide text-gray-700 group-hover:text-[#B91C1C] transition-colors line-clamp-2 px-0.5 w-full`}>
        {sub.name}
      </p>
    </button>
  );
}, (prevProps, nextProps) => {
  return prevProps.sub.id === nextProps.sub.id && prevProps.size === nextProps.size;
});

SubCard.displayName = "SubCard";

/* ─── Shared: Section eyebrow ──────────────────────────────────── */
const Eyebrow = ({ label, title, allProductsLink, navigate }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-2.5">
      <div className="flex items-center gap-1">
        <div className="w-1 h-5 bg-[#B91C1C] rounded-full" />
        <div className="w-1 h-3 bg-[#B91C1C]/40 rounded-full" />
      </div>
      <span className="text-[10.5px] font-black uppercase tracking-[0.2em] text-[#B91C1C]">{label}</span>
      <h3 className="font-black text-xl sm:text-2xl text-gray-900 ml-1">{title}</h3>
    </div>
    {allProductsLink && (
      <Link
        to={allProductsLink}
        className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#B91C1C] hover:gap-2.5 transition-all duration-200"
      >
        See All <ArrowRight size={12} />
      </Link>
    )}
  </div>
);

/* ══════════════════════════════════════════════════════════════
   LAYOUT A ── COLD EQUIPMENT
   Left: big hero card with full description + See All CTA
   Right: 4-col scrollable subcategory grid
══════════════════════════════════════════════════════════════ */
const ColdLayout = ({ category, subcategories, navigate, allProductsLink }) => (
  <section className="py-10 sm:py-14 bg-gradient-to-br from-sky-50/40 via-white to-cyan-50/20 border-b border-gray-100 overflow-hidden">
    <div className="container-main">
      <Eyebrow label="Explore Range" title={category.name} allProductsLink={allProductsLink} navigate={navigate} />

      <div className="flex flex-col lg:flex-row gap-5 items-stretch">

        {/* LEFT — Big hero card */}
        <div className="w-full lg:w-[300px] xl:w-[340px] flex-shrink-0">
          <div
            className="relative rounded-3xl overflow-hidden cursor-pointer group shadow-xl hover:shadow-2xl transition-shadow duration-300 h-[300px] sm:h-[380px] lg:h-full"
            onClick={() => navigate(`/category/${category.id}/subcategories`)}
          >
            {/* Full-cover image */}
            <img
              src={category.image || logo}
              alt={category.name}
              loading="lazy"
              onError={(e) => { e.target.onerror = null; e.target.src = logo; }}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* Dark gradient — stronger at bottom */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(4,14,35,0.97) 0%, rgba(4,14,35,0.60) 45%, rgba(4,14,35,0.10) 100%)" }}
            />

            {/* Category count badge */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full text-white text-[10px] font-black uppercase tracking-wider">
                <Tag size={9} /> {subcategories.length} Categories
              </span>
            </div>

            {/* Text content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="w-8 h-0.5 bg-sky-400 rounded-full mb-3 group-hover:w-20 transition-all duration-400" />
              <h2 className="font-black text-white text-2xl leading-tight mb-2">{category.name}</h2>
              <p className="text-white/65 text-sm leading-relaxed mb-5">
                Professional refrigeration &amp; cold storage solutions for commercial kitchens and restaurants.
              </p>
              {allProductsLink && (
                <Link
                  to={allProductsLink}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 text-xs font-black rounded-full hover:bg-sky-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  See All Products <ArrowRight size={12} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT — 4-col scrollable subcategory grid */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div
            className="overflow-y-auto scrollbar-thin pr-2 flex-1"
            style={{ maxHeight: "420px", contain: "layout style paint" }}
          >
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3" style={{ willChange: "transform" }}>
              {subcategories.map((sub) => (
                <SubCard key={sub.id} sub={sub} navigate={navigate} size="sm" />
              ))}
            </div>
          </div>
          {allProductsLink && (
            <div className="sm:hidden mt-4">
              <Link to={allProductsLink} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#B91C1C]">
                See All <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════════════
   LAYOUT B ── HOT EQUIPMENT
   Left col: subcats auto-scroll top→bottom
   Center: big hero card
   Right col: subcats auto-scroll bottom→top
══════════════════════════════════════════════════════════════ */
const VerticalScrollCol = ({ subs, direction }) => (
  <div className="overflow-hidden relative" style={{ height: "400px" }}>
    <div className={direction === "up" ? "animate-scroll-up" : "animate-scroll-down"}>
      {/* Duplicate items for seamless infinite loop */}
      {[...subs, ...subs].map((sub, i) => (
        <div key={`${sub.id}-${i}`} className="mb-2">
          <SubCard sub={sub} navigate={() => { }} size="sm" />
        </div>
      ))}
    </div>
  </div>
);

const HotLayoutInner = ({ category, subcategories, navigate, allProductsLink }) => {
  /* Split for left / right columns */
  const mid = Math.ceil(subcategories.length / 2);
  const leftSubs = subcategories.slice(0, mid);
  const rightSubs = subcategories.slice(mid);

  /* Clickable vert strip (needs its own navigate) */
  const NavStrip = ({ subs, direction }) => (
    <div className="overflow-hidden relative" style={{ height: "400px" }}>
      <div className={direction === "up" ? "animate-scroll-up" : "animate-scroll-down"}>
        {[...subs, ...subs].map((sub, i) => (
          <button
            key={`${sub.id}-${i}`}
            onClick={() => goToSub(sub, navigate)}
            className="group w-full mb-2 outline-none block"
          >
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-100 shadow-sm group-hover:shadow-lg group-hover:border-[#B91C1C]/40 transition-all duration-300 aspect-square">
              <img
                src={sub.image || logo}
                alt={sub.name}
                loading="lazy"
                onError={(e) => { e.target.onerror = null; e.target.src = logo; }}
                className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-400"
              />
              <div className="absolute bottom-0 left-0 right-0 py-1 bg-[#B91C1C] text-white text-[7px] font-black uppercase text-center tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                View
              </div>
            </div>
            <p className="mt-1 text-center text-[8px] font-bold uppercase tracking-wide text-gray-600 group-hover:text-[#B91C1C] transition-colors line-clamp-1">
              {sub.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-10 sm:py-14 bg-gradient-to-br from-red-50/40 via-white to-orange-50/30 border-b border-gray-100 overflow-hidden">
      <div className="container-main">
        <Eyebrow label="Explore Range" title={category.name} allProductsLink={allProductsLink} navigate={navigate} />

        {/* Desktop: 3-col layout */}
        <div className="hidden lg:grid lg:grid-cols-[140px,1fr,140px] xl:grid-cols-[160px,1fr,160px] gap-4 items-start">

          {/* Left col — scroll top → bottom */}
          <NavStrip subs={leftSubs} direction="down" />

          {/* Center — big hero card */}
          <div
            className="relative rounded-3xl overflow-hidden cursor-pointer group shadow-2xl"
            style={{ height: "400px" }}
            onClick={() => navigate(`/category/${category.id}/subcategories`)}
          >
            <img
              src={category.image || logo}
              alt={category.name}
              loading="lazy"
              onError={(e) => { e.target.onerror = null; e.target.src = logo; }}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,4,4,0.93) 0%, rgba(10,4,4,0.40) 50%, rgba(10,4,4,0.0) 100%)" }} />

            <div className="absolute top-4 right-4">
              <span className="px-3 py-1.5 bg-[#B91C1C] rounded-full text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
                {subcategories.length} types
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-7 text-center">
              <div className="w-8 h-0.5 bg-orange-400 rounded-full mb-3 mx-auto group-hover:w-20 transition-all duration-300" />
              <h2 className="font-black text-white text-3xl leading-tight mb-2">{category.name}</h2>
              <p className="text-white/65 text-sm mb-5">
                Industrial-grade hot cooking equipment built for speed &amp; efficiency.
              </p>
              {allProductsLink && (
                <Link
                  to={allProductsLink}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#B91C1C] text-white text-sm font-black rounded-full hover:bg-red-700 transition-all duration-200 shadow-xl hover:shadow-red-900/40 hover:scale-105"
                >
                  Shop All <ArrowRight size={15} />
                </Link>
              )}
            </div>
          </div>

          {/* Right col — scroll bottom → top */}
          <NavStrip subs={rightSubs} direction="up" />
        </div>

        {/* Mobile / Tablet fallback */}
        <div className="lg:hidden space-y-4">
          <div
            className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-xl h-[260px]"
            onClick={() => navigate(`/category/${category.id}/subcategories`)}
          >
            <img
              src={category.image || logo}
              alt={category.name}
              loading="lazy"
              onError={(e) => { e.target.onerror = null; e.target.src = logo; }}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,4,4,0.92) 0%, rgba(10,4,4,0.35) 55%, rgba(10,4,4,0) 100%)" }} />
            <div className="absolute bottom-0 p-5">
              <h2 className="font-black text-white text-xl mb-2">{category.name}</h2>
              {allProductsLink && (
                <Link to={allProductsLink} onClick={e => e.stopPropagation()} className="inline-flex items-center gap-1 text-white/75 text-xs font-bold hover:text-white">
                  See All <ArrowRight size={10} />
                </Link>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {subcategories.slice(0, 8).map(sub => (
              <SubCard key={sub.id} sub={sub} navigate={navigate} size="sm" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const HotLayout = (props) => <HotLayoutInner {...props} />;

/* ══════════════════════════════════════════════════════════════
   LAYOUT C ── POLYRATTAN BASKET
   Left: 2 large subcategory cards stacked
   Right: main big hero card (largest)
══════════════════════════════════════════════════════════════ */
const PolyrattanLayout = ({ category, subcategories, navigate, allProductsLink }) => {
  const featuredLeft = subcategories.slice(0, 2);
  const extras = subcategories.slice(2);

  return (
    <section className="py-10 sm:py-14 bg-gradient-to-br from-amber-50/30 via-white to-stone-50/40 border-b border-gray-100 overflow-hidden">
      <div className="container-main">
        <Eyebrow label="Explore Range" title={category.name} allProductsLink={allProductsLink} navigate={navigate} />

        {/* Desktop layout */}
        <div className="hidden md:flex gap-5 items-stretch">

          {/* LEFT — 2 stacked subcategory hero cards */}
          <div className="flex flex-col gap-4 w-5/12">
            {featuredLeft.map((sub) => (
              <button
                key={sub.id}
                onClick={() => goToSub(sub, navigate)}
                className="group relative flex-1 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ minHeight: "185px" }}
              >
                <img
                  src={sub.image || logo}
                  alt={sub.name}
                  loading="lazy"
                  onError={(e) => { e.target.onerror = null; e.target.src = logo; }}
                  className="absolute inset-0 w-full h-full object-contain p-6 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,5,2,0.92) 0%, rgba(10,5,2,0.25) 60%, rgba(10,5,2,0) 100%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-black text-white text-sm leading-tight">{sub.name}</p>
                  <span className="text-white/60 text-[10px] font-bold inline-flex items-center gap-1 mt-0.5 group-hover:text-white group-hover:gap-2 transition-all">
                    Shop now <ArrowRight size={9} />
                  </span>
                </div>
              </button>
            ))}

            {/* Extra mini grid if there are more */}
            {extras.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-1">
                {extras.slice(0, 3).map(sub => (
                  <SubCard key={sub.id} sub={sub} navigate={navigate} size="sm" />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — BIG main category card */}
          <div className="flex-1">
            <div
              className="relative rounded-3xl overflow-hidden cursor-pointer group shadow-2xl h-full"
              style={{ minHeight: "420px" }}
              onClick={() => navigate(`/category/${category.id}/subcategories`)}
            >
              <img
                src={category.image || logo}
                alt={category.name}
                loading="lazy"
                onError={(e) => { e.target.onerror = null; e.target.src = logo; }}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(135deg, rgba(120,80,20,0.25) 0%, rgba(10,5,2,0.75) 100%)" }}
              />

              <div className="absolute top-5 left-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-[10px] font-bold uppercase tracking-wider">
                  <Tag size={9} /> {subcategories.length} types
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-7">
                <div className="w-10 h-0.5 bg-amber-400 rounded-full mb-3 group-hover:w-24 transition-all duration-400" />
                <h2 className="font-black text-white text-3xl leading-tight mb-2">{category.name}</h2>
                <p className="text-white/65 text-sm leading-relaxed mb-6">
                  Premium polyrattan baskets &amp; storage solutions for hospitality and retail.
                </p>
                {allProductsLink && (
                  <Link
                    to={allProductsLink}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-gray-900 text-sm font-black rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    Shop All <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile fallback */}
        <div className="md:hidden space-y-4">
          <div
            className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-xl h-[250px]"
            onClick={() => navigate(`/category/${category.id}/subcategories`)}
          >
            <img src={category.image || logo} alt={category.name} loading="lazy" onError={e => { e.target.onerror = null; e.target.src = logo; }} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,5,2,0.92) 0%, rgba(10,5,2,0.35) 60%, rgba(10,5,2,0) 100%)" }} />
            <div className="absolute bottom-0 p-5">
              <h2 className="font-black text-white text-xl mb-1">{category.name}</h2>
              {allProductsLink && (
                <Link to={allProductsLink} onClick={e => e.stopPropagation()} className="inline-flex items-center gap-1 text-white/70 text-xs font-bold hover:text-white">
                  See All <ArrowRight size={10} />
                </Link>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {subcategories.slice(0, 6).map(sub => <SubCard key={sub.id} sub={sub} navigate={navigate} size="sm" />)}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════════════
   LAYOUT D ── ACCESSORIES
   Left 3×3 subcategory grid | Center hero card | Right 3×3 grid
══════════════════════════════════════════════════════════════ */
const AccessoriesLayout = ({ category, subcategories, navigate, allProductsLink }) => {
  const leftSubs = subcategories.slice(0, 9);
  const rightSubs = subcategories.slice(9, 18);

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-gray-100 overflow-hidden">
      <div className="container-main">
        <Eyebrow label="Explore Range" title={category.name} allProductsLink={allProductsLink} navigate={navigate} />

        {/* Desktop: [3×3 grid | CENTER CARD | 3×3 grid] */}
        <div className="hidden lg:grid lg:grid-cols-[1fr,260px,1fr] xl:grid-cols-[1fr,300px,1fr] gap-5 items-center">

          {/* Left 3×3 */}
          <div className="grid grid-cols-3 gap-2.5">
            {leftSubs.map(sub => (
              <SubCard key={sub.id} sub={sub} navigate={navigate} size="sm" />
            ))}
          </div>

          {/* Center — hero card */}
          <div
            className="relative rounded-3xl overflow-hidden cursor-pointer group shadow-2xl"
            style={{ minHeight: "420px" }}
            onClick={() => navigate(`/category/${category.id}/subcategories`)}
          >
            <img
              src={category.image || logo}
              alt={category.name}
              loading="lazy"
              onError={(e) => { e.target.onerror = null; e.target.src = logo; }}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,3,3,0.96) 0%, rgba(10,3,3,0.55) 50%, rgba(10,3,3,0.05) 100%)" }} />

            <div className="absolute top-4 right-4">
              <span className="px-3 py-1.5 bg-[#B91C1C] rounded-full text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
                {subcategories.length}+ types
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
              <div className="w-8 h-0.5 bg-red-400 rounded-full mb-3 mx-auto group-hover:w-16 transition-all duration-300" />
              <h2 className="font-black text-white text-2xl leading-tight mb-2">{category.name}</h2>
              <p className="text-white/60 text-xs mb-5 leading-relaxed">
                Everything you need for a complete, professional kitchen setup.
              </p>
              {allProductsLink && (
                <Link
                  to={allProductsLink}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B91C1C] text-white text-sm font-bold rounded-full hover:bg-red-700 transition-all duration-200 shadow-xl hover:scale-105"
                >
                  Shop All <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>

          {/* Right 3×3 */}
          <div className="grid grid-cols-3 gap-2.5">
            {rightSubs.map(sub => (
              <SubCard key={sub.id} sub={sub} navigate={navigate} size="sm" />
            ))}
          </div>
        </div>

        {/* Tablet: hero top + 6-col grid */}
        <div className="hidden sm:flex lg:hidden flex-col gap-5">
          <div
            className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-xl h-[240px]"
            onClick={() => navigate(`/category/${category.id}/subcategories`)}
          >
            <img src={category.image || logo} alt={category.name} loading="lazy" onError={e => { e.target.onerror = null; e.target.src = logo; }} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,3,3,0.92) 0%, rgba(10,3,3,0.40) 55%, rgba(10,3,3,0) 100%)" }} />
            <div className="absolute bottom-0 p-5">
              <h2 className="font-black text-white text-xl mb-1">{category.name}</h2>
              {allProductsLink && <Link to={allProductsLink} onClick={e => e.stopPropagation()} className="inline-flex items-center gap-1 text-white/70 text-xs font-bold">See All <ArrowRight size={10} /></Link>}
            </div>
          </div>
          <div className="grid grid-cols-6 gap-2.5">
            {subcategories.slice(0, 12).map(sub => <SubCard key={sub.id} sub={sub} navigate={navigate} size="sm" />)}
          </div>
        </div>

        {/* Mobile */}
        <div className="sm:hidden space-y-4">
          <div
            className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-xl h-[220px]"
            onClick={() => navigate(`/category/${category.id}/subcategories`)}
          >
            <img src={category.image || logo} alt={category.name} loading="lazy" onError={e => { e.target.onerror = null; e.target.src = logo; }} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,3,3,0.92) 0%, rgba(10,3,3,0.40) 55%, rgba(10,3,3,0) 100%)" }} />
            <div className="absolute bottom-0 p-5">
              <h2 className="font-black text-white text-xl mb-1">{category.name}</h2>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {subcategories.slice(0, 9).map(sub => <SubCard key={sub.id} sub={sub} navigate={navigate} size="sm" />)}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════════════
   DEFAULT LAYOUT (for any other category)
   Left hero card | Right subcategory carousel
══════════════════════════════════════════════════════════════ */
const DefaultLayout = ({ category, subcategories, navigate, allProductsLink }) => {
  const sliderRef = useRef(null);

  const sliderSettings = {
    dots: false, infinite: true, speed: 480,
    slidesToShow: Math.min(4, subcategories.length || 1),
    slidesToScroll: 1, arrows: false, autoplay: true, autoplaySpeed: 3200,
    swipeToSlide: true, draggable: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(3, subcategories.length || 1) } },
      { breakpoint: 768, settings: { slidesToShow: Math.min(3, subcategories.length || 1) } },
      { breakpoint: 530, settings: { slidesToShow: Math.min(2, subcategories.length || 1) } },
    ],
  };

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-gray-100 overflow-hidden">
      <div className="container-main">
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-7 items-stretch">

          {/* Left hero */}
          <div
            className="flex-shrink-0 w-full lg:w-72 xl:w-80 cursor-pointer group"
            onClick={() => navigate(`/category/${category.id}/subcategories`)}
          >
            <div className="relative h-full min-h-[200px] sm:min-h-[280px] lg:min-h-[360px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300">
              <img src={category.image || logo} alt={category.name} loading="lazy" onError={e => { e.target.onerror = null; e.target.src = logo; }} className="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500" style={{ background: "linear-gradient(135deg, #f8f4f0, #ede8e3)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,3,3,0.92) 0%, rgba(10,3,3,0.35) 50%, rgba(10,3,3,0.0) 100%)" }} />
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#B91C1C] rounded-full text-white text-[9px] font-black uppercase tracking-wider shadow-lg">
                  <Tag size={8} /> {subcategories.length} types
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="w-8 h-[3px] bg-[#B91C1C] rounded-full mb-3 group-hover:w-16 transition-all duration-300" />
                <h2 className="font-black text-white text-xl leading-tight mb-2">{category.name}</h2>
                <p className="inline-flex items-center gap-1.5 text-white/70 text-[12px] font-bold group-hover:text-white group-hover:gap-2.5 transition-all duration-200">
                  Shop all <ArrowRight size={11} />
                </p>
              </div>
            </div>
          </div>

          {/* Right slider */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-start justify-between mb-6 flex-shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-5 bg-[#B91C1C] rounded-full" />
                    <div className="w-1 h-3 bg-[#B91C1C]/40 rounded-full" />
                  </div>
                  <p className="text-[10.5px] font-black uppercase tracking-[0.2em] text-[#B91C1C]">Explore Range</p>
                </div>
                <h3 className="font-black text-2xl sm:text-[26px] text-gray-900 leading-tight">{category.name}</h3>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                {allProductsLink && (
                  <button onClick={() => navigate(allProductsLink)} className="hidden sm:inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#B91C1C] hover:gap-2.5 transition-all duration-200">
                    See All <ArrowRight size={13} />
                  </button>
                )}
                <button onClick={() => sliderRef.current?.slickPrev()} aria-label="Previous" className="w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-gray-200 text-gray-500 hover:border-[#B91C1C] hover:text-[#B91C1C] transition-all duration-200 shadow-sm">
                  <ChevronLeft size={15} />
                </button>
                <button onClick={() => sliderRef.current?.slickNext()} aria-label="Next" className="w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-gray-200 text-gray-500 hover:border-[#B91C1C] hover:text-[#B91C1C] transition-all duration-200 shadow-sm">
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            <div className="flex-1">
              {subcategories.length > 0 ? (
                <Slider ref={sliderRef} {...sliderSettings}>
                  {subcategories.map(sub => (
                    <SubCard key={sub.id} sub={sub} navigate={navigate} />
                  ))}
                </Slider>
              ) : (
                <p className="text-gray-400 text-sm pt-4">No subcategories available.</p>
              )}
            </div>

            {allProductsLink && (
              <div className="sm:hidden mt-5">
                <button onClick={() => navigate(allProductsLink)} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#B91C1C]">
                  See All <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN EXPORT — dispatches to the correct layout
══════════════════════════════════════════════════════════════ */
const CategorySection = ({ apiEndpoint, allProductsLink }) => {
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(apiEndpoint)
      .then(({ data }) => {
        setCategory({
          id: data.categoryId,
          name: data.categoryName,
          image: data.categoryImage,
        });
        setSubcategories(data.subcategories || []);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [apiEndpoint]);

  if (loading) return <LoadingSkeleton />;
  if (!category?.id) return null;

  const variant = getVariant(category.name);
  const props = { category, subcategories, navigate, allProductsLink };

  switch (variant) {
    case "cold": return <ColdLayout       {...props} />;
    case "hot": return <HotLayout        {...props} />;
    case "polyrattan": return <PolyrattanLayout  {...props} />;
    case "accessories": return <AccessoriesLayout {...props} />;
    default: return <DefaultLayout     {...props} />;
  }
};

export default CategorySection;
