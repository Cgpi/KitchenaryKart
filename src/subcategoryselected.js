import React from "react";
import SubcategoryProductSection from "./SubcategoryProductSection";

const BASE = process.env.REACT_APP_API_BASE_URL;

const SubcategoryWithSubcategories = () => (
  <SubcategoryProductSection
    apiEndpoint={`${BASE}/Selected_subcategory/details_with_subcategories`}
    allProductsLink="/all-products"
    bgLight={true}
  />
);

export default SubcategoryWithSubcategories;
