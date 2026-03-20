import { useNavigate } from "react-router-dom";

const SuccessModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, rgba(234,88,12,0.18), rgba(180,83,9,0.12), rgba(220,38,38,0.15))",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div
        className="text-center w-full max-w-sm"
        style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "24px",
          padding: "2.5rem 2rem",
          border: "1px solid rgba(234,88,12,0.25)",
          boxShadow: "0 8px 40px rgba(234,88,12,0.12)",
          animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "0.5rem" }}>🕉️</div>

        {/* Check circle */}
        <div
          className="flex items-center justify-center mx-auto mb-4"
          style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg,#fed7aa,#fca5a5)",
            border: "2px solid rgba(234,88,12,0.3)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <polyline
              points="5,15 11,21 23,9"
              stroke="#ea580c" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </div>

        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "#ea580c", textTransform: "uppercase", fontFamily: "serif", marginBottom: "0.4rem" }}>
          हर हर महादेव
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1c1917", fontFamily: "serif", marginBottom: "0.5rem" }}>
          Order Confirmed!
        </h2>

        <p style={{ fontSize: 13, color: "#78716c", lineHeight: 1.7, marginBottom: "0.5rem" }}>
          Your sacred offering has been accepted. 🙏
        </p>
        <p style={{ fontSize: 13, color: "#78716c", lineHeight: 1.7, marginBottom: "1.75rem" }}>
          May Mahadev bless your home with peace, prosperity, and devotion.
        </p>

        <div style={{ height: 1, background: "linear-gradient(to right,transparent,rgba(234,88,12,0.3),transparent)", marginBottom: "1.5rem" }} />

        <button
          onClick={() => { onClose(); navigate("/"); }}
          style={{
            width: "100%",
            background: "linear-gradient(135deg,#ea580c,#dc2626)",
            color: "#fff", border: "none", borderRadius: 12,
            padding: "0.85rem", fontSize: 15, fontWeight: 600,
            cursor: "pointer", fontFamily: "serif",
          }}
        >
          जय महाकाल 🔱
        </button>

        <p style={{ fontSize: 11, color: "#a8a29e", marginTop: "1rem" }}>
          Mahakal Bazar — Divine Essentials
        </p>
      </div>

      <style>{`
        @keyframes popIn {
          from { transform: scale(0.8); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SuccessModal;