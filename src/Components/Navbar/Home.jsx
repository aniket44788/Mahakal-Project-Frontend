import React from "react";
import WhyBookWithUs from "./WhyBookWithUs";
import HowItWorks from "./HowItWorks";
// import HomeFooter from "./HomeFooter";
import TempleSlider from "./TempleSlider";
import DashboardProducts from "./DashboardProducts";
import { Navigate, useNavigate } from "react-router-dom";

function Home() {
  const Navigate = useNavigate();
  return (
    <>
      <>
        <div className="pt-4" data-aos="zoom-in">
          <TempleSlider />
        </div>
        <div className="w-full flex flex-col justify-center items-center text-center my-10 px-4">
          <h2
            className="text-4xl mb-2 md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-amber-600 to-yellow-500 
  bg-clip-text text-transparent drop-shadow-md"
          >
            घर बैठे पाएँ
            <br />
            <span>मंदिर का पवित्र प्रसाद</span>
          </h2>

          <p className="text-gray-600 mt-4 text-sm md:text-base max-w-2xl">
            अब लाइन में खड़े होने की जरूरत नहीं।
            <br />
            <span className="font-semibold text-gray-800">
              सीधे मंदिर से शुद्ध और ताज़ा प्रसाद
            </span>{" "}
            आपके घर तक।
          </p>
        </div>
        <div>
          <DashboardProducts />
          <div className="w-full  flex items-center justify-center ">
            <button
              onClick={() => Navigate("/products")}
              className="  min-w-max bg-gradient-to-r from-red-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              📋 View All Products .....
            </button>
          </div>
        </div>

        <div>
          <WhyBookWithUs />
        </div>
        <div>
          <HowItWorks />
        </div>
      </>
    </>
  );
}

export default Home;
