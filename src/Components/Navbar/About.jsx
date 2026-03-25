import React from "react";

function About() {
  return (
    <div className="min-h-screen bg-[#fffaf5] font-['Hind'] text-[#3d2c1e]">
      {/* Top Decorative Band */}
      <div className="h-1.5 bg-gradient-to-r from-[#e07b39] via-[#f5a623] to-[#c2551a]" />

      {/* Hero Section */}
      <section className="relative text-center px-6 py-14 md:py-20 overflow-hidden">
        {/* Background Om Symbol */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[180px] md:text-[260px] text-[#e07b39] opacity-5">🕉</span>
        </div>

        <div className="relative">
          <div className="inline-block bg-gradient-to-r from-[#fde8d0] to-[#fbd3aa] text-[#b8471a] text-xs font-semibold tracking-[2.5px] uppercase px-6 py-2 rounded-full border border-[#f0b07a] mb-6">
            Mahakalbazar.com
          </div>

          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl lg:text-6xl font-bold text-[#7a2e0e] leading-tight">
            हमारे बारे में
          </h1>
          <p className="text-[#a0714f] text-lg tracking-wide mt-2">About Us</p>
        </div>
      </section>

      {/* Ornament Divider */}
      <div className="flex items-center max-w-2xl mx-auto px-6 mb-12">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#e8c09a] to-transparent" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#e07b39] mx-4" />
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#e8c09a] to-transparent" />
      </div>

      {/* Cards Container */}
      <div className="max-w-3xl mx-auto px-5 pb-16 space-y-6">
        {/* Disclaimer Card */}
        <div className="bg-white border border-[#f0dcc8] rounded-2xl p-7 md:p-9 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex gap-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fde8d0] to-[#fbd3aa] flex items-center justify-center text-3xl flex-shrink-0">
            📜
          </div>
          <div>
            <div className="uppercase text-[#e07b39] text-xs font-semibold tracking-widest mb-3">
              अस्वीकरण • Disclaimer
            </div>
            <p className="text-[#5a3e2b] leading-relaxed">
              <strong className="text-[#3d2c1e]">Mahakalbazar.com</strong> एक स्वतंत्र सेवा प्रदाता है और
              इसका श्री महाकालेश्वर मंदिर प्रबंध समिति (उज्जैन) या किसी भी सरकारी संस्था से कोई आधिकारिक संबंध नहीं है।
            </p>
          </div>
        </div>

        {/* Service Card */}
        <div className="bg-white border border-[#f0dcc8] rounded-2xl p-7 md:p-9 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex gap-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fde8d0] to-[#fbd3aa] flex items-center justify-center text-3xl flex-shrink-0">
            🪔
          </div>
          <div>
            <div className="uppercase text-[#e07b39] text-xs font-semibold tracking-widest mb-3">
              हमारी सेवा • Our Service
            </div>
            <p className="text-[#5a3e2b] leading-relaxed">
              हम "प्रसाद" को एक व्यावसायिक वस्तु के रूप में नहीं बेचते। हम केवल एक{" "}
              <strong className="text-[#3d2c1e]">डिलीवरी सेवा</strong> प्रदान करते हैं — भक्तों की ओर से
              स्थानीय विक्रेताओं या मंदिर काउंटरों से प्रामाणिक प्रसाद प्राप्त कर उनके घर तक पहुँचाया जाता है।
            </p>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="bg-white border border-[#f0dcc8] rounded-2xl p-7 md:p-9 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex gap-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fde8d0] to-[#fbd3aa] flex items-center justify-center text-3xl flex-shrink-0">
            💰
          </div>
          <div>
            <div className="uppercase text-[#e07b39] text-xs font-semibold tracking-widest mb-3">
              शुल्क • Pricing
            </div>
            <p className="text-[#5a3e2b] leading-relaxed">
              वेबसाइट पर दर्शाया गया शुल्क प्रसाद की वास्तविक लागत,{" "}
              <strong className="text-[#3d2c1e]">पैकिंग, हैंडलिंग और डिलीवरी सेवाओं</strong> का मिश्रण है।
            </p>
          </div>
        </div>

        {/* Important Notice (Alert) */}
        <div className="bg-gradient-to-br from-[#fff8f2] to-[#fff3e8] border border-[#f0b07a] rounded-2xl p-7 md:p-9 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex gap-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fde8d0] to-[#fbd3aa] flex items-center justify-center text-3xl flex-shrink-0">
            ⚠️
          </div>
          <div>
            <div className="uppercase text-[#c2551a] text-xs font-semibold tracking-widest mb-3">
              महत्वपूर्ण नोट • Important Notice
            </div>
            <p className="text-[#5a3e2b] leading-relaxed">
              हम <strong className="text-[#8b2500]">Bhasm Aarti</strong> टिकट या{" "}
              <strong className="text-[#8b2500]">VIP Darshan</strong> पास उपलब्ध नहीं कराते। यदि कोई तीसरा पक्ष हमारे नाम से ऐसे दावे करता है, तो कृपया इसकी सूचना दें।
            </p>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="max-w-3xl mx-auto px-6 pb-12 text-center">
        <p className="text-[#b08060] text-sm italic">
          Images used are for representational purposes only.
        </p>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-[#fffaf5] to-[#fef3e8] border-t border-[#f0dcc8] py-10 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="font-['Playfair_Display'] text-2xl text-[#7a2e0e] mb-4 tracking-wide">
            🕉 Mahakalbazar.com
          </div>
          
          <p className="text-[#a07050] text-[15px] leading-relaxed max-w-md mx-auto">
            Hum Mahakal Mandir Samiti ke official pratinidhi nahi hain. Hum ek independent service hain jo 
            bhakton ki taraf se prasad kharid kar unke ghar tak pahunchane ka kaam karte hain.
          </p>

          <div className="mt-8 pt-6 border-t border-dashed border-[#e8c09a] text-[#c0956a] text-xs tracking-widest">
            © {new Date().getFullYear()} Mahakalbazar.com &nbsp;·&nbsp; Independent Delivery Service
          </div>
        </div>
      </footer>
    </div>
  );
}

export default About;