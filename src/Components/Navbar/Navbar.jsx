import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Gift,
  Landmark,
  Library,
  Phone,
  User as UserIcon,
  Menu,
  X,
  LogOut,
  ShoppingCart,
  Mail,
  Lock,
  ChevronRight,
  AlignHorizontalDistributeCenter,
  LucideAlignHorizontalDistributeEnd,
  ExternalLink,
} from "lucide-react";
import { FaBlog } from "react-icons/fa";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authStep, setAuthStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfile = () => setShowProfile((prev) => !prev);
  const goToProfile = () => {
    setShowProfile(false);
    navigate("/profile");
  };
  const goToCart = () => {
    setIsOpen(false);
    navigate("/cart");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("mahakalUser");
    const savedToken = localStorage.getItem("mahakalToken");
    if (savedUser && savedToken) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      const token = localStorage.getItem("mahakalToken");
      if (!token || !user) return;
      try {
        const res = await fetch(`${API_URL}/cart/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.success)
          setCartCount(data.cartCount || data.cart?.length || 0);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };
    if (user) fetchCartCount();
  }, [user, API_URL]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`${API_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        setMessage("OTP sent to your email!");
        setAuthStep("otp");
      } else setError(data.message || "Failed to send OTP");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`${API_URL}/user/verifyOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("mahakalUser", JSON.stringify(data.user));
        localStorage.setItem("mahakalToken", data.token);
        setShowAuthModal(false);
        setAuthStep("email");
        setEmail("");
        setOtp("");
        setMessage("Logged in successfully!");
      } else setError(data.message || "Invalid OTP");
    } catch (err) {
      setError("Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCartCount(0);
    localStorage.removeItem("mahakalUser");
    localStorage.removeItem("mahakalToken");
    setShowProfile(false);
    setShowAuthModal(false);
    setIsOpen(false);
  };

  const closeModal = () => {
    setShowAuthModal(false);
    setAuthStep("email");
    setEmail("");
    setOtp("");
    setError("");
    setMessage("");
  };

  const navLinks = [
    { to: "/", icon: <Home size={20} />, label: "Home" },
    { to: "/products", icon: <Gift size={20} />, label: "Products" },
    { to: "/temples", icon: <Landmark size={20} />, label: "Temples" },
    { to: "/donation", icon: <Library size={20} />, label: "Donation" },
    { to: "/about", icon: <ExternalLink size={20} />, label: "About" },
    { to: "/blogs", icon: <FaBlog size={20} />, label: "Blogs" },
  ];

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/shivmahakal.png"
              alt="Logo"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-orange-200"
            />
            <span className="text-lg font-bold text-orange-600 tracking-tight">
              Mahakal Bazaar
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1 text-gray-700 font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-all text-sm"
              >
                {link.icon} {link.label}
              </Link>
            ))}
          </ul>

          {/* Desktop actions */}
          <div
            className="hidden md:flex items-center gap-3 relative"
            ref={profileRef}
          >
            {/* Cart */}
            <button
              onClick={goToCart}
              className="relative p-2 hover:bg-orange-50 rounded-xl transition"
            >
              <ShoppingCart className="text-orange-600 w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {!user ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-5 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-md shadow-orange-200 transition-all"
              >
                <Mail size={16} /> Sign In
              </button>
            ) : (
              <button
                onClick={toggleProfile}
                className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 pl-1 pr-3 py-1 rounded-xl transition"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white text-xs font-bold">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {user.name?.split(" ")[0]}
                </span>
              </button>
            )}

            {/* Desktop Profile Dropdown */}
            {showProfile && user && (
              <div className="absolute top-full right-0 mt-3 w-72 bg-white border border-orange-100 shadow-2xl shadow-orange-100 rounded-2xl z-50 overflow-hidden">
                {/* Profile header */}
                <div className="px-5 pt-5 pb-4 bg-gradient-to-br from-orange-50 to-red-50">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                        🔱 Devotee
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 space-y-1">
                  <button
                    onClick={goToProfile}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-orange-50 transition group"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <UserIcon size={16} className="text-orange-500" /> My
                      Profile
                    </span>
                    <ChevronRight
                      size={14}
                      className="text-gray-400 group-hover:text-orange-400 transition"
                    />
                  </button>
                  <button
                    onClick={goToCart}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-orange-50 transition group"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <ShoppingCart size={16} className="text-orange-500" /> My
                      Cart
                      {cartCount > 0 && (
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                          {cartCount}
                        </span>
                      )}
                    </span>
                    <ChevronRight
                      size={14}
                      className="text-gray-400 group-hover:text-orange-400 transition"
                    />
                  </button>
                </div>

                <div className="border-t border-orange-100 p-3">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold transition"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile right side */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={goToCart}
              className="relative p-2 hover:bg-orange-50 rounded-xl transition"
            >
              <ShoppingCart className="text-orange-600 w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-xl hover:bg-orange-50 transition text-gray-700"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16" />

      {/* ── Mobile Drawer Backdrop ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Mobile Drawer ── */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] max-w-sm z-50 md:hidden flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background:
            "linear-gradient(160deg, #fff7ed 0%, #fef3c7 50%, #fee2e2 100%)",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-orange-100">
          <div className="flex items-center gap-2">
            <img
              src="/shivmahakal.png"
              alt="Logo"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-200"
            />
            <span className="font-bold text-orange-600">Mahakal Bazaar</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-orange-100 text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {/* User card (if logged in) */}
          {user ? (
            <div
              className="rounded-2xl p-4 mb-2"
              style={{
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(234,88,12,0.2)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xl font-bold shadow">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                    🔱 Devotee
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  goToProfile();
                  setIsOpen(false);
                }}
                className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <UserIcon size={15} /> View My Profile
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setShowAuthModal(true);
                setIsOpen(false);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
            >
              <Mail size={16} /> Sign In to your account
            </button>
          )}

          {/* Nav links */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(234,88,12,0.12)",
            }}
          >
            {navLinks.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3.5 hover:bg-orange-50 transition ${
                  i < navLinks.length - 1 ? "border-b border-orange-50" : ""
                }`}
              >
                <span className="flex items-center gap-3 text-gray-700 font-medium text-sm">
                  <span className="text-orange-500">{link.icon}</span>
                  {link.label}
                </span>
                <ChevronRight size={16} className="text-gray-300" />
              </Link>
            ))}
          </div>

          {/* Cart row */}
          <button
            onClick={goToCart}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition hover:bg-orange-100"
            style={{
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(234,88,12,0.12)",
            }}
          >
            <span className="flex items-center gap-3 text-gray-700 font-medium text-sm">
              <ShoppingCart size={20} className="text-orange-500" />
              My Cart
            </span>
            <div className="flex items-center gap-2">
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </button>
        </div>

        {/* ── Bottom: Logout pinned ── */}
        {user && (
          <div className="px-4 pb-6 pt-3 border-t border-orange-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold text-sm transition active:scale-95"
            >
              <LogOut size={17} /> Sign Out
            </button>
            <p className="text-center text-xs text-orange-400 mt-3">
              हर हर महादेव 🔱
            </p>
          </div>
        )}

        {/* Bottom branding if not logged in */}
        {!user && (
          <div className="px-4 pb-6 pt-3">
            <p className="text-center text-xs text-orange-400">
              हर हर महादेव 🔱
            </p>
          </div>
        )}
      </div>

      {/* ── Auth Modal ── */}
      {showAuthModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(234,88,12,0.2)",
            }}
          >
            {/* Modal header */}
            <div
              className="px-6 pt-6 pb-4 text-center border-b border-orange-100"
              style={{
                background: "linear-gradient(to bottom, #fff7ed, white)",
              }}
            >
              <div className="text-3xl mb-2">🕉️</div>
              <h2 className="text-xl font-bold text-gray-900">
                {authStep === "email"
                  ? "Welcome, Devotee"
                  : "Verify Your Identity"}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {authStep === "email"
                  ? "Sign in to Mahakal Bazaar"
                  : `OTP sent to ${email}`}
              </p>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-orange-100 text-gray-400 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              {authStep === "email" ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        size={17}
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-orange-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                  {error && (
                    <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">
                      {error}
                    </p>
                  )}
                  {message && (
                    <p className="text-green-600 text-xs bg-green-50 px-3 py-2 rounded-lg">
                      {message}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                    style={{
                      background: "linear-gradient(135deg,#ea580c,#dc2626)",
                      boxShadow: "0 4px 16px rgba(234,88,12,0.3)",
                    }}
                  >
                    {loading ? "Sending OTP..." : "🔱 Send OTP"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-2">
                      6-Digit OTP
                    </label>
                    <input
                      type="text"
                      maxLength="6"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                      className="w-full py-3 rounded-xl border border-orange-200 bg-white text-xl font-bold text-center tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
                      placeholder="······"
                      required
                    />
                  </div>
                  {error && (
                    <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">
                      {error}
                    </p>
                  )}
                  {message && (
                    <p className="text-green-600 text-xs bg-green-50 px-3 py-2 rounded-lg">
                      {message}
                    </p>
                  )}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setAuthStep("email")}
                      className="flex-1 py-3 rounded-xl border border-orange-200 text-gray-700 text-sm font-semibold hover:bg-orange-50 transition"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:scale-[1.02] disabled:opacity-60"
                      style={{
                        background: "linear-gradient(135deg,#ea580c,#dc2626)",
                        flex: 2,
                      }}
                    >
                      {loading ? "Verifying..." : "🕉️ Verify OTP"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
