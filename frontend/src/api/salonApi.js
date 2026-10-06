import api from "../config/api";

export const salonApi = {
  getAllSalons: async () => {
    const response = await api.get("/api/salons");
    return response.data || [];
  },

  searchSalons: async (query) => {
    const response = await api.get(`/api/salons/search?city=${encodeURIComponent(query)}`);
    return response.data || [];
  },

  getSalonById: async (salonId) => {
    const response = await api.get(`/api/salons/${salonId}`);
    return response.data;
  },

  getOwnerSalon: async () => {
    const response = await api.get("/api/salons/owner");
    return response.data;
  },

  createSalon: async (salonData) => {
    const response = await api.post("/api/salons", salonData);
    return response.data;
  },

  updateSalon: async (salonId, salonData) => {
    const response = await api.put(`/api/salons/${salonId}`, salonData);
    return response.data;
  },
};

export default salonApi;

