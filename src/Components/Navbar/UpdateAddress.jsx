import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function UpdateAddress() {
    const navigate = useNavigate();
    const { id } = useParams(); // address ID from URL
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

    const token = localStorage.getItem("mahakalToken");

    // Fetch the address to prefill the form
    useEffect(() => {
        if (!token) return;
        const fetchAddress = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const address = res.data.user.addresses.find((addr) => addr._id === id);
                if (address) setFormData(address);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAddress();
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/user/address/update/${id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Address updated successfully!");
            navigate("/profile"); // redirect back to profile page
        } catch (err) {
            console.error(err);
            alert("Failed to update address");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 mt-10 rounded-2xl 
     bg-white/10 backdrop-blur-md shadow-xl border border-white/20">

            <h2 className="text-xl font-semibold mb-4">Update Address</h2>
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
                    {loading ? "Updating..." : "Update Address"}
                </button>
            </form>
        </div>
    );
}

export default UpdateAddress;
