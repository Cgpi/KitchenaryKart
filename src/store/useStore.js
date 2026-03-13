import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      // ── User ─────────────────────────────────────────────────────────────
      user: null,
      setUser: (userData) => set({ user: userData }),
      clearUser: () => set({ user: null, cartCount: 0, wishlistCount: 0 }),

      // ── Cart ─────────────────────────────────────────────────────────────
      cartCount: 0,
      cartItems: [], // NEW: store actual cart items
      setCartCount: (count) => set({ cartCount: count }),
      incrementCart: () => set((s) => ({ cartCount: s.cartCount + 1 })),
      decrementCart: () =>
        set((s) => ({ cartCount: Math.max(0, s.cartCount - 1) })),
      setCartItems: (items) => set({ cartItems: items }),
      addToCart: (item) =>
        set((s) => ({ cartItems: [...s.cartItems, item] })),
      removeFromCart: (itemId) =>
        set((s) => ({
          cartItems: s.cartItems.filter((item) => item.id !== itemId),
        })),

      // ── Wishlist ──────────────────────────────────────────────────────────
      wishlistCount: 0,
      wishlistItems: [], // NEW: store actual wishlist items
      setWishlistCount: (count) => set({ wishlistCount: count }),
      toggleWishlistItem: (isInWishlist) =>
        set((s) => ({
          wishlistCount: isInWishlist
            ? Math.max(0, s.wishlistCount - 1)
            : s.wishlistCount + 1,
        })),
      setWishlistItems: (items) => set({ wishlistItems: items }),
      addToWishlist: (itemId) =>
        set((s) => ({
          wishlistItems: [...s.wishlistItems, itemId],
          wishlistCount: s.wishlistCount + 1,
        })),
      removeFromWishlist: (itemId) =>
        set((s) => ({
          wishlistItems: s.wishlistItems.filter((id) => id !== itemId),
          wishlistCount: Math.max(0, s.wishlistCount - 1),
        })),

      // ── Product Filters (NEW - non-breaking addition) ──────────────────
      filters: {
        category: null,
        priceRange: [0, 10000],
        sort: "popularity",
        search: "",
      },
      setFilters: (newFilters) =>
        set((s) => ({ filters: { ...s.filters, ...newFilters } })),
      resetFilters: () =>
        set({
          filters: {
            category: null,
            priceRange: [0, 10000],
            sort: "popularity",
            search: "",
          },
        }),

      // ── UI State (NEW - non-breaking addition) ─────────────────────────
      uiState: {
        sidebarOpen: false,
        activeModal: null,
        notifications: [],
      },
      updateUIState: (updates) =>
        set((s) => ({
          uiState: { ...s.uiState, ...updates },
        })),
      addNotification: (notification) =>
        set((s) => ({
          uiState: {
            ...s.uiState,
            notifications: [...s.uiState.notifications, notification],
          },
        })),
      removeNotification: (notificationId) =>
        set((s) => ({
          uiState: {
            ...s.uiState,
            notifications: s.uiState.notifications.filter(
              (n) => n.id !== notificationId
            ),
          },
        })),
    }),
    {
      name: "kitchenart-store",
      partialize: (state) => ({
        // Only persist these fields to localStorage
        user: state.user,
        cartCount: state.cartCount,
        cartItems: state.cartItems,
        wishlistCount: state.wishlistCount,
        wishlistItems: state.wishlistItems,
        filters: state.filters,
      }),
    }
  )
);

export default useStore;
