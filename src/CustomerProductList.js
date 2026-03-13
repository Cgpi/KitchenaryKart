/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./utils/api";
import logo from "./images/piclogo.png";
import { ProductSkeleton } from "./components/common/ProductSkeleton";
import {
  ArrowLeft,
  SlidersHorizontal,
  Star,
  X,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  LayoutList,
  Check,
  TrendingUp,
  TrendingDown,
  Tag,
} from "lucide-react";

// ── Price presets ────────────────────────────────────────────────────────────
const pricePresets = [
  { label: "All Prices", range: [0, 250000] },
  { label: "Under ₹1K", range: [0, 1000] },
  { label: "₹1K – ₹5K", range: [1000, 5000] },
  { label: "₹5K – ₹25K", range: [5000, 25000] },
  { label: "Above ₹25K", range: [25000, 250000] },
];

const sortOptions = [
  { value: "", label: "Relevance", icon: <Tag size={13} /> },
  { value: "asc", label: "Price: Low to High", icon: <TrendingUp size={13} /> },
  { value: "desc", label: "Price: High to Low", icon: <TrendingDown size={13} /> },
];

// ── Star rating ──────────────────────────────────────────────────────────────
const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={11}
        className={star <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-stone-200 fill-stone-100"}
      />
    ))}
    <span className="text-[10px] text-stone-400 ml-1">{rating.toFixed(1)}</span>
  </div>
);

// ── Collapsible filter section ───────────────────────────────────────────────
const FilterSection = ({ title, open, onToggle, children }) => (
  <div className="border-b border-stone-100 last:border-0">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-3.5 text-sm font-semibold text-gray-700 hover:text-red-700 transition-colors duration-150"
    >
      <span>{title}</span>
      <span className="text-stone-400 transition-transform duration-200">
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </span>
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
        }`}
    >
      {children}
    </div>
  </div>
);

// ── Filter Panel (shared between sidebar and mobile drawer) ──────────────────
const FilterPanel = ({
  sortOrder,
  setSortOrder,
  priceRange,
  setPriceRange,
  filterOpen,
  setFilterOpen,
  clearFilters,
  activeFiltersCount,
}) => (
  <div>
    {/* Active filter badge row */}
    {activeFiltersCount > 0 && (
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-stone-100">
        <span className="text-xs text-stone-500 font-medium">
          {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} active
        </span>
        <button
          onClick={clearFilters}
          className="text-xs font-semibold text-red-700 hover:text-red-800 transition-colors flex items-center gap-1"
        >
          <X size={11} /> Clear all
        </button>
      </div>
    )}

    {/* Sort By */}
    <FilterSection
      title="Sort By"
      open={filterOpen.sort}
      onToggle={() => setFilterOpen((p) => ({ ...p, sort: !p.sort }))}
    >
      <div className="space-y-1">
        {sortOptions.map(({ value, label, icon }) => {
          const active = sortOrder === value;
          return (
            <button
              key={value}
              onClick={() => setSortOrder(value)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${active
                ? "bg-red-700 text-white font-semibold shadow-sm"
                : "text-stone-600 hover:bg-stone-50 hover:text-red-700"
                }`}
            >
              <span className={active ? "text-white/80" : "text-stone-400"}>{icon}</span>
              <span className="flex-1 text-left">{label}</span>
              {active && <Check size={13} className="text-white/90 flex-shrink-0" />}
            </button>
          );
        })}
      </div>
    </FilterSection>

    {/* Price Range */}
    <FilterSection
      title="Price Range"
      open={filterOpen.price}
      onToggle={() => setFilterOpen((p) => ({ ...p, price: !p.price }))}
    >
      <div className="space-y-1">
        {pricePresets.map(({ label, range }) => {
          const active = priceRange[0] === range[0] && priceRange[1] === range[1];
          return (
            <button
              key={label}
              onClick={() => setPriceRange(range)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${active
                ? "bg-red-700 text-white font-semibold shadow-sm"
                : "text-stone-600 hover:bg-stone-50 hover:text-red-700"
                }`}
            >
              <span>{label}</span>
              {active && <Check size={13} className="text-white/90" />}
            </button>
          );
        })}
      </div>
    </FilterSection>
  </div>
);

// ── Main Component ───────────────────────────────────────────────────────────
const CustomerProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { subcategoryId, subsubcategoryId } = useParams();
  const [ratings, setRatings] = useState({});
  const [priceRange, setPriceRange] = useState([0, 250000]);
  const [sortOrder, setSortOrder] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [filterOpen, setFilterOpen] = useState({ price: true, sort: true });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);
  useEffect(() => { fetchProducts(); }, [subcategoryId, subsubcategoryId]); // eslint-disable-line

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = `${process.env.REACT_APP_API_BASE_URL}/product/filter`;
      const params = {};
      if (subsubcategoryId) params.subsubcategoryId = subsubcategoryId;
      else if (subcategoryId) params.subcategoryId = subcategoryId;
      const response = await api.get(url, { params });
      setProducts(response.data);
      response.data.forEach((product) =>
        product.variants?.forEach((v) => fetchVariantReviews(v.id))
      );
    } catch (_) {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  const fetchVariantReviews = async (variantId) => {
    try {
      const { data } = await api.get(`/Reviews/variant/${variantId}`);
      const reviews = data || [];
      if (reviews.length > 0) {
        const avg = reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length;
        if (avg >= 3) setRatings((prev) => ({ ...prev, [variantId]: avg }));
      }
    } catch (_) { /* silent */ }
  };

  const filteredAndSortedProducts = useMemo(() => {
    if (!products?.length) return [];
    return [...products]
      .filter((p) => {
        const q = searchQuery.toLowerCase();
        return p.name?.toLowerCase().includes(q) || p.keywords?.toLowerCase().includes(q);
      })
      .filter((p) => p.variants?.some((v) => v.stock > 0))
      .filter((p) => {
        const price = p.variants?.[0]?.price || 0;
        return price >= priceRange[0] && price <= priceRange[1];
      })
      .sort((a, b) => {
        const pa = a.variants?.[0]?.price || 0;
        const pb = b.variants?.[0]?.price || 0;
        return sortOrder === "asc" ? pa - pb : sortOrder === "desc" ? pb - pa : 0;
      });
  }, [products, searchQuery, sortOrder, priceRange]);

  const getFirstAvailableVariant = useCallback(
    (variants) => variants.find((v) => v.stock > 0) || null,
    []
  );

  const clearFilters = useCallback(() => {
    setPriceRange([0, 250000]);
    setSortOrder("");
    setSearchQuery("");
  }, []);

  const activeFiltersCount = [
    sortOrder !== "",
    priceRange[0] !== 0 || priceRange[1] !== 250000,
    searchQuery !== "",
  ].filter(Boolean).length;

  const filterPanelProps = {
    sortOrder, setSortOrder,
    priceRange, setPriceRange,
    filterOpen, setFilterOpen,
    clearFilters, activeFiltersCount,
  };

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-50 flex flex-col" style={{ height: 'calc(100vh - 108px)' }}>
      {/* ── Top toolbar (sticky, outside scroll area) ─────────────────── */}
      <div className="flex-shrink-0 max-w-screen-xl w-full mx-auto px-3 sm:px-5 lg:px-8 pt-4 pb-3 sm:pt-5 sm:pb-4">

        {/* ── Top toolbar ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 sm:mb-5">
          {/* Back + count */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-red-700 transition-colors"
            >
              <ArrowLeft size={15} />
              Back
            </button>
            <span className="text-stone-300">|</span>
            <span className="text-sm text-stone-500">
              <span className="font-semibold text-gray-800">{filteredAndSortedProducts.length}</span> products found
            </span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Mobile filter button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden relative inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold border border-stone-200 rounded-xl bg-white text-gray-700 hover:border-red-700 hover:text-red-700 transition-colors shadow-sm"
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-700 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search in results..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-3.5 pr-8 text-sm text-gray-700 bg-white border border-stone-200 rounded-xl outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700/10 transition-all w-36 sm:w-44 lg:w-52"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* View toggle */}
            <div className="hidden sm:flex items-center border border-stone-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center justify-center w-9 h-9 transition-colors ${viewMode === "grid" ? "bg-red-700 text-white" : "text-stone-400 hover:text-gray-700"}`}
                aria-label="Grid view"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center justify-center w-9 h-9 transition-colors ${viewMode === "list" ? "bg-red-700 text-white" : "text-stone-400 hover:text-gray-700"}`}
                aria-label="List view"
              >
                <LayoutList size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main split pane (filter LEFT | products RIGHT both scroll independently) ── */}
      <div className="flex flex-1 overflow-hidden max-w-screen-xl w-full mx-auto px-3 sm:px-5 lg:px-8 pb-4 gap-0 lg:gap-5">

        {/* ── LEFT: STICKY FILTER SIDEBAR ─────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-56 xl:w-60 flex-shrink-0 h-full overflow-y-auto pr-0"
          style={{ scrollbarWidth: 'thin' }}>
          {/* Sidebar card */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-stone-100 bg-gray-50">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-red-700" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700">Filters</h3>
              </div>
              {activeFiltersCount > 0 && (
                <span className="bg-red-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            {/* Filter body */}
            <div className="px-4 py-1">
              <FilterPanel {...filterPanelProps} />
            </div>
          </div>
        </aside>

        {/* ── RIGHT: SCROLLABLE PRODUCT AREA ─────────────────────────── */}
        <div className="flex-1 min-w-0 h-full overflow-y-auto pl-0 lg:pl-1"
          style={{ scrollbarWidth: 'thin' }}>
          {/* Skeleton */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(12)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          )}

          {!loading && (
            <>
              {filteredAndSortedProducts.length > 0 ? (
                <div
                  className={
                    viewMode === "list"
                      ? "space-y-3"
                      : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
                  }
                >
                  {filteredAndSortedProducts.map((product) => {
                    const variant = getFirstAvailableVariant(product.variants || []);
                    const imageUrl = variant?.images?.[0]?.startsWith("https") ? variant.images[0] : variant?.images?.[0] || logo;
                    const priceExcl = variant?.price_excluding_tax || 0;
                    const priceIncl = variant?.price || 0;
                    const rating = variant ? ratings[variant.id] : null;
                    const fmt = (n) => new Intl.NumberFormat("en-IN").format(n);

                    if (viewMode === "list") {
                      return (
                        <div
                          key={product.id}
                          className="bg-white rounded-2xl shadow-sm border border-stone-100 hover:shadow-md hover:border-red-200 transition-all duration-300 flex items-center gap-4 p-3 cursor-pointer group"
                          onClick={() => navigate(`/product/${product.id}?name=${encodeURIComponent(product.name)}`)}
                        >
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-stone-50 flex-shrink-0">
                            <img
                              src={imageUrl} alt={variant?.name || product.name}
                              loading="lazy"
                              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => { e.target.onerror = null; e.target.src = logo; }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            {product.subcategories?.[0]?.name && (
                              <p className="text-[10px] font-bold uppercase tracking-wider text-red-700 mb-0.5">
                                {product.subcategories[0].name}
                              </p>
                            )}
                            <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 mb-1.5">
                              {product.name}
                            </h3>
                            {rating && <StarRating rating={rating} />}
                          </div>
                          <div className="flex-shrink-0 text-right pr-1">
                            <p className="font-bold text-red-700 text-sm">₹{fmt(priceIncl)}</p>
                            <p className="text-[10px] text-stone-400 mt-0.5">₹{fmt(priceExcl)} excl. GST</p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-2xl shadow-sm border border-stone-100 hover:shadow-md hover:border-red-200 transition-all duration-300 cursor-pointer group overflow-hidden"
                        onClick={() => navigate(`/product/${product.id}?name=${encodeURIComponent(product.name)}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && navigate(`/product/${product.id}?name=${encodeURIComponent(product.name)}`)}
                      >
                        <div className="relative aspect-square bg-stone-50 overflow-hidden">
                          <img
                            src={imageUrl} alt={variant?.name || product.name}
                            loading="lazy"
                            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.target.onerror = null; e.target.src = logo; }}
                          />
                        </div>
                        <div className="p-3 sm:p-3.5">
                          {product.subcategories?.[0]?.name && (
                            <p className="text-[10px] font-bold uppercase tracking-wider text-red-700 mb-1 line-clamp-1">
                              {product.subcategories[0].name}
                            </p>
                          )}
                          <h3 className="font-semibold text-gray-800 text-xs sm:text-sm leading-snug line-clamp-2 mb-1.5 sm:mb-2">
                            {product.name}
                          </h3>
                          {rating && (
                            <div className="mb-1.5">
                              <StarRating rating={rating} />
                            </div>
                          )}
                          <p className="font-bold text-red-700 text-sm">₹{fmt(priceIncl)}</p>
                          {priceExcl > 0 && (
                            <p className="text-[10px] text-stone-400 mt-0.5">₹{fmt(priceExcl)} excl. GST</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl shadow-sm border border-stone-100">
                  <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                    <SlidersHorizontal size={24} className="text-stone-400" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">No products found</h3>
                  <p className="text-stone-400 text-sm max-w-xs">
                    Try adjusting your filters or search terms to find what you're looking for.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-5 px-5 py-2.5 bg-red-700 text-white text-sm font-semibold rounded-xl hover:bg-red-800 transition-colors shadow-sm"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── MOBILE FILTER BOTTOM SHEET ──────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${mobileSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setMobileSidebarOpen(false)}
      />
      {/* Sheet */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-[201] bg-white rounded-t-3xl shadow-2xl transition-transform duration-400 ease-out ${mobileSidebarOpen ? "translate-y-0" : "translate-y-full"
          }`}
        style={{ maxHeight: "85vh" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-stone-200 rounded-full" />
        </div>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-red-700" />
            <h3 className="font-bold text-gray-800 text-base">Filters &amp; Sort</h3>
            {activeFiltersCount > 0 && (
              <span className="bg-red-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors"
          >
            <X size={15} />
          </button>
        </div>
        {/* Scrollable content */}
        <div className="overflow-y-auto px-5 pb-2" style={{ maxHeight: "calc(85vh - 10rem)" }}>
          <div className="pt-2">
            <FilterPanel {...filterPanelProps} />
          </div>
        </div>
        {/* Footer button */}
        <div className="px-5 py-4 border-t border-stone-100 bg-white">
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="w-full py-3 bg-red-700 text-white text-sm font-bold rounded-2xl hover:bg-red-800 active:scale-[0.98] transition-all shadow-sm"
          >
            Show {filteredAndSortedProducts.length} Result{filteredAndSortedProducts.length !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerProductList;
