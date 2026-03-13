/* eslint-disable jsx-a11y/img-redundant-alt */
/**
 * CategoryProductsPage — "See All" page for main categories (COLD EQUIPMENT, HOT EQUIPMENT, etc.)
 * Shows ALL SUBCATEGORIES from a selected category in a grid layout.
 * 
 * Design matches NewArrivals and MostSelling pages for consistency
 */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import logo from "../../images/piclogo.png";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Eye } from "lucide-react";

const CategoryProductsPage = () => {
  const { slot = 1 } = useParams();
  const slotNum = parseInt(slot, 10);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* Scroll to top on mount */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [slotNum]);

  /* Fetch category and all its subcategories — slot determines the endpoint */
  useEffect(() => {
    setLoading(true);
    const suffix = slotNum === 1 ? "" : String(slotNum);
    api
      .get(`/Selected_category${suffix}/details_with_subcategories`)
      .then((response) => {
        const { categoryId, categoryName, categoryImage, subcategories } =
          response.data;
        setSelectedCategory({ categoryId, categoryName, categoryImage });
        setSubcategories(subcategories || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch category subcategories:", error);
        setLoading(false);
      });
  }, [slotNum]);

  return (
    <div style={{ minHeight: "70vh" }}>
      {selectedCategory && (
        <Helmet>
          <title>{selectedCategory.categoryName} | Kitchenary Kart</title>
          <meta
            name="description"
            content={`Explore ${selectedCategory.categoryName} products and best-selling items at Kitchenary Kart.`}
          />
          <link
            rel="canonical"
            href={`https://www.kitchenarykart.com/category/${selectedCategory.categoryId}`}
          />
          <meta
            property="og:title"
            content={`${selectedCategory.categoryName} | Kitchenary Kart`}
          />
          <meta
            property="og:description"
            content={`Explore ${selectedCategory.categoryName} products and best-selling items at Kitchenary Kart.`}
          />
          <meta
            property="og:url"
            content={`https://www.kitchenarykart.com/category/${selectedCategory.categoryId}`}
          />
          <meta property="og:type" content="website" />
        </Helmet>
      )}

      <section className="relative py-8 sm:py-12 bg-white">
        <div className="px-4 sm:px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-white font-bold text-sm rounded-full"
                style={{
                  background: "linear-gradient(to right, #af2031, rgb(68,11,17))",
                  border: "none",
                }}
              >
                ← Back
              </button>
              {selectedCategory && (
                <div>
                  <p className="text-xs sm:text-sm font-bold text-red-500 uppercase tracking-widest mb-2">
                    Explore Categories
                  </p>
                  <h1 className="text-2xl sm:text-4xl font-black text-gray-900">
                    {selectedCategory.categoryName}
                  </h1>
                </div>
              )}
            </div>
          </div>

          {/* Subcategories Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div
                className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full"
                style={{ borderColor: "#e5e7eb", borderTopColor: "#af2031" }}
              />
            </div>
          ) : subcategories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {subcategories.map((subcategory) => (
                <div
                  key={subcategory.id}
                  onClick={() =>
                    navigate(
                      `/products/category/${selectedCategory.categoryId}/subcategory/${subcategory.id}`
                    )
                  }
                  className="group bg-white rounded-2xl overflow-hidden cursor-pointer relative border-2 border-red-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-red-300 flex flex-col h-full"
                >
                  {/* Badge */}
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-[8px] sm:text-[9px] font-black uppercase tracking-wide rounded-full shadow-md">
                      Category
                    </span>
                  </div>

                  {/* Image container */}
                  <div
                    className="relative bg-gradient-to-br from-gray-50 to-red-50/30 overflow-hidden flex-shrink-0"
                    style={{ aspectRatio: "1/1" }}
                  >
                    <img
                      src={subcategory.image || logo}
                      alt={subcategory.name}
                      loading="lazy"
                      className="w-full h-full transition-transform duration-500 group-hover:scale-110 object-contain p-3 sm:p-4"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = logo;
                      }}
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.04] transition-colors duration-300 flex items-end justify-center pb-2 sm:pb-3 opacity-0 group-hover:opacity-100">
                      <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white text-gray-900 text-[9px] sm:text-[10px] font-bold rounded-full shadow-md uppercase tracking-wide">
                        <Eye size={10} /> View
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-2.5 sm:p-3 flex flex-col flex-grow justify-end">
                    <h5
                      className="font-bold text-gray-900 text-xs sm:text-sm leading-tight text-center line-clamp-2"
                      style={{ minHeight: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      {subcategory.name}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">No subcategories found for this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryProductsPage;
