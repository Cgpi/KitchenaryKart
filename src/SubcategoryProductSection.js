/**
 * SubcategoryProductSection — reusable homepage subcategory product grid.
 * Used by SubcategoryWithSubcategories (1–5).
 * All API logic, filtering, sorting, navigation — UNTOUCHED.
 * Only UI rebuilt with Tailwind.
 */
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./utils/api";
import logo from "./images/piclogo.png";
import { ArrowRight, SlidersHorizontal, Eye, ChevronRight } from "lucide-react";

/* ── Product card skeleton ──────────────────────────────────────────── */
const CardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
    <div className="aspect-square bg-gray-100 animate-pulse" />
    <div className="p-3 space-y-2">
      <div className="h-3 w-full rounded bg-gray-100 animate-pulse" />
      <div className="h-3 w-2/3 rounded bg-gray-100 animate-pulse" />
      <div className="h-4 w-20 rounded bg-red-100 animate-pulse" />
    </div>
  </div>
);

const SubcategoryProductSection = ({ apiEndpoint, allProductsLink, bgLight = false }) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("");
  const [priceRange, setPriceRange] = useState([0, 250000]);
  const navigate = useNavigate();

  // ── Fetch (ORIGINAL LOGIC — UNTOUCHED) ──────────────────────────
  useEffect(() => {
    setLoading(true);
    api
      .get(apiEndpoint)
      .then((response) => {
        console.log(`SubcategoryProductSection fetched from ${apiEndpoint}:`, response.data);
        const {
          subcategoryId,
          subcategoryName,
          subcategoryImage,
          products: prods,
        } = response.data;
        setSelectedSubcategory({ subcategoryId, subcategoryName, subcategoryImage });
        setProducts(prods || []);
      })
      .catch((error) => {
        console.error(`SubcategoryProductSection error for ${apiEndpoint}:`, error.message);
      })
      .finally(() => setLoading(false));
  }, [apiEndpoint]);

  // ── Filter / Sort (ORIGINAL LOGIC — UNTOUCHED) ───────────────────
  const filteredProducts = (products || [])
    .filter((product) => {
      if (!Array.isArray(product.variants) || product.variants.length === 0)
        return false;
      const price = product.variants[0]?.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    })
    .filter(
      (product) =>
        Array.isArray(product.variants) &&
        product.variants.some((variant) => variant.stock > 0)
    );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.variants?.[0]?.price || 0;
    const priceB = b.variants?.[0]?.price || 0;
    return sortOrder === "asc"
      ? priceA - priceB
      : sortOrder === "desc"
        ? priceB - priceA
        : 0;
  });

  const getFirstAvailableVariant = (variants) =>
    variants.find((v) => v.stock > 0) || null;

  const handleProductClick = (productId, productName) => {
    navigate(`/product/${productId}?name=${encodeURIComponent(productName)}`);
  };

  if (
    !selectedSubcategory?.subcategoryId ||
    !Array.isArray(products) ||
    products.length === 0
  ) {
    // Show skeleton while initial fetch is still in-flight so the section
    // is visible (prevents the section from being silently absent on load)
    if (loading) {
      const bgClass = bgLight ? "bg-white" : "bg-gradient-to-br from-gray-50 to-red-50/20";
      return (
        <section className={`py-10 sm:py-14 ${bgClass}`}>
          <div className="container-main">
            <div className="h-7 w-52 bg-gray-100 animate-pulse rounded-lg mb-8" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
          </div>
        </section>
      );
    }
    console.warn(`SubcategoryProductSection: Not rendering - apiEndpoint: ${apiEndpoint}, subcategoryId: ${selectedSubcategory?.subcategoryId}, products: ${products?.length || 0}`);
    return null;
  }

  // Show 8 products on homepage
  const displayedProducts = sortedProducts.slice(0, 8);

  const bgClass = bgLight
    ? "bg-white"
    : "bg-gradient-to-br from-gray-50 to-red-50/20";

  return (
    <section className={`relative py-10 sm:py-14 overflow-hidden ${bgClass}`}>
      <div className="container-main">

        {/* ── Section Header ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex items-center gap-1">
                <div className="w-1 h-5 bg-[#B91C1C] rounded-full" />
                <div className="w-1 h-3 bg-[#B91C1C]/40 rounded-full" />
              </div>
              <span className="text-[10.5px] font-black uppercase tracking-[0.2em] text-[#B91C1C]">
                Shop Now
              </span>
            </div>
            <h2 className="font-black text-2xl sm:text-3xl text-gray-900 leading-tight">
              {selectedSubcategory.subcategoryName}
            </h2>
            <p className="text-gray-400 text-sm font-medium mt-1">
              {sortedProducts.length} products available
            </p>
          </div>
          {allProductsLink && sortedProducts.length > 0 && (
            <button
              onClick={() =>
                navigate(`/products/subcategory/${selectedSubcategory.subcategoryId}`)
              }
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-[#B91C1C] text-white text-sm font-bold rounded-full shadow-md hover:bg-red-700 hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              See All <ChevronRight size={15} />
            </button>
          )}
        </div>

        {/* ── Filters Row ────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 mb-7 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
          {/* Top row: label + sort */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-gray-500 text-sm flex-shrink-0">
              <SlidersHorizontal size={15} />
              <span className="hidden xs:inline font-semibold">Filters</span>
            </div>
            <select
              className="flex-1 sm:max-w-[200px] h-9 sm:h-10 px-3 text-sm font-semibold text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-[#B91C1C] focus:ring-2 focus:ring-red-100 transition-all cursor-pointer"
              onChange={(e) => setSortOrder(e.target.value)}
              value={sortOrder}
            >
              <option value="">Sort by price</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>

          {/* Price range row */}
          <div className="flex items-center gap-3 w-full">
            <span className="text-[11px] font-bold text-gray-500 whitespace-nowrap flex-shrink-0">Price</span>
            <div className="relative flex items-center flex-1 min-w-0" style={{ height: "18px" }}>
              <div className="absolute w-full h-[2px] rounded-full bg-gray-200" />
              <div
                className="absolute h-[2px] rounded-full bg-[#B91C1C]"
                style={{
                  left: `${(priceRange[0] / 250000) * 100}%`,
                  right: `${100 - (priceRange[1] / 250000) * 100}%`,
                }}
              />
              <input
                type="range" min={0} max={250000} step={100}
                value={priceRange[0]}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), priceRange[1] - 100);
                  setPriceRange([val, priceRange[1]]);
                }}
                className="absolute w-full appearance-none bg-transparent cursor-pointer range-thumb-sm"
                style={{ zIndex: priceRange[0] > 240000 ? 5 : 3, height: "2px" }}
              />
              <input
                type="range" min={0} max={250000} step={100}
                value={priceRange[1]}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), priceRange[0] + 100);
                  setPriceRange([priceRange[0], val]);
                }}
                className="absolute w-full appearance-none bg-transparent cursor-pointer range-thumb-sm"
                style={{ zIndex: 4, height: "2px" }}
              />
            </div>
            <span className="text-[11px] font-black text-[#B91C1C] whitespace-nowrap flex-shrink-0">
              ₹{priceRange[0].toLocaleString("en-IN")}–₹{priceRange[1].toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* ── Product Grid ───────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {displayedProducts.map((product) => {
              const variant = getFirstAvailableVariant(product.variants || []);
              const imageUrl =
                variant?.images?.[0]?.startsWith("https")
                  ? variant.images[0]
                  : variant?.images?.[0] || logo;
              const priceWithGst =
                variant?.price_with_gst || variant?.price || null;
              const priceWithoutGst = variant?.price || null;
              const discount =
                variant?.discount_percentage || null;

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm cursor-pointer relative transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#B91C1C]/20"
                  onClick={() => handleProductClick(product.id, product.name)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    handleProductClick(product.id, product.name)
                  }
                >
                  {/* Discount badge */}
                  {discount && Number(discount) > 0 && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="inline-flex items-center px-2.5 py-1 bg-[#B91C1C] text-white text-[9px] font-black rounded-full shadow-md">
                        -{discount}%
                      </span>
                    </div>
                  )}

                  {/* Image */}
                  <div
                    className="relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
                    style={{ aspectRatio: "1/1" }}
                  >
                    <img
                      loading="lazy"
                      src={imageUrl}
                      alt={variant?.name || product.name}
                      className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = logo;
                      }}
                    />
                    {/* Quick view overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-900 text-[10px] font-bold rounded-full shadow-md uppercase tracking-wide">
                        <Eye size={10} /> View
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 text-xs sm:text-sm leading-snug line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      {priceWithGst && (
                        <span className="font-black text-[#B91C1C] text-sm sm:text-base">
                          ₹{Number(priceWithGst).toLocaleString("en-IN")}
                        </span>
                      )}
                      {priceWithoutGst && priceWithGst && priceWithoutGst !== priceWithGst && (
                        <span className="text-gray-400 text-xs line-through">
                          ₹{Number(priceWithoutGst).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-14 text-gray-400">
            <p className="text-lg font-semibold">No products found in this range.</p>
          </div>
        )}

        {/* ── Show More ──────────────────────────────────────────── */}
        {allProductsLink && sortedProducts.length > 8 && (
          <div className="text-center mt-10">
            <button
              onClick={() =>
                navigate(`/products/subcategory/${selectedSubcategory.subcategoryId}`)
              }
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white border-2 border-[#B91C1C] text-[#B91C1C] font-bold text-sm rounded-full hover:bg-[#B91C1C] hover:text-white transition-all duration-200 shadow-sm hover:shadow-lg hover:scale-105"
            >
              View All {sortedProducts.length} Products
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SubcategoryProductSection;
