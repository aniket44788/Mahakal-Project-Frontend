import React from "react";
import { Helmet } from "react-helmet";
import WhyBookWithUs from "./WhyBookWithUs";
import TempleSlider from "./TempleSlider";
import DashboardProducts from "./DashboardProducts";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-orange-50 min-h-screen">
      <Helmet>
        <title>
          Khajrana Ganesh Prasad Online Booking | Indore Temple Prasad Home Delivery 🚚
        </title>

        <meta
          name="description"
          content="घर बैठे इंदौर खजराना गणेश मंदिर का पवित्र प्रसाद पाएं। ताजा और शुद्ध प्रसाद पूरे भारत में होम डिलीवरी के साथ। अभी ऑर्डर करें!"
        />

        <meta
          name="keywords"
          content="khajrana ganesh prasad, indore prasad online, khajrana prasad booking, temple prasad delivery, ganesh prasad indore"
        />

        <meta property="og:title" content="Khajrana Ganesh Prasad Online Booking 🚚" />
        <meta
          property="og:description"
          content="इंदौर से सीधे घर तक खजराना गणेश प्रसाद मंगवाएं"
        />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Slider */}
      <div className="pt-4 px-2 md:px-6" data-aos="zoom-in">
        <TempleSlider />
      </div>

      {/* Hero Section */}
      <div className="w-full flex flex-col justify-center items-center text-center my-12 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 bg-clip-text text-transparent leading-tight">
          घर बैठे पाएँ
          <br />
          <span>खजराना गणेश का पवित्र प्रसाद</span>
        </h1>

        <p className="text-gray-600 mt-5 text-sm sm:text-base md:text-lg max-w-xl">
          अब लाइन में खड़े होने की जरूरत नहीं।
          <br />
          <span className="font-semibold text-gray-800">
            सीधे इंदौर के खजराना गणेश मंदिर से शुद्ध और ताज़ा प्रसाद
          </span>{" "}
          आपके घर तक।
        </p>
      </div>

      {/* Features Section */}
      <div className="mt-14 px-3 md:px-6">
        <WhyBookWithUs />
      </div>
    </div>
  );
}

export default Home;