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

  logout: () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
  },

  getToken: () => localStorage.getItem("jwt"),
  getRole: () => localStorage.getItem("role") || "CUSTOMER",
  isAuthenticated: () => Boolean(localStorage.getItem("jwt")),
};

export default authApi;

