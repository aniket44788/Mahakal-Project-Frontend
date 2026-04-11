// import React from "react";
// import WhyBookWithUs from "./WhyBookWithUs";
// // import HowItWorks from "./HowItWorks";
// import TempleSlider from "./TempleSlider";
// import DashboardProducts from "./DashboardProducts";
// import { useNavigate } from "react-router-dom";
// // import GuidesSection from "./Guidesection";

// function Home() {
//   const navigate = useNavigate();

//   return (
//     <div className="bg-orange-50 min-h-screen">
//       {/* Slider */}
//       <div className="pt-4 px-2 md:px-6" data-aos="zoom-in">
//         <TempleSlider />
//       </div>

//       {/* Hero Section */}
//       <div className="w-full flex flex-col justify-center items-center text-center my-12 px-4">
//         <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 bg-clip-text text-transparent leading-tight">
//           घर बैठे पाएँ
//           <br />
//           <span>मंदिर का पवित्र प्रसाद</span>
//         </h2>

//         <p className="text-gray-600 mt-5 text-sm sm:text-base md:text-lg max-w-xl">
//           अब लाइन में खड़े होने की जरूरत नहीं।
//           <br />
//           <span className="font-semibold text-gray-800">
//             सीधे मंदिर से शुद्ध और ताज़ा प्रसाद
//           </span>{" "}
//           आपके घर तक।
//         </p>
//       </div>

//       {/* Products Section */}
//       <div className="max-w-7xl mx-auto px-3 md:px-6">
//         <DashboardProducts />

//         <div className="w-full flex items-center justify-center mt-10">
//           <button
//             onClick={() => navigate("/products")}
//             className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base transform hover:scale-105"
//           >
//             📋 View All Products
//           </button>
//         </div>
//       </div>

//       {/* Features Section */}
//       <div className="mt-14 px-3 md:px-6">
//         <WhyBookWithUs />
//       </div>

//       {/* <div>
//         <GuidesSection/>
//       </div> */}

//       {/* <div className="mt-14 px-3 md:px-6 pb-10">
//         <HowItWorks />
//       </div> */}
//     </div>
//   );
// }

// export default Home;

import React from "react";
import { Helmet } from "react-helmet"; // ✅ ADD
import WhyBookWithUs from "./WhyBookWithUs";
import TempleSlider from "./TempleSlider";
import DashboardProducts from "./DashboardProducts";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-orange-50 min-h-screen">
      {/* ✅ SEO START */}
      <Helmet>
        <title>
          Mahakal Prasad Online Booking | Ujjain Temple Prasad Home Delivery 🚚
        </title>

        <meta
          name="description"
          content="घर बैठे उज्जैन महाकाल मंदिर का पवित्र प्रसाद पाएं। ताजा और शुद्ध प्रसाद पूरे भारत में होम डिलीवरी के साथ। अभी ऑर्डर करें!"
        />

        <meta
          name="keywords"
          content="mahakal prasad, ujjain prasad online, mahakal prasad booking, temple prasad delivery"
        />

        {/* Open Graph (WhatsApp / Facebook sharing) */}
        <meta property="og:title" content="Mahakal Prasad Online Booking 🚚" />
        <meta
          property="og:description"
          content="उज्जैन से सीधे घर तक महाकाल प्रसाद मंगवाएं"
        />
        <meta property="og:type" content="website" />
      </Helmet>
      {/* ✅ SEO END */}

      {/* Slider */}
      <div className="pt-4 px-2 md:px-6" data-aos="zoom-in">
        <TempleSlider />
      </div>

      {/* Hero Section */}
      <div className="w-full flex flex-col justify-center items-center text-center my-12 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 bg-clip-text text-transparent leading-tight">
          घर बैठे पाएँ
          <br />
          <span>मंदिर का पवित्र प्रसाद</span>
        </h1>

        <p className="text-gray-600 mt-5 text-sm sm:text-base md:text-lg max-w-xl">
          अब लाइन में खड़े होने की जरूरत नहीं।
          <br />
          <span className="font-semibold text-gray-800">
            सीधे मंदिर से शुद्ध और ताज़ा प्रसाद
          </span>{" "}
          आपके घर तक।
        </p>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-3 md:px-6">
        <DashboardProducts />

        <div className="w-full flex items-center justify-center mt-10">
          <button
            onClick={() => navigate("/mahakal-prasad-online-booking")} // ✅ SEO URL
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base transform hover:scale-105"
          >
            📋 View All Products
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-14 px-3 md:px-6">
        <WhyBookWithUs />
      </div>
    </div>
  );
}

export default Home;
