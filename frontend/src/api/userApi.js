import api from "../config/api";

export const userApi = {
  getProfile: async () => {
    const response = await api.get("/api/users/profile");
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  },

  updateProfile: async (userId, userData) => {
    const response = await api.put(`/api/users/${userId}`, userData);
    return response.data;
  },
};

export default userApi;

