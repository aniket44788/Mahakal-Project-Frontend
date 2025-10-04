import React from "react";

function Donation() {
    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg text-center">
            {/* Heading */}
            <h1 className="text-4xl font-bold text-indigo-600 mb-4">Support Our Mission 🚀</h1>

            {/* About Donation */}
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
                We are building a <span className="font-semibold">Prashad Selling Platform</span>
                with a vision to reach people across the world.
                Your support will help us grow into a successful startup 🌱.
                Every contribution takes us one step closer to making this dream real.
            </p>

            {/* QR Section */}
            <div className="flex flex-col items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Scan & Donate ❤️</h2>
                <p className="text-gray-600 mb-4">You can directly donate by scanning the QR code below.</p>

                {/* Replace src with your QR image path */}
                <img
                    src="/images/donation-qr.png"
                    alt="Donation QR Code"
                    className="w-56 h-56 border-4 border-indigo-500 rounded-lg shadow-md"
                />
            </div>

            {/* Closing message */}
            <p className="text-gray-700 text-sm mt-4">
                Thank you for believing in us 🙏 <br />
                Together, we can grow and make a big impact!
            </p>
        </div>
    );
}

export default Donation;
