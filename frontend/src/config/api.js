import axios from "axios";

export const API_BASE_URL = "http://localhost:5000"

const api = axios.create({
    baseURL: API_BASE_URL,
})

api.defaults.headers.post["Content-Type"] = "application/json";

const isPublicEndpoint = (method, url) => {
    if (!url) return false;
    const cleanUrl = url.split("?")[0];
    const upperMethod = (method || "GET").toUpperCase();

    if (cleanUrl.startsWith("/auth/") || cleanUrl.startsWith("/api/notifications/ws")) {
        return true;
    }

    if (upperMethod === "GET") {
        if (cleanUrl.startsWith("/api/salons/owner")) {
            return false;
        }
        if (cleanUrl.includes("salon-owner")) {
            return false;
        }
        if (cleanUrl === "/api/salons" || cleanUrl.startsWith("/api/salons/") || cleanUrl.startsWith("/salons")) {
            return true;
        }
        if (cleanUrl.startsWith("/api/categories") || cleanUrl.startsWith("/api/service-offering")) {
            return true;
        }
        if (cleanUrl.startsWith("/api/bookings/slots") || cleanUrl.startsWith("/api/reviews")) {
            return true;
        }
    }

    return false;
};

api.interceptors.request.use((config) => {
    const jwt = localStorage.getItem("jwt");

    if (jwt && jwt !== "null" && jwt !== "undefined" && !isPublicEndpoint(config.method, config.url)) {
        config.headers.Authorization = `Bearer ${jwt}`;
    }

    return config;
});

let refreshRequest = null;

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const request = error.config;

        if (error.response?.status !== 401 || !request || request._retry || request.url?.startsWith("/auth/")) {
            return Promise.reject(error);
        }

        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
            localStorage.removeItem("jwt");
            localStorage.removeItem("role");
            return Promise.reject(error);
        }

        request._retry = true;

        try {
            if (!refreshRequest) {
                refreshRequest = axios.get(`${API_BASE_URL}/auth/access-token/refresh-token/${encodeURIComponent(refreshToken)}`)
                    .then(({ data }) => {
                        localStorage.setItem("jwt", data.jwt);
                        if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
                        return data.jwt;
                    })
                    .finally(() => { refreshRequest = null; });
            }

            const jwt = await refreshRequest;
            request.headers.Authorization = `Bearer ${jwt}`;
            return api(request);
        } catch (refreshError) {
            localStorage.removeItem("jwt");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("role");
            return Promise.reject(refreshError);
        }
    }
);

export default api