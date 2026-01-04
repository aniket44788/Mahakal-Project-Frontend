import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { toastSuccess, toastError, toastInfo, toastWarning } from "../Toast";

import { Star, ShoppingCart, Heart, MapPin, Truck, Shield, Wallet, Award, ThumbsUp, MessageCircle, Share2, ChevronLeft, ChevronRight, Loader2, CheckCircle, AlertCircle } from "lucide-react";


function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState("2.5 Inch");
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // this is address fetch from profile 
    // --- near other useState declarations, e.g. after selectedProduct, quantity etc.
    const [addresses, setAddresses] = useState([]);           // all user's addresses
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
    const [reviewComment, setReviewComment] = useState('');

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

    // Fetch reviews function
    const fetchReviews = async () => {
        try {
            setReviewsLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/review/allreviews/${id}`);
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
                navigate("/login");
                return;
            }
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/review/addreview`,
                {
                    productId: id,
                    rating: reviewRating,
                    comment: reviewComment
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (res.data.success) {
                toastSuccess("Review submitted successfully!");
                setShowReviewModal(false);
                setReviewRating(5);
                setReviewComment('');
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
        if (diffDays < 1) return 'Today';
        if (diffDays === 1) return '1 day ago';
        return `${diffDays} days ago`;
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/single/${id}`);
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
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 5.0;
    const ratingCount = reviews.length;

    const getRatingDistribution = () => {
        const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach((r) => {
            dist[r.rating] = (dist[r.rating] || 0) + 1;
        });
        return [5, 4, 3, 2, 1].map((star) => {
            const count = dist[star];
            const perc = ratingCount > 0 ? Math.round((count / ratingCount) * 100) : 0;
            return { star, perc };
        });
    };

    const increaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const calculateDiscount = () => {
        if (product?.discountPrice && product?.price) {
            return Math.round(((product.price - product.discountPrice) / product.price) * 100);
        }
        return 0;
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const nextImage = () => {
        if (product?.images) {
            setSelectedImageIndex((prev) =>
                prev === product.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (product?.images) {
            setSelectedImageIndex((prev) =>
                prev === 0 ? product.images.length - 1 : prev - 1
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
            toastWarning("Please select a delivery address before placing the order.");
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
                navigate("/login");
                return;
            }

            // Load Razorpay
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                toastWarning("Razorpay SDK failed to load.");
                return;
            }

            // Fixed: Use correct generic fields (discountPrice / price) to avoid null/undefined
            const finalPrice = product.discountPrice || product.price;
            const finalAmount = finalPrice * qty;

            // Added: Safeguard against invalid price
            if (!finalPrice || finalPrice <= 0) {
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
                public_id: img.public_id || img._id
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
                            unit: product.unit || "gm"
                        }
                    ],
                    amount: finalAmount,  // in rupees
                    currency: "INR",
                    addressId: addressId
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (!res.data.success) {
                throw new Error(res.data.message || "Order creation failed");
            }

            const order = res.data.order;

            // Razorpay Options - Fixed: Use APP_NAME; generic description
            const options = {
                key: import.meta.env.VITE_APP_RAZORPAY,
                amount: res.data.razorpayOrder.amount,      // ✔ Comes from backend (already *100)
                currency: res.data.razorpayOrder.currency,  // ✔ "INR"
                name: import.meta.env.VITE_APP_NAME || "Mahakal Store",
                description: product.templePrasadTitle,     // ✔ correct field
                order_id: res.data.razorpayOrder.id,        // ✔ Razorpay order id

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
                            toastSuccess("Payment Successful!");
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
                    name: "",
                    email: "",
                    contact: ""
                },
                theme: {
                    color: "#f97316"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error("BUY NOW ERROR:", err);
            toastError(err.response?.data?.message || err.message || "Payment failed");
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
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                toastSuccess("Item added to cart.")
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
                    <p className="text-xl font-semibold text-gray-700">Loading sacred product...</p>
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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
            {/* Hero Section */}
            <div className="w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">

                    {/* Left - Product Images */}
                    <div className="relative bg-gradient-to-br from-white to-orange-50 flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12">
                        {/* Main Image */}
                        <div className="relative w-full max-w-md lg:max-w-lg">
                            <img
                                src={product.images?.[selectedImageIndex]?.url || product.images?.url || "/api/placeholder/500/500"}
                                alt={product.name}
                                className="w-full h-80 sm:h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                            />

                            {/* Navigation Arrows */}
                            {product.images && product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all"
                                    >
                                        <ChevronLeft size={20} className="text-gray-700" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all"
                                    >
                                        <ChevronRight size={20} className="text-gray-700" />
                                    </button>
                                </>
                            )}

                            {/* Heart Icon */}
                            <button
                                onClick={toggleFavorite}
                                className="absolute top-4 right-4 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all"
                            >
                                <Heart
                                    size={24}
                                    className={isFavorite ? "fill-red-500 stroke-red-500" : "stroke-gray-500 hover:stroke-red-400"}
                                />
                            </button>

                            {/* Discount Badge */}
                            {product.discountPrice && (
                                <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                                    {calculateDiscount()}% OFF
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-2 mt-4 overflow-x-auto">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                                            ? 'border-orange-500 shadow-lg'
                                            : 'border-gray-200 hover:border-orange-300'
                                            }`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right - Product Info */}
                    <div className="bg-white p-6 sm:p-8 lg:p-12 flex flex-col justify-center">

                        {/* Product Title */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                            {product.name}
                        </h1>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 rounded-full text-sm font-semibold text-orange-700 capitalize">
                                {product.category}
                            </span>
                            <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-full text-sm font-semibold text-green-700">
                                Authentic
                            </span>
                            <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-full text-sm font-semibold text-blue-700">
                                Fresh
                            </span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={20}
                                        className={i < Math.round(averageRating) ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300"}
                                    />
                                ))}
                            </div>
                            <span className="text-lg font-bold text-gray-900">
                                {averageRating}
                            </span>
                            <span className="text-gray-500">
                                ({ratingCount} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="mb-8">
                            {product.isAvailable ? (
                                <div className="flex items-center gap-4 flex-wrap">
                                    <span className="text-4xl sm:text-5xl font-bold text-gray-900">
                                        ₹{product.discountPrice || product.price}
                                    </span>
                                    {product.discountPrice && (
                                        <>
                                            <span className="text-xl text-gray-400 line-through">
                                                ₹{product.price}
                                            </span>
                                            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                                SAVE ₹{product.price - product.discountPrice}
                                            </span>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <span className="text-4xl font-bold text-red-600">
                                    SOLD OUT
                                </span>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="w-full mb-8 p-5 bg-orange-50 rounded-xl gap-3 border border-orange-100">
                            <h3 className="text-xl font-semibold text-orange-700 mb-4">Product Details</h3>

                            <div className="space-y-3 text-gray-800">
                                <div className="flex justify-start items-center">
                                    <p className="text-sm text-gray-600">Size :  </p>
                                    <p className="text-base font-medium">{product.size || "---"}</p>
                                </div>

                                <div className="flex justify-start items-center">
                                    <p className="text-sm text-gray-600">Weight : </p>
                                    <p className="text-base font-medium">
                                        {product.weight ? `${product.weight} ${product.unit || ""}` : "---"}
                                    </p>
                                </div>

                                <div className="flex justify-start items-center">
                                    <p className="text-sm text-gray-600">Made with :   </p>
                                    <p className="text-base font-medium">{product.material || "---"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="mb-8">
                            <p className="text-lg font-semibold text-gray-900 mb-3">Quantity</p>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border-2 border-orange-200 rounded-xl overflow-hidden">
                                    <button
                                        onClick={decreaseQuantity}
                                        className="w-12 h-12 flex items-center justify-center text-xl font-bold text-orange-600 hover:bg-orange-50 transition-colors"
                                    >
                                        −
                                    </button>
                                    <span className="w-16 text-center text-xl font-bold text-gray-900">{quantity}</span>
                                    <button
                                        onClick={increaseQuantity}
                                        className="w-12 h-12 flex items-center justify-center text-xl font-bold text-orange-600 hover:bg-orange-50 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-gray-600">
                                    Total: ₹{(product.discountPrice || product.price) * quantity}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4 mb-8">
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-2 border-orange-200 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:from-orange-200 hover:to-amber-200 transition-all transform hover:scale-[1.02] shadow-lg"
                            >
                                <ShoppingCart size={24} />
                                ADD TO CART
                            </button>

                            <button
                                onClick={() => initiateBuy(product, quantity)}
                                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-[1.02] shadow-xl"
                            >
                                BUY NOW
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 text-center text-sm">
                            <div className="flex flex-col items-center">
                                <Shield className="text-green-600 mb-1" size={20} />
                                <span className="text-gray-600 font-medium">Authentic</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <Truck className="text-blue-600 mb-1" size={20} />
                                <span className="text-gray-600 font-medium">Fast Delivery</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <Wallet className="text-orange-600 mb-1" size={20} />
                                <span className="text-gray-600 font-medium"> 100% Secure Payment</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Single Page Content - Description, Shipping, Reviews */}
            <div className="w-full bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                    {/* 1. DESCRIPTION SECTION */}
                    <div className="mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">Product Description</h2>

                        <div className="prose prose-lg max-w-none mb-8">
                            <div className="text-gray-700 leading-relaxed text-lg text-center mb-8">
                                {product.description || "This sacred product is carefully prepared following traditional methods and blessed with divine energy. Perfect for your daily prayers and spiritual practices."}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-2xl border border-orange-100 text-center">
                                <div className="flex justify-center mb-4">
                                    <Award className="text-orange-600" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Assurance</h3>
                                <p className="text-gray-700 leading-relaxed">Made with premium ingredients and traditional methods to ensure authenticity and purity for your spiritual practices.</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100 text-center">
                                <div className="flex justify-center mb-4">
                                    <Shield className="text-green-600" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Blessed & Sacred</h3>
                                <p className="text-gray-700 leading-relaxed">Each product is blessed and prepared with utmost devotion following religious traditions and ancient practices.</p>
                            </div>
                        </div>
                    </div>

                    {/* 2. SHIPPING SECTION */}
                    <div className="mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">Shipping & Delivery</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                        <Truck className="text-green-600 flex-shrink-0" size={28} />
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">Free Delivery</h4>
                                            <p className="text-gray-600">On orders above ₹500 across India</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                        <MapPin className="text-blue-600 flex-shrink-0" size={28} />
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">Pan India Delivery</h4>
                                            <p className="text-gray-600">We deliver to all states and cities</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                                        <Shield className="text-orange-600 flex-shrink-0" size={28} />
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">Secure Packaging</h4>
                                            <p className="text-gray-600">Safe, hygienic and spiritual packaging</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Return & Delivery Policy</h3>

                                <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-8 rounded-2xl border border-orange-200">
                                    <ul className="space-y-4 text-gray-800">
                                        <li className="flex items-start gap-3">
                                            <span className="text-orange-600 mt-1 text-xl">✓</span>
                                            <span className="text-lg">Orders are accepted only through online payment (No Cash on Delivery).</span>
                                        </li>

                                        <li className="flex items-start gap-3">
                                            <span className="text-orange-600 mt-1 text-xl">✓</span>
                                            <span className="text-lg">Prashad can be collected directly from the temple or designated pickup points.</span>
                                        </li>

                                        <li className="flex items-start gap-3">
                                            <span className="text-orange-600 mt-1 text-xl">✓</span>
                                            <span className="text-lg">Refunds are provided only if payment is deducted but order confirmation fails.</span>
                                        </li>

                                        <li className="flex items-start gap-3">
                                            <span className="text-red-600 mt-1 text-xl">!</span>
                                            <span className="text-lg">Due to the perishable and sacred nature of Prashad, returns or replacements are not accepted once collected.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. REVIEWS SECTION */}
                    <div>
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-0">Customer Reviews</h2>
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
                                                            className={i < Math.round(averageRating) ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300"}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="text-gray-600 text-lg">Based on {ratingCount} reviews</div>
                                            </div>
                                            <div className="md:col-span-2">
                                                {getRatingDistribution().map(({ star, perc }) => (
                                                    <div key={star} className="flex items-center gap-4 mb-3">
                                                        <span className="text-sm w-3 font-medium">{star}</span>
                                                        <Star size={18} className="fill-yellow-400 stroke-yellow-400" />
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
                                        <p className="mt-2">Be the first to share your experience!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {reviews.map((review) => {
                                            const userName = review.user.name || 'Anonymous';
                                            const userInitial = userName.charAt(0).toUpperCase();
                                            return (
                                                <div key={review._id} className="bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                                                    <div className="flex items-start justify-between mb-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                                                {userInitial}
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <h4 className="font-bold text-gray-900 text-lg">{userName}</h4>
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
                                                                                className={i < review.rating ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300"}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                    <span className="text-gray-500">{formatReviewDate(review.createdAt)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-700 mb-6 leading-relaxed text-lg">{review.comment}</p>
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
                                Choose an address for "{buyingProduct?.name}"
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

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold text-gray-800">Write Your Review</h2>
                            <button
                                onClick={() => {
                                    setShowReviewModal(false);
                                    setReviewRating(5);
                                    setReviewComment('');
                                }}
                                className="text-gray-600 hover:text-gray-800 rounded-full p-2 transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4">
                            <p className="mb-4 text-gray-700">How would you rate this product?</p>
                            <div className="flex justify-center mb-4 gap-1">
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setReviewRating(star)}
                                        className="p-1"
                                    >
                                        <Star
                                            size={28}
                                            className={`cursor-pointer transition ${reviewRating >= star ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-gray-300'
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
                                        setReviewComment('');
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