/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProductList } from "./hooks/useProductList";
import { ProductGrid } from "./components/common/ProductGrid";
import logo from "./images/piclogo.png";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, TrendingUp } from "lucide-react";

const MostsellingAll = () => {
  const navigate = useNavigate();
  const { filteredProducts, loading, getFirstAvailableVariant } = useProductList(
    "/product/most_selling",
    "mostSelling"
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

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
        className="group bg-white rounded-2xl overflow-hidden cursor-pointer relative border border-red-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-red-200 h-[380px] flex flex-col"
      >
        {/* Image */}
        <div
          className="relative bg-gradient-to-br from-gray-50 to-red-50/30 overflow-hidden flex-shrink-0"
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
        </div>

        {/* Body */}
        <div className="p-3 sm:p-3.5 flex flex-col flex-grow">
          {subcatName && (
            <p className="text-[9px] sm:text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1 line-clamp-1">
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

  return (
    <div className="min-h-screen bg-cream-100">
      <Helmet>
        <title>Best Sellers | Kitchenary Kart</title>
        <meta
          name="description"
          content="Browse the most selling kitchen products and HORECA supplies at Kitchenary Kart."
        />
        <link rel="canonical" href="https://www.kitchenarykart.com/most-selling-all" />
        <meta property="og:title" content="Most Selling Products | Kitchenary Kart" />
        <meta property="og:url" content="https://www.kitchenarykart.com/most-selling-all" />
      </Helmet>

      <div className="container-main py-8">
        {/* Page header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-stone-200 bg-white text-stone-500 hover:border-brand hover:text-brand transition-colors shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand mb-1">
              Most Ordered
            </p>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-charcoal flex items-center gap-2">
              <TrendingUp size={24} className="text-brand" />
              Best Sellers
            </h1>
          </div>
        </div>

        {/* Grid */}
        <ProductGrid
          products={filteredProducts}
          loading={loading}
          onProductClick={handleProductClick}
          getFirstAvailableVariant={getFirstAvailableVariant}
          renderProduct={renderProduct}
          cols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          emptyMessage="No best sellers available"
        />
      </div>
    </div>
  );
};

export default MostsellingAll;