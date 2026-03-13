import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import logo from "../../images/piclogo.png";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Grid3x3 } from "lucide-react";

const CategoryCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-card">
    <div className="skeleton aspect-square" />
    <div className="p-3">
      <div className="skeleton h-3.5 w-3/4 mx-auto rounded" />
    </div>
  </div>
);

function AllSubcategoriesPage() {
  const [subcategories, setSubcategories] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    async function fetchSubcategories() {
      try {
        setLoading(true);
        const response = await api.get(`/subcategory/index`);
        const uniqueSubcategories = response.data.filter(
          (cat, index, self) =>
            index ===
            self.findIndex(
              (c) => c.name.trim().toLowerCase() === cat.name.trim().toLowerCase()
            )
        );
        const sortedSubcategories = [...uniqueSubcategories].sort((a, b) =>
          a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase())
        );
        setSubcategories(sortedSubcategories);
      } catch (error) {
        // silent fail
      } finally {
        setLoading(false);
      }
    }
    fetchSubcategories();
  }, []);

  const handleCategoryClick = (subcategoryId, subsubcategories) => {
    if (Array.isArray(subsubcategories) && subsubcategories.length > 0) {
      navigate(`/subsubcategories/${subcategoryId}`);
    } else {
      navigate(`/products/subcategory/${subcategoryId}`);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <Helmet>
        <title>All Categories | Kitchenary Kart</title>
        <meta
          name="description"
          content="Explore all featured categories of premium kitchen products and HORECA supplies at Kitchenary Kart."
        />
        <link rel="canonical" href="https://www.kitchenarykart.com/all-subcategories" />
      </Helmet>

      <div className="container-main py-8">
        {/* Page header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-stone-200 bg-white text-stone-500 hover:border-brand hover:text-brand transition-colors shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand mb-1">
              Shop by Category
            </p>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-charcoal flex items-center gap-2">
              <Grid3x3 size={24} className="text-brand" />
              All Categories
            </h1>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(18)].map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : subcategories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {subcategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id, category.subsubcategoryId)}
                className="product-card group text-left outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
                aria-label={`Browse ${category.name}`}
              >
                <div className="product-card-image bg-white">
                  <img
                    src={category?.image || logo}
                    alt={category?.name || "Category"}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = logo;
                    }}
                    className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                    style={{
                      objectFit: "contain",
                      padding: "16px",
                    }}
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-body font-semibold text-charcoal text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-brand transition-colors duration-200">
                    {category.name}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Grid3x3 size={48} className="text-stone-200 mx-auto mb-4" />
            <p className="text-stone-400 font-body">No categories available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllSubcategoriesPage;
