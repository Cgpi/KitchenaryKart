/**
 * useOrders Hook
 * Centralized order fetching logic
 */

import { useEffect, useState, useCallback } from "react";
import { orderService } from "../services/orderService";

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getAll();
      // Sort by ID descending (newest first)
      const sorted = [...data].sort((a, b) => b.id - a.id);
      setOrders(sorted);
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, setOrders, refetch: fetchOrders };
};
