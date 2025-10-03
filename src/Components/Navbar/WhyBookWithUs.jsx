import React from "react";
import { FaMedal, FaGift, FaUsers, FaGopuram } from "react-icons/fa";

const WhyBookWithUs = () => {
  const features = [
    {
      icon: <FaMedal size={40} className="text-red-600" />,
      title: "🌸 India’s Prasad Bazaar",
      description: "Not just a store — a small step to bring divine blessings closer to your heart.",
    },
    {
      icon: <FaGift size={40} className="text-red-600" />,
      title: "🎁 Temple Prasad",
      description: "Sacred prasads offered in holy temples, reaching you with the same purity and devotion.",
    },
    {
      icon: <FaUsers size={40} className="text-red-600" />,
      title: "🙏 Devotees First",
      description: "Every devotee is family — we serve with faith, love, and sincerity.",
    },
    {
      icon: <FaGopuram size={40} className="text-red-600" />,
      title: "🛕 Temple Connections",
      description: "From temple bells to your prayers — we bring them together.",
    },
  ];

  return (
    <div className="py-10 bg-white">
      <h2 className="text-2xl font-bold text-center">Why Us for Your Devotion?</h2>
      <p className="text-gray-500 text-center mb-10">
        Delivering temples, traditions, and blessings
        to your heart with love
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-[#fff9f2] rounded-lg shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="text-gray-600 mt-2 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyBookWithUs;
