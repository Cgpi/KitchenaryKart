/**
 * Review Service
 * Centralized API calls for review/Q&A operations
 */

import apiClient from "./apiClient";

export const reviewService = {
  // Fetch all reviews
  getAll: async () => {
    try {
      const response = await apiClient.get("/Reviews/all");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      throw error;
    }
  },

  // Delete review
  deleteReview: async (reviewId) => {
    try {
      const response = await apiClient.delete(
        `/Reviews/delete_review/${reviewId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to delete review ${reviewId}:`, error);
      throw error;
    }
  },

  // Add reply to review
  addReply: async (reviewId, message) => {
    try {
      const formData = new URLSearchParams();
      formData.append("message", message);

      const response = await apiClient.post(
        `/Reviews/reply/${reviewId}`,
        formData
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to add reply to review ${reviewId}:`, error);
      throw error;
    }
  },

  // Delete reply
  deleteReply: async (replyId) => {
    try {
      const response = await apiClient.delete(
        `/Reviews/delete_reply/${replyId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to delete reply ${replyId}:`, error);
      throw error;
    }
  },

  // Update reply
  updateReply: async (replyId, message) => {
    try {
      const formData = new URLSearchParams();
      formData.append("message", message);

      const response = await apiClient.put(
        `/Reviews/update_reply/${replyId}`,
        formData
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update reply ${replyId}:`, error);
      throw error;
    }
  },
};
