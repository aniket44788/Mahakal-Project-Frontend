import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

import axios from "axios";
import { User, Mail, ShieldCheck, Heart, Package, Settings, LogOut, Edit2, Star, Eye, Clock, CheckCircle, XCircle, AlertTriangle, Truck, ChevronRight } from "lucide-react";
import HomeFooter from "./HomeFooter";


function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("overview");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("mahakalToken");
                if (!token) {
                    setError("No token found. Please login first.");
                    setLoading(false);
                    return;
                }

                // Fetch user profile
                const profileRes = await axios.get(`${import.meta.env.VITE_API_URL}/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Fetch user orders
                const ordersRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/payment/myorders`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const userData = profileRes.data.user || profileRes.data; // Fallback if response is direct user object
                userData.orders = ordersRes.data.orders || []; // Attach orders with fallback empty array
                setUser(userData);

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Failed to fetch data");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("mahakalToken");
        navigate("/");
    };
    const handleDeleteAddress = async (addressId) => {
        try {
            const token = localStorage.getItem("mahakalToken");

            const isConfirmed = window.confirm("Are you sure you want to delete this address?");
            if (!isConfirmed) return;
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}/user/address/delete/${addressId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Deleted:", response.data);
            window.alert("Address deleted successfully")
            // OPTIONAL: Refresh user addresses after delete
            setUser((prev) => ({
                ...prev,
                addresses: response.data.addresses,
            }));

        } catch (error) {
            window.alert("Failed to delete address ")
            console.error("Delete Address Error:", error);
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
            case 'success':
                return { text: "text-green-700", bg: "bg-green-100", icon: CheckCircle };
            case 'failed':
                return { text: "text-red-700", bg: "bg-red-100", icon: XCircle };
            case 'pending':
            default:
                return { text: "text-yellow-700", bg: "bg-yellow-100", icon: Clock };
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return {
                    text: "text-yellow-700",
                    bg: "bg-yellow-100",
                    icon: Clock
                };

            case "shipped":
                return {
                    text: "text-blue-700",
                    bg: "bg-blue-100",
                    icon: Truck
                };

            case "out-for-delivery":
                return {
                    text: "text-purple-700",
                    bg: "bg-purple-100",
                    icon: ChevronRight
                };

            case "delivered":
                return {
                    text: "text-green-700",
                    bg: "bg-green-100",
                    icon: CheckCircle
                };

            case "cancelled":
                return {
                    text: "text-red-700",
                    bg: "bg-red-100",
                    icon: XCircle
                };

            case "paid":
                return {
                    text: "text-green-700",
                    bg: "bg-green-100",
                    icon: CheckCircle
                };

            case "failed":
                return {
                    text: "text-red-700",
                    bg: "bg-red-100",
                    icon: XCircle
                };

            default:
                return {
                    text: "text-gray-700",
                    bg: "bg-gray-200",
                    icon: AlertTriangle
                };
        }
    };

    const handleViewOrder = (orderId) => {
        // Navigate to order details page (implement route as needed)
        navigate(`/order/${orderId}`);
    };

    const handleViewProduct = (productId) => {
        // Navigate to product details page
        navigate(`/single/${productId._id}`)
    };

    const handleaddress = () => {
        navigate("/address")
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-orange-700 font-semibold">Loading your sacred profile...</p>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 py-8 px-4 w-full">
            <div className="w-full">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-5"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start md:space-x-8 space-y-6 md:space-y-0">
                        {/* Profile Image */}
                        <div className="flex-shrink-0 relative">
                            <img
                                src={user.profileImage || "https://via.placeholder.com/150?text=User"}
                                alt="Profile"
                                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover ring-4 ring-orange-200"

                            />
                            {user.isVerified && (
                                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                                    <ShieldCheck size={16} className="text-white" />
                                </div>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name || "Devotee"}</h1>
                            <p className="text-gray-600 mb-4 flex items-center justify-center md:justify-start gap-2">
                                <Mail size={18} className="text-orange-500" />
                                {user.email || "N/A"}
                            </p>

                            {/* Stats */}
                            <div className="flex justify-center md:justify-start gap-8">

                                <div className="text-center">
                                    <p className="text-2xl font-bold text-orange-600">{user.orders?.length || 0}</p>
                                    <p className="text-gray-500 text-sm flex items-center gap-1 justify-center">
                                        <Package size={14} />
                                        Orders
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-orange-600">0</p>
                                    <p className="text-gray-500 text-sm flex items-center gap-1 justify-center">
                                        <Star size={14} />
                                        Reviews
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-2xl shadow-lg p-1 mb-8">
                    <nav className="flex space-x-1 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-1">
                        {["overview", "orders"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === tab
                                    ? "bg-white shadow-md text-orange-600"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </nav>
                </div>
                {/* Main Content */}
                <div className="w-full">
                    {/* Content Area */}
                    <div className="space-y-6">
                        {activeTab === "overview" && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <User size={24} className="text-orange-500" />
                                    Account Overview
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <p className="flex items-center gap-2 text-gray-700">
                                            <User size={18} className="text-orange-400" />
                                            <span className="font-medium">Full Name:</span> {user.name || "N/A"}
                                        </p>
                                        <p className="flex items-center gap-2 text-gray-700">
                                            <Mail size={18} className="text-orange-400" />
                                            <span className="font-medium">Email:</span> {user.email || "N/A"}
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="flex items-center gap-2 text-gray-700">
                                            <ShieldCheck size={18} className="text-orange-400" />
                                            <span className="font-medium">Auth Method:</span> {user.authMethod || "N/A"}
                                        </p>
                                        <p className="flex items-center gap-2 text-gray-700">
                                            <span className={`font-medium ${user.isVerified ? "text-green-600" : "text-red-600"}`}>
                                                Verified: {user.isVerified ? "Yes" : "No"}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="flex items-center gap-2 text-gray-700">
                                            <ShieldCheck size={18} className="text-orange-400" />
                                            <span className="font-medium">My Addresses :</span>
                                        </p>
                                        <button
                                            onClick={handleaddress}
                                            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center gap-2"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add Address
                                        </button>

                                        {user.addresses && user.addresses.length > 0 ? (
                                            <div className="space-y-2 ml-6">
                                                {user.addresses.map((address) => (
                                                    <div
                                                        key={address._id}
                                                        className="bg-white p-5 rounded-xl shadow-md border border-gray-200 mb-5 hover:shadow-lg transition-all"
                                                    >
                                                        {/* Address Details */}
                                                        <div className="space-y-1 text-gray-700">
                                                            <p>
                                                                <span className="font-semibold">Name:</span> {address.fullName}
                                                            </p>
                                                            <p>
                                                                <span className="font-semibold">Phone:</span> {address.phone}
                                                                {address.alternatePhone && ` / ${address.alternatePhone}`}
                                                            </p>
                                                            <p>
                                                                <span className="font-semibold">Address:</span>
                                                                {address.houseNumber}, {address.street}, {address.landmark},
                                                                {address.townCity}, {address.state} - {address.pincode}
                                                            </p>
                                                            <p>
                                                                <span className="font-semibold">Type:</span> {address.addressType}{" "}
                                                                {address.isDefault && (
                                                                    <span className="text-green-600 font-semibold">(Default)</span>
                                                                )}
                                                            </p>
                                                        </div>

                                                        {/* Buttons */}
                                                        <div className="flex items-center gap-3 mt-4">

                                                            {/* Update Button */}
                                                            <button
                                                                onClick={() => navigate(`/address/update/${address._id}`)}
                                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                                                            >
                                                                <Pencil size={18} />
                                                                Update
                                                            </button>

                                                            {/* Delete Button */}
                                                            <button
                                                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                                                                onClick={() => handleDeleteAddress(address._id)}>
                                                                <Trash2 size={18} />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}

                                            </div>
                                        ) : (

                                            <p className="ml-6 text-gray-500">No addresses added yet</p>
                                        )}
                                    </div>

                                </div>
                            </div>
                        )}


                        {activeTab === "orders" && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <Package size={24} className="text-blue-500" />
                                    Your Orders
                                </h2>
                                {user.orders?.length ? (

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {user.orders.map((order) => {
                                            const statusConfig = getStatusColor(order.paymentStatus);
                                            const deliveryStatus = getStatusColor(order.deliveryStatus);
                                            const StatusIcon = statusConfig.icon;
                                            const DeliveryIcon = deliveryStatus.icon;

                                            return (
                                                <div
                                                    key={order._id}
                                                    className="rounded-2xl p-6 bg-white shadow-sm border border-orange-100 hover:shadow-lg transition-all duration-300"
                                                >
                                                    {/* Status section */}
                                                    <div className="flex justify-between items-center gap-2 mb-4">
                                                        <div
                                                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
                                                        >
                                                            <StatusIcon size={14} />
                                                            Payment: {order.paymentStatus || "Pending"}
                                                        </div>

                                                        <div
                                                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${deliveryStatus.bg} ${deliveryStatus.text}`}
                                                        >
                                                            <DeliveryIcon size={14} />
                                                            Delivery: {order.deliveryStatus || "Pending"}
                                                        </div>
                                                    </div>

                                                    {/* Amount & Date */}
                                                    <div className="mb-4">
                                                        <p className="text-gray-800 font-semibold text-lg">
                                                            {order.currency === "INR" ? "₹" : order.currency} {order.amount}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>

                                                    {/* PRODUCT LABEL */}
                                                    <p className="font-semibold text-sm text-gray-700 border-b pb-2 mb-3">
                                                        Items ({order.products?.length || 0})
                                                    </p>

                                                    {/* PRODUCTS SECTION */}
                                                    <div className="space-y-3 max-h-36 overflow-y-auto pr-1">
                                                        {order.products?.slice(0, 3).map((prod) => {
                                                            const product = prod.product || prod;

                                                            return (
                                                                <div
                                                                    key={product._id || prod._id}
                                                                    className="flex items-center gap-4 p-3 bg-orange-50 rounded-xl shadow-sm hover:shadow-md transition-all"
                                                                >
                                                                    {/* Image */}
                                                                    <div className="w-16 h-16 flex-shrink-0">
                                                                        <img
                                                                            src={product.images?.[0]?.url || "/placeholder.png"}
                                                                            alt={product.name}
                                                                            className="w-full h-full object-cover rounded-lg"
                                                                        />
                                                                    </div>

                                                                    {/* Info */}
                                                                    <div className="flex-1 min-w-0">
                                                                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                                                                            {product.name || `Product ${product._id?.slice(-6)}`}
                                                                        </h3>

                                                                        <div className="flex items-center gap-1 mt-1 text-gray-600 text-sm">
                                                                            <span className="font-semibold text-gray-800">
                                                                                ₹{(prod.price ||
                                                                                    product.discountPrice ||
                                                                                    product.price ||
                                                                                    0
                                                                                ).toFixed(2)}
                                                                            </span>
                                                                            <span>×</span>
                                                                            <span>{prod.quantity || 1}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}

                                                        {order.products?.length > 3 && (
                                                            <p className="text-xs text-gray-500 text-center mt-1">
                                                                +{order.products.length - 3} more items
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* VIEW ORDER BUTTON */}
                                                    <button
                                                        onClick={() => navigate(`/order/${order._id}`)}
                                                        className="w-full mt-5 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
                                                    >
                                                        <Eye size={16} />
                                                        View Order Details
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>


                                ) : (
                                    <div className="text-center py-12">
                                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 text-lg">No orders yet. Your divine journey awaits!</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "settings" && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <Settings size={24} className="text-purple-500" />
                                    Account Settings
                                </h2>
                                <div className="space-y-4">
                                    <button className="w-full flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 transition">
                                        <Edit2 size={20} className="text-blue-500" />
                                        <span className="font-medium">Edit Profile</span>
                                    </button>
                                    <button className="w-full flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 transition">
                                        <Lock size={20} className="text-purple-500" />
                                        <span className="font-medium">Change Password</span>
                                    </button>
                                    <button className="w-full flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 transition">
                                        <ShieldCheck size={20} className="text-green-500" />
                                        <span className="font-medium">Privacy & Security</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Profile;