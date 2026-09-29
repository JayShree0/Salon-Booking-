import { Button, ThemeProvider } from "@mui/material";
// import "./App.css";
import React from "react";
import greenTheme from "./theme/greentheme";
import Home from "./Customer/Home/Home";
import SalonDetails from "./Customer/Salon/SalonDetails/SalonDetails";
import Bookings from "./Customer/Booking/Bookings";
import Notification from "./Customer/Notification/Notifications";
import Navbar from "./Customer/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import SalonDashboard from "./Salon/SalonDashboard";
import Notifications from "./Customer/Notification/Notifications";
import CustomerRoutes from "./Routes/CustomerRoutes";

const App = () => {
  return (
    <ThemeProvider theme={greenTheme}>

      <Routes>
        <Route path="/salon-dashboard/*" element={<SalonDashboard />} />
        <Route path="*" element={<CustomerRoutes />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
