import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, ArrowLeft } from "lucide-react";

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [checkoutData, setCheckoutData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);

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

    useEffect(() => {
        const data = location.state || JSON.parse(localStorage.getItem("checkoutData"));
        if (!data) {
            navigate("/cart");
            return;
        }
        setCheckoutData(data);
    }, [location.state, navigate]);

    const handleProceedToPayment = async () => {
        if (!checkoutData) return;
        const { cartItems = [], totalAmount = 0 } = checkoutData || {};


        setLoading(true);
        setError(null);
        setPaymentStatus(null);

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            setError("Razorpay SDK failed to load. Please check your internet connection.");
            setLoading(false);
            return;
        }

        try {
            // 1️⃣ Create order on backend
            const token = localStorage.getItem("mahakalToken");
            console.log(token)

            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
                {
                    amount: totalAmount,
                    items: cartItems,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // pass the token
                    },
                }
            );

            const { order } = data;

            const options = {
                key: import.meta.env.VITE_APP_RAZORPAY,
                amount: order.amount, // already in paise
                currency: order.currency,
                name: import.meta.env.VITE_APP_NAME || "My Shop",
                description: `Payment for ${cartItems.length} item(s)`,
                order_id: order.razorpayOrderId,
                handler: async function (response) {
                    // 2️⃣ Verify payment on backend
                    try {
                        const verifyRes = await axios.post(
                            `${import.meta.env.VITE_API_URL}/api/payment/verify-payment`,
                            {
                                orderId: order._id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpaySignature: response.razorpay_signature,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        if (verifyRes.data.success) {
                            setPaymentStatus("success");
                            navigate("/success"); // or wherever you want
                        } else {
                            setPaymentStatus("error");
                            setError("Payment verification failed!");
                        }
                    } catch (err) {
                        console.error("Payment verification error:", err);
                        setPaymentStatus("error");
                        setError("Payment verification failed. Please contact support.");
                    } finally {
                        setLoading(false);
                    }
                },
                theme: { color: "#f97316" },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", (response) => {
                setPaymentStatus("error");
                setError(response.error.description || "Payment failed");
                setLoading(false);
            });
            rzp.open();
        } catch (err) {
            console.error("Payment error:", err);
            setError(err.response?.data?.message || "Failed to create order. Please try again.");
            setPaymentStatus("error");
            setLoading(false);
        }
    };

    if (!checkoutData) return null;

    const { cartItems, totalAmount } = checkoutData;

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 p-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 p-4 bg-white rounded-xl shadow-lg">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100">
                        <ArrowLeft size={24} className="text-gray-700" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 flex-1">Checkout</h1>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    {cartItems && cartItems.length > 0 ? (
                        cartItems.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                                ...
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No items in your cart.</p>
                    )}


                    <div className="flex justify-between border-t pt-4 mt-4">
                        <span className="text-gray-600">Total</span>
                        <span className="text-xl font-bold text-gray-900">₹{totalAmount}</span>
                    </div>
                </div>

                {/* Payment Button */}
                <button
                    onClick={handleProceedToPayment}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:from-orange-700 hover:to-red-700 transition-all shadow-xl disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                        </>
                    ) : (
                        "Pay with Razorpay"
                    )}
                </button>

                {error && <p className="text-red-600 text-center mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default Checkout;
