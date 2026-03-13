/**
 * Order Service
 * Centralized API calls for order operations
 */

import apiClient from "./apiClient";

export const orderService = {
  // Fetch all orders
  getAll: async () => {
    try {
      const response = await apiClient.get("/Orders/all");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      throw error;
    }
  },

  // Get single order
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/Orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch order ${id}:`, error);
      throw error;
    }
  },

  // Update order status
  updateStatus: async (orderId, status) => {
    try {
      const response = await apiClient.post(
        `/Orders/admin_update_status/${orderId}`,
        null,
        {
          params: { status },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update order ${orderId} status:`, error);
      throw error;
    }
  },

  // Send order email
  sendOrderMail: async (orderId, mailType, trackingData = {}) => {
    try {
      const formData = new URLSearchParams({
        order_id: orderId,
        mail_type: mailType,
        ...trackingData,
      });

      const response = await apiClient.post("/OrderMail/send_mail", formData);
      return response.data;
    } catch (error) {
      console.error(`Failed to send mail for order ${orderId}:`, error);
      throw error;
    }
  },
};
