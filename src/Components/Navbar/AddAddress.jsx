import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toastSuccess, toastWarning } from "../Toast";

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
        <div className="min-h-screen bg-orange-50 flex justify-center py-10">
            <div className="w-[80%] max-w-5xl bg-white rounded-2xl shadow-xl border border-orange-100 p-8">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Add New Address</h2>
                        <p className="text-sm text-gray-500">Fill in accurate delivery details</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Personal Details */}
                    <div className="border rounded-xl p-6 bg-orange-50/60">
                        <h3 className="text-sm font-semibold text-orange-600 uppercase mb-4">
                            Personal Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* Full Name */}
                            <div>
                                <label className="label">Full Name *</label>
                                <input
                                    className="input"
                                    name="fullName"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="label">Phone Number *</label>
                                <div className="relative">
                                  
                                    <input
                                        className="input pl-12"
                                        name="phone"
                                        placeholder="Mobile number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Alternate Phone */}
                            <div className="md:col-span-2">
                                <label className="label">Alternate Phone</label>
                                <div className="relative">
                                
                                    <input
                                        className="input pl-12"
                                        name="alternatePhone"
                                        placeholder="Optional alternate number"
                                        value={formData.alternatePhone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Address Details */}
                    <div className="border rounded-xl p-6">
                        <h3 className="text-sm font-semibold text-orange-600 uppercase mb-4">
                            Address Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>
                                <label className="label">House / Flat No *</label>
                                <input
                                    className="input"
                                    name="houseNumber"
                                    placeholder="House / Flat No"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Street / Area *</label>
                                <input
                                    className="input"
                                    name="street"
                                    placeholder="Street / Area"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Landmark</label>
                                <input
                                    className="input"
                                    name="landmark"
                                    placeholder="Nearby landmark (optional)"
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="label">City *</label>
                                <input
                                    className="input"
                                    name="townCity"
                                    placeholder="City"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">State *</label>
                                <input
                                    className="input"
                                    name="state"
                                    placeholder="State"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Pincode *</label>
                                <input
                                    className="input"
                                    name="pincode"
                                    placeholder="6 digit pincode"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                        </div>

                        <div className="mt-5">
                            <label className="label">Address Type *</label>
                            <select
                                name="addressType"
                                value={formData.addressType}
                                onChange={handleChange}
                                className="input bg-white"
                                required
                            >
                                <option value="Home">🏠 Home</option>
                                <option value="Work">🏢 Work</option>
                                <option value="Other">📍 Other</option>
                            </select>
                        </div>
                    </div>


                    {/* Actions */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/profile")}
                            className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg disabled:opacity-60"
                        >
                            {loading ? "Saving..." : "Save Address"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddAddress;
