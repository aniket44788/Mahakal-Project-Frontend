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
  ChevronRight,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";

// ─── Dharmic Loader ───────────────────────────────────────────────────────────
const DharmicLoader = ({ visible }) => {
  const messages = [
    "🙏 Fetching your sacred order...",
    "🔱 Seeking blessings of Mahadev...",
    "🕉️ Loading divine details...",
    "🪔 Almost ready, devotee...",
  ];
  const [msgIndex, setMsgIndex] = useState(0);

  React.useEffect(() => {
    if (!visible) return;
    const interval = setInterval(
      () => setMsgIndex((p) => (p + 1) % messages.length),
      1800,
    );
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg,rgba(255,237,213,0.93),rgba(254,215,170,0.89),rgba(252,165,165,0.86))",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="relative flex items-center justify-center mb-8">
        <div
          className="w-28 h-28 rounded-full border-4 border-orange-200 border-t-orange-500 border-r-orange-400"
          style={{ animation: "spin 1.2s linear infinite" }}
        />
        <div
          className="absolute w-20 h-20 rounded-full border-2 border-red-300 border-b-red-500"
          style={{ animation: "spinReverse 1.8s linear infinite" }}
        />
        <div
          className="absolute text-4xl"
          style={{ animation: "pulse 2s ease-in-out infinite" }}
        >
          🕉️
        </div>
      </div>
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
      <p
        key={msgIndex}
        className="text-orange-800 font-semibold text-lg text-center px-6"
        style={{ animation: "fadeIn 0.5s ease-in" }}
      >
        {messages[msgIndex]}
      </p>
      <p className="text-orange-600 text-sm mt-2 opacity-70">हर हर महादेव 🔱</p>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes spinReverse { to { transform: rotate(-360deg); } }
        @keyframes bounce { 0%,100%{transform:translateY(0);opacity:0.5} 50%{transform:translateY(-8px);opacity:1} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
      `}</style>
    </div>
  );
};

// ─── Orders Modal ─────────────────────────────────────────────────────────────
function OrdersModal({ isOpen, onClose, orders }) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
    >
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-orange-100">
        <div className="sticky top-0 bg-white border-b border-orange-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">All Orders</h2>
            <p className="text-xs text-orange-500 mt-0.5">
              🔱 {orders.length} order{orders.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-orange-50 rounded-xl transition text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-72px)] p-4 space-y-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-2xl p-4 border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all"
              style={{ background: "linear-gradient(135deg,#fff7ed,#fef9f5)" }}
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-base font-bold text-orange-600">
                    ₹{order.amount}
                  </span>
                  <div className="flex gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus === "paid" ? (
                        <CheckCircle size={10} />
                      ) : (
                        <Clock size={10} />
                      )}
                      {order.paymentStatus}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.deliveryStatus === "delivered"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {order.deliveryStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-orange-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {order.products.slice(0, 3).map((p, i) => (
                      <img
                        key={i}
                        src={p.images[0]?.url}
                        alt={p.name}
                        className="w-7 h-7 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                    {order.products.length > 3 && (
                      <div className="w-7 h-7 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center">
                        <span className="text-[9px] font-bold text-orange-600">
                          +{order.products.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {order.products.length} item
                    {order.products.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <button
                  onClick={() =>
                    (window.location.href = `/orders/${order._id}`)
                  }
                  className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-0.5"
                >
                  View <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ icon, label, value, color }) => {
  const colors = {
    green: "bg-green-50 text-green-700 border-green-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return (
    <div
      className={`px-4 py-2 rounded-xl flex items-center gap-2 border text-sm font-medium ${colors[color]}`}
    >
      {icon}
      <span className="text-xs opacity-70">{label}:</span>
      <span className="capitalize font-bold">{value}</span>
    </div>
  );
};

// ─── Section Card ─────────────────────────────────────────────────────────────
const SectionCard = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl p-5 sm:p-6 ${className}`}
    style={{
      background: "rgba(255,255,255,0.82)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(234,88,12,0.14)",
      boxShadow: "0 2px 20px rgba(234,88,12,0.06)",
    }}
  >
    {children}
  </div>
);

const SectionTitle = ({ icon, children }) => (
  <div className="flex items-center gap-2 mb-5">
    <span className="text-orange-500">{icon}</span>
    <h3 className="text-base font-bold text-gray-900">{children}</h3>
    <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent ml-2" />
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const token = localStorage.getItem("mahakalToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, allOrdersRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}/api/payment/myorders/${orderId}`,
            { headers: { Authorization: `Bearer ${token}` } },
          ),
          axios.get(`${import.meta.env.VITE_API_URL}/api/payment/myorders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setOrder(orderRes.data.order);
        setAllOrders(allOrdersRes.data.orders || []);
        try {
          const userRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/user/profile`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          setUserDetails(userRes.data.user);
        } catch (_) {}
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orderId, token]);

  if (loading) return <DharmicLoader visible />;

  if (error || !order) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: "linear-gradient(160deg,#fff7ed,#fef3c7,#fee2e2)",
        }}
      >
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="text-red-500" size={36} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            {error || "This order doesn't exist"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl text-white font-bold text-sm"
            style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)" }}
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const totalSpent = allOrders.reduce((s, o) => s + o.amount, 0);

  return (
    <>
      <DharmicLoader visible={false} />
      <OrdersModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        orders={allOrders}
      />

      <div
        className="min-h-screen"
        style={{
          background:
            "linear-gradient(160deg,#fff7ed 0%,#fef3c7 40%,#fee2e2 100%)",
        }}
      >
        {/* ── Sticky Header ── */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-orange-50 rounded-xl transition text-orange-600"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-sm font-bold text-gray-900 leading-tight">
                  Order Details
                </h1>
                <p className="text-[11px] text-orange-500">
                  #{order._id.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOrdersModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-orange-700 border border-orange-200 bg-orange-50 hover:bg-orange-100 transition"
            >
              📦 All Orders
              <span className="bg-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold">
                {allOrders.length}
              </span>
            </button>
          </div>
        </div>

        {/* ── Page content ── */}
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          {/* Top stripe */}
          <div className="h-1 rounded-full bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 opacity-60" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Left column ── */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Summary */}
              <SectionCard>
                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white shadow-md">
                        <Package size={22} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">
                          🕉️ Mahakal Bazaar
                        </p>
                        <h2 className="text-lg font-bold text-gray-900">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h2>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                      <Calendar size={13} className="text-orange-400" />
                      {formatDate(order.createdAt)}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge
                        icon={<CreditCard size={14} />}
                        label="Payment"
                        value={order.paymentStatus}
                        color={
                          order.paymentStatus === "paid" ? "green" : "yellow"
                        }
                      />
                      <StatusBadge
                        icon={<Truck size={14} />}
                        label="Delivery"
                        value={order.deliveryStatus}
                        color={
                          order.deliveryStatus === "delivered"
                            ? "blue"
                            : "purple"
                        }
                      />
                    </div>
                  </div>

                  {/* Amount box */}
                  <div
                    className="rounded-2xl p-5 flex flex-col justify-center items-center text-center min-w-[160px]"
                    style={{
                      background: "linear-gradient(135deg,#fff7ed,#fee2e2)",
                      border: "1px solid rgba(234,88,12,0.18)",
                    }}
                  >
                    <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">
                      Total Amount
                    </p>
                    <p className="text-4xl font-black text-gray-900">
                      ₹{order.amount}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {order.currency} · All taxes incl.
                    </p>
                  </div>
                </div>
              </SectionCard>

              {/* Products */}
              <SectionCard>
                <SectionTitle icon={<Package size={18} />}>
                  Ordered Items
                  <span className="ml-2 text-xs font-normal text-gray-400">
                    ({order.products.length} item
                    {order.products.length !== 1 ? "s" : ""})
                  </span>
                </SectionTitle>
                <div className="space-y-5">
                  {order.products.map((item) => (
                    <div
                      key={item._id}
                      className="rounded-2xl p-5 border border-orange-100 hover:border-orange-300 hover:shadow-lg transition-all bg-white"
                    >
                      <div className="flex flex-col sm:flex-row gap-5">
                        {/* 🔥 Bigger Image */}
                        <img
                          src={item.images?.[0]?.url}
                          alt={item.name}
                          className="w-full sm:w-40 h-44 sm:h-40 object-cover rounded-xl border border-orange-100 flex-shrink-0"
                          onError={(e) => {
                            e.target.src = "/shivmahakal.png";
                          }}
                        />

                        {/* 📦 Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          {/* Top Section */}
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">
                                {item.name}
                              </h4>

                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                                  {item.category}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {item.unit}
                                </span>
                              </div>
                            </div>

                            {/* 💰 Price */}
                            <div className="text-right">
                              <p className="text-2xl font-black text-orange-600">
                                ₹{item.price * item.quantity}
                              </p>
                              <p className="text-xs text-gray-400">
                                ₹{item.price} × {item.quantity}
                              </p>
                            </div>
                          </div>

                          {/* 📊 Stats Section */}
                          <div className="grid grid-cols-4 gap-3 mt-4">
                            {[
                              { label: "Price", value: `₹${item.price}` },
                              { label: "Qty", value: item.quantity },
                              {
                                label: "Total",
                                value: `₹${item.price * item.quantity}`,
                              },
                              {
                                label: "Status",
                                value: "✓ Confirmed",
                                green: true,
                              },
                            ].map((stat) => (
                              <div
                                key={stat.label}
                                className="bg-orange-50 rounded-xl p-3 text-center border border-orange-100"
                              >
                                <p className="text-[11px] text-gray-400 mb-1">
                                  {stat.label}
                                </p>
                                <p
                                  className={`text-sm font-bold ${
                                    stat.green
                                      ? "text-green-600"
                                      : "text-gray-800"
                                  }`}
                                >
                                  {stat.value}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>

            {/* ── Right column ── */}
            <div className="space-y-5">
              {/* Delivery Address */}
              <SectionCard>
                <SectionTitle icon={<MapPin size={18} />}>
                  Delivery Address
                </SectionTitle>

                <div
                  className="rounded-2xl p-4 mb-4"
                  style={{
                    background: "linear-gradient(135deg,#eff6ff,#eef2ff)",
                    border: "1px solid #bfdbfe",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <User size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {order.address.fullName}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
                        <Phone size={11} /> {order.address.phone}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 text-sm">
                  {[
                    {
                      label: "Address",
                      value: `${order.address.houseNumber}, ${order.address.street}${order.address.landmark ? ` — ${order.address.landmark}` : ""}`,
                    },
                    { label: "City", value: order.address.townCity },
                    { label: "State", value: order.address.state },
                    { label: "Pincode", value: order.address.pincode },
                  ].map((row) => (
                    <div key={row.label} className="flex items-start gap-3">
                      <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wide min-w-[52px] mt-0.5">
                        {row.label}
                      </span>
                      <span className="text-gray-700 leading-snug">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* User Stats (if available) */}
              {userDetails && (
                <SectionCard>
                  <SectionTitle icon={<User size={18} />}>
                    Your Profile
                  </SectionTitle>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-lg font-bold">
                      {userDetails.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {userDetails.name || userDetails.email?.split("@")[0]}
                      </p>
                      <p className="text-[10px] text-orange-500 font-bold">
                        🔱 Devotee · #{userDetails._id?.slice(-6)}
                      </p>
                    </div>
                  </div>

                  {userDetails.email && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <Mail size={13} className="text-orange-400" />{" "}
                      {userDetails.email}
                    </div>
                  )}
                  {userDetails.phone && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                      <Phone size={13} className="text-orange-400" />{" "}
                      {userDetails.phone}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className="rounded-xl p-3 text-center"
                      style={{
                        background: "linear-gradient(135deg,#fff7ed,#fef3c7)",
                        border: "1px solid rgba(234,88,12,0.15)",
                      }}
                    >
                      <p className="text-2xl font-black text-orange-600">
                        {allOrders.length}
                      </p>
                      <p className="text-[10px] text-gray-500 font-medium">
                        Total Orders
                      </p>
                    </div>
                    <div
                      className="rounded-xl p-3 text-center"
                      style={{
                        background: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
                        border: "1px solid #bbf7d0",
                      }}
                    >
                      <p className="text-2xl font-black text-green-600">
                        ₹{totalSpent}
                      </p>
                      <p className="text-[10px] text-gray-500 font-medium">
                        Total Spent
                      </p>
                    </div>
                  </div>
                </SectionCard>
              )}

              {/* Order Info */}
              <SectionCard>
                <SectionTitle icon={<CreditCard size={18} />}>
                  Order Info
                </SectionTitle>
                <div className="space-y-3">
                  {[
                    {
                      label: "Order ID",
                      value: order._id.slice(-10).toUpperCase(),
                      mono: true,
                    },
                    { label: "Currency", value: order.currency },
                    {
                      label: "Placed On",
                      value: new Date(order.createdAt).toLocaleDateString(
                        "en-IN",
                      ),
                    },
                    {
                      label: "Updated",
                      value: new Date(order.updatedAt).toLocaleDateString(
                        "en-IN",
                      ),
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between items-center py-2 border-b border-orange-50 last:border-0"
                    >
                      <span className="text-xs text-gray-400 font-medium">
                        {row.label}
                      </span>
                      <span
                        className={`text-xs font-bold text-gray-800 ${row.mono ? "font-mono" : ""}`}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          </div>

          {/* Bottom stripe */}
          <div className="h-1 rounded-full bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 opacity-30" />
        </div>
      </div>
    </>
  );
}

export default OrderDetails;
