/**
 * useCategories Hook
 * Centralized category fetching logic
 */

import { useEffect, useState } from "react";
import {
  categoryService,
  subcategoryService,
  subsubcategoryService,
} from "../services";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await categoryService.getAll();
        // Sort alphabetically
        const sorted = data
          .map((c) => ({ ...c, name: c.name.trim() }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCategories(sorted);
      } catch (err) {
        setError(err.message || "Failed to fetch categories");
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error, setCategories };
};

/**
 * useTopCategories Hook
 */

export const useTopCategories = () => {
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await categoryService.getTop();
        const sorted = data
          .map((c) => ({ ...c, name: c.name.trim() }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setTopCategories(sorted);
      } catch (err) {
        setError(err.message || "Failed to fetch top categories");
        console.error("Error fetching top categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopCategories();
  }, []);

  return { topCategories, loading, error, setTopCategories };
};

/**
 * useSubcategories Hook
 */

export const useSubcategories = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubcategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await subcategoryService.getAll();
        const sorted = data
          .map((s) => ({ ...s, name: s.name.trim() }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setSubcategories(sorted);
      } catch (err) {
        setError(err.message || "Failed to fetch subcategories");
        console.error("Error fetching subcategories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, []);

  return { subcategories, loading, error, setSubcategories };
};

/**
 * useSubsubcategories Hook
 */

export const useSubsubcategories = () => {
  const [subsubcategories, setSubsubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubsubcategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await subsubcategoryService.getAll();
        setSubsubcategories(data);
      } catch (err) {
        setError(err.message || "Failed to fetch subsubcategories");
        console.error("Error fetching subsubcategories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubsubcategories();
  }, []);

  return { subsubcategories, loading, error, setSubsubcategories };
};
