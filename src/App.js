import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ── Core wrappers & utilities ─────────────────────────────────────────────────
import AppWrapper from "./components/common/AppWrapper";
import Layout from "./Layout";
import ProductNotification from "./components/notifications/ProductNotification";
import StickyWhatsApp from "./components/common/StickyWhatsApp";
import CartReminderPopup from "./pages/CartReminderPopup";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

// ── Home sections ─────────────────────────────────────────────────────────────
const HeroBanner = lazy(() => import("./HeroBanner"));
const CategoryHeroBanner = lazy(() => import("./CategoryHeroBanner"));
const TopCategories = lazy(() => import("./TopCategories"));
const MostSellingProductList = lazy(() => import("./MostSelling"));
const NewArrivalProductList = lazy(() => import("./NewArrivals"));
const HomeNewArrivals = lazy(() => import("./HomeNewArrivals"));


// ── Parameterized home category/subcategory slots (5 slots → 2 components) ───
// CategoryWithSubcategories: slot prop 1–5 → hits /Selected_category{N} API
// SubcategoryWithSubcategories: slot prop 1–5 → hits /Selected_subcategory{N} API
const CategoryWithSubcategories = lazy(() => import("./CategoryWithSubcategories"));
const SubcategoryWithSubcategories = lazy(() => import("./SubcategoryWithSubcategories"));

// ── Product listing pages ─────────────────────────────────────────────────────
const AllNewArrivals = lazy(() => import("./NewArrivalsAll"));
const MostsellingAll = lazy(() => import("./MostsellingAll"));

// HomeAllSubPage: slot prop 1–5 → hits /Selected_subcategory{N} full product list
const HomeAllSubPage = lazy(() => import("./pages/category/HomeAllSubPage"));

// ── Product & Search ──────────────────────────────────────────────────────────
const CustomerProductList = lazy(() => import("./CustomerProductList"));
const CustomerSearchProductList = lazy(() => import("./CustomerSearchProductList"));
const ProductDetails = lazy(() => import("./ProductDetails"));

// ── Category pages ────────────────────────────────────────────────────────────
const SubsubcategoryPage = lazy(() => import("./pages/category/SubsubcategoryPage"));
const SubcategoryPage = lazy(() => import("./pages/category/SubcategoryPage"));
const AllSubcategoriesPage = lazy(() => import("./pages/category/AllSubcategoriesPage"));
const CategoryProductsPage = lazy(() => import("./pages/category/CategoryProductsPage"));

// ── User account pages ────────────────────────────────────────────────────────
const MyOrder = lazy(() => import("./pages/MyOrder"));
const AccountSetting = lazy(() => import("./pages/AccountSetting"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const CartPage = lazy(() => import("./pages/CartPage"));
const UserRegistration = lazy(() => import("./pages/UserRegistration"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const LoginPopup = lazy(() => import("./components/LoginPopup/LoginPopup"));

// ── Legal / Policy pages ──────────────────────────────────────────────────────
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const TermsPolicy = lazy(() => import("./pages/legal/TermsAndConditions"));
const ShippingPolicy = lazy(() => import("./pages/legal/ShippingPolicy"));
const PricingPolicy = lazy(() => import("./pages/legal/PricingPolicy"));
const CancellationPolicy = lazy(() => import("./pages/legal/CancellationPolicy"));

// ── Page loading fallback ─────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
    <div className="spinner-border" style={{ color: "#af2031" }} aria-label="Loading...">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const BASE = "https://www.kitchenarykart.com";

const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={true}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
          toastStyle={{
            backgroundColor: "#fff",
            color: "#000",
            border: "1px solid #af2031ff",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            paddingRight: "35px",
            position: "relative",
          }}
          closeButton={({ closeToast }) => (
            <button
              onClick={closeToast}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                border: "none",
                background: "transparent",
                color: "#af2031ff",
                fontSize: "22px",
                cursor: "pointer",
                lineHeight: "1",
              }}
            >
              ×
            </button>
          )}
        />

        <ProductNotification />
        <StickyWhatsApp />
        <CartReminderPopup />
        <AppWrapper />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ── Home ────────────────────────────────────────────────────── */}
            <Route
              path="/"
              element={
                <Layout
                  title="Kitchenary Kart — Premium Kitchen & HORECA Supplies"
                  description="Your one-stop destination for premium kitchen essentials and HORECA supplies. Shop deep fryers, cookware, serving equipment and more."
                  canonical={`${BASE}/`}
                >
                  <HeroBanner />
                  <TopCategories />
                  <MostSellingProductList />
                  {/* <NewArrivalProductList /> */}

                  {/* 5 category sections + subcategory product sections (slots 1–5) */}
                  <CategoryWithSubcategories />
                  <CategoryHeroBanner />
                  <SubcategoryWithSubcategories />
                  <CategoryWithSubcategories slot={2} />
                  <HomeNewArrivals/>
                  <SubcategoryWithSubcategories slot={2} />
                  <CategoryWithSubcategories slot={3} />
                  <SubcategoryWithSubcategories slot={3} />
                  <CategoryWithSubcategories slot={4} />
                  <SubcategoryWithSubcategories slot={4} />
                  <CategoryWithSubcategories slot={5} />
                  <SubcategoryWithSubcategories slot={5} />
                </Layout>
              }
            />

            {/* ── Auth & Account ───────────────────────────────────────────── */}
            <Route path="/login" element={<Layout title="Login | Kitchenary Kart" canonical={`${BASE}/login`}><LoginPopup /></Layout>} />
            <Route path="/user-registration" element={<Layout title="Register | Kitchenary Kart" canonical={`${BASE}/user-registration`}><UserRegistration /></Layout>} />
            <Route path="/profile" element={<Navigate to="/profile/accountsetting" replace />} />

            {/* ── Protected Routes ─────────────────────────────────────────── */}
            <Route path="/wishlist" element={<ProtectedRoute><Layout title="Wishlist | Kitchenary Kart" canonical={`${BASE}/wishlist`}><WishlistPage /></Layout></ProtectedRoute>} />
            <Route path="/cart/:userId" element={<ProtectedRoute><Layout title="Cart | Kitchenary Kart" canonical={`${BASE}/cart`}><CartPage /></Layout></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Layout title="Cart | Kitchenary Kart" canonical={`${BASE}/cart`}><CartPage /></Layout></ProtectedRoute>} />
            <Route path="/checkout/:userId" element={<ProtectedRoute><Layout title="Checkout | Kitchenary Kart" canonical={`${BASE}/checkout`}><CheckoutPage /></Layout></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Layout title="Checkout | Kitchenary Kart" canonical={`${BASE}/checkout`}><CheckoutPage /></Layout></ProtectedRoute>} />
            <Route path="/profile/myorder" element={<ProtectedRoute><Layout title="My Orders | Kitchenary Kart" canonical={`${BASE}/profile/myorder`}><MyOrder /></Layout></ProtectedRoute>} />
            <Route path="/profile/accountsetting" element={<ProtectedRoute><Layout title="Account Settings | Kitchenary Kart" canonical={`${BASE}/profile/accountsetting`}><AccountSetting /></Layout></ProtectedRoute>} />
            <Route path="/order-success" element={<ProtectedRoute><Layout title="Order Placed | Kitchenary Kart" canonical={`${BASE}/order-success`}><OrderSuccess /></Layout></ProtectedRoute>} />

            {/* ── Policy Pages ─────────────────────────────────────────────── */}
            <Route path="/privacy-policy" element={<Layout title="Privacy Policy | Kitchenary Kart" canonical={`${BASE}/privacy-policy`}><PrivacyPolicy /></Layout>} />
            <Route path="/terms-policy" element={<Layout title="Terms & Conditions | Kitchenary Kart" canonical={`${BASE}/terms-policy`}><TermsPolicy /></Layout>} />
            <Route path="/shipping-policy" element={<Layout title="Shipping Policy | Kitchenary Kart" canonical={`${BASE}/shipping-policy`}><ShippingPolicy /></Layout>} />
            <Route path="/pricing-policy" element={<Layout title="Pricing Policy | Kitchenary Kart" canonical={`${BASE}/pricing-policy`}><PricingPolicy /></Layout>} />
            <Route path="/cancellation-policy" element={<Layout title="Cancellation Policy | Kitchenary Kart" canonical={`${BASE}/cancellation-policy`}><CancellationPolicy /></Layout>} />

            {/* ── Product & Category Pages ─────────────────────────────────── */}
            <Route path="/category-products/slot/:slot" element={<Layout canonical={`${BASE}/category-products`}><CategoryProductsPage /></Layout>} />
            <Route path="/subsubcategories/:subcategoryId" element={<Layout canonical={`${BASE}/subsubcategories`}><SubsubcategoryPage /></Layout>} />
            <Route path="/products/subcategory/:subcategoryId" element={<Layout canonical={`${BASE}/products`}><CustomerProductList /></Layout>} />
            <Route path="/product" element={<Layout title="Search Products | Kitchenary Kart" canonical={`${BASE}/product`}><CustomerSearchProductList /></Layout>} />
            <Route path="/new-arrivals" element={<Layout title="New Arrivals | Kitchenary Kart" canonical={`${BASE}/new-arrivals`}><AllNewArrivals /></Layout>} />
            <Route path="/most-selling-all" element={<Layout title="Best Sellers | Kitchenary Kart" canonical={`${BASE}/most-selling-all`}><MostsellingAll /></Layout>} />

            {/* 5 all-products routes — single component with slot prop */}
            {/* <Route path="/all-products" element={<Layout title="All Products | Kitchenary Kart" canonical={`${BASE}/all-products`}><HomeAllSubPage slot={1} /></Layout>} />
            <Route path="/all-products2" element={<Layout title="All Products | Kitchenary Kart" canonical={`${BASE}/all-products2`}><HomeAllSubPage slot={2} /></Layout>} />
            <Route path="/all-products3" element={<Layout title="All Products | Kitchenary Kart" canonical={`${BASE}/all-products3`}><HomeAllSubPage slot={3} /></Layout>} />
            <Route path="/all-products4" element={<Layout title="All Products | Kitchenary Kart" canonical={`${BASE}/all-products4`}><HomeAllSubPage slot={4} /></Layout>} />
            <Route path="/all-products5" element={<Layout title="All Products | Kitchenary Kart" canonical={`${BASE}/all-products5`}><HomeAllSubPage slot={5} /></Layout>} /> */}

            <Route path="/category/:id" element={<Layout canonical={`${BASE}/category`}><SubcategoryPage /></Layout>} />
            <Route path="/subcategory" element={<Layout canonical={`${BASE}/subcategory`}><SubcategoryPage /></Layout>} />
            <Route path="/category/:id/subcategories" element={<Layout canonical={`${BASE}/category`}><SubcategoryPage /></Layout>} />
            <Route path="/products/category/:categoryId" element={<Layout canonical={`${BASE}/products`}><CustomerProductList /></Layout>} />
            <Route path="/products/category/:categoryId/subcategory/:subcategoryId" element={<Layout canonical={`${BASE}/products`}><CustomerProductList /></Layout>} />
            <Route path="/all-subcategories" element={<Layout title="All Categories | Kitchenary Kart" canonical={`${BASE}/all-subcategories`}><AllSubcategoriesPage /></Layout>} />
            <Route path="/subcategory/category/:categoryId/subcategory/:subcategoryId" element={<Layout canonical={`${BASE}/subcategory`}><SubsubcategoryPage /></Layout>} />
            <Route path="/products/category/:categoryId/subcategory/:subcategoryId/subsubcategory/:subsubcategoryId" element={<Layout canonical={`${BASE}/products`}><CustomerProductList /></Layout>} />
            <Route path="/product/:id" element={<Layout canonical={`${BASE}/product`}><ProductDetails /></Layout>} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
