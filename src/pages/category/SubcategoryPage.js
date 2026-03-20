import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import api from '../../utils/api';
import logo from '../../images/piclogo.png';

/* ─── Skeleton card ─────────────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
    <div className="aspect-square bg-stone-100" />
    <div className="p-3 flex flex-col items-center gap-2">
      <div className="h-3 w-3/4 bg-stone-200 rounded" />
      <div className="h-3 w-1/2 bg-stone-100 rounded" />
    </div>
  </div>
);

/* ─── Main component ─────────────────────────────────────────────────────── */
function SubcategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subcategories, setSubcategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);

  /* scroll to top on mount */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  /* fetch subcategories */
  useEffect(() => {
    async function fetchSubcategories() {
      setLoading(true);
      try {
        const res = await api.get(`/subcategory/category/${id}`);
        let data = res.data.data || [];

        data.sort((a, b) =>
          a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase(), 'en', {
            numeric: true,
            sensitivity: 'base',
          })
        );

        setSubcategories(data);
        if (data.length > 0) setCategoryName(data[0].category_name);
        else setCategoryName('');
      } catch (_) {
        /* silent */
      } finally {
        setLoading(false);
      }
    }
    fetchSubcategories();
  }, [id]);

  /* navigate on card click */
  const handleClick = async (categoryId, subcategoryId) => {
    setNavigating(true);
    try {
      const res = await api.get(`/subsubcategory/subcategory/${subcategoryId}`);
      if (!res.data || res.data.length === 0) {
        navigate(`/products/category/${categoryId}/subcategory/${subcategoryId}`);
      } else {
        navigate(`/subcategory/category/${categoryId}/subcategory/${subcategoryId}`);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        navigate(`/products/category/${categoryId}/subcategory/${subcategoryId}`);
      }
    } finally {
      setNavigating(false);
    }
  };

  const skeletonCount = 8;

  return (
    <>
      <Helmet>
        <title>{categoryName ? `${categoryName} | Kitchenary Kart` : 'Categories | Kitchenary Kart'}</title>
        <meta
          name="description"
          content={`Browse all subcategories under ${categoryName} at Kitchenary Kart.`}
        />
      </Helmet>

      {/* Full-screen navigation overlay */}
      {navigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin" />
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
       <div className="max-w-[1500px] mx-auto px-2 sm:px-4 lg:px-6 py-6 sm:py-8">

          {/* ── Page header ────────────────────────────────────────── */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <button
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 rounded-xl flex items-center justify-center
                         border border-stone-200 bg-white text-stone-500
                         hover:border-red-700 hover:text-red-700
                         transition-colors duration-200 shadow-sm"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-red-700 mb-0.5">
                Shop by Category
              </p>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                {categoryName || 'Categories'}
              </h1>
            </div>
          </div>

          {/* ── Grid ───────────────────────────────────────────────── */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
              {[...Array(skeletonCount)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : subcategories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
              {subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleClick(id, sub.id)}
                  aria-label={`Browse ${sub.name}`}
                 className="group cursor-pointer"
                >
                  {/* Image */}
                  <div className="w-full aspect-square bg-white flex items-center justify-center p-2 sm:p-3 overflow-hidden">
                    <img
                      src={sub.image || logo}
                      alt={sub.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = logo;
                      }}
                      className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Label */}
                  <div className="pt-3 px-1">
  <h3 className="relative inline-block text-sm sm:text-base font-medium text-gray-800">
  {sub.name}

  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#B91C1C] transition-all duration-300 group-hover:w-full"></span>
</h3>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-24 text-center text-stone-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-14 h-14 mb-4 opacity-30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              <p className="text-sm font-medium">No subcategories available</p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default SubcategoryPage;
