import mahakal1 from "../../assets/mahakal.jpeg";

const TempleHero = () => {
  return (
    <section
      className="w-full relative overflow-hidden py-14 md:py-20 px-5 sm:px-8 lg:px-16"
      style={{
        background:
          "linear-gradient(160deg,#fff7ed 0%,#ffffff 55%,#fff7ed 100%)",
      }}
    >
      {/* ── Dot pattern ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ea580c 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── OM background watermark ── */}
      <div
        className="absolute -top-6 right-4 md:right-16 pointer-events-none select-none"
        style={{ opacity: 0.045 }}
      >
        <span className="text-[160px] md:text-[220px] font-serif text-orange-600 leading-none">
          ॐ
        </span>
      </div>

      {/* ── Soft glow blobs ── */}
      <div
        className="absolute top-1/2 -left-20 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle,rgba(234,88,12,0.1),transparent 70%)",
          transform: "translateY(-50%)",
        }}
      />
      <div
        className="absolute top-10 right-10 w-56 h-56 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle,rgba(220,38,38,0.07),transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── LEFT: Content ── */}
          <div className="space-y-7 text-center lg:text-left">
            {/* Eyebrow tag */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-orange-700 shadow-sm"
              style={{
                background: "rgba(255,247,237,0.95)",
                border: "1px solid rgba(234,88,12,0.22)",
              }}
            >
              🚚 सीधे मंदिर से • आपके घर तक
            </div>

            {/* Heading */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                घर बैठे पाएँ
              </h1>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight"
                style={{
                  background: "linear-gradient(135deg,#ea580c,#dc2626)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                महाकालेश्वर का प्रसाद
              </h1>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              अब उज्जैन के पवित्र श्री महाकालेश्वर मंदिर से{" "}
              <span className="font-bold text-gray-800">
                शुद्ध, ताज़ा और आशीर्वाद से भरपूर प्रसाद
              </span>{" "}
              सीधे आपके घर तक।
              <br className="hidden sm:block" />
              बिना लाइन, बिना परेशानी — सिर्फ श्रद्धा और विश्वास।
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <a
                href="/products"
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-white font-black text-base transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] active:scale-95"
                style={{
                  background: "linear-gradient(135deg,#ea580c,#dc2626)",
                  boxShadow: "0 8px 28px rgba(234,88,12,0.35)",
                }}
              >
                🛒 अभी ऑर्डर करें
              </a>

              <a
                href="https://wa.me/918351927365?text=नमस्ते,%20मुझे%20महाकाल%20बाजार%20से%20प्रसाद%20ऑर्डर%20करना%20है।%20कृपया%20मुझे%20डिटेल्स%20बताएं।"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-white font-black text-base transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] active:scale-95"
                style={{
                  background: "linear-gradient(135deg,#16a34a,#15803d)",
                  boxShadow: "0 8px 28px rgba(22,163,74,0.3)",
                }}
              >
                📲 WhatsApp से ऑर्डर करें
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
              {[
                "✔ 100% मंदिर से प्रमाणित",
                "🚚 2-4 दिन में डिलीवरी",
                "🇮🇳 पूरे भारत में सेवा",
              ].map((badge) => (
                <span
                  key={badge}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-gray-700"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(234,88,12,0.16)",
                    boxShadow: "0 2px 8px rgba(234,88,12,0.07)",
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Stats row */}
            <div className="flex justify-center lg:justify-start gap-6 pt-3">
              {[
                { value: "10K+", label: "Happy Devotees" },
                { value: "100%", label: "Authentic" },
                { value: "4.9★", label: "Rating" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xl font-black text-orange-600">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Image ── */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Outer glow ring */}
            <div
              className="absolute -inset-4 rounded-[2rem] pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center,rgba(234,88,12,0.13),transparent 70%)",
                filter: "blur(12px)",
              }}
            />

            <div className="relative">
              {/* Image card */}
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  border: "4px solid rgba(234,88,12,0.22)",
                  boxShadow:
                    "0 24px 60px rgba(234,88,12,0.18), 0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                <img
                  src={mahakal1}
                  alt="श्री महाकालेश्वर मंदिर - उज्जैन"
                  className="w-full max-w-sm sm:max-w-md lg:max-w-lg object-cover transition-transform duration-700 hover:scale-105"
                  style={{ display: "block" }}
                />

                {/* Gradient overlay at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top,rgba(0,0,0,0.35),transparent)",
                  }}
                />

                {/* Bottom left badge */}
                <div
                  className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-orange-800"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(234,88,12,0.25)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                  }}
                >
                  🙏 मूल प्रसाद
                </div>

                {/* Top right badge */}
                <div
                  className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-black text-white"
                  style={{
                    background: "linear-gradient(135deg,#ea580c,#dc2626)",
                    boxShadow: "0 3px 12px rgba(234,88,12,0.45)",
                  }}
                >
                  Bestseller 🔥
                </div>
              </div>

              {/* Floating card — top left */}
              <div
                className="absolute -top-5 -left-5 sm:-top-6 sm:-left-8 px-4 py-3 rounded-2xl hidden sm:block"
                style={{
                  background: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(234,88,12,0.2)",
                  boxShadow: "0 8px 28px rgba(234,88,12,0.14)",
                  animation: "floatUp 3s ease-in-out infinite",
                }}
              >
                <p className="text-xl font-black text-orange-600">🕉️</p>
                <p className="text-xs font-bold text-gray-800">जय महाकाल</p>
                <p className="text-[10px] text-gray-400">हर हर महादेव</p>
              </div>

              {/* Floating card — bottom right */}
              <div
                className="absolute -bottom-5 -right-5 sm:-bottom-6 sm:-right-8 px-4 py-3 rounded-2xl hidden sm:block"
                style={{
                  background: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(234,88,12,0.2)",
                  boxShadow: "0 8px 28px rgba(234,88,12,0.14)",
                  animation: "floatDown 3.5s ease-in-out infinite",
                }}
              >
                <p className="text-xs font-bold text-gray-800">⭐ 4.9 Rating</p>
                <p className="text-[10px] text-gray-400">10,000+ Devotees</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes floatDown {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(8px); }
        }
      `}</style>
    </section>
  );
};

export default TempleHero;
