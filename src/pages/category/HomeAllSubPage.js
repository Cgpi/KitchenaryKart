/* eslint-disable jsx-a11y/img-redundant-alt */
/**
 * HomeAllSubPage — unified product listing page for all 5 "all-products" routes.
 * Props:
 *   slot (number 1–5) — determines which backend endpoint to call.
 *
 * All backend API logic is UNTOUCHED from the original HomeAllSub1–5 files.
 * UI is made fully responsive (mobile-first) and dead state variables removed.
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import logo from "../../images/piclogo.png";
import { Helmet } from "react-helmet-async";

/* ── Color helpers (kept from HomeAllSub2–5, commented-out swatch block preserved) ── */
// const getUniqueColors = (variants) => {
//   const colors = variants
//     .filter((v) => v.color && v.stock > 0)
//     .map((v) => v.color.trim());
//   return [...new Set(colors)];
// };
// const colorMap = { "rose gold": "#da9f9f" };
// const getColorCode = (colorName) => colorMap[colorName.toLowerCase()] || colorName;
// const getUniqueOtherDimensions = (variants) => {
//   const dims = variants.filter((v) => v.otherDimensions && v.stock > 0).map((v) => v.otherDimensions);
//   return [...new Set(dims)];
// };

const RANGE_STYLE = `
  input[type=range]::-webkit-slider-thumb {
    pointer-events: all;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: linear-gradient(to right, rgba(186,56,56,1), rgba(57,4,12,1)) !important;
    border: 2px solid #fff;
    cursor: pointer;
    appearance: none;
    margin-top: -6px;
  }
  input[type=range]::-moz-range-thumb {
    pointer-events: all;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: linear-gradient(to right, rgba(186,56,56,1), rgba(57,4,12,1)) !important;
    border: 2px solid #fff;
    cursor: pointer;
  }
`;

const HomeAllSubPage = ({ slot = 1 }) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [priceRange, setPriceRange] = useState([0, 250000]);

  const navigate = useNavigate();

  /* Scroll to top on mount */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  /* Fetch — slot determines the endpoint (backend logic UNTOUCHED) */
  useEffect(() => {
    const suffix = slot === 1 ? "" : String(slot);
    api
      .get(`/Selected_subcategory${suffix}/details_with_subcategories`)
      .then((response) => {
        const { subcategoryId, subcategoryName, subcategoryImage, products } =
          response.data;
        setSelectedSubcategory({ subcategoryId, subcategoryName, subcategoryImage });
        setProducts(products || []);
      })
      .catch(() => { });
  }, [slot]);

  const handleSortChange = (e) => setSortOrder(e.target.value);

  /* Filter logic — unified best version from HomeAllSub2–5 */
  const filteredProducts = (products || []).filter((product) => {
    if (!Array.isArray(product.variants) || product.variants.length === 0)
      return false;
    return product.variants.some((variant) => {
      const price = variant.price || 0;
      return (
        price >= priceRange[0] &&
        price <= priceRange[1] &&
        variant.stock > 0
      );
    });
  });

  const getFirstAvailableVariant = (variants) =>
    variants.find((v) => v.stock > 0) || null;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const pa = a.variants?.[0]?.price || 0;
    const pb = b.variants?.[0]?.price || 0;
    return sortOrder === "asc" ? pa - pb : sortOrder === "desc" ? pb - pa : 0;
  });

  const handleProductClick = (productId, productName) => {
    navigate(`/product/${productId}?name=${encodeURIComponent(productName)}`);
  };

  return (
    <div className="container my-4 my-md-5" style={{ minHeight: "70vh" }}>
      {selectedSubcategory && (
        <Helmet>
          <title>{selectedSubcategory.subcategoryName} | Kitchenary Kart</title>
          <meta
            name="description"
            content={`Explore ${selectedSubcategory.subcategoryName} products, new arrivals, and best-selling items at Kitchenary Kart.`}
          />
          <link
            rel="canonical"
            href={`https://www.kitchenarykart.com/category/${selectedSubcategory.subcategoryId}`}
          />
          <meta
            property="og:title"
            content={`${selectedSubcategory.subcategoryName} | Kitchenary Kart`}
          />
          <meta
            property="og:description"
            content={`Explore ${selectedSubcategory.subcategoryName} products, new arrivals, and best-selling items at Kitchenary Kart.`}
          />
          <meta
            property="og:url"
            content={`https://www.kitchenarykart.com/category/${selectedSubcategory.subcategoryId}`}
          />
          <meta property="og:type" content="website" />
        </Helmet>
      )}

      <button
        onClick={() => navigate(-1)}
        className="btn btn-sm mb-3"
        style={{
          background: "linear-gradient(to right, #af2031, rgb(68,11,17))",
          border: "none",
          color: "white",
        }}
      >
        &larr; Back
      </button>

      {selectedSubcategory && (
        <div className="text-center mb-3">
          <h1 className="fs-4 fw-bold">{selectedSubcategory.subcategoryName}</h1>
        </div>
      )}

      {/* ── Filters ─────────────────────────────────────────────────── */}
      <div className="mb-3" style={{ maxWidth: "600px" }}>
        <div className="d-flex flex-wrap gap-2">
          {/* Sort */}
          <div className="flex-grow-1" style={{ minWidth: "130px" }}>
            <select
              id={`sortOrder-${slot}`}
              className="form-select form-select-sm"
              onChange={handleSortChange}
              value={sortOrder}
            >
              <option value="">Sort by price</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>

          {/* Price range slider */}
          <div className="flex-grow-1" style={{ minWidth: "150px" }}>
            <label
              htmlFor={`priceRange-${slot}`}
              style={{ fontSize: "0.82rem", display: "block", marginBottom: "2px" }}
            >
              ₹{priceRange[0].toLocaleString("en-IN")} – ₹{priceRange[1].toLocaleString("en-IN")}
            </label>
            <div style={{ position: "relative", height: "30px" }}>
              {/* Track background */}
              <div
                style={{
                  position: "absolute",
                  top: "40%",
                  transform: "translateY(-50%)",
                  height: "6px",
                  width: "100%",
                  background: "#ddd",
                  borderRadius: "3px",
                }}
              />
              {/* Track fill */}
              <div
                style={{
                  position: "absolute",
                  top: "40%",
                  transform: "translateY(-50%)",
                  left: `${(priceRange[0] / 250000) * 100}%`,
                  width: `${((priceRange[1] - priceRange[0]) / 250000) * 100}%`,
                  height: "6px",
                  background:
                    "linear-gradient(to right, rgba(186,56,56,1), rgba(57,4,12,1))",
                  borderRadius: "3px",
                }}
              />
              <input
                type="range"
                id={`priceRange-${slot}`}
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
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  pointerEvents: "none",
                  appearance: "none",
                  height: "30px",
                  background: "transparent",
                }}
              />
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
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  pointerEvents: "none",
                  appearance: "none",
                  height: "30px",
                  background: "transparent",
                }}
              />
              <style>{RANGE_STYLE}</style>
            </div>
          </div>
        </div>
      </div>

      {/* ── Product grid ──────────────────────────────────────────────── */}
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 gx-2 gy-3">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => {
            const currentVariant = getFirstAvailableVariant(product.variants);

            return (
              <div key={product.id} className="px-1">
                <div
                  className="card shadow-sm h-100"
                  onClick={() => handleProductClick(product.id, product.name)}
                  style={{
                    cursor: "pointer",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  {/* Subcategory label */}
                  <p
                    className="card-text px-2 pt-2 mb-0"
                    style={{ fontSize: "0.78rem", color: "#555" }}
                  >
                    {product.subcategories && product.subcategories.length > 0
                      ? product.subcategories[0].name.length > 20
                        ? product.subcategories[0].name.substring(0, 17) + "..."
                        : product.subcategories[0].name
                      : ""}
                  </p>

                  {/* Product image */}
                  <div
                    className="image-container"
                    style={{ aspectRatio: "1", overflow: "hidden", padding: "8px" }}
                  >
                    <img
                      src={
                        currentVariant?.images?.length > 0
                          ? currentVariant.images[0]
                          : logo
                      }
                      alt={currentVariant?.name || product.name}
                      loading="lazy"
                      className="card-img-top"
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>

                  {/* Card body */}
                  <div className="card-body p-2">
                    <h5
                      className="card-title mb-1"
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: "bold",
                        minHeight: "44px",
                        lineHeight: "1.35",
                      }}
                    >
                      {product.name.length > 60
                        ? `${product.name.substring(0, 60)}...`
                        : product.name}
                    </h5>

                    {/* Price */}
                    <hr className="my-1" />
                    <span
                      className="product-price d-block"
                      style={{ fontSize: "0.82rem" }}
                    >
                      ₹{" "}
                      {currentVariant
                        ? new Intl.NumberFormat("en-IN").format(
                          currentVariant.price_excluding_tax
                        )
                        : "N/A"}{" "}
                      <span style={{ fontSize: "0.65rem", color: "#666" }}>
                        excl. GST
                      </span>
                    </span>
                    <span
                      className="d-block"
                      style={{ fontSize: "0.68rem", color: "gray" }}
                    >
                      ₹{" "}
                      {currentVariant
                        ? new Intl.NumberFormat("en-IN").format(
                          currentVariant.price
                        )
                        : "N/A"}{" "}
                      incl. GST
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-12">
            <p className="text-muted">No products found for this subcategory.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeAllSubPage;
