/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  PackageX,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "./utils/api";
import logo from "./images/piclogo.png";

/* 🔥 PRICE + SORT */
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

const ProductCard = ({ product, onClick }) => {
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedDimension, setSelectedDimension] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const startX = useRef(0);

  // ✅ Extract options
  const getOptions = (variants = []) => {
    const colors = new Set();
    const dimensions = new Set();

    variants.forEach((v) => {
      if (v.color) colors.add(v.color);
      if (v.otherDimensions) dimensions.add(v.otherDimensions);
    });

    return {
      colors: Array.from(colors),
      dimensions: Array.from(dimensions),
    };
  };

  // ✅ Get selected variant
  const getSelectedVariant = () => {
    const variants = product.variants || [];

    return (
      variants.find(
        (v) =>
          (!selectedColor || v.color === selectedColor) &&
          (!selectedDimension || v.otherDimensions === selectedDimension) &&
          v.stock > 0,
      ) ||
      variants.find((v) => v.stock > 0) ||
      null
    );
  };

  const { colors, dimensions } = getOptions(product.variants || []);
  const variant = getSelectedVariant();

  const images = variant?.images?.length ? variant.images : [logo];

  // ✅ Slider
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
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

  const subcat = product.subcategories?.[0]?.name || "Category";

  return (
    <div
      onClick={() =>
        onClick(`/product/${product.id}?variant=${variant?.id || ""}`)
      }
      className="cursor-pointer group"
    >
      {/* IMAGE */}
      <div
        className="relative aspect-square bg-gray-100 overflow-hidden mb-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <img
          src={images[currentIndex]}
          className="w-full h-full bg-white object-contain p-6 group-hover:scale-105 transition"
          onError={(e) => (e.target.src = logo)}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow w-8 h-12 items-center justify-center"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={nextImage}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow w-8 h-12 items-center justify-center"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* INFO */}
      <p className="text-xs text-stone-400 uppercase">{subcat}</p>

      <p className="text-base font-medium line-clamp-2 mt-1">{product.name}</p>

      <div className="flex items-center justify-between gap-2 mt-1">
        <div>
          <p className="text-lg font-semibold">
            ₹ {Number(variant.price_excluding_tax).toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-stone-500">
            ₹ {Number(variant.price).toLocaleString("en-IN")} incl. GST
          </p>
        </div>

        <div className="flex gap-1">
          {colors.length > 0 && (
            <select
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="text-[10px] border rounded px-1 py-1"
            >
              <option value="">Color</option>
              {colors.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          {dimensions.length > 0 && (
            <select
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setSelectedDimension(e.target.value)}
              className="text-[10px] border rounded px-1 py-1"
            >
              <option value="">Size</option>
              {dimensions.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>
          )}
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

  const [tempSort, setTempSort] = useState("");
  const [tempPrice, setTempPrice] = useState([0, 250000]);

  const [filterOpen, setFilterOpen] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search");
    setSearchQuery(query || "");
    fetchProducts(query);
  }, [location.search]);

  const fetchProducts = async (query) => {
    try {
      setLoading(true);
      const res = await api.get(`/product/search_products`, {
        params: { query },
      });
      const data = Array.isArray(res.data) ? res.data : [];
      setProducts(data);
      setNoResults(data.length === 0);
    } finally {
      setLoading(false);
    }
  };

  const getVariant = (v) => v.find((x) => x.stock > 0);

  const filteredProducts = useMemo(() => {
    return [...products]
      .filter((p) => p.name?.toLowerCase().includes(searchQuery.toLowerCase()))
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

        return sortOrder === "asc"
          ? pa - pb
          : sortOrder === "desc"
            ? pb - pa
            : 0;
      });
  }, [products, searchQuery, priceRange, sortOrder]);

  return (
    <div className="bg-white min-h-screen px-4 py-6">
      <div className="max-w-[1400px] mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigate(-1)} className="flex gap-2">
            <ArrowLeft /> Back
          </button>

          <button
            onClick={() => {
              setTempSort(sortOrder);
              setTempPrice(priceRange);
              setFilterOpen(true);
            }}
            className="border px-4 py-2 flex gap-2"
          >
            <SlidersHorizontal size={14} /> Sort & Filter
          </button>
        </div>

        {/* SELECTED FILTERS */}
        <div className="flex gap-2 flex-wrap mb-6">
          {sortOrder && (
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
              {sortOptions.find((s) => s.value === sortOrder)?.label}
            </span>
          )}

          {priceRange && (
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
              {
                pricePresets.find(
                  (p) =>
                    p.range[0] === priceRange[0] &&
                    p.range[1] === priceRange[1],
                )?.label
              }
            </span>
          )}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {loading ? (
            <p>Loading...</p>
          ) : noResults ? (
            <div className="col-span-full text-center py-20">
              <PackageX className="mx-auto mb-4 text-gray-400" />
              No products found
            </div>
          ) : (
            filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                getVariant={getVariant}
                onClick={() => navigate(`/product/${p.id}?name=${p.name}`)}
              />
            ))
          )}
        </div>
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
                <label
                  key={opt.value}
                  className={`block mb-2 ${
                    tempSort === opt.value ? "font-semibold" : ""
                  }`}
                >
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
                    tempPrice[0] === p.range[0] && tempPrice[1] === p.range[1]
                      ? "font-semibold text-black"
                      : "text-gray-500"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* CLEAR */}
            <button
              onClick={() => {
                setTempSort("");
                setTempPrice([0, 250000]);
              }}
              className="w-full border py-2 mt-4"
            >
              CLEAR ALL
            </button>

            {/* APPLY */}
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

export default CustomerSearchProductList;
