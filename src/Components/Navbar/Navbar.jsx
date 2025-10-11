import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { TOKEN_URL } from "../../config.js";


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
} from "lucide-react";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const profileRef = useRef(null);

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleProfile = () => setShowProfile((prev) => !prev);

    // Persist user login with localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem("mahakalUser");
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

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
            const res = await fetch(`${TOKEN_URL}/auth/google/token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken: credential }),
                credentials: "include",
            });
            const data = await res.json();
            if (data.success) {
                setUser(data.user);
                localStorage.setItem("mahakalUser", JSON.stringify(data.user));
            }
        } catch (err) {
            console.error("Login error:", err);
        }
    };

    const handleLogout = () => {
        googleLogout();
        setUser(null);
        localStorage.removeItem("mahakalUser");
        setShowProfile(false);
    };

    return (
        <>
            <nav className="bg-white shadow-md fixed w-full top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
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
                        <Link to="/contact" className="hover:text-orange-500 flex items-center gap-1">
                            <Phone size={18} /> Contact
                        </Link>
                    </ul>

                    {/* Actions */}
                    <div className="flex items-center space-x-4 relative">
                        {!user ? (
                            <GoogleLogin
                                onSuccess={handleLoginSuccess}
                                onError={() => console.error("Google login failed")}
                            />
                        ) : (
                            <button
                                onClick={toggleProfile}
                                className="relative bg-orange-100 hover:bg-orange-200 p-2 rounded-full transition flex items-center gap-2"
                                aria-label="User Profile"
                            >
                                <UserIcon className="text-orange-600 w-6 h-6" />
                                <span className="hidden sm:inline font-medium text-gray-700">
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
                                        src={user.picture || "/shivmahakal.png"}
                                        alt="Profile"
                                        className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                                    />
                                    <h3 className="font-semibold text-gray-800">{user.name}</h3>
                                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
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

                        {/* Mobile Menu Button */}
                        <button className="md:hidden text-orange-600 p-2" onClick={toggleMenu}>
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
                            <Link to="/contact" onClick={toggleMenu} className="px-4 py-2 hover:bg-orange-50 flex items-center gap-2">
                                <Phone size={20} /> Contact
                            </Link>

                            {/* Mobile Sign Out / Profile */}
                            {user && (
                                <>
                                    <hr className="my-2" />
                                    <div className="px-4">
                                        <p className="font-semibold mb-1">{user.name}</p>
                                        <p className="text-xs mb-2 truncate">{user.email}</p>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                toggleMenu();
                                            }}
                                            className="w-full flex items-center justify-center gap-2 py-2 bg-red-100 hover:bg-red-200 text-red-600 font-medium rounded"
                                        >
                                            <LogOut size={18} /> Logout
                                        </button>
                                    </div>
                                </>
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
