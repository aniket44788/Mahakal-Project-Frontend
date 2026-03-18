import mahakal1 from "../../assets/mahakal.jpeg";

const TempleHero = () => {
  return (
    <section className="w-full  py-16 md:py-24 px-5 sm:px-8 lg:px-16 overflow-hidden relative">
      
      {/* OM Background */}
      <div className="absolute -top-10 right-6 md:right-20 opacity-[0.04] pointer-events-none">
        <span className="text-[140px] md:text-[180px] text-orange-600 font-serif">
          ॐ
        </span>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* LEFT CONTENT */}
          <div className="space-y-8 text-center lg:text-left">
            
            {/* Tag */}
            <div className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium tracking-wide shadow-sm">
              🚚 सीधे मंदिर से • आपके घर तक
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              घर बैठे पाएँ{" "}
              <span className="text-orange-600 block mt-2">
                महाकालेश्वर का प्रसाद
              </span>
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-lg sm:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
              अब उज्जैन के पवित्र श्री महाकालेश्वर मंदिर से{" "}
              <span className="font-semibold text-gray-800">
                शुद्ध, ताज़ा और आशीर्वाद से भरपूर प्रसाद
              </span>{" "}
              सीधे आपके घर तक।
              <br className="hidden sm:block" />
              बिना लाइन, बिना परेशानी — सिर्फ श्रद्धा और विश्वास।
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
              
              <button className="bg-orange-600 cursor-pointer hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-orange-200/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                🛒 अभी ऑर्डर करें
              </button>

              <button className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-green-200/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2">
                📲 WhatsApp से ऑर्डर करें
              </button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-5 text-sm text-gray-600">
              <span className="bg-white px-3 py-1 rounded-full shadow-sm">
                ✔ 100% मंदिर से प्रमाणित
              </span>
              <span className="bg-white px-3 py-1 rounded-full shadow-sm">
                🚚 2-4 दिन में डिलीवरी
              </span>
              <span className="bg-white px-3 py-1 rounded-full shadow-sm">
                🇮🇳 पूरे भारत में सेवा
              </span>
            </div>

          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center lg:justify-end">
            
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-orange-200/30 to-transparent rounded-3xl blur-2xl"></div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-[5px] border-orange-200">
              
              <img
                src={mahakal1}
                alt="श्री महाकालेश्वर मंदिर - उज्जैन"
                className="w-full max-w-md lg:max-w-xl object-cover transition-transform duration-700 hover:scale-105"
              />

              {/* Badge */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium text-orange-700 shadow-md flex items-center gap-2">
                🙏 मूल प्रसाद
              </div>

              {/* Top Right Mini Badge */}
              <div className="absolute top-4 right-4 bg-orange-600 text-white text-xs px-3 py-1 rounded-full shadow">
                Bestseller 🔥
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TempleHero;