/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProductList } from "./hooks/useProductList";
import logo from "./images/piclogo.png";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";

/* ⭐ PRODUCT CARD */
const ProductCard = ({ product, getVariant, onClick }) => {
  const [selectedDimension, setSelectedDimension] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const getVariantOptions = (variants = []) => {
    const dimensions = new Set();
    const colors = new Set();

    variants.forEach((v) => {
      if (v.otherDimensions) dimensions.add(v.otherDimensions);
      if (v.color) colors.add(v.color);
    });

    return {
      dimensions: Array.from(dimensions),
      colors: Array.from(colors),
    };
  };

  const findVariant = (variants, dimension, color) => {
    return (
      variants.find(
        (v) =>
          (dimension ? v.otherDimensions === dimension : true) &&
          (color ? v.color === color : true) &&
          v.stock > 0,
      ) || getVariant(variants)
    );
  };

  const variant = findVariant(
    product.variants || [],
    selectedDimension,
    selectedColor,
  );

  const images =
    variant?.images?.length > 0
      ? variant.images.map((img) => (img.startsWith("https") ? img : img))
      : [logo];

  const price = variant?.price_with_gst || variant?.price || null;
  const subcatName =
    product.subcategories?.length > 0 ? product.subcategories[0].name : "";

  const { dimensions, colors } = getVariantOptions(product.variants || []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(0);
  const startX = useRef(0);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => {
      const next = prev === images.length - 1 ? 0 : prev + 1;
      setLastIndex(next);
      return next;
    });
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => {
      const next = prev === 0 ? images.length - 1 : prev - 1;
      setLastIndex(next);
      return next;
    });
  };

  const handleEnter = () => {
    if (lastIndex !== 0) setCurrentIndex(lastIndex);
    else if (images[1]) setCurrentIndex(1);
  };

  const handleLeave = () => setCurrentIndex(0);

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
    <div
      onClick={() => onClick(product, variant)}
      className="cursor-pointer group"
    >
      {/* IMAGE */}
      <div
        className="relative aspect-square bg-white-100 mb-3 overflow-hidden"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
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

        {/* MOBILE PROGRESS */}
        {images.length > 1 && (
          <div className="md:hidden absolute bottom-0 left-0 w-full px-3">
            <div className="w-full h-[2px] bg-gray-200 flex">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-full flex-1 ${
                    i === currentIndex ? "bg-gray-800" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* DESKTOP ARROWS */}
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

      {price && (
        <div className="flex items-center justify-between gap-2 mt-1">
          <p className="font-semibold text-gray-900">
            ₹{Number(price).toLocaleString("en-IN")}
          </p>

          {/* ✅ WORKING DROPDOWN */}
          {(dimensions.length > 0 || colors.length > 0) && (
            <div className="mt-2" onClick={(e) => e.stopPropagation()}>
              <select
                className="text-xs border rounded px-2 py-1 w-full"
                value={selectedDimension || selectedColor || ""}
                onChange={(e) => {
                  const value = e.target.value;

                  if (dimensions.includes(value)) {
                    setSelectedDimension(value);
                  } else {
                    setSelectedColor(value);
                  }
                }}
              >
                <option value="">
                  {colors.length > 0 ? "Select Color" : "Select Dimension"}
                </option>

                {colors.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}

                {dimensions.map((d, i) => (
                  <option key={i} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AllNewArrivals = () => {
  const navigate = useNavigate();
  const { filteredProducts, loading, getFirstAvailableVariant } =
    useProductList("/product/new_arrivals");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleClick = (product, variant) => {
    navigate(
      `/product/${product.id}?name=${encodeURIComponent(
        product.name,
      )}&variantId=${variant?.id || ""}`,
    );
  };

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>New Arrivals | Kitchenary Kart</title>
      </Helmet>

      <div className="w-full px-6 md:px-10 lg:px-16 pt-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl flex items-center justify-center border bg-white shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <p className="text-xs font-bold uppercase text-gray-500 mb-1">
              Just Dropped
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
              <TrendingUp size={22} />
              New Arrivals
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
                onClick={handleClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllNewArrivals;
