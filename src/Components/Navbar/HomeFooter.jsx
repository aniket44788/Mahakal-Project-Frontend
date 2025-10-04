import { FaInstagram, FaWhatsapp, FaFacebook } from "react-icons/fa";

export default function HomeFooter() {
    return (
        <footer className="bg-orange-100 text-orange-900 py-4 px-6 shadow-inner">
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 ">

                {/* Left Section - Brand + Social */}
                <div>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="bg-orange-200 text-orange-900 rounded-full p-3 shadow-md flex items-center justify-center">
                            <span className="text-3xl">🌸</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold">Aapki Shraddha, Hamari Jimmedari</h2>
                    </div>
                    <div className="flex space-x-5 mt-4">
                        <a href="#" className="p-2 bg-orange-200 rounded-full shadow hover:bg-pink-100 transition">
                            <FaInstagram className="text-xl text-pink-500 hover:text-pink-600" />
                        </a>
                        <a href="#" className="p-2 bg-orange-200 rounded-full shadow hover:bg-green-100 transition">
                            <FaWhatsapp className="text-xl text-green-500 hover:text-green-600" />
                        </a>
                        <a href="#" className="p-2 bg-orange-200 rounded-full shadow hover:bg-blue-100 transition">
                            <FaFacebook className="text-xl text-blue-500 hover:text-blue-600" />
                        </a>
                    </div>
                </div>

                {/* Middle Section - Quick Links */}
                <div>
                    <h3 className="font-bold text-lg md:text-xl mb-4">Quick Links</h3>
                    <ul className="space-y-3">
                        <li>
                            <a href="#" className="hover:text-orange-600 hover:underline transition">Puja</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-orange-600 hover:underline transition">Chadhava</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-orange-600 hover:underline transition">Contact Us</a>
                        </li>
                    </ul>
                </div>

                {/* Right Section - Contact Form */}
                <div>
                    <h3 className="font-bold text-lg md:text-xl mb-2">Contact Us</h3>
                    <p className="mb-3">📞 +91 8878769436</p>
                    <form className="space-y-3">
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full px-4 py-2 rounded-lg text-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full px-4 py-2 rounded-lg text-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
                        />
                        <textarea
                            placeholder="Your Message"
                            rows="3"
                            className="w-full px-4 py-2 rounded-lg text-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
                        ></textarea>
                        <button
                            type="submit"
                            className="bg-orange-400 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-orange-500 transition"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-orange-300 mt-12 pt-6 text-center text-sm md:text-base">
                © Copyright 2025, All Rights Reserved by <span className="font-semibold">Mahakal Bhakti Bazzar</span>
            </div>
        </footer>
    );
}
