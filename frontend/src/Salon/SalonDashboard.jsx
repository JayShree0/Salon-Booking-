import React from "react";
import SalonDrawerList from "./components/SalonDrawerList";
import Navbar from "../Admin-Salon/Navbar";
import BookingTables from "./Booking/BookingTable";
import ServiceTables from "./Services/ServiceTable";
import TransactionTable from "./Transaction/TransactionTable";
import Catergory from "./Category/Catergory";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Home/HomePage";
import CreateServiceForm from "./Services/CreateServiceForm";
import Notifications from "../Customer/Notification/Notifications";
import Payment from "./Payment/Payment";
import SalonRoutes from "../Routes/SalonRoutes";

const SalonDashboard = () => {
  return (
    <div className="min-h-screen">
      <Navbar DrawerList={SalonDrawerList} />
      <section className="lg:flex lg:h-[90vh]">
        <div className="hidden lg:block h-full">
          <SalonDrawerList />
        </div>

        <div className="p-10 w-full lg:w-[80%] overflow-auto">
          <SalonRoutes />
        </div>
      </section>
    </div>
  );
};

export default SalonDashboard;
