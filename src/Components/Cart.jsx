import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  Shield,
  Wallet,
  ArrowLeft,
  CreditCard,
  Star,
} from "lucide-react";
import { toastError, toastInfo, toastSuccess, toastWarning } from "./Toast";
import SuccessModal from "../../utils/OrderSuccess";

// ─── Dharmic Payment Loader ───────────────────────────────────────────────────
const DharmicLoader = ({ visible }) => {
  const messages = [
    "🙏 Seeking Mahadev's blessings...",
    "🔱 Preparing your sacred order...",
    "🕉️ Connecting to the divine gateway...",
    "🪔 Lighting the path to payment...",
    "🌸 Almost there, devotee...",
  ];

  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!visible) return;
    setMsgIndex(0);
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,237,213,0.92), rgba(254,215,170,0.88), rgba(252,165,165,0.85))",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Rotating trishul / om ring */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer spinning ring */}
        <div
          className="w-28 h-28 rounded-full border-4 border-orange-200 border-t-orange-500 border-r-orange-400"
          style={{ animation: "spin 1.2s linear infinite" }}
        />
        {/* Inner pulse ring */}
        <div
          className="absolute w-20 h-20 rounded-full border-2 border-red-300 border-b-red-500"
          style={{ animation: "spinReverse 1.8s linear infinite" }}
        />
        {/* Center symbol */}
        <div
          className="absolute text-4xl"
          style={{ animation: "pulse 2s ease-in-out infinite" }}
        >
          🕉️
        </div>
      </div>

      {/* Animated dots row */}
      <div className="flex gap-2 mb-6">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-orange-500"
            style={{
              animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Rotating message */}
      <p
        key={msgIndex}
        className="text-orange-800 font-semibold text-lg text-center px-6"
        style={{ animation: "fadeIn 0.5s ease-in" }}
      >
        {messages[msgIndex]}
      </p>

      <p className="text-orange-600 text-sm mt-2 opacity-70">
        हर हर महादेव 🔱
      </p>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes spinReverse { to { transform: rotate(-360deg); } }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
};

// ─── Cart Component ───────────────────────────────────────────────────────────
function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false); // ← separate loader state

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("mahakalToken");
        if (!token) { navigate("/"); return; }
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/cart/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setCart(res.data.cart || []);
      } catch (error) {
        if (error.response?.status === 401) navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [navigate]);

  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true);
      const token = localStorage.getItem("mahakalToken");
      if (!token) return setAddresses([]);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = res.data.user || res.data;
      const userAddresses = user?.addresses || [];
      setAddresses(userAddresses);
      const defaultAddr = userAddresses.find((a) => a.isDefault);
      if (defaultAddr) setSelectedAddressId(defaultAddr._id);
    } catch (err) {
      setAddresses([]);
    } finally {
      setAddressesLoading(false);
    }
  };

  useEffect(() => { fetchAddresses(); }, []);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdating(true);
    try {
      const token = localStorage.getItem("mahakalToken");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/update-quantity`,
        { productId, setQuantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } },
      );
      if (res.data.success) setCart(res.data.cart || []);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdating(false);
    }
  };

  const removeFromCart = async (productId) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("mahakalToken");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/remove`,
        { productId },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } },
      );
      if (res.data.success) setCart(res.data.cart || []);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setUpdating(false);
    }
  };

  const calculateTotal = () =>
    cart.reduce((total, item) => {
      const product = item.product;
      if (!product) return total;
      const price = product.discountPrice || product.price || 0;
      return total + price * (item.quantity || 1);
    }, 0);

  const validCartItems = cart.filter((item) => item.product);
  const validCartLength = validCartItems.length;

  const initiateCheckout = () => {
    if (validCartLength === 0) return;
    setShowAddressModal(true);
  };

  const handleConfirmAddress = async () => {
    if (!selectedAddressId) {
      toastWarning("Please select a delivery address before placing the order.");
      return;
    }
    setShowAddressModal(false);
    await handlePayment(selectedAddressId);
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async (addressId) => {
    if (!cart || cart.length === 0) return;
    try {
      const token = localStorage.getItem("mahakalToken");
      if (!token) { navigate("/"); return; }

      setPaymentLoading(true); // ← show dharmic loader

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toastError("Razorpay SDK failed to load. Check your internet connection.");
        setPaymentLoading(false);
        return;
      }

      const products = validCartItems
        .map((item) => {
          const product = item.product;
          if (!product) return null;
          const price = Number(product.discountPrice || product.price || 0);
          const qty = Number(item.quantity || 1);
          const productImages = (product.images || []).map((image) => ({
            url: image.url,
            public_id: image.public_id,
          }));
          return {
            product: product._id,
            name: product.name,
            category: product.category || "General",
            images: productImages,
            quantity: qty,
            price,
            unit: product.unit || "gm",
          };
        })
        .filter(Boolean);

      if (products.length === 0) {
        toastError("No valid items in cart.");
        setPaymentLoading(false);
        return;
      }

      const totalAmount = calculateTotal();
      if (!totalAmount || totalAmount <= 0) {
        toastInfo("Invalid cart total. Please check your items.");
        setPaymentLoading(false);
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        { products, amount: totalAmount, currency: "INR", addressId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!res.data.success) throw new Error(res.data.message || "Failed to create order");

      setPaymentLoading(false); // ← hide loader before Razorpay opens

      const options = {
        key: import.meta.env.VITE_APP_RAZORPAY,
        amount: res.data.razorpayOrder.amount,
        currency: res.data.razorpayOrder.currency,
        name: import.meta.env.VITE_APP_NAME || "Mahakal Bazar",
        description: "Your Sacred Cart Order",
        order_id: res.data.razorpayOrder.id,
        handler: async (response) => {
          try {
            setPaymentLoading(true); // ← show loader during verification too
            const { data } = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/payment/verify-payment`,
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } },
            );
            setPaymentLoading(false);
            if (data.success) {
              setCart([]);
              setShowSuccess(true);
            } else {
              toastError("❌ Payment verification failed!");
            }
          } catch (err) {
            setPaymentLoading(false);
            console.error("Payment verification error:", err);
          }
        },
        prefill: { name: "", email: "", contact: "" },
        theme: { color: "#ea580c" },
      };

      const rz = new window.Razorpay(options);
      rz.open();
    } catch (err) {
      console.error("💥 Payment Error:", err);
      setPaymentLoading(false);
      toastWarning(
        err.response?.data?.message || err.message || "Error initiating payment. Please try again.",
      );
    }
  };

  // ─── Page loader ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4" style={{ animation: "spin 2s linear infinite" }}>
            🕉️
          </div>
          <p className="text-xl font-semibold text-orange-700">Loading your sacred cart...</p>
          <p className="text-sm text-orange-400 mt-1">हर हर महादेव</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Dharmic full-screen payment loader */}
      <DharmicLoader visible={paymentLoading} />

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
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-start md:items-center gap-6"
                    >
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
                            <span className="text-sm text-gray-500">
                              ({product.rating?.count || 0} reviews)
                            </span>
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
                              <span className="text-xl font-bold text-gray-900">
                                ₹{itemTotal.toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-400 line-through ml-2">
                                ₹{(product.price * quantity).toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-xl font-bold text-gray-900">
                              ₹{itemTotal.toFixed(2)}
                            </span>
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
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={initiateCheckout}
                  disabled={updating || validCartLength === 0}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-[1.02] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <CreditCard size={24} />
                  {updating ? "Updating..." : "Proceed to Checkout"}
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

          {/* Success Modal — always outside conditional so it survives cart clear */}
          <SuccessModal
            isOpen={showSuccess}
            onClose={() => { setShowSuccess(false); navigate("/"); }}
          />

          {/* Address Selection Modal */}
          {showAddressModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10 rounded-t-2xl">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Select Delivery Address</h2>
                    <p className="text-xs text-orange-500 mt-0.5">🕉️ Choose where your sacred items arrive</p>
                  </div>
                  <button
                    onClick={() => setShowAddressModal(false)}
                    className="text-gray-600 hover:text-gray-800 rounded-full p-2 transition hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-4">
                  {addressesLoading ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2" style={{ animation: "spin 2s linear infinite" }}>🕉️</div>
                      <p className="text-sm text-gray-500">Loading addresses...</p>
                      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-600 mb-4 text-sm">No addresses found. Please add one to proceed.</p>
                      <button
                        onClick={() => { setShowAddressModal(false); navigate("/profile"); }}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                      >
                        Add New Address
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                        {addresses.map((addr) => (
                          <label
                            key={addr._id}
                            className={`flex items-start gap-3 p-3 rounded-xl border-2 transition cursor-pointer ${
                              selectedAddressId === addr._id
                                ? "border-orange-400 bg-orange-50"
                                : "border-gray-100 bg-white hover:border-orange-200"
                            }`}
                          >
                            <input
                              type="radio"
                              name="selectedAddress"
                              value={addr._id}
                              checked={selectedAddressId === addr._id}
                              onChange={() => setSelectedAddressId(addr._id)}
                              className="mt-1 flex-shrink-0 accent-orange-500"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm text-gray-800">
                                {addr.fullName}{" "}
                                {addr.isDefault && (
                                  <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full ml-1">
                                    Default
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
                                📞 {addr.phone}{addr.alternatePhone ? ` / ${addr.alternatePhone}` : ""}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>

                      <button
                        onClick={handleConfirmAddress}
                        disabled={!selectedAddressId}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
                      >
                        🔱 Confirm & Proceed to Payment
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default Cart;