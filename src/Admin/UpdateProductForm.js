import React, { useEffect, useState } from "react";
import axios from "axios";
const UpdateProductForm = ({
  productData,
  onCancel,
  fetchProducts,
  categories,
  subcategories,
  subsubcategories,
}) => {
  const [product, setProduct] = useState({
    name: "",
    taxPercentage: "",
    hsn_code: "",
    categoryIds: [],
    subcategoryIds: [],
    subsubcategoryIds: [],
    isNewArrival: false,
    isMostSelling: false,
    keywords:"",
  });

  const [relatedProductIds, setRelatedProductIds] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
const [loading, setLoading] = useState(false);

const token = localStorage.getItem("adminToken");
  const axiosConfig = {
    headers: {
      "x-Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    
    if (productData) {
      setProduct({
        ...product,
        name: productData.name || "",
        taxPercentage: productData.tax_percentage
          ? parseFloat(productData.tax_percentage)
          : "",
        hsn_code: productData.hsn_code || "",
        categoryIds: productData.categories?.map((c) => c.id) || [],
        subcategoryIds: productData.subcategories?.map((s) => s.id) || [],
        subsubcategoryIds:
          productData.subsubcategories?.map((ss) => ss.id) || [],
        isNewArrival: productData.is_new_arrival === "1",
        isMostSelling: productData.is_most_selling === "1",
       keywords: productData.keywords || "",
      });
      fetchAllProducts();
      fetchRelatedProducts();
    } // 🔹 ENTER KEY = MOVE TO NEXT FIELD
  const handleEnterNavigation = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      if (!form) return;

      const index = Array.prototype.indexOf.call(form, e.target);
      const next = form.elements[index + 1];
      if (next) next.focus();
    }
  };

  document.addEventListener("keydown", handleEnterNavigation);

  return () => {
    document.removeEventListener("keydown", handleEnterNavigation);
  };
  }, [productData]);

  const mapBackendToState = (data) => {
    setProduct({
      ...data,
      taxPercentage: data.tax_percentage || "",
      hsn_code: data.hsn_code || "",
      categoryIds: data.categories ? data.categories.map((c) => c.id) : [],
      subcategoryIds: data.subcategories
        ? data.subcategories.map((s) => s.id)
        : [],
      subsubcategoryIds: data.subsubcategories
        ? data.subsubcategories.map((ss) => ss.id)
        : [],
      isNewArrival: data.is_new_arrival === "1",
      isMostSelling: data.is_most_selling === "1",
      keywords :  data.keywords || "",
      
    });
  };

  const fetchAllProducts = async () => {
     setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/product/index`,axiosConfig
      );
      const filtered = res.data.filter((p) => p.id !== productData.id);
      setAllProducts(filtered);
    } catch (err) {
      console.error("Failed to load all products", err);
    }
    finally {
    setLoading(false);
  }
  };

const fetchRelatedProducts = async () => {
   setLoading(true);
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/product/related/${productData.id}`,
    );

    console.log("Fetched related products response:", res); // Full Axios response
    console.log("Fetched related products data:", res.data); // Actual data array

    if (Array.isArray(res.data)) {
      // Log each related product and its variants
      console.log("Number of related products received:", res.data.length);
      res.data.forEach((p, i) => {
        console.log(
          `Related product #${i + 1}:`,
          "ID:", p.id,
          "Name:", p.name,
          "Variants count:", p.variants?.length || 0
        );
      });

      setRelatedProducts(res.data);
      setRelatedProductIds(res.data.map((p) => Number(p.id)));

      console.log("Related product IDs set in state:", res.data.map((p) => Number(p.id)));
    } else {
      setRelatedProducts([]);
      setRelatedProductIds([]);
      console.log("No related products found or response is not an array.");
    }
  } catch (err) {
    console.error("Failed to fetch related products", err);
  }
  finally {
    setLoading(false);
  }
};



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setProduct({ ...product, [name]: checked });
    } else if (name.endsWith("Ids")) {
      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setProduct({ ...product, [name]: selectedOptions });
    } else if (name === "taxPercentage") {
      const numValue = Number(value);
      const safeValue = isNaN(numValue) ? "" : Math.max(0, Math.min(100, numValue));
      setProduct({ ...product, [name]: safeValue });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  /** 🔹 Update main product only */
  const handleUpdateProduct = async (e) => {
  e.preventDefault();

  // 🔹 Validate before submitting
  if (product.categoryIds.length === 0) {
    alert("Please select at least one category before updating the product.");
    return;
  }

  if (product.subcategoryIds.length === 0) {
    alert("Please select at least one subcategory before updating the product.");
    return;
  }

  if (!product.name.trim()) {
    alert("Product name is required.");
    return;
  }

  setLoading(true);
    try {
      const payload = {
        name: product.name,
        taxPercentage: Number(product.taxPercentage),
        hsnCode: product.hsn_code,
        isNewArrival: product.isNewArrival,
        isMostSelling: product.isMostSelling,
        categoryIds: product.categoryIds.map(Number),
        subcategoryIds: product.subcategoryIds.map(Number),
        subsubcategoryIds: product.subsubcategoryIds.map(Number),
        keywords: product.keywords,
      };

      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/product/update/${productData.id}`,
        payload,axiosConfig,
        { headers: { "Content-Type": "application/json" } }
      );

      alert("✅ Product updated successfully");
      fetchProducts();
      onCancel();
    } catch (error) {
      console.error("Error updating product:", error.response?.data || error);
      alert("❌ Failed to update product");
    }
    finally {
    setLoading(false);
  }
  };

  /** 🔹 Update related products only */
const handleUpdateRelatedProducts = async () => {
  setLoading(true);
  try {
    const relatedPayload = relatedProductIds; // just send array

    await axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/product/update_related/${productData.id}`,
      relatedPayload,axiosConfig, // send array directly
      { headers: { "Content-Type": "application/json" } }
    );

    alert("✅ Related products updated successfully");
  } catch (error) {
    console.error(
      "Error updating related products:",
      error.response?.data || error
    );
    alert("❌ Failed to update related products");
  }
  finally {
    setLoading(false);
  }
};



  const handleAddRelatedProduct = (productId) => {
    if (!relatedProductIds.includes(productId)) {
      setRelatedProductIds((prev) => [...prev, productId]);
      const productToAdd = allProducts.find((p) => p.id === productId);
      if (productToAdd) setRelatedProducts((prev) => [...prev, productToAdd]);
    }
  };

  const handleRemoveRelatedProduct = async (relatedId) => {
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/product/delete_related/${productData.id}`,axiosConfig,
        {
          data: [relatedId],
          headers: { "Content-Type": "application/json" },
        }
      );

      setRelatedProducts((prev) => prev.filter((p) => p.id !== relatedId));
      setRelatedProductIds((prev) => prev.filter((id) => id !== relatedId));
    } catch (err) {
      console.error("Failed to remove related product", err);
    }
    finally {
    setLoading(false);
  }
  };

  const handleRemoveAllRelated = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/product/delete_all_related/${productData.id}`,axiosConfig
      );
      setRelatedProductIds([]);
      setRelatedProducts([]);
      alert("✅ All related products removed");
    } catch (err) {
      console.error("Failed to remove all related", err);
    }
    finally {
    setLoading(false);
  }
  };
// ✅ Filter subcategories and subsubcategories dynamically
  const filteredSubcategories = subcategories.filter((sub) =>
    product.categoryIds.includes(sub.category_id)
  );

  const filteredSubsubcategories = subsubcategories.filter((ss) =>
    product.subcategoryIds.includes(ss.subcategory_id)
  );
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
    } else {
      const results = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !relatedProductIds.includes(p.id)
      );
      setSearchResults(results);
    }
  }, [searchQuery, allProducts, relatedProductIds]);

  return (
    <div className="max-w-4xl mx-auto border border-gray-300 rounded-lg p-6 bg-gray-50">


      {loading && (
  <div
    className="fixed inset-0 z-50 flex justify-center items-center bg-black/50"
  >
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
)}

      <h2 className="text-2xl font-bold my-4">Update Product</h2>
      <form onSubmit={handleUpdateProduct}>
        {/* BASIC FIELDS */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Name</label>
          <input
            type="text"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isNewArrival"
              checked={product.isNewArrival}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Mark as new arrival</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isMostSelling"
              checked={product.isMostSelling}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Mark as most selling</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Tax Percentage</label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              name="taxPercentage"
              value={product.taxPercentage || ""}
              onChange={handleChange}
              required
              min="0"
              max="100"
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm">%</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">HSN Code</label>
          <input
            type="text"
            name="hsn_code"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={product.hsn_code}
            onChange={handleChange}
          />
        </div>
 <div className="mb-4">
  <label htmlFor="keywords" className="block text-sm font-semibold mb-2">
    Keywords
  </label>
  <input
    type="text"
    id="keywords"
    name="keywords"
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={product.keywords}
    onChange={(e) => {
      const value = e.target.value.slice(0, 250); // limit to 250 characters
      setProduct({ ...product, keywords: value });
    }}
    placeholder="Enter Keywords"
  />
  <small className="text-xs text-gray-500">
    {product.keywords.length}/250 characters
  </small>
</div>



      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Search Categories</label>
        <select
          multiple
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={product.categoryIds}
          onChange={(e) => {
            const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
            setProduct({
              ...product,
              categoryIds: selectedIds,
              subcategoryIds: [],
              subsubcategoryIds: [],
            });
          }}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>


        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Search Subcategories</label>
          <select
            multiple
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={product.subcategoryIds}
            onChange={(e) => {
              const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
              setProduct({
                ...product,
                subcategoryIds: selectedIds,
                subsubcategoryIds: [],
              });
            }}
          >
            {filteredSubcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Search Subsubcategories</label>
          <select
            multiple
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={product.subsubcategoryIds}
            onChange={(e) => {
              const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
              setProduct({
                ...product,
                subsubcategoryIds: selectedIds,
              });
            }}
          >
            {filteredSubsubcategories.map((ss) => (
              <option key={ss.id} value={ss.id}>
                {ss.name}
              </option>
            ))}
          </select>
        </div>

        

        {/* RELATED PRODUCTS */}
        {/* RELATED PRODUCTS */}
        <div className="border border-gray-300 p-4 rounded mb-4">

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Related Products</label>
          <ul className="space-y-2">
            {relatedProducts.map((rp) => (
              <li key={rp.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>{rp.name}</span>
                <button
                  type="button"
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                  onClick={() => handleRemoveRelatedProduct(rp.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          {relatedProducts.length > 0 && (
            <button
              type="button"
              className="mt-3 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium"
              onClick={handleRemoveAllRelated}
            >
              Remove All Related
            </button>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Add Related Product</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ul className="space-y-2">
            {searchResults.map((p) => (
              <li key={p.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>{p.name}</span>
                <button
                  type="button"
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
                  onClick={() => handleAddRelatedProduct(p.id)}
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>

      {/* BUTTONS */}

  {/* Update Related Products button first */}
  <button
    type="button"
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium mb-2 block"
    onClick={handleUpdateRelatedProducts}
  >
    Update Related Products
  </button>
  </div>
<div className="flex flex-col gap-2 mt-4">

  {/* Then Update Product button */}
  <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
    Update Product
  </button>

  {/* Cancel button */}
  <button
    type="button"
    className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-gray-800 rounded-lg font-medium"
    onClick={onCancel}
  >
    Cancel
  </button>
</div>

      </form>
    </div>
  );
};

export default UpdateProductForm;
