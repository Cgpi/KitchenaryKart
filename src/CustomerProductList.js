/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./utils/api";
import logo from "./images/piclogo.png";
import { ProductSkeleton } from "./components/common/ProductSkeleton";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { StarRating } from "./components/common/StarRating";

/* PRICE + SORT */
const pricePresets = [
  { label: "All Prices", range: [0, 250000] },
  { label: "Under ₹1K", range: [0, 1000] },
  { label: "₹1K – ₹5K", range: [1000, 5000] },
  { label: "₹5K – ₹25K", range: [5000, 25000] },
  { label: "Above ₹25K", range: [25000, 250000] },
];

const sortOptions = [
  { value: "", label: "Best Match" },
  { value: "asc", label: "Price, low to high" },
  { value: "desc", label: "Price, high to low" },
];

const StarRatingInline = ({ rating }) =>
  rating ? <StarRating rating={rating} size={12} className="mt-0.5" /> : null;

const ProductCard = ({ p, navigate, ratings }) => {
  const [selectedDimension, setSelectedDimension] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const variants = p.variants || [];

  /* ✅ UNIQUE OPTIONS */
  const dimensions = useMemo(
    () => [...new Set(variants.map((v) => v.otherDimensions).filter(Boolean))],
    [variants],
  );

  const colors = useMemo(
    () => [...new Set(variants.map((v) => v.color).filter(Boolean))],
    [variants],
  );

  /* ✅ SELECTED VARIANT */
  const selectedVariant = useMemo(() => {
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
  }, [variants, selectedDimension, selectedColor]);

  const images =
    selectedVariant?.images?.length > 0 ? selectedVariant.images : [logo];

  const price = selectedVariant?.price || null;

  /* IMAGE SLIDER */
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
      diff < 0 ? nextImage(e) : prevImage(e);
      startX.current = e.touches[0].clientX;
    }
  };

  return (
    <div
      onClick={() =>
        navigate(`/product/${p.id}?variant=${selectedVariant?.id || ""}`)
      }
      className="cursor-pointer group"
    >
      {/* IMAGE */}
      <div
        className="relative aspect-square bg-white mb-3 overflow-hidden"
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

        {/* MOBILE BAR */}
        {images.length > 1 && (
          <div className="md:hidden absolute bottom-0 left-0 w-full px-3 pb-1">
            <div className="w-full h-[2px] bg-gray-200 flex">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 ${
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
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 
              opacity-0 group-hover:opacity-100 transition
              bg-white shadow-md w-8 h-12 items-center justify-center"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={nextImage}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 
              opacity-0 group-hover:opacity-100 transition
              bg-white shadow-md w-8 h-12 items-center justify-center"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* INFO */}
      <p className="text-sm font-medium line-clamp-2">{p.name}</p>

      <StarRatingInline rating={ratings?.[selectedVariant?.id]} />

      {price && (
        <div className="mt-1">
          <p className="font-semibold text-gray-900">
            ₹{Number(price).toLocaleString("en-IN")}
          </p>

          {/* ✅ CLEAN VARIANT SELECTORS */}
          <div className="flex gap-2 mt-2">
            {dimensions.length > 0 && (
              <select
                value={selectedDimension}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setSelectedDimension(e.target.value)}
                className="text-xs border border-gray-300 rounded-full px-2 py-1 bg-white"
              >
                <option value="">Size</option>
                {dimensions.map((d, i) => (
                  <option key={i} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            )}

            {colors.length > 0 && (
              <select
                value={selectedColor}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="text-xs border border-gray-300 rounded-full px-2 py-1 bg-white"
              >
                <option value="">Color</option>
                {colors.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const CustomerProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { subcategoryId, subsubcategoryId } = useParams();
  const [ratings, setRatings] = useState({});

  const [priceRange, setPriceRange] = useState([0, 250000]);
  const [sortOrder, setSortOrder] = useState("");
  const [tempPrice, setTempPrice] = useState([0, 250000]);
  const [tempSort, setTempSort] = useState("");

  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const getVariant = (v) => v.find((x) => x.stock > 0);

  useEffect(() => {
    fetchProducts();
  }, [subcategoryId, subsubcategoryId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = `${process.env.REACT_APP_API_BASE_URL}/product/filter`;
      const params = {};

      if (subsubcategoryId) params.subsubcategoryId = subsubcategoryId;
      else if (subcategoryId) params.subcategoryId = subcategoryId;

      const res = await api.get(url, { params });
      const data = Array.isArray(res.data) ? res.data : [];

      setProducts(data);

      data.forEach((p) =>
        p.variants?.forEach((v) => fetchVariantReviews(v.id)),
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchVariantReviews = async (variantId) => {
    try {
      const { data } = await api.get(`/Reviews/variant/${variantId}`);
      if (data?.length) {
        const avg = data.reduce((s, r) => s + (r.rating || 0), 0) / data.length;

        setRatings((prev) => ({
          ...prev,
          [variantId]: avg,
        }));
      }
    } catch {}
  };

  const filteredProducts = useMemo(() => {
    return [...products]
      .filter((p) => {
        const v = getVariant(p.variants || []);
        if (!v) return false;

        const price = v.price;
        if (!price || price < 1) return false;

        return price >= priceRange[0] && price <= priceRange[1];
      })
      .sort((a, b) => {
        const pa = getVariant(a.variants || [])?.price ?? Infinity;
        const pb = getVariant(b.variants || [])?.price ?? Infinity;

        if (sortOrder === "asc") return pa - pb;
        if (sortOrder === "desc") return pb - pa;
        return 0;
      });
  }, [products, priceRange, sortOrder]);

  return (
    <div className="bg-white min-h-screen">
      {/* HEADER */}
      <div className="w-full px-6 md:px-10 lg:px-16 pt-6">
        <button
          onClick={() => {
            setTempSort(sortOrder);
            setTempPrice(priceRange);
            setFilterOpen(true);
          }}
          className="border px-4 py-2 flex items-center gap-2 mb-6"
        >
          <SlidersHorizontal size={14} /> Sort & Filter
        </button>
      </div>

      {/* GRID */}
      <div className="w-full px-6 md:px-10 lg:px-16 pb-10">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                p={p}
                navigate={navigate}
                ratings={ratings}
              />
            ))}
          </div>
        )}
      </div>

      {/* FILTER DRAWER (unchanged) */}
      {filterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[100]"
            onClick={() => setFilterOpen(false)}
          />

          <div className="fixed right-0 top-0 h-full w-[320px] bg-white p-6 shadow-xl z-[110]">
            <h2 className="text-lg font-semibold mb-6">Sort & Filter</h2>

            {sortOptions.map((opt) => (
              <label key={opt.value} className="block mb-2">
                <input
                  type="radio"
                  checked={tempSort === opt.value}
                  onChange={() => setTempSort(opt.value)}
                />{" "}
                {opt.label}
              </label>
            ))}

            <button
              onClick={() => {
                setSortOrder(tempSort);
                setPriceRange(tempPrice);
                setFilterOpen(false);
              }}
              className="mt-4 w-full bg-black text-white py-3"
            >
              APPLY
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerProductList;
