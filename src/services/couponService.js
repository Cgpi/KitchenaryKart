/**
 * Coupon Service
 * Centralized API calls for coupon operations
 */

import apiClient from "./apiClient";

export const couponService = {
  // Create coupons
  create: async (discountPercentage, quantity) => {
    try {
      const response = await apiClient.post("/coupons/create", null, {
        params: { discountPercentage, quantity },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to create coupons:", error);
      throw error;
    }
  },

  // Fetch all coupons
  getAll: async () => {
    try {
      const response = await apiClient.get("/coupons/all");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
      throw error;
    }
  },

  // Filter coupons
  filter: async (discountPercentage) => {
    try {
      const response = await apiClient.get("/coupons/filter", {
        params: { discountPercentage },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to filter coupons:", error);
      throw error;
    }
  },

  // Update coupon
  update: async (couponId, newCode, newDiscount) => {
    try {
      const response = await apiClient.put(
        `/coupons/edit/${couponId}`,
        {},
        {
          params: { newDiscountPercentage: newDiscount, newCode },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update coupon ${couponId}:`, error);
      throw error;
    }
  },

  // Delete single coupon
  delete: async (couponId) => {
    try {
      const response = await apiClient.delete(
        `/coupons/delete_coupon/${couponId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to delete coupon ${couponId}:`, error);
      throw error;
    }
  },

  // Delete multiple coupons
  deleteMultiple: async (couponIds) => {
    try {
      const params = new URLSearchParams();
      couponIds.forEach((id) => params.append("couponIds[]", id));

      const response = await apiClient.delete("/coupons/delete_coupon", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to delete multiple coupons:", error);
      throw error;
    }
  },
};
