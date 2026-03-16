/**
 * Product Service
 * Centralized API calls for all product-related operations
 * Returns data in same format as original API for backward compatibility
 */

import apiClient from "./apiClient";

const BASE_URL = process.env.REACT_APP_API_BASE_URL
  ? process.env.REACT_APP_API_BASE_URL.replace("/Api", "")
  : 'https://kitchenarykart.com/kitchen_app';

export const productService = {
  // Fetch all products
  getAll: async () => {
    try {
      const response = await apiClient.get("/product/index");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch products:", error);
      throw error;
    }
  },

  // Fetch single product by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/product/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      throw error;
    }
  },

  // Create new product
  create: async (formData) => {
    try {
      const response = await apiClient.post("/product/create", formData);
      return response.data;
    } catch (error) {
      console.error("Failed to create product:", error);
      throw error;
    }
  },

  // Update product
  update: async (id, formData) => {
    try {
      const response = await apiClient.post(`/product/update/${id}`, formData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update product ${id}:`, error);
      throw error;
    }
  },

  // Delete product
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/product/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete product ${id}:`, error);
      throw error;
    }
  },

  // Get variants for product
  getVariants: async (productId) => {
    try {
      const response = await apiClient.get(
        `/ProductVariants/index/${productId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch variants for product ${productId}:`, error);
      throw error;
    }
  },

  // Add variant to product
  addVariant: async (productId, variantData) => {
    try {
      const response = await apiClient.post(
        `/ProductVariants/add/${productId}`,
        variantData
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to add variant to product ${productId}:`, error);
      throw error;
    }
  },

  // Update variant
  updateVariant: async (productId, variantId, variantData) => {
    try {
      const response = await apiClient.post(
        `/ProductVariants/update/${productId}/${variantId}`,
        variantData
      );
      return response.data;
    } catch (error) {
      console.error(
        `Failed to update variant ${variantId} for product ${productId}:`,
        error
      );
      throw error;
    }
  },

  // Delete variant
  deleteVariant: async (variantId) => {
    try {
      const response = await apiClient.delete(
        `/ProductVariants/delete_variant/${variantId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to delete variant ${variantId}:`, error);
      throw error;
    }
  },

  // Search products
  search: async (query) => {
    try {
      const response = await apiClient.get("/product/search", {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to search products:", error);
      throw error;
    }
  },
};
