import { useState } from "react";
import { User, Menu, X } from "lucide-react";
import {
    Home,
    Gift,
    BookOpen,
    Landmark,
    Library,
    Phone,
    Calendar,
    ShoppingBag,
} from "lucide-react";

import { Link } from "react-router-dom";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                    {/* Logo and Branding */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <img
                            src="/shivmahakal.png"
                            alt="Sri Mandir"
                            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover"
                        />
                        <span className="text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl font-bold text-orange-600 whitespace-nowrap">
                            Mahakal Bhakti Bazzar
                        </span>
                    </div>
                    {/* Desktop Menu - Full options for all desktop sizes */}
                    <ul className="hidden md:flex space-x-4 lg:space-x-6 xl:space-x-8 text-gray-800 font-medium">
                        <Link to="/">
                            <li className="flex items-center gap-1 lg:gap-2 hover:text-orange-500 transition cursor-pointer text-sm lg:text-sm xl:text-base">
                                <Home size={16} className="w-4 h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5" /> Home
                            </li>
                        </Link>
                        <Link to="/products">
                            <li className="flex items-center gap-1 lg:gap-2 hover:text-orange-500 transition cursor-pointer text-sm lg:text-sm xl:text-base">
                                <Gift size={16} className="w-4 h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5" /> Products
                            </li>
                        </Link>
                        <li className="flex items-center gap-1 lg:gap-2 hover:text-orange-500 transition cursor-pointer text-sm lg:text-sm xl:text-base">
                            <Landmark size={16} className="w-4 h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5" /> Temples
                        </li>
                        <li className="flex items-center gap-1 lg:gap-2 hover:text-orange-500 transition cursor-pointer text-sm lg:text-sm xl:text-base">
                            <Library size={16} className="w-4 h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5" /> Library
                        </li>
                        <li className="flex items-center gap-1 lg:gap-2 hover:text-orange-500 transition cursor-pointer text-sm lg:text-sm xl:text-base">
                            <Phone size={16} className="w-4 h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5" /> Contact
                        </li>
                    </ul>


                    {/* Actions */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <span className="bg-orange-100 hover:bg-orange-200 p-1.5 sm:p-2 rounded-full cursor-pointer transition">
                            <User className="text-orange-600 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        </span>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-orange-600 focus:outline-none p-1"
                            onClick={toggleMenu}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown */}
                {isOpen && (
                    <div className="fixed inset-0 z-40 flex justify-end md:hidden">
                        {/* Background overlay */}
                        <div
                            className="fixed inset-0 bg-black/40"
                            onClick={toggleMenu}
                        />

                        {/* Right-side drawer */}
                        <div className="w-4/5 max-w-xs bg-orange-50 shadow-lg h-full z-50 transform transition-transform duration-300 ease-in-out animate-slideIn">
                            <div className="flex justify-between items-center p-4 border-b border-orange-200">
                                <div className="flex items-center space-x-2">
                                    <img
                                        src="/shivmahakal.png"
                                        alt="Sri Mandir"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <span className="text-lg font-bold text-orange-600">
                                        Mahakal Bhakti Bazzar
                                    </span>
                                </div>
                            </div>

                            <ul className="flex flex-col space-y-1 py-4 px-4 text-gray-700 font-medium">
                                <Link to="/" onClick={toggleMenu}>
                                    <li className="flex items-center gap-3 hover:text-orange-500 transition cursor-pointer py-3 px-3 rounded-lg hover:bg-orange-100">
                                        <Home size={20} /> Home
                                    </li>
                                </Link>
                                <Link to="/products" onClick={toggleMenu}>
                                    <li className="flex items-center gap-3 hover:text-orange-500 transition cursor-pointer py-3 px-3 rounded-lg hover:bg-orange-100">
                                        <Gift size={20} /> Products
                                    </li>
                                </Link>
                                <li className="flex items-center gap-3 hover:text-orange-500 transition cursor-pointer py-3 px-3 rounded-lg hover:bg-orange-100">
                                    <BookOpen size={20} /> Chadhava
                                </li>
                                <li className="flex items-center gap-3 hover:text-orange-500 transition cursor-pointer py-3 px-3 rounded-lg hover:bg-orange-100">
                                    <Landmark size={20} /> Temples
                                </li>
                                <li className="flex items-center gap-3 hover:text-orange-500 transition cursor-pointer py-3 px-3 rounded-lg hover:bg-orange-100">
                                    <Library size={20} /> Library
                                </li>
                                <li className="flex items-center gap-3 hover:text-orange-500 transition cursor-pointer py-3 px-3 rounded-lg hover:bg-orange-100">
                                    <ShoppingBag size={20} /> My Orders
                                </li>
                                <li className="flex items-center gap-3 hover:text-orange-500 transition cursor-pointer py-3 px-3 rounded-lg hover:bg-orange-100">
                                    <Phone size={20} /> Contact
                                </li>
                                <li className="flex items-center gap-3 hover:text-orange-500 transition cursor-pointer py-3 px-3 rounded-lg hover:bg-orange-100">
                                    <Calendar size={20} /> About us
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </nav>

            {/* Add padding to prevent content from being hidden behind fixed navbar */}
            <div className="h-16 sm:h-20 md:h-24"></div>
        </>
    );
}

export default Navbar;