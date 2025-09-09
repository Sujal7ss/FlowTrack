import React from "react";
import { useLocation } from "react-router-dom";
import AppLayout from "./components/Layout/AppLayout";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const location = useLocation();
  // Define routes that should NOT use AppLayout
  const noLayoutRoutes = ["/landing", "/login", "/signup"];

  const useLayout = !noLayoutRoutes.includes(location.pathname);

  return useLayout ? (
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  ) : (
    <AppRoutes />
  );
}

export default App;
