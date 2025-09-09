import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppLayout from "./components/Layout/AppLayout";
import AppRoutes from "./routes/AppRoutes";
function App() {
  return (
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  );
}

export default App;
