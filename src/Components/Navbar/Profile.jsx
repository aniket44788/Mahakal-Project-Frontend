import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail, Package, ShieldCheck, Pencil, Trash2,
  Upload, Check, X, Eye, Clock, CheckCircle,
  XCircle, Truck, ChevronRight, AlertTriangle,
  MapPin, Plus, Star,
} from "lucide-react";
import axios from "axios";
import { toastError, toastSuccess } from "../Toast";

// ─── Dharmic Loader ───────────────────────────────────────────────────────────
const DharmicLoader = ({ visible }) => {
  const messages = [
    "🙏 Loading your sacred profile...",
    "🕉️ Seeking Mahadev's blessings...",
    "🔱 Preparing your devotee space...",
    "🪔 Almost ready...",
  ];
  const [msgIndex, setMsgIndex] = useState(0);
  React.useEffect(() => {
    if (!visible) return;
    const iv = setInterval(() => setMsgIndex((p) => (p + 1) % messages.length), 1800);
    return () => clearInterval(iv);
  }, [visible]);
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(135deg,rgba(255,237,213,0.93),rgba(254,215,170,0.89),rgba(252,165,165,0.86))", backdropFilter: "blur(16px)" }}>
      <div className="relative flex items-center justify-center mb-8">
        <div className="w-28 h-28 rounded-full border-4 border-orange-200 border-t-orange-500 border-r-orange-400"
          style={{ animation: "spin 1.2s linear infinite" }} />
        <div className="absolute w-20 h-20 rounded-full border-2 border-red-300 border-b-red-500"
          style={{ animation: "spinReverse 1.8s linear infinite" }} />
        <div className="absolute text-4xl" style={{ animation: "pulse 2s ease-in-out infinite" }}>🕉️</div>
      </div>
      <div className="flex gap-2 mb-6">
        {[0,1,2,3,4].map((i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-orange-500"
            style={{ animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite` }} />
        ))}
      </div>
      <p key={msgIndex} className="text-orange-800 font-semibold text-lg text-center px-6"
        style={{ animation: "fadeIn 0.5s ease-in" }}>{messages[msgIndex]}</p>
      <p className="text-orange-600 text-sm mt-2 opacity-70">हर हर महादेव 🔱</p>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes spinReverse{to{transform:rotate(-360deg)}}
        @keyframes bounce{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(-8px);opacity:1}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
      `}</style>
    </div>
  );
};

// ─── Reusable Section Card ────────────────────────────────────────────────────
const SectionCard = ({ children, className = "" }) => (
  <div className={`rounded-2xl p-5 sm:p-6 ${className}`}
    style={{ background: "rgba(255,255,255,0.82)", backdropFilter: "blur(12px)", border: "1px solid rgba(234,88,12,0.14)", boxShadow: "0 2px 20px rgba(234,88,12,0.06)" }}>
    {children}
  </div>
);

const SectionTitle = ({ icon, children, action }) => (
  <div className="flex items-center gap-2 mb-5">
    <span className="text-orange-500">{icon}</span>
    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{children}</h3>
    <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent ml-2" />
    {action}
  </div>
);

// ─── Status helpers ───────────────────────────────────────────────────────────
const getStatusStyle = (status) => {
  const map = {
    paid:     { text: "text-green-700",  bg: "bg-green-50",  border: "border-green-200",  icon: "✅" },
    success:  { text: "text-green-700",  bg: "bg-green-50",  border: "border-green-200",  icon: "✅" },
    failed:   { text: "text-red-700",    bg: "bg-red-50",    border: "border-red-200",    icon: "❌" },
    pending:  { text: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200", icon: "⏳" },
    shipped:  { text: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",   icon: "🚢" },
    "out-for-delivery": { text: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", icon: "🛵" },
    delivered:{ text: "text-green-700",  bg: "bg-green-50",  border: "border-green-200",  icon: "✅" },
    cancelled:{ text: "text-red-700",    bg: "bg-red-50",    border: "border-red-200",    icon: "❌" },
    processing:{ text: "text-orange-700",bg: "bg-orange-50", border: "border-orange-200", icon: "🔄" },
  };
  return map[status?.toLowerCase()] || { text: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200", icon: "📦" };
};

// ─── Main Profile Component ───────────────────────────────────────────────────
function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

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
      const token = localStorage.getItem("mahakalToken");
      if (!token) { navigate("/"); return; }
      try {
        const [profileRes, ordersRes] = await Promise.all([
          axios.get(`${API_URL}/user/profile`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/payment/myorders`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const userData = profileRes.data.user || profileRes.data;
        userData.orders = ordersRes.data.orders || [];
        setUser(userData);
        setEditName(userData.name || "");
        setImagePreview(userData.profileImage || "");
      } catch (err) {
        if (err.response?.status === 401) { localStorage.removeItem("mahakalToken"); navigate("/"); }
        else setError(err.response?.data?.message || "Failed to load profile");
      } finally {
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
    if (!editName.trim()) { setEditError("Name is required"); return; }
    setEditLoading(true); setEditError(""); setEditMessage("");
    const formData = new FormData();
    formData.append("name", editName.trim());
    if (profileImageFile) formData.append("profileImage", profileImageFile);
    try {
      const token = localStorage.getItem("mahakalToken");
      const res = await axios.put(`${API_URL}/user/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        const updated = { ...user, name: res.data.user.name || editName.trim(), profileImage: res.data.user.profileImage || imagePreview };
        setUser(updated);
        localStorage.setItem("mahakalUser", JSON.stringify(updated));
        setEditMessage("Profile updated! 🙏");
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
    setImagePreview(user.profileImage || "");
    setProfileImageFile(null);
    setEditError(""); setEditMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      const token = localStorage.getItem("mahakalToken");
      const res = await axios.delete(`${API_URL}/user/address/delete/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser((prev) => ({ ...prev, addresses: res.data.addresses }));
      toastSuccess("Address deleted");
    } catch { toastError("Failed to delete address"); }
  };

  const totalSpent = user?.orders?.reduce((s, o) => s + (o.amount || 0), 0) || 0;
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  if (loading) return <DharmicLoader visible />;

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(160deg,#fff7ed,#fef3c7,#fee2e2)" }}>
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="text-red-500" size={36} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-500 mb-6 text-sm">{error}</p>
        <button onClick={() => navigate("/")}
          className="px-6 py-3 rounded-xl text-white font-bold text-sm"
          style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)" }}>
          Go Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-12" style={{ background: "linear-gradient(160deg,#fff7ed 0%,#fef3c7 40%,#fee2e2 100%)" }}>

      {/* Top stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 opacity-70" />

      <div className="max-w-5xl mx-auto px-4 pt-8 space-y-6">

        {/* ── Hero Profile Card ── */}
        <SectionCard>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

            {/* Avatar */}
            <div className="relative group flex-shrink-0">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile"
                  className="w-24 h-24 rounded-2xl object-cover shadow-lg"
                  style={{ border: "2px solid rgba(234,88,12,0.25)" }} />
              ) : (
                <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg"
                  style={{ background: "linear-gradient(135deg,#fb923c,#ef4444)" }}>
                  {initials}
                </div>
              )}
              {isEditing && (
                <>
                  <button onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <Upload size={20} className="text-white" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </>
              )}
              {user.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 shadow">
                  <ShieldCheck size={13} className="text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left w-full">
              <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">🕉️ Mahakal Bazaar · Devotee</p>

              {isEditing ? (
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                  className="text-2xl font-bold text-gray-900 mb-2 px-3 py-1.5 rounded-xl border border-orange-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange-300 w-full max-w-sm"
                  autoFocus />
              ) : (
                <h1 className="text-2xl font-black text-gray-900 mb-1">{user.name || "Devotee"}</h1>
              )}

              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500 mb-4">
                <Mail size={14} className="text-orange-400" />
                {user.email}
              </div>

              {/* Stats strip */}
              <div className="flex justify-center sm:justify-start gap-4 mb-5 flex-wrap">
                {[
                  { label: "Orders", value: user.orders?.length || 0, color: "text-orange-600" },
                  // { label: "Total Spent", value: `₹${totalSpent}`, color: "text-green-600" },
                  { label: "Addresses", value: user.addresses?.length || 0, color: "text-blue-600" },
                ].map((stat) => (
                  <div key={stat.label}
                    className="px-4 py-2 rounded-xl text-center"
                    style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(234,88,12,0.12)" }}>
                    <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {isEditing ? (
                  <>
                    <button onClick={handleSaveProfile} disabled={editLoading}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm disabled:opacity-60 transition hover:scale-[1.02]"
                      style={{ background: "linear-gradient(135deg,#16a34a,#15803d)" }}>
                      <Check size={15} /> {editLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button onClick={cancelEdit}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 font-semibold text-sm hover:bg-gray-50 transition">
                      <X size={15} /> Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm transition hover:scale-[1.02]"
                    style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)", boxShadow: "0 4px 14px rgba(234,88,12,0.3)" }}>
                    <Pencil size={15} /> Edit Profile
                  </button>
                )}
              </div>

              {editError && <p className="text-red-500 text-xs mt-2 bg-red-50 px-3 py-1.5 rounded-lg inline-block">{editError}</p>}
              {editMessage && <p className="text-green-600 text-xs mt-2 bg-green-50 px-3 py-1.5 rounded-lg inline-block">{editMessage}</p>}
            </div>
          </div>
        </SectionCard>

        {/* ── Tabs ── */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.75)", border: "1px solid rgba(234,88,12,0.14)" }}>
          <div className="flex overflow-x-auto">
            {[
              { id: "overview", label: "👤 Overview" },
              { id: "orders",   label: `📦 My Orders (${user.orders?.length || 0})` },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-3.5 text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "border-b-2 border-orange-500 text-orange-600 bg-orange-50/50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-orange-50/30"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Personal Info */}
            <SectionCard>
              <SectionTitle icon={<Mail size={16} />}>Personal Information</SectionTitle>
              <div className="space-y-3">
                {[
                  { label: "Full Name", value: user.name || "N/A" },
                  { label: "Email", value: user.email },
                  { label: "Account Status", value: user.isVerified ? "✅ Verified" : "❌ Not Verified",
                    valueClass: user.isVerified ? "text-green-600" : "text-red-500" },
                  { label: "Member Since", value: user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
                      : "N/A" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-orange-50 last:border-0">
                    <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">{row.label}</span>
                    <span className={`text-sm font-semibold text-gray-800 ${row.valueClass || ""}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Addresses */}
            <SectionCard>
              <SectionTitle icon={<MapPin size={16} />} action={
                <button onClick={() => navigate("/address")}
                  className="flex items-center gap-1 text-xs font-bold text-white px-3 py-1.5 rounded-lg transition"
                  style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)" }}>
                  <Plus size={13} /> Add New
                </button>
              }>
                My Addresses
              </SectionTitle>

              {user.addresses?.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {user.addresses.map((addr) => (
                    <div key={addr._id} className="rounded-xl p-4 transition hover:shadow-sm"
                      style={{ background: addr.isDefault ? "linear-gradient(135deg,#fff7ed,#fef3c7)" : "white",
                        border: addr.isDefault ? "1px solid rgba(234,88,12,0.25)" : "1px solid #f3f4f6" }}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{addr.fullName}</p>
                          <p className="text-xs text-gray-500">📞 {addr.phone}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                            {addr.addressType}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                        {addr.houseNumber}, {addr.street}{addr.landmark ? `, ${addr.landmark}` : ""}<br />
                        {addr.townCity}, {addr.state} — {addr.pincode}
                      </p>
                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/address/update/${addr._id}`)}
                          className="flex-1 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition">
                          ✏️ Edit
                        </button>
                        <button onClick={() => handleDeleteAddress(addr._id)}
                          className="flex-1 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition">
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📍</div>
                  <p className="text-sm text-gray-500 mb-3">No addresses added yet</p>
                  <button onClick={() => navigate("/address")}
                    className="px-5 py-2 rounded-xl text-white text-sm font-bold"
                    style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)" }}>
                    Add Address
                  </button>
                </div>
              )}
            </SectionCard>
          </div>
        )}

        {/* ── Orders Tab ── */}
        {activeTab === "orders" && (
          <div>
            {user.orders?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {user.orders.map((order) => {
                  const pay = getStatusStyle(order.paymentStatus);
                  const del = getStatusStyle(order.deliveryStatus);
                  return (
                    <div key={order._id} className="rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5"
                      style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(234,88,12,0.14)", boxShadow: "0 2px 16px rgba(234,88,12,0.06)" }}>

                      {/* Order card top accent */}
                      <div className="h-1 bg-gradient-to-r from-orange-400 to-red-400" />

                      <div className="p-5">
                        {/* Status pills */}
                        <div className="flex justify-between gap-2 mb-4 flex-wrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${pay.bg} ${pay.text} ${pay.border}`}>
                            {pay.icon} {order.paymentStatus}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${del.bg} ${del.text} ${del.border}`}>
                            {del.icon} {order.deliveryStatus}
                          </span>
                        </div>

                        {/* Amount + date */}
                        <div className="mb-4">
                          <p className="text-2xl font-black text-gray-900">₹{order.amount}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            📅 {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                          <p className="text-[10px] font-mono text-orange-400 mt-0.5">#{order._id.slice(-8).toUpperCase()}</p>
                        </div>

                        {/* Product previews */}
                        <div className="space-y-2.5 mb-4">
                          {order.products?.slice(0, 2).map((item) => {
                            const prod = item.product || item;
                            return (
                              <div key={prod._id || item._id} className="flex gap-3 items-center p-2 rounded-xl bg-orange-50/50">
                                <img src={prod.images?.[0]?.url || item.images?.[0]?.url || "/shivmahakal.png"}
                                  alt={prod.name || item.name}
                                  className="w-11 h-11 object-cover rounded-lg flex-shrink-0 border border-orange-100" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-gray-800 truncate">{prod.name || item.name}</p>
                                  <p className="text-[10px] text-gray-500">
                                    ₹{item.price || prod.discountPrice} × {item.quantity}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                          {order.products?.length > 2 && (
                            <p className="text-[10px] text-center text-orange-500 font-semibold">
                              +{order.products.length - 2} more items
                            </p>
                          )}
                        </div>

                        {/* View button */}
                        <button onClick={() => navigate(`/order/${order._id}`)}
                          className="w-full py-2.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition hover:scale-[1.02] active:scale-95"
                          style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)", boxShadow: "0 3px 12px rgba(234,88,12,0.25)" }}>
                          <Eye size={15} /> View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <SectionCard>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-sm text-gray-500 mb-6">Start your divine shopping journey</p>
                  <button onClick={() => navigate("/products")}
                    className="px-8 py-3 rounded-xl text-white font-bold text-sm transition hover:scale-[1.02]"
                    style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)" }}>
                    🛕 Shop Sacred Items
                  </button>
                </div>
              </SectionCard>
            )}
          </div>
        )}

        {/* Bottom stripe */}
        <div className="h-1 rounded-full bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 opacity-30" />
      </div>
    </div>
  );
}

export default Profile;