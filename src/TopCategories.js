import React, { useEffect, useState, useRef } from "react";
import api from "./utils/api";
import { useNavigate, Link } from "react-router-dom";
import Slider from "react-slick";
import logo from "./images/piclogo.png";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ChevronLeft, ChevronRight, Grid3X3 } from "lucide-react";

/* ── Skeleton ─────────────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="px-2">
    <div className="flex flex-col items-center gap-3">
      <div className="w-[100px] h-[100px] rounded-2xl bg-gray-200 animate-pulse" />
      <div className="h-3 w-20 rounded-full bg-gray-200 animate-pulse" />
    </div>
  </div>
);

export default function TopCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/subcategory/index`)
      .then((res) => {
        const unique = res.data.filter(
          (c, i, self) => i === self.findIndex((x) => x.name === c.name)
        );
        unique.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(unique);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const go = (id, subsubcategories) => {
    if (Array.isArray(subsubcategories) && subsubcategories.length > 0) {
      navigate(`/subsubcategories/${id}`);
    } else {
      navigate(`/products/subcategory/${id}`);
    }
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 2,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3200,
    swipeToSlide: true,
    draggable: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 7 } },
      { breakpoint: 1024, settings: { slidesToShow: 6 } },
      { breakpoint: 768, settings: { slidesToShow: 5 } },
      { breakpoint: 550, settings: { slidesToShow: 4 } },
      { breakpoint: 380, settings: { slidesToShow: 3 } },
    ],
  };

  return (
    <section className="relative py-10 sm:py-14 overflow-hidden bg-white">
      <Helmet>
        <title>Featured Categories | Kitchenary Kart</title>
        <meta name="description" content="Browse featured kitchen categories at Kitchenary Kart." />
        <link rel="canonical" href="https://www.kitchenarykart.com/all-subcategories" />
      </Helmet>

      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/60 via-white to-orange-50/30 pointer-events-none" />

      <div className="container-main relative">

        {/* ══ Section header ════════════════════════════════════════ */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-5 bg-[#B91C1C] rounded-full" />
                <div className="w-1 h-3 bg-[#B91C1C]/40 rounded-full" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B91C1C]">
                Shop by Category
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              Featured{" "}
              <span className="text-[#B91C1C]">Categories</span>
            </h2>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              aria-label="Previous"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-gray-200 text-gray-500 shadow-sm hover:border-[#B91C1C] hover:text-[#B91C1C] hover:shadow-md transition-all duration-200"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => sliderRef.current?.slickNext()}
              aria-label="Next"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-gray-200 text-gray-500 shadow-sm hover:border-[#B91C1C] hover:text-[#B91C1C] hover:shadow-md transition-all duration-200"
            >
              <ChevronRight size={16} />
            </button>
            <Link
              to="/all-subcategories"
              className="hidden sm:inline-flex items-center gap-1.5 ml-2 px-4 py-2 bg-[#B91C1C] text-white text-xs font-bold rounded-full hover:bg-red-700 transition-all duration-200 hover:shadow-lg"
            >
              <Grid3X3 size={12} />
              All
            </Link>
          </div>
        </div>

        {/* ══ Slider ════════════════════════════════════════════════ */}
        {loading ? (
          <div className="flex gap-2">
            {[...Array(8)].map((_, i) => <Skeleton key={i} />)}
          </div>
        ) : (
          <Slider ref={sliderRef} {...sliderSettings}>
            {categories.map((cat) => (
              <div key={cat.id} className="px-1.5 outline-none">
                <button
                  onClick={() => go(cat.id, cat.subsubcategoryId)}
                  aria-label={`Browse ${cat.name}`}
                  className="group w-full flex flex-col items-center gap-0 outline-none"
                >
                  {/* Card */}
                  <div
                    className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-100 shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 group-hover:border-[#B91C1C]/30 transition-all duration-300"
                    style={{ maxWidth: "110px", margin: "0 auto" }}
                  >
                    {/* Image */}
                    <img
                      src={cat.image || logo}
                      alt={cat.name}
                      loading="lazy"
                      onError={(e) => { e.target.onerror = null; e.target.src = logo; }}
                      className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-400"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-[#B91C1C]/0 group-hover:bg-[#B91C1C]/[0.06] transition-colors duration-300" />

                    {/* "Shop" badge */}
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-1.5 bg-[#B91C1C] text-white text-[9px] font-black uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-250">
                      Shop
                    </div>
                  </div>

                  {/* Label */}
                  <div className="mt-2.5 text-center px-0.5" style={{ maxWidth: "110px" }}>
                    <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wide leading-tight text-gray-700 group-hover:text-[#B91C1C] transition-colors duration-200 line-clamp-2">
                      {cat.name}
                    </span>
                  </div>
                </button>
              </div>
            ))}
          </Slider>
        )}

        {/* Mobile see-all */}
        <div className="sm:hidden mt-7 text-center">
          <Link
            to="/all-subcategories"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#B91C1C] text-white text-sm font-bold rounded-full hover:bg-red-700 transition-all duration-200"
          >
            See All Categories <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
