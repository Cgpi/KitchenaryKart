/**
 * ProductGrid Component
 * Reusable grid for displaying products
 */

import React from "react";
import { ProductSkeleton } from "./ProductSkeleton";

export const ProductGrid = ({
  products,
  loading,
  onProductClick,
  getFirstAvailableVariant,
  renderProduct,
  cols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
  emptyMessage = "No products found",
}) => {
  if (loading) {
    return (
      <div className={`grid ${cols} gap-4`}>
        {[...Array(18)].map((_, i) => (
          <ProductSkeleton key={i} variant="grid" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="col-span-full flex items-center justify-center py-12">
        <p className="text-center text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`grid ${cols} gap-4`}>
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => onProductClick(product)}
          className="cursor-pointer"
        >
          {renderProduct(product, getFirstAvailableVariant)}
        </div>
      ))}
    </div>
  );
};
