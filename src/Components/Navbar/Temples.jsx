import { Package, MapPin, Clock } from "lucide-react";
import { useState, useEffect } from "react";
function Temples() {
    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTemples = async () => {
            try {
                const token = localStorage.getItem("mahakalToken");
                const res = await fetch(`${import.meta.env.VITE_API_URL}/mandir/getall`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch mandirs");
                const data = await res.json();
                setTemples(data.temples || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTemples();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-orange-700 font-semibold">Loading sacred temples...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Oops!</h3>
                    <p className="text-red-600 mb-6">{error}</p>
                    <button onClick={() => window.location.reload()}
                        className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
                    >
                        Retry </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full 
  bg-gradient-to-br 
  from-orange-50 via-orange-100 to-rose-50
  px-4 py-12 relative overflow-hidden">

            {/* Decorative Background Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-400 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full space-y-12 relative z-10">
                {/* Page Heading */}
                <div className="text-center space-y-4 
  bg-white/90 backdrop-blur-md 
  rounded-3xl p-8 
  border border-orange-200 
  shadow-xl">

                    <div className="flex items-center justify-center gap-3">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>

                        <p className="text-sm font-bold tracking-[0.3em] uppercase text-orange-600">
                            🕉️ Ujjain • Prashad Guide
                        </p>

                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold 
    bg-gradient-to-r from-orange-700 via-rose-700 to-purple-800 
    bg-clip-text text-transparent tracking-tight">
                        Sacred Temples of Ujjain
                    </h2>

                    <p className="max-w-3xl mx-auto text-base md:text-lg 
    text-gray-700 leading-relaxed">
                        Explore the divine temples, their rich history, sacred puja rituals,
                        and practical visiting tips. Plan your spiritual journey and prashad
                        offerings with complete guidance.
                    </p>
                </div>


                {/* Temple Cards */}
                <div className="grid gap-10 lg:gap-12">
                    {temples.map((temple, index) => (
                        <article
                            key={temple._id}
                            className="group relative rounded-3xl bg-gradient-to-br from-white/95 via-purple-50/95 to-rose-50/95 backdrop-blur-xl shadow-2xl shadow-purple-900/50 hover:shadow-purple-500/30 transition-all duration-500 border border-purple-200/50 overflow-hidden"
                        >
                            {/* Decorative Corner Accents */}
                            <div className="absolute top-0 left-0 w-32 h-32  rounded-br-full"></div>
                            <div className="absolute bottom-0 right-0 w-32 h-32  rounded-tl-full"></div>

                            {/* Main Content Container */}
                            <div className="flex flex-col lg:flex-row relative z-10">
                                {/* Left Side - Image Gallery */}
                                <div className="lg:w-1/2 w-full relative">
                                    {/* Main Featured Image */}
                                    <div className="relative overflow-hidden rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none h-[400px] lg:h-full group">
                                        {temple.images?.length > 0 ? (
                                            <img
                                                src={temple.images[0].url}
                                                alt={temple.title}
                                                className="w-full m-10 h-full object-cover "
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-purple-300">
                                                <Package className="w-20 h-20" />
                                            </div>
                                        )}



                                        {/* Image Count Badge */}
                                        {temple.images?.length > 1 && (
                                            <div className="absolute top-6 right-6 bg-purple-900/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl border border-purple-400/50">
                                                📸 {temple.images.length} Photos
                                            </div>
                                        )}

                                        {/* Opening Hours Badge */}
                                        <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md text-purple-900 px-5 py-3 rounded-2xl shadow-2xl border border-purple-200 flex items-center gap-2">
                                            <Clock size={20} className="text-rose-600" />
                                            <div className="text-xs">
                                                <div className="font-black text-purple-900">{temple.hours?.openingTime}</div>
                                                <div className="text-purple-600">to {temple.hours?.closingTime}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Image Thumbnails Gallery */}
                                    {temple.images?.length > 1 && (
                                        <div className="p-4 bg-gradient-to-r from-purple-50 to-rose-50 border-t border-purple-200">
                                            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                                                {temple.images.slice(0, 5).map((img, idx) => (
                                                    <button
                                                        key={img._id || idx}
                                                        className="flex-shrink-0 h-20 w-20 rounded-xl overflow-hidden border-3 border-purple-300 hover:border-yellow-400 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                                                    >
                                                        <img
                                                            src={img.url}
                                                            alt={`Gallery ${idx + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                ))}
                                                {temple.images.length > 5 && (
                                                    <div className="flex-shrink-0 h-20 w-20 rounded-xl bg-gradient-to-br from-purple-600 to-rose-600 flex items-center justify-center text-white font-bold text-xs border-3 border-purple-400 shadow-lg">
                                                        +{temple.images.length - 5}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Side - Temple Information */}
                                <div className="lg:w-1/2 w-full bg-gradient-to-br from-white via-purple-50/50 to-rose-50/50 p-8 md:p-10 flex flex-col justify-between rounded-b-3xl lg:rounded-r-3xl lg:rounded-bl-none">
                                    <div className="space-y-6">
                                        {/* Temple Title */}
                                        <div className="space-y-3">
                                            <h3 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-900 via-rose-900 to-purple-900 bg-clip-text text-transparent leading-tight">
                                                {temple.title}
                                            </h3>

                                            {/* Decorative Divider */}
                                            <div className="flex items-center gap-2">
                                                <div className="h-1 w-20 bg-gradient-to-r from-yellow-400 via-orange-500 to-rose-500 rounded-full"></div>
                                                <div className="h-1 w-1 bg-yellow-400 rounded-full"></div>
                                                <div className="h-1 w-1 bg-orange-500 rounded-full"></div>
                                                <div className="h-1 w-1 bg-rose-500 rounded-full"></div>
                                            </div>
                                        </div>

                                        {/* Short Description */}
                                        <p className="text-gray-800 text-base md:text-lg leading-relaxed border-l-4 border-purple-500 pl-5 py-2 bg-purple-50/50 rounded-r-xl italic">
                                            {temple.shortDescription}
                                        </p>

                                        {/* Rating Stars (Placeholder - add rating data to your temple object) */}
                                        <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 px-5 py-3 rounded-2xl border border-yellow-300 w-fit">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className="text-yellow-500 text-xl">
                                                        ⭐
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="text-sm font-bold text-gray-700">
                                                5.0 <span className="text-gray-500 font-normal">(248 devotees)</span>
                                            </span>
                                        </div>

                                        {/* Location & Timing Info */}
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3 bg-white/70 px-4 py-3 rounded-xl border border-purple-200 hover:border-purple-400 transition-colors">
                                                <MapPin size={22} className="text-rose-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <div className="font-bold text-gray-900 text-sm">Sacred Location</div>
                                                    <div className="text-gray-700 text-base">
                                                        {temple.location?.city}, {temple.location?.state}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 bg-white/70 px-4 py-3 rounded-xl border border-purple-200 hover:border-purple-400 transition-colors">
                                                <Clock size={22} className="text-purple-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <div className="font-bold text-gray-900 text-sm">Darshan Timings</div>
                                                    <div className="text-gray-700 text-base">
                                                        {temple.hours?.openingTime} – {temple.hours?.closingTime}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-8 space-y-3">
                                        {temple.location?.googleMapLink && (
                                            <a
                                                href={temple.location.googleMapLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-3 w-full rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-rose-600 text-white font-bold py-4 text-base hover:from-purple-700 hover:to-rose-700 active:scale-95 transition-all shadow-xl shadow-purple-500/50 hover:shadow-2xl hover:shadow-purple-600/60 border-2 border-purple-400"
                                            >
                                                <MapPin size={20} />
                                                <span>Navigate to Temple</span>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </a>
                                        )}

                                        <button className="flex items-center justify-center gap-3 w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-bold py-4 text-base hover:from-yellow-500 hover:to-orange-600 active:scale-95 transition-all shadow-xl shadow-yellow-500/50 hover:shadow-2xl border-2 border-yellow-300">
                                            <Package size={20} />
                                            <span>Book Prashad Online</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Information Sections */}
                            <div className="px-8 md:px-10 pt-8 pb-10 border-t-2 border-purple-200 bg-gradient-to-br from-white/50 to-purple-50/50 backdrop-blur-sm rounded-b-3xl space-y-8">
                                {/* History Section */}
                                <section className="space-y-3 bg-white/60 p-6 rounded-2xl border border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gradient-to-br from-purple-600 to-rose-600 text-white p-2 rounded-lg">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <h4 className="text-purple-900 font-black tracking-wide text-sm uppercase">
                                            Sacred History
                                        </h4>
                                    </div>
                                    <p className="text-gray-800 leading-relaxed text-base">
                                        {temple.history}
                                    </p>
                                </section>

                                {/* Detailed Description */}
                                <section className="space-y-3 bg-white/60 p-6 rounded-2xl border border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white p-2 rounded-lg">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h4 className="text-purple-900 font-black tracking-wide text-sm uppercase">
                                            Temple Details
                                        </h4>
                                    </div>
                                    <p className="text-gray-800 leading-relaxed text-base">
                                        {temple.detailedDescription}
                                    </p>
                                </section>

                                {/* Puja Information */}
                                <section className="space-y-3 bg-white/60 p-6 rounded-2xl border border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gradient-to-br from-rose-600 to-pink-600 text-white p-2 rounded-lg">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                            </svg>
                                        </div>
                                        <h4 className="text-purple-900 font-black tracking-wide text-sm uppercase">
                                            🙏 Puja & Rituals
                                        </h4>
                                    </div>
                                    <p className="text-gray-800 leading-relaxed text-base">
                                        {temple.pujaInfo}
                                    </p>
                                </section>

                                {/* Visiting Tips */}
                                <section className="space-y-3 bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border-2 border-yellow-300 shadow-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white p-2 rounded-lg">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h4 className="text-purple-900 font-black tracking-wide text-sm uppercase">
                                            💡 Visiting Tips
                                        </h4>
                                    </div>
                                    <p className="text-gray-800 leading-relaxed text-base font-medium">
                                        {temple.visitingTips}
                                    </p>
                                </section>
                            </div>

                            {/* Bottom Accent Bar */}
                            <div className="h-2 bg-gradient-to-r from-purple-600 via-rose-600 to-orange-500 rounded-b-3xl"></div>
                        </article>
                    ))}
                </div>

                {/* Footer Message */}
                <div className="text-center backdrop-blur-sm bg-white/5 rounded-3xl p-8 border border-white/10">
                    <p className="text-purple-100/80 text-base">
                        🕉️ May your spiritual journey be blessed • Har Har Mahadev 🙏
                    </p>
                </div>
            </div>

            {/* Enhanced Scrollbar Styles */}
            <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        
        @keyframes divine-shimmer {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }
        
        .group:hover .animate-shimmer {
            animation: divine-shimmer 2s ease-in-out infinite;
        }
    `}</style>
        </div>
    );
}

export default Temples;
