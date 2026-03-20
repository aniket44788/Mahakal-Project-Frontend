import { useState } from "react";
import { FaInstagram, FaWhatsapp, FaFacebook } from "react-icons/fa";
import axios from "axios";
import { toastSuccess } from "../Toast";

export default function HomeFooter() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");
    const token = localStorage.getItem("mahakalToken");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/email`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      if (res.data.success) {
        setResponseMsg("🙏 Message sent! We'll respond soon.");
        toastSuccess("Your message has been sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      }
    } catch {
      setResponseMsg("Failed to send. Please try again.");
    }
    setLoading(false);
  };

  const quickLinks = [
    { href: "/privacypolicy",      label: "Privacy Policy" },
    { href: "/termscondition",     label: "Terms & Conditions" },
    { href: "/RefundReturnPolicy", label: "Refund & Return Policy" },
    { href: "/ShippingPolicy",     label: "Shipping Policy" },
    { href: "/ContactUs",          label: "Contact Us" },
  ];

  const inputClass =
    "w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
  ;

  return (
    <footer
      className="relative overflow-hidden mt-16"
      style={{
        background: "linear-gradient(160deg,#fff7ed 0%,#ffffff 50%,#fff7ed 100%)",
        borderTop: "1px solid rgba(234,88,12,0.12)",
      }}
    >
      {/* Decorative top border */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 opacity-80" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ea580c 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top glow */}
      <div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(234,88,12,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">

          {/* ── Brand ── */}
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#fb923c,#ef4444)" }}
              >
                🕉️
              </div>
              <div>
                <p className="text-gray-900 font-black text-lg leading-tight">Mahakal Bazar</p>
                <p className="text-orange-500 text-xs font-semibold">Divine Essentials</p>
              </div>
            </div>

            <p className="text-orange-700 text-sm leading-relaxed mb-4 italic font-semibold">
              "आपकी श्रद्धा, हमारी जिम्मेदारी"
            </p>

            <p className="text-gray-500 text-xs leading-relaxed mb-6">
              Delivering sacred puja items, rudraksha, and divine offerings straight to your doorstep with devotion.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {[
                { href: "https://instagram.com", icon: <FaInstagram size={16} />, color: "#e1306c", bg: "rgba(225,48,108,0.12)", border: "rgba(225,48,108,0.25)", label: "Instagram" },
                { href: "https://wa.me/918351927365", icon: <FaWhatsapp size={16} />, color: "#25d366", bg: "rgba(37,211,102,0.12)", border: "rgba(37,211,102,0.25)", label: "WhatsApp" },
                { href: "https://facebook.com", icon: <FaFacebook size={16} />, color: "#1877f2", bg: "rgba(24,119,242,0.12)", border: "rgba(24,119,242,0.25)", label: "Facebook" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  title={s.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-orange-400 text-sm">🔱</span>
              <h3 className="text-gray-900 font-bold text-sm uppercase tracking-widest">Quick Links</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-orange-500/40 to-transparent ml-2" />
            </div>

            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-2.5 text-gray-600 hover:text-orange-600 text-sm transition-all duration-200"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-orange-500/50 group-hover:bg-orange-400 transition-all group-hover:scale-125 flex-shrink-0"
                    />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Contact info */}
            <div
              className="mt-8 rounded-2xl p-4"
              style={{ background: "rgba(234,88,12,0.1)", border: "1px solid rgba(234,88,12,0.2)" }}
            >
              <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-3">📞 Contact</p>
              <a
                href="tel:+918351927365"
                className="text-gray-900 font-bold text-base hover:text-orange-600 transition block mb-1"
              >
                +91 83519 27365
              </a>
              <p className="text-gray-400 text-xs">Mon – Sat · 9 AM – 7 PM IST</p>
            </div>
          </div>

          {/* ── Contact Form ── */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-orange-400 text-sm">✉️</span>
              <h3 className="text-gray-900 font-bold text-sm uppercase tracking-widest">Write to Us</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-orange-500/40 to-transparent ml-2" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className={inputClass}
                style={{ background: "white", border: "1px solid rgba(234,88,12,0.2)", color: "#1f2937" }}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className={inputClass}
                style={{ background: "white", border: "1px solid rgba(234,88,12,0.2)", color: "#1f2937" }}
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={3}
                required
                className={inputClass}
                style={{ background: "white", border: "1px solid rgba(234,88,12,0.2)", color: "#1f2937", resize: "none" }}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  background: loading ? "rgba(234,88,12,0.4)" : "linear-gradient(135deg,#ea580c,#dc2626)",
                  boxShadow: loading ? "none" : "0 4px 16px rgba(234,88,12,0.35)",
                }}
              >
                {loading ? "🕉️ Sending..." : "🔱 Send Message"}
              </button>

              {responseMsg && (
                <p className={`text-xs font-semibold px-3 py-2 rounded-lg ${
                  responseMsg.includes("Failed")
                    ? "text-red-600 bg-red-50 border border-red-200"
                    : "text-green-700 bg-green-50 border border-green-200"
                }`}>
                  {responseMsg}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          className="my-10 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(234,88,12,0.4), transparent)" }}
        />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <p className="text-gray-400 text-xs">
            © 2025 Mahakal Bazar — All Rights Reserved.
          </p>
          <p className="text-orange-500 text-xs font-bold tracking-widest">
            🕉️ हर हर महादेव 🔱
          </p>
          <p className="text-gray-300 text-xs">
            Made with 🙏 in India
          </p>
        </div>
      </div>

      {/* Placeholder styles for dark input text placeholders */}
      <style>{`
        footer input::placeholder,
        footer textarea::placeholder {
          color: rgba(156,163,175,0.7);
        }
        footer input:focus,
        footer textarea:focus {
          border-color: rgba(234,88,12,0.45) !important;
          box-shadow: 0 0 0 3px rgba(234,88,12,0.08);
        }
      `}</style>
    </footer>
  );
}