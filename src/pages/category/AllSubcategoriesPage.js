import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import logo from "../../images/piclogo.png";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Grid3x3 } from "lucide-react";

const CategoryCardSkeleton = () => (
  <div>
    <div className="skeleton aspect-square" />
    <div className="mt-2 h-3.5 w-3/4 mx-auto skeleton rounded" />
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
              (c) =>
                c.name.trim().toLowerCase() ===
                cat.name.trim().toLowerCase()
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
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>All Categories | Kitchenary Kart</title>
        <meta
          name="description"
          content="Explore all featured categories of premium kitchen products and HORECA supplies at Kitchenary Kart."
        />
        <link
          rel="canonical"
          href="https://www.kitchenarykart.com/all-subcategories"
        />
      </Helmet>

      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 py-6">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-stone-200 bg-white text-stone-500 hover:border-[#B91C1C] hover:text-[#B91C1C] transition"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#B91C1C] mb-1">
              Shop by Category
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Grid3x3 size={22} className="text-[#B91C1C]" />
              All Categories
            </h1>
          </div>
        </div>

        {/* GRID */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
            {[...Array(12)].map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : subcategories.length > 0 ? (
          <div className="
            grid 
            grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            gap-5 md:gap-7
          ">
            {subcategories.map((category) => (
              <div
                key={category.id}
                onClick={() =>
                  handleCategoryClick(
                    category.id,
                    category.subsubcategoryId
                  )
                }
                className="cursor-pointer group"
              >
                {/* TILE */}
                <div>

                  {/* IMAGE (SQUARE) */}
                  <div className="w-full aspect-square bg-white-100 flex items-center justify-center p-4 overflow-hidden">
                    <img
                      src={category?.image || logo}
                      alt={category?.name || "Category"}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = logo;
                      }}
                      className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* TEXT */}
                  <div className="pt-3 px-1">
                    <h3 className="relative inline-block text-sm sm:text-base font-medium text-gray-800">
                      {category.name}

                      {/* underline */}
                      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#B91C1C] transition-all duration-300 group-hover:w-full"></span>
                    </h3>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Grid3x3 size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">
              No categories available yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllSubcategoriesPage;