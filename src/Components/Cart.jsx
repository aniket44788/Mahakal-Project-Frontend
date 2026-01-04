import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash2, Minus, Plus, ShoppingCart, Truck, Shield, Wallet, ArrowLeft, CreditCard, Star } from "lucide-react";
import { toastError, toastInfo, toastSuccess, toastWarning } from "./Toast";


function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // this is address fetch from profile 
    // --- near other useState declarations, e.g. after selectedProduct, quantity etc.
    const [addresses, setAddresses] = useState([]);           // all user's addresses
    const [selectedAddressId, setSelectedAddressId] = useState(null); // chosen address id
    const [addressesLoading, setAddressesLoading] = useState(false);

    // New states for buy flow
    const [showAddressModal, setShowAddressModal] = useState(false);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = localStorage.getItem('mahakalToken');
                if (!token) {
                    navigate('/');
                    return;
                }

                const res = await axios.get(`${import.meta.env.VITE_API_URL}/cart/get`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log("Cart response:", res.data);

                if (res.data.success) {
                    setCart(res.data.cart || []);
                }
            } catch (error) {
                console.error("Error fetching cart:", error);
                if (error.response?.status === 401) {
                    navigate('/');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [navigate]);

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

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        setUpdating(true);
        try {
            const token = localStorage.getItem('mahakalToken');
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/cart/update-quantity`,
                {
                    productId: productId,
                    setQuantity: newQuantity
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (res.data.success) {
                setCart(res.data.cart || []);
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
        } finally {
            setUpdating(false);
        }
    };

    const removeFromCart = async (productId) => {
        setUpdating(true);
        try {
            const token = localStorage.getItem('mahakalToken');
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/cart/remove`,
                {
                    productId: productId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (res.data.success) {
                setCart(res.data.cart || []);
            }
        } catch (error) {
            console.error("Error removing item:", error);
        } finally {
            setUpdating(false);
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const product = item.product;
            if (!product) return total;
            const price = product.discountPrice || product.price || 0;
            return total + (price * (item.quantity || 1));
        }, 0);
    };

    const validCartItems = cart.filter(item => item.product);
    const validCartLength = validCartItems.length;

    // New function to initiate checkout flow (show address modal first)
    const initiateCheckout = () => {
        if (validCartLength === 0) return;
        setShowAddressModal(true);
    };

    // New function to handle address confirmation and proceed to payment
    const handleConfirmAddress = async () => {
        if (!selectedAddressId) {
            toastWarning("Please select a delivery address before placing the order.");
            return;
        }
        setShowAddressModal(false);
        await handlePayment(selectedAddressId);
    };

    // Load Razorpay script dynamically
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
    const handlePayment = async (addressId) => {
        if (!cart || cart.length === 0) return;

        try {
            const token = localStorage.getItem('mahakalToken');
            if (!token) {
                navigate('/');
                return;
            }

            setUpdating(true);

            // Load Razorpay script first
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                toastError("Razorpay SDK failed to load. Check your internet connection.");
                setUpdating(false);
                return;
            }

            // Prepare products array from cart with full details
            const products = validCartItems.map((item) => {
                const product = item.product;
                if (!product) return null; // Skip invalid products

                const price = Number(product.discountPrice || product.price || 0);
                const qty = Number(item.quantity || 1);

                // Construct images array matching backend schema
                const productImages = (product.images || []).map((image) => ({
                    url: image.url,
                    public_id: image.public_id // Use public_id directly (no fallback needed as per schema)
                }));

                return {
                    product: product._id,         // ✔ actual product id
                    name: product.name,           // ✔ mapped to correct field
                    category: product.category || "General", // ✔ fallback to valid enum value
                    images: productImages,        // ✔ array of {url, public_id}
                    quantity: qty,           // ✔ passed quantity
                    price: price,            // ✔ correct discounted price
                    unit: product.unit || "gm"    // ✔ fallback to "gm"
                };
            }).filter(Boolean); // Remove any null items

            if (products.length === 0) {
                toastError("No valid items in cart.");
                setUpdating(false);
                return;
            }

            // Calculate total amount
            const totalAmount = calculateTotal();

            // Safeguard against invalid amount
            if (!totalAmount || totalAmount <= 0) {
                toastInfo("Invalid cart total. Please check your items.");
                setUpdating(false);
                return;
            }

            // Create order from backend
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
                {
                    products: products,
                    amount: totalAmount,
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

            // Razorpay options
            const options = {
                key: import.meta.env.VITE_APP_RAZORPAY,
                amount: res.data.razorpayOrder.amount,      // ✔ Comes from backend (already *100)
                currency: res.data.razorpayOrder.currency,  // ✔ "INR"
                name: import.meta.env.VITE_APP_NAME || "Mahakal Store",
                description: "Your Cart Order",     // ✔ Generic for cart
                order_id: res.data.razorpayOrder.id,        // ✔ Razorpay order id

                handler: async (response) => {
                    try {
                        // Verify payment on backend
                        const { data } = await axios.post(
                            `${import.meta.env.VITE_API_URL}/api/payment/verify-payment`,
                            {
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                            },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        if (data.success) {
                            toastSuccess("✅ Payment verified and successful!");
                            // Clear cart after successful payment (optional - backend should handle this)
                            setCart([]);
                            navigate("/");
                        } else {
                            toastError("❌ Payment verification failed!");
                        }
                    } catch (err) {
                        console.error("Payment verification error:", err);
              }
                },
                prefill: {
                    name: "",
                    email: "",
                    contact: ""
                },
                theme: {
                    color: "#ea580c" // Orange theme matching your app
                }
            };

            // Open Razorpay checkout
            const rz = new window.Razorpay(options);
            rz.open();

            setUpdating(false);

        } catch (err) {
            console.error("💥 Payment Error:", err);
            toastWarning(err.response?.data?.message || err.message || "Error initiating payment. Please try again.");
            setUpdating(false);
        }
    };

    // Handle direct checkout with Razorpay
    const handleCheckout = () => {
        initiateCheckout();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mx-auto mb-6"></div>
                    <p className="text-xl font-semibold text-gray-700">Loading your sacred cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-lg hover:bg-orange-100 transition-colors"
                    >
                        <ArrowLeft size={24} className="text-gray-700" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Your Sacred Cart</h1>
                    <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
                        <ShoppingCart size={20} />
                        <span>{validCartLength} items</span>
                    </div>
                </div>

                {validCartLength === 0 ? (
                    <div className="text-center py-16">
                        <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8">Add some divine blessings to get started.</p>
                        <button
                            onClick={() => navigate("/products")}
                            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Cart Items */}
                        <div className="space-y-6 mb-8">
                            {validCartItems.map((item) => {
                                const product = item.product;
                                if (!product) return null;

                                const itemPrice = product.discountPrice || product.price || 0;
                                const quantity = item.quantity || 1;
                                const itemTotal = itemPrice * quantity;

                                return (
                                    <div key={item._id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                                        <img
                                            src={product.images?.[0]?.url || product.images?.[0] || "/shivmahakal.png"}
                                            alt={product.name}
                                            className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                                            <div className="flex items-center gap-4 mb-3">
                                                <span className="text-sm text-gray-500">{product.category}</span>
                                                {product.deity && (
                                                    <span className="px-2 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-xs rounded-full">
                                                        {product.deity}
                                                    </span>
                                                )}
                                            </div>
                                            {product.rating && (
                                                <div className="flex items-center gap-2 mb-3">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={16}
                                                            className={
                                                                i < Math.round(product.rating?.average || 0)
                                                                    ? "fill-yellow-400 stroke-yellow-400"
                                                                    : "stroke-gray-300"
                                                            }
                                                        />
                                                    ))}
                                                    <span className="text-sm text-gray-500">({product.rating?.count || 0} reviews)</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQuantity(product._id, quantity - 1)}
                                                        disabled={updating || quantity <= 1}
                                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                                                    >
                                                        <Minus size={16} className="text-gray-600" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(product._id, quantity + 1)}
                                                        disabled={updating}
                                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                                                    >
                                                        <Plus size={16} className="text-gray-600" />
                                                    </button>
                                                </div>
                                                {product.weight && product.unit && (
                                                    <span className="text-sm text-gray-500">
                                                        {product.weight}{product.unit}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-2 w-full md:w-auto">
                                            <div>
                                                {product.discountPrice ? (
                                                    <>
                                                        <span className="text-xl font-bold text-gray-900">₹{itemTotal.toFixed(2)}</span>
                                                        <span className="text-sm text-gray-400 line-through ml-2">
                                                            ₹{(product.price * quantity).toFixed(2)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-xl font-bold text-gray-900">₹{itemTotal.toFixed(2)}</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(product._id)}
                                                disabled={updating}
                                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal ({validCartLength} items)</span>
                                    <span className="font-semibold">₹{calculateTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-green-600 font-semibold">FREE</span>
                                </div>
                                <div className="flex justify-between pt-4 border-t border-gray-200">
                                    <span className="text-lg font-bold">Total</span>
                                    <span className="text-2xl font-bold text-gray-900">₹{calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={updating || validCartLength === 0}
                                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-[1.02] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                <CreditCard size={24} />
                                {updating ? "Processing..." : "Proceed to Checkout"}
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 text-center text-sm">
                            <div className="flex flex-col items-center p-4 bg-white rounded-xl">
                                <Shield className="text-green-600 mb-1" size={20} />
                                <span className="text-gray-600 font-medium">Secure</span>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-white rounded-xl">
                                <Truck className="text-blue-600 mb-1" size={20} />
                                <span className="text-gray-600 font-medium">Free Shipping</span>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-white rounded-xl">
                                <Wallet className="text-orange-600 mb-1" size={20} />
                                <span className="text-gray-600 font-medium">Easy Returns</span>
                            </div>
                        </div>
                    </>
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
                                    Choose an address for your order
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
            </div>
        </div>
    );
}

export default Cart;