import api from "../config/api";

export const notificationApi = {
  getUserNotifications: async () => {
    const response = await api.get("/api/notifications/user");
    return response.data || [];
  },

  markAsRead: async (notificationId) => {
    const response = await api.put(`/api/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put("/api/notifications/user/read-all");
    return response.data;
  },
};

export default notificationApi;

