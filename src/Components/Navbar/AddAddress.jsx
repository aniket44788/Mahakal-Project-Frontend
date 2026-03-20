import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toastSuccess, toastWarning } from "../Toast";

// ─── Dharmic Saving Loader ────────────────────────────────────────────────────
const DharmicLoader = ({ visible }) => {
  const messages = [
    "🙏 Offering your address to Mahadev...",
    "🕉️ Blessing your delivery location...",
    "🪔 Securing your sacred details...",
    "🔱 Almost done, devotee...",
  ];

  const [msgIndex, setMsgIndex] = useState(0);

  React.useEffect(() => {
    if (!visible) return;
    setMsgIndex(0);
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 1600);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,237,213,0.93), rgba(254,215,170,0.89), rgba(252,165,165,0.86))",
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
            style={{ animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite` }}
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
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
};

// ─── Field Component ──────────────────────────────────────────────────────────
const Field = ({ label, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-orange-700 uppercase tracking-widest">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
  </div>
);

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-orange-100 bg-white/80 text-gray-800 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all duration-200";

// ─── Main Component ───────────────────────────────────────────────────────────
function AddAddress() {
  const navigate = useNavigate();
  const token = localStorage.getItem("mahakalToken");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    alternatePhone: "",
    houseNumber: "",
    street: "",
    landmark: "",
    townCity: "",
    state: "",
    pincode: "",
    addressType: "Home",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/user/address`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toastSuccess("Address added successfully!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      toastWarning("Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DharmicLoader visible={loading} />

      <div
        className="min-h-screen py-10 px-4"
        style={{
          background: "linear-gradient(160deg, #fff7ed 0%, #fef3c7 40%, #fee2e2 100%)",
        }}
      >
        {/* Decorative top strip */}
        <div className="h-1 w-full max-w-3xl mx-auto rounded-full bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 mb-8 opacity-70" />

        <div className="w-full max-w-3xl mx-auto">

          {/* ── Header card ── */}
          <div
            className="rounded-2xl p-6 mb-6 flex items-center gap-5"
            style={{
              background: "rgba(255,255,255,0.65)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(234,88,12,0.18)",
              boxShadow: "0 4px 24px rgba(234,88,12,0.08)",
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#fb923c,#ef4444)" }}
            >
              📍
            </div>
            <div>
              <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-0.5">
                🕉️ Mahakal Bazar
              </p>
              <h1 className="text-2xl font-bold text-gray-900">Add Delivery Address</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Where shall we send your sacred offerings?
              </p>
            </div>
            <button
              onClick={() => navigate("/profile")}
              className="ml-auto text-gray-400 hover:text-orange-500 transition p-2 rounded-xl hover:bg-orange-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ── Personal Details ── */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.72)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(234,88,12,0.15)",
                boxShadow: "0 2px 16px rgba(234,88,12,0.06)",
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="text-base">👤</span>
                <h3 className="text-xs font-bold text-orange-600 uppercase tracking-widest">
                  Personal Details
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent ml-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Full Name" required>
                  <input
                    className={inputClass}
                    name="fullName"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </Field>

                <Field label="Phone Number" required>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                      +91
                    </span>
                    <input
                      className={`${inputClass} pl-12`}
                      name="phone"
                      placeholder="10-digit mobile"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={10}
                      required
                    />
                  </div>
                </Field>

                <Field label="Alternate Phone">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                      +91
                    </span>
                    <input
                      className={`${inputClass} pl-12`}
                      name="alternatePhone"
                      placeholder="Optional"
                      value={formData.alternatePhone}
                      onChange={handleChange}
                      maxLength={10}
                    />
                  </div>
                </Field>
              </div>
            </div>

            {/* ── Address Details ── */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.72)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(234,88,12,0.15)",
                boxShadow: "0 2px 16px rgba(234,88,12,0.06)",
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="text-base">🏠</span>
                <h3 className="text-xs font-bold text-orange-600 uppercase tracking-widest">
                  Address Details
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent ml-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="House / Flat No" required>
                  <input
                    className={inputClass}
                    name="houseNumber"
                    placeholder="e.g. 42-B, Flat 3"
                    value={formData.houseNumber}
                    onChange={handleChange}
                    required
                  />
                </Field>

                <Field label="Street / Area" required>
                  <input
                    className={inputClass}
                    name="street"
                    placeholder="Street name or locality"
                    value={formData.street}
                    onChange={handleChange}
                    required
                  />
                </Field>

                <Field label="Landmark">
                  <input
                    className={inputClass}
                    name="landmark"
                    placeholder="Near temple, school..."
                    value={formData.landmark}
                    onChange={handleChange}
                  />
                </Field>

                <Field label="City" required>
                  <input
                    className={inputClass}
                    name="townCity"
                    placeholder="Your city"
                    value={formData.townCity}
                    onChange={handleChange}
                    required
                  />
                </Field>

                <Field label="State" required>
                  <input
                    className={inputClass}
                    name="state"
                    placeholder="Your state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </Field>

                <Field label="Pincode" required>
                  <input
                    className={inputClass}
                    name="pincode"
                    placeholder="6-digit pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    required
                  />
                </Field>
              </div>

              {/* Address Type */}
              <div className="mt-6">
                <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-3">
                  Address Type <span className="text-red-400">*</span>
                </p>
                <div className="flex gap-3 flex-wrap">
                  {[
                    { value: "Home", icon: "🏠", label: "Home" },
                    { value: "Work", icon: "🏢", label: "Work" },
                    { value: "Other", icon: "📍", label: "Other" },
                  ].map((type) => (
                    <label
                      key={type.value}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 cursor-pointer transition-all duration-200 text-sm font-semibold select-none ${
                        formData.addressType === type.value
                          ? "border-orange-400 bg-orange-50 text-orange-700 shadow-sm"
                          : "border-gray-200 bg-white text-gray-600 hover:border-orange-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="addressType"
                        value={type.value}
                        checked={formData.addressType === type.value}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                      {formData.addressType === type.value && (
                        <span className="text-orange-500">✓</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Action Buttons ── */}
            <div className="flex justify-end gap-3 pb-6">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="px-6 py-3 rounded-xl border border-gray-200 bg-white/80 text-gray-600 font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl text-white font-bold text-sm shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #ea580c, #dc2626)",
                  boxShadow: "0 4px 16px rgba(234,88,12,0.35)",
                }}
              >
                🔱 Save Address
              </button>
            </div>
          </form>
        </div>

        {/* Decorative bottom strip */}
        <div className="h-1 w-full max-w-3xl mx-auto rounded-full bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 mt-2 opacity-40" />
      </div>
    </>
  );
}

export default AddAddress;