import React, { useEffect, useState } from "react";
import BookingCard from "./BookingCard";
import api from "../../config/api";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const { data } = await api.get("/api/bookings/customer");
        const bookingList = data || [];

        // Collect the service ids of every booking first, so all the services
        // can be loaded with the single "list" endpoint instead of one call each.
        const serviceIds = [...new Set(bookingList.flatMap((booking) => booking.serviceIds || []))];
        const serviceResponse = serviceIds.length
          ? await api.get(`/api/service-offering/list/${serviceIds.join(",")}`).catch(() => ({ data: [] }))
          : { data: [] };
        const services = serviceResponse.data || [];

        const details = await Promise.all(bookingList.map(async (booking) => {
          const [salonResult] = await Promise.allSettled([api.get(`/api/salons/${booking.salonId}`)]);

          return {
            ...booking,
            salon: salonResult.status === "fulfilled" ? salonResult.value.data : null,
            services: services.filter((service) => (booking.serviceIds || []).includes(service.id)),
          };
        }));
        setBookings(details);
      } catch (requestError) {
        setError(requestError.response?.data?.message || requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    try {
      await api.put(`/api/bookings/${bookingId}/status`, null, { params: { status: "CANCELLED" } });
      setBookings((current) => current.map((booking) => booking.id === bookingId ? { ...booking, status: "CANCELLED" } : booking));
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    }
  };

  return (
    <div className="px-5 md:flex flex-col items-center mt-10 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold py-5">My Bookings</h1>
      </div>

      <div className="space-y-4 md:w-[35rem]">
        {loading && <p>Loading bookings...</p>}
        {error && <p role="alert" className="text-red-700">{error}</p>}
        {!loading && !error && bookings.length === 0 && <p>You do not have any bookings yet.</p>}
        {bookings.map((booking) => <BookingCard key={booking.id} booking={booking} onCancel={cancelBooking} />)}
      </div>
    </div>
  );
};

export default Bookings;
