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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-red-50 px-4 py-10">
            <div className="max-w-6xl mx-auto space-y-10">
                {/* Page Heading */}
                <div className="text-center space-y-3">
                    <p className="text-sm font-semibold tracking-[0.3em] uppercase text-orange-500">
                        Ujjain • Prashad Guide
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-orange-700 tracking-tight drop-shadow-sm">
                        Temples in Ujjain Where You Can Buy Prashad
                    </h2>
                    <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-600">
                        Explore famous temples, their history, puja details, and practical tips so you can plan
                        your visit and prashad purchase with ease.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid gap-8 lg:gap-10">
                    {temples.map((temple) => (
                        <article
                            key={temple._id}
                            className="relative rounded-3xl bg-white/80 backdrop-blur shadow-md shadow-orange-100 hover:shadow-2xl hover:shadow-orange-200 transition-all duration-300 border border-orange-100"
                        >
                            {/* Top: image + main info */}
                            <div className="flex flex-col lg:flex-row">
                                {/* Image */}
                                <div className="lg:w-2/3 w-full relative bg-gray-100 overflow-hidden rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none">
                                    {temple.images?.length > 0 ? (
                                        <img
                                            src={temple.images[0].url}
                                            alt={temple.title}
                                            className="w-full h-64 lg:h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-64 flex items-center justify-center text-gray-300">
                                            <Package className="w-12 h-12" />
                                        </div>
                                    )}

                                    {/* Image count badge */}
                                    {temple.images?.length > 1 && (
                                        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur">
                                            +{temple.images.length - 1} more
                                        </div>
                                    )}

                                    {/* Subtle gradient overlay at bottom for text, if needed later */}
                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent"></div>
                                </div>

                                {/* Right Info */}
                                <div className="lg:w-1/3 w-full bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 p-6 md:p-7 flex flex-col justify-between rounded-b-3xl lg:rounded-r-3xl lg:rounded-bl-none">
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="text-2xl font-bold text-orange-800 leading-snug">
                                                {temple.title}
                                            </h3>
                                        </div>

                                        <p className="text-gray-700 text-sm md:text-base leading-relaxed italic border-l-4 border-orange-500 pl-3 line-clamp-3">
                                            {temple.shortDescription}
                                        </p>

                                        <div className="space-y-3 text-sm md:text-base text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={18} className="text-orange-600 shrink-0" />
                                                <span className="font-medium">
                                                    {temple.location?.city}, {temple.location?.state}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Clock size={18} className="text-orange-600 shrink-0" />
                                                <span className="font-medium">
                                                    {temple.hours?.openingTime} – {temple.hours?.closingTime}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {temple.location?.googleMapLink && (
                                        <div className="mt-6">
                                            <a
                                                href={temple.location.googleMapLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-orange-600 text-white font-semibold py-2.5 text-sm md:text-base hover:bg-orange-700 active:bg-orange-800 transition-colors shadow-md shadow-orange-300"
                                            >
                                                <MapPin size={18} />
                                                View on Google Maps
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bottom: detailed info */}
                            <div className="px-6 md:px-8 pt-6 pb-7 border-t border-orange-100 bg-white/90 rounded-b-3xl space-y-5 text-sm md:text-base text-gray-800 leading-relaxed">
                                <section className="space-y-1.5">
                                    <h4 className="text-orange-700 font-semibold tracking-wide text-xs uppercase">
                                        Detailed Description
                                    </h4>
                                    <p className="text-gray-800">
                                        {temple.detailedDescription}
                                    </p>
                                </section>

                                <section className="space-y-1.5">
                                    <h4 className="text-orange-700 font-semibold tracking-wide text-xs uppercase">
                                        History
                                    </h4>
                                    <p className="text-gray-800">
                                        {temple.history}
                                    </p>
                                </section>

                                <section className="space-y-1.5">
                                    <h4 className="text-orange-700 font-semibold tracking-wide text-xs uppercase">
                                        Puja Info
                                    </h4>
                                    <p className="text-gray-800">
                                        {temple.pujaInfo}
                                    </p>
                                </section>

                                <section className="space-y-1.5">
                                    <h4 className="text-orange-700 font-semibold tracking-wide text-xs uppercase">
                                        Visiting Tips
                                    </h4>
                                    <p className="text-gray-800">
                                        {temple.visitingTips}
                                    </p>
                                </section>
                            </div>

                            {/* Accent bar at bottom */}
                            <div className="h-1.5 w-24 bg-gradient-to-r from-orange-500 via-red-500 to-rose-500 rounded-full mx-8 mb-4"></div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Temples;
