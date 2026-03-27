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
          (c, i, self) => i === self.findIndex((x) => x.name === c.name),
        );
        unique.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(unique);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const go = (id, subsubcategories) => {
    if (Array.isArray(subsubcategories) && subsubcategories.length > 0) {
      navigate(`/subsubcategories/${id}`);
    } else {
      navigate(`/products/subcategory/${id}`);
    }
  };
  const NextArrow = ({ onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`hidden lg:flex absolute top-1/2 right-2 -translate-y-1/2 w-8 h-16 bg-gray-100  text-black shadow-md items-center justify-center transition-all z-20
      ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 hover:text-black"}`}
    >
      <ChevronRight size={24} />
    </button>
  );

  const PrevArrow = ({ onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`hidden lg:flex absolute top-1/2 left-2 -translate-y-1/2 w-8 h-16 bg-gray-100  text-black shadow-md items-center justify-center transition-all z-20
      ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 hover:text-black"}`}
    >
      <ChevronLeft size={24} />
    </button>
  );

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true, // enable arrows
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    draggable: true,
    swipeToSlide: true,
    touchThreshold: 100,
    cssEase: "ease-out",
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3.2 } },
      { breakpoint: 768, settings: { slidesToShow: 2.2, arrows: false } }, // hide arrows on smaller
      { breakpoint: 480, settings: { slidesToShow: 1.2, arrows: false } },
    ],
  };
  return (
    <section className="relative py-10 sm:py-14 overflow-hidden bg-gray">
      <Helmet>
        <title>Featured Categories | Kitchenary Kart</title>
        <meta
          name="description"
          content="Browse featured kitchen categories at Kitchenary Kart."
        />
        <link
          rel="canonical"
          href="https://www.kitchenarykart.com/all-subcategories"
        />
      </Helmet>

      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/60 via-white to-orange-50/30 pointer-events-none" />

      <div className="w-full pl-6 pr-0 lg:pl-10 lg:pr-0 relative">
        {/* ══ Slider ════════════════════════════════════════════════ */}
        {loading ? (
          <div className="flex gap-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} />
            ))}
          </div>
        ) : (
          <Slider ref={sliderRef} {...sliderSettings}>
            {categories.map((cat) => (
              <div key={cat.id} className="px-2 flex-shrink-0">
                <div
                  onClick={() => go(cat.id, cat.subsubcategoryId)}
                  className="group cursor-pointer"
                >
                  <div className="w-full h-[300px] sm:h-[360px] md:h-[420px] lg:h-[460px] overflow-hidden bg-[#f5f5f5] ">
                    <img
                      src={cat.image || logo}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-[12px] sm:text-[13px] md:text-[14px] tracking-[0.10em] uppercase text-[#222] font-medium">
                      SHOP {cat.name} →
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}

        {/* Mobile see-all */}
        <div className="phone:hidden mt-7 text-center">
          <Link
            to="/all-subcategories"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gray-300 text-black text-sm font-bold rounded-full hover:bg-gray-700 transition-all duration-200"
          >
            See All Categories <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
