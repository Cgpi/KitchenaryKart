/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./utils/api";
import logo from "./images/piclogo.png";
import { ProductSkeleton } from "./components/common/ProductSkeleton";
import {
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1 text-xs">
    {"★".repeat(Math.round(rating))}
    <span className="text-gray-400">{rating.toFixed(1)}</span>
  </div>
);

/* PRODUCT CARD */
const ProductCard = ({ p, navigate, getVariant, ratings }) => {
  const v = getVariant(p.variants || []);
  const images = v?.images?.length ? v.images : [logo];

  const [currentIndex, setCurrentIndex] = useState(0);
  const startX = useRef(0);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

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
      onClick={() => navigate(`/product/${p.id}?name=${p.name}`)}
      className="cursor-pointer group"
    >
      <div
        className="relative aspect-square bg-white mb-3 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <img
          src={images[currentIndex]}
          className="w-full h-full object-contain p-4"
        />
{/* 🔥 MOBILE IMAGE SLIDER (same as search page) */}
{images.length > 1 && (
  <div className="md:hidden absolute bottom-0 left-0 w-full px-3 pb-1">
    <div className="w-full h-[2px] bg-gray-200 flex overflow-hidden">
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
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 
           bg-white shadow-md w-8 h-12 items-center justify-center
           opacity-0 group-hover:opacity-100 transition-opacity duration-200"    >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={nextImage}
             className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 
           bg-white shadow-md w-8 h-12 items-center justify-center
           opacity-0 group-hover:opacity-100 transition-opacity duration-200"    >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      <p className="text-sm font-medium">{p.name}</p>

      {ratings[v?.id] && <StarRating rating={ratings[v.id]} />}

      <p className="font-semibold mt-1">
        ₹{v ? new Intl.NumberFormat("en-IN").format(v.price) : "N/A"}
      </p>
    </div>
  );
};

const CustomerProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { subcategoryId, subsubcategoryId } = useParams();

  const [ratings, setRatings] = useState({});

  /* MAIN FILTER STATE */
  const [priceRange, setPriceRange] = useState([0, 250000]);
  const [sortOrder, setSortOrder] = useState("");

  /* TEMP STATE (for drawer) */
  const [tempPrice, setTempPrice] = useState([0, 250000]);
  const [tempSort, setTempSort] = useState("");

  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  /* ✅ FIX: declare BEFORE useMemo */
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
        p.variants?.forEach((v) => fetchVariantReviews(v.id))
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchVariantReviews = async (variantId) => {
    try {
      const { data } = await api.get(`/Reviews/variant/${variantId}`);
      if (data?.length) {
        const avg =
          data.reduce((s, r) => s + (r.rating || 0), 0) / data.length;

        setRatings((prev) => ({
          ...prev,
          [variantId]: avg,
        }));
      }
    } catch {}
  };

  /* 🔥 SAME FILTER LOGIC AS SEARCH */
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
        const va = getVariant(a.variants || []);
        const vb = getVariant(b.variants || []);

        const pa = va?.price ?? Infinity;
        const pb = vb?.price ?? Infinity;

        if (sortOrder === "asc") return pa - pb;
        if (sortOrder === "desc") return pb - pa;
        return 0;
      });
  }, [products, priceRange, sortOrder]);

  return (
    <div className="bg-white min-h-screen">
      {/* HEADER */}
      <div className="w-full px-6 md:px-10 lg:px-16 pt-6">
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => {
              setTempSort(sortOrder);
              setTempPrice(priceRange);
              setFilterOpen(true);
            }}
            className="border px-4 py-2 flex items-center gap-2"
          >
            <SlidersHorizontal size={14} /> Sort & Filter
          </button>
        </div>
         {/* SELECTED FILTERS */}
        <div className="flex gap-2 flex-wrap mb-6">
          {sortOrder && (
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
              {sortOptions.find(s => s.value === sortOrder)?.label}
            </span>
          )}

          {priceRange && (
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
              {
                pricePresets.find(
                  p =>
                    p.range[0] === priceRange[0] &&
                    p.range[1] === priceRange[1]
                )?.label
              }
            </span>
          )}
        </div>
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
                getVariant={getVariant}
                ratings={ratings}
              />
            ))}
          </div>
        )}
      </div>

      {/* FILTER DRAWER */}
      {filterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[100]"
            onClick={() => {
              setTempSort(sortOrder);
              setTempPrice(priceRange);
              setFilterOpen(false);
            }}
          />

 <div className="fixed right-0 top-0 h-full w-[320px] bg-white p-6 shadow-xl z-[110] overflow-y-auto">
            <div className="flex justify-between mb-6">
              <h2 className="text-lg font-semibold">Sort & Filter</h2>
              <X onClick={() => setFilterOpen(false)} />
            </div>

            {/* SORT */}
            <div className="mb-6">
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
            </div>

            {/* PRICE */}
            <div>
              {pricePresets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setTempPrice(p.range)}
                  className={`block mb-2 text-sm ${
                    tempPrice[0] === p.range[0] &&
                    tempPrice[1] === p.range[1]
                      ? "font-semibold text-black"
                      : "text-gray-500"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setTempSort("");
                setTempPrice([0, 250000]);
              }}
              className="w-full border py-2 mt-4"
            >
              CLEAR ALL
            </button>

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