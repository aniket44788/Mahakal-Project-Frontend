import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Package,
    MapPin,
    Calendar,
    IndianRupee,
    CreditCard,
    Truck,
    User,
    Phone,
    Mail,
    ListOrdered,
    ChevronRight,
    CheckCircle,
    Clock,
    X,
    ExternalLink
} from "lucide-react";

// Order Modal Component
function OrdersModal({ isOpen, onClose, orders }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">All Orders</h2>
                            <p className="text-sm text-gray-500 mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Orders List */}
                <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-4 sm:p-6">
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="border rounded-xl p-4 hover:shadow-md transition-shadow bg-gray-50"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-orange-100 p-2 rounded-lg">
                                                <Package size={20} className="text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    Order #{order._id.slice(-8)}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:items-end gap-2">
                                        <span className="text-lg font-bold text-orange-600">
                                            ₹{order.amount}
                                        </span>
                                        <div className="flex gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1
                        ${order.paymentStatus === "paid"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-yellow-100 text-yellow-800"}`}>
                                                {order.paymentStatus === "paid" ?
                                                    <CheckCircle size={12} /> : <Clock size={12} />}
                                                {order.paymentStatus}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium
                        ${order.deliveryStatus === "delivered"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-purple-100 text-purple-800"}`}>
                                                {order.deliveryStatus}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex -space-x-2">
                                                {order.products.slice(0, 3).map((product, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={product.images[0]?.url}
                                                        alt={product.name}
                                                        className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                                    />
                                                ))}
                                                {order.products.length > 3 && (
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                                                        <span className="text-xs font-semibold text-gray-600">
                                                            +{order.products.length - 3}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-600">
                                                {order.products.length} item{order.products.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => window.location.href = `/orders/${order._id}`}
                                            className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                                        >
                                            View Details
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function OrderDetails() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingUser, setLoadingUser] = useState(true);
    const [error, setError] = useState("");
    const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);

    const token = localStorage.getItem("mahakalToken");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch order details
                const orderRes = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/payment/myorders/${orderId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setOrder(orderRes.data.order);

                // Fetch all orders
                const allOrdersRes = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/payment/myorders`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setAllOrders(allOrdersRes.data.orders || []);

                // Fetch user details if API exists
                try {
                    const userRes = await axios.get(
                        `${import.meta.env.VITE_API_URL}/api/user/profile`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    setUserDetails(userRes.data.user);
                } catch (userErr) {
                    console.log("User API not available or error:", userErr);
                }

            } catch (err) {
                setError(err.response?.data?.message || "Failed to load order details");
            } finally {
                setLoading(false);
                setLoadingUser(false);
            }
        };

        fetchData();
    }, [orderId, token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="text-red-600" size={40} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Order</h2>
                    <p className="text-gray-600 mb-6">{error || "Order not found"}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            {/* Orders Modal */}
            <OrdersModal
                isOpen={isOrdersModalOpen}
                onClose={() => setIsOrdersModalOpen(false)}
                orders={allOrders}
            />

            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-orange-50 rounded-full transition-colors"
                            >
                                <ArrowLeft size={20} className="text-orange-600" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Order Details</h1>
                                <p className="text-sm text-gray-500">Track your order status</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Order Summary & Products */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Summary Card */}
                        <div className="bg-white rounded-2xl shadow-sm border p-5 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-orange-100 p-3 rounded-xl">
                                            <Package className="text-orange-600" size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900">
                                                Order #{order._id.slice(-8)}
                                            </h2>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                <Calendar size={14} />
                                                {formatDate(order.createdAt)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Badges */}
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <div className={`px-4 py-2 rounded-full flex items-center gap-2
                      ${order.paymentStatus === "paid"
                                                ? "bg-green-50 text-green-700 border border-green-200"
                                                : "bg-yellow-50 text-yellow-700 border border-yellow-200"}`}>
                                            <CreditCard size={16} />
                                            <span className="font-medium">Payment: </span>
                                            <span className="capitalize">{order.paymentStatus}</span>
                                        </div>

                                        <div className={`px-4 py-2 rounded-full flex items-center gap-2
                      ${order.deliveryStatus === "delivered"
                                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                                : "bg-purple-50 text-purple-700 border border-purple-200"}`}>
                                            <Truck size={16} />
                                            <span className="font-medium">Delivery: </span>
                                            <span className="capitalize">{order.deliveryStatus}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl min-w-[200px]">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-600 font-medium">Total Amount</span>
                                        <IndianRupee size={18} className="text-gray-600" />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-1">
                                        ₹{order.amount}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {order.currency} • Includes all taxes
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Products Card */}
                        <div className="bg-white rounded-2xl shadow-sm border p-5 sm:p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Package size={20} />
                                    Ordered Items ({order.products.length})
                                </h3>
                                <span className="text-sm text-gray-500">
                                    {order.products.reduce((sum, item) => sum + item.quantity, 0)} units total
                                </span>
                            </div>

                            <div className="space-y-4">
                                {order.products.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex flex-col sm:flex-row gap-4 border rounded-xl p-4 hover:shadow-sm transition-shadow"
                                    >
                                        <div className="sm:w-32 flex-shrink-0">
                                            <img
                                                src={item.images?.[0]?.url}
                                                alt={item.name}
                                                className="w-full h-40 sm:h-32 object-cover rounded-lg border shadow-sm"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/150x150?text=Product+Image';
                                                }}
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 line-clamp-2">
                                                        {item.name}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                            {item.category}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {item.unit}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-orange-600">
                                                        ₹{item.price * item.quantity}
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        ₹{item.price} × {item.quantity}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-gray-500">Price</p>
                                                    <p className="font-semibold text-gray-900">₹{item.price}</p>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-gray-500">Quantity</p>
                                                    <p className="font-semibold text-gray-900">{item.quantity}</p>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-gray-500">Total</p>
                                                    <p className="font-semibold text-gray-900">₹{item.price * item.quantity}</p>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-gray-500">Status</p>
                                                    <p className="font-semibold text-green-600">Confirmed</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Address & User Details */}
                    <div className="space-y-6">
                        {/* Address Card */}
                        <div className="bg-white rounded-2xl shadow-sm border p-5 sm:p-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                                <MapPin size={20} />
                                Delivery Address
                            </h3>

                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <User size={18} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-lg">
                                                {order.address.fullName}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Phone size={14} className="text-gray-500" />
                                                <span className="text-gray-600">{order.address.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <span className="text-gray-500 min-w-[80px] text-sm">Address:</span>
                                        <span className="text-gray-700">
                                            {order.address.houseNumber}, {order.address.street}
                                            {order.address.landmark && (
                                                <span className="block text-gray-500 text-sm">
                                                    Landmark: {order.address.landmark}
                                                </span>
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <span className="text-gray-500 min-w-[80px] text-sm">City:</span>
                                        <span className="text-gray-700">{order.address.townCity}</span>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <span className="text-gray-500 min-w-[80px] text-sm">State:</span>
                                        <span className="text-gray-700">{order.address.state}</span>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <span className="text-gray-500 min-w-[80px] text-sm">Pincode:</span>
                                        <span className="text-gray-700 font-semibold">
                                            {order.address.pincode}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Details Card */}
                        {userDetails && (
                            <div className="bg-white rounded-2xl shadow-sm border p-5 sm:p-6">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                                    <User size={20} />
                                    User Details
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-orange-100 p-3 rounded-full">
                                            <User className="text-orange-600" size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {userDetails.name || userDetails.email?.split('@')[0]}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Customer ID: {userDetails._id?.slice(-8)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {userDetails.email && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail size={16} className="text-gray-400" />
                                                <span className="text-gray-700">{userDetails.email}</span>
                                            </div>
                                        )}

                                        {userDetails.phone && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone size={16} className="text-gray-400" />
                                                <span className="text-gray-700">{userDetails.phone}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t">
                                        <div className="grid grid-cols-2 gap-3 text-center">
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <p className="text-2xl font-bold text-gray-900">{allOrders.length}</p>
                                                <p className="text-xs text-gray-500">Total Orders</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <p className="text-2xl font-bold text-gray-900">
                                                    ₹{allOrders.reduce((sum, o) => sum + o.amount, 0)}
                                                </p>
                                                <p className="text-xs text-gray-500">Total Spent</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Order Info Card */}
                        <div className="bg-white rounded-2xl shadow-sm border p-5 sm:p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">
                                Order Information
                            </h3>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Order ID</span>
                                    <span className="font-mono text-gray-700">{order._id}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Currency</span>
                                    <span className="font-semibold text-gray-700">{order.currency}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Created</span>
                                    <span className="text-gray-700">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Last Updated</span>
                                    <span className="text-gray-700">
                                        {new Date(order.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;