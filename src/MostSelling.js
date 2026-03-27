import React, { useEffect, useState } from "react";
import api from "./utils/api";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import logo from "./images/piclogo.png";

/* ✅ PRODUCT CARD (CLEAN + REUSABLE) */
const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const [selectedVariation, setSelectedVariation] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // ✅ Extract options
  const getVariantOptions = (variants = []) => {
    const variations = new Set();
    const colors = new Set();

    variants.forEach((v) => {
      if (v.variation) variations.add(v.variation);
      if (v.color) colors.add(v.color);
    });

    return {
      variations: Array.from(variations),
      colors: Array.from(colors),
    };
  };

  // ✅ Find correct variant
  const getSelectedVariant = () => {
    const variants = product.variants || [];

    return (
      variants.find(
        (v) =>
          (!selectedVariation || v.variation === selectedVariation) &&
          (!selectedColor || v.color === selectedColor) &&
          v.stock > 0,
      ) ||
      variants.find((v) => v.stock > 0) ||
      null
    );
  };

  const { variations, colors } = getVariantOptions(product.variants || []);
  const variant = getSelectedVariant();

  const imageUrl = variant?.images?.[0]?.startsWith("https")
    ? variant.images[0]
    : variant?.images?.[0] || logo;

  const price = variant?.price_with_gst || variant?.price || null;

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

        {price && (
          <p className="text-sm font-bold text-black mt-1">
            ₹ {Number(price).toLocaleString("en-IN")}
          </p>
        )}

        {/* ✅ VARIANT DROPDOWN */}
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
    </div>
  );
};

/* ✅ MAIN COMPONENT */
const MostSellingProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/product/most_selling")
      .then((res) => setProducts(res.data || []))
      .catch((err) => console.error("Fetch failed", err))
      .finally(() => setLoading(false));
  }, []);

  const visibleProducts = products.slice(0, 8);

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative h-[320px] sm:h-[420px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&w=1600&q=80"
          alt="Most Selling Products"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-white text-3xl sm:text-5xl font-semibold mb-3">
              Best Sellers
            </h1>
            <p className="text-white/80 text-sm sm:text-base mb-6 max-w-xl mx-auto">
              Explore our most popular products trusted by professionals every
              day
            </p>

            <button
              onClick={() => navigate("/most-selling-all")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Explore Products
              <ArrowRight size={16} />
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
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="aspect-square bg-gray-200" />
                  </div>
                  <div className="mt-2 space-y-2 text-center">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No products found.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MostSellingProductList;
