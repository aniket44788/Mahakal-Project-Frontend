import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  toastSuccess,
  toastError,
  toastInfo,
  toastWarning,
  toastOrderSuccess,
} from "../Toast";

import {
  Star,
  ShoppingCart,
  Heart,
  MapPin,
  Truck,
  Shield,
  Wallet,
  Award,
  ThumbsUp,
  MessageCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Zap,
  RefreshCw,
} from "lucide-react";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("2.5 Inch");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addresses, setAddresses] = useState([]); // all user's addresses
  const [selectedAddressId, setSelectedAddressId] = useState(null); // chosen address id
  const [addressesLoading, setAddressesLoading] = useState(false);

  // New states for buy flow
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [buyingProduct, setBuyingProduct] = useState(null);
  const [buyingQuantity, setBuyingQuantity] = useState(1);

  // Reviews state - replace mock with fetched data
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Review modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  // New: User details for prefill (fetch once)
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    contact: "",
  });

  // helper to load addresses and user details from profile
  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true);
      const token = localStorage.getItem("mahakalToken");
      if (!token) return setAddresses([]); // not logged in
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const user = res.data.user || res.data; // adjust based on your API shape
      const userAddresses = user?.addresses || [];
      setAddresses(userAddresses);

      // Set user details for Razorpay prefill
      setUserDetails({
        name: user.fullName || "",
        email: user.email || "",
        contact: user.phone || "",
      });

      // If there's a default address, auto-select it
      const defaultAddr = userAddresses.find((a) => a.isDefault);
      if (defaultAddr) setSelectedAddressId(defaultAddr._id);
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
      setAddresses([]);
    } finally {
      setAddressesLoading(false);
    }
  };

  // Fetch reviews function
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/review/allreviews/${id}`,
      );
      setReviews(res.data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Submit review function
  const handleSubmitReview = async () => {
    if (reviewRating < 1 || !reviewComment.trim()) {
      toastWarning("Please provide a rating and comment.");
      return;
    }
    try {
      const token = localStorage.getItem("mahakalToken");
      if (!token) {
        toastWarning("Please login to write a review");
        navigate("/profile");
        return;
      }
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/review/addreview`,
        {
          productId: id,
          rating: reviewRating,
          comment: reviewComment,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.data.success) {
        toastSuccess("Review submitted successfully!");
        setShowReviewModal(false);
        setReviewRating(5);
        setReviewComment("");
        fetchReviews(); // Refetch to update list
      } else {
        toastError(res.data.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      toastError(err.response?.data?.message || "Failed to submit review");
    }
  };

  // Format review date
  const formatReviewDate = (dateString) => {
    const now = new Date();
    const reviewDate = new Date(dateString);
    const diffTime = Math.abs(now - reviewDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 1) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/single/${id}`,
        );
        if (res.data.success) {
          setProduct(res.data.product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    fetchReviews();
  }, [id]);

  // call once on mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  // Computed values for ratings
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 5.0;
  const ratingCount = reviews.length;

  const getRatingDistribution = () => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      dist[r.rating] = (dist[r.rating] || 0) + 1;
    });
    return [5, 4, 3, 2, 1].map((star) => {
      const count = dist[star];
      const perc =
        ratingCount > 0 ? Math.round((count / ratingCount) * 100) : 0;
      return { star, perc };
    });
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const calculateDiscount = () => {
    if (product?.discountPrice && product?.price) {
      return Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      );
    }
    return 0;
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const nextImage = () => {
    if (product?.images) {
      setSelectedImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1,
      );
    }
  };

  // New function to initiate buy flow (show address modal first)
  const initiateBuy = (product, qty) => {
    setBuyingProduct(product);
    setBuyingQuantity(qty);
    setShowAddressModal(true);
  };

  // New function to handle address confirmation and proceed to payment
  const handleConfirmAddress = async () => {
    if (!selectedAddressId) {
      toastWarning(
        "Please select a delivery address before placing the order.",
      );
      return;
    }
    setShowAddressModal(false);
    await handlePayment(buyingProduct, buyingQuantity, selectedAddressId);
  };

  // Load Razorpay Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Extracted payment logic (assumes address is selected)
  const handlePayment = async (product, qty, addressId) => {
    try {
      if (!product) {
        console.error("❌ No product passed to handleBuyNow");
        return;
      }

      const token = localStorage.getItem("mahakalToken");
      if (!token) {
        toastWarning("Please login to continue");
        navigate("/profile");
        return;
      }

      // Load Razorpay
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toastWarning("Razorpay SDK failed to load.");
        return;
      }

      // Fixed: Use correct generic fields (discountPrice / price) to avoid null/undefined
      const finalPrice = Number(product.discountPrice) || Number(product.price);
      const finalAmount = finalPrice * qty;

      // Added: Safeguard against invalid price
      if (isNaN(finalPrice) || finalPrice <= 0) {
        toastInfo("Invalid product price. Please try again.");
        return;
      }

      if (finalAmount < 1) {
        toastWarning("Amount must be at least ₹1.");
        return;
      }

      // Fixed: Use correct generic field (images)
      const productImages = (product.images || []).map((img) => ({
        url: img.url || img,
        public_id: img.public_id || img._id,
      }));

      // Create Order - Fixed: Use consistent API_URL; generic fields in payload
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        {
          products: [
            {
              product: product._id,
              // Fixed: Use correct generic field (name)
              name: product.name,
              category: product.category || "Prasad",
              images: productImages,
              quantity: qty,
              price: finalPrice,
              unit: product.unit || "gm",
            },
          ],
          amount: finalAmount, // in rupees
          currency: "INR",
          addressId: addressId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.data.success) {
        throw new Error(res.data.message || "Order creation failed");
      }

      const order = res.data.order;

      // Razorpay Options - Fixed: Use APP_NAME; generic description
      const options = {
        key: import.meta.env.VITE_APP_RAZORPAY,
        amount: res.data.razorpayOrder.amount, // ✔ Comes from backend (already *100)
        currency: res.data.razorpayOrder.currency, // ✔ "INR"
        name: import.meta.env.VITE_APP_NAME || "Mahakal Bazar",
        description:
          product.templePrasadTitle || product.name || "Product Purchase", // ✔ Fallback to name if templePrasadTitle missing
        order_id: res.data.razorpayOrder.id, // ✔ Razorpay order id

        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/payment/verify-payment`,
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } },
            );

            if (verifyRes.data.success) {
              toastOrderSuccess();
              navigate("/");
            } else {
              toastWarning("Payment verification failed.");
            }
          } catch (verifyErr) {
            console.error("Verification error:", verifyErr);
            toastError("Payment verification failed.");
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.contact,
        },
        theme: {
          color: "#f97316",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("BUY NOW ERROR:", err); // Log full error
      if (err.response) {
        console.error("Error response data:", err.response.data); // Log response body for debug
        console.error("Error status:", err.response.status);
      }
      toastError(
        err.response?.data?.message || err.message || "Payment failed",
      );
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("mahakalToken");
      if (!token) {
        toastWarning("Please login to add items to cart");
        navigate("/login");
        return;
      }

      // Fixed: Use consistent API_URL
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/add`,
        { productId: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        toastSuccess("Item added to cart.");
      } else {
        toastWarning(res.data.message || "Failed to add item");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toastError("Something went wrong!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mx-auto mb-6"></div>
          <p className="text-xl font-semibold text-gray-700">
            Loading sacred product...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-700">Product not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30 p-4 lg:p-12 font-sans antialiased">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
            {/* Breadcrumb Section */}
            <div className="lg:col-span-12 ">
              <nav
                className="text-sm text-gray-500 flex flex-wrap items-center gap-2"
                aria-label="Breadcrumb"
              >
                <a href="/" className="hover:text-gray-800 transition-colors">
                  Home
                </a>
                <span className="text-gray-400 mx-1">/</span>
                <a
                  href="/products"
                  className="hover:text-gray-800 transition-colors"
                >
                  Products
                </a>
                <span className="text-gray-400 mx-1">/</span>
                <span className="text-gray-800 font-semibold">
                  {product.name}
                </span>
              </nav>
            </div>

            {/* LEFT: Enhanced Visual Gallery */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Image Container */}
              <div className="relative aspect-[4/5] rounded-3xl lg:rounded-[2.5rem] overflow-hidden bg-white shadow-2xl shadow-orange-200/20 group">
                <img
                  src={
                    product.images?.[selectedImageIndex]?.url ||
                    product.images?.url ||
                    "/api/placeholder/600/800"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Floating Action Bar - Enhanced */}
                <div className="absolute bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-white/30 backdrop-blur-2xl rounded-2xl border border-white/50 shadow-2xl">
                  {product.images?.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`h-2 transition-all duration-300 rounded-full ${
                        selectedImageIndex === idx
                          ? "w-10 bg-orange-500 shadow-lg shadow-orange-500/50"
                          : "w-2 bg-white/70 hover:bg-white hover:scale-125"
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Discount Tag - Enhanced */}
                {product.discountPrice && (
                  <div className="absolute top-4 lg:top-6 left-4 lg:left-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-2xl text-sm font-black italic shadow-lg shadow-orange-500/30 animate-pulse">
                    🔥 SAVE {calculateDiscount()}%
                  </div>
                )}
              </div>

              {/* Thumbnail Strip - Enhanced */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
                {product.images?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                      selectedImageIndex === index
                        ? "ring-4 ring-orange-500 ring-offset-2 scale-95 shadow-xl"
                        : "opacity-70 hover:opacity-100 hover:scale-105"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: Enhanced Control Panel */}
            <div className="lg:col-span-6 space-y-6 lg:space-y-8 flex flex-col justify-center">
              {/* Stock Status - Enhanced */}
              <section>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 mb-4 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-xs font-bold text-orange-700 uppercase tracking-wide">
                    ✓ In Stock & Ready to Ship
                  </span>
                </div>

                {/* Product Title - Enhanced */}
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 leading-tight mb-4">
                  {product.name}
                  <span className="block text-lg lg:text-xl font-medium text-orange-600 mt-2">
                    {product.tagline || "Premium Quality"}
                  </span>
                </h1>

                {/* Price Card - Enhanced */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-gradient-to-br from-white to-orange-50/50 p-6 rounded-3xl border border-orange-200 shadow-xl shadow-orange-100/50">
                  {/* Current Price */}
                  <div className="flex-1">
                    <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
                      Today's Price
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl lg:text-5xl font-black text-orange-600">
                        ₹{product.discountPrice || product.price}
                      </span>
                      {!product.discountPrice && (
                        <span className="text-sm text-slate-400">
                          incl. taxes
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Original Price if discounted */}
                  {product.discountPrice && (
                    <>
                      <div className="hidden sm:block h-12 w-px bg-orange-200" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          M.R.P
                        </span>
                        <span className="text-2xl lg:text-3xl font-bold text-slate-400 line-through">
                          ₹{product.price}
                        </span>
                        <span className="text-sm font-bold text-green-600 mt-1">
                          Save ₹{product.price - product.discountPrice}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* Info Cards - Enhanced Bento Style */}
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <div className="p-6 rounded-2xl lg:rounded-3xl bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <p className="text-xs font-black text-slate-400 uppercase mb-3 tracking-wider">
                    📋 Specifications
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                      <span className="text-sm text-slate-600">Size</span>
                      <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                        {product.size}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Weight</span>
                      <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                        {product.weight}g
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl lg:rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <p className="text-xs font-black text-slate-400 uppercase mb-3 tracking-wider">
                    🌿 Materials
                  </p>
                  <p className="text-sm font-medium leading-relaxed opacity-90">
                    {product.material ||
                      "Crafted from premium sustainable sources with eco-friendly practices."}
                  </p>
                </div>
              </div>

              {/* Quantity Selector - Enhanced */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-2 bg-white rounded-2xl lg:rounded-3xl border border-slate-200 shadow-lg">
                <div className="flex items-center justify-between sm:justify-start gap-1 p-1 bg-slate-50 rounded-xl">
                  <button
                    onClick={decreaseQuantity}
                    className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white transition-all font-bold text-xl text-slate-600 hover:text-orange-600 hover:shadow-md"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-14 text-center font-black text-lg text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white transition-all font-bold text-xl text-slate-600 hover:text-orange-600 hover:shadow-md"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <div className="px-4 sm:px-6 py-3 sm:py-0 text-center sm:text-right bg-gradient-to-r from-orange-50 to-transparent sm:bg-none rounded-xl sm:rounded-none">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                    Grand Total
                  </p>
                  <p className="text-2xl lg:text-3xl font-black text-slate-900">
                    ₹{(product.discountPrice || product.price) * quantity}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    inclusive of all taxes
                  </p>
                </div>
              </div>

              {/* Action Buttons - Enhanced */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                {/* Add to Cart Button - Enhanced */}
                {product.isAvailable && (
                  <button
                    onClick={handleAddToCart}
                    className="group relative h-14 lg:h-16 rounded-2xl lg:rounded-[1.5rem] bg-white border-2 border-slate-900 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 w-0 bg-gradient-to-r from-slate-900 to-slate-800 transition-all duration-500 group-hover:w-full" />
                    <span className="relative z-10 flex items-center justify-center gap-2 h-full font-black text-sm lg:text-base text-slate-900 group-hover:text-white transition-colors duration-300">
                      <ShoppingCart
                        size={18}
                        className="group-hover:rotate-12 transition-transform"
                      />
                      ADD TO CART
                    </span>
                  </button>
                )}

                {/* Buy Now Button - Enhanced */}
                <button
                  onClick={() => initiateBuy(product, quantity)}
                  disabled={!product.isAvailable}
                  className={`h-14 lg:h-16 rounded-2xl lg:rounded-[1.5rem] font-black text-sm lg:text-base transition-all duration-300 ${
                    product.isAvailable
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 hover:-translate-y-1 active:translate-y-0"
                      : "bg-gradient-to-r from-slate-300 to-slate-400 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  {product.isAvailable ? (
                    <span className="flex items-center justify-center gap-2">
                      <Zap size={18} />
                      BUY NOW
                    </span>
                  ) : (
                    "OUT OF STOCK"
                  )}
                </button>
              </div>

              {/* Trust Badges - New */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Truck size={14} className="text-orange-500" />
                  <span>Free Shipping</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <div className="flex items-center gap-1">
                  <Shield size={14} className="text-orange-500" />
                  <span>2 Year Warranty</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <div className="flex items-center gap-1">
                  <RefreshCw size={14} className="text-orange-500" />
                  <span>30 Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Single Page Content - Description, Shipping, Reviews */}
      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto  sm:px-6 lg:px-8 py-12">
          {/* 1. DESCRIPTION SECTION */}
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
              Product Description
            </h2>

            <div className="prose prose-lg max-w-none mb-8">
              <div className="text-gray-700 leading-relaxed text-lg text-center mb-8">
                {product.description ||
                  "This sacred product is carefully prepared following traditional methods and blessed with divine energy. Perfect for your daily prayers and spiritual practices."}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-2xl border border-orange-100 text-center">
                <div className="flex justify-center mb-4">
                  <Award className="text-orange-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Quality Assurance
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Made with premium ingredients and traditional methods to
                  ensure authenticity and purity for your spiritual practices.
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100 text-center">
                <div className="flex justify-center mb-4">
                  <Shield className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Blessed & Sacred
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Each product is blessed and prepared with utmost devotion
                  following religious traditions and ancient practices.
                </p>
              </div>
            </div>
          </div>

          {/* 2. SHIPPING SECTION */}
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
              Shipping & Delivery
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Shipping Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <Truck className="text-green-600 flex-shrink-0" size={28} />
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        Free Delivery
                      </h4>
                      <p className="text-gray-600">
                        On orders above ₹500 across India
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <MapPin className="text-blue-600 flex-shrink-0" size={28} />
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        Pan India Delivery
                      </h4>
                      <p className="text-gray-600">
                        We deliver to all states and cities
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                    <Shield
                      className="text-orange-600 flex-shrink-0"
                      size={28}
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        Secure Packaging
                      </h4>
                      <p className="text-gray-600">
                        Safe, hygienic and spiritual packaging
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Return & Delivery Policy
                </h3>

                <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-8 rounded-2xl border border-orange-200">
                  <ul className="space-y-4 text-gray-800">
                    <li className="flex items-start gap-3">
                      <span className="text-orange-600 mt-1 text-xl">✓</span>
                      <span className="text-lg">
                        Orders are accepted only through online payment (No Cash
                        on Delivery).
                      </span>
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="text-orange-600 mt-1 text-xl">✓</span>
                      <span className="text-lg">
                        Prashad can be collected directly from the temple or
                        designated pickup points.
                      </span>
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="text-orange-600 mt-1 text-xl">✓</span>
                      <span className="text-lg">
                        Refunds are provided only if payment is deducted but
                        order confirmation fails.
                      </span>
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="text-red-600 mt-1 text-xl">!</span>
                      <span className="text-lg">
                        Due to the perishable and sacred nature of Prashad,
                        returns or replacements are not accepted once collected.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 3. REVIEWS SECTION */}
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-0">
                Customer Reviews
              </h2>
              <button
                onClick={() => setShowReviewModal(true)}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Write Review
              </button>
            </div>

            {reviewsLoading ? (
              <div className="text-center py-8">
                <Loader2 className="animate-spin mx-auto h-8 w-8 text-orange-600" />
                <p className="mt-2 text-gray-600">Loading reviews...</p>
              </div>
            ) : (
              <>
                {/* Reviews Summary */}
                {ratingCount > 0 && (
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-8 rounded-2xl border border-orange-100 mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-gray-900 mb-3">
                          {averageRating}
                        </div>
                        <div className="flex justify-center mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={24}
                              className={
                                i < Math.round(averageRating)
                                  ? "fill-yellow-400 stroke-yellow-400"
                                  : "stroke-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <div className="text-gray-600 text-lg">
                          Based on {ratingCount} reviews
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        {getRatingDistribution().map(({ star, perc }) => (
                          <div
                            key={star}
                            className="flex items-center gap-4 mb-3"
                          >
                            <span className="text-sm w-3 font-medium">
                              {star}
                            </span>
                            <Star
                              size={18}
                              className="fill-yellow-400 stroke-yellow-400"
                            />
                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-yellow-400 h-3 rounded-full transition-all"
                                style={{ width: `${perc}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-12 font-medium">
                              {perc}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Individual Reviews */}
                {ratingCount === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">No reviews yet.</p>
                    <p className="mt-2">
                      Be the first to share your experience!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {reviews.map((review) => {
                      const userName = review.user?.name || "Anonymous";
                      const userInitial = userName.charAt(0).toUpperCase();
                      return (
                        <div
                          key={review._id}
                          className="bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
                        >
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                {userInitial}
                              </div>
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-bold text-gray-900 text-lg">
                                    {userName}
                                  </h4>
                                  {review.verified && (
                                    <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-semibold">
                                      Verified Purchase
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        size={18}
                                        className={
                                          i < review.rating
                                            ? "fill-yellow-400 stroke-yellow-400"
                                            : "stroke-gray-300"
                                        }
                                      />
                                    ))}
                                  </div>
                                  <span className="text-gray-500">
                                    {formatReviewDate(review.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                            {review.comment}
                          </p>
                          {/* <div className="flex items-center gap-6">
                                                        <button className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors font-medium">
                                                            <ThumbsUp size={18} />
                                                            <span>Helpful ({review.helpful || 0})</span>
                                                        </button>
                                                        <button className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors font-medium">
                                                            <MessageCircle size={18} />
                                                            <span>Reply</span>
                                                        </button>
                                                        <button className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors font-medium">
                                                            <Share2 size={18} />
                                                            <span>Share</span>
                                                        </button>
                                                    </div> */}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* New Address Selection Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-800">
                Select Delivery Address
              </h2>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-gray-600 hover:text-gray-800 rounded-full p-2 transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-gray-800 mb-3">
                Choose an address for "{buyingProduct?.name}"
              </h4>
              {addressesLoading ? (
                <div className="text-center py-4 text-sm text-gray-500">
                  Loading addresses...
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4 text-sm">
                    No addresses found. Please add one to proceed.
                  </p>
                  <button
                    onClick={() => {
                      setShowAddressModal(false);
                      navigate("/profile");
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Add New Address
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                    {addresses.map((addr) => (
                      <label
                        key={addr._id}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition cursor-pointer ${
                          selectedAddressId === addr._id
                            ? "border-orange-400 bg-orange-50 shadow"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="selectedAddress"
                          value={addr._id}
                          checked={selectedAddressId === addr._id}
                          onChange={() => setSelectedAddressId(addr._id)}
                          className="mt-1 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">
                            {addr.fullName}{" "}
                            {addr.isDefault && (
                              <span className="text-green-600 font-medium">
                                (Default)
                              </span>
                            )}
                          </div>
                          <div className="text-gray-600 text-xs mt-1">
                            {addr.houseNumber}, {addr.street}
                            {addr.landmark ? `, ${addr.landmark}` : ""}
                          </div>
                          <div className="text-gray-600 text-xs">
                            {addr.townCity}, {addr.state} - {addr.pincode}
                          </div>
                          <div className="text-gray-500 text-xs">
                            Phone: {addr.phone}
                            {addr.alternatePhone
                              ? ` / ${addr.alternatePhone}`
                              : ""}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={handleConfirmAddress}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition"
                    disabled={!selectedAddressId}
                  >
                    Confirm Address & Proceed to Payment
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-800">
                Write Your Review
              </h2>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewRating(5);
                  setReviewComment("");
                }}
                className="text-gray-600 hover:text-gray-800 rounded-full p-2 transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <p className="mb-4 text-gray-700">
                How would you rate this product?
              </p>
              <div className="flex justify-center mb-4 gap-1">
                {[5, 4, 3, 2, 1].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="p-1"
                  >
                    <Star
                      size={28}
                      className={`cursor-pointer transition ${
                        reviewRating >= star
                          ? "fill-yellow-400 stroke-yellow-400"
                          : "stroke-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with this product..."
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={4}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewRating(5);
                    setReviewComment("");
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={reviewRating < 1 || !reviewComment.trim()}
                  className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
