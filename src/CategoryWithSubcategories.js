import React from "react";
import CategorySection from "./CategorySection";

const BASE = process.env.REACT_APP_API_BASE_URL;

/**
 * CategoryWithSubcategories
 * Supports slot prop 1–5, hitting the correct backend endpoint:
 *   slot 1 → /Selected_category/details_with_subcategories
 *   slot 2 → /Selected_category2/details_with_subcategories
 *   slot 3 → /Selected_category3/details_with_subcategories
 *   ... etc.
 *
 * Used on the homepage to render each of the 5 category sections.
 */
const CategoryWithSubcategories = ({ slot = 1 }) => {
  const suffix = slot === 1 ? "" : String(slot);
  // Pass slot number to CategorySection so it can build the See All link
  const allProductsLink = `/category-products/slot/${slot}`;

  return (
    <CategorySection
      apiEndpoint={`${BASE}/Selected_category${suffix}/details_with_subcategories`}
      allProductsLink={allProductsLink}
    />
  );
};

export default CategoryWithSubcategories;
