/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./utils/api";
import logo from "./images/piclogo.png";
import { ProductSkeleton } from "./components/common/ProductSkeleton";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

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

/* 🔥 PRODUCT CARD */
const ProductCard = ({ p, navigate, getVariant, ratings }) => {
  const v = getVariant(p.variants || []);
  const images = v?.images?.length ? v.images : [logo];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(0);
  const [isHover, setIsHover] = useState(false);

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

  /* 🖱 Hover Logic */
  const handleEnter = () => {
    setIsHover(true);
    if (lastIndex !== 0) {
      setCurrentIndex(lastIndex);
    } else if (images[1]) {
      setCurrentIndex(1);
    }
  };

  const handleLeave = () => {
    setIsHover(false);
    setCurrentIndex(0);
  };

  /* 📱 Mobile Swipe */
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    const diff = e.touches[0].clientX - startX.current;

    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        nextImage(e);
      } else {
        prevImage(e);
      }
      startX.current = e.touches[0].clientX;
    }
  };

  return (
    <div
      onClick={() =>
        navigate(`/product/${p.id}?name=${p.name}`)
      }
      className="cursor-pointer group"
    >
      <div
        className="relative aspect-square bg-gray-100 mb-3 overflow-hidden"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <img
          src={images[currentIndex]}
          className="w-full h-full object-contain p-4 transition duration-300"
        />

        {/* ARROWS */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 shadow"
            >
              ‹
            </button>

            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 shadow"
            >
              ›
            </button>
          </>
        )}
      </div>

      <p className="text-sm font-medium">{p.name}</p>

      {ratings[v?.id] && (
        <StarRating rating={ratings[v.id]} />
      )}

      <p className="font-semibold mt-1">₹{v?.price}</p>
    </div>
  );
};

const CustomerProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery] = useState("");
  const navigate = useNavigate();
  const { subcategoryId, subsubcategoryId } = useParams();
  const [ratings, setRatings] = useState({});
  const [priceRange, setPriceRange] = useState([0, 250000]);
  const [sortOrder, setSortOrder] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

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
      setProducts(res.data);

      res.data.forEach((p) =>
        p.variants?.forEach((v) =>
          fetchVariantReviews(v.id)
        )
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
          data.reduce((s, r) => s + (r.rating || 0), 0) /
          data.length;
        setRatings((prev) => ({
          ...prev,
          [variantId]: avg,
        }));
      }
    } catch {}
  };

  const filteredProducts = useMemo(() => {
    return [...products]
      .filter((p) =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((p) => {
        const price = p.variants?.[0]?.price || 0;
        return price >= priceRange[0] && price <= priceRange[1];
      })
      .sort((a, b) => {
        const pa = a.variants?.[0]?.price || 0;
        const pb = b.variants?.[0]?.price || 0;
        return sortOrder === "asc"
          ? pa - pb
          : sortOrder === "desc"
          ? pb - pa
          : 0;
      });
  }, [products, searchQuery, priceRange, sortOrder]);

  const getVariant = (v) => v.find((x) => x.stock > 0);

  return (
    <div className="bg-white min-h-screen">

      {/* HEADER */}
      <div className="w-full px-6 md:px-10 lg:px-16 pt-6">
        {/* <h1 className="text-2xl font-semibold mb-4">Kitchen Tool Sets</h1> */}

        <div className="flex flex-wrap gap-3 mb-6">
          {/* {["Material", "Features", "Product Type", "Brands", "Set Size"].map(
            (item) => (
              <button
                key={item}
                className="border px-4 py-2 text-sm flex items-center gap-2 hover:border-black"
              >
                {item} <ChevronDown size={14} />
              </button>
            )
          )} */}

          <button
            onClick={() => setFilterOpen(true)}
            className="border px-4 py-2 flex items-center gap-2"
          >
            <SlidersHorizontal size={14} /> Sort & Filter
          </button>
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
            className="fixed left-0 right-0 bottom-0 top-[120px] bg-black/40"
            onClick={() => setFilterOpen(false)}
          />

         <div className="fixed right-0 top-[120px] h-[calc(100%-120px)] w-[350px] bg-white shadow-xl p-6 overflow-y-auto">
  <div className="flex justify-between mb-6">
    <h2 className="text-lg font-semibold">Sort & Filter</h2>
    <X onClick={() => setFilterOpen(false)} />
  </div>

  {/* SORT */}
  <div className="mb-6">
    <h3 className="font-medium mb-2">Sort By</h3>
    {sortOptions.map((opt) => (
      <label key={opt.value} className="block mb-2">
        <input
          type="radio"
          checked={sortOrder === opt.value}
          onChange={() => setSortOrder(opt.value)}
        />{" "}
        {opt.label}
      </label>
    ))}
  </div>

  {/* PRICE */}
  <div>
    <h3 className="font-medium mb-2">Price</h3>
    {pricePresets.map((p) => (
      <button
        key={p.label}
        onClick={() => setPriceRange(p.range)}
        className="block mb-2 text-sm"
      >
        {p.label}
      </button>
    ))}
  </div>

  <button
    onClick={() => setFilterOpen(false)}
    className="mt-6 w-full bg-black text-white py-3"
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