import { useState } from "react";
import { FaInstagram, FaWhatsapp, FaFacebook } from "react-icons/fa";
import axios from "axios";

export default function HomeFooter() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [responseMsg, setResponseMsg] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponseMsg("");

        const token = localStorage.getItem("mahakalToken"); // ⬅️ Get token

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/user/email`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // ⬅️ Token added
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.data.success) {
                setResponseMsg("Your message has been sent successfully!");
                window.alert("Your message has been sent successfully!");
            }
        } catch (error) {
            setResponseMsg("Failed to send message. Please try again.");
        }
        setLoading(false);
    };

    return (
        <footer className="bg-white text-orange-900 py-4 mt-20 px-6 ">
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">

                {/* Left Section - Brand + Social */}
                <div>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="bg-orange-200 text-orange-900 rounded-full p-3 shadow-md flex items-center justify-center">
                            <span className="text-3xl">🌸</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold">Aapki Shraddha, Hamari Jimmedari</h2>
                    </div>

                    <div className="flex space-x-5 mt-4">
                        <a href="https://instagram.com" target="_blank" className="p-2 bg-orange-200 rounded-full shadow hover:bg-pink-100 transition">
                            <FaInstagram className="text-xl text-pink-500 hover:text-pink-600" />
                        </a>
                        <a href="https://wa.me/918351927365" target="_blank" className="p-2 bg-orange-200 rounded-full shadow hover:bg-green-100 transition">
                            <FaWhatsapp className="text-xl text-green-500 hover:text-green-600" />
                        </a>
                        <a href="https://facebook.com" target="_blank" className="p-2 bg-orange-200 rounded-full shadow hover:bg-blue-100 transition">
                            <FaFacebook className="text-xl text-blue-500 hover:text-blue-600" />
                        </a>
                    </div>
                </div>

                {/* Middle Section */}
                <div>
                    <h3 className="font-bold text-lg md:text-xl mb-4">Quick Links</h3>
                    <ul className="space-y-3">
                        <li><a href="/privacypolicy" className="hover:text-orange-600 hover:underline transition">Privacy Policy</a></li>
                        <li><a href="/termscondition" className="hover:text-orange-600 hover:underline transition">Terms and Conditions</a></li>
                        <li><a href="/RefundReturnPolicy" className="hover:text-orange-600 hover:underline transition">RefundReturnPolicy</a></li>
                        <li><a href="/ShippingPolicy" className="hover:text-orange-600 hover:underline transition">ShippingPolicy</a></li>
                        <li><a href="/ContactUs" className="hover:text-orange-600 hover:underline transition">Contact us</a></li>
                    </ul>
                </div>

                {/* Contact Form */}
                <div>
                    <h3 className="font-bold text-lg md:text-xl mb-4 text-orange-800">Contact Us</h3>
                    <p className="mb-3 text-orange-900 font-medium">📞 +91 8351927365</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                            required
                            className="w-full px-4 py-3 rounded-lg bg-orange-50 border border-orange-300 text-orange-900 placeholder-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition shadow-sm"
                        />

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your Email"
                            required
                            className="w-full px-4 py-3 rounded-lg bg-orange-50 border border-orange-300 text-orange-900 placeholder-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition shadow-sm"
                        />

                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Your Message"
                            rows="4"
                            required
                            className="w-full px-4 py-3 rounded-lg bg-orange-50 border border-orange-300 text-orange-900 placeholder-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition shadow-sm"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-orange-700 transition disabled:bg-orange-300"
                        >
                            {loading ? "Sending..." : "Send Message"}
                        </button>

                        {responseMsg && (
                            <p className="text-sm font-semibold text-green-700 mt-2">{responseMsg}</p>
                        )}
                    </form>
                </div>

            </div>

            <div className="border-t border-orange-300 mt-12 pt-6 text-center text-sm md:text-base">
                © 2025 Mahakal Bhakti Bazaar — All Rights Reserved.
            </div>
        </footer>
    );
}
