import { toast } from "react-toastify";

export const toastSuccess = (msg) =>
  toast.success(
    <div>
      <p
        style={{
          fontWeight: 800,
          fontSize: "13px",
          color: "#16a34a",
          margin: "0 0 2px",
        }}
      >
        🙏 जय महाकाल!
      </p>
      <p style={{ fontSize: "12px", color: "#374151", margin: 0 }}>{msg}</p>
    </div>,
  );

export const toastError = (msg) =>
  toast.error(
    <div>
      <p
        style={{
          fontWeight: 800,
          fontSize: "13px",
          color: "#dc2626",
          margin: "0 0 2px",
        }}
      >
        ❌ कुछ गड़बड़ हो गई!
      </p>
      <p style={{ fontSize: "12px", color: "#374151", margin: 0 }}>{msg}</p>
    </div>,
  );

export const toastInfo = (msg) =>
  toast.info(
    <div>
      <p
        style={{
          fontWeight: 800,
          fontSize: "13px",
          color: "#2563eb",
          margin: "0 0 2px",
        }}
      >
        🕉️ ध्यान दें!
      </p>
      <p style={{ fontSize: "12px", color: "#374151", margin: 0 }}>{msg}</p>
    </div>,
  );

export const toastWarning = (msg) =>
  toast.warning(
    <div>
      <p
        style={{
          fontWeight: 800,
          fontSize: "13px",
          color: "#ea580c",
          margin: "0 0 2px",
        }}
      >
        🔱 सावधान रहें!
      </p>
      <p style={{ fontSize: "12px", color: "#374151", margin: 0 }}>{msg}</p>
    </div>,
  );

export const toastOrderSuccess = () => {
  toast.success(
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "22px" }}>🎉</span>
        <p
          style={{
            fontWeight: 800,
            fontSize: "14px",
            color: "#16a34a",
            margin: 0,
          }}
        >
          Order Placed!
        </p>
      </div>

      <p style={{ fontSize: "12px", color: "#374151", margin: 0 }}>
        Thank you for shopping with <strong>Mahakal Bazar</strong> 🛕
      </p>

      <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
        Your sacred items will arrive soon 🙏
      </p>

      <div
        style={{
          marginTop: "4px",
          padding: "6px 10px",
          borderRadius: "10px",
          background:
            "linear-gradient(135deg,rgba(255,247,237,0.9),rgba(254,226,226,0.9))",
          border: "1px solid rgba(234,88,12,0.2)",
          fontSize: "11px",
          fontWeight: 700,
          color: "#ea580c",
        }}
      >
        🕉️ हर हर महादेव — Jai Mahakal 🔱
      </div>
    </div>,
    {
      autoClose: 5000,
      style: {
        borderRadius: "16px",
        border: "1px solid rgba(22,163,74,0.25)",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(22,163,74,0.15)",
        padding: "14px 16px",
      },
    },
  );
};
