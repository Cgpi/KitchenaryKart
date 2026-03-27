/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { ArrowLeft, ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import emptyWishlistImage from "../images/empty-wishlist.jpg";
import logo from "../images/piclogo.png";
import { Helmet } from "react-helmet-async";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);

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
    return () =>
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
  }, [navigate, user?.id]);

  const fetchWishlist = async (userId) => {
    setLoading(true);
    try {
      const response = await api.get(`/Wishlist/index/${userId}`);
      setWishlistItems(response.data);
    } catch {
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
    } catch {
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
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const renderSkeleton = () => {
    return Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="animate-pulse">
        {/* IMAGE */}
        <div className="bg-gray-200 aspect-square mb-3 rounded" />

        {/* TEXT */}
        <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />

        {/* PRICE */}
        <div className="h-4 bg-gray-300 rounded w-1/3 mb-3" />

        {/* BUTTONS */}
        <div className="flex gap-2">
          <div className="flex-1 h-8 bg-gray-300 rounded" />
          <div className="w-10 h-8 bg-gray-300 rounded" />
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Wishlist | Kitchenary Kart</title>
      </Helmet>

      {/* HEADER */}
      <div className="w-full px-6 md:px-10 lg:px-16 py-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft />
          </button>

          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              ❤️ My Wishlist
            </h1>
            <p className="text-sm text-gray-500">
              {wishlistItems.length} items saved
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {renderSkeleton()}
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <img src={emptyWishlistImage} className="w-40 mx-auto mb-6" />
            <h3 className="text-lg font-semibold">Your wishlist is empty</h3>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-black text-white px-6 py-2"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          /* GRID */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.itemId} className="group">
                {/* IMAGE */}
                <div
                  className="relative bg-white-100 aspect-square mb-3 cursor-pointer"
                  onClick={() =>
                    handleProductClick(item.productId, item.productName)
                  }
                >
                  <img
                    src={item.images || logo}
                    alt={item.productName}
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      e.target.src = logo;
                    }}
                  />
                </div>

                {/* NAME */}
                <p
                  className="text-sm font-medium mb-1 line-clamp-2 cursor-pointer"
                  onClick={() =>
                    handleProductClick(item.productId, item.productName)
                  }
                >
                  {item.productName}
                </p>

                {/* PRICE */}
                <p className="font-semibold mb-3">
                  ₹{Number(item.price).toFixed(2)}
                </p>

                {/* ACTION BUTTONS */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMoveToCart(item.itemId)}
                    className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-2 text-xs font-semibold"
                  >
                    <ShoppingCart size={14} />
                    Move to Cart
                  </button>

                  <button
                    onClick={() => handleRemove(item.itemId)}
                    className="px-3 border border-gray-300 hover:bg-red-50"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
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
