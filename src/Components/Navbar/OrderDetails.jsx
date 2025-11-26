import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, MapPin } from "lucide-react";

function OrderDetails() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("mahakalToken");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/payment/myorders/${orderId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setOrder(res.data.order);
            } catch (err) {
                setError("Failed to load order details");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

    return (
        <div className="max-w-3xl mx-auto mt-10 px-4 pb-20">

            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-orange-600 mb-5 hover:text-orange-700"
            >
                <ArrowLeft size={20} />
                Back
            </button>

            {/* ORDER HEADER */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold">Order Details</h2>
                <p className="text-sm opacity-90 mt-1">Order ID: {order._id}</p>

                <div className="mt-4 flex justify-between">
                    <p><strong>Amount:</strong> ₹{order.amount}</p>
                    <p><strong>Status:</strong> {order.paymentStatus}</p>
                </div>
                <p className="mt-1 text-sm opacity-90">
                    {new Date(order.createdAt).toLocaleString()}
                </p>
            </div>

            {/* PRODUCTS */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
                    <Package size={20} /> Products
                </h3>

                {order.products?.map((item, i) => (
                    <div
                        key={i}
                        className="p-4 border rounded-xl bg-white shadow-sm flex gap-4 mb-4"
                    >
                        {item.product?.images?.length > 0 && (
                            <img
                                src={item.product.images[0].url}
                                alt="product"
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                        )}

                        <div>
                            <p className="font-semibold text-lg">{item.product?.name}</p>
                            <p className="text-sm text-gray-600">
                                Quantity: <strong>{item.quantity}</strong>
                            </p>
                            <p className="text-sm text-gray-600">
                                Price: <strong>₹{item.price}</strong>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ADDRESS */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
                    <MapPin size={20} /> Delivery Address
                </h3>

                <div className="p-5 border rounded-xl bg-white shadow-sm">
                    <p><strong>Name:</strong> {order.address.fullName}</p>
                    <p><strong>Phone:</strong> {order.address.phone}</p>
                    <p><strong>City:</strong> {order.address.city}</p>
                    <p><strong>State:</strong> {order.address.state}</p>
                    <p><strong>Pincode:</strong> {order.address.pincode}</p>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;
