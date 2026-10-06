import api from "../config/api";

export const categoryApi = {
  getAllCategories: async () => {
    const response = await api.get("/api/categories");
    return response.data || [];
  },

  getCategoriesBySalon: async (salonId) => {
    const response = await api.get(`/api/categories/salon/${salonId}`);
    return response.data || [];
  },

  createCategory: async (categoryData) => {
    const response = await api.post("/api/categories/salon-owner", categoryData);
    return response.data;
  },

  deleteCategory: async (categoryId) => {
    const response = await api.delete(`/api/categories/salon-owner/${categoryId}`);
    return response.data;
  },
};

export default categoryApi;

