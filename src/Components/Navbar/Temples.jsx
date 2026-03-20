import { MapPin, Clock, Star, Shield, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

// ─── Dharmic Loader ───────────────────────────────────────────────────────────
const DharmicLoader = () => {
  const messages = ["🙏 Loading sacred temples...", "🕉️ Seeking Mahadev's blessings...", "🪔 Preparing the divine guide...", "🔱 Almost ready..."];
  const [msgIndex, setMsgIndex] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setMsgIndex((p) => (p + 1) % messages.length), 1800);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(135deg,rgba(255,237,213,0.93),rgba(254,215,170,0.89),rgba(252,165,165,0.86))", backdropFilter: "blur(16px)" }}>
      <div className="relative flex items-center justify-center mb-8">
        <div className="w-28 h-28 rounded-full border-4 border-orange-200 border-t-orange-500 border-r-orange-400" style={{ animation: "spin 1.2s linear infinite" }} />
        <div className="absolute w-20 h-20 rounded-full border-2 border-red-300 border-b-red-500" style={{ animation: "spinReverse 1.8s linear infinite" }} />
        <div className="absolute text-4xl" style={{ animation: "pulse 2s ease-in-out infinite" }}>🕉️</div>
      </div>
      <div className="flex gap-2 mb-6">{[0,1,2,3,4].map((i) => (
        <div key={i} className="w-2 h-2 rounded-full bg-orange-500" style={{ animation: `bounce 1.2s ease-in-out ${i*0.15}s infinite` }} />
      ))}</div>
      <p key={msgIndex} className="text-orange-800 font-semibold text-lg text-center px-6" style={{ animation: "fadeIn 0.5s ease-in" }}>{messages[msgIndex]}</p>
      <p className="text-orange-600 text-sm mt-2 opacity-70">हर हर महादेव 🔱</p>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes spinReverse{to{transform:rotate(-360deg)}}
        @keyframes bounce{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(-8px);opacity:1}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
      `}</style>
    </div>
  );
};

// ─── Collapsible Section ──────────────────────────────────────────────────────
const Section = ({ title, content, isExpanded, onToggle }) => {
  if (!content) return null;
  const preview = content.length > 160 ? content.slice(0, 160) + "…" : content;
  return (
    <div className="rounded-2xl overflow-hidden transition-all"
      style={{ border: "1px solid rgba(234,88,12,0.14)", background: "rgba(255,255,255,0.7)" }}>
      <button onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-orange-50/60 transition-colors">
        <span className="font-bold text-gray-800 text-sm">{title}</span>
        <ChevronDown size={16} className={`text-orange-500 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
      </button>
      <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-orange-50">
        {isExpanded ? content : preview}
      </div>
    </div>
  );
};

// ─── 4-Image Grid ─────────────────────────────────────────────────────────────
const ImageGrid = ({ images, title }) => {
  const [active, setActive] = useState(0);
  const show = images?.slice(0, 4) || [];
  const extra = (images?.length || 0) - 4;

  return (
    <div className="p-3 sm:p-4" style={{ background: "linear-gradient(135deg,#fff7ed,#fef9f5)" }}>
      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden mb-3 shadow-md" style={{ height: "220px", border: "2px solid rgba(234,88,12,0.12)" }}>
        <img
          src={show[active]?.url || "/shivmahakal.png"}
          alt={title}
          className="w-full h-full object-cover transition-all duration-500"
        />
        {/* Overlay badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="text-xs font-bold text-white px-2.5 py-1 rounded-full"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
            📸 {images?.length || 0} Photos
          </span>
        </div>
      </div>

      {/* 4-thumbnail row */}
      {show.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {show.map((img, idx) => (
            <button key={idx} onClick={() => setActive(idx)}
              className="relative rounded-xl overflow-hidden transition-all duration-200 hover:scale-105"
              style={{
                height: "64px",
                border: active === idx ? "2px solid #ea580c" : "2px solid rgba(234,88,12,0.15)",
                boxShadow: active === idx ? "0 0 0 2px rgba(234,88,12,0.2)" : "none",
              }}>
              <img src={img.url} alt={`View ${idx+1}`} className="w-full h-full object-cover" />
              {/* Last thumb overlay if extra */}
              {idx === 3 && extra > 0 && (
                <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                  <span className="text-white font-black text-sm">+{extra}</span>
                </div>
              )}
              {active === idx && (
                <div className="absolute inset-0 ring-2 ring-inset ring-orange-400 rounded-xl" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Temple Card ──────────────────────────────────────────────────────────────
const TempleCard = ({ temple, expandedSections, toggleSection }) => (
  <article className="rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
    style={{
      background: "rgba(255,255,255,0.92)",
      border: "1px solid rgba(234,88,12,0.15)",
      boxShadow: "0 4px 24px rgba(234,88,12,0.07)",
    }}>

    {/* Top accent stripe */}
    <div className="h-1 bg-gradient-to-r from-orange-400 via-red-400 to-orange-500" />

    <div className="flex flex-col lg:flex-row">

      {/* ── Left: Image Grid ── */}
      <div className="lg:w-[420px] w-full flex-shrink-0 border-b lg:border-b-0 lg:border-r"
        style={{ borderColor: "rgba(234,88,12,0.1)" }}>
        <ImageGrid images={temple.images} title={temple.title} />

        {/* Hours strip */}
        <div className="mx-3 mb-3 px-4 py-3 rounded-2xl flex items-center gap-3"
          style={{ background: "linear-gradient(135deg,#fff7ed,#fee2e2)", border: "1px solid rgba(234,88,12,0.18)" }}>
          <Clock size={16} className="text-orange-500 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-black text-gray-900">{temple.hours?.openingTime || "N/A"}</span>
            <span className="text-gray-400 mx-2">·</span>
            <span className="font-black text-gray-900">{temple.hours?.closingTime || "N/A"}</span>
          </div>
          <span className="ml-auto flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200">
            <Star size={11} className="fill-yellow-500 stroke-yellow-500" /> 4.9
          </span>
        </div>
      </div>

      {/* ── Right: Content ── */}
      <div className="flex-1 p-4 sm:p-5 lg:p-6 flex flex-col">

        {/* Title */}
        <div className="mb-4">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">🕉️ Ujjain · Divine Temple</p>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight mb-2">{temple.title}</h2>

          {/* Location */}
          <div className="flex items-start gap-2 text-sm text-gray-500">
            <MapPin size={14} className="text-orange-400 flex-shrink-0 mt-0.5" />
            <span className="leading-snug">
              {[temple.location?.address, temple.location?.city, temple.location?.state, temple.location?.pincode]
                .filter(Boolean).join(", ")}
            </span>
          </div>
        </div>

        {/* Short description */}
        {temple.shortDescription && (
          <p className="text-sm text-gray-700 leading-relaxed mb-4 px-4 py-3 rounded-xl italic"
            style={{ background: "rgba(255,247,237,0.8)", borderLeft: "3px solid #ea580c" }}>
            {temple.shortDescription}
          </p>
        )}

        {/* Expandable sections */}
        <div className="space-y-2.5 flex-1">
          <Section
            title="📜 Sacred History"
            content={temple.history}
            isExpanded={expandedSections[`${temple._id}-history`]}
            onToggle={() => toggleSection(temple._id, "history")}
          />
          <Section
            title="🏛️ Temple Details"
            content={temple.detailedDescription}
            isExpanded={expandedSections[`${temple._id}-description`]}
            onToggle={() => toggleSection(temple._id, "description")}
          />
          <Section
            title="🙏 Puja & Rituals"
            content={temple.pujaInfo}
            isExpanded={expandedSections[`${temple._id}-puja`]}
            onToggle={() => toggleSection(temple._id, "puja")}
          />

          {/* Visiting tips — always shown */}
          {temple.visitingTips && (
            <div className="rounded-2xl px-4 py-3 text-sm text-green-800"
              style={{ background: "rgba(240,253,244,0.9)", border: "1px solid rgba(134,239,172,0.5)" }}>
              <div className="flex items-center gap-2 mb-1">
                <Shield size={14} className="text-green-600 flex-shrink-0" />
                <span className="font-bold text-green-700 text-xs uppercase tracking-wide">Visiting Tips</span>
              </div>
              <p className="leading-relaxed">{temple.visitingTips}</p>
            </div>
          )}
        </div>

        {/* Navigate CTA */}
        {temple.location?.googleMapLink && (
          <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(234,88,12,0.1)" }}>
            <a href={temple.location.googleMapLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-white font-bold text-sm transition-all hover:scale-[1.02] active:scale-95"
              style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)", boxShadow: "0 4px 14px rgba(234,88,12,0.3)" }}>
              <MapPin size={16} /> Get Directions 🔱
            </a>
          </div>
        )}
      </div>
    </div>
  </article>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
function Temples() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const token = localStorage.getItem("mahakalToken");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/mandir/getall`, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to fetch temples");
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

  const toggleSection = (templeId, section) =>
    setExpandedSections((prev) => ({ ...prev, [`${templeId}-${section}`]: !prev[`${templeId}-${section}`] }));

  if (loading) return <DharmicLoader />;

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(160deg,#fff7ed,#fef3c7,#fee2e2)" }}>
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">😔</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h3>
        <p className="text-red-500 text-sm mb-6">{error}</p>
        <button onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl text-white font-bold text-sm"
          style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)" }}>
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#fff7ed 0%,#ffffff 50%,#fff7ed 100%)" }}>

      {/* Top stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 opacity-80" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* ── Page Header ── */}
        <div className="text-center py-8 px-6 rounded-3xl"
          style={{
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(234,88,12,0.14)",
            boxShadow: "0 4px 32px rgba(234,88,12,0.07)",
          }}>
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-400" />
            <p className="text-xs font-bold text-orange-500 uppercase tracking-[0.2em]">🕉️ Ujjain · Prashad Guide 🙏</p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-400" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
            Sacred Temples of{" "}
            <span style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Ujjain
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-500 leading-relaxed mb-6">
            Explore the divine temples, their sacred history, puja rituals, and visiting guidance. Plan your spiritual journey with complete devotion.
          </p>

          {/* Stats */}
          <div className="inline-flex items-center gap-6 sm:gap-10 px-6 py-3 rounded-2xl"
            style={{ background: "linear-gradient(135deg,#fff7ed,#fee2e2)", border: "1px solid rgba(234,88,12,0.18)" }}>
            {[
              { value: `${temples.length}+`, label: "Temples" },
              { sep: true },
              { value: "24/7", label: "Darshan" },
              { sep: true },
              { value: "100+", label: "Prasad" },
            ].map((s, i) =>
              s.sep
                ? <div key={i} className="w-px h-8 bg-orange-200" />
                : <div key={i} className="text-center">
                    <p className="text-xl sm:text-2xl font-black text-orange-600">{s.value}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide">{s.label}</p>
                  </div>
            )}
          </div>
        </div>

        {/* ── Temple Cards ── */}
        <div className="space-y-6 sm:space-y-8">
          {temples.map((temple) => (
            <TempleCard
              key={temple._id}
              temple={temple}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
            />
          ))}

          {temples.length === 0 && (
            <div className="text-center py-16 rounded-3xl"
              style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(234,88,12,0.14)" }}>
              <div className="text-5xl mb-4">🏛️</div>
              <p className="text-gray-500">No temples found at the moment.</p>
            </div>
          )}
        </div>

        {/* ── Footer note ── */}
        <div className="text-center py-5 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(234,88,12,0.1)" }}>
          <p className="text-sm text-orange-600 font-semibold">
            🕉️ May your spiritual journey be blessed · हर हर महादेव 🙏
          </p>
        </div>

        {/* Bottom stripe */}
        <div className="h-1 rounded-full bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 opacity-30" />
      </div>
    </div>
  );
}

export default Temples;