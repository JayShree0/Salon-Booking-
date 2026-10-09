import { ThemeProvider } from "@mui/material";
import React from "react";
import greenTheme from "./theme/greentheme";
import { Route, Routes } from "react-router-dom";
import SalonDashboard from "./Salon/SalonDashboard";
import CustomerRoutes from "./Routes/CustomerRoutes";
import ErrorBoundary from "./components/common/ErrorBoundary";

const App = () => {
  return (
    <ThemeProvider theme={greenTheme}>
      <ErrorBoundary>
        <Routes>
          <Route path="/salon-dashboard/*" element={<SalonDashboard />} />
          <Route path="*" element={<CustomerRoutes />} />
        </Routes>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
