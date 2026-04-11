import React from "react";

function Donation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4 sm:px-6 py-10">

      {/* Maintenance Card */}
      <div className="max-w-2xl mx-auto mb-10 p-6 sm:p-8 bg-white/70 backdrop-blur-xl border border-orange-200 shadow-xl rounded-2xl text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-orange-600 mb-3">
          Website Under Maintenance 🚧
        </h2>

        <p className="text-gray-700 mb-4 text-sm sm:text-base leading-relaxed">
          फिलहाल वेबसाइट में कुछ सुधार और नए फीचर्स जोड़े जा रहे हैं।
          अगर आपको प्रोडक्ट, ऑर्डर या किसी भी कंपनी से जुड़ी जानकारी या समस्या आती है,
          या आप कोई <span className="font-semibold">promotion / collaboration</span> करना चाहते हैं,
          तो आप हमसे संपर्क कर सकते हैं।
        </p>

        <p className="text-base sm:text-lg font-semibold text-gray-900">
          📩 Email:
          <a
            href="mailto:aniketyt266@gmail.com"
            className="text-orange-500 font-bold hover:underline ml-1"
          >
            aniketyt266@gmail.com
          </a>
        </p>

        <div className="mt-5 text-sm text-gray-600 bg-orange-100 px-4 py-2 rounded-lg">
          हम आपके सुझाव, फीडबैक और समस्याओं का स्वागत करते हैं ❤️
        </div>
      </div>

      {/* Donation Section */}
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-xl border border-orange-100 rounded-3xl shadow-2xl p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Left Section */}
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-6 leading-snug">
            Support Our Mission 🚀
          </h1>

          <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-6">
            We are building a{" "}
            <span className="font-semibold text-orange-600">
              Prasad Selling Platform
            </span>{" "}
            with a vision to connect devotees across the world 🌍।
            आपका support हमें एक strong startup बनाने में मदद करेगा।
          </p>

          <p className="text-gray-600 italic text-sm sm:text-base">
            "आपका छोटा सा support हमारे लिए बहुत बड़ा बदलाव ला सकता है 🙏"
          </p>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-orange-600 mb-3">
            Scan & Donate ❤️
          </h2>

          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            UPI / Wallet / Bank Apps से support करें
          </p>

          {/* <div className="p-3 bg-white rounded-2xl shadow-lg">
            <img
              src="/qr.png"
              alt="Donation QR Code"
              className="w-44 h-44 sm:w-60 sm:h-60 object-contain rounded-xl hover:scale-105 transition-transform duration-300"
            />
          </div> */}

          <p className="mt-4 text-xs sm:text-sm text-gray-500">
            100% secure payment 🔒
          </p>
        </div>

      </div>
    </div>
  );
}

export default Donation;