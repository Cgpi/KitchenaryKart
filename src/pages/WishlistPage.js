import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Trash2, ShoppingCart, Heart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import emptyWishlistImage from "../images/empty-wishlist.jpg";
import logo from "../images/piclogo.png";
import { Helmet } from "react-helmet-async";

// ── Skeleton ───────────────────────────────────────────────────────────
const WishlistSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-card p-4">
    <div className="flex gap-4">
      <div className="skeleton w-24 h-24 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2.5">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-5 w-1/4 rounded" />
      </div>
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────
const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (user && user.id) {
      fetchWishlist(user.id);
    } else {
      navigate("/login");
    }
    const handleWishlistUpdate = () => {
      if (user && user.id) fetchWishlist(user.id);
    };
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () => window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
  }, [navigate, user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchWishlist = async (userId) => {
    setLoading(true);
    try {
      const response = await api.get(`/Wishlist/index/${userId}`);
      setWishlistItems(response.data);
    } catch (error) {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId, productName) => {
    navigate(`/product/${productId}?name=${encodeURIComponent(productName)}`);
  };

  const handleRemove = async (itemId) => {
    setLoading(true);
    try {
      await api.delete(`/Wishlist/remove`, {
        params: { userId: user.id, itemId },
      });
      fetchWishlist(user.id);
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToCart = async (itemId) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("itemId", itemId);
      await api.post(`/Wishlist/move_to_cart`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchWishlist(user.id);
      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <Helmet>
        <title>Wishlist | Kitchenary Kart</title>
        <meta
          name="description"
          content="View all the products you've added to your Wishlist on Kitchenary Kart."
        />
        <link rel="canonical" href="https://www.kitchenarykart.com/wishlist" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* ── Loading overlay ───────────────────────────────── */}
      {loading && (
        <div className="fixed inset-0 z-[500] bg-black/40 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-brand/30 border-t-brand rounded-full animate-spin" />
        </div>
      )}

      <div className="container-main py-8">
        {/* ── Page header ─────────────────────────────────── */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-stone-200 bg-white text-stone-500 hover:border-brand hover:text-brand transition-colors shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-charcoal flex items-center gap-2">
              <Heart size={24} className="text-brand fill-brand" />
              My Wishlist
            </h1>
            <p className="text-sm text-stone-500 mt-0.5">
              {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
            </p>
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────── */}
        {loading && wishlistItems.length === 0 ? (
          <div className="space-y-3">
            <WishlistSkeleton />
            <WishlistSkeleton />
            <WishlistSkeleton />
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-12 text-center max-w-md mx-auto">
            {emptyWishlistImage ? (
              <img
                src={emptyWishlistImage}
                alt="Empty Wishlist"
                className="w-40 mx-auto mb-6 opacity-80"
              />
            ) : (
              <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Heart size={36} className="text-stone-300" />
              </div>
            )}
            <h3 className="font-display font-bold text-xl text-charcoal mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-stone-500 font-body text-sm mb-6">
              Explore our collection and save items you love.
            </p>
            <button onClick={() => navigate("/")} className="btn-primary">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {wishlistItems.map((item) => (
              <div
                key={item.itemId}
                className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 p-4"
              >
                <div className="flex gap-4 items-start">
                  {/* Product image */}
                  <div
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-stone-50 border border-stone-100 flex-shrink-0 cursor-pointer"
                    onClick={() => handleProductClick(item.productId, item.productName)}
                  >
                    <img
                      src={item.images || logo}
                      alt={item.productName}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => { e.target.onerror = null; e.target.src = logo; }}
                    />
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-body font-semibold text-charcoal text-sm sm:text-base leading-snug line-clamp-2 mb-1 cursor-pointer hover:text-brand transition-colors"
                      onClick={() => handleProductClick(item.productId, item.productName)}
                    >
                      {item.productName}
                    </h3>

                    {/* Variant info */}
                    {(item.color || item.otherDimensions) && (
                      <p className="text-xs text-stone-400 font-body mb-2">
                        {item.color && `Color: ${item.color}`}
                        {item.color && item.otherDimensions && " · "}
                        {item.otherDimensions && `Variant: ${item.otherDimensions}`}
                      </p>
                    )}

                    {/* Price */}
                    <p className="font-bold text-brand text-sm sm:text-base mb-3">
                      ₹{Number(item.price).toFixed(2)}
                    </p>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleMoveToCart(item.itemId)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand text-white text-xs font-bold rounded-xl hover:bg-brand-700 transition-all duration-200 hover:shadow-button"
                      >
                        <ShoppingCart size={14} />
                        Move to Cart
                      </button>
                      <button
                        onClick={() => handleRemove(item.itemId)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-500 border border-stone-200 rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-brand transition-all"
                      >
                        <Trash2 size={13} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;



