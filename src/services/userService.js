/**
 * User Service
 * Centralized API calls for user operations
 */

import apiClient from "./apiClient";

export const userService = {
  // Fetch all users
  getAll: async () => {
    try {
      const response = await apiClient.get("/User/all");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw error;
    }
  },

  // Fetch deactivated users
  getDeactivated: async () => {
    try {
      const response = await apiClient.get("/User/deactivated");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch deactivated users:", error);
      throw error;
    }
  },

  // Get single user
  getById: async (userId) => {
    try {
      const response = await apiClient.get(`/user/get_user_by_id/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch user ${userId}:`, error);
      throw error;
    }
  },

  // Delete (deactivate) user
  delete: async (userId) => {
    try {
      const response = await apiClient.delete(`/User/delete_user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete user ${userId}:`, error);
      throw error;
    }
  },

  // Restore user
  restore: async (userId) => {
    try {
      const response = await apiClient.put(
        `/User/restore_user/${userId}`,
        null
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to restore user ${userId}:`, error);
      throw error;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/User/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to login:", error);
      throw error;
    }
  },

  // Send broadcast email
  sendBroadcastEmail: async (subject, message, recipientType = "all") => {
    try {
      const response = await apiClient.post(
        "/User/send_broadcast_email",
        null,
        {
          params: { subject, message, recipient_type: recipientType },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to send broadcast email:", error);
      throw error;
    }
  },
};
