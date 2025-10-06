import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Star, ShoppingCart, Heart, MapPin, Truck, Shield, Wallet , Award, ThumbsUp, MessageCircle, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { API_URL, APP_NAME } from "../../config";

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState("2.5 Inch");
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Mock reviews data - replace with actual API call
    const [reviews] = useState([
        {
            id: 1,
            name: "Raj Sharma",
            rating: 5,
            date: "2 days ago",
            comment: "Excellent quality product! The prasad was fresh and the delivery was very quick. Highly recommended for all devotees.",
            verified: true,
            helpful: 12
        },
        {
            id: 2,
            name: "Priya Gupta",
            rating: 4,
            date: "1 week ago",
            comment: "Good quality but packaging could be better. Overall satisfied with the purchase.",
            verified: true,
            helpful: 8
        },
        {
            id: 3,
            name: "Amit Kumar",
            rating: 5,
            date: "2 weeks ago",
            comment: "Perfect for my daily prayers. The product matches exactly what was shown in images.",
            verified: false,
            helpful: 15
        }
    ]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${API_URL}/products/single/${id}`);
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
    }, [id]);

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
                                        className={i < Math.round(product.rating?.average || 5) ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300"}
                                    />
                                ))}
                            </div>
                            <span className="text-lg font-bold text-gray-900">
                                {product.rating?.average || 5.0}
                            </span>
                            <span className="text-gray-500">
                                ({product.rating?.count || reviews.length} reviews)
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
                            <button className="w-full bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-2 border-orange-200 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:from-orange-200 hover:to-amber-200 transition-all transform hover:scale-[1.02] shadow-lg">
                                <ShoppingCart size={24} />
                                ADD TO CART
                            </button>
                            <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-[1.02] shadow-xl">
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
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Return Policy</h3>
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl border border-gray-200">
                                    <ul className="space-y-4 text-gray-700">
                                        <li className="flex items-start gap-3">
                                            <span className="text-green-600 mt-1 text-xl">✓</span>
                                            <span className="text-lg">7-day return policy for damaged items</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-green-600 mt-1 text-xl">✓</span>
                                            <span className="text-lg">Full refund for quality issues</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-green-600 mt-1 text-xl">✓</span>
                                            <span className="text-lg">Easy return process</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-orange-600 mt-1 text-xl">!</span>
                                            <span className="text-lg">Perishable items not eligible for return</span>
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
                            <button className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg">
                                Write Review
                            </button>
                        </div>

                        {/* Reviews Summary */}
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-8 rounded-2xl border border-orange-100 mb-12">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="text-5xl font-bold text-gray-900 mb-3">
                                        {product.rating?.average || 4.7}
                                    </div>
                                    <div className="flex justify-center mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={24}
                                                className={i < Math.round(product.rating?.average || 4.7) ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300"}
                                            />
                                        ))}
                                    </div>
                                    <div className="text-gray-600 text-lg">Based on {reviews.length} reviews</div>
                                </div>
                                <div className="md:col-span-2">
                                    {[5, 4, 3, 2, 1].map(star => (
                                        <div key={star} className="flex items-center gap-4 mb-3">
                                            <span className="text-sm w-3 font-medium">{star}</span>
                                            <Star size={18} className="fill-yellow-400 stroke-yellow-400" />
                                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                                                <div
                                                    className="bg-yellow-400 h-3 rounded-full transition-all"
                                                    style={{ width: `${star === 5 ? 70 : star === 4 ? 25 : 5}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600 w-12 font-medium">
                                                {star === 5 ? '70%' : star === 4 ? '25%' : '5%'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Individual Reviews */}
                        <div className="space-y-8">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                                {review.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="font-bold text-gray-900 text-lg">{review.name}</h4>
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
                                                    <span className="text-gray-500">{review.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mb-6 leading-relaxed text-lg">{review.comment}</p>
                                    <div className="flex items-center gap-6">
                                        <button className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors font-medium">
                                            <ThumbsUp size={18} />
                                            <span>Helpful ({review.helpful})</span>
                                        </button>
                                        <button className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors font-medium">
                                            <MessageCircle size={18} />
                                            <span>Reply</span>
                                        </button>
                                        <button className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors font-medium">
                                            <Share2 size={18} />
                                            <span>Share</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
