import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, PackageX } from 'lucide-react';
import api from '../../utils/api';
import logo from '../../images/piclogo.png';

function SubsubcategoryPage() {
  const { categoryId, subcategoryId } = useParams();
  const [subsubcategories, setSubsubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSubsubcategories() {
      try {
        setLoading(true);
        const response = await api.get(`/subsubcategory/subcategory/${subcategoryId}`);
        setSubsubcategories(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch sub-subcategories:", error);
      } finally {
        setLoading(false);
      }
    }

    if (subcategoryId) {
      fetchSubsubcategories();
    }
  }, [subcategoryId]);

  const handleSubsubcategoryClick = (subsubcategoryId) => {
    navigate(
      `/products/category/${categoryId}/subcategory/${subcategoryId}/subsubcategory/${subsubcategoryId}`
    );
  };

  return (
    <div className="bg-stone-50 min-h-screen pt-4 pb-12 sm:pt-6 sm:pb-16 px-4 sm:px-6 lg:px-8">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[9999] bg-stone-900/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-5 rounded-2xl shadow-xl flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#B91C1C] animate-spin" />
            <span className="text-sm font-semibold text-stone-600">Loading Categories...</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col h-full">
        {/* Header & Back Button */}
        <div className="mb-6 sm:mb-8 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-4 py-2 bg-white text-stone-700 font-semibold rounded-xl border border-stone-200 shadow-sm hover:border-[#B91C1C] hover:text-[#B91C1C] hover:shadow-md transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back
          </button>
        </div>

        {/* Dynamic Grid Layout */}
        {subsubcategories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5 lg:gap-6">
            {subsubcategories.map((subsub) => (
              <div
                key={subsub.id}
                onClick={() => handleSubsubcategoryClick(subsub.id)}
                className="group cursor-pointer bg-white border border-stone-100 rounded-2xl md:rounded-3xl shadow-sm hover:shadow-xl hover:border-[#B91C1C]/30 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden"
              >
                {/* Image Section */}
                <div className="relative w-full aspect-square bg-[#F8F9FA] p-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={subsub.image || logo}
                    alt={subsub.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-sm"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = logo;
                    }}
                  />
                  {/* Subtle hover overlay to make it look premium */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-300" />
                </div>

                {/* Content Section */}
                <div className="p-3 sm:p-4 sm:pt-4 flex-grow flex flex-col justify-center">
                  {/* Category Name */}
                  <h3 className="text-[13px] sm:text-[15px] leading-tight sm:leading-snug font-bold text-stone-800 text-center group-hover:text-[#B91C1C] transition-colors line-clamp-2">
                    {subsub.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        ) : !loading ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-sm border border-stone-100 flex-grow text-center mt-4">
            <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4">
              <PackageX className="w-8 h-8 text-stone-400" />
            </div>
            <h3 className="text-lg font-bold text-stone-800 mb-2">No Categories Found</h3>
            <p className="text-stone-500 max-w-sm text-sm">
              There are no nested categories available under this section at the moment.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default SubsubcategoryPage;

