import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./utils/api";
import logo from "./images/piclogo.png";
import { ArrowRight } from "lucide-react";
import { StarRating } from "./components/common/StarRating";

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

const SubcategoryProductSection = ({
  apiEndpoint,
  allProductsLink,
  bgLight = false,
}) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [ratings, setRatings] = useState({});

  // ✅ store selected variants per product
  const [selectedVariants, setSelectedVariants] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .get(apiEndpoint)
      .then((response) => {
        const {
          subcategoryId,
          subcategoryName,
          subcategoryImage,
          products: prods,
        } = response.data;

        setSelectedSubcategory({
          subcategoryId,
          subcategoryName,
          subcategoryImage,
        });

        const safeProducts = prods || [];
        setProducts(safeProducts);

        safeProducts.forEach((product) =>
          product.variants?.forEach((v) => fetchVariantReviews(v.id)),
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [apiEndpoint]);

  const validProducts = (products || []).filter(
    (product) =>
      Array.isArray(product.variants) &&
      product.variants.some((v) => v.stock > 0),
  );

  const getFirstAvailableVariant = (variants) =>
    variants.find((v) => v.stock > 0) || null;

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
      // ignore rating errors
    }
  };

  // ✅ UPDATED → otherDimensions instead of size
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

  // ✅ UPDATED → match otherDimensions
  const findVariant = (variants, variation, color) => {
    return (
      variants.find(
        (v) =>
          (variation ? v.otherDimensions === variation : true) &&
          (color ? v.color === color : true) &&
          v.stock > 0,
      ) || getFirstAvailableVariant(variants)
    );
  };

  const handleVariantChange = (productId, field, value) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleProductClick = (product) => {
    const selected = selectedVariants[product.id] || {};
    const variant = findVariant(
      product.variants,
      selected.variation,
      selected.color,
    );

    navigate(
      `/product/${product.id}?name=${encodeURIComponent(
        product.name,
      )}&variantId=${variant?.id || ""}`,
    );
  };

  if (
    !selectedSubcategory?.subcategoryId ||
    !Array.isArray(products) ||
    products.length === 0
  ) {
    if (loading) {
      const bgClass = bgLight
        ? "bg-white"
        : "bg-gradient-to-br from-gray-50 to-red-50/20";

      return (
        <section className={`py-10 sm:py-14 ${bgClass}`}>
          <div className="w-full px-4 lg:px-8">
            <div className="h-7 w-52 bg-gray-100 animate-pulse rounded-lg mb-8" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(8)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      );
    }
    return null;
  }

  const displayedProducts = validProducts.slice(0, 8);

  const bgClass = bgLight
    ? "bg-white"
    : "bg-gradient-to-br from-gray-50 to-red-50/20";

  return (
    <section className={`relative py-10 sm:py-14 overflow-hidden ${bgClass}`}>
      <div className="w-full px-4 lg:px-8">
        {/* Header */}
        <div className="flex justify-between mb-7 sm:mb-8">
          <div>
            <h2 className="font-black text-2xl sm:text-3xl text-gray-900">
              {selectedSubcategory.subcategoryName}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {validProducts.length} products available
            </p>
          </div>
        </div>

        {/* GRID */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(8)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {displayedProducts.map((product) => {
              const selected = selectedVariants[product.id] || {};

              const variant = findVariant(
                product.variants,
                selected.variation,
                selected.color,
              );

              const { variations, colors } = getVariantOptions(
                product.variants || [],
              );

              const imageUrl = variant?.images?.[0]?.startsWith("https")
                ? variant.images[0]
                : variant?.images?.[0] || logo;

              const price = variant?.price_with_gst || variant?.price || null;
              const ratingValue = variant ? ratings?.[variant.id] : null;

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer hover:shadow-lg transition p-2"
                  onClick={() => handleProductClick(product)}
                >
                  {/* Image */}
                  <div className="aspect-square bg-white">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain p-3"
                      onError={(e) => (e.target.src = logo)}
                    />
                  </div>

                  {/* Info */}
                  <div className="p-2">
                    <p className="text-sm font-medium line-clamp-2">
                      {product.name}
                    </p>

                    {ratingValue && (
                      <div className="mt-1">
                        <StarRating rating={ratingValue} size={12} />
                      </div>
                    )}

                    {price && (
                      <div className="flex items-center justify-between gap-2 mt-auto">
                        <p className="font-black text-[#B91C1C] text-sm sm:text-base">
                          ₹{Number(price).toLocaleString("en-IN")}
                        </p>

                        {/* ✅ CLEAN DROPDOWN (NO LABELS) */}
                        {(variations.length > 0 || colors.length > 0) && (
                          <select
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              const value = e.target.value;

                              if (variations.includes(value)) {
                                handleVariantChange(
                                  product.id,
                                  "variation",
                                  value,
                                );
                              } else if (colors.includes(value)) {
                                handleVariantChange(product.id, "color", value);
                              }
                            }}
                            className="text-[10px] sm:text-xs border border-gray-200 rounded-full px-2 py-1 bg-white focus:outline-none focus:border-amber-400"
                          >
                            <option value="">Select</option>

                            {/* variations */}
                            {variations.map((v, i) => (
                              <option key={`variation-${i}`} value={v}>
                                {v}
                              </option>
                            ))}

                            {/* colors */}
                            {colors.map((c, i) => (
                              <option key={`color-${i}`} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-14 text-gray-400">
            No products found.
          </div>
        )}

        {/* Show More */}
        {allProductsLink && validProducts.length > 8 && (
          <div className="text-center mt-10">
            <button
              onClick={() =>
                navigate(
                  `/products/subcategory/${selectedSubcategory.subcategoryId}`,
                )
              }
              className="px-6 py-3 border border-[#B91C1C] text-[#B91C1C] rounded-full"
            >
              View All {validProducts.length} Products
              <ArrowRight size={14} className="inline ml-1" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SubcategoryProductSection;
