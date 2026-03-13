import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, PackageX, SlidersHorizontal } from "lucide-react";
import api from "./utils/api";
import logo from "./images/piclogo.png";

const CustomerSearchProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [priceRange, setPriceRange] = useState([0, 250000]);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search");
    setSearchQuery(query || "");
    fetchProducts(query);
  }, [location.search]);

  const fetchProducts = async (query) => {
    try {
      setLoading(true);
      if (query) {
        const response = await api.get(`/product/search_products`, {
          params: { query },
        });

        const data = Array.isArray(response.data) ? response.data : [];
        setNoResults(data.length === 0);
        setProducts(data);
      } else {
        setProducts([]);
        setNoResults(false);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e) => setSortOrder(e.target.value);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    const filtered = products
      .filter((product) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
          product.name?.toLowerCase().includes(searchTerm) ||
          product.keywords?.toLowerCase().includes(searchTerm)
        );
      })
      .filter(
        (product) =>
          product.variants && product.variants.some((variant) => variant.stock > 0)
      )
      .filter((product) => {
        const price = product.variants?.[0]?.price || 0;
        return price >= priceRange[0] && price <= priceRange[1];
      });

    return [...filtered].sort((a, b) => {
      const priceA = a.variants?.[0]?.price || 0;
      const priceB = b.variants?.[0]?.price || 0;
      return sortOrder === "asc"
        ? priceA - priceB
        : sortOrder === "desc"
        ? priceB - priceA
        : 0;
    });
  }, [products, searchQuery, sortOrder, priceRange]);

  const handleProductClick = (productId, productName) => {
    navigate(`/product/${productId}?name=${encodeURIComponent(productName)}`);
  };

  const getFirstAvailableVariant = (variants) =>
    variants.find((variant) => variant.stock > 0) || null;

  // Skeleton card for loading state
  const SkeletonCard = () => (
    <div className="bg-white border border-stone-100 rounded-2xl md:rounded-3xl shadow-sm flex flex-col h-full overflow-hidden animate-pulse">
      <div className="px-4 pt-3 flex items-center h-8">
        <div className="h-2.5 w-16 bg-stone-200 rounded-full" />
      </div>
      <div className="w-full aspect-square bg-stone-100 mx-0" />
      <div className="h-px w-full bg-stone-100 my-2" />
      <div className="p-4 pt-2 flex flex-col gap-3">
        <div className="h-3 bg-stone-200 rounded-full w-full" />
        <div className="h-3 bg-stone-200 rounded-full w-3/4" />
        <div className="h-4 bg-stone-200 rounded-full w-1/2 mt-1" />
      </div>
    </div>
  );

  return (
    <div className="bg-stone-50 min-h-screen pt-4 pb-12 sm:pt-6 sm:pb-16 px-4 sm:px-6 lg:px-8">

      <div className="max-w-7xl mx-auto flex flex-col h-full">
        {/* Header & Back Button */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between flex-wrap gap-4">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-4 py-2 bg-white text-stone-700 font-semibold rounded-xl border border-stone-200 shadow-sm hover:border-[#B91C1C] hover:text-[#B91C1C] hover:shadow-md transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back
          </button>
          
          {searchQuery && (
             <h1 className="text-xl sm:text-2xl font-bold text-stone-800">
               Search Results for <span className="text-[#B91C1C]">"{searchQuery}"</span>
             </h1>
          )}
        </div>

        {/* Filters and Sorting Bar */}
        <div className="bg-white p-4 rounded-2xl md:rounded-3xl shadow-sm border border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          
          {/* Price Range Slider */}
          <div className="flex-1 w-full max-w-sm">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-bold text-stone-500 uppercase tracking-wider">
                Price Range
              </label>
              <span className="text-sm font-bold text-[#B91C1C]">
                ₹{priceRange[0]} - ₹{priceRange[1]}
              </span>
            </div>
            <div className="relative h-[30px] flex items-center">
              {/* Track */}
              <div className="absolute w-full h-1.5 bg-stone-200 rounded-full" />
              {/* Active Track */}
              <div
                className="absolute h-1.5 bg-gradient-to-r from-[#B91C1C] to-[#6b0f1a] rounded-full"
                style={{
                  left: `${(priceRange[0] / 250000) * 100}%`,
                  width: `${((priceRange[1] - priceRange[0]) / 250000) * 100}%`,
                }}
              />
              {/* Min Slider */}
              <input
                type="range"
                min={0}
                max={250000}
                step={100}
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([
                    Math.min(Number(e.target.value), priceRange[1] - 100),
                    priceRange[1],
                  ])
                }
                className="absolute w-full h-full appearance-none bg-transparent pointer-events-none z-20 
                 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-[#B91C1C] [&::-webkit-slider-thumb]:to-[#6b0f1a] 
                 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer"
              />
              {/* Max Slider */}
              <input
                type="range"
                min={0}
                max={250000}
                step={100}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([
                    priceRange[0],
                    Math.max(Number(e.target.value), priceRange[0] + 100),
                  ])
                }
                className="absolute w-full h-full appearance-none bg-transparent pointer-events-none z-30 
                 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-[#B91C1C] [&::-webkit-slider-thumb]:to-[#6b0f1a] 
                 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full md:max-w-[240px] relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SlidersHorizontal className="h-4 w-4 text-stone-400" />
             </div>
            <select
              id="sortOrder"
              className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 text-stone-700 text-sm rounded-xl focus:border-[#B91C1C] focus:ring-2 focus:ring-[#B91C1C]/20 transition-colors appearance-none font-medium cursor-pointer"
              onChange={handleSortChange}
              value={sortOrder}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              <option value="">Default sorting</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5 lg:gap-6">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
          ) : noResults ? (
            /* Empty State */
            <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-sm border border-stone-100 mt-4">
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4">
                <PackageX className="w-8 h-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-bold text-stone-800 mb-2">No Products Found</h3>
              <p className="text-stone-500 max-w-md text-sm text-center">
                We couldn't find any products matching your search criteria. Try adjusting your search term or filtering options.
              </p>
            </div>
          ) : (
            filteredAndSortedProducts.map((product) => {
              const currentVariant = getFirstAvailableVariant(product.variants);
              return (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.id, product.name)}
                  className="group cursor-pointer bg-white border border-stone-100 rounded-2xl md:rounded-3xl shadow-sm hover:shadow-xl hover:border-[#B91C1C]/30 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden"
                >
                  {/* Category Label */}
                  <div className="px-4 pt-3 flex items-center h-8">
                     <p className="text-[10px] font-bold tracking-wider text-stone-400 uppercase truncate">
                      {product.subcategories?.length > 0
                        ? product.subcategories[0].name
                        : "Category"}
                    </p>
                  </div>

                  {/* Image Section */}
                  <div className="relative w-full aspect-square bg-white flex items-center justify-center px-4 overflow-hidden">
                    <img
                      src={currentVariant?.images?.[0] || logo}
                      alt={currentVariant ? currentVariant.name : "Product Logo"}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = logo;
                      }}
                    />
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-stone-100 my-2" />

                  {/* Content Section */}
                  <div className="p-4 pt-2 flex flex-col flex-grow justify-between gap-3">
                    <h3 className="text-[13px] sm:text-sm leading-snug font-bold text-stone-800 line-clamp-2 min-h-[2.5rem] group-hover:text-[#B91C1C] transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex flex-col gap-0.5 mt-auto">
                      <span className="text-sm sm:text-[15px] font-black tracking-tight text-[#B91C1C]">
                        ₹{currentVariant
                          ? new Intl.NumberFormat("en-IN").format(currentVariant.price_excluding_tax)
                          : "N/A"}
                        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest ml-1 inline-block align-middle">
                          excl. tax
                        </span>
                      </span>

                      <span className="text-[11px] font-semibold text-stone-500">
                        ₹{currentVariant
                          ? new Intl.NumberFormat("en-IN").format(currentVariant.price)
                          : "N/A"}
                        <span className="text-[9px] uppercase tracking-wider ml-1">
                          incl. gst
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerSearchProductList;


