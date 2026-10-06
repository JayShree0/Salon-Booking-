import api from "../config/api";

export const reviewApi = {
  getReviewsBySalon: async (salonId) => {
    const response = await api.get(`/api/reviews/salon/${salonId}`);
    return response.data || [];
  },

  createReview: async (salonId, reviewData) => {
    const response = await api.post(`/api/reviews/salon/${salonId}`, reviewData);
    return response.data;
  },

  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(`/api/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  deleteReview: async (reviewId) => {
    const response = await api.delete(`/api/reviews/${reviewId}`);
    return response.data;
  },
};

export default reviewApi;

