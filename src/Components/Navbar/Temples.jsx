import { Package, MapPin, Clock, Star, Calendar, Info, Shield, Heart } from "lucide-react";
import { useState, useEffect } from "react";

function Temples() {
    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedImageIndex, setSelectedImageIndex] = useState({});
    const [expandedSections, setExpandedSections] = useState({});

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

    const toggleSection = (templeId, section) => {
        setExpandedSections(prev => ({
            ...prev,
            [`${templeId}-${section}`]: !prev[`${templeId}-${section}`]
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    {/* Animated Om Symbol */}
                    <div className="relative">
                        <div className="w-24 h-24 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl animate-pulse">🕉️</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-orange-700 font-semibold text-lg">Loading sacred temples...</p>
                        <p className="text-sm text-orange-500 animate-pulse">Har Har Mahadev 🙏</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-orange-200">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">😔</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
                    <p className="text-red-600 mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/30"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 relative overflow-x-hidden">
            
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 relative z-10">
                
                {/* Enhanced Page Header */}
                <div className="text-center space-y-4 sm:space-y-6 bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-orange-200/50 shadow-2xl">
                    <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                        <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm sm:text-base font-bold tracking-wider text-orange-600">🕉️</span>
                            <p className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-orange-600">
                                Ujjain • Prashad Guide
                            </p>
                            <span className="text-sm sm:text-base font-bold tracking-wider text-orange-600">🙏</span>
                        </div>
                        <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-orange-500 to-transparent"></div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold">
                        <span className="bg-gradient-to-r from-orange-700 via-rose-700 to-purple-800 bg-clip-text text-transparent">
                            Sacred Temples of Ujjain
                        </span>
                    </h1>

                    <p className="max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed px-2">
                        Explore the divine temples, their rich history, sacred puja rituals,
                        and practical visiting tips. Plan your spiritual journey and prashad
                        offerings with complete guidance.
                    </p>

                    {/* Stats Counter */}
                    <div className="flex items-center justify-center gap-4 sm:gap-8 pt-4">
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-orange-600">{temples.length}+</div>
                            <div className="text-xs sm:text-sm text-gray-600">Divine Temples</div>
                        </div>
                        <div className="w-px h-8 bg-orange-200"></div>
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-orange-600">24/7</div>
                            <div className="text-xs sm:text-sm text-gray-600">Darshan Timings</div>
                        </div>
                        <div className="w-px h-8 bg-orange-200"></div>
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-orange-600">100+</div>
                            <div className="text-xs sm:text-sm text-gray-600">Prasad Varieties</div>
                        </div>
                    </div>
                </div>

                {/* Temple Cards Grid */}
                <div className="grid gap-6 sm:gap-8 lg:gap-10">
                    {temples.map((temple, index) => (
                        <TempleCard 
                            key={temple._id} 
                            temple={temple} 
                            index={index}
                            selectedImageIndex={selectedImageIndex}
                            setSelectedImageIndex={setSelectedImageIndex}
                            expandedSections={expandedSections}
                            toggleSection={toggleSection}
                        />
                    ))}
                </div>

                {/* Footer Message with Animation */}
                <div className="text-center bg-gradient-to-r from-orange-500/10 via-rose-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-orange-200/30">
                    <p className="text-sm sm:text-base text-gray-700 animate-pulse">
                        🕉️ May your spiritual journey be blessed • Har Har Mahadev 🙏
                    </p>
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}

// Enhanced Temple Card Component
const TempleCard = ({ temple, index, selectedImageIndex, setSelectedImageIndex, expandedSections, toggleSection }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    return (
        <article className="group relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-orange-200/50 overflow-hidden">
            
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-orange-200 to-rose-200 rounded-br-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-purple-200 to-orange-200 rounded-tl-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
            
            {/* Main Content - Responsive Grid */}
            <div className="flex flex-col lg:flex-row relative z-10">
                
                {/* Image Section - Responsive */}
                <div className="lg:w-5/12 w-full">
                    <div className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-full min-h-[400px] lg:min-h-[500px]">
                        {/* Main Image */}
                        <img
                            src={temple.images?.[selectedImageIndex[temple._id] || 0]?.url || temple.images?.[0]?.url || "/api/placeholder/600/800"}
                            alt={temple.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        {/* Floating Elements */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                            {/* Image Count Badge */}
                            {temple.images?.length > 0 && (
                                <div className="bg-black/60 backdrop-blur-md text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold border border-white/30 shadow-xl">
                                    📸 {temple.images.length} Photos
                                </div>
                            )}
                            
                            {/* Rating Badge */}
                            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-xl flex items-center gap-1">
                                <Star size={14} className="fill-white" />
                                4.9 (248)
                            </div>
                        </div>
                        
                        {/* Timings Badge - Mobile Optimized */}
                        <div className="absolute bottom-4 left-4 right-4 sm:left-4 sm:right-auto bg-black/60 backdrop-blur-md text-white p-3 sm:px-5 sm:py-3 rounded-2xl border border-white/30 shadow-2xl flex items-center gap-2 sm:gap-3">
                            <Clock size={18} className="text-orange-400 shrink-0" />
                            <div className="text-xs sm:text-sm">
                                <span className="font-bold">{temple.hours?.openingTime}</span>
                                <span className="mx-1 text-white/60">to</span>
                                <span className="font-bold">{temple.hours?.closingTime}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Thumbnail Gallery - Scrollable */}
                    {temple.images?.length > 1 && (
                        <div className="p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-rose-50 border-t border-orange-200">
                            <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
                                {temple.images.slice(0, 6).map((img, idx) => (
                                    <button
                                        key={img._id || idx}
                                        onClick={() => setSelectedImageIndex({...selectedImageIndex, [temple._id]: idx})}
                                        className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                                            (selectedImageIndex[temple._id] || 0) === idx 
                                                ? 'ring-3 ring-orange-500 scale-95 shadow-xl' 
                                                : 'opacity-70 hover:opacity-100 hover:scale-105'
                                        }`}
                                    >
                                        <img
                                            src={img.url}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                                {temple.images.length > 6 && (
                                    <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-orange-600 to-rose-600 flex items-center justify-center text-white font-bold text-xs border-2 border-white shadow-lg">
                                        +{temple.images.length - 6}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Content Section - Responsive */}
                <div className="lg:w-7/12 w-full p-4 sm:p-6 md:p-8 flex flex-col">
                    
                    {/* Title & Quick Info */}
                    <div className="space-y-3 sm:space-y-4">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                            {temple.title}
                        </h2>
                        
                        {/* Location */}
                        <div className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                            <MapPin size={16} className="text-orange-500 shrink-0 mt-1" />
                            <span>
                                {temple.location?.address}, {temple.location?.city}, {temple.location?.state} - {temple.location?.pincode}
                            </span>
                        </div>
                        
                        {/* Short Description - Truncated on Mobile */}
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed border-l-3 border-orange-500 pl-4 py-1 bg-orange-50/50 rounded-r-lg">
                            {temple.shortDescription}
                        </p>
                    </div>
                    
                    {/* Expandable Sections */}
                    <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
                        {/* History Section */}
                        <Section 
                            title="📜 Sacred History" 
                            content={temple.history}
                            isExpanded={expandedSections[`${temple._id}-history`]}
                            onToggle={() => toggleSection(temple._id, 'history')}
                            icon="history"
                        />
                        
                        {/* Description Section */}
                        <Section 
                            title="🏛️ Temple Details" 
                            content={temple.detailedDescription}
                            isExpanded={expandedSections[`${temple._id}-description`]}
                            onToggle={() => toggleSection(temple._id, 'description')}
                            icon="info"
                        />
                        
                        {/* Puja Section */}
                        <Section 
                            title="🙏 Puja & Rituals" 
                            content={temple.pujaInfo}
                            isExpanded={expandedSections[`${temple._id}-puja`]}
                            onToggle={() => toggleSection(temple._id, 'puja')}
                            icon="puja"
                        />
                        
                        {/* Visiting Tips - Always Visible */}
                        {temple.visitingTips && (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-5 rounded-xl border border-green-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield size={18} className="text-green-600" />
                                    <h4 className="font-bold text-green-800 text-sm sm:text-base">💡 Visiting Tips</h4>
                                </div>
                                <p className="text-sm sm:text-base text-gray-700">{temple.visitingTips}</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Action Buttons - Stack on Mobile */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6">
                        {temple.location?.googleMapLink && (
                            <a
                                href={temple.location.googleMapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-semibold text-sm sm:text-base hover:from-orange-600 hover:to-rose-600 transition-all shadow-lg shadow-orange-500/30 active:scale-95"
                            >
                                <MapPin size={18} />
                                <span>Navigate</span>
                            </a>
                        )}
                        
                        {/* <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold text-sm sm:text-base hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg shadow-purple-500/30 active:scale-95">
                            <Package size={18} />
                            <span>Book Prashad</span>
                        </button> */}
                    </div>
                </div>
            </div>
        </article>
    );
};

// Collapsible Section Component
const Section = ({ title, content, isExpanded, onToggle, icon }) => {
    const truncatedContent = content?.length > 150 ? content.substring(0, 150) + '...' : content;
    
    return (
        <div className="bg-white/50 rounded-xl border border-gray-200 overflow-hidden hover:border-orange-200 transition-colors">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-orange-50/50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg">{icon === 'history' ? '📜' : icon === 'info' ? '🏛️' : '🙏'}</span>
                    <h4 className="font-bold text-gray-800 text-sm sm:text-base">{title}</h4>
                </div>
                <svg
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-orange-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            
            {isExpanded ? (
                <div className="p-3 sm:p-4 pt-0 text-sm sm:text-base text-gray-700 border-t border-gray-200 animate-slideDown">
                    {content}
                </div>
            ) : (
                content?.length > 150 && (
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-sm sm:text-base text-gray-600">
                        {truncatedContent}
                    </div>
                )
            )}
        </div>
    );
};

export default Temples;