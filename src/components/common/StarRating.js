import React from "react";
import { Star } from "lucide-react";

export const StarRating = ({ rating, size = 14, className = "" }) => {
  if (!rating || Number.isNaN(rating)) return null;

  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className={`flex items-center gap-1 text-xs ${className}`}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={
              star <= rounded
                ? "fill-gold-500 text-gold-500"
                : "text-stone-200 fill-stone-100"
            }
          />
        ))}
      </div>
      <span className="text-gray-700 font-semibold ml-1">
        {rounded.toFixed(1)}
      </span>
    </div>
  );
};

