import api from "../config/api";

export const serviceApi = {
  getServicesBySalon: async (salonId) => {
    const response = await api.get(`/api/service-offering/salon/${salonId}`);
    return response.data || [];
  },

  createService: async (serviceData) => {
    const response = await api.post("/api/service-offering/salon-owner", serviceData);
    return response.data;
  },

  updateService: async (serviceId, serviceData) => {
    const response = await api.put(`/api/service-offering/salon-owner/${serviceId}`, serviceData);
    return response.data;
  },

  deleteService: async (serviceId) => {
    const response = await api.delete(`/api/service-offering/salon-owner/${serviceId}`);
    return response.data;
  },
};

export default serviceApi;

