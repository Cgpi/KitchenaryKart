/**
 * Category Service
 * Centralized API calls for category operations
 */

import apiClient from "./apiClient";

const BASE_URL = process.env.REACT_APP_API_BASE_URL
  ? process.env.REACT_APP_API_BASE_URL.replace("/Api", "")
  : 'https://kitchenarykart.com/kitchen_app';

export const categoryService = {
  // Fetch all categories
  getAll: async () => {
    try {
      const response = await apiClient.get("/category/index");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw error;
    }
  },

  // Fetch top categories
  getTop: async () => {
    try {
      const response = await apiClient.get("/category/top");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch top categories:", error);
      throw error;
    }
  },

  // Get single category
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/category/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch category ${id}:`, error);
      throw error;
    }
  },

  // Create category
  create: async (formData) => {
    try {
      const response = await apiClient.post("/category/create", formData);
      return response.data;
    } catch (error) {
      console.error("Failed to create category:", error);
      throw error;
    }
  },

  // Update category
  update: async (id, formData) => {
    try {
      const response = await apiClient.post(`/category/update/${id}`, formData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update category ${id}:`, error);
      throw error;
    }
  },

  // Delete category
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/category/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete category ${id}:`, error);
      throw error;
    }
  },
};
