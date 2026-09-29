import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../Salon/Home/HomePage";
import ServiceTables from "../Salon/Services/ServiceTable";
import CreateServiceForm from "../Salon/Services/CreateServiceForm";
import BookingTables from "../Salon/Booking/BookingTable";
import Catergory from "../Salon/Category/Catergory";
import TransactionTable from "../Salon/Transaction/TransactionTable";
import Notifications from "../Customer/Notification/Notifications";
import Payment from "../Salon/Payment/Payment";
import Profile from "../Salon/Profile/Profile";

const SalonRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServiceTables />} />
      <Route path="/add-services" element={<CreateServiceForm />} />
      <Route path="/bookings" element={<BookingTables />} />
      <Route path="/category" element={<Catergory />} />
      <Route path="/transaction" element={<TransactionTable />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/account" element={<Profile />} />
    </Routes>
  );
};

export default SalonRoutes;
