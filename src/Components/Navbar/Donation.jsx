import React from "react";

function Donation() {
    return (


        <>
            <div className="max-w-2xl mx-auto  p-6 bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg rounded-2xl text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    Website Under Maintenance 🚧
                </h2>

                <p className="text-gray-700 mb-4">
                    फिलहाल वेबसाइट में कुछ सुधार और नए फीचर्स जोड़े जा रहे हैं।
                    अगर आपको प्रोडक्ट, ऑर्डर या किसी भी कंपनी से जुड़ी जानकारी या समस्या आती है,
                    या आप कोई <span className="font-semibold">promotion / collaboration</span> करना चाहते हैं,
                    तो आप हमसे संपर्क कर सकते हैं।
                </p>

                <p className="text-lg font-semibold text-gray-900">
                    📩 Email:
                    <a
                        href="mailto:aniketyt266@gmail.com"
                        className="text-orange-600 font-bold hover:underline ml-1"
                    >
                        aniketyt266@gmail.com
                    </a>
                </p>

                <div className="mt-6 text-sm text-gray-600 bg-white/40 px-4 py-2 rounded-lg">
                    हम आपके सुझाव, फीडबैक और समस्याओं का स्वागत करते हैं।
                    आपके सपोर्ट से ही हम बेहतर बनते हैं ❤️
                </div>
            </div>
            <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6">
                <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

                    {/* Left Section - Info */}
                    <div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-indigo-600 mb-6 leading-snug">
                            Support Our <br className="hidden sm:block" /> Mission 🚀
                        </h1>
                        <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
                            We are building a <span className="font-semibold">Prasad Selling Platform </span>
                            with a vision to connect with people across the world.
                            Your support will help us grow into a successful startup 🌱.
                            Every contribution takes us one step closer to making this dream real.
                        </p>
                        <p className="text-gray-600 italic text-sm sm:text-base">
                            "A small step from you can create a big change for us." 🙏
                        </p>
                    </div>

                    {/* Right Section - QR */}
                    <div className="flex flex-col items-center">
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">Scan & Donate ❤️</h2>
                        <p className="text-gray-600 mb-4 text-center text-sm sm:text-base">
                            Support us by scanning the QR code below.
                        </p>
                        <img
                            src="/qr.png"
                            alt="Donation QR Code"
                            className="w-48 h-48 sm:w-64 sm:h-64 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                        />
                        <p className="mt-4 text-xs sm:text-sm text-gray-500">
                            (Available for UPI / Wallets / Bank Apps)
                        </p>
                    </div>

                </div>

            </div>

        </>

    );
}

export default Donation;
