/**
 * Subcategory Service
 * Centralized API calls for subcategory operations
 */

import apiClient from "./apiClient";

export const subcategoryService = {
  // Fetch all subcategories
  getAll: async () => {
    try {
      const response = await apiClient.get("/subcategory/index");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
      throw error;
    }
  },

  // Get single subcategory
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/subcategory/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch subcategory ${id}:`, error);
      throw error;
    }
  },

  // Create subcategory
  create: async (formData) => {
    try {
      const response = await apiClient.post("/subcategory/create", formData);
      return response.data;
    } catch (error) {
      console.error("Failed to create subcategory:", error);
      throw error;
    }
  },

  // Update subcategory
  update: async (id, formData) => {
    try {
      const response = await apiClient.post(
        `/subcategory/update/${id}`,
        formData
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update subcategory ${id}:`, error);
      throw error;
    }
  },

  // Delete subcategory
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/subcategory/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete subcategory ${id}:`, error);
      throw error;
    }
  },
};

/**
 * Subsubcategory Service
 * Centralized API calls for subsubcategory operations
 */

export const subsubcategoryService = {
  // Fetch all subsubcategories
  getAll: async () => {
    try {
      const response = await apiClient.get("/subsubcategory/index");
      const raw = response.data;
      const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
        ? raw.data
        : [];
      return list;
    } catch (error) {
      console.error("Failed to fetch subsubcategories:", error);
      throw error;
    }
  },

  // Get single subsubcategory
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/subsubcategory/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch subsubcategory ${id}:`, error);
      throw error;
    }
  },

  // Create subsubcategory
  create: async (formData) => {
    try {
      const response = await apiClient.post("/subsubcategory/create", formData);
      return response.data;
    } catch (error) {
      console.error("Failed to create subsubcategory:", error);
      throw error;
    }
  },

  // Update subsubcategory
  update: async (id, formData) => {
    try {
      const response = await apiClient.post(
        `/subsubcategory/update/${id}`,
        formData
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update subsubcategory ${id}:`, error);
      throw error;
    }
  },

  // Delete subsubcategory
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/subsubcategory/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete subsubcategory ${id}:`, error);
      throw error;
    }
  },
};
