import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/user/address`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert("Address added successfully!");
            navigate("/profile"); // redirect back to profile
        } catch (err) {
            console.error(err);
            alert("Failed to add address");
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl mt-10 border border-gray-200">
            <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Add New Address</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Personal Details Section */}
                <div className="space-y-4 border-b border-gray-100 pb-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Personal Details</h3>

                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            name="fullName"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500">+91</span>
                                </div>
                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    placeholder="Mobile number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-12 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="alternatePhone" className="block text-sm font-medium text-gray-700 mb-1">
                                Alternate Phone
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500">+91</span>
                                </div>
                                <input
                                    id="alternatePhone"
                                    type="tel"
                                    name="alternatePhone"
                                    placeholder="Optional alternate number"
                                    value={formData.alternatePhone}
                                    onChange={handleChange}
                                    className="w-full pl-12 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Details Section */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Address Details</h3>

                    <div>
                        <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            House Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="houseNumber"
                            type="text"
                            name="houseNumber"
                            placeholder="e.g., Flat 4B, Tower A"
                            value={formData.houseNumber}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                            Street <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="street"
                            type="text"
                            name="street"
                            placeholder="e.g., MG Road"
                            value={formData.street}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1">
                                Landmark
                            </label>
                            <input
                                id="landmark"
                                type="text"
                                name="landmark"
                                placeholder="e.g., Near City Mall"
                                value={formData.landmark}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                            />
                        </div>

                        <div>
                            <label htmlFor="townCity" className="block text-sm font-medium text-gray-700 mb-1">
                                City <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="townCity"
                                type="text"
                                name="townCity"
                                placeholder="e.g., Mumbai"
                                value={formData.townCity}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                State <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="state"
                                type="text"
                                name="state"
                                placeholder="e.g., Maharashtra"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                                Pincode <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="pincode"
                                type="number"
                                name="pincode"
                                placeholder="e.g., 400001"
                                value={formData.pincode}
                                onChange={handleChange}
                                maxLength="6"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="addressType" className="block text-sm font-medium text-gray-700 mb-1">
                            Address Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="addressType"
                            name="addressType"
                            value={formData.addressType}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 bg-white"
                            required
                        >
                            <option value="">Select address type</option>
                            <option value="Home">🏠 Home</option>
                            <option value="Work">🏢 Work</option>
                            <option value="Other">📍 Other</option>
                        </select>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={() => {/* Handle cancel or navigate back */ }}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Adding...
                            </>
                        ) : (
                            "Add Address"
                        )}
                    </button>
                </div>
            </form>

            {/* Optional: Error/Success Messages */}
            { /* Assuming you have error state, e.g., {error && <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>} */}
        </div>
    );
}

export default AddAddress;
