/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import api from "./utils/api";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import logo from "./images/piclogo.png";
import { StarRating } from "./components/common/StarRating";

/* ✅ REUSABLE PRODUCT CARD (WITH VARIANTS) */
/* ✅ REUSABLE PRODUCT CARD (WITH VARIANTS) */
const ProductCard = ({ product, ratings }) => {
  const navigate = useNavigate();

  const [selectedDimension, setSelectedDimension] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Get options
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

  // Get selected variant
  const getSelectedVariant = () => {
    const variants = product.variants || [];

    return (
      variants.find(
        (v) =>
          (!selectedDimension || v.otherDimensions === selectedDimension) &&
          (!selectedColor || v.color === selectedColor) &&
          v.stock > 0,
      ) ||
      variants.find((v) => v.stock > 0) ||
      null
    );
  };

  const { dimensions, colors } = getVariantOptions(product.variants || []);
  const variant = getSelectedVariant();

  const imageUrl = variant?.images?.[0]?.startsWith("https")
    ? variant.images[0]
    : variant?.images?.[0] || logo;

  const price = variant?.price_with_gst || variant?.price || null;
  const ratingValue = variant ? ratings?.[variant.id] : null;

  return (
    <div
      className="cursor-pointer group"
      onClick={() =>
        navigate(`/product/${product.id}?variant=${variant?.id || ""}`)
      }
    >
      {/* IMAGE */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300">
        <div className="aspect-square flex items-center justify-center p-4">
          <img
            src={imageUrl}
            alt={product.name}
            onError={(e) => (e.target.src = logo)}
            className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
          />
        </div>
      </div>

      {/* INFO */}
      <div className="mt-2 text-center">
        <p className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px]">
          {product.name}
        </p>

        {ratingValue && (
          <div className="mt-1 flex justify-center">
            <StarRating rating={ratingValue} size={12} />
          </div>
        )}

        {price && (
          <p className="text-sm font-bold text-black mt-1">
            ₹ {Number(price).toLocaleString("en-IN")}
          </p>
        )}

        {/* ✅ VARIANT DROPDOWN */}
        {(dimensions.length > 0 || colors.length > 0) && (
          <select
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              const value = e.target.value;

              if (dimensions.includes(value)) setSelectedDimension(value);
              if (colors.includes(value)) setSelectedColor(value);
            }}
            className="mt-2 text-xs border border-gray-300 rounded-full px-2 py-1"
          >
            <option value="">
              {dimensions.length > 0 && colors.length > 0
                ? "Select Dimension / Color"
                : dimensions.length > 0
                  ? "Select Dimension"
                  : "Select Color"}
            </option>

            {dimensions.length > 0 && (
              <optgroup label="Dimension">
                {dimensions.map((d, i) => (
                  <option key={i} value={d}>
                    {d}
                  </option>
                ))}
              </optgroup>
            )}

            {colors.length > 0 && (
              <optgroup label="Color">
                {colors.map((color, i) => (
                  <option key={i} value={color}>
                    {color}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        )}
      </div>
    </div>
  );
};

/* ✅ MAIN COMPONENT */
const HomeNewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [ratings, setRatings] = useState({});

  useEffect(() => {
    api
      .get("/product/new_arrivals")
      .then((res) => {
        const data = res.data || [];
        setProducts(data);

        data.forEach((p) =>
          p.variants?.forEach((v) => fetchVariantReviews(v.id)),
        );
      })
      .catch((err) => console.error("Fetch failed", err))
      .finally(() => setLoading(false));
  }, []);

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

  const visibleProducts = products.slice(0, 8);

  return (
    <div className="bg-white min-h-screen">
      {/* HERO */}
      <section className="relative h-[320px] sm:h-[420px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1600&q=80"
          alt="New Arrivals"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />

        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-white text-3xl sm:text-5xl font-black mb-3">
              Latest Additions
            </h1>
            <p className="text-white/70 text-sm sm:text-base mb-5">
              Fresh products just added to our collection
            </p>

            <button
              onClick={() => navigate("/new-arrivals")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Explore Now
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="py-10 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white border border-gray-200 rounded-xl aspect-square bg-gray-200" />
                  <div className="mt-2 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No new arrivals found.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  ratings={ratings}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomeNewArrivals;
