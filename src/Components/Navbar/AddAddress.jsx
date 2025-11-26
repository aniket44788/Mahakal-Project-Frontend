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
        

        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                />
                <input
                    type="text"
                    name="alternatePhone"
                    placeholder="Alternate Phone"
                    value={formData.alternatePhone}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                />
                <input
                    type="text"
                    name="houseNumber"
                    placeholder="House Number"
                    value={formData.houseNumber}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                />
                <input
                    type="text"
                    name="street"
                    placeholder="Street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                />
                <input
                    type="text"
                    name="landmark"
                    placeholder="Landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                />
                <input
                    type="text"
                    name="townCity"
                    placeholder="City"
                    value={formData.townCity}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                />
                <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                />
                <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                />
                <select
                    name="addressType"
                    value={formData.addressType}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                </select>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                >
                    {loading ? "Adding..." : "Add Address"}
                </button>
            </form>
        </div>
    );
}

export default AddAddress;
