/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./utils/api";
import {
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  X,
  Star,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Send,
  AlertCircle,
  Package,
  Zap,
  Weight,
  Layers,
  Circle,
  Grid3x3,
  ArrowRight,
  CheckCircle2,
  Play,
  Plus,
  Minus,
} from "lucide-react";
import logo from "./images/piclogo.png";
import { toast } from "react-toastify";

// ── Helper ─────────────────────────────────────────────────────────────

const safeValue = (value) => (value && value !== "undefined" ? value : null);

const imgSrc = (img) =>
  img
    ? img.startsWith("https")
      ? img
      : `${process.env.REACT_APP_API_BASE_URL ? process.env.REACT_APP_API_BASE_URL.replace("/Api", "") : "https://kitchenarykart.com/kitchen_app"}/${img}`
    : logo;

// ── Sub-components ─────────────────────────────────────────────────────

const StarDisplay = ({ rating, size = 14 }) => {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= rounded
              ? "fill-gold-500 text-gold-500"
              : "text-stone-200 fill-stone-100"
          }
        />
      ))}
    </div>
  );
};

const SpecItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 bg-cream-50 rounded-xl border border-stone-100">
    <Icon size={16} className="text-brand mt-0.5 flex-shrink-0" />
    <div>
      <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className="text-sm font-semibold text-charcoal">{value}</p>
    </div>
  </div>
);

const SkeletonBlock = ({ className = "" }) => (
  <div className={`skeleton rounded-xl ${className}`} />
);

// ── Loading Skeleton ───────────────────────────────────────────────────

const ProductDetailsSkeleton = () => (
  <div className="min-h-screen bg-cream-100">
    <div className="container-main py-8">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="lg:w-[52%]">
          <SkeletonBlock className="aspect-square w-full" />
          <div className="flex gap-2 mt-3">
            {[...Array(5)].map((_, i) => (
              <SkeletonBlock key={i} className="w-16 h-16" />
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <SkeletonBlock className="h-8 w-3/4" />
          <SkeletonBlock className="h-6 w-1/2" />
          <SkeletonBlock className="h-12 w-full" />
          <SkeletonBlock className="h-12 w-full" />
          <SkeletonBlock className="h-24 w-full" />
        </div>
      </div>
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentVariant, setCurrentVariant] = useState(null);
  const [uniqueColors, setUniqueColors] = useState([]);
  const [otherDimensions, setOtherDimensions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [variants, setVariants] = useState([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [isDesktopZoom, setIsDesktopZoom] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showTierPricing, setShowTierPricing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showReviewImageModal, setShowReviewImageModal] = useState(false);
  const [selectedReviewImage, setSelectedReviewImage] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 1, comment: "" });
  const [relatedProducts] = useState([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [qas, setQAs] = useState([]);
  const [visibleQACount, setVisibleQACount] = useState(2);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [modalIndex, setModalIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [activeTab, setActiveTab] = useState("description");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);
  const variant = currentVariant || {};

  const hasAnySpecs = [
    variant.capacity,
    variant.material,
    variant.power,
    variant.product_weight,
    variant.voltage,
    variant.shape,
    variant.number_of_compartments,
  ].some((v) => safeValue(v));

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktopZoom(!!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    const loadPrimary = async () => {
      setLoading(true);
      try {
        const cachedProduct = sessionStorage.getItem(`product_${id}`);
        const cachedVariants = sessionStorage.getItem(`variants_${id}`);
        if (cachedProduct && cachedVariants) {
          const parsedProduct = JSON.parse(cachedProduct);
          const parsedVariants = JSON.parse(cachedVariants).filter(
            (v) => v.stock > 0,
          );
          setProduct(parsedProduct);
          setVariants(parsedVariants);
          setCurrentVariant(parsedVariants[0] || null);
          setUniqueColors(getUniqueColorMap(parsedVariants));
          setOtherDimensions(getOtherDimensionsWithImages(parsedVariants));
        }
        const [productRes, variantRes] = await Promise.all([
          api.get(`/product/show/${id}`),
          api.get(`/ProductVariants/index/${id}`),
        ]);
        const freshProduct = productRes.data;
        const freshVariants = variantRes.data.filter((v) => v.stock > 0);
        setProduct(freshProduct);
        setVariants(freshVariants);
        setCurrentVariant(freshVariants[0] || null);
        setUniqueColors(getUniqueColorMap(freshVariants));
        setOtherDimensions(getOtherDimensionsWithImages(freshVariants));
        sessionStorage.setItem(`product_${id}`, JSON.stringify(freshProduct));
        sessionStorage.setItem(
          `variants_${id}`,
          JSON.stringify(variantRes.data),
        );
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    loadPrimary();
  }, [id]);

  const handleProductClick = (productId, productName) => {
    navigate(`/product/${productId}?name=${encodeURIComponent(productName)}`);
  };

  const checkWishlistStatus = useCallback(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id || !currentVariant) {
      setIsInWishlist(false);
      setWishlistItemId(null);
      return;
    }
    try {
      const response = await api.get(`/Wishlist/index/${user.id}`);
      const items = response.data || [];
      const match = items.find((item) => item.variantId === currentVariant.id);
      if (match) {
        setIsInWishlist(true);
        setWishlistItemId(match.itemId);
      } else {
        setIsInWishlist(false);
        setWishlistItemId(null);
      }
    } catch {
      setIsInWishlist(false);
      setWishlistItemId(null);
    }
  }, [currentVariant]);

  useEffect(() => {
    checkWishlistStatus();
  }, [checkWishlistStatus]);

  const fetchQAs = async () => {
    try {
      const res = await api.get(
        `/ProductVariantQa/getAllByVariant/${currentVariant.id}`,
      );
      setQAs(res.data);
    } catch (err) {}
  };

  const handleAskQuestion = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) {
      navigate("/login");
      return;
    }
    if (!currentVariant?.id) {
      return;
    }
    if (!questionText.trim()) {
      return;
    }
    try {
      await api.post(
        `/ProductVariantQa/ask/${user.id}?variantId=${currentVariant.id}&question=${encodeURIComponent(questionText.trim())}`,
        null,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
      );
      setQuestionText("");
      setShowQuestionForm(false);
      fetchQAs();
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 4000);
    } catch (error) {
      alert("Failed to submit the question. Please try again.");
    }
  };

  const handleShowMoreQA = () => setVisibleQACount((p) => p + 3);
  const handleShowMore = () => setVisibleCount((p) => p + 3);
  const handleShowLess = () => setVisibleCount((p) => Math.max(3, p - 3));

  const handleImageClick = (img, index = 0) => {
    setSelectedImagePreview(img);
    setModalIndex(index);
    setShowModal(true);
    setZoomLevel(1);
  };
  const handleZoomIn = () => setZoomLevel((p) => Math.min(p + 0.25, 3));
  const handleZoomOut = () => setZoomLevel((p) => Math.max(p - 0.25, 1));
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImagePreview(null);
  };
  const handleReviewImageClick = (img) => {
    setSelectedReviewImage(img);
    setShowReviewImageModal(true);
  };
  const handleCloseReviewModal = () => {
    setShowReviewImageModal(false);
    setSelectedReviewImage(null);
  };

  const handleMouseOver = (event) => {
    if (!isDesktopZoom) return;
    setIsZoomed(true);
    const rect = event.currentTarget.getBoundingClientRect();
    const rawX = event.clientX - rect.left;
    const rawY = event.clientY - rect.top;
    const xPct = (rawX / rect.width) * 100;
    const yPct = (rawY / rect.height) * 100;

    const LENS_SIZE = 220;
    const x = Math.max(
      0,
      Math.min(rawX - LENS_SIZE / 2, rect.width - LENS_SIZE),
    );
    const y = Math.max(
      0,
      Math.min(rawY - LENS_SIZE / 2, rect.height - LENS_SIZE),
    );

    setLensPos({ x, y });
    setZoomPosition({ x: xPct, y: yPct });
  };
  const handleMouseLeave = () => setIsZoomed(false);

  const handleShare = () => {
    const productLink = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `Check out: ${product.name}`,
        url: productLink,
      });
    } else {
      navigator.clipboard
        .writeText(productLink)
        .then(() => toast.success("Link copied to clipboard!"));
    }
  };

  const getUniqueColorMap = (variants) => {
    const colorMap = {};
    variants.forEach((v) => {
      if (v.color && !colorMap[v.color]) colorMap[v.color] = v.images[0];
    });
    return colorMap;
  };

  const getOtherDimensionsWithImages = (variants) => {
    const map = {};
    variants
      .filter((v) => v.otherDimensions)
      .forEach((v) => {
        if (!map[v.otherDimensions]) map[v.otherDimensions] = v.images[0];
      });
    return map;
  };

  const allColors = product?.variants?.map((v) => v.color).filter(Boolean);
  const uniqueColorsSet = new Set(allColors);

  const handleDotClick = (index) => setCurrentIndex(index);
  const handleColorChange = (color) => {
    const selectedVariant = variants.find((v) => v.color === color);
    setCurrentVariant(selectedVariant);
    setCurrentIndex(0);
  };
  const handleDimensionClick = (od) => {
    const selectedVariant = variants.find((v) => v.otherDimensions === od);
    if (selectedVariant) {
      setCurrentVariant(selectedVariant);
      setCurrentIndex(0);
    }
  };

  const handleAddToWishlist = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) {
      toast.info("Please log in first.");
      navigate("/login");
      return;
    }
    if (!currentVariant) {
      toast.warning("Please select a variant.");
      return;
    }

    if (isInWishlist && wishlistItemId) {
      // Remove from wishlist
      try {
        await api.delete(`/Wishlist/remove`, {
          params: { userId: user.id, itemId: wishlistItemId },
        });
        setIsInWishlist(false);
        setWishlistItemId(null);
        toast.info("Removed from Wishlist.");
        window.dispatchEvent(new Event("wishlistUpdated"));
      } catch (error) {
        toast.error("Failed to remove from wishlist.");
      }
    } else {
      // Add to wishlist
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("productId", product.id);
      formData.append("variantId", currentVariant.id);
      try {
        await api.post(`/Wishlist/add`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // Refetch to get the new itemId for future removal
        const response = await api.get(`/Wishlist/index/${user.id}`);
        const items = response.data || [];
        const match = items.find(
          (item) => item.variantId === currentVariant.id,
        );
        if (match) {
          setWishlistItemId(match.itemId);
        }
        setIsInWishlist(true);
        toast.success(
          <div>
            <strong>Added to Wishlist!</strong>
            <br />
            <button
              onClick={() => navigate("/wishlist")}
              style={{
                background: "#af2031ff",
                border: "none",
                color: "white",
                padding: "5px 10px",
                borderRadius: "5px",
                marginTop: "5px",
                cursor: "pointer",
              }}
            >
              View Wishlist
            </button>
          </div>,
        );
        window.dispatchEvent(new Event("wishlistUpdated"));
      } catch (error) {
        toast.error("Failed to add to wishlist.");
      }
    }
  };

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) {
      toast.info("Please log in first.");
      navigate("/login");
      return;
    }
    if (!currentVariant) {
      toast.warning("Please select a variant.");
      return;
    }
    try {
      await api.post(
        `/Cart/cart_add/${user.id}`,
        {},
        {
          params: {
            productId: product.id,
            productVariantId: currentVariant.id,
            quantity,
          },
        },
      );
      toast.success(
        <div>
          <strong>Added to Cart!</strong>
          <br />
          <button
            onClick={() => navigate(`/cart/${user.id}`)}
            style={{
              background: "#af2031ff",
              border: "none",
              color: "white",
              padding: "5px 10px",
              borderRadius: "5px",
              marginTop: "5px",
              cursor: "pointer",
            }}
          >
            View Cart
          </button>
        </div>,
      );
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.");
    }
  };

  const handleAddReview = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) {
      navigate("/login");
      return;
    }
    if (!newReview.rating) {
      alert("Please provide a rating.");
      return;
    }
    const formData = new FormData();
    formData.append("variantId", currentVariant.id);
    formData.append("rating", newReview.rating);
    if (newReview.comment) formData.append("comment", newReview.comment);
    selectedImages.forEach((file) => formData.append("images[]", file));
    if (selectedVideo) formData.append("video", selectedVideo);
    try {
      setIsSubmitting(true);
      await api.post(`/Reviews/add/${user.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const refreshed = await api.get(`/Reviews/variant/${currentVariant.id}`);
      setReviews(refreshed.data);
      setNewReview({ rating: 5, comment: "" });
      setSelectedImages([]);
      setSelectedVideo(null);
      setVideoPreviewUrl(null);
      setShowReviewForm(false);
      toast.success("Review submitted!");
    } catch (error) {
      alert("Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryClick = (categoryId) =>
    navigate(`/category/${categoryId}/subcategories`);
  const handleSubcategoryClick = (subcategoryId) => {
    const subsubs = product?.subsubcategories || [];
    const hasSubsubcategories = subsubs.some(
      (subsub) => String(subsub.subcategory_id) === String(subcategoryId),
    );
    navigate(
      hasSubsubcategories
        ? `/subsubcategories/${subcategoryId}`
        : `/products/subcategory/${subcategoryId}`,
    );
  };
  const handleSubsubcategoryClick = (
    categoryId,
    subcategoryId,
    subsubcategoryId,
  ) => {
    navigate(
      `/products/category/${categoryId}/subcategory/${subcategoryId}/subsubcategory/${subsubcategoryId}`,
    );
  };

  const uniqueCategories = useMemo(
    () =>
      product?.categories
        ? [
            ...new Map(
              product.categories.map((cat) => [cat.name, cat]),
            ).values(),
          ]
        : [],
    [product?.categories],
  );

  const uniqueSubcategories = useMemo(
    () =>
      product?.subcategories
        ? [
            ...new Map(
              product.subcategories.map((sub) => [sub.name, sub]),
            ).values(),
          ]
        : [],
    [product?.subcategories],
  );

  const uniqueSubsubcategories = useMemo(
    () =>
      product?.subsubcategories
        ? [
            ...new Map(
              product.subsubcategories.map((subsub) => [subsub.name, subsub]),
            ).values(),
          ]
        : [],
    [product?.subsubcategories],
  );

  const nextSlide = () => {
    const total =
      (currentVariant?.images?.length || 0) +
      (currentVariant?.video_url ? 1 : 0);
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };
  const prevSlide = () => {
    const total =
      (currentVariant?.images?.length || 0) +
      (currentVariant?.video_url ? 1 : 0);
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  // Average rating
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  // ── Render states ──────────────────────────────────────────────────

  if (loading && !product) return <ProductDetailsSkeleton />;
  if (error)
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-brand mx-auto mb-4" />
          <h2 className="font-display font-bold text-2xl text-charcoal mb-2">
            Product not found
          </h2>
          <p className="text-stone-500 mb-6">{error}</p>
          <button onClick={() => navigate(-1)} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  if (!product || !currentVariant) return <ProductDetailsSkeleton />;

  const images = currentVariant.images || [];
  const totalSlides = images.length + (currentVariant.video_url ? 1 : 0);

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description || product.name,
    sku: String(currentVariant.id),
    image: images.map((img) => imgSrc(img)),
    brand: { "@type": "Brand", name: "Kitchenary Kart" },
    offers: {
      "@type": "Offer",
      url: `https://www.kitchenarykart.com/product/${product.id}`,
      priceCurrency: "INR",
      price: String(currentVariant.price_with_gst || currentVariant.price || 0),
      itemCondition: "https://schema.org/NewCondition",
      availability:
        currentVariant.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    ...(avgRating > 0 && reviews.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating.toFixed(1),
            reviewCount: String(reviews.length),
          },
        }
      : {}),
  };

  return (
    <>
      <div className="bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* ── Breadcrumb (fixed top bar, never scrolls) ─────────────── */}
        <div className="flex-shrink-0 border-b border-stone-200 bg-white px-3 sm:px-6 lg:px-8 py-2.5">
          <nav className="flex items-center gap-1.5 text-xs text-stone-500 flex-wrap max-w-screen-xl mx-auto">
            <button
              onClick={() => navigate("/")}
              className="hover:text-red-700 transition-colors font-medium"
            >
              Home
            </button>
            {uniqueCategories.map((cat) => (
              <React.Fragment key={cat.id}>
                <ChevronRight size={12} className="text-stone-300" />
                <button
                  onClick={() => handleCategoryClick(cat.id)}
                  className="hover:text-red-700 transition-colors uppercase font-bold tracking-wide"
                >
                  {cat.name}
                </button>
              </React.Fragment>
            ))}
            {uniqueSubcategories.map((sub) => (
              <React.Fragment key={sub.id}>
                <ChevronRight size={12} className="text-stone-300" />
                <button
                  onClick={() => handleSubcategoryClick(sub.id)}
                  className="hover:text-red-700 transition-colors uppercase font-bold tracking-wide"
                >
                  {sub.name}
                </button>
              </React.Fragment>
            ))}
            {uniqueSubsubcategories.map((subsub) => (
              <React.Fragment key={subsub.id}>
                <ChevronRight size={12} className="text-stone-300" />
                <button
                  onClick={() =>
                    handleSubsubcategoryClick(
                      product.categories?.[0]?.id,
                      product.subcategories?.[0]?.id,
                      subsub.id,
                    )
                  }
                  className="hover:text-red-700 transition-colors"
                >
                  {subsub.name}
                </button>
              </React.Fragment>
            ))}
            <ChevronRight size={12} className="text-stone-300" />
            <span className="text-gray-800 font-semibold line-clamp-1 max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>

        {/* ── Layout like reference: gallery left, sticky panel right ── */}
        <div className="w-full max-w-none px-2 min-[360px]:px-3 sm:px-4 lg:px-0 py-4 sm:py-5 lg:py-6 h-full max-h-[100vh] overflow-y-auto lg:overflow-x-visible bg-white">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 items-start w-full h-full">
            {/* ═══ LEFT — Image Gallery ═══ */}
            <div className="w-full lg:flex-1 min-w-0">
              {/* Thumbnail + Main image row */}
              <div className="flex flex-col lg:flex-row gap-3 lg:gap-5">
                {/* Vertical thumbnail strip (desktop) */}
                {totalSlides > 1 && (
                  <div className="hidden lg:flex flex-col gap-3 flex-shrink-0 overflow-y-auto scrollbar-hide max-h-[70vh] pr-1 bg-[#f3f4f6] rounded-md p-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`flex-shrink-0 w-[80px] h-[80px] md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px] rounded-md overflow-hidden border transition-all bg-white ${
                          currentIndex === index
                            ? "border-stone-700"
                            : "border-stone-200 hover:border-stone-400"
                        }`}
                      >
                        <img
                          loading="lazy"
                          src={imgSrc(image)}
                          alt={`Thumb ${index + 1}`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = logo;
                          }}
                        />
                      </button>
                    ))}
                    {currentVariant.video_url && (
                      <button
                        onClick={() => handleDotClick(images.length)}
                        className={`flex-shrink-0 w-[76px] h-[76px] rounded-md overflow-hidden border transition-all bg-stone-900 flex items-center justify-center ${
                          currentIndex === images.length
                            ? "border-[#B91C1C]"
                            : "border-stone-300"
                        }`}
                      >
                        <Play size={18} className="text-white" />
                      </button>
                    )}
                  </div>
                )}

                {/* Main image frame */}
                <div className="flex-1 min-w-0">
                  <div className="relative bg-[#f3f4f6] rounded-none overflow-hidden border-0 shadow-none group">
                    {/* Navigation arrows */}
                    {totalSlides > 1 && (
                      <>
                        <button
                          onClick={prevSlide}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md border border-stone-100 flex items-center justify-center text-stone-600 hover:bg-[#B91C1C] hover:text-white hover:border-[#B91C1C] transition-all"
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={17} />
                        </button>
                        <button
                          onClick={nextSlide}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md border border-stone-100 flex items-center justify-center text-stone-600 hover:bg-[#B91C1C] hover:text-white hover:border-[#B91C1C] transition-all"
                          aria-label="Next image"
                        >
                          <ChevronRight size={17} />
                        </button>
                      </>
                    )}

                    {/* Share button */}
                    {/* Heart (top-right like reference) */}
                    <button
                      onClick={handleAddToWishlist}
                      className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white shadow-md border border-stone-200 flex items-center justify-center transition-colors ${isInWishlist ? "text-[#B91C1C]" : "text-stone-500 hover:text-[#B91C1C]"}`}
                      aria-label={
                        isInWishlist
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >
                      <Heart
                        size={16}
                        className={isInWishlist ? "fill-[#B91C1C]" : ""}
                      />
                    </button>

                    {/* Slide counter */}
                    {totalSlides > 1 && (
                      <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-black/40 backdrop-blur-sm text-white text-[11px] font-bold rounded-full">
                        {currentIndex + 1} / {totalSlides}
                      </div>
                    )}

                    {/* Images */}
                    <div className="relative overflow-visible">
                      <div
                        className="
      w-full
      h-[320px] sm:h-[400px]
      lg:h-[70vh] lg:max-h-[700px]
      relative overflow-hidden"
                      >
                        {images.map((image, index) => (
                          <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-300 ${currentIndex === index ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                            onMouseMove={handleMouseOver}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleImageClick(image, index)}
                          >
                            {/* Lens (desktop only) */}
                            {isZoomed && currentIndex === index && (
                              <div
                                className="hidden lg:block absolute z-20 border border-stone-300 bg-white/40 pointer-events-none"
                                style={{
                                  width: 220,
                                  height: 220,
                                  left: lensPos.x,
                                  top: lensPos.y,
                                }}
                              />
                            )}
                            <img
                              loading="lazy"
                              src={imgSrc(image)}
                              alt={`Product image ${index + 1}`}
                              className={`max-w-full max-h-full object-contain bg-white block mx-auto ${isDesktopZoom ? "cursor-zoom-plus" : "cursor-zoom-in"}`}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = logo;
                              }}
                            />
                          </div>
                        ))}

                        {/* Video slide */}
                        {currentVariant.video_url && (
                          <div
                            className={`absolute inset-0 bg-black transition-opacity duration-300 ${currentIndex === images.length ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                          >
                            <video
                              controls
                              className="w-full h-full object-contain"
                            >
                              <source
                                src={currentVariant.video_url}
                                type="video/mp4"
                              />
                            </video>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Share (bottom-right like reference) */}
                    <button
                      onClick={handleShare}
                      className="absolute bottom-3 right-3 z-20 w-9 h-9 rounded-full bg-white shadow-md border border-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-all"
                      aria-label="Share product"
                    >
                      <Share2 size={15} />
                    </button>
                  </div>

                  {/* Mobile thumbnail strip */}
                  {totalSlides > 1 && (
                    <div className="flex lg:hidden gap-2 mt-3 overflow-x-auto pb-2">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => handleDotClick(index)}
                          className={`flex-shrink-0 w-14 h-14 min-[360px]:w-16 min-[360px]:h-16 rounded-xl overflow-hidden border-2 transition-all bg-white ${
                            currentIndex === index
                              ? "border-[#B91C1C] shadow-sm"
                              : "border-stone-200 hover:border-[#B91C1C]/50"
                          }`}
                        >
                          <img
                            loading="lazy"
                            src={imgSrc(image)}
                            alt={`Thumb ${index + 1}`}
                            className="w-full h-full object-cover p-1"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = logo;
                            }}
                          />
                        </button>
                      ))}
                      {currentVariant.video_url && (
                        <button
                          onClick={() => handleDotClick(images.length)}
                          className={`flex-shrink-0 w-14 h-14 min-[360px]:w-16 min-[360px]:h-16 rounded-xl overflow-hidden border-2 transition-all bg-stone-900 flex items-center justify-center ${
                            currentIndex === images.length
                              ? "border-[#B91C1C]"
                              : "border-stone-200"
                          }`}
                        >
                          <Play size={20} className="text-white" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ═══ RIGHT — Sticky purchase/info panel ═══ */}
            <div className="w-full lg:w-[420px] xl:w-[440px] flex-shrink-0 bg-white h-auto lg:h-[calc(100vh-120px)] overflow-visible lg:overflow-y-auto lg:scrollbar-hide relative">
              {/* Zoom preview overlay (desktop only) */}
              {isDesktopZoom && currentIndex < images.length && isZoomed && (
                <div
                  className="hidden lg:block fixed z-40 pointer-events-none"
                  style={{
                    top: "120px", // 👈 adjust based on header height
                    right: "0px",
                    width: "30%", // 👈 same as image section width
                    height: "80vh", // 👈 visible area only
                    backgroundImage: `url(${imgSrc(images[currentIndex])})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "150%",
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }}
                />
              )}

              {/* Mobile gallery removed: left gallery is now always visible */}
              {/* Stock warning */}
              {currentVariant.stock > 0 && currentVariant.stock < 5 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-xl mb-4 text-sm">
                  <AlertCircle
                    size={15}
                    className="text-orange-500 flex-shrink-0"
                  />
                  <span className="text-orange-700 font-semibold">
                    Only {currentVariant.stock} left in stock!
                  </span>
                </div>
              )}

              {/* Product name */}
              <h1 className="font-display font-bold text-2xl md:text-3xl text-charcoal leading-tight mb-4">
                {product.name}
              </h1>

              {/* Rating summary */}
              {reviews.length > 0 && avgRating > 3 && (
                <div className="flex items-center gap-2 mb-4">
                  <StarDisplay rating={avgRating} />
                  <span className="text-sm font-semibold text-charcoal">
                    {avgRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-stone-400">
                    ({reviews.length}{" "}
                    {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-stone-200 mb-5" />

              {/* Pricing */}
              <div className="mb-5">
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className="text-[#B91C1C] font-sans font-extrabold tracking-tight leading-none"
                    style={{ fontSize: "28px", letterSpacing: "-0.5px" }}
                  >
                    ₹
                    {new Intl.NumberFormat("en-IN").format(
                      currentVariant.price,
                    )}
                  </span>
                  <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest">
                    incl. GST
                  </span>
                </div>
                <p className="text-[13px] text-stone-400 mt-1.5">
                  <span className="text-stone-500 font-medium">
                    ₹
                    {new Intl.NumberFormat("en-IN").format(
                      currentVariant.price_excluding_tax,
                    )}
                  </span>
                  {" excl. GST · Inclusive of all taxes"}
                </p>
              </div>

              {/* Color variants */}
              {Object.keys(uniqueColors).length > 1 && (
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
                    Color:{" "}
                    <span className="text-charcoal font-semibold normal-case tracking-normal">
                      {currentVariant.color}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(uniqueColors).map(([color, image]) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        title={color}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                          currentVariant.color === color
                            ? "border-brand shadow-button scale-105"
                            : "border-stone-200 hover:border-brand/50"
                        }`}
                      >
                        <img
                          loading="lazy"
                          src={imgSrc(image)}
                          alt={`Color ${color}`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = logo;
                          }}
                        />
                      </button>
                    ))}
                  </div>
                  {uniqueColorsSet.size === 1 && (
                    <p className="text-sm text-stone-600 mt-1">
                      <span className="font-semibold">Color:</span>{" "}
                      {Array.from(uniqueColorsSet)[0]}
                    </p>
                  )}
                </div>
              )}

              {/* Other dimensions / variations */}
              {otherDimensions && Object.keys(otherDimensions).length > 1 && (
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
                    Variation:{" "}
                    <span className="text-charcoal font-semibold normal-case tracking-normal">
                      {currentVariant.otherDimensions}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(otherDimensions).map(([od, image]) => (
                      <button
                        key={od}
                        onClick={() => handleDimensionClick(od)}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                          currentVariant.otherDimensions === od
                            ? "border-brand shadow-button scale-105"
                            : "border-stone-200 hover:border-brand/50"
                        }`}
                      >
                        <img
                          loading="lazy"
                          src={imgSrc(image)}
                          alt={od}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = logo;
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dimensions */}
              {safeValue(currentVariant.dimensions) && (
                <div className="mb-4">
                  <p className="text-sm text-stone-600">
                    <span className="font-semibold">Dimensions:</span>{" "}
                    {safeValue(currentVariant.dimensions)}
                  </p>
                </div>
              )}

              {/* Included components */}
              {currentVariant.includedComponents && (
                <div className="mb-4">
                  <p className="text-sm text-stone-600">
                    <span className="font-semibold">Included:</span>{" "}
                    {currentVariant.includedComponents}
                  </p>
                </div>
              )}

              {/* Tier pricing */}
              {currentVariant?.tierPrices?.length > 0 && (
                <div className="mb-5">
                  <button
                    onClick={() => setShowTierPricing(!showTierPricing)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand underline underline-offset-2 mb-1"
                  >
                    Bulk Buying Pricing
                    {showTierPricing ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </button>
                  <p className="text-xs text-stone-400 mb-2">
                    Add to cart — quantity-based prices apply automatically.
                  </p>
                  {showTierPricing && (
                    <div className="border border-stone-200 rounded-xl overflow-hidden mt-2">
                      {currentVariant.tierPrices.map((tier, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                            index % 2 === 0 ? "bg-stone-50" : "bg-white"
                          }`}
                        >
                          <span className="text-stone-600">
                            {tier.min_qty} –{" "}
                            {tier.max_qty && tier.max_qty > 0
                              ? tier.max_qty
                              : "above"}{" "}
                            units
                          </span>
                          <span className="font-bold text-brand">
                            ₹{Number(tier.price).toFixed(2)} each
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Purchase panel controls (quantity + delivery + CTA) */}
              <div className="mb-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-11 h-11 flex items-center justify-center text-stone-700 hover:bg-stone-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <div className="w-12 h-11 flex items-center justify-center text-sm font-bold text-charcoal">
                      {quantity}
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                      className="w-11 h-11 flex items-center justify-center text-stone-700 hover:bg-stone-50"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="text-xs text-stone-500">
                    <span className="font-semibold text-stone-600">SKU:</span>{" "}
                    {String(currentVariant.id)}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-[#B91C1C] text-white font-extrabold text-sm rounded-xl hover:bg-[#9F1239] transition-all duration-200"
                  >
                    <ShoppingCart size={18} />
                    ADD TO CART
                  </button>
                  <button
                    onClick={handleAddToWishlist}
                    className={`w-12 h-[52px] rounded-xl border-2 flex items-center justify-center transition-colors ${isInWishlist ? "bg-[#B91C1C] border-[#B91C1C] text-white" : "bg-white border-stone-200 text-stone-600 hover:text-[#B91C1C] hover:border-[#B91C1C]/40"}`}
                    aria-label={
                      isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                    }
                  >
                    <Heart
                      size={18}
                      className={isInWishlist ? "fill-white" : ""}
                    />
                  </button>
                </div>
              </div>

              {/* Trust signals */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {[
                  { icon: CheckCircle2, label: "Genuine Product" },
                  { icon: Package, label: "Secure Packing" },
                  { icon: ArrowRight, label: "Easy Returns" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-stone-100 text-center"
                  >
                    <Icon size={16} className="text-brand" />
                    <span className="text-[11px] font-semibold text-stone-600 leading-tight">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Specs grid */}
              {hasAnySpecs && (
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {safeValue(variant.capacity) && (
                    <SpecItem
                      icon={Package}
                      label="Capacity"
                      value={safeValue(variant.capacity)}
                    />
                  )}
                  {safeValue(variant.material) && (
                    <SpecItem
                      icon={Layers}
                      label="Material"
                      value={safeValue(variant.material)}
                    />
                  )}
                  {safeValue(variant.power) && (
                    <SpecItem
                      icon={Zap}
                      label="Wattage"
                      value={safeValue(variant.power)}
                    />
                  )}
                  {safeValue(variant.product_weight) && (
                    <SpecItem
                      icon={Weight}
                      label="Weight"
                      value={safeValue(variant.product_weight)}
                    />
                  )}
                  {safeValue(variant.voltage) && (
                    <SpecItem
                      icon={Zap}
                      label="Voltage"
                      value={safeValue(variant.voltage)}
                    />
                  )}
                  {safeValue(variant.shape) && (
                    <SpecItem
                      icon={Circle}
                      label="Shape"
                      value={safeValue(variant.shape)}
                    />
                  )}
                  {safeValue(variant.number_of_compartments) && (
                    <SpecItem
                      icon={Grid3x3}
                      label="Compartments"
                      value={safeValue(variant.number_of_compartments)}
                    />
                  )}
                </div>
              )}

              {/* ── Tabs Section — inside right column ───────── */}
              <div className="mt-8">
                {/* Tab nav */}
                <div className="flex items-center gap-0 border-b border-stone-200 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide-mx-3 min-[360px]:-mx-4 sm:-mx-6 px-3 min-[360px]:px-4 sm:px-6">
                  {[
                    { id: "description", label: "Description" },
                    {
                      id: "reviews",
                      label: `Reviews${reviews.length > 0 ? ` (${reviews.length})` : ""}`,
                    },
                    { id: "qna", label: "Q & A" },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`flex-shrink-0 whitespace-nowrap px-3 min-[360px]:px-4 sm:px-5 py-3 text-[12px] min-[360px]:text-[13px] sm:text-sm font-semibold border-b-2 transition-all ${
                        activeTab === id
                          ? "border-brand text-brand"
                          : "border-transparent text-stone-500 hover:text-charcoal"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="bg-white rounded-2xl shadow-card p-4 sm:p-6 md:p-8">
                  {/* Description */}
                  {activeTab === "description" && (
                    <div>
                      <h3 className="font-display font-bold text-xl text-charcoal mb-4">
                        Product Description
                      </h3>
                      <p className="text-stone-600 leading-relaxed font-body whitespace-pre-line mb-6">
                        {currentVariant.description ||
                          product.description ||
                          "No description available."}
                      </p>

                      {(currentVariant.keyFeatures || product.keyFeatures) && (
                        <>
                          <h4 className="font-display font-bold text-lg text-charcoal mb-3">
                            Key Features
                          </h4>
                          <div className="space-y-2">
                            {(() => {
                              let text =
                                currentVariant.keyFeatures ||
                                product.keyFeatures ||
                                "";
                              if (Array.isArray(text)) text = text.join("\n");
                              text = String(text);
                              return text
                                .split("\n")
                                .filter((l) => l.trim() !== "")
                                .map((line, i) => {
                                  const cleanedLine = line
                                    .trim()
                                    .replace(/^[•\-\*]\s*/, "");
                                  if (cleanedLine.includes(":")) {
                                    const [boldPart, ...rest] =
                                      cleanedLine.split(":");
                                    return (
                                      <div
                                        key={i}
                                        className="flex items-start gap-2"
                                      >
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand mt-2 flex-shrink-0" />
                                        <p className="text-sm text-stone-600 leading-relaxed">
                                          <strong className="text-charcoal">
                                            {boldPart}:
                                          </strong>{" "}
                                          {rest.join(":").trim()}
                                        </p>
                                      </div>
                                    );
                                  }
                                  return (
                                    <div
                                      key={i}
                                      className="flex items-start gap-2"
                                    >
                                      <div className="w-1.5 h-1.5 rounded-full bg-brand mt-2 flex-shrink-0" />
                                      <p className="text-sm text-stone-600 leading-relaxed">
                                        {cleanedLine}
                                      </p>
                                    </div>
                                  );
                                });
                            })()}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Reviews */}
                  {activeTab === "reviews" && (
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
                        <div>
                          <h3 className="font-display font-bold text-xl text-charcoal mb-1">
                            Customer Reviews
                          </h3>
                          {reviews.length > 0 && avgRating > 3 && (
                            <div className="flex items-center gap-2">
                              <StarDisplay rating={avgRating} size={16} />
                              <span className="font-bold text-charcoal">
                                {avgRating.toFixed(1)}
                              </span>
                              <span className="text-stone-400 text-sm">
                                from {reviews.length} reviews
                              </span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => setShowReviewForm(!showReviewForm)}
                          className={
                            showReviewForm ? "btn-secondary" : "btn-primary"
                          }
                        >
                          {showReviewForm ? "Cancel" : "Write a Review"}
                        </button>
                      </div>

                      {/* Review form */}
                      {showReviewForm && (
                        <div className="bg-cream-50 rounded-xl border border-stone-200 p-5 mb-6">
                          <h4 className="font-semibold text-charcoal mb-4">
                            Your Review
                          </h4>
                          {/* Star picker */}
                          <div className="mb-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                              Rating
                            </p>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((starValue) => (
                                <button
                                  key={starValue}
                                  onClick={() =>
                                    setNewReview({
                                      ...newReview,
                                      rating: starValue,
                                    })
                                  }
                                  className="transition-transform hover:scale-110"
                                >
                                  <Star
                                    size={28}
                                    className={
                                      starValue <= newReview.rating
                                        ? "fill-gold-500 text-gold-500"
                                        : "text-stone-300"
                                    }
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          {/* Comment */}
                          <div className="mb-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                              Comment
                            </p>
                            <textarea
                              rows={4}
                              value={newReview.comment || ""}
                              onChange={(e) =>
                                setNewReview({
                                  ...newReview,
                                  comment: e.target.value,
                                })
                              }
                              placeholder="Share your experience with this product..."
                              className="w-full px-4 py-3 text-sm font-body text-charcoal bg-white border border-stone-200 rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 resize-none transition-colors"
                            />
                          </div>
                          {/* Images */}
                          <div className="mb-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                              Photos
                            </p>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) =>
                                setSelectedImages(Array.from(e.target.files))
                              }
                              className="text-sm text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand file:text-white hover:file:bg-brand-700"
                            />
                            {selectedImages.length > 0 && (
                              <div className="flex gap-2 mt-2 flex-wrap">
                                {selectedImages.map((file, i) => (
                                  <img
                                    key={i}
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${i + 1}`}
                                    className="w-16 h-16 object-cover rounded-lg border border-stone-200"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          {/* Video */}
                          <div className="mb-5">
                            <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                              Video (max 8MB)
                            </p>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                if (!file.type.startsWith("video/")) {
                                  alert("Please upload a valid video file.");
                                  return;
                                }
                                if (file.size > 8 * 1024 * 1024) {
                                  alert("Video must be less than 8MB.");
                                  e.target.value = "";
                                  return;
                                }
                                setSelectedVideo(file);
                                setVideoPreviewUrl(URL.createObjectURL(file));
                              }}
                              className="text-sm text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200"
                            />
                            {videoPreviewUrl && (
                              <video
                                controls
                                className="mt-2 h-24 rounded-lg border border-stone-200"
                              >
                                <source
                                  src={videoPreviewUrl}
                                  type="video/mp4"
                                />
                              </video>
                            )}
                          </div>
                          <button
                            onClick={handleAddReview}
                            disabled={isSubmitting}
                            className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? (
                              <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Submitting...
                              </span>
                            ) : (
                              "Submit Review"
                            )}
                          </button>
                        </div>
                      )}

                      {/* Reviews list */}
                      {reviews.length > 0 ? (
                        <div className="space-y-4">
                          {reviews
                            .slice(0, visibleCount)
                            .map((review, index) => (
                              <div
                                key={index}
                                className="border border-stone-100 rounded-xl p-4 bg-stone-50/50"
                              >
                                <div className="flex items-start justify-between gap-2 mb-3">
                                  <div>
                                    <p className="font-semibold text-charcoal text-sm">
                                      {review.user.username}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <StarDisplay
                                        rating={review.rating}
                                        size={12}
                                      />
                                      <span className="text-xs text-stone-400">
                                        {new Date(
                                          review.createdAt,
                                        ).toLocaleDateString("en-IN", {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {review.reviewText && (
                                  <p className="text-sm text-stone-600 leading-relaxed mb-3">
                                    {review.reviewText}
                                  </p>
                                )}
                                {review.images?.length > 0 && (
                                  <div className="flex gap-2 flex-wrap mb-3">
                                    {review.images.map((imgObj, i) => (
                                      <img
                                        key={i}
                                        loading="lazy"
                                        src={imgObj.image}
                                        alt={`Review image ${i + 1}`}
                                        onClick={() =>
                                          handleReviewImageClick(imgObj.image)
                                        }
                                        className="w-16 h-16 object-cover rounded-lg border border-stone-200 cursor-zoom-in hover:opacity-90 transition-opacity"
                                      />
                                    ))}
                                  </div>
                                )}
                                {review.videoUrl && (
                                  <video
                                    controls
                                    className="h-24 rounded-lg border border-stone-200 mb-3"
                                  >
                                    <source
                                      src={review.videoUrl}
                                      type="video/mp4"
                                    />
                                  </video>
                                )}
                                {review.replies?.length > 0 && (
                                  <div className="border-l-2 border-brand/30 pl-3 space-y-2">
                                    {review.replies.map((reply) => (
                                      <div
                                        key={reply.id}
                                        className="bg-brand/5 rounded-lg p-3"
                                      >
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="inline-flex items-center px-2 py-0.5 bg-brand text-white text-[10px] font-bold rounded-full">
                                            Support
                                          </span>
                                          <span className="text-[10px] text-stone-400">
                                            {new Date(
                                              reply.replied_at,
                                            ).toLocaleString()}
                                          </span>
                                        </div>
                                        <p className="text-sm text-stone-600">
                                          {reply.message}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          <div className="flex gap-2 pt-2">
                            {visibleCount < reviews.length && (
                              <button
                                onClick={handleShowMore}
                                className="btn-ghost text-sm"
                              >
                                Show More{" "}
                                <ChevronDown size={14} className="ml-1" />
                              </button>
                            )}
                            {visibleCount > 3 && (
                              <button
                                onClick={handleShowLess}
                                className="btn-ghost text-sm"
                              >
                                Show Less{" "}
                                <ChevronUp size={14} className="ml-1" />
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Star
                            size={40}
                            className="text-stone-200 mx-auto mb-3"
                          />
                          <p className="text-stone-500 font-body">
                            No reviews yet. Be the first to review!
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Q&A */}
                  {activeTab === "qna" && (
                    <div>
                      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                        <h3 className="font-display font-bold text-xl text-charcoal">
                          Questions & Answers
                        </h3>
                        <button
                          onClick={() => setShowQuestionForm(!showQuestionForm)}
                          className={
                            showQuestionForm ? "btn-secondary" : "btn-primary"
                          }
                        >
                          <MessageCircle size={16} />
                          {showQuestionForm ? "Cancel" : "Ask a Question"}
                        </button>
                      </div>

                      {showQuestionForm && (
                        <div className="bg-cream-50 rounded-xl border border-stone-200 p-5 mb-6">
                          <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                            Your Question
                          </p>
                          <textarea
                            rows={3}
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            placeholder="What would you like to know about this product?"
                            className="w-full px-4 py-3 text-sm font-body text-charcoal bg-white border border-stone-200 rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 resize-none transition-colors mb-3"
                          />
                          <button
                            onClick={handleAskQuestion}
                            className="btn-primary"
                          >
                            <Send size={15} />
                            Submit Question
                          </button>
                        </div>
                      )}

                      {qas.length > 0 ? (
                        <div className="space-y-4">
                          {qas.slice(0, visibleQACount).map((qa) => (
                            <div
                              key={qa.id}
                              className="border border-stone-100 rounded-xl p-4"
                            >
                              <div className="flex items-start gap-3 mb-2">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center">
                                  Q
                                </span>
                                <p className="font-semibold text-charcoal text-sm leading-snug">
                                  {qa.question}
                                </p>
                              </div>
                              {qa.userEmail && (
                                <p className="text-xs text-stone-400 ml-9 mb-2">
                                  Asked by {qa.userEmail}
                                </p>
                              )}
                              {qa.answer && (
                                <div className="flex items-start gap-3 mt-3 pt-3 border-t border-stone-100">
                                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center">
                                    A
                                  </span>
                                  <div>
                                    <span className="inline-flex items-center px-2 py-0.5 bg-brand text-white text-[10px] font-bold rounded-full mr-2">
                                      Support
                                    </span>
                                    <span className="text-sm text-stone-600">
                                      {qa.answer}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          {visibleQACount < qas.length && (
                            <button
                              onClick={handleShowMoreQA}
                              className="btn-ghost text-sm"
                            >
                              Load More Questions <ChevronDown size={14} />
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <MessageCircle
                            size={40}
                            className="text-stone-200 mx-auto mb-3"
                          />
                          <p className="text-stone-500 font-body">
                            No questions yet. Ask the first one!
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* end tabs */}
              </div>
              {/* ── Related Products (inside right scroll area) ─────── */}
              {Array.isArray(relatedProducts) &&
                relatedProducts.some((p) =>
                  p?.variants?.some((v) => v.stock > 0),
                ) && (
                  <div className="mt-12">
                    <div className="section-header mb-6">
                      <h2 className="section-title">Related Products</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {relatedProducts.map((rp, index) => {
                        const availableVariant = rp?.variants?.find(
                          (v) => v.stock > 0,
                        );
                        if (!availableVariant) return null;
                        return (
                          <div
                            key={index}
                            className="product-card group cursor-pointer"
                            onClick={() => handleProductClick(rp.id, rp.name)}
                          >
                            <div className="product-card-image bg-white">
                              <img
                                loading="lazy"
                                src={availableVariant.images?.[0] || logo}
                                alt={rp.name}
                                className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = logo;
                                }}
                              />
                            </div>
                            <div className="p-3.5">
                              <h3 className="font-body font-semibold text-charcoal text-xs leading-snug line-clamp-2 mb-2">
                                {rp.name}
                              </h3>
                              <p className="font-bold text-brand text-sm">
                                ₹
                                {Number(availableVariant.price).toLocaleString(
                                  "en-IN",
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>
            {/* end RIGHT */}
          </div>
          {/* end two-col */}
        </div>
        {/* end container */}
      </div>
      {/* end page wrapper */}

      {/* ── Modals rendered outside the layout ─────────────────────── */}
      {/* ── Image zoom modal ─────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-[500] bg-black flex items-center justify-center sm:p-4"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full h-full sm:max-w-[1320px] sm:h-[88vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile close */}
            <button
              onClick={handleCloseModal}
              className="sm:hidden absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
            <div className="h-full grid grid-cols-1 sm:grid-cols-[96px_1fr_64px] gap-0 sm:gap-4 items-stretch">
              {/* Thumbnails */}
              <div className="hidden sm:flex flex-col items-center overflow-hidden bg-white/0">
                <button
                  type="button"
                  className="w-12 h-10 text-white/80 hover:text-white flex items-center justify-center"
                  aria-label="Scroll thumbnails up"
                  onClick={(e) => {
                    const el =
                      e.currentTarget.parentElement?.querySelector(
                        "[data-thumbs]",
                      );
                    if (el) el.scrollBy({ top: -220, behavior: "smooth" });
                  }}
                >
                  <ChevronUp size={20} />
                </button>
                <div
                  data-thumbs
                  className="flex-1 w-full flex flex-col items-center gap-3 overflow-y-auto scrollbar-hide"
                >
                  {(images || []).map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setModalIndex(i);
                        setSelectedImagePreview(img);
                        setZoomLevel(1);
                      }}
                      className={`w-[76px] h-[76px] rounded-md overflow-hidden border transition-all bg-white ${modalIndex === i ? "border-white" : "border-white/25 hover:border-white/70"}`}
                    >
                      <img
                        loading="lazy"
                        src={imgSrc(img)}
                        alt={`Thumb ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = logo;
                        }}
                      />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="w-12 h-10 text-white/80 hover:text-white flex items-center justify-center"
                  aria-label="Scroll thumbnails down"
                  onClick={(e) => {
                    const el =
                      e.currentTarget.parentElement?.querySelector(
                        "[data-thumbs]",
                      );
                    if (el) el.scrollBy({ top: 220, behavior: "smooth" });
                  }}
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {/* Main image */}
              <div className="relative overflow-hidden bg-black/0 flex items-center justify-center">
                {/* arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const next =
                          modalIndex === 0 ? images.length - 1 : modalIndex - 1;
                        setModalIndex(next);
                        setSelectedImagePreview(images[next]);
                        setZoomLevel(1);
                      }}
                      className="absolute left-2 min-[360px]:left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 min-[360px]:w-10 min-[360px]:h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const next =
                          modalIndex === images.length - 1 ? 0 : modalIndex + 1;
                        setModalIndex(next);
                        setSelectedImagePreview(images[next]);
                        setZoomLevel(1);
                      }}
                      className="absolute right-2 min-[360px]:right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 min-[360px]:w-10 min-[360px]:h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}

                <div className="w-full h-full overflow-hidden bg-black flex items-center justify-center">
                  <img
                    loading="lazy"
                    src={imgSrc(selectedImagePreview || images?.[modalIndex])}
                    alt="Enlarged"
                    style={{
                      transform: `scale(${zoomLevel})`,
                      transition: "transform 0.2s ease",
                      transformOrigin: "center",
                    }}
                    className="w-full h-full object-contain sm:object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = logo;
                    }}
                  />
                </div>

                <div className="sm:hidden absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur px-2 py-2 flex gap-2 overflow-x-auto">
                  {(images || []).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setModalIndex(i);
                        setSelectedImagePreview(img);
                        setZoomLevel(1);
                      }}
                      className={`min-w-[60px] h-[60px] rounded-md overflow-hidden border ${
                        modalIndex === i ? "border-white" : "border-white/40"
                      }`}
                    >
                      <img
                        src={imgSrc(img)}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Zoom controls */}
              <div className="hidden sm:flex flex-col items-center overflow-hidden">
                <button
                  onClick={handleCloseModal}
                  className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors mb-2"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
                <button
                  onClick={handleZoomIn}
                  className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Zoom in"
                >
                  <ZoomIn size={18} />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Zoom out"
                >
                  <ZoomOut size={18} />
                </button>
                <div className="text-white/90 text-xs font-semibold mt-1">
                  {Math.round(zoomLevel * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Review image modal ───────────────────────────── */}
      {showReviewImageModal && (
        <div
          className="fixed inset-0 z-[500] bg-black/85 flex items-center justify-center p-4"
          onClick={handleCloseReviewModal}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseReviewModal}
              className="absolute -top-4 -right-4 w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
            {selectedReviewImage && (
              <img
                loading="lazy"
                src={selectedReviewImage}
                alt="Review image"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      )}

      {/* ── Question submitted popup ─────────────────────── */}
      {showPopup && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[600] bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-[90%] text-center border border-stone-100">
          <CheckCircle2 size={40} className="text-brand mx-auto mb-3" />
          <p className="font-semibold text-charcoal">
            Thank you for your question!
          </p>
          <p className="text-sm text-stone-500 mt-1">
            Our team will get back to you soon.
          </p>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
