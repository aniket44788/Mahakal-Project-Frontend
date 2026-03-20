import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.jsx";
import { LoaderProvider } from "../utils/LoaderContext.jsx";

const clientId = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <LoaderProvider>
        <App />
      </LoaderProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
