import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toastError, toastInfo, toastSuccess, toastWarning } from "../Toast";

function DashboardProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState({});
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [buyingProduct, setBuyingProduct] = useState(null);
  const [buyingQuantity, setBuyingQuantity] = useState(1);
  const [activeMobileMenu, setActiveMobileMenu] = useState(null);

  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true);
      const token = localStorage.getItem("mahakalToken");
      if (!token) return setAddresses([]);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const user = res.data.user || res.data;
      const userAddresses = user?.addresses || [];
      setAddresses(userAddresses);
      const defaultAddr = userAddresses.find((a) => a.isDefault);
      if (defaultAddr) setSelectedAddressId(defaultAddr._id);
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
      setAddresses([]);
    } finally {
      setAddressesLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!autoSlide || products.length === 0) return;

    const interval = setInterval(() => {
      setMainImageIndex((prev) => {
        const newState = { ...prev };
        products.forEach((product) => {
          newState[product._id] =
            ((newState[product._id] || 0) + 1) % product.templeImages.length;
        });
        return newState;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [autoSlide, products.length, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/dashboard/product/get`,
      );
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch temple products");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/dashboard/product/get/${id}`,
      );
      if (response.data.success) {
        setSelectedProduct(response.data.data);
        setModalImageIndex(0);
        setQuantity(1);
        setAutoSlide(false);
      }
    } catch (err) {
      console.error("Error fetching product details:", err);
    }
  };

  const calculateDiscount = (price, discountPrice) =>
    Math.round(((price - discountPrice) / price) * 100);

  const nextModalImage = () => {
    if (selectedProduct) {
      setModalImageIndex(
        (prev) => (prev + 1) % selectedProduct.templeImages.length,
      );
    }
  };

  const prevModalImage = () => {
    if (selectedProduct) {
      setModalImageIndex(
        (prev) =>
          (prev - 1 + selectedProduct.templeImages.length) %
          selectedProduct.templeImages.length,
      );
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedProduct) return "0.00";
    return (selectedProduct.templePrasadDiscountPrice * quantity).toFixed(2);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setAutoSlide(true);
  };

  const getCurrentImageIndex = (productId) => {
    return mainImageIndex[productId] || 0;
  };

  const setCurrentImageIndex = (productId, index) => {
    setMainImageIndex((prev) => ({
      ...prev,
      [productId]: index,
    }));
  };

  const nextProductImage = (productId, product) => {
    const currentIndex = getCurrentImageIndex(productId);
    setCurrentImageIndex(
      productId,
      (currentIndex + 1) % product.templeImages.length,
    );
  };

  const prevProductImage = (productId, product) => {
    const currentIndex = getCurrentImageIndex(productId);
    setCurrentImageIndex(
      productId,
      (currentIndex - 1 + product.templeImages.length) %
        product.templeImages.length,
    );
  };

  const initiateBuy = (product, qty) => {
    setBuyingProduct(product);
    setBuyingQuantity(qty);
    setShowAddressModal(true);
  };

  const handleConfirmAddress = async () => {
    if (!selectedAddressId) {
      toastInfo("Please select a delivery address before placing the order.");
      return;
    }
    setShowAddressModal(false);
    await handlePayment(buyingProduct, buyingQuantity, selectedAddressId);
  };

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

  const handlePayment = async (product, qty, addressId) => {
    try {
      const token = localStorage.getItem("mahakalToken");
      if (!token) {
        navigate("/");
        return;
      }
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toastError("Razorpay SDK failed to load.");
        return;
      }

      const finalPrice = product.templePrasadDiscountPrice;
      const finalAmount = finalPrice * qty;

      if (finalAmount < 1) {
        toastWarning("Amount must be at least ₹1.");
        return;
      }

      const productImages = product.templeImages.map((image) => ({
        url: image.url,
        public_id: image.public_id || image._id,
      }));

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        {
          products: [
            {
              product: product._id,
              name: product.templePrasadTitle,
              category: product.category || "Prasad",
              images: productImages,
              quantity: qty,
              price: finalPrice,
              unit: product.unit || "gm",
            },
          ],
          amount: finalAmount,
          currency: "INR",
          addressId: addressId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to create order");
      }

      const order = res.data.order;

      const options = {
        key: import.meta.env.VITE_APP_RAZORPAY,
        amount: res.data.razorpayOrder.amount,
        currency: res.data.razorpayOrder.currency,
        name: "Mahakal Bazar",
        description: product.templePrasadTitle,
        order_id: res.data.razorpayOrder.id,
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
              toastSuccess(
                "🎉 Order Placed Successfully!\n\nThank you for your purchase. Your prasad will be delivered soon.",
              );
            } else {
              toastWarning(
                "Payment verification failed. Please contact support.",
              );
            }
          } catch (verifyErr) {
            console.error("Payment verification error:", verifyErr);
            toastWarning(
              "Payment verification failed. Please contact support.",
            );
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#f97316",
        },
      };

      const paymentObj = new window.Razorpay(options);
      paymentObj.open();
    } catch (err) {
      toastWarning(`Payment failed , An unexpected error occurred `);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🕉️</span>
            </div>
          </div>
          <p className="text-gray-700 font-medium">
            Loading Sacred Offerings...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl max-w-md text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Unable to Load
          </h2>
          <p className="text-gray-600 mb-6 text-sm">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-full transition duration-300 shadow-lg hover:shadow-xl w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50">
      {/* Header */}

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {products.map((product) => {
            const currentImageIdx = getCurrentImageIndex(product._id);
            const currentImage = product.templeImages[currentImageIdx];
            const discount = calculateDiscount(
              product.templePrasadPrice,
              product.templePrasadDiscountPrice,
            );

            return (
              <div
                key={product._id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Image Section */}
                <div className="relative">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={currentImage?.url}
                      alt={product.templePrasadTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() => fetchProductById(product._id)}
                    />

                    {/* Discount Badge */}
                    {discount > 0 && (
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                        {discount}% OFF
                      </div>
                    )}

                    {/* Rating Badge */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 z-10">
                      <span>⭐</span>
                      <span>{product.templePrasadRating}</span>
                    </div>

                    {/* Image Navigation */}
                    {product.templeImages.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevProductImage(product._id, product);
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white z-20"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextProductImage(product._id, product);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white z-20"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                      {currentImageIdx + 1}/{product.templeImages.length}
                    </div>
                  </div>

                  {/* Thumbnail Strip - Hidden on mobile, visible on hover on desktop */}
                  {product.templeImages.length > 1 && (
                    <div className="absolute -bottom-16 left-0 right-0 bg-white/90 backdrop-blur-sm p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-0 group-hover:translate-y-0 flex gap-1 overflow-x-auto scrollbar-hide z-30 shadow-lg">
                      {product.templeImages.map((image, index) => (
                        <button
                          key={image._id}
                          onClick={() =>
                            setCurrentImageIndex(product._id, index)
                          }
                          className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden transition-all ${
                            index === currentImageIdx
                              ? "ring-2 ring-orange-500 opacity-100"
                              : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={image.url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col">
                  {/* Location */}
                  <div className="flex items-center gap-1 text-orange-600 text-xs mb-1">
                    <span>📍</span>
                    <span className="truncate">{product.templeAddress}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-2 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
                    {product.templePrasadTitle}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg sm:text-xl font-bold text-orange-600">
                      ₹{product.templePrasadDiscountPrice}
                    </span>
                    {product.templePrasadPrice >
                      product.templePrasadDiscountPrice && (
                      <>
                        <span className="text-sm text-gray-400 line-through">
                          ₹{product.templePrasadPrice}
                        </span>
                        <span className="text-xs text-green-600 font-medium hidden sm:inline">
                          Save ₹
                          {product.templePrasadPrice -
                            product.templePrasadDiscountPrice}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-600 mb-3">
                    <span className="hidden sm:block">
                      {product.templePrasadDescription?.length > 150
                        ? product.templePrasadDescription.slice(0, 150) + "..."
                        : product.templePrasadDescription}
                    </span>
                    <span className="sm:hidden">
                      {product.templePrasadDescription?.length > 50
                        ? product.templePrasadDescription.slice(0, 50) + "..."
                        : product.templePrasadDescription}
                    </span>
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-2">
                    <button
                      onClick={() => fetchProductById(product._id)}
                      className="flex-1 cursor-pointer bg-blue-50 text-blue-600 text-xs sm:text-sm font-medium py-2 sm:py-2.5 rounded-lg hover:bg-blue-100 transition-colors"
                    > 
                      Details
                    </button>
                    <button
                      onClick={() => initiateBuy(product, 1)}
                      className="flex-1 cursor-pointer bg-orange-600 text-white text-xs sm:text-sm font-medium py-2 sm:py-2.5 rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Detail Modal - Responsive */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-3 sm:p-4 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800 text-sm sm:text-base">
                Product Details
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-full"
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

            {/* Modal Content */}
            <div className="p-3 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Left Column - Images */}
                <div>
                  {/* Main Image */}
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                    <img
                      src={selectedProduct.templeImages[modalImageIndex]?.url}
                      alt={selectedProduct.templePrasadTitle}
                      className="w-full h-full object-cover"
                    />
                    {selectedProduct.templeImages.length > 1 && (
                      <>
                        <button
                          onClick={prevModalImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-2 rounded-full shadow-lg hover:bg-white"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={nextModalImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-2 rounded-full shadow-lg hover:bg-white"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </>
                    )}
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                      {modalImageIndex + 1}/
                      {selectedProduct.templeImages.length}
                    </div>
                  </div>

                  {/* Thumbnails */}
                  {selectedProduct.templeImages.length > 1 && (
                    <div className="grid grid-cols-5 gap-2">
                      {selectedProduct.templeImages.map((image, index) => (
                        <button
                          key={image._id}
                          onClick={() => setModalImageIndex(index)}
                          className={`aspect-square rounded-lg overflow-hidden ${
                            index === modalImageIndex
                              ? "ring-2 ring-orange-500"
                              : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={image.url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column - Product Info */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                    {selectedProduct.templePrasadTitle}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-sm sm:text-base">
                          {i < selectedProduct.templePrasadRating ? "⭐" : "☆"}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500">
                      ({selectedProduct.templePrasadRating}/5)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold text-orange-600">
                      ₹{selectedProduct.templePrasadDiscountPrice}
                    </span>
                    <span className="text-lg sm:text-xl text-gray-400 line-through">
                      ₹{selectedProduct.templePrasadPrice}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-gray-600">
                    {selectedProduct.templePrasadDescription}
                  </p>

                  {/* Materials */}
                  {selectedProduct.templePrasadMaterial?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm sm:text-base text-gray-700 mb-2">
                        What's Included:
                      </h4>
                      <ul className="space-y-1">
                        {selectedProduct.templePrasadMaterial.map(
                          (material, index) => (
                            <li
                              key={index}
                              className="text-xs sm:text-sm text-gray-600 flex items-center gap-2"
                            >
                              <span className="text-orange-500">✓</span>
                              {material}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="border-t border-gray-200 pt-3 sm:pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity:
                    </label>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 sm:px-4 py-2 text-orange-600 font-bold text-lg hover:bg-orange-50"
                        >
                          −
                        </button>
                        <span className="w-12 text-center font-medium">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-3 sm:px-4 py-2 text-orange-600 font-bold text-lg hover:bg-orange-50"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm sm:text-base">
                        Total:{" "}
                        <span className="font-bold text-orange-600">
                          ₹{calculateTotalPrice()}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Buy Button */}
                  <button
                    onClick={() => {
                      closeModal();
                      initiateBuy(selectedProduct, quantity);
                    }}
                    className="w-full bg-orange-600 text-white font-semibold py-3 sm:py-4 rounded-lg hover:bg-orange-700 transition-colors text-sm sm:text-base"
                  >
                    Buy Now · ₹{calculateTotalPrice()}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Address Selection Modal - Responsive */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-3 sm:p-4 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800 text-sm sm:text-base">
                Select Delivery Address
              </h2>
              <button
                onClick={() => setShowAddressModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
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

            <div className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Delivery for:{" "}
                <span className="font-medium">
                  {buyingProduct?.templePrasadTitle}
                </span>
              </p>

              {addressesLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Loading addresses...</p>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📍</div>
                  <p className="text-gray-600 mb-4 text-sm">
                    No saved addresses
                  </p>
                  <button
                    onClick={() => {
                      setShowAddressModal(false);
                      navigate("/profile");
                    }}
                    className="bg-orange-600 text-white font-medium py-2 px-6 rounded-lg text-sm hover:bg-orange-700"
                  >
                    Add New Address
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                    {addresses.map((addr) => (
                      <label
                        key={addr._id}
                        className={`block p-3 rounded-lg border-2 cursor-pointer transition ${
                          selectedAddressId === addr._id
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="address"
                            value={addr._id}
                            checked={selectedAddressId === addr._id}
                            onChange={() => setSelectedAddressId(addr._id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-medium text-sm">
                                {addr.fullName}
                              </span>
                              {addr.isDefault && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-1">
                              {addr.houseNumber}, {addr.street}
                              {addr.landmark && `, ${addr.landmark}`}
                            </p>
                            <p className="text-xs text-gray-600">
                              {addr.townCity}, {addr.state} - {addr.pincode}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              📞 {addr.phone}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={handleConfirmAddress}
                    disabled={!selectedAddressId}
                    className={`w-full font-semibold py-3 rounded-lg transition text-sm sm:text-base ${
                      selectedAddressId
                        ? "bg-orange-600 text-white hover:bg-orange-700"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Continue to Payment
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
    </div>
  );
}

export default DashboardProducts;
