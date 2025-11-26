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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
            <div className="w-full mx-auto space-y-8">
                <div className="w-full flex justify-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-orange-600 tracking-wide 
                 drop-shadow-sm text-center w-full">
                        Temples in Ujjain Where You Can Buy Prashad
                    </h2>
                </div>


                {temples.map((temple) => (
                    <div key={temple._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <div className="flex flex-col lg:flex-row min-h-[50vh]">

                            {/* Left Image Section */}
                            <div className="lg:w-[70%] w-full relative bg-gray-100 overflow-hidden rounded-xl h-64 lg:h-auto">
                                {temple.images?.length > 0 ? (
                                    <img
                                        src={temple.images[0].url}
                                        alt={temple.title}
                                        className="w-full h-100 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Package className="w-12 h-12" />
                                    </div>
                                )}

                                {temple.images?.length > 1 && (
                                    <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                                        +{temple.images.length - 1}
                                    </div>
                                )}
                            </div>

                            {/* Right Info Section */}
                            <div className="lg:w-[30%] w-full bg-gradient-to-br from-orange-50 to-red-50 p-7 flex flex-col justify-between rounded-xl lg:rounded-none">
                                <div className="space-y-5">
                                    <h2 className="text-3xl font-bold text-orange-700">{temple.title}</h2>

                                    <p className="text-gray-700 text-lg leading-relaxed italic border-l-4 border-orange-500 pl-3">
                                        {temple.shortDescription}
                                    </p>

                                    <div className="flex items-center gap-3 text-base text-gray-700">
                                        <MapPin size={18} className="text-orange-600" />
                                        <span className="font-semibold">
                                            {temple.location?.city}, {temple.location?.state}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 text-base text-gray-700">
                                        <Clock size={18} className="text-orange-600" />
                                        <span className="font-semibold">
                                            {temple.hours?.openingTime} – {temple.hours?.closingTime}
                                        </span>
                                    </div>
                                </div>

                                {temple.location?.googleMapLink && (
                                    <a
                                        href={temple.location.googleMapLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-6 inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-all duration-200 shadow-md"
                                    >
                                        <MapPin size={18} />
                                        View on Google Maps
                                    </a>
                                )}
                            </div>

                        </div>

                        <div className="p-8 space-y-6 border-t border-orange-200 bg-white">
                            <p className="text-gray-800 text-lg leading-relaxed">
                                <span className="font-bold text-orange-700">Detailed Description:</span><br />
                                {temple.detailedDescription}
                            </p>
                            <p className="text-gray-800 text-lg leading-relaxed">
                                <span className="font-bold text-orange-700">History:</span><br />
                                {temple.history}
                            </p>
                            <p className="text-gray-800 text-lg leading-relaxed">
                                <span className="font-bold text-orange-700">Puja Info:</span><br />
                                {temple.pujaInfo}
                            </p>
                            <p className="text-gray-800 text-lg leading-relaxed">
                                <span className="font-bold text-orange-700">Visiting Tips:</span><br />
                                {temple.visitingTips}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Temples;
