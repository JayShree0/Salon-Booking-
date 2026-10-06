import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../config/api";

const HomePage = () => {
  const [report, setReport] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("/api/bookings/report"), api.get("/api/bookings/salon")])
      .then(([reportResponse, bookingResponse]) => {
        setReport(reportResponse.data);
        setBookings(bookingResponse.data || []);
      })
      .catch((requestError) => setError(requestError.response?.data?.message || requestError.message))
      .finally(() => setLoading(false));

    // The report does not contain the salon name, so we ask for the
    // owner profile separately. An owner without a salon simply has no name yet.
    api.get("/api/salons/owner")
      .then(({ data }) => setSalon(data))
      .catch(() => setSalon(null));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <p className="text-sm text-gray-500">SALON OVERVIEW</p>
          <h1 className="text-3xl font-bold">{salon?.name || "Your salon"}</h1>
        </div>
        <Link to="/salon-dashboard/account" className="text-green-800 underline">Edit salon profile</Link>
      </div>
      {error && <p role="alert" className="p-4 bg-red-50 text-red-700">{error}</p>}
      {loading ? <p>Loading your salon report...</p> : <>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-md bg-white border p-5"><p className="text-sm text-gray-500">Total earnings</p><p className="text-2xl font-bold">₹{report?.totalEarnings ?? 0}</p></div>
          <div className="rounded-md bg-white border p-5"><p className="text-sm text-gray-500">Total bookings</p><p className="text-2xl font-bold">{report?.totalBookings ?? bookings.length}</p></div>
          <div className="rounded-md bg-white border p-5"><p className="text-sm text-gray-500">Cancelled bookings</p><p className="text-2xl font-bold">{report?.cancelledBookings ?? 0}</p></div>
          <div className="rounded-md bg-white border p-5"><p className="text-sm text-gray-500">Total refunds</p><p className="text-2xl font-bold">₹{report?.totalRefunds ?? 0}</p></div>
        </div>
        <section className="rounded-md bg-white border p-5">
          <div className="flex justify-between items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold">Recent bookings</h2>
            <Link to="/salon-dashboard/bookings" className="text-sm text-green-800 underline">View all</Link>
          </div>
          {bookings.length === 0 ? <p className="text-gray-600">No bookings yet.</p> : <div className="space-y-3">
            {bookings.slice(0, 5).map((booking) => <div key={booking.id} className="flex flex-wrap justify-between gap-2 border-b pb-3">
              <span>Booking #{booking.id}</span>
              <span>{booking.startTime ? new Date(booking.startTime).toLocaleString() : "Time unavailable"}</span>
              <span>₹{booking.totalPrice}</span>
              <span>{booking.status}</span>
            </div>)}
          </div>}
        </section>
      </>}
    </div>
  );
};

export default HomePage;