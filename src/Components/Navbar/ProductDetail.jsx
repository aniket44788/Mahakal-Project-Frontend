import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Star, ShoppingCart, Heart, MapPin, Truck } from "lucide-react";
import { API_URL, APP_NAME } from "../../config";

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState("2.5 Inch");
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);

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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#faf8f6] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#faf8f6] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl font-semibold text-gray-600">Product not found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf8f6] py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="flex flex-col lg:flex-row">

                        {/* Left - Product Image */}
                        <div className="lg:w-2/5 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8 lg:p-12">
                            <div className="relative">
                                <img
                                    src={product.images[0]?.url || "/api/placeholder/400/400"}
                                    alt={product.name}
                                    className="w-80 h-80 lg:w-96 lg:h-96 object-cover rounded-xl shadow-lg"
                                />
                                {/* Heart Icon */}
                                <button
                                    onClick={toggleFavorite}
                                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <Heart
                                        size={20}
                                        className={isFavorite ? "fill-red-500 stroke-red-500" : "stroke-gray-400"}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Right - Product Info */}
                        <div className="lg:w-3/5 p-6 lg:p-10">

                            {/* Product Title */}
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>
                            {product.description}

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-orange-50 border border-orange-200 rounded-full text-xs font-medium text-orange-600">
                                    {product.category}
                                </span>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-lg font-semibold text-gray-900">
                                    {product.rating?.average || 5.0}
                                </span>
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            className={i < Math.round(product.rating?.average || 5) ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300"}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500 ml-1">
                                    ({product.rating?.count || 0})
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-3 mb-6">
                                {product.isAvailable ? (
                                    <>
                                        <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                                            ₹{product.discountPrice || product.price}
                                        </span>
                                        {product.discountPrice && (
                                            <>
                                                <span className="text-lg text-gray-400 line-through">
                                                    ₹{product.price}
                                                </span>
                                                <span className="bg-orange-600 text-white px-2 py-1 rounded text-sm font-semibold">
                                                    SAVE {calculateDiscount()}%
                                                </span>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-3xl lg:text-4xl font-bold text-red-600">
                                        SOLD OUT
                                    </span>
                                )}
                            </div>

                            {/* Size Selection */}
                            <div className="mb-6">
                                <div className="flex gap-3">
                                    Total size :   {product.size}  {product.weight} {product.unit} <br />
                                    Made with :  {product.material}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="mb-8">
                                <p className="text-sm font-medium text-gray-700 mb-3">Quantity</p>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                        <button
                                            onClick={decreaseQuantity}
                                            className="w-10 h-10 flex items-center justify-center text-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                        >
                                            −
                                        </button>
                                        <span className="w-12 text-center font-medium">{quantity}</span>
                                        <button
                                            onClick={increaseQuantity}
                                            className="w-10 h-10 flex items-center justify-center text-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-4 mb-8">
                                <button className="w-full bg-orange-100 text-orange-700 border border-orange-200 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-orange-200 transition-colors">
                                    ADD TO CART
                                </button>
                                <button className="w-full bg-orange-600 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors">
                                    BUY NOW
                                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">COD</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
