/**
 * Route Configuration
 * Centralized reference for all application routes
 * This file documents the current routes; Route components stay in App.js
 * to avoid breaking existing Layout/Layout-wrapping structure
 */

export const ROUTES = {
  // Public Routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/user-registration",
  PROFILE: "/profile",

  // Protected Routes
  WISHLIST: "/wishlist",
  CART: "/cart",
  CHECKOUT: "/checkout",
  MY_ORDERS: "/profile/myorder",
  ACCOUNT_SETTINGS: "/profile/accountsetting",
  ORDER_SUCCESS: "/order-success",

  // Policy Pages
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_POLICY: "/terms-policy",
  SHIPPING_POLICY: "/shipping-policy",
  PRICING_POLICY: "/pricing-policy",
  CANCELLATION_POLICY: "/cancellation-policy",

  // Product & Category Pages
  PRODUCT_DETAILS: "/product/:id",
  SEARCH_PRODUCTS: "/product",
  NEW_ARRIVALS: "/new-arrivals",
  MOST_SELLING: "/most-selling-all",
  ALL_PRODUCTS: "/all-products",
  ALL_PRODUCTS_SLOT_2: "/all-products2",
  ALL_PRODUCTS_SLOT_3: "/all-products3",
  ALL_PRODUCTS_SLOT_4: "/all-products4",
  ALL_PRODUCTS_SLOT_5: "/all-products5",

  // Category Navigation
  ALL_SUBCATEGORIES: "/all-subcategories",
  PRODUCTS_BY_CATEGORY: "/products/category/:categoryId",
  PRODUCTS_BY_SUBCATEGORY:
    "/products/category/:categoryId/subcategory/:subcategoryId",
  PRODUCTS_BY_SUBSUBCATEGORY:
    "/products/category/:categoryId/subcategory/:subcategoryId/subsubcategory/:subsubcategoryId",
  SUBSUBCATEGORIES: "/subsubcategories/:subcategoryId",
};

/**
 * Helper functions to generate URLs
 */

export const getProductDetailsUrl = (productId) => `/product/${productId}`;

export const getProductsByCategoryUrl = (categoryId) =>
  `/products/category/${categoryId}`;

export const getProductsBySubcategoryUrl = (categoryId, subcategoryId) =>
  `/products/category/${categoryId}/subcategory/${subcategoryId}`;

export const getProductsBySubsubcategoryUrl = (
  categoryId,
  subcategoryId,
  subsubcategoryId
) =>
  `/products/category/${categoryId}/subcategory/${subcategoryId}/subsubcategory/${subsubcategoryId}`;

export const getSubsubcategoriesUrl = (subcategoryId) =>
  `/subsubcategories/${subcategoryId}`;

export const getCartUrl = (userId) => (userId ? `/cart/${userId}` : "/cart");

export const getCheckoutUrl = (userId) =>
  userId ? `/checkout/${userId}` : "/checkout";

export const getHomeAllProductsUrl = (slot = 1) =>
  slot === 1 ? "/all-products" : `/all-products${slot}`;

/**
 * Meta information for routes (titles, descriptions, etc.)
 */

export const ROUTE_META = {
  [ROUTES.HOME]: {
    title: "Kitchenary Kart — Premium Kitchen & HORECA Supplies",
    description:
      "Your one-stop destination for premium kitchen essentials and HORECA supplies. Shop deep fryers, cookware, serving equipment and more.",
  },
  [ROUTES.LOGIN]: {
    title: "Login | Kitchenary Kart",
  },
  [ROUTES.REGISTER]: {
    title: "Register | Kitchenary Kart",
  },
  [ROUTES.WISHLIST]: {
    title: "Wishlist | Kitchenary Kart",
  },
  [ROUTES.CART]: {
    title: "Cart | Kitchenary Kart",
  },
  [ROUTES.CHECKOUT]: {
    title: "Checkout | Kitchenary Kart",
  },
  [ROUTES.MY_ORDERS]: {
    title: "My Orders | Kitchenary Kart",
  },
  [ROUTES.ACCOUNT_SETTINGS]: {
    title: "Account Settings | Kitchenary Kart",
  },
  [ROUTES.ORDER_SUCCESS]: {
    title: "Order Placed | Kitchenary Kart",
  },
  [ROUTES.PRIVACY_POLICY]: {
    title: "Privacy Policy | Kitchenary Kart",
  },
  [ROUTES.TERMS_POLICY]: {
    title: "Terms & Conditions | Kitchenary Kart",
  },
  [ROUTES.SHIPPING_POLICY]: {
    title: "Shipping Policy | Kitchenary Kart",
  },
  [ROUTES.PRICING_POLICY]: {
    title: "Pricing Policy | Kitchenary Kart",
  },
  [ROUTES.CANCELLATION_POLICY]: {
    title: "Cancellation Policy | Kitchenary Kart",
  },
  [ROUTES.NEW_ARRIVALS]: {
    title: "New Arrivals | Kitchenary Kart",
  },
  [ROUTES.MOST_SELLING]: {
    title: "Best Sellers | Kitchenary Kart",
  },
  [ROUTES.ALL_SUBCATEGORIES]: {
    title: "All Categories | Kitchenary Kart",
  },
  [ROUTES.SEARCH_PRODUCTS]: {
    title: "Search Products | Kitchenary Kart",
  },
};
