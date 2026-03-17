import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./utils/api";
import logo from "./images/piclogo.png";

/* ─── Loading Skeleton ───────────────────────── */
const LoadingSkeleton = () => (
  <section className="py-10 bg-white border-b border-gray-100">
    <div className="container-main">
      <div className="h-72 rounded-2xl bg-gray-100 animate-pulse" />
    </div>
  </section>
);

/* ─── Navigation helper ─────────────────────── */
const goToSub = (sub, navigate) => {
  if (sub.subsubcategories?.length > 0) {
    navigate(`/subsubcategories/${sub.id}`);
  } else {
    navigate(`/products/subcategory/${sub.id}`);
  }
};

/* ─── MAIN SIMPLE LAYOUT ────────────────────── */
const SimpleCategoryLayout = ({ category, subcategories, navigate }) => {
  const visibleSubs = subcategories.slice(0, 4); // ✅ ONLY 4

  return (
    <section className="py-10 bg-white border-b border-gray-100">
      <div className="w-full px-4 lg:px-8">

        {/* ================= DESKTOP ================= */}
       <div className="hidden lg:grid grid-cols-2 gap-6 items-stretch auto-rows-fr">

          {/* LEFT — MAIN CATEGORY IMAGE */}
          <div
  onClick={() => navigate(`/category/${category.id}/subcategories`)}
  className="relative rounded-2xl overflow-hidden cursor-pointer group h-full"
>
            <img
              src={category.image || logo}
              alt={category.name}
              onError={(e) => { e.target.src = logo; }}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />

            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center text-white">
  <h2 className="text-2xl font-bold">{category.name}</h2>
  <p className="text-sm mt-3 text-black bg-white/90 px-3 py-1 rounded-md shadow-sm">
  View all categories →
</p>
</div>
          </div>

          {/* RIGHT — 4 SUBCATEGORIES */}
          <div className="grid grid-cols-2 gap-4">
            {visibleSubs.map((sub) => (
              <div
                key={sub.id}
                onClick={() => goToSub(sub, navigate)}
                className="cursor-pointer group"
              >
               <div className="rounded-xl overflow-hidden bg-white border border-gray-200 aspect-square hover:border-gray-400 transition">
                  <img
                    src={sub.image || logo}
                    alt={sub.name}
                    onError={(e) => { e.target.src = logo; }}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition duration-300"
                  />
                </div>

                <p className="mt-2 text-sm font-semibold text-gray-800 text-center">
                  {sub.name}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* ================= MOBILE ================= */}
        <div className="lg:hidden space-y-4">

          {/* MAIN IMAGE */}
          <div
            onClick={() => navigate(`/category/${category.id}/subcategories`)}
            className="relative rounded-2xl overflow-hidden cursor-pointer h-full"
          >
            <img
              src={category.image || logo}
              alt={category.name}
              onError={(e) => { e.target.src = logo; }}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-lg font-bold">{category.name}</h2>
            </div>
          </div>

          {/* SUBCATEGORIES */}
          <div className="grid grid-cols-2 gap-3">
            {visibleSubs.map((sub) => (
              <div
                key={sub.id}
                onClick={() => goToSub(sub, navigate)}
                className="cursor-pointer"
              >
                <div className="rounded-lg overflow-hidden bg-gray-100 aspect-square">
                  <img
                    src={sub.image || logo}
                    alt={sub.name}
                    onError={(e) => { e.target.src = logo; }}
                    className="w-full h-full object-contain p-3"
                  />
                </div>

                <p className="mt-1 text-xs font-medium text-center">
                  {sub.name}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

/* ─── MAIN COMPONENT ───────────────────────── */
const CategorySection = ({ apiEndpoint }) => {
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(apiEndpoint)
      .then(({ data }) => {
        setCategory({
          id: data.categoryId,
          name: data.categoryName,
          image: data.categoryImage,
        });
        setSubcategories(data.subcategories || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [apiEndpoint]);

  if (loading) return <LoadingSkeleton />;
  if (!category?.id) return null;

  return (
    <SimpleCategoryLayout
      category={category}
      subcategories={subcategories}
      navigate={navigate}
    />
  );
};

export default CategorySection;