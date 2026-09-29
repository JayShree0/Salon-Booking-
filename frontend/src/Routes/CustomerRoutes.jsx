import React from 'react'
import { Route, Routes } from 'react-router-dom';
import SalonDashboard from '../Salon/SalonDashboard';
import Home from '../Customer/Home/Home';
import Notifications from '../Customer/Notification/Notifications';
import Bookings from '../Customer/Booking/Bookings';
import SalonDetails from '../Customer/Salon/SalonDetails/SalonDetails';
import Navbar from '../Customer/Navbar/Navbar';
import NotFound from '../NotFound/NotFound';

const CustomerRoutes = () => {
  return (
    <div>
        <Navbar/>

        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/notifications" element={<Notifications/>} />
          <Route path="/bookings" element={<Bookings/>} />
          <Route path="/salon/:id" element={<SalonDetails/>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
    </div>
  )
}

export default CustomerRoutes