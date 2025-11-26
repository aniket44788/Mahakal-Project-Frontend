import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";


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
} from "lucide-react";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const profileRef = useRef(null);
    const navigate = useNavigate();

    // Toggle functions
    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleProfile = () => setShowProfile((prev) => !prev);

    // Navigate to profile page
    const goToProfile = () => {
        setShowProfile(false);
        navigate("/profile");
    };

    // Navigate to cart
    const goToCart = () => {
        navigate("/cart");
    };

    // Persist user login with localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem("mahakalUser");
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    // Fetch cart count
    useEffect(() => {
        const fetchCartCount = async () => {
            const token = localStorage.getItem("mahakalToken");
            if (!token) return;

            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/cart/get`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                const data = await res.json();
                if (data.success) {
                    setCartCount(data.cartCount || data.cart.length || 0);
                }

            } catch (err) {
                console.error("Error fetching cart:", err);
            }
        };

        if (user) {
            fetchCartCount();
        }
    }, [user]);

    // Close profile dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLoginSuccess = async ({ credential }) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/user/google/token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken: credential }),
                credentials: "include",
            });
            const data = await res.json();
            console.log("Login response:", data);
            if (data.success) {
                setUser(data.user);
                localStorage.setItem("mahakalUser", JSON.stringify(data.user));
                localStorage.setItem("mahakalToken", data.token);
            }
        } catch (err) {
            console.error("Login error:", err);
        }
    };

    const handleLogout = () => {
        googleLogout();
        setUser(null);
        setCartCount(0);
        localStorage.removeItem("mahakalUser");
        localStorage.removeItem("mahakalToken");
        setShowProfile(false);
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
                        {/* <Link to="/contact" className="hover:text-orange-500 flex items-center gap-1">
                            <Phone size={18} /> Contact
                        </Link> */}
                    </ul>

                    {/* Actions - Desktop */}
                    <div className="hidden md:flex items-center space-x-4 relative">
                        {/* Cart Icon */}
                        <button
                            onClick={goToCart}
                            className="relative p-2 hover:bg-orange-50 rounded-full transition"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingCart className="text-orange-600 w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {!user ? (
                            <div className="hidden md:block">
                                <GoogleLogin
                                    onSuccess={handleLoginSuccess}
                                    onError={() => console.error("Google login failed")}
                                    useOneTap={false}
                                />
                            </div>
                        ) : (
                            <button
                                onClick={toggleProfile}
                                className="relative bg-orange-100 hover:bg-orange-200 p-2 rounded-full transition flex items-center gap-2"
                                aria-label="User Profile"
                            >
                                <UserIcon className="text-orange-600 w-6 h-6" />
                                <span className="font-medium text-gray-700">
                                    {user.name}
                                </span>
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
                                        src={user.profileImage || user.picture || "/shivmahakal.png"}
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

                    {/* Mobile Actions */}
                    <div className="flex md:hidden items-center space-x-3">
                        {/* Mobile Menu Button */}
                        <button className="text-orange-600 p-2" onClick={toggleMenu}>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown */}
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
                            {/* <Link to="/contact" onClick={toggleMenu} className="px-4 py-2 hover:bg-orange-50 flex items-center gap-2">
                                <Phone size={20} /> Contact
                            </Link> */}

                            <hr className="my-2" />

                            {/* Cart Button in Mobile Sidebar */}
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

                            {/* Mobile Sign In / Profile Section */}
                            {!user ? (
                                <div className="px-4 py-2">
                                    <div className="bg-orange-50 p-3 rounded-md">
                                        <GoogleLogin
                                            onSuccess={handleLoginSuccess}
                                            onError={() => console.error("Google login failed")}
                                            text="signin_with"
                                            width="100%"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="px-4">
                                    <p className="font-semibold mb-1">{user.name}</p>
                                    <p className="text-xs mb-2 truncate">{user.email}</p>
                                    <button
                                        onClick={() => {
                                            goToProfile();
                                            toggleMenu();
                                        }}
                                        className="w-full flex items-center justify-center gap-2 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium rounded"
                                    >
                                        <UserIcon size={18} /> View Profile
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            toggleMenu();
                                        }}
                                        className="w-full flex items-center justify-center gap-2 py-2 bg-red-100 hover:bg-red-200 text-red-600 font-medium rounded mt-1"
                                    >
                                        <LogOut size={18} /> Logout
                                    </button>
                                </div>
                            )}
                        </ul>
                    </div>
                )}
            </nav>
            {/* Spacer below fixed navbar */}
            <div className="h-20"></div>
        </>
    );
}

export default Navbar;
