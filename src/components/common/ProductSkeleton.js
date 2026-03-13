/**
 * ProductSkeleton Component
 * Reusable skeleton loader for products
 */

export const ProductSkeleton = ({ variant = "card" }) => {
  if (variant === "grid") {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-card">
        <div className="skeleton aspect-square" />
        <div className="p-3.5 space-y-2">
          <div className="skeleton h-2.5 w-16 rounded" />
          <div className="skeleton h-3.5 w-full rounded" />
          <div className="skeleton h-4 w-20 rounded" />
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <div className="px-2">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
        <div className="p-3.5 space-y-2">
          <div className="h-2.5 w-16 rounded bg-gray-200 animate-pulse" />
          <div className="h-3.5 w-full rounded bg-gray-200 animate-pulse" />
          <div className="h-3.5 w-3/4 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-20 rounded bg-amber-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
