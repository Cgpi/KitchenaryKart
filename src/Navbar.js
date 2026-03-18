import React, { useEffect, useState, useRef, useCallback } from "react";
import api from "./utils/api";
import { getCachedCategories, setCachedCategories, processCategories } from "./utils/categoriesCache";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, X, Menu, ChevronRight, Grid, ArrowRight } from "lucide-react";
import logo from "./images/piclogo.png";

/** Split a flat array into balanced columns (max 3) */
function splitColumns(arr, maxCols = 3) {
  if (!arr || arr.length === 0) return [];
  let numCols;
  if (arr.length <= 5) numCols = 1;
  else if (arr.length <= 10) numCols = 2;
  else numCols = maxCols;
  const perCol = Math.ceil(arr.length / numCols);
  const cols = [];
  for (let i = 0; i < arr.length; i += perCol) {
    cols.push(arr.slice(i, i + perCol));
  }
  return cols;
}

/** Map column count to Tailwind grid class */
function gridColsClass(count) {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  return "grid-cols-3";
}

function Navbar() {
  const NEW_CACHE_KEY = "new_arrivals_cache";

const getCachedNewArrivals = () => {
  try {
    return JSON.parse(localStorage.getItem(NEW_CACHE_KEY)) || [];
  } catch {
    return [];
  }
};
  const [categories, setCategories] = useState(() => getCachedCategories() || []);
  const [categoriesLoading, setCategoriesLoading] = useState(() => !(getCachedCategories()?.length > 0));
  const [activeCategory, setActiveCategory] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
 const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 990);
const [newProducts, setNewProducts] = useState(() => getCachedNewArrivals());

const [newLoading, setNewLoading] = useState(
  () => getCachedNewArrivals().length === 0
);
  const closeTimer = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();


const setCachedNewArrivals = (products) => {
  localStorage.setItem(NEW_CACHE_KEY, JSON.stringify(products));
};
  // ── Resize listener ──────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 990);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Fetch Categories — show cached immediately, then refresh in background ─
 // ── Fetch Categories — show cached immediately, then refresh in background ─
useEffect(() => {
  async function fetchCategories() {
    const cached = getCachedCategories() || [];
    if (cached.length > 0) {
      setCategories(cached); // show instantly
      setCategoriesLoading(false);
    }

    try {
      const res = await api.get(`/category/index`);
      const cats = processCategories(res.data);

      // Only update if there is any new category
      const cachedIds = cached.map((c) => c.id);
      const hasNew = cats.some((c) => !cachedIds.includes(c.id));

      if (hasNew || cached.length === 0) {
        setCategories(cats);
        setCachedCategories(res.data);
      }
    } catch (e) {
      console.error("Failed to fetch categories", e);
      // keep cached if fetch fails
    } finally {
      setCategoriesLoading(false);
    }
  }

  fetchCategories();
}, []);
useEffect(() => {
  if (activeCategory !== "new") return;

  let ignore = false;

  async function fetchNewArrivals() {
    try {
      setNewLoading(true); // ✅ show skeleton ONLY if needed

      const res = await api.get("/product/new_arrivals");

      if (!ignore && res.data) {
        setNewProducts(res.data);
        setCachedNewArrivals(res.data);
      }
    } catch (e) {
      console.error("Failed to fetch new arrivals", e);
    } finally {
      if (!ignore) setNewLoading(false);
    }
  }

  fetchNewArrivals();

  return () => {
    ignore = true;
  };
}, [activeCategory]);

// ── Close on route change ────────────────────────────────────────
  useEffect(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
    setActiveCategory(null);
  }, [location.pathname]);

  // ── Escape key ───────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setActiveCategory(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // ── Body scroll lock ─────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // ── Navigation (ORIGINAL LOGIC — UNTOUCHED) ──────────────────────
  const handleSubcategoryClick = useCallback(
    (categoryId, subcategoryId, subsubcategories) => {
      setActiveCategory(null);
      setMobileOpen(false);
      if (subsubcategories && subsubcategories.length > 0) {
        navigate(`/subcategory/category/${categoryId}/subcategory/${subcategoryId}`);
      } else {
        navigate(`/products/category/${categoryId}/subcategory/${subcategoryId}`);
      }
    },
    [navigate]
  );

  // ── Hover helpers ────────────────────────────────────────────────
  const openMenu = useCallback((id) => {
    clearTimeout(closeTimer.current);
    setActiveCategory(id);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveCategory(null), 160);
  }, []);

  const cancelClose = useCallback(() => {
    clearTimeout(closeTimer.current);
  }, []);

  const activeData = categories.find((c) => c.id === activeCategory) || null;
 const megaColumns =
  activeCategory === "new" || !activeData
    ? []
    : splitColumns(activeData.subcategories || []);

  return (
    <>
      {/* ════════════════════════════════════════════════════════════
          DESKTOP NAV — shown at ≥ 640 px via JS (reliable cross-env)
      ════════════════════════════════════════════════════════════ */}
      <nav
        aria-label="Category navigation"
        style={{ display: isDesktop ? "block" : "none" }}
        className="relative bg-white sticky top-14 sm:top-16 z-50"
      >
        {/* ── Tab Bar — full viewport width, items share space equally ── */}
{/* ── Tab Bar — full width, items shrink to fit ── */}

  <ul className="flex items-center h-12 m-0 p-0 w-full overflow-x-auto whitespace-nowrap scrollbar-hide"
  role="menubar"
  aria-label="Product categories"
>
  <li
  className="flex-shrink-0 list-none h-full"
  onMouseEnter={() => openMenu("new")}
  onMouseLeave={scheduleClose}
>
  <button
    // onClick={() => {
    //   setActiveCategory(null);
    //   navigate("/new-arrivals");
    // }}
    className={`relative flex items-center justify-center gap-1 h-12 px-3 text-[11px] font-bold uppercase
    tracking-wide transition-all duration-150
    after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300
    ${activeCategory === "new" ? "after:w-full text-black" : "text-black/90 hover:text-black hover:after:w-full"}`}
  >
    NEW
  </button>
</li>
  {categories.length > 0
    ? categories.map((cat) => (
        <li
          key={cat.id}
          className="flex-shrink-0 list-none h-full"
          role="none"
          onMouseEnter={() => openMenu(cat.id)}
          onMouseLeave={scheduleClose}
        >
          <button
            role="menuitem"
            aria-expanded={activeCategory === cat.id}
            aria-haspopup="true"
            onClick={() => {
              setActiveCategory(null);
              navigate(`/category/${cat.id}/subcategories`);
            }}
            className={`relative flex items-center justify-center gap-1 h-12 px-2 text-[11px] font-bold uppercase
             tracking-wide transition-all duration-150
             after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300
             ${activeCategory === cat.id ? "after:w-full text-black" : "text-black/90 hover:text-black hover:after:w-full"}`}
          >
            <span className="truncate">{cat.name}</span>
            <ChevronDown
              size={10}
              className={`flex-shrink-0 transition-transform duration-200 ${
                activeCategory === cat.id ? "rotate-180" : ""
              }`}
            />
          </button>
        </li>
      ))
    : categoriesLoading
    ? Array.from({ length: 9 }).map((_, i) => (
        <li
          key={`nav-skeleton-${i}`}
          className="flex-shrink list-none h-full flex items-center justify-center"
        >
          <div className="h-3 w-16 sm:w-20 bg-white/20 rounded animate-pulse" />
        </li>
      ))
    : null}
</ul>

        {/* ══ MEGA MENU PANEL ══════════════════════════════════════
            Rendered as a sibling of the tab bar — NOT inside the
            overflow-x-auto container. Positioned absolute relative
            to the sticky <nav>, spans full nav width.
        ════════════════════════════════════════════════════════════ */}
       {(activeData || activeCategory === "new") && (
  <nav
    onMouseEnter={cancelClose}
    onMouseLeave={scheduleClose}
    aria-label={
      activeCategory === "new"
        ? "New arrivals"
        : `${activeData?.name} — subcategories`
    }
    className="absolute top-full left-0 right-0 bg-white z-[9999] flex flex-col"
    style={{
      height: "360px",
      boxShadow: "0 32px 80px rgba(0,0,0,0.13), 0 8px 24px rgba(0,0,0,0.08)",
      animation: "slideDown 0.18s cubic-bezier(0.16,1,0.3,1) forwards",
    }}
  >
    {activeCategory === "new" ? (
      // ✅ NEW TAB UI
      <div className="container-main h-full flex items-start gap-6 py-6">
        {/* LEFT BANNER */}
        <div className="w-56 h-47  overflow-hidden relative">
          <img
            src={newProducts?.[0]?.variants?.[0]?.images?.[0] || logo}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-4 left-4 text-white">
          
            <h2 className="text-xs opacity-80">Latest collections</h2>
          </div>
        </div>

        {/* RIGHT LINKS */}
        <div className="flex-1 grid grid-cols-2 gap-6">
           {/* Shop By Category */}
          <div>
            <h3 className="text-sm font-bold mb-3">Shop By Category</h3>
            <ul className="space-y-2 text-[13px]">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() =>
                        navigate(`/category/${cat.id}/subcategories`)
                      }
                      className="text-left hover:text-black/80 font-medium"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 text-xs">Loading categories...</li>
              )}
            </ul>
          </div>
          {/* Featured */}
          <div>
            <h3 className="text-sm font-bold mb-3">Featured</h3>
            <ul className="space-y-2 text-[13px]">
              <li>
                <button
                  onClick={() => navigate("/new-arrivals")}
                  className="text-left hover:text-black/80 font-medium"
                >
                  Latest Drops
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/most-selling-all")}
                  className="text-left hover:text-black/80 font-medium"
                >
                  Best Sellers
                </button>
              </li>
            </ul>
          </div>

         
        </div>
      </div>
    ) : (

  // ✅ YOUR EXISTING MEGA MENU (PASTE EVERYTHING BELOW AS IT IS)
  <div className="container-main flex-1 flex gap-0 min-h-0 py-6">

              <div className="w-64 flex-shrink-0 pr-6 border-r border-stone-100 flex flex-col justify-between">
  <div>
    <button
      onClick={() => {
        setActiveCategory(null);
        navigate(`/category/${activeData.id}/subcategories`);
      }}
      className="block w-full text-left group/img mb-4"
    >
      {/* IMAGE CARD */}
      <div className="w-full h-56 overflow-hidden relative">
        <img
          src={activeData.image || logo}
          key={activeData?.id}
          alt={activeData.name}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = logo;
          }}
          className="w-full h-full object-cover
                     group-hover/img:scale-110 transition-transform duration-500"
        />

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* TEXT ON IMAGE */}
        <div className="absolute bottom-3 left-3 right-3">
          {/* <h2 className="text-white text-lg font-bold leading-tight">
            {activeData.name}
          </h2> */}
          <p className="text-white/80 text-xs mt-1">
            {activeData.subcategories?.length || 0} categories
          </p>
        </div>
      </div>
    </button>
  </div>

  {/* SHOP ALL BUTTON */}
  <button
    onClick={() => {
      setActiveCategory(null);
      navigate(`/category/${activeData.id}/subcategories`);
    }}
    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold
               text-white bg-black rounded-xl
               hover:bg-gray-800 transition-all duration-200 w-full justify-center"
  >
    Shop All
    <ArrowRight size={14} />
  </button>
</div>

              {/* RIGHT PANEL — scrollable subcategory list ──────── */}
              <div className="flex-1 pl-6 min-w-0 flex flex-col min-h-0">
                {/* Fixed header row */}
                <div className="flex items-center gap-3 mb-3 flex-shrink-0">
                  <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.12em]">
                    Browse {activeData.name}
                  </h3>
                  <div className="flex-1 h-px bg-stone-100" />
                  <span className="text-[10px] font-semibold text-stone-300">
                    {activeData.subcategories?.length || 0} categories
                  </span>
                </div>

                {/* Scrollable area */}
                <div className="flex-1 overflow-y-auto scrollbar-thin min-h-0">
                  {megaColumns.length > 0 ? (
                    <div className={`grid gap-x-3 gap-y-0 ${gridColsClass(megaColumns.length)}`}>
                      {megaColumns.map((col) => (
                        <ul key={col[0]?.id ?? col.length} className="space-y-0 m-0 p-0">
                          {col.map((sub) => (
                            <li key={sub.id} className="list-none">
                              <button
                                onClick={() =>
                                  handleSubcategoryClick(
                                    activeData.id,
                                    sub.id,
                                    sub.subsubcategories
                                  )
                                }
                                className="w-full text-left flex items-center justify-between
                                           py-[6px] px-2.5 rounded-lg text-[12.5px] font-medium
                                           text-stone-700 hover:text-brand hover:bg-gray-100
                                           transition-all duration-100 group/sub"
                              >
                                <span className="truncate leading-snug pr-1">{sub.name}</span>
                                {sub.subsubcategories && sub.subsubcategories.length > 0 ? (
                                  <ChevronRight
                                    size={11}
                                    className="flex-shrink-0 text-stone-300 group-hover/sub:text-brand
                                               transition-colors ml-1"
                                  />
                                ) : (
                                  <ArrowRight
                                    size={10}
                                    className="flex-shrink-0 opacity-0 group-hover/sub:opacity-40
                                               text-brand transition-opacity ml-1"
                                  />
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>
                  ) : (
                    <p className="text-stone-400 text-sm py-4">
                      No subcategories available.
                    </p>
                  )}
                </div>
              </div>
                       </div>
)}
            {/* ── Bottom strip — always visible at fixed bottom ─── */}
          {activeCategory !== "new" && activeData && (
  <div className="flex-shrink-0 border-t border-stone-100 bg-stone-50/70 py-2">
    <div className="container-main flex items-center justify-between">
      <p className="text-[11px] text-stone-400 font-body">
        {activeData.subcategories?.length || 0} subcategories in{" "}
        <span className="font-semibold text-stone-500">
          {activeData.name}
        </span>
      </p>
      <button
        onClick={() => {
          setActiveCategory(null);
          navigate(`/category/${activeData.id}/subcategories`);
        }}
        className="inline-flex items-center gap-1 text-[11px] font-bold text-brand
                   hover:underline hover:underline-offset-2 transition-all"
      >
        View all {activeData.name}
        <ArrowRight size={10} />
      </button>
    </div>
  </div>
)}
          </nav>
        )}
      </nav>

      {/* ════════════════════════════════════════════════════════════
          MOBILE TRIGGER BAR — shown below 640 px
      ════════════════════════════════════════════════════════════ */}
      <nav
        aria-label="Category navigation"
        style={{ display: isDesktop ? "none" : "block" }}
       className="bg-white border-b border-stone-200 sticky top-14 sm:top-16 z-40"
      >
        <div className="container-main">
          <div className="flex items-center justify-between h-12">
  {/* LEFT → Browse */}
  <button
    onClick={() => setMobileOpen(true)}
    className="flex items-center gap-2 px-4 py-2 bg-gray text-black text-sm
               font-semibold rounded-lg hover:bg-black/80 transition"
    aria-label="Open categories menu"
  >
    <Menu size={25} />
   
  </button>

  {/* RIGHT → All Categories */}
  <button
    onClick={() => navigate("/all-subcategories")}
    className="flex items-center gap-2 text-black text-sm font-semibold"
  >
    <Grid size={15} />
    All Categories
  </button>
</div>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════════
          MOBILE DRAWER
      ════════════════════════════════════════════════════════════ */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[300] flex">
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm border-0 cursor-default"
            onClick={() => setMobileOpen(false)}
            aria-label="Close categories menu"
            tabIndex={-1}
          />

          {/* Drawer panel — using <dialog> for semantic correctness */}
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <dialog
            open
            aria-modal="true"
            aria-label="Browse categories"
            className="relative w-[320px] max-w-[88vw] bg-white h-full m-0 p-0 border-0
                       shadow-2xl flex flex-col animate-slide-right max-h-screen"
            style={{ position: "relative" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-brand
                            border-b border-white/20 flex-shrink-0">
              <span className="text-white font-display font-bold text-lg">
               Kitchenary Kart
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full
                           bg-white/15 text-white hover:bg-white/30 transition-colors"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Category accordion list */}
            <div className="flex-1 overflow-y-auto">
              {categories.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                categories.map((cat) => (
                  <div key={cat.id} className="border-b border-stone-100 last:border-0">
                    <button
                      onClick={() =>
                        setMobileExpanded(
                          mobileExpanded === cat.id ? null : cat.id
                        )
                      }
                      className="w-full flex items-center justify-between px-5 py-3.5
                                 text-sm font-semibold text-charcoal hover:bg-stone-50
                                 transition-colors text-left"
                    >
                      <span>{cat.name}</span>
                      <ChevronDown
                        size={15}
                        className={`text-stone-400 transition-transform duration-200
                                    flex-shrink-0 ${
                          mobileExpanded === cat.id
                            ? "rotate-180 text-brand"
                            : ""
                        }`}
                      />
                    </button>

                    {mobileExpanded === cat.id &&
                      cat.subcategories &&
                      cat.subcategories.length > 0 && (
                        <div className="bg-stone-50">
                          {/* Shop all row */}
                          <button
                            onClick={() => {
                              setMobileOpen(false);
                              navigate(`/category/${cat.id}/subcategories`);
                            }}
                            className="w-full flex items-center gap-2 pl-8 pr-5 py-2.5 text-left
                                       text-xs font-bold text-brand border-b border-stone-100
                                       hover:bg-gray-100 transition-colors"
                          >
                            <ArrowRight size={11} />
                            Shop All {cat.name}
                          </button>
                          {cat.subcategories.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() =>
                                handleSubcategoryClick(
                                  cat.id,
                                  sub.id,
                                  sub.subsubcategories
                                )
                              }
                              className="w-full flex items-center justify-between
                                         pl-8 pr-5 py-3 text-left text-sm text-stone-600
                                         hover:text-brand hover:bg-gray-100 transition-colors
                                         border-b border-stone-100 last:border-0"
                            >
                              <span>{sub.name}</span>
                              <ChevronRight
                                size={13}
                                className="text-stone-300 flex-shrink-0"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-stone-100 bg-stone-50 flex-shrink-0">
              <button
                onClick={() => {
                  navigate("/all-subcategories");
                  setMobileOpen(false);
                }}
                className="btn-primary w-full"
              >
                View All Categories
              </button>
            </div>
          </dialog>
        </div>
      )}
    </>
  );
}

export default Navbar;
