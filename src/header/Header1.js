import React, { useState, useEffect, useCallback } from "react";
import { ShoppingCart, User, Search, Mic, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import logoimage from "../images/piclogo.png";
import useStore from "../store/useStore";

const CustomHeader = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const debounceTimerRef = React.useRef(null);
  let recognition = null;

  // ── Zustand store ────────────────────────────────────────────────
  const { user, setUser, cartCount, setCartCount, wishlistCount, setWishlistCount } = useStore();

  // ── Scroll shadow ────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Fetch Cart Count ────────────────────────────────────────────
  const fetchCartCount = useCallback(async () => {
    if (user && user.id) {
      try {
        const response = await api.get(`/Cart/index/${user.id}`);
        const items = response.data.items || [];
        setCartCount(items.length);
      } catch {
        setCartCount(0);
      }
    } else {
      setCartCount(0);
    }
  }, [user, setCartCount]);

  // ── Fetch Wishlist Count ────────────────────────────────────────
  const fetchWishlistCount = useCallback(async () => {
    if (user && user.id) {
      try {
        const response = await api.get(`/Wishlist/index/${user.id}`);
        const items = response.data || [];
        setWishlistCount(items.length);
      } catch {
        setWishlistCount(0);
      }
    } else {
      setWishlistCount(0);
    }
  }, [user, setWishlistCount]);

  useEffect(() => {
    fetchCartCount();
    fetchWishlistCount();
  }, [fetchCartCount, fetchWishlistCount]);

  // ── Wishlist update listener ─────────────────────────────────────
  useEffect(() => {
    const handleWishlistUpdate = () => fetchWishlistCount();
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () => window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
  }, [fetchWishlistCount]);

  // ── User update listener ─────────────────────────────────────────
  useEffect(() => {
    const handleUserUpdate = () => {
      const newUser = JSON.parse(localStorage.getItem("user")) || null;
      setUser(newUser);
    };
    window.addEventListener("userUpdated", handleUserUpdate);
    return () => window.removeEventListener("userUpdated", handleUserUpdate);
  }, [setUser]);

  // ── Cart update listener ─────────────────────────────────────────
  useEffect(() => {
    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [fetchCartCount]);

  // ── Search with Debouncing ─────────────────────────────────────
  // Debounced search: waits 300ms after user stops typing
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce navigation - wait 300ms after user stops typing
    if (query.trim()) {
      debounceTimerRef.current = setTimeout(() => {
        navigate(`/product?search=${encodeURIComponent(query)}`);
      }, 300);
    } else {
      navigate("/");
    }
  };

  // Immediate search when user clicks search button or presses Enter
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Cancel any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Navigate immediately
    navigate(`/product?search=${encodeURIComponent(searchQuery)}`);
  };

  // ── Voice Search ────────────────────────────────────────────────
  const startVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support voice search.");
      return;
    }
    recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setSearchQuery(voiceText);

      // Cancel any pending debounce and navigate immediately
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      navigate(`/product?search=${voiceText}`);
    };
    recognition.start();
  };

  // Cleanup debounce timer on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const displayName = user?.username || user?.name || "Account";

  return (
    <header
      className={`sticky top-0 z-[60] bg-white transition-all duration-300 ${
        scrolled
          ? "shadow-header"
          : "border-b border-stone-100"
      }`}
    >
      <div className="container-main">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-5 h-14 sm:h-16">

          {/* ── Logo ───────────────────────────────────────────── */}
          <a
            href="/"
            className="flex-shrink-0 flex items-center"
            aria-label="Kitchenary Kart Home"
          >
            <img
              src={logoimage}
              alt="Kitchenary Kart"
              className="h-8 sm:h-10 md:h-12 w-auto object-contain"
            />
          </a>

          {/* ── Search Bar ─────────────────────────────────────── */}
          <form onSubmit={handleSearch} className="flex-1 min-w-0">
            <div
              className={`flex items-center h-9 sm:h-10 bg-stone-50 rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                searchFocused
                  ? "border-brand shadow-[0_0_0_3px_rgba(185,28,28,0.08)] bg-white"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              <button
                type="submit"
                className="flex-shrink-0 flex items-center justify-center w-8 sm:w-10 h-full text-stone-400 hover:text-brand transition-colors"
                aria-label="Search"
              >
                <Search size={15} />
              </button>

              <input
                type="text"
                className="flex-1 h-full bg-transparent text-xs sm:text-sm font-body text-charcoal placeholder-stone-400 outline-none border-none min-w-0"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />

              <button
                type="button"
                onClick={startVoiceSearch}
                className={`flex-shrink-0 hidden xs:flex items-center justify-center w-8 sm:w-10 h-full transition-colors ${
                  isListening ? "text-brand animate-pulse" : "text-stone-400 hover:text-brand"
                }`}
                aria-label="Voice search"
                title="Voice search"
              >
                <Mic size={14} />
              </button>
            </div>
          </form>

          {/* ── Right Actions ───────────────────────────────────── */}
          <div className="flex-shrink-0 flex items-center gap-0.5 sm:gap-1.5">

            {/* Account — Desktop */}
            <button
              onClick={() => navigate(user ? "/profile" : "/login")}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-charcoal hover:bg-stone-100 transition-colors"
              aria-label={user ? "My Account" : "Login"}
            >
              <User size={18} className="text-stone-500" />
              <span className="hidden md:block max-w-[90px] truncate text-sm">
                {user ? displayName : "Login"}
              </span>
            </button>

            {/* Account — Mobile */}
            <button
              onClick={() => navigate(user ? "/profile" : "/login")}
              className="sm:hidden btn-icon w-8 h-8"
              aria-label={user ? "My Account" : "Login"}
            >
              <User size={18} className="text-stone-500" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigate(user ? "/wishlist" : "/login")}
              className="relative btn-icon w-8 h-8 sm:w-10 sm:h-10"
              aria-label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount})` : ""}`}
            >
              <Heart
                size={18}
                className={
                  wishlistCount > 0 ? "text-brand fill-brand" : "text-stone-500"
                }
              />
              {wishlistCount > 0 && (
                <span className="badge absolute -top-1 -right-1 text-[9px] min-w-[16px] h-[16px]">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate(user ? `/cart/${user.id}` : "/login")}
              className="relative flex items-center gap-1 sm:gap-1.5 pl-2.5 sm:pl-3 pr-3 sm:pr-4 py-1.5 sm:py-2 bg-brand text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-brand-700 transition-all duration-200 hover:shadow-button"
              aria-label={`Cart${cartCount > 0 ? ` (${cartCount})` : ""}`}
            >
              <ShoppingCart size={16} />
              <span className="hidden xs:block">Cart</span>
              {cartCount > 0 && (
                <span className="flex items-center justify-center min-w-[16px] h-[16px] px-1 bg-white text-brand text-[9px] font-bold rounded-full">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomHeader;
