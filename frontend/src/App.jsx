import { Button, ThemeProvider } from "@mui/material";
// import "./App.css";
import React from "react";
import greenTheme from "./theme/greentheme";
import Home from "./Customer/Home/Home";
import SalonDetails from "./Customer/Salon/SalonDetails/SalonDetails";
import Bookings from "./Customer/Booking/Bookings";
import Notification from "./Customer/Notification/Notification";
import Navbar from "./Customer/Navbar/Navbar";

const App = () => {
  return (
    <ThemeProvider theme={greenTheme}>
      <Navbar/>
        <Home/>
        {/* <SalonDetails /> */}
        {/* < Bookings /> */}
        {/* <Notification /> */}
    </ThemeProvider>
  );
};

export default App;
