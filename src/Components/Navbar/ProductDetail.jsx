

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { toastSuccess, toastError, toastInfo, toastWarning, toastOrderSuccess } from "../Toast";

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

    // New: User details for prefill (fetch once)
    const [userDetails, setUserDetails] = useState({ name: '', email: '', contact: '' });

    // helper to load addresses and user details from profile
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

            // Set user details for Razorpay prefill
            setUserDetails({
                name: user.fullName || '',
                email: user.email || '',
                contact: user.phone || ''
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
                navigate("/profile");
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
                name: import.meta.env.VITE_APP_NAME || "Mahakal Bazar",
                description: product.templePrasadTitle || product.name || 'Product Purchase',     // ✔ Fallback to name if templePrasadTitle missing
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
                            toastOrderSuccess()
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
                    contact: userDetails.contact
                },
                theme: {
                    color: "#f97316"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error("BUY NOW ERROR:", err); // Log full error
            if (err.response) {
                console.error("Error response data:", err.response.data); // Log response body for debug
                console.error("Error status:", err.response.status);
            }
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
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-12 font-sans text-slate-900">
                <div className="max-w-6xl mx-auto">



                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                        {/* LEFT: The "Visual Stage" */}
                        <div className="lg:col-span-6 space-y-6">
                            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] group">
                                <img
                                    src={product.images?.[selectedImageIndex]?.url || product.images?.url || "/api/placeholder/600/800"}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Floating Action Bar inside Image */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-2xl">
                                    {product.images?.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImageIndex(idx)}
                                            className={`h-1.5 transition-all rounded-full ${selectedImageIndex === idx ? 'w-8 bg-orange-500' : 'w-2 bg-white/50 hover:bg-white'}`}
                                        />
                                    ))}
                                </div>

                                {/* Discount Tag */}
                                {product.discountPrice && (
                                    <div className="absolute top-6 left-6 bg-slate-900 text-white px-4 py-2 rounded-2xl text-sm font-black italic">
                                        SAVE {calculateDiscount()}%
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Scroll - Dashboard Style */}
                            <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth no-scrollbar">
                                {product.images?.map((image, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`relative min-w-[100px] h-24 rounded-3xl cursor-pointer overflow-hidden border-4 transition-all ${selectedImageIndex === index ? 'border-orange-500 scale-95 shadow-inner' : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={image.url} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: The "Control Panel" */}
                        <div className="lg:col-span-6 space-y-8 flex flex-col justify-center">

                            <section>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 mb-4">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                    </span>
                                    <span className="text-[10px] font-bold text-orange-700 uppercase tracking-tighter">In Stock & Ready to ship</span>
                                </div>

                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-orange-700 tracking-tight leading-snug mb-4">
                                    {product.name}
                                </h1>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-orange-50/60 p-4 sm:p-6 rounded-2xl border border-orange-200 shadow-inner">
                                    {/* Current Price */}
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Current Price</span>
                                        <span className="text-3xl sm:text-4xl font-extrabold text-orange-800 mt-1">₹{product.discountPrice || product.price}</span>
                                    </div>

                                    {/* Divider */}
                                    {product.discountPrice && <div className="hidden sm:block h-10 w-px bg-orange-300 opacity-60" />}

                                    {/* Original Price if discounted */}
                                    {product.discountPrice && (
                                        <div className="flex flex-col opacity-70 mt-2 sm:mt-0">
                                            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest line-through">M.R.P</span>
                                            <span className="text-xl sm:text-2xl font-bold text-orange-600 line-through mt-1">₹{product.price}</span>
                                        </div>
                                    )}
                                </div>

                            </section>

                            {/* Info Grid (Bento Style) */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Specifications</p>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-slate-800 flex justify-between"><span>Size</span> <span className="text-orange-600">{product.size}</span></p>
                                        <p className="text-sm font-bold text-slate-800 flex justify-between"><span>Weight</span> <span className="text-orange-600">{product.weight}g</span></p>
                                    </div>
                                </div>
                                <div className="p-6 rounded-[2rem] bg-slate-900 text-white shadow-xl shadow-slate-200">
                                    <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Materials</p>
                                    <p className="text-sm font-medium leading-tight">{product.material || "Crafted from premium sustainable sources."}</p>
                                </div>
                            </div>

                            {/* Advanced Quantity Selector */}
                            <div className="flex items-center justify-between p-2 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-1">
                                    <button onClick={decreaseQuantity} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 transition-all font-bold text-xl text-slate-400">−</button>
                                    <span className="w-12 text-center font-black text-lg">{quantity}</span>
                                    <button onClick={increaseQuantity} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 transition-all font-bold text-xl text-slate-400">+</button>
                                </div>
                                <div className="pr-6 text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total</p>
                                    <p className="text-xl font-black text-slate-900">₹{(product.discountPrice || product.price) * quantity}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="group relative h-16 rounded-[1.5rem] bg-white border-2 border-slate-900 text-slate-900 font-black overflow-hidden hover:text-white transition-colors"
                                >
                                    <div className="absolute inset-0 w-0 bg-slate-900 transition-all group-hover:w-full -z-10" />
                                    <span className="flex items-center justify-center gap-2">
                                        <ShoppingCart size={20} /> ADD TO CART
                                    </span>
                                </button>
                                <button
                                    onClick={() => initiateBuy(product, quantity)}
                                    className="h-16 rounded-[1.5rem] bg-orange-600 text-white font-black hover:bg-orange-500 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_30px_rgba(234,88,12,0.3)]"
                                >
                                    BUY NOW
                                </button>
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
                                            const userName = review.user?.name || 'Anonymous';
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