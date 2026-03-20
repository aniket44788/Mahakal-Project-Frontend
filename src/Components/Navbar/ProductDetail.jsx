import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  toastSuccess, toastError, toastInfo, toastWarning, toastOrderSuccess,
} from "../Toast";
import {
  Star, ShoppingCart, MapPin, Truck, Shield, Award,
  Zap, RefreshCw, X, Loader2, ChevronLeft, ChevronRight,
} from "lucide-react";

// ─── Dharmic Loader ───────────────────────────────────────────────────────────
const DharmicLoader = ({ visible }) => {
  const msgs = ["🙏 Loading sacred product...", "🕉️ Seeking divine details...", "🪔 Almost ready, devotee...", "🔱 Preparing your offering..."];
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const iv = setInterval(() => setI((p) => (p + 1) % msgs.length), 1800);
    return () => clearInterval(iv);
  }, [visible]);
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(135deg,rgba(255,237,213,0.93),rgba(254,215,170,0.89),rgba(252,165,165,0.86))", backdropFilter: "blur(16px)" }}>
      <div className="relative flex items-center justify-center mb-8">
        <div className="w-28 h-28 rounded-full border-4 border-orange-200 border-t-orange-500 border-r-orange-400" style={{ animation: "spin 1.2s linear infinite" }} />
        <div className="absolute w-20 h-20 rounded-full border-2 border-red-300 border-b-red-500" style={{ animation: "spinReverse 1.8s linear infinite" }} />
        <div className="absolute text-4xl" style={{ animation: "pulse 2s ease-in-out infinite" }}>🕉️</div>
      </div>
      <div className="flex gap-2 mb-6">{[0,1,2,3,4].map((n) => (
        <div key={n} className="w-2 h-2 rounded-full bg-orange-500" style={{ animation: `bounce 1.2s ease-in-out ${n*0.15}s infinite` }} />
      ))}</div>
      <p key={i} className="text-orange-800 font-semibold text-lg text-center px-6" style={{ animation: "fadeIn 0.5s ease-in" }}>{msgs[i]}</p>
      <p className="text-orange-600 text-sm mt-2 opacity-70">हर हर महादेव 🔱</p>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}@keyframes spinReverse{to{transform:rotate(-360deg)}}
        @keyframes bounce{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(-8px);opacity:1}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
      `}</style>
    </div>
  );
};

// ─── Address Modal ────────────────────────────────────────────────────────────
const AddressModal = ({ show, onClose, addresses, addressesLoading, selectedAddressId, setSelectedAddressId, onConfirm, productName, navigate }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", border: "1px solid rgba(234,88,12,0.2)" }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(234,88,12,0.12)" }}>
          <div>
            <h2 className="font-bold text-gray-900">Select Delivery Address</h2>
            <p className="text-xs text-orange-500 mt-0.5">🕉️ Where shall we send your sacred item?</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-orange-50 text-gray-400 transition"><X size={18} /></button>
        </div>
        <div className="p-4">
          {productName && <p className="text-xs text-gray-500 mb-3">For: <span className="font-semibold text-gray-800">{productName}</span></p>}
          {addressesLoading ? (
            <div className="text-center py-8"><div className="text-3xl mb-2" style={{ animation: "spin 2s linear infinite" }}>🕉️</div><p className="text-sm text-gray-400">Loading addresses...</p></div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500 mb-4">No addresses found. Please add one to proceed.</p>
              <button onClick={() => { onClose(); navigate("/profile"); }}
                className="px-5 py-2 rounded-xl text-white text-sm font-bold" style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)" }}>
                Add New Address
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-2.5 mb-4 max-h-64 overflow-y-auto pr-1">
                {addresses.map((addr) => (
                  <label key={addr._id}
                    className={`flex items-start gap-3 p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedAddressId === addr._id ? "border-orange-400 bg-orange-50" : "border-gray-100 hover:border-orange-200"}`}>
                    <input type="radio" name="addr" value={addr._id} checked={selectedAddressId === addr._id}
                      onChange={() => setSelectedAddressId(addr._id)} className="mt-1 flex-shrink-0 accent-orange-500" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-gray-900">{addr.fullName}</span>
                        {addr.isDefault && <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">Default</span>}
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{addr.addressType}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{addr.houseNumber}, {addr.street}{addr.landmark ? `, ${addr.landmark}` : ""}</p>
                      <p className="text-xs text-gray-500">{addr.townCity}, {addr.state} — {addr.pincode}</p>
                      <p className="text-xs text-gray-400">📞 {addr.phone}</p>
                    </div>
                  </label>
                ))}
              </div>
              <button onClick={onConfirm} disabled={!selectedAddressId}
                className="w-full py-3 rounded-2xl text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)", boxShadow: "0 4px 14px rgba(234,88,12,0.3)" }}>
                🔱 Confirm & Proceed to Payment
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Review Modal ─────────────────────────────────────────────────────────────
const ReviewModal = ({ show, onClose, rating, setRating, comment, setComment, onSubmit }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", border: "1px solid rgba(234,88,12,0.2)" }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(234,88,12,0.12)", background: "linear-gradient(to bottom,#fff7ed,white)" }}>
          <div>
            <div className="text-2xl mb-1">🙏</div>
            <h2 className="font-bold text-gray-900">Share Your Experience</h2>
            <p className="text-xs text-orange-500">Your review helps fellow devotees</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-orange-50 text-gray-400 transition"><X size={18} /></button>
        </div>
        <div className="p-5">
          <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-3">Your Rating</p>
          <div className="flex justify-center gap-2 mb-5">
            {[1,2,3,4,5].map((star) => (
              <button key={star} onClick={() => setRating(star)}>
                <Star size={32} className={`transition-all hover:scale-110 ${rating >= star ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300 hover:stroke-yellow-300"}`} />
              </button>
            ))}
          </div>
          <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-2">Your Review</p>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this divine product..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-orange-100 bg-white text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-300 transition resize-none mb-4" />
          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
              Cancel
            </button>
            <button onClick={onSubmit} disabled={rating < 1 || !comment.trim()}
              className="flex-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition hover:scale-[1.02]"
              style={{ flex: 2, background: "linear-gradient(135deg,#ea580c,#dc2626)" }}>
              🕉️ Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [buyingProduct, setBuyingProduct] = useState(null);
  const [buyingQuantity, setBuyingQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [userDetails, setUserDetails] = useState({ name: "", email: "", contact: "" });

  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true);
      const token = localStorage.getItem("mahakalToken");
      if (!token) return setAddresses([]);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/profile`, { headers: { Authorization: `Bearer ${token}` } });
      const user = res.data.user || res.data;
      const userAddresses = user?.addresses || [];
      setAddresses(userAddresses);
      setUserDetails({ name: user.fullName || "", email: user.email || "", contact: user.phone || "" });
      const def = userAddresses.find((a) => a.isDefault);
      if (def) setSelectedAddressId(def._id);
    } catch { setAddresses([]); } finally { setAddressesLoading(false); }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/review/allreviews/${id}`);
      setReviews(res.data.reviews || []);
    } catch { setReviews([]); } finally { setReviewsLoading(false); }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/single/${id}`);
        if (res.data.success) setProduct(res.data.product);
      } catch { } finally { setLoading(false); }
    };
    fetchProduct(); fetchReviews();
  }, [id]);
  useEffect(() => { fetchAddresses(); }, []);

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 5.0;
  const ratingCount = reviews.length;
  const discount = product?.discountPrice && product?.price ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const finalPrice = product ? (product.discountPrice || product.price) : 0;

  const getRatingDist = () => {
    const d = {5:0,4:0,3:0,2:0,1:0};
    reviews.forEach((r) => { d[r.rating] = (d[r.rating]||0)+1; });
    return [5,4,3,2,1].map((s) => ({ star: s, perc: ratingCount > 0 ? Math.round((d[s]/ratingCount)*100) : 0 }));
  };

  const formatDate = (ds) => {
    const diff = Math.ceil(Math.abs(new Date() - new Date(ds)) / 86400000);
    if (diff < 1) return "Today"; if (diff === 1) return "1 day ago"; return `${diff} days ago`;
  };

  const loadRazorpay = () => new Promise((res) => {
    if (window.Razorpay) return res(true);
    const s = document.createElement("script"); s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => res(true); s.onerror = () => res(false); document.body.appendChild(s);
  });

  const handlePayment = async (prod, qty, addressId) => {
    if (!prod) return;
    const token = localStorage.getItem("mahakalToken");
    if (!token) { toastWarning("Please login to continue"); navigate("/profile"); return; }
    const ok = await loadRazorpay();
    if (!ok) { toastWarning("Razorpay SDK failed to load."); return; }
    const price = Number(prod.discountPrice) || Number(prod.price);
    const amount = price * qty;
    if (!price || price <= 0) { toastInfo("Invalid product price."); return; }
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, {
        products: [{ product: prod._id, name: prod.name, category: prod.category || "Prasad",
          images: (prod.images||[]).map((i) => ({ url: i.url||i, public_id: i.public_id||i._id })),
          quantity: qty, price, unit: prod.unit || "gm" }],
        amount, currency: "INR", addressId,
      }, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.data.success) throw new Error(res.data.message || "Order creation failed");
      const options = {
        key: import.meta.env.VITE_APP_RAZORPAY,
        amount: res.data.razorpayOrder.amount, currency: res.data.razorpayOrder.currency,
        name: import.meta.env.VITE_APP_NAME || "Mahakal Bazar",
        description: prod.name || "Product Purchase",
        order_id: res.data.razorpayOrder.id,
        handler: async (response) => {
          try {
            const v = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/verify-payment`,
              { razorpayOrderId: response.razorpay_order_id, razorpayPaymentId: response.razorpay_payment_id, signature: response.razorpay_signature },
              { headers: { Authorization: `Bearer ${token}` } });
            if (v.data.success) { toastOrderSuccess(); navigate("/"); }
            else toastWarning("Payment verification failed.");
          } catch { toastError("Payment verification failed."); }
        },
        prefill: { name: userDetails.name, email: userDetails.email, contact: userDetails.contact },
        theme: { color: "#ea580c" },
      };
      new window.Razorpay(options).open();
    } catch (err) { toastError(err.response?.data?.message || err.message || "Payment failed"); }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("mahakalToken");
    if (!token) { toastWarning("Please login to add items to cart"); navigate("/login"); return; }
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/cart/add`, { productId: id }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) toastSuccess("Item added to cart!");
      else toastWarning(res.data.message || "Failed to add item");
    } catch { toastError("Something went wrong!"); }
  };

  const handleSubmitReview = async () => {
    if (reviewRating < 1 || !reviewComment.trim()) { toastWarning("Please provide a rating and comment."); return; }
    const token = localStorage.getItem("mahakalToken");
    if (!token) { toastWarning("Please login to write a review"); navigate("/profile"); return; }
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/review/addreview`,
        { productId: id, rating: reviewRating, comment: reviewComment },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
      if (res.data.success) { toastSuccess("Review submitted!"); setShowReviewModal(false); setReviewRating(5); setReviewComment(""); fetchReviews(); }
      else toastError(res.data.message || "Failed to submit review");
    } catch (err) { toastError(err.response?.data?.message || "Failed to submit review"); }
  };

  if (loading) return <DharmicLoader visible />;
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(160deg,#fff7ed,#fef3c7,#fee2e2)" }}>
      <div className="text-center"><div className="text-5xl mb-4">🛕</div><p className="text-xl font-bold text-gray-700">Product not found.</p></div>
    </div>
  );

  return (
    <>
      <AddressModal show={showAddressModal} onClose={() => setShowAddressModal(false)}
        addresses={addresses} addressesLoading={addressesLoading}
        selectedAddressId={selectedAddressId} setSelectedAddressId={setSelectedAddressId}
        onConfirm={() => { if (!selectedAddressId) { toastWarning("Please select an address."); return; } setShowAddressModal(false); handlePayment(buyingProduct, buyingQuantity, selectedAddressId); }}
        productName={buyingProduct?.name} navigate={navigate} />

      <ReviewModal show={showReviewModal} onClose={() => { setShowReviewModal(false); setReviewRating(5); setReviewComment(""); }}
        rating={reviewRating} setRating={setReviewRating} comment={reviewComment} setComment={setReviewComment} onSubmit={handleSubmitReview} />

      <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#fff7ed 0%,#ffffff 50%,#fff7ed 100%)" }}>
      
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

          {/* Breadcrumb */}
          <nav className="text-xs text-gray-400 flex flex-wrap items-center gap-1.5 mb-6">
            <a href="/" className="hover:text-orange-500 transition">Home</a>
            <span>/</span>
            <a href="/products" className="hover:text-orange-500 transition">Products</a>
            <span>/</span>
            <span className="text-gray-700 font-semibold truncate max-w-[160px]">{product.name}</span>
          </nav>

          {/* ── Product Hero ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-10">

            {/* LEFT: Images */}
            <div className="space-y-3">
              {/* Main image */}
              <div className="relative rounded-3xl overflow-hidden group"
                style={{ aspectRatio: "4/4", background: "rgba(255,255,255,0.9)", border: "1px solid rgba(234,88,12,0.14)", boxShadow: "0 8px 40px rgba(234,88,12,0.1)" }}>
                <img
                  src={product.images?.[selectedImageIndex]?.url || "/shivmahakal.png"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Discount badge */}
                {discount > 0 && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl text-white text-xs font-black"
                    style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)", boxShadow: "0 3px 12px rgba(234,88,12,0.4)" }}>
                    🔥 SAVE {discount}%
                  </div>
                )}
                {/* Dot indicators */}
                {product.images?.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-2 rounded-full"
                    style={{ background: "rgba(255,255,255,0.3)", backdropFilter: "blur(8px)" }}>
                    {product.images.map((_, idx) => (
                      <button key={idx} onClick={() => setSelectedImageIndex(idx)}
                        className={`rounded-full transition-all duration-300 ${idx === selectedImageIndex ? "w-6 h-2 bg-orange-500" : "w-2 h-2 bg-white/70 hover:bg-white"}`} />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button key={idx} onClick={() => setSelectedImageIndex(idx)}
                      className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden transition-all duration-200"
                      style={{
                        border: idx === selectedImageIndex ? "2px solid #ea580c" : "2px solid rgba(234,88,12,0.12)",
                        opacity: idx === selectedImageIndex ? 1 : 0.65,
                        boxShadow: idx === selectedImageIndex ? "0 0 0 2px rgba(234,88,12,0.2)" : "none",
                      }}>
                      <img src={img.url} alt={`View ${idx+1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Info */}
            <div className="flex flex-col gap-5">
              {/* Stock pill */}
              <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full text-xs font-bold text-orange-700"
                style={{ background: "rgba(255,247,237,0.9)", border: "1px solid rgba(234,88,12,0.2)" }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                ✓ In Stock & Ready to Ship
              </div>

              {/* Title */}
              <div>
                <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">🕉️ Mahakal Bazar · Sacred Item</p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight">{product.name}</h1>
                {product.tagline && <p className="text-sm text-orange-600 font-semibold mt-1">{product.tagline}</p>}
              </div>

              {/* Rating mini */}
              {ratingCount > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex">{[1,2,3,4,5].map((s) => (
                    <Star key={s} size={15} className={s <= Math.round(avgRating) ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300"} />
                  ))}</div>
                  <span className="text-sm font-bold text-gray-700">{avgRating}</span>
                  <span className="text-xs text-gray-400">({ratingCount} reviews)</span>
                </div>
              )}

              {/* Price card */}
              <div className="rounded-2xl p-5"
                style={{ background: "linear-gradient(135deg,#fff7ed,#fef3c7)", border: "1px solid rgba(234,88,12,0.2)", boxShadow: "0 4px 20px rgba(234,88,12,0.08)" }}>
                <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">Today's Price</p>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl font-black text-orange-600">₹{finalPrice}</span>
                  {product.discountPrice && (
                    <>
                      <span className="text-xl text-gray-400 line-through font-bold">₹{product.price}</span>
                      <span className="text-sm font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-lg border border-green-200">
                      Save ₹{(product.price - product.discountPrice).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
                {!product.discountPrice && <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>}
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "📋 Size", value: product.size || "N/A" },
                  { label: "⚖️ Weight", value: product.weight ? `${product.weight}g` : "N/A" },
                  { label: "🏷️ Category", value: product.category || "N/A" },
                  { label: "🌿 Material", value: product.material || "Natural" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl p-3"
                    style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(234,88,12,0.12)" }}>
                    <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Quantity + Total */}
              <div className="flex items-center justify-between p-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(234,88,12,0.14)" }}>
                <div>
                  <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wide mb-2">Quantity</p>
                  <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: "#fff7ed" }}>
                    <button onClick={() => quantity > 1 && setQuantity(q => q-1)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-lg hover:bg-white transition text-gray-700 hover:text-orange-600">−</button>
                    <span className="w-10 text-center font-black text-gray-900">{quantity}</span>
                    <button onClick={() => setQuantity(q => q+1)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-lg hover:bg-white transition text-gray-700 hover:text-orange-600">+</button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wide mb-1">Grand Total</p>
                  <p className="text-3xl font-black text-gray-900">₹{finalPrice * quantity}</p>
                  <p className="text-[10px] text-gray-400">incl. all taxes</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3">
                {product.isAvailable && (
                  <button onClick={handleAddToCart}
                    className="h-14 rounded-2xl font-black text-sm border-2 border-gray-900 text-gray-900 flex items-center justify-center gap-2 hover:bg-gray-900 hover:text-white transition-all duration-300 hover:-translate-y-0.5">
                    <ShoppingCart size={17} /> ADD TO CART
                  </button>
                )}
                <button onClick={() => { setBuyingProduct(product); setBuyingQuantity(quantity); setShowAddressModal(true); }}
                  disabled={!product.isAvailable}
                  className={`h-14 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 ${!product.isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                  style={{ background: product.isAvailable ? "linear-gradient(135deg,#ea580c,#dc2626)" : "#9ca3af", boxShadow: product.isAvailable ? "0 6px 20px rgba(234,88,12,0.35)" : "none", gridColumn: product.isAvailable ? "auto" : "span 2" }}>
                  {product.isAvailable ? <><Zap size={17} /> BUY NOW</> : "OUT OF STOCK"}
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-xs text-gray-500 border-t border-orange-50">
                {[{ icon: <Truck size={13} className="text-orange-500" />, label: "Free Shipping" },
                  { icon: <Shield size={13} className="text-orange-500" />, label: "2 Year Warranty" },
                  { icon: <RefreshCw size={13} className="text-orange-500" />, label: "30 Day Returns" }].map((b) => (
                  <div key={b.label} className="flex items-center gap-1.5">{b.icon}{b.label}</div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Description & Shipping ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

            {/* Description */}
            <div className="rounded-3xl p-6 sm:p-8"
              style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(234,88,12,0.14)", boxShadow: "0 2px 20px rgba(234,88,12,0.06)" }}>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-orange-500">📖</span>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Product Description</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent ml-2" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6"
                style={{ borderLeft: "3px solid #ea580c", paddingLeft: "14px", fontStyle: "italic" }}>
                {product.description || "This sacred product is carefully prepared following traditional methods and blessed with divine energy."}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <Award size={20} className="text-orange-600" />, title: "Quality Assured", desc: "Premium ingredients & traditional methods for authentic purity.", bg: "from-orange-50 to-amber-50", border: "border-orange-100" },
                  { icon: <Shield size={20} className="text-green-600" />, title: "Blessed & Sacred", desc: "Prepared with utmost devotion following ancient traditions.", bg: "from-green-50 to-emerald-50", border: "border-green-100" },
                ].map((c) => (
                  <div key={c.title} className={`p-4 rounded-2xl bg-gradient-to-br ${c.bg} border ${c.border}`}>
                    <div className="mb-2">{c.icon}</div>
                    <p className="font-bold text-gray-900 text-sm mb-1">{c.title}</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="rounded-3xl p-6 sm:p-8"
              style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(234,88,12,0.14)", boxShadow: "0 2px 20px rgba(234,88,12,0.06)" }}>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-orange-500">🚚</span>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Shipping & Returns</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent ml-2" />
              </div>
              <div className="space-y-3 mb-5">
                {[
                  { icon: <Truck size={16} className="text-green-600" />, title: "Free Delivery", desc: "On orders above ₹500 across India", bg: "bg-green-50", border: "border-green-200" },
                  { icon: <MapPin size={16} className="text-blue-600" />, title: "Pan India Delivery", desc: "We deliver to all states & cities", bg: "bg-blue-50", border: "border-blue-200" },
                  { icon: <Shield size={16} className="text-orange-600" />, title: "Secure Packaging", desc: "Safe, hygienic & spiritual packaging", bg: "bg-orange-50", border: "border-orange-200" },
                ].map((s) => (
                  <div key={s.title} className={`flex items-center gap-3 p-3 rounded-xl ${s.bg} border ${s.border}`}>
                    {s.icon}
                    <div>
                      <p className="text-xs font-bold text-gray-900">{s.title}</p>
                      <p className="text-xs text-gray-500">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl p-4 space-y-2.5"
                style={{ background: "linear-gradient(135deg,#fff7ed,#fef3c7)", border: "1px solid rgba(234,88,12,0.2)" }}>
                <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-3">📋 Policy</p>
                {[
                  { icon: "✓", text: "Online payment only — No Cash on Delivery.", color: "text-orange-600" },
                  { icon: "✓", text: "Prashad can be collected from temple or pickup points.", color: "text-orange-600" },
                  { icon: "✓", text: "Refunds only if payment deducted but order fails.", color: "text-orange-600" },
                  { icon: "!", text: "Returns not accepted for perishable sacred Prashad.", color: "text-red-500" },
                ].map((p, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                    <span className={`${p.color} font-black flex-shrink-0`}>{p.icon}</span>
                    <span>{p.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Reviews ── */}
          <div className="rounded-3xl p-6 sm:p-8"
            style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(234,88,12,0.14)", boxShadow: "0 2px 20px rgba(234,88,12,0.06)" }}>

            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-orange-500">⭐</span>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Customer Reviews</h2>
                <div className="h-px w-16 bg-gradient-to-r from-orange-200 to-transparent" />
              </div>
              <button onClick={() => setShowReviewModal(true)}
                className="px-5 py-2.5 rounded-xl text-white font-bold text-sm transition hover:scale-[1.02] active:scale-95"
                style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)", boxShadow: "0 4px 14px rgba(234,88,12,0.3)" }}>
                🙏 Write Review
              </button>
            </div>

            {reviewsLoading ? (
              <div className="text-center py-10">
                <Loader2 className="animate-spin mx-auto h-8 w-8 text-orange-500" />
                <p className="mt-2 text-sm text-gray-400">Loading reviews...</p>
              </div>
            ) : ratingCount === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">🌸</div>
                <p className="font-bold text-gray-700">No reviews yet</p>
                <p className="text-sm text-gray-400 mt-1">Be the first to share your divine experience!</p>
              </div>
            ) : (
              <>
                {/* Summary */}
                <div className="rounded-2xl p-5 mb-6"
                  style={{ background: "linear-gradient(135deg,#fff7ed,#fef3c7)", border: "1px solid rgba(234,88,12,0.18)" }}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="text-center">
                      <p className="text-5xl font-black text-orange-600">{avgRating}</p>
                      <div className="flex justify-center gap-0.5 my-2">
                        {[1,2,3,4,5].map((s) => <Star key={s} size={18} className={s <= Math.round(avgRating) ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300"} />)}
                      </div>
                      <p className="text-xs text-gray-500">{ratingCount} reviews</p>
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      {getRatingDist().map(({ star, perc }) => (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-3">{star}</span>
                          <Star size={12} className="fill-yellow-400 stroke-yellow-400 flex-shrink-0" />
                          <div className="flex-1 h-2 rounded-full bg-orange-100 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all" style={{ width: `${perc}%` }} />
                          </div>
                          <span className="text-xs text-gray-400 w-8 text-right">{perc}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Individual reviews */}
                <div className="space-y-4">
                  {reviews.map((review) => {
                    const name = review.user?.name || "Anonymous";
                    return (
                      <div key={review._id} className="p-4 sm:p-5 rounded-2xl transition hover:shadow-md"
                        style={{ border: "1px solid rgba(234,88,12,0.1)", background: "linear-gradient(135deg,#fffbf5,white)" }}>
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base flex-shrink-0"
                            style={{ background: "linear-gradient(135deg,#fb923c,#ef4444)" }}>
                            {name[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-bold text-gray-900 text-sm">{name}</p>
                              {review.verified && (
                                <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">✓ Verified</span>
                              )}
                              <span className="text-[10px] text-gray-400 ml-auto">{formatDate(review.createdAt)}</span>
                            </div>
                            <div className="flex gap-0.5 mt-1">
                              {[1,2,3,4,5].map((s) => <Star key={s} size={13} className={s <= review.rating ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300"} />)}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="h-1 rounded-full bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 opacity-30 mt-8" />
        </div>
      </div>
    </>
  );
}

export default ProductDetails;