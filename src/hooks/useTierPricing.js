/**
 * useTierPricing Hook
 * Extracted tier pricing logic used in ProductList, AddProductForm, UpdateProductForm
 * Reduces code duplication significantly
 */

import { useState, useCallback } from "react";

export const useTierPricing = (initialTiers = []) => {
  const [tiers, setTiers] = useState(initialTiers);

  // Handle changes to tier fields
  const handleTierChange = useCallback((index, field, value) => {
    setTiers((prevTiers) => {
      const updated = [...prevTiers];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  }, []);

  // Add new tier
  const addTier = useCallback(() => {
    setTiers((prevTiers) => [
      ...prevTiers,
      { minQty: "", maxQty: "", price: "" },
    ]);
  }, []);

  // Remove tier by index
  const removeTier = useCallback((index) => {
    setTiers((prevTiers) => prevTiers.filter((_, i) => i !== index));
  }, []);

  // Reset to initial tiers
  const resetTiers = useCallback(() => {
    setTiers(initialTiers);
  }, [initialTiers]);

  // Validate tier pricing
  const validateTiers = useCallback(() => {
    for (const tier of tiers) {
      if (!tier.minQty || !tier.maxQty || !tier.price) {
        return {
          isValid: false,
          message: "All tier fields must be filled",
        };
      }
      if (parseInt(tier.minQty) >= parseInt(tier.maxQty)) {
        return {
          isValid: false,
          message: "Min Qty must be less than Max Qty",
        };
      }
      if (parseFloat(tier.price) <= 0) {
        return {
          isValid: false,
          message: "Price must be greater than 0",
        };
      }
    }
    return { isValid: true };
  }, [tiers]);

  return {
    tiers,
    setTiers,
    handleTierChange,
    addTier,
    removeTier,
    resetTiers,
    validateTiers,
  };
};
