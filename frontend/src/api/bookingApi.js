import api from "../config/api";

export const bookingApi = {
  createBooking: async (bookingRequest) => {
    const response = await api.post("/api/bookings", bookingRequest);
    return response.data;
  },

  getUserBookings: async () => {
    const response = await api.get("/api/bookings/customer");
    return response.data || [];
  },

  getSalonBookings: async () => {
    // Salon is resolved from the JWT server-side (GET /api/bookings/salon)
    const response = await api.get("/api/bookings/salon");
    return response.data || [];
  },

  updateBookingStatus: async (bookingId, status) => {
    const response = await api.put(`/api/bookings/${bookingId}/status?status=${encodeURIComponent(status)}`);
    return response.data;
  },

  getBookedSlots: async (salonId, date) => {
    const response = await api.get(`/api/bookings/slots/salon/${salonId}/date/${date}`);
    return response.data || [];
  },
};

export default bookingApi;

