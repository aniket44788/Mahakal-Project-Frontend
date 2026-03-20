import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toastError, toastInfo, toastSuccess, toastWarning, toastOrderSuccess } from "../Toast";
import { X, ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";

// ─── Dharmic Loader ───────────────────────────────────────────────────────────
const DharmicLoader = ({ visible }) => {
  const msgs = ["🙏 Loading sacred prasad...", "🕉️ Preparing divine offerings...", "🪔 Almost ready, devotee...", "🔱 Mahadev's blessings incoming..."];
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
const AddressModal = ({ show, onClose, addresses, loading, selectedId, setSelectedId, onConfirm, productName, navigate }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "rgba(255,255,255,0.97)", border: "1px solid rgba(234,88,12,0.2)" }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(234,88,12,0.12)" }}>
          <div>
            <h2 className="font-bold text-gray-900">Select Delivery Address</h2>
            <p className="text-xs text-orange-500 mt-0.5">🕉️ Where shall we send your sacred item?</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-orange-50 text-gray-400 transition"><X size={18} /></button>
        </div>
        <div className="p-4">
          {productName && <p className="text-xs text-gray-500 mb-3">For: <span className="font-semibold text-gray-800">{productName}</span></p>}
          {loading ? (
            <div className="text-center py-8"><div className="text-3xl mb-2" style={{ animation: "spin 2s linear infinite" }}>🕉️</div><p className="text-sm text-gray-400">Loading addresses...</p></div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">📍</div>
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
                      selectedId === addr._id ? "border-orange-400 bg-orange-50" : "border-gray-100 hover:border-orange-200"}`}>
                    <input type="radio" name="addr" value={addr._id} checked={selectedId === addr._id}
                      onChange={() => setSelectedId(addr._id)} className="mt-1 flex-shrink-0 accent-orange-500" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-bold text-sm text-gray-900">{addr.fullName}</span>
                        {addr.isDefault && <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">Default</span>}
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{addr.addressType}</span>
                      </div>
                      <p className="text-xs text-gray-500">{addr.houseNumber}, {addr.street}{addr.landmark ? `, ${addr.landmark}` : ""}</p>
                      <p className="text-xs text-gray-500">{addr.townCity}, {addr.state} — {addr.pincode}</p>
                      <p className="text-xs text-gray-400">📞 {addr.phone}</p>
                    </div>
                  </label>
                ))}
              </div>
              <button onClick={onConfirm} disabled={!selectedId}
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

// ─── Product Detail Modal ─────────────────────────────────────────────────────
const ProductModal = ({ product, onClose, onBuy }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  if (!product) return null;
  const total = (product.templePrasadDiscountPrice * qty).toFixed(2);
  const discount = Math.round(((product.templePrasadPrice - product.templePrasadDiscountPrice) / product.templePrasadPrice) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)" }}>
      <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl"
        style={{ background: "rgba(255,255,255,0.97)", border: "1px solid rgba(234,88,12,0.18)" }}>

        {/* Modal header */}
        <div className="sticky top-0 z-10 px-5 py-4 flex items-center justify-between border-b"
          style={{ borderColor: "rgba(234,88,12,0.12)", background: "linear-gradient(to bottom,#fff7ed,white)" }}>
          <div>
            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">🕉️ Mahakal Bazar · Temple Prasad</p>
            <h2 className="font-bold text-gray-900 text-sm sm:text-base mt-0.5">{product.templePrasadTitle}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-orange-50 text-gray-400 transition flex-shrink-0"><X size={18} /></button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Images */}
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden aspect-square"
                style={{ border: "1px solid rgba(234,88,12,0.14)" }}>
                <img src={product.templeImages[imgIdx]?.url} alt={product.templePrasadTitle}
                  className="w-full h-full object-cover" />
                {discount > 0 && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl text-white text-[10px] font-black"
                    style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)" }}>
                    🔥 {discount}% OFF
                  </div>
                )}
                {product.templeImages.length > 1 && (
                  <>
                    <button onClick={() => setImgIdx((p) => (p - 1 + product.templeImages.length) % product.templeImages.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-white/90 hover:bg-white transition shadow-md">
                      <ChevronLeft size={16} className="text-gray-700" />
                    </button>
                    <button onClick={() => setImgIdx((p) => (p + 1) % product.templeImages.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-white/90 hover:bg-white transition shadow-md">
                      <ChevronRight size={16} className="text-gray-700" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full text-white text-[10px] font-bold"
                  style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
                  {imgIdx + 1}/{product.templeImages.length}
                </div>
              </div>

              {/* Thumbnails */}
              {product.templeImages.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {product.templeImages.slice(0, 5).map((img, idx) => (
                    <button key={idx} onClick={() => setImgIdx(idx)}
                      className="aspect-square rounded-xl overflow-hidden transition-all"
                      style={{ border: idx === imgIdx ? "2px solid #ea580c" : "2px solid rgba(234,88,12,0.12)", opacity: idx === imgIdx ? 1 : 0.6 }}>
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-4">
              {/* Location */}
              <div className="flex items-start gap-2 text-sm text-gray-500">
                <MapPin size={14} className="text-orange-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs leading-snug">{product.templeAddress}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">{[1,2,3,4,5].map((s) => (
                  <Star key={s} size={14} className={s <= product.templePrasadRating ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300"} />
                ))}</div>
                <span className="text-xs text-gray-400">({product.templePrasadRating}/5)</span>
              </div>

              {/* Price */}
              <div className="rounded-2xl p-4" style={{ background: "linear-gradient(135deg,#fff7ed,#fef3c7)", border: "1px solid rgba(234,88,12,0.2)" }}>
                <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">Price</p>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-black text-orange-600">₹{product.templePrasadDiscountPrice}</span>
                  {product.templePrasadPrice > product.templePrasadDiscountPrice && (
                    <>
                      <span className="text-lg text-gray-400 line-through">₹{product.templePrasadPrice}</span>
                      <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-lg border border-green-200">
                        Save ₹{product.templePrasadPrice - product.templePrasadDiscountPrice}
                        
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed px-4 py-3 rounded-xl italic"
                style={{ background: "rgba(255,247,237,0.8)", borderLeft: "3px solid #ea580c" }}>
                {product.templePrasadDescription}
              </p>

              {/* Materials */}
              {product.templePrasadMaterial?.length > 0 && (
                <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(234,88,12,0.12)" }}>
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-2">📋 What's Included</p>
                  <ul className="space-y-1.5">
                    {product.templePrasadMaterial.map((m, i) => (
                      <li key={i} className="text-xs text-gray-700 flex items-center gap-2">
                        <span className="text-orange-500 font-black">✓</span>{m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity + Total */}
              <div className="flex items-center justify-between p-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(234,88,12,0.14)" }}>
                <div>
                  <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wide mb-2">Quantity</p>
                  <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: "#fff7ed" }}>
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-lg hover:bg-white transition text-gray-700 hover:text-orange-600">−</button>
                    <span className="w-10 text-center font-black text-gray-900">{qty}</span>
                    <button onClick={() => setQty((q) => q + 1)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-lg hover:bg-white transition text-gray-700 hover:text-orange-600">+</button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wide mb-1">Grand Total</p>
                  <p className="text-3xl font-black text-gray-900">₹{total}</p>
                </div>
              </div>

              {/* Buy button */}
              <button onClick={() => { onClose(); onBuy(product, qty); }}
                className="w-full py-3.5 rounded-2xl text-white font-black text-sm transition hover:scale-[1.02] active:scale-95"
                style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)", boxShadow: "0 6px 20px rgba(234,88,12,0.35)" }}>
                🔱 Buy Now · ₹{total}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ product, onDetails, onBuy }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const discount = Math.round(((product.templePrasadPrice - product.templePrasadDiscountPrice) / product.templePrasadPrice) * 100);

  return (
    <div className="group flex flex-col rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ background: "rgba(255,255,255,0.88)", border: "1px solid rgba(234,88,12,0.13)", boxShadow: "0 2px 16px rgba(234,88,12,0.06)" }}>

      {/* Image */}
      <div className="relative overflow-hidden cursor-pointer" style={{ background: "linear-gradient(135deg,#fff7ed,#fef9f5)" }}
        onClick={() => onDetails(product._id)}>
        <img src={product.templeImages[imgIdx]?.url} alt={product.templePrasadTitle}
          className="w-full h-48 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-105" />

        {/* Top accent on hover */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl text-white text-[10px] font-black"
            style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)", boxShadow: "0 2px 8px rgba(234,88,12,0.4)" }}>
            🔥 {discount}% OFF
          </div>
        )}

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-white text-[10px] font-bold"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
          <Star size={10} className="fill-yellow-400 stroke-yellow-400" />
          {product.templePrasadRating}
        </div>

        {/* Image nav arrows */}
        {product.templeImages.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); setImgIdx((p) => (p - 1 + product.templeImages.length) % product.templeImages.length); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-white">
              <ChevronLeft size={14} className="text-gray-700" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setImgIdx((p) => (p + 1) % product.templeImages.length); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-white">
              <ChevronRight size={14} className="text-gray-700" />
            </button>
          </>
        )}

        {/* Image counter */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-full text-white text-[9px] font-bold"
          style={{ background: "rgba(0,0,0,0.5)" }}>
          {imgIdx + 1}/{product.templeImages.length}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4">
        {/* Location */}
        <div className="flex items-start gap-1.5 text-orange-500 text-[10px] font-semibold mb-2 truncate">
          <MapPin size={11} className="flex-shrink-0 mt-0.5" />
          <span className="truncate">{product.templeAddress}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 flex-1">{product.templePrasadTitle}</h3>

        {/* Description */}
        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-3">{product.templePrasadDescription}</p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-black text-orange-600">₹{product.templePrasadDiscountPrice}</span>
          {product.templePrasadPrice > product.templePrasadDiscountPrice && (
            <span className="text-xs text-gray-400 line-through">₹{product.templePrasadPrice}</span>
          )}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button onClick={() => onDetails(product._id)}
            className="h-10 rounded-xl text-xs font-bold border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-200">
            Details
          </button>
          <button onClick={() => onBuy(product, 1)}
            className="h-10 rounded-xl text-xs font-black text-white transition-all duration-200 hover:scale-[1.03]"
            style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)", boxShadow: "0 3px 10px rgba(234,88,12,0.3)" }}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
function DashboardProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [buyingProduct, setBuyingProduct] = useState(null);
  const [buyingQuantity, setBuyingQuantity] = useState(1);

  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true);
      const token = localStorage.getItem("mahakalToken");
      if (!token) return setAddresses([]);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/profile`, { headers: { Authorization: `Bearer ${token}` } });
      const user = res.data.user || res.data;
      const list = user?.addresses || [];
      setAddresses(list);
      const def = list.find((a) => a.isDefault);
      if (def) setSelectedAddressId(def._id);
    } catch { setAddresses([]); } finally { setAddressesLoading(false); }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/product/get`);
      if (res.data.success) setProducts(res.data.data);
      else setError(res.data.message);
    } catch { setError("Failed to fetch temple products"); } finally { setLoading(false); }
  };

  const fetchProductById = async (id) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/product/get/${id}`);
      if (res.data.success) setSelectedProduct(res.data.data);
    } catch (err) { console.error("Error fetching product details:", err); }
  };

  useEffect(() => { fetchAddresses(); fetchProducts(); }, []);

  const loadRazorpay = () => new Promise((res) => {
    if (window.Razorpay) return res(true);
    const s = document.createElement("script"); s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => res(true); s.onerror = () => res(false); document.body.appendChild(s);
  });

  const handlePayment = async (product, qty, addressId) => {
    const token = localStorage.getItem("mahakalToken");
    if (!token) { navigate("/"); return; }
    const ok = await loadRazorpay();
    if (!ok) { toastError("Razorpay SDK failed to load."); return; }
    const price = product.templePrasadDiscountPrice;
    const amount = price * qty;
    if (amount < 1) { toastWarning("Amount must be at least ₹1."); return; }
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, {
        products: [{ product: product._id, name: product.templePrasadTitle, category: product.category || "Prasad",
          images: product.templeImages.map((i) => ({ url: i.url, public_id: i.public_id || i._id })),
          quantity: qty, price, unit: product.unit || "gm" }],
        amount, currency: "INR", addressId,
      }, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.data.success) throw new Error(res.data.message);
      const options = {
        key: import.meta.env.VITE_APP_RAZORPAY,
        amount: res.data.razorpayOrder.amount, currency: res.data.razorpayOrder.currency,
        name: "Mahakal Bazar", description: product.templePrasadTitle,
        order_id: res.data.razorpayOrder.id,
        handler: async (response) => {
          try {
            const v = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/verify-payment`,
              { razorpayOrderId: response.razorpay_order_id, razorpayPaymentId: response.razorpay_payment_id, signature: response.razorpay_signature },
              { headers: { Authorization: `Bearer ${token}` } });
            if (v.data.success) toastOrderSuccess();
            else toastWarning("Payment verification failed. Please contact support.");
          } catch { toastWarning("Payment verification failed."); }
        },
        prefill: { name: "", email: "", contact: "" },
        theme: { color: "#ea580c" },
      };
      new window.Razorpay(options).open();
    } catch { toastWarning("Payment failed. An unexpected error occurred."); }
  };

  const initiateBuy = (product, qty) => {
    setBuyingProduct(product); setBuyingQuantity(qty); setShowAddressModal(true);
  };

  const handleConfirmAddress = async () => {
    if (!selectedAddressId) { toastInfo("Please select a delivery address."); return; }
    setShowAddressModal(false);
    await handlePayment(buyingProduct, buyingQuantity, selectedAddressId);
  };

  if (loading) return <DharmicLoader visible />;

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(160deg,#fff7ed,#fef3c7,#fee2e2)" }}>
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">😔</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load</h2>
        <p className="text-sm text-gray-500 mb-6">{error}</p>
        <button onClick={fetchProducts}
          className="px-6 py-3 rounded-xl text-white font-bold text-sm"
          style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)" }}>
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <>
      <DharmicLoader visible={false} />

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onBuy={initiateBuy} />

      <AddressModal show={showAddressModal} onClose={() => setShowAddressModal(false)}
        addresses={addresses} loading={addressesLoading}
        selectedId={selectedAddressId} setSelectedId={setSelectedAddressId}
        onConfirm={handleConfirmAddress}
        productName={buyingProduct?.templePrasadTitle} navigate={navigate} />

      <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#fff7ed 0%,#ffffff 50%,#fff7ed 100%)" }}>
      
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-xs font-bold text-orange-500 uppercase tracking-[0.2em] mb-2">🕉️ Mahakal Bazar · Temple Prasad</p>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
              Sacred{" "}
              <span style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Temple Offerings
              </span>
            </h1>
            <p className="text-sm text-gray-400">{products.length} divine prasad item{products.length !== 1 ? "s" : ""} available</p>
          </div>

          {/* Grid */}
          {products.length === 0 ? (
            <div className="text-center py-20 rounded-3xl"
              style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(234,88,12,0.12)" }}>
              <div className="text-5xl mb-4">🛕</div>
              <p className="font-bold text-gray-700 mb-1">No prasad items found</p>
              <p className="text-sm text-gray-400">Check back soon for divine offerings</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {products.map((product) => (
                <ProductCard key={product._id} product={product}
                  onDetails={fetchProductById} onBuy={initiateBuy} />
              ))}
            </div>
          )}

          <div className="h-1 rounded-full bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 opacity-30 mt-10" />
        </div>
      </div>
    </>
  );
}

export default DashboardProducts;