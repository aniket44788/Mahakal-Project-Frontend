import React, { useState } from "react";
import { Helmet } from "react-helmet";

const faqs = [
  {
    icon: "🛒",
    question: "महाकाल प्रसाद ऑनलाइन कैसे बुक करें?",
    answer:
      "हमारी वेबसाइट पर आकर प्रसाद चुनें, मात्रा (quantity) सिलेक्ट करें, अपना पता भरें और भुगतान पूरा करें। अब आप घर बैठे सीधे महाकाल का आशीर्वाद प्राप्त कर सकते हैं। UPI, कार्ड और नेट बैंकिंग सभी विकल्प उपलब्ध हैं।",
    tag: "ऑनलाइन बुकिंग",
    keywords: "महाकाल प्रसाद ऑनलाइन कैसे बुक करें, ऑनलाइन ऑर्डर",
  },
  {
    icon: "🛕",
    question: "क्या प्रसाद सीधे मंदिर से आता है?",
    answer:
      "हाँ, हमारा प्रसाद सीधे उज्जैन महाकालेश्वर मंदिर से लिया जाता है। मंदिर के पुजारी विशेष पूजा विधि से इसे तैयार करते हैं। इसकी शुद्धता और पवित्रता का पूरा ध्यान रखा जाता है और इसे विशेष पैकेजिंग में भेजा जाता है।",
    tag: "असली मंदिर प्रसाद",
    keywords: "ऑथेंटिक प्रसाद, मंदिर का प्रसाद, महाकालेश्वर प्रसाद उज्जैन",
  },
  {
    icon: "🚚",
    question: "डिलीवरी कितने दिनों में मिलेगी?",
    answer:
      "प्रसाद आमतौर पर 2–5 कार्य दिवसों में आपके घर पहुँच जाता है। मेट्रो शहरों (जैसे मुंबई, दिल्ली, बैंगलोर) में 2–3 दिन और दूर-दराज़ इलाकों में 4–5 दिन लग सकते हैं। डिस्पैच के बाद आपको SMS के माध्यम से ट्रैकिंग नंबर मिल जाएगा।",
    tag: "2–5 दिनों में डिलीवरी",
    keywords: "प्रसाद डिलीवरी समय, कितने दिन में मिलेगा, शिपिंग समय",
  },
  {
    icon: "🗺️",
    question: "क्या पूरे भारत में डिलीवरी होती है?",
    answer:
      "हाँ, हम पूरे भारत में प्रसाद की डिलीवरी करते हैं — चाहे बड़े शहर हों या छोटे गाँव। कुछ चुनिंदा देशों में अंतरराष्ट्रीय डिलीवरी भी उपलब्ध है। ऑर्डर करते समय अपना पिन कोड जरूर चेक करें।",
    tag: "पूरे भारत में सेवा",
    keywords:
      "पूरे भारत में डिलीवरी, ऑल इंडिया शिपिंग, अंतरराष्ट्रीय प्रसाद डिलीवरी",
  },
  {
    icon: "📦",
    question: "प्रसाद की ताज़गी कैसे बनी रहती है?",
    answer:
      "प्रसाद को वैक्यूम-सील और फूड-ग्रेड पैकेजिंग में पैक किया जाता है जिससे उसकी ताज़गी लंबे समय तक बनी रहती है। मंदिर से निकलते ही इसे साफ और सुरक्षित कंटेनर में पैक किया जाता है — बिना किसी मिलावट के।",
    tag: "वैक्यूम सील पैकेजिंग",
    keywords: "प्रसाद की ताज़गी, क्वालिटी पैकेजिंग, वैक्यूम सील प्रसाद",
  },
  {
    icon: "💳",
    question: "क्या कैश ऑन डिलीवरी (COD) उपलब्ध है?",
    answer:
      "हाँ, कुछ चुनिंदा शहरों में कैश ऑन डिलीवरी उपलब्ध है। प्रीपेड ऑर्डर को प्राथमिकता के साथ जल्दी डिलीवर किया जाता है। आप UPI (GPay, PhonePe, Paytm), डेबिट/क्रेडिट कार्ड और नेट बैंकिंग से भी आसानी से भुगतान कर सकते हैं।",
    tag: "COD + UPI उपलब्ध",
    keywords: "कैश ऑन डिलीवरी, COD, UPI पेमेंट, ऑनलाइन पेमेंट विकल्प",
  },
];

// ✅ FAQ Schema for Google Rich Results — this is correct structured data
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="bg-orange-50 min-h-screen font-sans">
      {/* ✅ SEO: Title, description, canonical, OG, Twitter, JSON-LD */}
      <Helmet>
        <title>
          Mahakal Prasad FAQ | Online Booking, Delivery & Poori Jankari 2024
        </title>
        <meta
          name="description"
          content="Mahakal Prasad online kaise book karein, delivery kitne din mein hoti hai, kya prasad seedha mandir se aata hai — sabhi sawaalon ke jawab. Ujjain Mahakaleshwar Mandir se asli prasad."
        />
        <meta
          name="keywords"
          content="mahakal prasad, mahakal prasad online book kaise karein, ujjain prasad delivery, mahakaleshwar prasad, prasad ghar pe mangwao, mahakal prasad price"
        />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Hindi" />
        <meta name="author" content="Mahakal Prasad" />
        <link rel="canonical" href="https://yourwebsite.com/faq" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="hi_IN" />
        <meta
          property="og:title"
          content="Mahakal Prasad FAQ — Online Booking aur Delivery Guide"
        />
        <meta
          property="og:description"
          content="Ujjain Mahakaleshwar Mandir se seedha prasad. Online booking, delivery, freshness — sabhi sawaalon ke jawab."
        />
        <meta property="og:url" content="https://yourwebsite.com/faq" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Mahakal Prasad FAQ — Poori Jankari"
        />
        <meta
          name="twitter:description"
          content="Mahakal Prasad online booking aur delivery ke baare mein sabhi sawaalon ke jawab."
        />

        {/* ✅ FAQ JSON-LD — Google Rich Results ke liye zaroori */}
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-100 via-orange-500 to-red-400 text-white text-center py-10 px-4 relative overflow-hidden">
        <span className="text-5xl block mb-2">🕉️</span>
        <span className="inline-block bg-white/20 border border-white/30 text-white text-xs font-semibold tracking-wide px-4 py-1 rounded-full mb-3">
          🙏 Jai Mahakal
        </span>
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2"
          style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}
        >
          Mahakal Prasad — Aksar Pooche Gaye Sawaal
        </h1>
        <p className="text-sm sm:text-base text-orange-100 max-w-xl mx-auto leading-relaxed">
          Ujjain Mahakaleshwar Mandir se seedha prasad — booking se lekar
          delivery tak, har sawaal ka jawab yahan hai.
        </p>
      </div>

      {/* Stats */}
      <div className="max-w-2xl mx-auto grid grid-cols-4 gap-3 px-4 -mt-5 relative z-10 mb-8">
        {[
          { val: "24/7", lbl: "Support" },
          { val: "2-5 Din", lbl: "Delivery" },
          { val: "100%", lbl: "Asli Prasad" },
          { val: "PAN India", lbl: "Delivery" },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white border border-orange-200 rounded-xl py-3 px-2 text-center shadow-sm"
          >
            <div className="text-orange-600 font-bold text-sm leading-tight">
              {s.val}
            </div>
            <div className="text-orange-900 text-xs mt-1 font-medium">
              {s.lbl}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto px-4 pb-6">
        <p className="text-center text-xs font-semibold tracking-widest text-orange-500 uppercase mb-5">
          ✦ Sawaal aur Jawab ✦
        </p>

        {/* itemScope on the wrapper for FAQPage schema */}
        <div
          itemScope
          itemType="https://schema.org/FAQPage"
          className="space-y-3"
        >
          {faqs.map((faq, i) => (
            <div
              key={i}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                openIndex === i
                  ? "border-orange-400 shadow-md"
                  : "border-orange-200 hover:shadow-sm"
              }`}
            >
              <button
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
                aria-controls={`faq-ans-${i}`}
                className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-orange-50 transition-colors"
              >
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 transition-colors ${
                    openIndex === i ? "bg-orange-500" : "bg-orange-100"
                  }`}
                >
                  {faq.icon}
                </span>
                <span
                  className="flex-1 font-semibold text-gray-900 text-sm leading-snug"
                  itemProp="name"
                  style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}
                >
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-orange-500 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {openIndex === i && (
                <div
                  id={`faq-ans-${i}`}
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                  className="px-4 pb-4 ml-12 border-t border-orange-100 pt-3"
                >
                  <p
                    className="text-gray-700 text-sm leading-relaxed"
                    itemProp="text"
                  >
                    {faq.answer}
                  </p>
                  <span className="inline-block mt-2 bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                    ✦ {faq.tag}
                  </span>
                  {/* Hidden keywords — screen readers skip, crawlers index */}
                  <span className="sr-only">{faq.keywords}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6 text-center">
          <span className="text-2xl block mb-2">🪔</span>
          <h3
            className="text-base font-bold text-gray-900 mb-1"
            style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}
          >
            Aapka sawaal jawab nahi mila?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Hamari bhakti team din-raat seva ke liye taiyar hai.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors"
              aria-label="Sampark karein"
            >
              Sampark Karein
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center px-5 py-2 bg-white text-orange-600 border border-orange-400 rounded-lg text-sm font-semibold hover:bg-orange-50 transition-colors"
              aria-label="Prasad book karein"
            >
              Prasad Book Karein
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
