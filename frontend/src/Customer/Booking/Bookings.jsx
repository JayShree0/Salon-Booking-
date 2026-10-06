import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingCard, { BookingCardSkeleton } from "./BookingCard";
import EmptyState from "../../components/common/EmptyState";
import api from "../../config/api";

const Bookings = () => {
  const navigate = useNavigate();
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-[75vh]">
      {/* Header section with badge matching website aesthetic */}
      <div className="mb-6 sm:mb-8 text-left space-y-1.5">
        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold text-amber-700 bg-amber-50/90 px-3 py-1 rounded-full border border-amber-300/80 shadow-2xs">
          APPOINTMENTS & HISTORY
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Bookings
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Track upcoming appointments, view service summaries, and manage salon visits.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-4">
            <BookingCardSkeleton />
            <BookingCardSkeleton />
          </div>
        )}

        {/* Error Alert Banner */}
        {error && (
          <div role="alert" className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && bookings.length === 0 && (
          <EmptyState
            icon="📅"
            title="No Bookings Found"
            description="You don't have any appointments booked yet. Explore our premier salons and schedule your next treatment!"
            actionText="Explore Salons"
            onAction={() => navigate("/explore")}
          />
        )}

        {/* Bookings List */}
        {!loading && !error && bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} onCancel={cancelBooking} />
        ))}
      </div>
    </div>
  );
};

export default Bookings;
