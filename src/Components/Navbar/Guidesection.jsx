import React from 'react';

const GuidesSection = () => {
  const guides = [
    {
      id: 1,
      title: "Mahakal Prasad Price",
      description: "Latest prasad price list aur laddu cost details dekhein. Ab update rates ke saath offline & online options.",
      href: "/mahakal-prasad-price",
      icon: "🍛",
      badge: "Updated",
      color: "from-amber-50 to-orange-50",
      hoverColor: "group-hover:from-amber-100 group-hover:to-orange-100"
    },
    {
      id: 2,
      title: "Bhasma Aarti Booking Guide",
      description: "Bhasma aarti booking process aur rules step by step. VIP darshan tips aur online booking schedule.",
      href: "/bhasma-aarti-booking",
      icon: "🕉️",
      badge: "Popular",
      color: "from-slate-50 to-gray-50",
      hoverColor: "group-hover:from-slate-100 group-hover:to-gray-100"
    },
    {
      id: 3,
      title: "Ujjain Darshan Booking",
      description: "Online darshan booking aur entry details. Slot availability, mobile app process, aur special passes.",
      href: "/ujjain-darshan-booking",
      icon: "📿",
      badge: "New",
      color: "from-yellow-50 to-amber-50",
      hoverColor: "group-hover:from-yellow-100 group-hover:to-amber-100"
    },
    {
      id: 4,
      title: "Ujjain Travel Guide",
      description: "Ujjain me kya dekhein aur travel tips. Best time to visit, local transport, nearby attractions & food.",
      href: "/ujjain-travel-guide",
      icon: "🚩",
      badge: "Essential",
      color: "from-emerald-50 to-teal-50",
      hoverColor: "group-hover:from-emerald-100 group-hover:to-teal-100"
    },
    {
      id: 5,
      title: "Mahakal Temple Timing",
      description: "Mandir ke darshan aur aarti timing dekhein. Daily schedule, special aartis, seasonal variations.",
      href: "/mahakal-temple-timing",
      icon: "⏱️",
      badge: "Daily",
      color: "from-indigo-50 to-purple-50",
      hoverColor: "group-hover:from-indigo-100 group-hover:to-purple-100"
    },
    {
      id: 6,
      title: "Rudra Abhishek Puja",
      description: "Rudrabhishek vidhi, samagri details, pandit booking, aur puja benefits in Mahakal temple.",
      href: "/rudra-abhishek-puja",
      icon: "🔱",
      badge: "New",
      color: "from-rose-50 to-pink-50",
      hoverColor: "group-hover:from-rose-100 group-hover:to-pink-100"
    },
    {
      id: 7,
      title: "Mahakal Online Donation",
      description: "Digital bhent, annadan, vastra samarpan aur temple trust donation process guide.",
      href: "/mahakal-donation",
      icon: "🙏",
      badge: "Secure",
      color: "from-blue-50 to-sky-50",
      hoverColor: "group-hover:from-blue-100 group-hover:to-sky-100"
    },
    {
      id: 8,
      title: "Festivals at Mahakal",
      description: "Shravan, Mahashivratri, Sawari vishesh, aur nagar bhraman dates & darshan guidelines.",
      href: "/mahakal-festivals",
      icon: "🎊",
      badge: "Events",
      color: "from-fuchsia-50 to-violet-50",
      hoverColor: "group-hover:from-fuchsia-100 group-hover:to-violet-100"
    },
    {
      id: 9,
      title: "Accommodation Guide",
      description: "Ujjain me dharamshala, hotels, budget stays near Mahakal temple with contact details.",
      href: "/ujjain-stay-guide",
      icon: "🏨",
      badge: "Tips",
      color: "from-cyan-50 to-blue-50",
      hoverColor: "group-hover:from-cyan-100 group-hover:to-blue-100"
    }
  ];

  return (
    <div className="w-full bg-gradient-to-br from-orange-50/40 via-white to-amber-50/30 py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section with spiritual touch and decorative elements */}
        <div className="relative text-center mb-12 md:mb-16">
          {/* Decorative Om symbol or shivling silhouette effect */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-8 opacity-10 text-8xl select-none pointer-events-none">
            🕉️
          </div>
          <div className="relative z-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold tracking-wide mb-4 shadow-sm">
              Jai Shri Mahakal 🙏
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-800 via-orange-700 to-amber-900 bg-clip-text text-transparent playfair">
              Mahakal Related Guides
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mt-4 rounded-full"></div>
            <p className="text-gray-600 max-w-2xl mx-auto mt-5 text-base md:text-lg font-medium">
              Complete spiritual companion for Mahakal darshan, rituals, travel & sacred experiences
            </p>
          </div>
        </div>

        {/* Dynamic Grid Layout - Responsive Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8">
          {guides.map((guide) => (
            <a
              key={guide.id}
              href={guide.href}
              className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-500 ease-out hover:shadow-2xl bg-white border border-gray-100/80 hover:border-amber-200"
            >
              {/* Inner gradient overlay on hover for depth */}
              <div className={`absolute inset-0 bg-gradient-to-br ${guide.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0`}></div>
              
              {/* Card Content */}
              <div className="relative z-10 p-5 md:p-6 flex flex-col h-full">
                {/* Top row with icon and badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className="text-4xl md:text-5xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2 inline-block">
                    {guide.icon}
                  </div>
                  {guide.badge && (
                    <span className={`text-[11px] md:text-xs font-bold px-2.5 py-1 rounded-full shadow-sm 
                      ${guide.badge === 'Popular' ? 'bg-red-100 text-red-700' : 
                        guide.badge === 'Updated' ? 'bg-green-100 text-green-700' :
                        guide.badge === 'New' ? 'bg-blue-100 text-blue-700' :
                        guide.badge === 'Essential' ? 'bg-amber-100 text-amber-700' :
                        guide.badge === 'Daily' ? 'bg-purple-100 text-purple-700' :
                        guide.badge === 'Secure' ? 'bg-emerald-100 text-emerald-700' :
                        guide.badge === 'Events' ? 'bg-fuchsia-100 text-fuchsia-700' :
                        'bg-gray-100 text-gray-700'}`}>
                      {guide.badge}
                    </span>
                  )}
                </div>
                
                {/* Title */}
                <h3 className="font-bold text-xl md:text-2xl mb-2 text-gray-800 group-hover:text-amber-800 transition-colors duration-300 playfair">
                  {guide.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-5 flex-grow">
                  {guide.description}
                </p>
                
                <div className="mt-2 flex items-center text-amber-700 font-semibold text-sm group-hover:text-amber-800 transition-all">
                  <span className="mr-1">Read full guide</span>
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
              
              {/* Decorative bottom border glow effect */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </a>
          ))}
        </div>

        {/* Extra Helpful Section - Unique Element: Floating CTA for Additional Support */}
        {/* <div className="mt-16 md:mt-20 relative">
          <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 rounded-3xl p-6 md:p-8 backdrop-blur-sm border border-amber-100 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="text-5xl md:text-6xl bg-white/60 p-3 rounded-full shadow-md">📿</div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 playfair">Need Personalized Guidance?</h3>
                  <p className="text-gray-600 text-sm md:text-base">Get detailed Mahakal temple darshan tips, VIP booking help & live aarti updates.</p>
                </div>
              </div>
              <a href="/mahakal-helpdesk" className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5">
                <span>Ask Mahakal Seva</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default GuidesSection;