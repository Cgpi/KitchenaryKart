/**
 * ProductCarousel Component
 * Reusable carousel for displaying products in a slider
 */

import React, { useRef, useMemo, forwardRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ProductSkeleton } from "./ProductSkeleton";

// Add CSS for spacing between carousel slides
const carouselStyles = `
  .slick-slide {
    padding: 0 16px !important;
  }
  .slick-list {
    margin: 0 -16px !important;
  }
`;

if (typeof document !== "undefined" && !document.getElementById("carousel-styles")) {
  const styleElement = document.createElement("style");
  styleElement.id = "carousel-styles";
  styleElement.innerHTML = carouselStyles;
  document.head.appendChild(styleElement);
}

export const ProductCarousel = forwardRef(({
  products,
  loading,
  onProductClick,
  getFirstAvailableVariant,
  renderProduct,
  className = "",
}, ref) => {
  const localSliderRef = useRef(null);
  const sliderRef = ref || localSliderRef;

  const sliderSettings = useMemo(
    () => ({
      infinite: true,
      arrows: false,
      speed: 500,
      slidesToScroll: 1,
      centerMode: false,
      autoplay: true,
      autoplaySpeed: 2800,
      slidesToShow: Math.min(5, products.length || 5),
      responsive: [
        {
          breakpoint: 1280,
          settings: { slidesToShow: Math.min(4, products.length || 4) },
        },
        {
          breakpoint: 1024,
          settings: { slidesToShow: Math.min(3, products.length || 3) },
        },
        {
          breakpoint: 640,
          settings: { slidesToShow: Math.min(2, products.length || 2) },
        },
        { breakpoint: 380, settings: { slidesToShow: 1 } },
      ],
    }),
    [products.length]
  );

  if (!loading && products.length === 0) return null;

  return (
    <div className={`carousel-wrapper ${className}`}>
      {loading ? (
        <div className="flex gap-4">
          {[...Array(5)].map((_, i) => (
            <ProductSkeleton key={i} variant="card" />
          ))}
        </div>
      ) : (
        <Slider ref={sliderRef} {...sliderSettings}>
          {products.map((product) => (
            <div key={product.id} onClick={() => onProductClick(product)} className="h-full flex flex-col">
              <div className="h-full flex flex-col">
                {renderProduct(product, getFirstAvailableVariant)}
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
});

ProductCarousel.displayName = "ProductCarousel";
