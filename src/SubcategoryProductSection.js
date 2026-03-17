import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./utils/api";
import logo from "./images/piclogo.png";
import { ArrowRight, Eye, ChevronRight } from "lucide-react";

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

        setProducts(prods || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [apiEndpoint]);

  // ✅ Only keep valid products with stock
  const validProducts = (products || []).filter(
    (product) =>
      Array.isArray(product.variants) &&
      product.variants.some((variant) => variant.stock > 0)
  );

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

  // ✅ Show only 8 (no sorting/filtering)
  const displayedProducts = validProducts.slice(0, 8);

  const bgClass = bgLight
    ? "bg-white"
    : "bg-gradient-to-br from-gray-50 to-red-50/20";

  return (
    <section className={`relative py-10 sm:py-14 overflow-hidden ${bgClass}`}>
      <div className="w-full px-4 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 sm:mb-8">
          <div>
            <h2 className="font-black text-2xl sm:text-3xl text-gray-900">
              {selectedSubcategory.subcategoryName}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {validProducts.length} products available
            </p>
          </div>

          {/* {allProductsLink && validProducts.length > 0 && (
            <button
  onClick={() =>
    navigate(`/products/subcategory/${selectedSubcategory.subcategoryId}`)
  }
  className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition"
>
  See All <ChevronRight size={15} />
</button>
          )} */}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(8)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {displayedProducts.map((product) => {
              const variant = getFirstAvailableVariant(product.variants || []);
              const imageUrl =
                variant?.images?.[0]?.startsWith("https")
                  ? variant.images[0]
                  : variant?.images?.[0] || logo;

              const price = variant?.price_with_gst || variant?.price || null;
              const discount = variant?.discount_percentage || null;

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer hover:shadow-lg transition"
                  onClick={() => handleProductClick(product.id, product.name)}
                >
                  {/* Discount */}
                  {discount && Number(discount) > 0 && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="px-2 py-1 bg-[#B91C1C] text-white text-xs rounded-full">
                        -{discount}%
                      </span>
                    </div>
                  )}

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
                  <div className="p-3">
                    <p className="text-sm font-medium line-clamp-2">
                      {product.name}
                    </p>
                    {price && (
                      <p className="text-[#B91C1C] font-bold mt-1">
                        ₹{Number(price).toLocaleString("en-IN")}
                      </p>
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
                navigate(`/products/subcategory/${selectedSubcategory.subcategoryId}`)
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