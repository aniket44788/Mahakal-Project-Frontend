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
} from "lucide-react";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authStep, setAuthStep] = useState("email"); // "email" or "otp"
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const profileRef = useRef(null);
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;

    // Toggle functions
    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleProfile = () => setShowProfile((prev) => !prev);

    const goToProfile = () => {
        setShowProfile(false);
        navigate("/profile");
    };

    const goToCart = () => {
        navigate("/cart");
    };

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem("mahakalUser");
        const savedToken = localStorage.getItem("mahakalToken");
        if (savedUser && savedToken) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // Fetch cart count when user is logged in
    useEffect(() => {
        const fetchCartCount = async () => {
            const token = localStorage.getItem("mahakalToken");
            if (!token || !user) return;

            try {
                const res = await fetch(`${API_URL}/cart/get`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                const data = await res.json();
                if (data.success) {
                    setCartCount(data.cartCount || data.cart?.length || 0);
                }
            } catch (err) {
                console.error("Error fetching cart:", err);
            }
        };

        if (user) fetchCartCount();
    }, [user, API_URL]);

    // Close profile dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Send OTP to email
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
            const res = await fetch(`${import.meta.env.VITE_API_URL}/user/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (data.success || res.ok) {
                setMessage("OTP sent to your email!");
                setAuthStep("otp");
            } else {
                setError(data.message || "Failed to send OTP");
            }
        } catch (err) {
            setError("Network error. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP
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
            } else {
                setError(data.message || "Invalid OTP");
            }
        } catch (err) {
            setError("Verification failed. Try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const handleLogout = () => {
        setUser(null);
        setCartCount(0);
        localStorage.removeItem("mahakalUser");
        localStorage.removeItem("mahakalToken");
        setShowProfile(false);
        setShowAuthModal(false);
    };

    // Close modal
    const closeModal = () => {
        setShowAuthModal(false);
        setAuthStep("email");
        setEmail("");
        setOtp("");
        setError("");
        setMessage("");
    };

    return (
        <>
            <nav className="bg-white shadow-md fixed w-full top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-20 sm:px-6 py-3 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <img
                            src="/shivmahakal.png"
                            alt="Logo"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="text-xl font-bold text-orange-600">
                            Mahakal Bazaar
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
                        <Link to="/" className="hover:text-orange-500 flex items-center gap-1">
                            <Home size={18} /> Home
                        </Link>
                        <Link to="/products" className="hover:text-orange-500 flex items-center gap-1">
                            <Gift size={18} /> Products
                        </Link>
                        <Link to="/temples" className="hover:text-orange-500 flex items-center gap-1">
                            <Landmark size={18} /> Temples
                        </Link>
                        <Link to="/donation" className="hover:text-orange-500 flex items-center gap-1">
                            <Library size={18} /> Donation
                        </Link>
                    </ul>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4 relative">
                        {/* Cart */}
                        <button
                            onClick={goToCart}
                            className="relative p-2 hover:bg-orange-50 rounded-full transition"
                        >
                            <ShoppingCart className="text-orange-600 w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Login / Profile */}
                        {!user ? (
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-md font-medium flex items-center gap-2"
                            >
                                <Mail size={18} /> Sign In
                            </button>
                        ) : (
                            <button
                                onClick={toggleProfile}
                                className="bg-orange-100 hover:bg-orange-200 p-2 rounded-full transition flex items-center gap-2"
                            >
                                <UserIcon className="text-orange-600 w-8 h-6" />
                                <span className="font-medium text-gray-700">{user.name}</span>
                            </button>
                        )}

                        {/* Profile Dropdown */}
                        {showProfile && user && (
                            <div
                                ref={profileRef}
                                className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg rounded-md z-50"
                            >
                                <div className="p-4 text-center">
                                    <img
                                        src={user.profileImage || "/shivmahakal.png"}
                                        alt="Profile"
                                        className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                                    />
                                    <h3 className="font-semibold text-gray-800">{user.name}</h3>
                                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                                    <button
                                        onClick={goToProfile}
                                        className="mt-2 w-full py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium rounded-md"
                                    >
                                        View Profile
                                    </button>
                                </div>
                                <hr />
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 hover:bg-orange-50 text-red-600 font-medium rounded-b-md"
                                >
                                    <LogOut size={18} /> Logout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center space-x-3">
                        <button className="text-orange-600 p-2" onClick={toggleMenu}>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Sidebar */}
                {isOpen && (
                    <div className="md:hidden bg-white shadow-inner">
                        <ul className="flex flex-col py-4 space-y-2 text-gray-700 font-medium">
                            <Link to="/" onClick={toggleMenu} className="px-4 py-2 hover:bg-orange-50 flex items-center gap-2">
                                <Home size={20} /> Home
                            </Link>
                            <Link to="/products" onClick={toggleMenu} className="px-4 py-2 hover:bg-orange-50 flex items-center gap-2">
                                <Gift size={20} /> Products
                            </Link>
                            <Link to="/temples" onClick={toggleMenu} className="px-4 py-2 hover:bg-orange-50 flex items-center gap-2">
                                <Landmark size={20} /> Temples
                            </Link>
                            <Link to="/donation" onClick={toggleMenu} className="px-4 py-2 hover:bg-orange-50 flex items-center gap-2">
                                <Library size={20} /> Donation
                            </Link>

                            <hr className="my-2" />

                            <button
                                onClick={() => {
                                    goToCart();
                                    toggleMenu();
                                }}
                                className="mx-4 px-4 py-2 bg-orange-50 hover:bg-orange-100 rounded-md flex items-center justify-between gap-2"
                            >
                                <span className="flex items-center gap-2 text-orange-700 font-medium">
                                    <ShoppingCart size={20} /> My Cart
                                </span>
                                {cartCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            <hr className="my-2" />

                            {!user ? (
                                <button
                                    onClick={() => {
                                        setShowAuthModal(true);
                                        toggleMenu();
                                    }}
                                    className="mx-4 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-md font-medium"
                                >
                                    Sign In with Email
                                </button>
                            ) : (
                                <div className="px-4 pb-4">
                                    <p className="font-semibold mb-1">{user.name}</p>
                                    <p className="text-xs mb-3 truncate">{user.email}</p>
                                    <button
                                        onClick={() => {
                                            goToProfile();
                                            toggleMenu();
                                        }}
                                        className="w-full py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded mb-2"
                                    >
                                        View Profile
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            toggleMenu();
                                        }}
                                        className="w-full py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </ul>
                    </div>
                )}
            </nav>

            {/* Spacer */}
            <div className="h-20"></div>

            {/* Auth Modal */}
            {showAuthModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4
                bg-black/20 backdrop-blur-md">


                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-orange-600">
                                {authStep === "email" ? "Sign In" : "Verify OTP"}
                            </h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>

                        {authStep === "email" ? (
                            <form onSubmit={handleSendOtp}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
                                {message && <p className="text-green-600 text-sm mb-3">{message}</p>}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-md disabled:opacity-70"
                                >
                                    {loading ? "Sending..." : "Send OTP"}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Enter 6-digit OTP sent to {email}
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            maxLength="6"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-center text-lg tracking-wider"
                                            placeholder="______"
                                            required
                                        />
                                    </div>
                                </div>

                                {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
                                {message && <p className="text-green-600 text-sm mb-3">{message}</p>}

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setAuthStep("email")}
                                        className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-md"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-md disabled:opacity-70"
                                    >
                                        {loading ? "Verifying..." : "Verify OTP"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;