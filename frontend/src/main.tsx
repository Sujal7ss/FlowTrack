import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, App as AntdApp } from "antd";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            // Brand colors
            colorPrimary: "#2563eb", // modern blue (slightly deeper than #1890ff)
            colorSuccess: "#16a34a", // richer green
            colorWarning: "#f59e0b", // amber (less harsh than #faad14)
            colorError: "#dc2626", // deep red for better readability

            // Neutral grays (consistent with Tailwind-like palette)
            colorTextBase: "#1f2937", // dark gray for readability
            colorTextSecondary: "#6b7280",
            colorBgBase: "#f9fafb", // light background
            colorBorder: "#e5e7eb",

            // Typography & spacing
            fontSize: 14,
            fontSizeHeading1: 32,
            fontSizeHeading2: 24,
            fontSizeHeading3: 18,
            borderRadius: 8, // slightly more rounded
            controlHeight: 40, // taller inputs/buttons for touch-friendly UI

            // Shadows
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",

            // Custom extras (optional)
            colorLink: "#2563eb",
            colorLinkHover: "#1e40af",
          },
        }}
      >
        <AntdApp>
          <App />
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>
);
