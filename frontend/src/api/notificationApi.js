import api from "../config/api";

export const notificationApi = {
  getUserNotifications: async (userId) => {
    // Backend: GET /api/notifications/user/{userId}
    const response = await api.get(`/api/notifications/user/${userId}`);
    return response.data || [];
  },

  markAsRead: async (notificationId) => {
    const response = await api.put(`/api/notifications/${notificationId}/read`);
    return response.data;
  },

  getUnreadCount: async () => {
    // Backend: GET /api/notifications/unread-count (JWT-based, no userId param needed)
    const response = await api.get("/api/notifications/unread-count");
    return typeof response.data === "number" ? response.data : 0;
  },
};

export default notificationApi;

