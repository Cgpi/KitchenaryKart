/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProductList } from "./hooks/useProductList";
import logo from "./images/piclogo.png";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { StarRating } from "./components/common/StarRating";
import api from "./utils/api";

/* ⭐ PRODUCT CARD */
const ProductCard = ({ product, onClick, getVariant, ratings }) => {
  const [selectedVariation, setSelectedVariation] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const variants = product.variants || [];

  // ✅ Extract options
  const getVariantOptions = (variants = []) => {
    const variations = new Set();
    const colors = new Set();

    variants.forEach((v) => {
      if (v.otherDimensions) variations.add(v.otherDimensions);
      if (v.color) colors.add(v.color);
    });

    return {
      variations: Array.from(variations),
      colors: Array.from(colors),
    };
  };

  const { variations, colors } = getVariantOptions(variants);

  // ✅ Dynamic variant selection
  const variant =
    variants.find(
      (v) =>
        (!selectedVariation || v.otherDimensions === selectedVariation) &&
        (!selectedColor || v.color === selectedColor) &&
        v.stock > 0,
    ) || getVariant(variants);

  const images = variant?.images?.length > 0 ? variant.images : [logo];

  const price = variant?.price_with_gst || variant?.price || null;
  const subcatName =
    product.subcategories?.length > 0 ? product.subcategories[0].name : "";

  const ratingValue = variant ? ratings?.[variant.id] : null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const startX = useRef(0);

  // 🔁 Reset image when variant changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [variant]);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  /* Swipe */
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    const diff = e.touches[0].clientX - startX.current;

    if (Math.abs(diff) > 50) {
      if (diff < 0) nextImage(e);
      else prevImage(e);
      startX.current = e.touches[0].clientX;
    }
  };

  return (
    <div onClick={onClick} className="cursor-pointer group">
      {/* IMAGE */}
      <div
        className="relative aspect-square bg-white mb-3 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <img
          src={images[currentIndex]}
          className="w-full h-full object-contain p-4 transition duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = logo;
          }}
        />

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md w-8 h-12 items-center justify-center"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={nextImage}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md w-8 h-12 items-center justify-center"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* TEXT */}
      {subcatName && (
        <p className="text-[10px] font-semibold text-gray-500 uppercase mb-1 line-clamp-1">
          {subcatName}
        </p>
      )}

      <p className="text-sm font-medium line-clamp-2">{product.name}</p>

      {ratingValue && (
        <div className="mt-1">
          <StarRating rating={ratingValue} size={12} />
        </div>
      )}

      {price && (
        <div className="flex items-center justify-between gap-2 mt-1">
          <p className="font-semibold text-gray-900">
            ₹{Number(price).toLocaleString("en-IN")}
          </p>

          {/* ✅ WORKING DROPDOWN */}
          {(variations.length > 0 || colors.length > 0) && (
            <select
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                const value = e.target.value;

                if (variations.includes(value)) setSelectedVariation(value);
                if (colors.includes(value)) setSelectedColor(value);
              }}
              className="text-[10px] sm:text-xs border border-gray-200 rounded-full px-2 py-1 bg-white focus:outline-none focus:border-amber-400"
            >
              <option value="">
                {variations.length > 0 && colors.length > 0
                  ? "Select Option"
                  : variations.length > 0
                    ? "Select Variation"
                    : "Select Color"}
              </option>

              {/* ✅ Variations */}
              {variations.map((v, i) => (
                <option key={`variation-${i}`} value={v}>
                  {v}
                </option>
              ))}

              {/* ✅ Colors */}
              {colors.map((color, i) => (
                <option key={`color-${i}`} value={color}>
                  {color}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>
  );
};

/* ⭐ MAIN PAGE */
const MostsellingAll = () => {
  const navigate = useNavigate();
  const { filteredProducts, loading, getFirstAvailableVariant } =
    useProductList("/product/most_selling", "mostSelling");

  const [ratings, setRatings] = useState({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    filteredProducts.forEach((product) =>
      product.variants?.forEach((v) => fetchVariantReviews(v.id)),
    );
  }, [filteredProducts]);

  const fetchVariantReviews = async (variantId) => {
    try {
      const { data } = await api.get(`/Reviews/variant/${variantId}`);
      if (Array.isArray(data) && data.length) {
        const avg =
          data.reduce((s, r) => s + (r.rating || 0), 0) / data.length;
        setRatings((prev) => ({
          ...prev,
          [variantId]: avg,
        }));
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>Best Sellers | Kitchenary Kart</title>
      </Helmet>

      <div className="w-full px-6 md:px-10 lg:px-16 pt-6">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl flex items-center justify-center border bg-white shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Most Ordered
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
              <TrendingUp size={22} />
              Best Sellers
            </h1>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="w-full px-6 md:px-10 lg:px-16 pb-10">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[250px] bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                getVariant={getFirstAvailableVariant}
                ratings={ratings}
                onClick={() =>
                  navigate(
                    `/product/${product.id}?name=${encodeURIComponent(
                      product.name,
                    )}`,
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MostsellingAll;
