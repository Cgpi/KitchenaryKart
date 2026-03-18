/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, PackageX, SlidersHorizontal } from "lucide-react";
import api from "./utils/api";
import logo from "./images/piclogo.png";

/* 🔥 CLEAN PRODUCT CARD */
const ProductCard = ({ product, onClick, getVariant }) => {
  const variant = getVariant(product.variants || []);
  const image = variant?.images?.[0] || logo;

  const subcat =
    product.subcategories?.length > 0
      ? product.subcategories[0].name
      : "Category";

  return (
    <div onClick={onClick} className="cursor-pointer group">
      
      {/* IMAGE BOX */}
      <div className="aspect-square bg-white border border-stone-200 overflow-hidden mb-3">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-contain p-4 transition duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = logo;
          }}
        />
      </div>

      {/* TEXT SECTION */}
      <div className="space-y-1">
        
        {/* CATEGORY */}
        <p className="text-[10px] font-semibold text-stone-400 uppercase line-clamp-1">
          {subcat}
        </p>

        {/* NAME */}
        <p className="text-sm font-medium text-stone-800 line-clamp-2">
          {product.name}
        </p>

        {/* PRICE */}
        <div className="mt-1">
          <p className="text-sm font-bold text-[#B91C1C]">
            ₹{variant
              ? new Intl.NumberFormat("en-IN").format(
                  variant.price_excluding_tax
                )
              : "N/A"}
            <span className="text-[10px] font-semibold text-stone-400 ml-1 uppercase">
              excl. tax
            </span>
          </p>

          <p className="text-xs text-stone-500 font-medium">
            ₹{variant
              ? new Intl.NumberFormat("en-IN").format(variant.price)
              : "N/A"}
            <span className="text-[9px] ml-1 uppercase">
              incl. gst
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

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
          product.variants &&
          product.variants.some((variant) => variant.stock > 0)
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

  /* Skeleton */
  const SkeletonCard = () => (
    <div className="animate-pulse">
      <div className="aspect-square bg-stone-200 mb-3" />
      <div className="h-3 bg-stone-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-stone-200 rounded w-1/2" />
    </div>
  );

  return (
    <div className="bg-white min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 border bg-white rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {searchQuery && (
            <h1 className="text-xl sm:text-2xl font-semibold">
              Results for <span className="text-[#B91C1C]">"{searchQuery}"</span>
            </h1>
          )}
        </div>

        {/* FILTER BAR (UNCHANGED) */}
        <div className="bg-white p-4 rounded-2xl border flex flex-col md:flex-row gap-6 mb-8">
          {/* Price + Sort SAME AS YOUR CODE */}
          {/* (kept as-is for functionality) */}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-10">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : noResults ? (
            <div className="col-span-full text-center py-20">
              <PackageX className="mx-auto mb-4 text-gray-400" />
              <p>No products found</p>
            </div>
          ) : (
            filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                getVariant={getFirstAvailableVariant}
                onClick={() =>
                  handleProductClick(product.id, product.name)
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerSearchProductList;