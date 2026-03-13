/**
 * useProductList Hook
 * Centralized logic for fetching and filtering products
 */

import { useState, useEffect, useMemo } from "react";
import api from "../utils/api";

export const useProductList = (endpoint, cacheKey = null) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Check cache first if cacheKey provided
        if (cacheKey) {
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            setProducts(JSON.parse(cached));
            setLoading(false);
            // Still fetch fresh data in background
            fetchFresh();
            return;
          }
        }

        await fetchFresh();
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchFresh = async () => {
      try {
        const response = await api.get(endpoint, { timeout: 6000 });
        setProducts(response.data);
        
        // Cache if cacheKey provided
        if (cacheKey) {
          localStorage.setItem(cacheKey, JSON.stringify(response.data));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [endpoint, cacheKey]);

  // Filter products with available stock
  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.variants && product.variants.some((v) => v.stock > 0)
      ),
    [products]
  );

  // Get first available variant
  const getFirstAvailableVariant = (variants) =>
    variants.find((v) => v.stock > 0) || null;

  return {
    products,
    filteredProducts,
    loading,
    error,
    getFirstAvailableVariant,
  };
};
