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
    <div className="bg-white min-h-screen pt-4 pb-10 px-3 sm:px-6 lg:px-10">
      
      {/* Loading */}
      {loading && (
        <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-5 rounded-xl shadow-lg flex flex-col items-center gap-3">
            <Loader2 className="w-7 h-7 text-[#B91C1C] animate-spin" />
            <span className="text-sm font-medium text-gray-600">
              Loading Categories...
            </span>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto">

        {/* Back */}
        <div className="mb-5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-[#B91C1C] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-sm">Back</span>
          </button>
        </div>

        {/* GRID */}
        {subsubcategories.length > 0 ? (
          <div className="
            grid 
            grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            gap-5 md:gap-7
          ">
            {subsubcategories.map((subsub) => (
              <div
                key={subsub.id}
                onClick={() => handleSubsubcategoryClick(subsub.id)}
                className="cursor-pointer group"
              >
                {/* TILE */}
                <div>

                  {/* SQUARE IMAGE */}
                  <div className="w-full aspect-square bg-gray-100 flex items-center justify-center p-4 overflow-hidden">
                    <img
                      src={subsub.image || logo}
                      alt={subsub.name}
                      className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = logo;
                      }}
                    />
                  </div>

                  {/* TEXT */}
                  <div className="pt-3 px-1">
                    <h3 className="relative inline-block text-sm sm:text-base font-medium text-gray-800">
                      {subsub.name}

                      {/* underline animation */}
                      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#B91C1C] transition-all duration-300 group-hover:w-full"></span>
                    </h3>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : !loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <PackageX className="w-10 h-10 text-gray-400 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              No Categories Found
            </h3>
            <p className="text-gray-500 text-sm">
              No subcategories available right now.
            </p>
          </div>
        ) : null}

      </div>
    </div>
  );
}

export default SubsubcategoryPage;