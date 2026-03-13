/**
 * useProducts Hook
 * Centralized product fetching logic
 * Can be used instead of duplicate fetch code in components
 */

import { useEffect, useState } from "react";
import { productService } from "../services/productService";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (err) {
        setError(err.message || "Failed to fetch products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error, setProducts };
};

/**
 * useProductVariants Hook
 * Fetch variants for a specific product
 */

export const useProductVariants = (productId) => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    const fetchVariants = async () => {
      setLoading(true);
      setError(null);
      try {
        const raw = await productService.getVariants(productId);
        // Normalize keys: product_code → productCode
        const normalizedData = raw.map((variant) => ({
          ...variant,
          productCode: variant.product_code,
        }));
        setVariants(normalizedData);
      } catch (err) {
        setError(err.message || "Failed to fetch variants");
        console.error("Error fetching variants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVariants();
  }, [productId]);

  return { variants, loading, error, setVariants };
};
