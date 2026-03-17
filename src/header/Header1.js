import React, { useState, useEffect, useCallback } from "react";
import { ShoppingCart, User, Search, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import logoimage from "../images/piclogo.png";
import useStore from "../store/useStore";

const CustomHeader = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const debounceTimerRef = React.useRef(null);

  const { user, setUser, cartCount, setCartCount, wishlistCount, setWishlistCount } = useStore();

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch cart
  const fetchCartCount = useCallback(async () => {
    if (user?.id) {
      try {
        const res = await api.get(`/Cart/index/${user.id}`);
        setCartCount(res.data.items?.length || 0);
      } catch {
        setCartCount(0);
      }
    } else setCartCount(0);
  }, [user, setCartCount]);

  // Fetch wishlist
  const fetchWishlistCount = useCallback(async () => {
    if (user?.id) {
      try {
        const res = await api.get(`/Wishlist/index/${user.id}`);
        setWishlistCount(res.data?.length || 0);
      } catch {
        setWishlistCount(0);
      }
    } else setWishlistCount(0);
  }, [user, setWishlistCount]);

  useEffect(() => {
    fetchCartCount();
    fetchWishlistCount();
  }, [fetchCartCount, fetchWishlistCount]);

  // Search
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (query.trim()) {
      debounceTimerRef.current = setTimeout(() => {
        navigate(`/product?search=${encodeURIComponent(query)}`);
      }, 300);
    } else {
      navigate("/");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    navigate(`/product?search=${encodeURIComponent(searchQuery)}`);
  };

  // Listeners
  useEffect(() => {
    const updateUser = () => {
      setUser(JSON.parse(localStorage.getItem("user")) || null);
    };
    window.addEventListener("userUpdated", updateUser);
    return () => window.removeEventListener("userUpdated", updateUser);
  }, [setUser]);

  useEffect(() => {
    window.addEventListener("cartUpdated", fetchCartCount);
    return () => window.removeEventListener("cartUpdated", fetchCartCount);
  }, [fetchCartCount]);

  useEffect(() => {
    window.addEventListener("wishlistUpdated", fetchWishlistCount);
    return () => window.removeEventListener("wishlistUpdated", fetchWishlistCount);
  }, [fetchWishlistCount]);

  return (
    <header
      className={`sticky top-0 z-[60] bg-white transition-all duration-300 ${
        scrolled ? "shadow-header" : "border-b border-stone-100"
      }`}
    >
    <div className="relative w-full flex items-center h-14 [@media(min-width:990px)]:h-16 gap-4 px-4">

        {/* LEFT */}
       <div className="flex items-center gap-3 phone:flex-1 phone:min-w-0">

          {/* Mobile Logo */}
          <div className="phone:hidden">
            <img src={logoimage} alt="logo" className="h-7" />
          </div>

          {/* Desktop Logo */}
          <a href="/" className="hidden phone:flex items-center phone:flex-shrink-0">
            <img src={logoimage} className="h-10 md:h-12" />
          </a>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden phone:flex w-[220px] md:w-[280px] lg:w-[360px]"
          >
            <div className="flex items-center border bg-[#f5f5f5] w-full h-10">
              <input
                type="text"
                placeholder="What can we help you find?"
                value={searchQuery}
                onChange={handleSearchChange}
                className="flex-1 px-3 text-phone bg-transparent outline-none"
              />
              <button className="bg-black text-white px-3 h-full">
                <Search size={18} />
              </button>
            </div>
          </form>
        </div>

        {/* CENTER */}
        <div className="flex-1 flex justify-center min-w-0 phone:-translate-x-28">
          <span 
           onClick={() => navigate("/")}
           className="text-phone phone:text-xl md:text-2xl font-semibold truncate">
            KITCHENARY KART
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 phone:gap-5">

          {/* Account */}
          <button
            onClick={() => navigate(user ? "/profile" : "/login")}
            className="flex flex-col items-center"
          >
            <User size={18} />
            <span className="hidden phone:block text-xs">Account</span>
          </button>

          {/* Wishlist */}
          <button
            onClick={() => navigate(user ? "/wishlist" : "/login")}
            className="relative flex flex-col items-center"
          >
            <Heart size={18} />
            <span className="hidden phone:block text-xs">Favorites</span>

            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-[9px] min-w-[16px] h-[16px] flex items-center justify-center bg-black text-white rounded-full">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={() => navigate(user ? `/cart/${user.id}` : "/login")}
            className="relative flex flex-col items-center"
          >
            <ShoppingCart size={18} />
            <span className="hidden phone:block text-xs">Cart</span>

            {cartCount > 0 && (
              <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-[9px] min-w-[16px] h-[16px] flex items-center justify-center bg-black text-white rounded-full">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      <div className="phone:hidden px-3 pb-2">
        <form onSubmit={handleSearch}>
          <div className="flex border bg-[#f5f5f5]">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="flex-1 px-3 py-2 text-phone bg-transparent outline-none"
            />
            <button className="bg-black text-white px-3">
              <Search size={18} />
            </button>
          </div>
        </form>
      </div>
    </header>
  );
};

export default CustomHeader;