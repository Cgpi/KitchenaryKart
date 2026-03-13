import React from "react";
import SubcategoryProductSection from "./SubcategoryProductSection";

const BASE = process.env.REACT_APP_API_BASE_URL;

const SubcategoryWithSubcategories = ({ slot = 1 }) => {
  const postfix = slot === 1 ? "" : slot;
  return (
    <SubcategoryProductSection
      apiEndpoint={`${BASE}/Selected_subcategory${postfix}/details_with_subcategories`}
      allProductsLink={slot === 1 ? "/all-products" : `/all-products${postfix}`}
      bgLight={true}
    />
  );
};

export default SubcategoryWithSubcategories;
