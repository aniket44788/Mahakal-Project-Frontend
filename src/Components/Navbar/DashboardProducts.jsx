import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"

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

    // this is address fetch from profile 
    // --- near other useState declarations, e.g. after selectedProduct, quantity etc.
    const [addresses, setAddresses] = useState([]);           // all user's addresses
    const [selectedAddressId, setSelectedAddressId] = useState(null); // chosen address id
    const [addressesLoading, setAddressesLoading] = useState(false);

    // New states for buy flow
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [buyingProduct, setBuyingProduct] = useState(null);
    const [buyingQuantity, setBuyingQuantity] = useState(1);

    // helper to load addresses from profile
    const fetchAddresses = async () => {
        try {
            setAddressesLoading(true);
            const token = localStorage.getItem("mahakalToken");
            if (!token) return setAddresses([]); // not logged in
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const user = res.data.user || res.data; // adjust based on your API shape
            const userAddresses = user?.addresses || [];
            setAddresses(userAddresses);

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

    // call once on mount
    useEffect(() => {
        fetchAddresses();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, []);

    // Auto-slider effect for product list images
    useEffect(() => {
        if (!autoSlide || products.length === 0) return;

        const interval = setInterval(() => {
            setMainImageIndex((prev) => {
                const newState = { ...prev };
                products.forEach((product) => {
                    newState[product._id] = (newState[product._id] || 0 + 1) % product.templeImages.length;
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
                `${import.meta.env.VITE_API_URL}/dashboard/product/get`
            );

            console.log(response.data, "Here is main data");

            if (response.data.success) {
                setProducts(response.data.data); // Set actual products array
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
                `${import.meta.env.VITE_API_URL}/dashboard/product/get/${id}`
            );

            console.log("here is data", response.data);

            if (response.data.success) {
                setSelectedProduct(response.data.data);   // Assign correct product object
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
            setModalImageIndex((prev) => (prev + 1) % selectedProduct.templeImages.length);
        }
    };

    const prevModalImage = () => {
        if (selectedProduct) {
            setModalImageIndex(
                (prev) => (prev - 1 + selectedProduct.templeImages.length) % selectedProduct.templeImages.length
            );
        }
    };

    const calculateTotalPrice = () => {
        if (!selectedProduct) return "0.00";
        return (selectedProduct.templePrasadDiscountPrice * quantity).toFixed(2);
    };

    const calculateTax = () => {
        if (!selectedProduct) return "0.00";
        return (calculateTotalPrice() * 0.164).toFixed(2);
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
        setCurrentImageIndex(productId, (currentIndex + 1) % product.templeImages.length);
    };

    const prevProductImage = (productId, product) => {
        const currentIndex = getCurrentImageIndex(productId);
        setCurrentImageIndex(
            productId,
            (currentIndex - 1 + product.templeImages.length) % product.templeImages.length
        );
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
            alert("Please select a delivery address before placing the order.");
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

    // Extracted payment logic (assumes address is selected)
    const handlePayment = async (product, qty, addressId) => {
        try {
            const token = localStorage.getItem("mahakalToken");
            if (!token) {
                navigate("/");
                return;
            }
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                alert("Razorpay SDK failed to load.");
                return;
            }

            // Correct price (use discounted price)
            const finalPrice = product.templePrasadDiscountPrice;
            const finalAmount = finalPrice * qty;

            // Minimum order check
            if (finalAmount < 1) {
                alert("Amount must be at least ₹1.");
                return;
            }

            // Construct images array matching backend schema
            const productImages = product.templeImages.map((image) => ({
                url: image.url,
                public_id: image.public_id || image._id // Fallback to _id if public_id not available
            }));

            // 2️⃣ Create backend order
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
                {
                    products: [
                        {
                            product: product._id,         // ✔ actual product id
                            name: product.templePrasadTitle, // ✔ mapped to correct field
                            category: product.category || "Prasad", // ✔ fallback to valid enum value
                            images: productImages,        // ✔ array of {url, public_id}
                            quantity: qty,           // ✔ passed quantity
                            price: finalPrice,            // ✔ correct discounted price
                            unit: product.unit || "gm"    // ✔ fallback to "gm"
                        }
                    ],
                    amount: finalAmount,
                    currency: "INR",
                    addressId: addressId
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (!res.data.success) {
                throw new Error(res.data.message || "Failed to create order");
            }

            const order = res.data.order;

            const options = {
                key: import.meta.env.VITE_APP_RAZORPAY,
                amount: res.data.razorpayOrder.amount,
                currency: res.data.razorpayOrder.currency,
                name: "Mahakal Store",
                description: product.templePrasadTitle,
                order_id: res.data.razorpayOrder.id,

                handler: async (response) => {
                    try {
                        const verifyRes = await axios.post(
                            `${import.meta.env.VITE_API_URL}/api/payment/verify-payment`,
                            {
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature
                            },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        if (verifyRes.data.success) {
                            window.alert("🎉 Order Placed Successfully!\n\nThank you for your purchase. Your prasad will be delivered soon.");

                        } else {
                            alert("Payment verification failed. Please contact support.");
                        }
                    } catch (verifyErr) {
                        console.error("Payment verification error:", verifyErr);
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: "", // Can prefill user details if available
                    email: "",
                    contact: ""
                },
                theme: {
                    color: "#f97316" // Orange theme to match UI
                }
            };

            const paymentObj = new window.Razorpay(options);
            paymentObj.open();

        } catch (err) {
            console.error("BUY NOW ERROR:", err);
            alert(`Payment failed: ${err.message || "An unexpected error occurred"}`);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg text-gray-700 font-medium">Loading Temple Products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchProducts}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="text-center">
                    <p className="text-lg text-gray-700 font-medium">No products available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}


            {/* All Products List - Full width, line wise */}
            <div className="w-full py-8 bg-gray-50">
                <div className="px-4 sm:px-6 lg:px-8">

                    <div className="flex flex-col gap-y-6 max-w-7xl mx-auto">
                        {products.map((product) => {
                            const currentImageIdx = getCurrentImageIndex(product._id);
                            const currentImage = product.templeImages[currentImageIdx];

                            return (
                                <div
                                    key={product._id}
                                    className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-orange-300"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 md:gap-6">
                                        {/* 🖼️ Enhanced Image Slider Section */}
                                        <div className="lg:col-span-1">
                                            {/* Main Image Display */}
                                            <div
                                                className="relative h-64 sm:h-72 md:h-80 bg-gradient-to-br from-gray-100 to-gray-200 group overflow-hidden"
                                                onMouseEnter={() => setAutoSlide(false)}
                                                onMouseLeave={() => setAutoSlide(true)}
                                            >
                                                <img
                                                    src={currentImage?.url}
                                                    alt={product.templePrasadTitle}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                                                    onClick={() => fetchProductById(product._id)}
                                                />

                                                {/* Discount Badge */}
                                                <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                                    {calculateDiscount(product.templePrasadPrice, product.templePrasadDiscountPrice)}% OFF
                                                </div>

                                                {/* Image Counter Badge */}
                                                <div className="absolute top-3 left-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-sm">
                                                    {currentImageIdx + 1} / {product.templeImages.length}
                                                </div>

                                                {/* Navigation Arrows */}
                                                {product.templeImages.length > 1 && (
                                                    <>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                prevProductImage(product._id, product);
                                                            }}
                                                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-gray-900 p-2 sm:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                                                        >
                                                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                nextProductImage(product._id, product);
                                                            }}
                                                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-gray-900 p-2 sm:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                                                        >
                                                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </button>
                                                    </>
                                                )}

                                                {/* Auto-play Indicator */}
                                                <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm flex items-center gap-1">
                                                    <span className="text-lg">{autoSlide ? "▶" : "⏸"}</span>
                                                </div>
                                            </div>

                                            {/* Thumbnail Gallery - Horizontal Scroll */}
                                            <div className="bg-white border-t border-gray-200 p-2 sm:p-3">
                                                <div className="overflow-x-auto scrollbar-hide">
                                                    <div className="flex gap-2 min-w-min">
                                                        {product.templeImages.map((image, index) => (
                                                            <button
                                                                key={image._id}
                                                                onClick={() => setCurrentImageIndex(product._id, index)}
                                                                className={`flex-shrink-0 h-16 sm:h-20 w-16 sm:w-20 rounded-lg overflow-hidden border-3 transition-all duration-300 ${index === currentImageIdx
                                                                    ? "border-orange-500 shadow-lg scale-110 ring-2 ring-orange-300"
                                                                    : "border-gray-300 hover:border-orange-400 opacity-75 hover:opacity-100"
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
                                            </div>

                                            {/* Dot Indicators */}
                                            <div className="bg-white border-t border-gray-200 flex justify-center items-center gap-2 py-2 sm:py-3 flex-wrap px-2">
                                                {product.templeImages.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setCurrentImageIndex(product._id, index)}
                                                        className={`transition-all duration-300 rounded-full ${index === currentImageIdx
                                                            ? "w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-600"
                                                            : "w-2 h-2 bg-gray-300 hover:bg-orange-400"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Product Info Section */}
                                        <div className="p-4 sm:p-6 lg:col-span-2 flex flex-col justify-between">
                                            <div>
                                                {/* Location */}
                                                <div className="flex items-center gap-2 text-orange-600 text-xs sm:text-sm mb-2 font-semibold">
                                                    <span>📍</span>
                                                    <span className="line-clamp-1">{product.templeAddress}</span>
                                                </div>

                                                {/* Title */}
                                                <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 text-base sm:text-lg">
                                                    {product.templePrasadTitle}
                                                </h3>

                                                {/* Rating */}
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="flex gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span key={i} className="text-lg sm:text-xl">
                                                                {i < product.templePrasadRating ? "⭐" : "☆"}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <span className="text-xs sm:text-sm text-gray-600">
                                                        ({product.templePrasadRating}) • 32 Orders
                                                    </span>
                                                </div>

                                                {/* Price Section */}
                                                <div className="mb-4 pb-4 border-b border-gray-200">
                                                    <div className="flex items-baseline gap-3 flex-wrap">
                                                        <span className="text-2xl sm:text-3xl font-bold text-orange-600">
                                                            ₹{product.templePrasadDiscountPrice}
                                                        </span>
                                                        <span className="text-lg sm:text-xl text-gray-400 line-through">
                                                            ₹{product.templePrasadPrice}
                                                        </span>
                                                        <span className="text-xs sm:text-sm text-green-600 font-semibold">
                                                            Save ₹{product.templePrasadPrice - product.templePrasadDiscountPrice}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-4">
                                                    {product.templePrasadDescription}
                                                </p>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 sm:gap-3 flex-wrap">
                                                <button
                                                    onClick={() => fetchProductById(product._id)}
                                                    className="flex-1 min-w-max bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
                                                >
                                                    📋 View Details
                                                </button>
                                                <button onClick={() => initiateBuy(product, 1)} className="flex-1 min-w-max bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base">
                                                    Buy Now
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
                            <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-600 hover:text-gray-800 rounded-full p-2 transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Image Gallery */}
                                <div className="lg:col-span-1">
                                    <div className="relative h-80 bg-gray-100 rounded-lg overflow-hidden mb-4 group">
                                        <img
                                            src={selectedProduct.templeImages[modalImageIndex]?.url}
                                            alt={selectedProduct.templePrasadTitle}
                                            className="w-full h-full object-cover"
                                        />
                                        {selectedProduct.templeImages.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevModalImage}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition opacity-0 group-hover:opacity-100"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={nextModalImage}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition opacity-0 group-hover:opacity-100"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                        {/* Image Counter */}
                                        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                            {modalImageIndex + 1} / {selectedProduct.templeImages.length}
                                        </div>
                                    </div>

                                    {/* Thumbnail Gallery */}
                                    <div className="grid grid-cols-5 gap-2">
                                        {selectedProduct.templeImages.map((image, index) => (
                                            <button
                                                key={image._id}
                                                onClick={() => setModalImageIndex(index)}
                                                className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${index === modalImageIndex
                                                    ? "border-orange-500 shadow-md scale-105"
                                                    : "border-gray-300 hover:border-orange-400"
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

                                {/* Product Info */}
                                <div className="lg:col-span-2">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{selectedProduct.templePrasadTitle}</h3>

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className="text-xl">
                                                    {i < selectedProduct.templePrasadRating ? "⭐" : "☆"}
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-gray-600">({selectedProduct.templePrasadRating}/5)</span>
                                    </div>

                                    <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-gray-200">
                                        <span className="text-3xl font-bold text-orange-600">
                                            ₹{selectedProduct.templePrasadDiscountPrice}
                                        </span>
                                        <span className="text-2xl text-gray-400 line-through">
                                            ₹{selectedProduct.templePrasadPrice}
                                        </span>
                                    </div>

                                    <p className="text-gray-700 mb-6 leading-relaxed">{selectedProduct.templePrasadDescription}</p>

                                    {/* Materials */}
                                    {selectedProduct.templePrasadMaterial && selectedProduct.templePrasadMaterial.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="font-bold text-gray-800 mb-3">What's Included:</h4>
                                            <ul className="space-y-2">
                                                {selectedProduct.templePrasadMaterial.map((material, index) => (
                                                    <li key={index} className="text-gray-700 flex items-start gap-2">
                                                        <span className="text-orange-600 mt-1">✓</span>
                                                        <span>{material}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Quantity and Price */}
                                    <div className="mb-6 pb-6 border-b border-gray-200">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Quantity:</label>
                                        <div className="flex items-center border-2 border-orange-400 rounded-lg w-fit mb-4">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="px-4 py-2 text-orange-600 font-bold hover:bg-orange-50 transition"
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                className="w-16 text-center border-0 outline-none font-semibold"
                                            />
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="px-4 py-2 text-orange-600 font-bold hover:bg-orange-50 transition"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600 mb-1">Total Price: <span className="text-2xl font-bold text-orange-600">₹{calculateTotalPrice()}</span></p>
                                            <p className="text-xs text-gray-500">(Tax: ₹{calculateTax()})</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => { closeModal(); initiateBuy(selectedProduct, quantity); }}
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition shadow-md"
                                        >
                                            Order Now
                                        </button>
                                        <button
                                            onClick={() => { closeModal(); initiateBuy(selectedProduct, quantity); }}
                                            className="flex-1 bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-lg transition shadow-md"
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* New Address Selection Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold text-gray-800">Select Delivery Address</h2>
                            <button
                                onClick={() => setShowAddressModal(false)}
                                className="text-gray-600 hover:text-gray-800 rounded-full p-2 transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4">
                            <h4 className="font-semibold text-gray-800 mb-3">
                                Choose an address for "{buyingProduct?.templePrasadTitle}"
                            </h4>
                            {addressesLoading ? (
                                <div className="text-center py-4 text-sm text-gray-500">Loading addresses...</div>
                            ) : addresses.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-gray-600 mb-4 text-sm">No addresses found. Please add one to proceed.</p>
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
                                                className={`flex items-start gap-3 p-3 rounded-lg border transition cursor-pointer ${selectedAddressId === addr._id
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
                                                    <div className="font-semibold text-sm">{addr.fullName} {addr.isDefault && <span className="text-green-600 font-medium">(Default)</span>}</div>
                                                    <div className="text-gray-600 text-xs mt-1">
                                                        {addr.houseNumber}, {addr.street}{addr.landmark ? `, ${addr.landmark}` : ""}
                                                    </div>
                                                    <div className="text-gray-600 text-xs">
                                                        {addr.townCity}, {addr.state} - {addr.pincode}
                                                    </div>
                                                    <div className="text-gray-500 text-xs">Phone: {addr.phone}{addr.alternatePhone ? ` / ${addr.alternatePhone}` : ""}</div>
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