import React, { useEffect, useState } from "react";
import api from "./utils/api";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import logo from "./images/piclogo.png";

const HomeNewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ added
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/product/new_arrivals")
      .then((res) => setProducts(res.data || []))
      .catch((err) => console.error("Fetch failed", err))
      .finally(() => setLoading(false)); // ✅ added
  }, []);

  const visibleProducts = products.slice(0, 8);

  const getImage = (product) =>
    product?.variants?.[0]?.images?.[0] || logo;

  const getPrice = (product) =>
    product?.variants?.[0]?.price || null;

  return (
    <div className="bg-white min-h-screen">

      {/* ─── HERO BANNER ───────────────────── */}
      <section className="relative h-[320px] sm:h-[420px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1600&q=80"
          alt="New Arrivals"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/70" />

        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-white text-3xl sm:text-5xl font-black mb-3">
               Latest Additions
            </h1>
            <p className="text-white/70 text-sm sm:text-base mb-5">
              Fresh products just added to our collection
            </p>

            <button
              onClick={() => navigate("/new-arrivals")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Explore Now
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── PRODUCT GRID ───────────────────── */}
      <section className="py-10 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {loading ? (
            /* ✅ SKELETON */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden aspect-square">
                    <div className="w-full h-full bg-gray-200" />
                  </div>

                  <div className="mt-2 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                  </div>

                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No new arrivals found.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {visibleProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="cursor-pointer group"
                  >
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden aspect-square hover:border-gray-400 transition">
                      <img
                        src={getImage(product)}
                        alt={product.name}
                        onError={(e) => (e.target.src = logo)}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition duration-300"
                      />
                    </div>

                    <p className="mt-2 text-sm font-semibold text-gray-800 text-center line-clamp-2">
                      {product.name}
                    </p>

                    {getPrice(product) && (
                      <p className="text-center text-sm font-bold text-red-600 mt-1">
                        ₹ {Number(getPrice(product)).toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

    </div>
  );
};

export default HomeNewArrivals;