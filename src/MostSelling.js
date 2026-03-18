// /* eslint-disable jsx-a11y/img-redundant-alt */
// import React, { useRef } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useProductList } from "./hooks/useProductList";
// import { ProductCarousel } from "./components/common/ProductCarousel";
// import logo from "./images/piclogo.png";
// import { ChevronLeft, ChevronRight, ArrowRight, Flame, Eye } from "lucide-react";

// const MostSellingProductList = () => {
//   const navigate = useNavigate();
//   const sliderRef = useRef(null);

//   // Use centralized hook with cache key
//   const { filteredProducts, loading, getFirstAvailableVariant } = useProductList(
//     "/product/most_selling",
//     "mostSelling"
//   );

//   const handleProductClick = (product) => {
//     navigate(`/product/${product.id}?name=${encodeURIComponent(product.name)}`);
//   };

//   const renderProduct = (product, getVariant) => {
//     const variant = getVariant(product.variants || []);
//     const imageUrl =
//       variant?.images?.[0]?.startsWith("https")
//         ? variant.images[0]
//         : variant?.images?.[0] || logo;
//     const price = variant?.price_with_gst || variant?.price || null;
//     const subcatName =
//       product.subcategories?.length > 0
//         ? product.subcategories[0].name
//         : "";

//     return (
//       <div
//         className="group bg-white rounded-2xl overflow-hidden cursor-pointer relative border border-red-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-red-200 flex flex-col h-[380px]"
//       >
//         {/* Hot badge */}
//         <div className="absolute top-2.5 left-2.5 z-10">
//           <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#B91C1C] text-white text-[9px] font-black uppercase tracking-wide rounded-full shadow-md">
//             <Flame size={8} fill="white" /> Hot
//           </span>
//         </div>

//         {/* Image */}
//         <div
//           className="relative bg-gradient-to-br from-gray-50 to-red-50/30 overflow-hidden flex-shrink-0 aspect-square"
//         >
//           <img
//             loading="lazy"
//             src={imageUrl}
//             alt={variant?.name || product.name}
//             className="w-full h-full transition-transform duration-500 group-hover:scale-110 object-contain p-3.5"
//             onError={(e) => {
//               e.target.onerror = null;
//               e.target.src = logo;
//             }}
//           />
//           {/* Hover overlay */}
//           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.04] transition-colors duration-300 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
//             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-900 text-[10px] font-bold rounded-full shadow-md uppercase tracking-wide">
//               <Eye size={10} /> View
//             </span>
//           </div>
//         </div>

//         {/* Body - grows to fill remaining space */}
//         <div className="p-3 sm:p-3.5 flex flex-col flex-grow">
//           {subcatName && (
//             <p className="text-[9px] sm:text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1 line-clamp-1">
//               {subcatName}
//             </p>
//           )}
//           <h3 className="font-semibold text-gray-900 text-xs sm:text-sm leading-snug line-clamp-2 mb-2 flex-grow">
//             {product.name}
//           </h3>
//           {price && (
//             <p className="font-black text-[#B91C1C] text-sm sm:text-base mt-auto">
//               ₹{Number(price).toLocaleString("en-IN")}
//             </p>
//           )}
//         </div>
//       </div>
//     );
//   };

//   if (!loading && filteredProducts.length === 0) return null;

//   return (
//     <section className="relative py-12 sm:py-16 overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-red-950">
//       {/* Decorative blobs */}
//       <div className="absolute top-0 right-0 w-96 h-96 bg-[#B91C1C]/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
//       <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-800/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/3" />

//       <div className="container-main relative">
//         {/* Section Header */}
//         <div className="flex items-center justify-between mb-8 sm:mb-10">
//           <div className="flex items-start gap-4">
//             <div className="w-12 h-12 rounded-2xl bg-[#B91C1C] flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-900/50">
//               <Flame size={22} className="text-white" fill="white" />
//             </div>
//             <div>
//               <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f87171] mb-1">
//                 Most Ordered
//               </p>
//               <h2 className="font-black text-2xl sm:text-3xl text-white leading-tight">
//                 Best <span className="text-[#f87171]">Sellers</span>
//               </h2>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => sliderRef.current?.slickPrev()}
//               className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-red-400 text-red-400 bg-white/5 shadow-sm hover:border-red-300 hover:text-red-300 hover:shadow-md transition-all duration-200"
//               aria-label="Previous"
//             >
//               <ChevronLeft size={16} />
//             </button>
//             <button
//               onClick={() => sliderRef.current?.slickNext()}
//               className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-red-400 text-red-400 bg-white/5 shadow-sm hover:border-red-300 hover:text-red-300 hover:shadow-md transition-all duration-200"
//               aria-label="Next"
//             >
//               <ChevronRight size={16} />
//             </button>
//             <Link
//               to="/most-selling-all"
//               className="hidden sm:inline-flex items-center gap-1.5 ml-2 px-4 py-2 bg-[#B91C1C] hover:bg-red-700 text-white text-xs font-bold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
//             >
//               See All <ArrowRight size={12} />
//             </Link>
//           </div>
//         </div>

//         {/* Carousel */}
//         <ProductCarousel
//           ref={sliderRef}
//           products={filteredProducts}
//           loading={loading}
//           onProductClick={handleProductClick}
//           getFirstAvailableVariant={getFirstAvailableVariant}
//           renderProduct={renderProduct}
//         />
//       </div>
//     </section>
//   );
// };

// export default MostSellingProductList;
import React, { useEffect, useState } from "react";
import api from "./utils/api";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import logo from "./images/piclogo.png";

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

  const getImage = (product) =>
    product?.variants?.[0]?.images?.[0] || logo;

  const getPrice = (product) =>
    product?.variants?.[0]?.price || null;

  return (
    <div className="bg-white">

      {/* ─── HERO ───────────────────── */}
      <section className="relative h-[320px] sm:h-[420px] overflow-hidden">
        <img
 src="https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&w=1600&q=80"
          alt="Most Selling Products"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-white text-3xl sm:text-5xl font-semibold tracking-wide mb-3">
              Best Sellers
            </h1>
            <p className="text-white/80 text-sm sm:text-base mb-6 max-w-xl mx-auto">
              Explore our most popular products trusted by professionals every day
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

      {/* ─── GRID ───────────────────── */}
      <section className="py-10 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* ✅ LOADING SKELETON */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">

                  {/* IMAGE CARD */}
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="aspect-square bg-gray-200" />
                  </div>

                  {/* TEXT OUTSIDE */}
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
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="cursor-pointer group"
                >

                  {/* ✅ IMAGE CARD ONLY */}
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div className="aspect-square flex items-center justify-center p-4">
                      <img
                        src={getImage(product)}
                        alt={product.name}
                        onError={(e) => (e.target.src = logo)}
                        className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  </div>

                  {/* ✅ NAME + PRICE OUTSIDE */}
                  <div className="mt-2 text-center">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px]">
                      {product.name}
                    </p>

                    {getPrice(product) && (
                      <p className="text-sm font-bold text-red-600 mt-1">
                        ₹ {Number(getPrice(product)).toLocaleString()}
                      </p>
                    )}
                  </div>

                </div>
              ))}

            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default MostSellingProductList;