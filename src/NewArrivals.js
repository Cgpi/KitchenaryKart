/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useProductList } from "./hooks/useProductList";
import { ProductCarousel } from "./components/common/ProductCarousel";
import logo from "./images/piclogo.png";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Eye } from "lucide-react";

const NewArrivalProductList = () => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  
  // Use centralized hook
  const { filteredProducts, loading, getFirstAvailableVariant } = useProductList(
    "/product/new_arrivals"
  );

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}?name=${encodeURIComponent(product.name)}`);
  };

  const renderProduct = (product, getVariant) => {
    const variant = getVariant(product.variants || []);
    const imageUrl =
      variant?.images?.[0]?.startsWith("https")
        ? variant.images[0]
        : variant?.images?.[0] || logo;
    const price = variant?.price_with_gst || variant?.price || null;
    const subcatName =
      product.subcategories?.length > 0
        ? product.subcategories[0].name
        : "";

    return (
      <div
        className="group bg-white rounded-2xl overflow-hidden cursor-pointer relative border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-amber-200 flex flex-col h-[380px]"
      >
        {/* New badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] font-black uppercase tracking-wide rounded-full shadow-md">
            <Sparkles size={8} /> New
          </span>
        </div>

        {/* Image */}
        <div
          className="relative bg-gradient-to-br from-gray-50 to-amber-50/30 overflow-hidden flex-shrink-0"
          style={{ aspectRatio: "1/1" }}
        >
          <img
            loading="lazy"
            src={imageUrl}
            alt={variant?.name || product.name}
            className="w-full h-full transition-transform duration-500 group-hover:scale-110"
            style={{ objectFit: "contain", padding: "14px" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = logo;
            }}
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.04] transition-colors duration-300 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-900 text-[10px] font-bold rounded-full shadow-md uppercase tracking-wide">
              <Eye size={10} /> View
            </span>
          </div>
        </div>

        {/* Body - grows to fill remaining space */}
        <div className="p-3 sm:p-3.5 flex flex-col flex-grow">
          {subcatName && (
            <p className="text-[9px] sm:text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1 line-clamp-1">
              {subcatName}
            </p>
          )}
          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm leading-snug line-clamp-2 mb-2 flex-grow">
            {product.name}
          </h3>
          {price && (
            <p className="font-black text-[#B91C1C] text-sm sm:text-base mt-auto">
              ₹{Number(price).toLocaleString("en-IN")}
            </p>
          )}
        </div>
      </div>
    );
  };

  if (!loading && filteredProducts.length === 0) return null;

  return (
    <section className="relative py-12 sm:py-16 overflow-hidden bg-white">
      {/* Top diagonal accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-[#B91C1C] to-amber-400" />

      <div className="container-main relative">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div className="flex items-start gap-3">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-200">
              <Sparkles size={22} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-500 mb-1">
                Fresh Stock
              </p>
              <h2 className="font-black text-2xl sm:text-3xl text-gray-900 leading-tight">
                New <span className="text-[#B91C1C]">Arrivals</span>
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-gray-200 text-gray-500 bg-white shadow-sm hover:border-amber-400 hover:text-amber-500 hover:shadow-md transition-all duration-200"
              aria-label="Previous"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-gray-200 text-gray-500 bg-white shadow-sm hover:border-amber-400 hover:text-amber-500 hover:shadow-md transition-all duration-200"
              aria-label="Next"
            >
              <ChevronRight size={16} />
            </button>
            <Link
              to="/new-arrivals"
              className="hidden sm:inline-flex items-center gap-1.5 ml-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              See All <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Carousel */}
        <ProductCarousel
          ref={sliderRef}
          products={filteredProducts}
          loading={loading}
          onProductClick={handleProductClick}
          getFirstAvailableVariant={getFirstAvailableVariant}
          renderProduct={renderProduct}
        />
      </div>
    </section>
  );
};

export default NewArrivalProductList;
