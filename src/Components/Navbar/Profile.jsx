import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Package,
  Star,
  ShieldCheck,
  Pencil,
  Trash2,
  Upload,
  Check,
  X,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import HomeFooter from "./HomeFooter";
import { toastError, toastSuccess } from "../Toast";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState("");
  const [editError, setEditError] = useState("");

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("mahakalToken");
        if (!token) {
          setError("Please log in to view your profile.");
          setLoading(false);
          return;
        }

        const [profileRes, ordersRes] = await Promise.all([
          axios.get(`${API_URL}/user/profile`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/payment/myorders`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const userData = profileRes.data.user || profileRes.data;
        userData.orders = ordersRes.data.orders || [];

        setUser(userData);
        setEditName(userData.name || "");
        setImagePreview(userData.profileImage || "/shivmahakal.png");
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load profile");
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      setEditError("Name is required");
      return;
    }

    setEditLoading(true);
    setEditError("");
    setEditMessage("");

    const formData = new FormData();
    formData.append("name", editName.trim());
    if (profileImageFile) formData.append("profileImage", profileImageFile);

    try {
      const token = localStorage.getItem("mahakalToken");
      const res = await axios.put(`${API_URL}/user/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const updatedUser = {
          ...user,
          name: res.data.user.name || editName.trim(),
          profileImage: res.data.user.profileImage || imagePreview,
        };
        setUser(updatedUser);
        localStorage.setItem("mahakalUser", JSON.stringify(updatedUser));
        setEditMessage("Profile updated successfully!");
        setIsEditing(false);
        setProfileImageFile(null);
      }
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setEditLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditName(user.name || "");
    setImagePreview(user.profileImage || "/shivmahakal.png");
    setProfileImageFile(null);
    setEditError("");
    setEditMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      const token = localStorage.getItem("mahakalToken");
      const res = await axios.delete(`${API_URL}/user/address/delete/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser((prev) => ({ ...prev, addresses: res.data.addresses }));
      toastSuccess("Address deleted successfully");
    } catch (err) {
      toastError("Failed to delete address");
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    const map = {
      paid: { text: "text-green-600", bg: "bg-green-50", icon: CheckCircle },
      success: { text: "text-green-600", bg: "bg-green-50", icon: CheckCircle },
      failed: { text: "text-red-600", bg: "bg-red-50", icon: XCircle },
      pending: { text: "text-yellow-600", bg: "bg-yellow-50", icon: Clock },
      shipped: { text: "text-blue-600", bg: "bg-blue-50", icon: Truck },
      "out-for-delivery": { text: "text-purple-600", bg: "bg-purple-50", icon: ChevronRight },
      delivered: { text: "text-green-600", bg: "bg-green-50", icon: CheckCircle },
      cancelled: { text: "text-red-600", bg: "bg-red-50", icon: XCircle },
    };
    return map[status?.toLowerCase()] || { text: "text-gray-600", bg: "bg-gray-100", icon: AlertTriangle };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md w-full">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-800 mb-2">Oops!</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header - Minimal */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Profile Image */}
              <div className="relative group">
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />
                {isEditing && (
                  <>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      <Upload size={20} className="text-white" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </>
                )}
                {user.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                    <ShieldCheck size={14} className="text-white" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                {isEditing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-2xl font-semibold text-gray-800 mb-2 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 w-full max-w-sm"
                    autoFocus
                  />
                ) : (
                  <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                    {user.name || "Devotee"}
                  </h1>
                )}

                <p className="text-gray-600 mb-4 flex items-center justify-center sm:justify-start gap-2">
                  <Mail size={18} className="text-orange-500" />
                  {user.email}
                </p>

                {/* Stats */}
                <div className="flex justify-center sm:justify-start gap-10 mb-6">
                  <div className="text-center">
                    <p className="text-xl font-bold text-orange-600">{user.orders?.length || 0}</p>
                    <p className="text-sm text-gray-500">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-orange-600">0</p>
                    <p className="text-sm text-gray-500">Reviews</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveProfile}
                        disabled={editLoading}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-70"
                      >
                        <Check size={16} />
                        {editLoading ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg font-medium flex items-center gap-2"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2"
                    >
                      <Pencil size={16} />
                      Edit Profile
                    </button>
                  )}
                </div>

                {/* Feedback */}
                {editError && <p className="text-red-600 mt-3 text-sm">{editError}</p>}
                {editMessage && <p className="text-green-600 mt-3 text-sm">{editMessage}</p>}
              </div>
            </div>
          </div>

          {/* Tabs - Clean & Scrollable on Mobile */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-x-auto">
            <div className="flex min-w-max">
              {["overview", "orders"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "border-b-2 border-orange-500 text-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "overview" ? "Account Overview" : "My Orders"}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                <div className="space-y-3 text-gray-700">
                  <p><span className="font-medium">Name:</span> {user.name || "N/A"}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span className={user.isVerified ? "text-green-600" : "text-red-600"}>
                      {user.isVerified ? "Verified" : "Not Verified"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Addresses */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">My Addresses</h2>
                  <button
                    onClick={() => navigate("/address")}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium"
                  >
                    + Add New
                  </button>
                </div>

                {user.addresses?.length > 0 ? (
                  <div className="space-y-4">
                    {user.addresses.map((addr) => (
                      <div key={addr._id} className="border border-gray-200 rounded-lg p-4">
                        <p className="font-medium">{addr.fullName}</p>
                        <p className="text-sm text-gray-600">{addr.phone}</p>
                        <p className="text-sm text-gray-700 mt-1">
                          {addr.houseNumber}, {addr.street}, {addr.townCity}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-xs text-orange-600 mt-2">
                          {addr.addressType} {addr.isDefault && "(Default)"}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => navigate(`/address/update/${addr._id}`)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr._id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1.5 rounded-lg text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-6">No addresses added yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.orders?.length > 0 ? (
                user.orders.map((order) => {
                  const paymentStatus = getStatusColor(order.paymentStatus);
                  const deliveryStatus = getStatusColor(order.deliveryStatus);
                  const PaymentIcon = paymentStatus.icon;
                  const DeliveryIcon = deliveryStatus.icon;

                  return (
                    <div
                      key={order._id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:border-orange-300 transition"
                    >
                      <div className="p-5">
                        <div className="flex justify-between mb-4">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${paymentStatus.bg} ${paymentStatus.text} flex items-center gap-1`}>
                            <PaymentIcon size={14} />
                            {order.paymentStatus}
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${deliveryStatus.bg} ${deliveryStatus.text} flex items-center gap-1`}>
                            <DeliveryIcon size={14} />
                            {order.deliveryStatus}
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-xl font-semibold text-gray-800">₹{order.amount}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>

                        <div className="space-y-3 mb-5">
                          {order.products?.slice(0, 2).map((item) => {
                            const prod = item.product || item;
                            return (
                              <div key={prod._id} className="flex gap-3 items-center">
                                <img
                                  src={prod.images?.[0]?.url || "/placeholder.png"}
                                  alt={prod.name}
                                  className="w-12 h-12 object-cover rounded-md"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{prod.name}</p>
                                  <p className="text-xs text-gray-600">
                                    ₹{item.price || prod.discountPrice} × {item.quantity}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                          {order.products?.length > 2 && (
                            <p className="text-xs text-gray-500 text-center">+{order.products.length - 2} more items</p>
                          )}
                        </div>

                        <button
                          onClick={() => navigate(`/order/${order._id}`)}
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2"
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
                  <Package size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No orders yet</p>
                  <button
                    onClick={() => navigate("/products")}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Shop Now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <HomeFooter />
    </>
  );
}

export default Profile;