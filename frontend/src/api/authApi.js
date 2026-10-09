import api from "../config/api";

export const authApi = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  signup: async (userData) => {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch {
      // Ignore network or token invalidation error during logout
    } finally {
      localStorage.removeItem("jwt");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("role");
    }
  },

  getToken: () => localStorage.getItem("jwt"),
  getRole: () => localStorage.getItem("role") || "CUSTOMER",
  isAuthenticated: () => Boolean(localStorage.getItem("jwt")),
};

export default authApi;

