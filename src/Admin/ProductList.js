/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import AddProductForm from './AddProductForm';
import UpdateProductForm from './UpdateProductForm';
import logo from "../images/piclogo.png";

const ProductList = () => {
    const [products, setProducts] = useState([]);
   
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isAddingVariant, setIsAddingVariant] = useState(false);
    const [tierPricing, setTierPricing] = useState([{ minQty: "", maxQty: "", price: "" }]);

    const [variantDetails, setVariantDetails] = useState({
        productCode:'',
        color: '',
        dimensions: '',
        price: '',
        stock: '',
        inStock: '',
        quantity: '',
        description: '',
        keyFeatures: '',
        otherDimensions: '',
        productWeight: '',
        power: '',
        material: '',
        capacity: '',
        includedComponents: '',
        // productGrossWeight:'',
        voltage:'',
        shape:'',
        numberOfCompartments:'',
        images: [], // Added images field to store current images
        tierPrices: [], 
    });
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [subsubcategories, setSubsubcategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [selectedStockStatus, setSelectedStockStatus] = useState('');
    const [variants, setVariants] = useState([]); 
    const [showVariants, setShowVariants] = useState(false);
    const [selectedVariantImages, setSelectedVariantImages] = useState([]);
    const [isEditingVariant, setIsEditingVariant] = useState(false); 
    const [variantToEdit, setVariantToEdit] = useState(null);
    const [selectedImageIndicesToDelete, setSelectedImageIndicesToDelete] = useState([]);
    const [tierPriceIdsToDelete, setTierPriceIdsToDelete] = useState([]);
    const [selectedVideoFile, setSelectedVideoFile] = useState(null);
    const [deleteVideo, setDeleteVideo] = useState(false);
     const [loading, setLoading] = useState(false);
    const [productsLoading, setProductsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
   


    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchSubcategories();
        fetchSubsubcategories();

    }, []);
    useEffect(() => {
  const handleEnterNavigation = (e) => {
    if (e.key !== "Enter") return;

    const tag = e.target.tagName;
    if (!["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;

    e.preventDefault();

    const fields = Array.from(document.querySelectorAll("input, textarea, select"));
    const index = fields.indexOf(e.target);

    if (index >= 0 && index < fields.length - 1) {
      fields[index + 1].focus();
    }
  };

  document.addEventListener("keydown", handleEnterNavigation);
  return () => document.removeEventListener("keydown", handleEnterNavigation);
}, []);


   const handleTierChange = (index, field, value) => {
  const updated = [...tierPricing];
  updated[index][field] = value;
  setTierPricing(updated);
};

const addTier = () => {
  setTierPricing([...tierPricing, { minQty: "", maxQty: "", price: "" }]);
};

const removeTier = (index) => {
  const updated = [...tierPricing];
  updated.splice(index, 1);
  setTierPricing(updated);
};
const handleAddTierPrice = () => {
  const newTier = {
    id: null, // New tier (no ID)
    minQty: "",
    maxQty: "",
    price: "",
  };

  setVariantDetails((prev) => ({
    ...prev,
    tierPrices: [...prev.tierPrices, newTier],
  }));
};
const handleTierPriceChange = (index, field, value) => {
  const updated = [...variantDetails.tierPrices];
  updated[index] = {
    ...updated[index],
    [field]: value,
  };
  setVariantDetails((prev) => ({ ...prev, tierPrices: updated }));
};

const handleDeleteTierPrice = (index) => {
  const tierToDelete = variantDetails.tierPrices[index];
  const isExisting = tierToDelete?.id != null;

  if (isExisting) {
    setTierPriceIdsToDelete((prev) => [...prev, tierToDelete.id]);
  }

  const updated = variantDetails.tierPrices.filter((_, i) => i !== index);

  setVariantDetails((prev) => ({
    ...prev,
    tierPrices: updated,
  }));
};


   const fetchProducts = async () => { 
  setProductsLoading(true);
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/index`);
    let data = response.data;
    // Sort by ID descending: newest first
    data.sort((a, b) => b.id - a.id);
    setProducts(data);
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    setProductsLoading(false);
  }
};


    const fetchCategories = async () => {
      setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/category/index`);
            setCategories(response.data);
        } catch (error) { 
            console.error('Error fetching Categories:', error);
        }
        finally {
      setLoading(false);
    }
    };

    const fetchSubcategories = async () => {
      setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/subcategory/index`);
            setSubcategories(response.data);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
        finally {
      setLoading(false);
    }
    };

  
  const fetchSubsubcategories = async () => {
    
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/subsubcategory/index`);
      setSubsubcategories(res.data.data || []);
    } catch (err) {
      console.error('âŒ Error fetching subsubcategories:', err);
    } finally {
      setLoading(false);
    }
  };

   const fetchVariants = async (productId) => {
    setLoading(true);
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/ProductVariants/index/${productId}`
    );

    // Normalize keys: map product_code â†’ productCode
    const normalizedData = response.data.map((variant) => ({
      ...variant,
      productCode: variant.product_code,
    }));

    setVariants(normalizedData);
    setShowVariants(true);
  } catch (error) {
    console.error("Error fetching variants:", error);
  }
  finally {
      setLoading(false);
    }
};



    const handleCloseVariants = () => {
        setVariants([]);
        setShowVariants(false);
    };

  const handleVariantImageChange = (e) => {
  let files = Array.from(e.target.files);
  const maxTotalSize = 8 * 1024 * 1024; // 8MB

  // Calculate total size
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  if (totalSize > maxTotalSize) {
    alert("Total image size should not exceed 8MB. Please upload smaller images.");
    e.target.value = "";
    return;
  }

  // --- Sorting Logic ---
  files.sort((a, b) => {
    const nameA = a.name.split(".")[0];
    const nameB = b.name.split(".")[0];

    const numA = Number(nameA);
    const numB = Number(nameB);

    const isNumA = !isNaN(numA);
    const isNumB = !isNaN(numB);

    // Case 1: both numeric â†’ sort numerically
    if (isNumA && isNumB) return numA - numB;

    // Case 2: only A numeric â†’ A comes first
    if (isNumA && !isNumB) return -1;

    // Case 3: only B numeric â†’ B comes first
    if (!isNumA && isNumB) return 1;

    // Case 4: both not numeric â†’ alphabetical sort
    return nameA.localeCompare(nameB);
  });

  // Set sorted images
  setSelectedVariantImages(files);
};



    const handleSelectImageToDelete = (index) => {
        setSelectedImageIndicesToDelete((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    
   // âœ… Handle Edit Variant (mapping snake_case â†’ camelCase for frontend form)
const handleEditVariant = (variant) => {
  setVariantDetails({
    productCode: variant.product_code || "",     // snake_case â†’ camelCase
    color: variant.color || "",
    dimensions: variant.dimensions || "",
    price: variant.price || "",
    stock: variant.stock || "",
    inStock: variant.in_stock || "",
    quantity: variant.quantity || "",
    description: variant.description || "",
    keyFeatures: variant.keyFeatures || "",
    otherDimensions: variant.otherDimensions || "",
    productWeight: variant.product_weight || "",
    power: variant.power || "",
    material: variant.material || "",
    capacity: variant.capacity || "",
    includedComponents: variant.included_components || "",
    voltage: variant.voltage || "",
    shape: variant.shape || "",
    numberOfCompartments: variant.number_of_compartments || "",
    images: variant.images || [],
    videoUrl: variant.video_url || "",
     tierPrices: (variant.tierPrices || []).map(t => ({
      id: t.id,
      minQty: t.min_qty,   // snake_case â†’ camelCase
      maxQty: t.max_qty,   // snake_case â†’ camelCase
      price: t.price,
    })),
  });

  setSelectedImageIndicesToDelete([]);
  setSelectedVariantImages([]);
  setTierPriceIdsToDelete([]);
  setSelectedVideoFile(null);
  setDeleteVideo(false);
  setVariantToEdit(variant);
  setIsEditingVariant(true);
};

// âœ… Update Variant (sending camelCase keys expected by backend)
const updateVariant = async (productId) => {
  setLoading(true);
  try {
    if (!variantToEdit) {
      alert("No variant selected to update.");
      return;
    }

    const formData = new FormData();
     const appendIfExists = (key, value) => {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return; // âŒ do not send anything
  }
  formData.append(key, value);
};

    const {
      productCode,
      color,
      dimensions,
      price,
      stock,
      includedComponents,
      description,
      keyFeatures,
      otherDimensions,
      productWeight,
      power,
      material,
      capacity,
      voltage,
      shape,
      numberOfCompartments,
      tierPrices,
    } = variantDetails;

    // ðŸ“ Basic fields
    if (productCode) appendIfExists("product_code", productCode);

    if (color) appendIfExists("color", color);
    if (dimensions) appendIfExists("dimensions", dimensions);
    if (price !== "") appendIfExists("price", parseFloat(price));
    if (stock !== "") appendIfExists("stock", parseInt(stock));
    if (includedComponents) appendIfExists("includedComponents", includedComponents);
    if (description) appendIfExists("description", description);
    if (keyFeatures) appendIfExists("keyFeatures", keyFeatures);
    if (otherDimensions) appendIfExists("otherDimensions", otherDimensions);
    if (productWeight) appendIfExists("productWeight", productWeight);
    if (power) appendIfExists("power", power);
    if (material) appendIfExists("material", material);
    if (capacity) appendIfExists("capacity", capacity);
    if (voltage) appendIfExists("voltage", voltage);
    if (shape) appendIfExists("shape", shape);
    if (numberOfCompartments) appendIfExists("numberOfCompartments", numberOfCompartments);

    // ðŸ–¼ï¸ New Images
    if (selectedVariantImages && selectedVariantImages.length > 0) {
      Array.from(selectedVariantImages).forEach((file) => {
        formData.append("newImages[]", file);
      });
    }

    if (selectedImageIndicesToDelete.length > 0) {
  selectedImageIndicesToDelete.forEach((index) => {
    formData.append("deleteImageIndices[]", index);
  });
}


    // ðŸ“¦ Tier Pricing
   if (Array.isArray(tierPrices)) {
  tierPrices.forEach((tier, index) => {
    if (tier?.id) formData.append(`tierPriceIds[${index}]`, tier.id);
    formData.append(`min_qty[${index}]`, tier.minQty);
    formData.append(`max_qty[${index}]`, tier.maxQty);
    formData.append(`tierPrices[${index}]`, tier.price);
  });
}


    if (tierPriceIdsToDelete && tierPriceIdsToDelete.length > 0) {
      tierPriceIdsToDelete.forEach((id) => {
        formData.append("tierPriceIdsToDelete", id);
      });
    }

    // ðŸ“¹ Video
    if (selectedVideoFile) {
      formData.append("videoFile", selectedVideoFile);
    }

    // ðŸ—‘ï¸ Delete video flag
    formData.append("deleteVideo", deleteVideo);

    const token = localStorage.getItem("adminToken");
    await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/ProductVariants/update/${productId}/${variantToEdit.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-Authorization": `Bearer ${token}`,
        },
      }
    );

    alert("Variant updated successfully");
    fetchVariants(productId);
    setIsEditingVariant(false);

    // Reset form
    setVariantDetails({
      productCode: "",
      color: "",
      dimensions: "",
      price: "",
      stock: "",
      includedComponents: "",
      description: "",
      keyFeatures: "",
      otherDimensions: "",
      productWeight: "",
      power: "",
      material: "",
      capacity: "",
      voltage: "",
      shape: "",
      numberOfCompartments: "",
      tierPrices: [],
      images: [],
    });

    setSelectedVariantImages([]);
    setSelectedVideoFile(null);
    setSelectedImageIndicesToDelete([]);
    setTierPriceIdsToDelete([]);
  } catch (error) {
    console.error("Error updating variant:", error);
    alert("An error occurred while updating the variant.");
  }finally {
      setLoading(false);
    }

};


    
    const handleCancelEditVariant = () => {
        setVariantDetails({
            // productCode:'',
            color: '',
            dimensions: '',
            price: '',
            stock: '',
        });
        setIsEditingVariant(false);
        setSelectedVariantImages([]);
    };
const handleDeleteProduct = async (productId) => {
  setLoading(true);
    if (window.confirm('Are you sure you want to delete this product?')) {
        try {
            // If your backend requires token, keep this
            const token = localStorage.getItem('adminToken');

            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/product/delete/${productId}`, {
                headers: {
                    "x-Authorization": `Bearer ${token}`, // optional based on backend
                },
            });

            alert('Product deleted successfully');
            fetchProducts(); // refresh the product list
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product.');
        }finally {
      setLoading(false);
    }
    }
    
};


    const handleEditProduct = (product) => {
        setCurrentProduct(product);
        setIsEditing(true);
    };

    const handleCloseEdit = () => {
        setCurrentProduct(null);
        setIsEditing(false);
    };
    

   const addVariant = async (productId) => {
    setLoading(true);
    const {
        productCode,
        color,
        dimensions,
        price,
        stock,
        
        description,
        keyFeatures,
        otherDimensions,
        productWeight,
        power,
        material,
        capacity,
        includedComponents,
        voltage,
        shape,
        numberOfCompartments,
    } = variantDetails;

    const formData = new FormData();
    const appendIfExists = (key, value) => {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return; // âŒ do not send anything
  }
  formData.append(key, value);
};


    // Append variant images
    Array.from(selectedVariantImages).forEach((file) => {
  formData.append("images[]", file);
});


  // âœ… Append video
if (selectedVideoFile) {
    formData.append("videoFile", selectedVideoFile);
}

// âœ… Use snake_case keys to match PHP API
appendIfExists("product_code", productCode);
appendIfExists("color", color);
appendIfExists("dimensions", dimensions);
appendIfExists("price", price);
appendIfExists("stock", stock);
appendIfExists("description", description);
appendIfExists("includedComponents", includedComponents);
appendIfExists("productGrossWeight", variantDetails.productGrossWeight || "");
appendIfExists("otherDimensions", otherDimensions);
appendIfExists("productWeight", productWeight);
appendIfExists("power", power);
appendIfExists("material", material);
appendIfExists("capacity", capacity);
appendIfExists("voltage", voltage);
appendIfExists("shape", shape);
appendIfExists("numberOfCompartments", numberOfCompartments);

// âœ… Stringify array fields
appendIfExists("keyFeatures", JSON.stringify(keyFeatures));
appendIfExists("minQty", JSON.stringify(tierPricing.map(t => parseInt(t.minQty))));
appendIfExists("maxQty", JSON.stringify(tierPricing.map(t => parseInt(t.maxQty))));
appendIfExists("tierPrices", JSON.stringify(tierPricing.map(t => parseFloat(t.price))));


    try {
        const token = localStorage.getItem('adminToken');
        if (currentProduct && currentProduct.id) {
          await axios.post(
    `${process.env.REACT_APP_API_BASE_URL}/ProductVariants/add/${productId}`,
    formData,
    {
        headers: {
          
            "x-Authorization": `Bearer ${token}`, // âŒ remove if PHP API doesnâ€™t expect token
        },
    }
    
);


            alert("Variant added successfully");
            fetchProducts();
            fetchVariants(productId); // Refresh product list

            // Reset form
            setVariantDetails({
                productCode: '',
                color: '',
                dimensions: '',
                price: '',
                stock: '',
               
                quantity: '',
                description: '',
                keyFeatures: '',
                otherDimensions: '',
                productWeight: '',
                power: '',
                material: '',
                capacity: '',
                includedComponents: '',
                voltage: '',
                shape: '',
                numberOfCompartments: '',
            });

            setTierPricing([{ minQty: "", maxQty: "", price: "" }]); // Reset tier pricing
            setSelectedVariantImages([]);
             setSelectedVideoFile(null); 
            setIsAddingVariant(false);
        } else {
            alert("Please select a product to add a variant to.");
        }
    } catch (error) {
        console.error("Error adding variant:", error);
    }
    finally {
      setLoading(false);
    }
};
useEffect(() => {
  if (isAddingVariant && currentProduct?.id) {
    fetchVariants(currentProduct.id); // Fetch variants when form opens
  }
}, [isAddingVariant, currentProduct]);

    

    const handleVariantChange = (e) => {
        const { name, value } = e.target;
        setVariantDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleDeleteVariant = async (productId, variantId) => {
      setLoading(true);
  if (window.confirm('Are you sure you want to delete this variant?')) {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/ProductVariants/delete_variant/${variantId}`,
        {
          headers: {
            "x-Authorization": `Bearer ${token}`,
          },
        }
      );
      alert('Variant deleted successfully');
      fetchVariants(productId); // Refresh the variant list
    } catch (error) {
      console.error('Error deleting variant:', error);
    }
    finally {
      setLoading(false);
    }
  }
};

    

    const filteredProducts = products.filter((product) => {
        const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
        // Check if any category name matches the selected category
        const matchesCategory = selectedCategory 
            ? product.categories?.some((cat) => cat.name === selectedCategory) 
            : true;
    
        // Check if any subcategory name matches the selected subcategory
        const matchesSubcategory = selectedSubcategory 
            ? product.subcategories?.some((subcat) => subcat.name === selectedSubcategory) 
            : true;
    
        // Check the stock status
        const matchesStockStatus =
            selectedStockStatus === 'in-stock' ? product.inStock 
            : selectedStockStatus === 'out-of-stock' ? !product.inStock 
            : true;
    
        return matchesSearchTerm && matchesCategory && matchesSubcategory && matchesStockStatus;
    });
    
 // âœ… Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
    return (
        <div className="px-4 sm:px-6 py-6 bg-stone-50 min-h-screen">
          {/* Thin progress bar for non-product actions */}
          {loading && (
            <div className="fixed top-0 left-0 w-full z-50 h-0.5">
              <div className="w-full h-full bg-red-500 animate-pulse"></div>
            </div>
          )}

            <h2 className="text-2xl font-bold mb-4 text-stone-800">Product List</h2>
            <div className="mb-4">
                <button className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-sm font-semibold transition" onClick={() => setIsAdding(true)}>+ Add New Product</button>
            </div>

{/* Search and Filter Section */}
<div className="flex flex-wrap gap-2 mb-4">
  <input
    type="text"
    placeholder="Search by name"
    className="flex-1 min-w-[160px] px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <input
    list="category-list"
    placeholder="Select Category"
    className="flex-1 min-w-[160px] px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
  />
  <datalist id="category-list">
    {categories.map((category) => (
      <option key={category.id} value={category.name} />
    ))}
  </datalist>
  <input
    list="subcategory-list"
    placeholder="Select Subcategory"
    className="flex-1 min-w-[160px] px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
    value={selectedSubcategory}
    onChange={(e) => setSelectedSubcategory(e.target.value)}
  />
  <datalist id="subcategory-list">
    {subcategories.map((subcategory) => (
      <option key={subcategory.id} value={subcategory.name} />
    ))}
  </datalist>
</div>

<div className="mb-4 text-sm font-semibold text-stone-600">
  Total Products:{" "}
  {productsLoading ? <span className="text-stone-400">Loading...</span> : <span className="text-stone-800">{products.length}</span>}
</div>



            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
                    <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
                            <h2 className="text-lg font-bold text-stone-800">Add New Product</h2>
                            <button
                                onClick={() => setIsAdding(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-red-100 text-stone-500 hover:text-red-600 text-lg font-bold transition"
                                title="Close"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="px-5 py-4 overflow-y-auto max-h-[80vh]">
                            <AddProductForm
                                onCancel={() => setIsAdding(false)}
                                fetchProducts={fetchProducts}
                                categories={categories}
                                subcategories={subcategories}
                                subsubcategories={subsubcategories}
                            />
                        </div>
                    </div>
                </div>
            )}

            {isEditing && currentProduct && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
                    <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
                            <h2 className="text-lg font-bold text-stone-800">Edit Product</h2>
                            <button
                                onClick={handleCloseEdit}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-red-100 text-stone-500 hover:text-red-600 text-lg font-bold transition"
                                title="Close"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="px-5 py-4 overflow-y-auto max-h-[80vh]">
                            <UpdateProductForm
                                productData={currentProduct}
                                onCancel={handleCloseEdit}
                                fetchProducts={fetchProducts}
                                categories={categories}
                                subcategories={subcategories}
                                subsubcategories={subsubcategories}
                            />
                        </div>
                    </div>
                </div>
            )}

{isAddingVariant && currentProduct && (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
        <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
                <div>
                    <h2 className="text-lg font-bold text-stone-800">Add Variant</h2>
                    <p className="text-xs text-stone-500 mt-0.5">{currentProduct.name}</p>
                </div>
                <button
                    onClick={() => setIsAddingVariant(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-red-100 text-stone-500 hover:text-red-600 text-lg font-bold transition"
                    title="Close"
                >
                    &times;
                </button>
            </div>
            <div className="px-5 py-4 overflow-y-auto max-h-[80vh]">
    <div className="p-0">
        <div className="mb-3">
            <label htmlFor="productCode" className="block text-sm font-semibold text-stone-700 mb-1">Product Code</label>
         
         <input type="text" name="productCode" id="productCode" className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700" placeholder="Product Code" value={variantDetails.productCode} onChange={handleVariantChange} />

        </div>

        
        <div className="mb-3">
            <label htmlFor="color" className="block text-sm font-semibold text-stone-700 mb-1">Color</label>
            <input
                type="text"
                name="color"
                id="color"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                placeholder="Color"
                value={variantDetails.color}
                onChange={handleVariantChange}
            />
        </div>

         <div className="mb-3">
            <label htmlFor="otherDimensions" className="block text-sm font-semibold text-stone-700 mb-1">Variations(Sizes)</label>
            <input
                type="text"
                name="otherDimensions"
                id="otherDimensions"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                placeholder="Other Dimensions"
                value={variantDetails.otherDimensions}
                onChange={handleVariantChange}
            />
        </div>

        <div className="mb-3">
            <label htmlFor="dimensions" className="block text-sm font-semibold text-stone-700 mb-1">Dimensions</label>
            <input
                type="text"
                name="dimensions"
                id="dimensions"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                placeholder="Dimensions"
                value={variantDetails.dimensions}
                onChange={handleVariantChange}
            />
        </div>

      <div className="mb-3">
  <label htmlFor="price" className="block text-sm font-semibold text-stone-700 mb-1">Price</label>
  <input
    type="number"
    name="price"
    id="price"
    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
    placeholder="Price"
    value={variantDetails.price}
    onChange={handleVariantChange}
    onWheel={(e) => e.target.blur()} // ðŸ‘ˆ Prevent scroll from changing value
  />
</div>


        <div className="mb-3">
            <label htmlFor="stock" className="block text-sm font-semibold text-stone-700 mb-1">Stock</label>
            <input
                type="number"
                name="stock"
                id="stock"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                placeholder="Stock"
                value={variantDetails.stock}
                onChange={handleVariantChange}
                onWheel={(e) => e.target.blur()}
            />
        </div>

       

       
      

        <div className="mb-3">
            <label htmlFor="power" className="block text-sm font-semibold text-stone-700 mb-1">Power</label>
            <input
                type="text"
                name="power"
                id="power"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                placeholder="Power"
                value={variantDetails.power}
                onChange={handleVariantChange}
            />
        </div>
<div className="mb-3">
            <label htmlFor="capacity" className="block text-sm font-semibold text-stone-700 mb-1">Capacity</label>
            <input
                type="text"
                name="capacity"
                id="capacity"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                placeholder="Capacity"
                value={variantDetails.capacity}
                onChange={handleVariantChange}
            />
        </div>

         <div className="mb-3">
            <label htmlFor="productWeight" className="block text-sm font-semibold text-stone-700 mb-1">Weight</label>
            <input
                type="text"
                name="productWeight"
                id="productWeight"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                placeholder="Product NetWeight"
                value={variantDetails.productWeight}
                onChange={handleVariantChange}
            />
        </div>
         
        <div className="mb-3">
    <label htmlFor="description" className="block text-sm font-semibold text-stone-700 mb-1">Description</label>
    <textarea
        name="description"
        id="description"
        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
        placeholder="Description"
        value={variantDetails.description}
        onChange={handleVariantChange}
        rows={5} // Increases height
    />
</div>

<div className="mb-3">
    <label htmlFor="keyFeatures" className="block text-sm font-semibold text-stone-700 mb-1">Key Features</label>
    <textarea
        name="keyFeatures"
        id="keyFeatures"
        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
        placeholder="Key Features"
        value={variantDetails.keyFeatures}
        onChange={handleVariantChange}
        rows={5} // Adjusts height
    />
</div>

        <div className="mb-3">
            <label htmlFor="material" className="block text-sm font-semibold text-stone-700 mb-1">Material</label>
            <input
                type="text"
                name="material"
                id="material"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                placeholder="Material"
                value={variantDetails.material}
                onChange={handleVariantChange}
            />
        </div>
        <div className="mb-3">
            <label htmlFor="voltage" className="block text-sm font-semibold text-stone-700 mb-1">Voltage</label>
            <input
                type="text"
                name="voltage"
                id="voltage"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                placeholder="Voltage"
                value={variantDetails.voltage}
                onChange={handleVariantChange}
            />
        </div>
        <div className="mb-3">
            <label htmlFor="shape" className="block text-sm font-semibold text-stone-700 mb-1">Shape</label>
            <input
                type="text"
                name="shape"
                id="shape"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                placeholder="Shape"
                value={variantDetails.shape}
                onChange={handleVariantChange}
            />
        </div>
        <div className="mb-3">
            <label htmlFor="numberOfCompartments" className="block text-sm font-semibold text-stone-700 mb-1">Number Of Compartments</label>
            <input
                type="text"
                name="numberOfCompartments"
                id="numberOfCompartments"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                placeholder="NumberOfCompartments"
                value={variantDetails.numberOfCompartments}
                onChange={handleVariantChange}
            />
        </div>
        
        <div className="mb-3">
    <label htmlFor="includedComponents" className="block text-sm font-semibold text-stone-700 mb-1">Included Components</label>
    <textarea
        name="includedComponents"
        id="includedComponents"
        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
        placeholder="IncludedComponents"
        value={variantDetails.includedComponents}
        onChange={handleVariantChange}
        rows={5} // Increases height
    />
</div>



       <div className="mb-3">
  <label htmlFor="variantImages" className="block text-sm font-semibold text-stone-700 mb-1">Variant Image Upload</label>
  <input
    type="file"
    name="variantImages"
    id="variantImages"
    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
    multiple
    onChange={handleVariantImageChange}
  />
</div>

{/* âœ… Image Previews */}
{/* âœ… Image Previews with Drag-and-Drop */}
{selectedVariantImages && selectedVariantImages.length > 0 && (
  <div className="flex flex-wrap gap-3 mt-3">
    {selectedVariantImages.map((file, index) => (
      <div
        key={index}
        className="relative cursor-grab"
        draggable
        onDragStart={(e) => e.dataTransfer.setData("text/plain", index)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const draggedIndex = Number(e.dataTransfer.getData("text/plain"));
          if (draggedIndex === index) return; // no change if dropped on itself

          setSelectedVariantImages((prev) => {
            const updated = [...prev];
            const [draggedImage] = updated.splice(draggedIndex, 1);
            updated.splice(index, 0, draggedImage);
            return updated;
          });
        }}
      >
        <img
          src={URL.createObjectURL(file)}
          alt={`preview-${index}`}
          className="w-24 h-24 object-cover rounded border border-stone-200"
        />
        <button
          type="button"
          className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center"
          onClick={() =>
            setSelectedVariantImages((prev) =>
              prev.filter((_, i) => i !== index)
            )
          }
        >
          âœ•
        </button>
      </div>
    ))}
  </div>
)}

  <div className="mb-3">
  <label htmlFor="variantVideo" className="block text-sm font-semibold text-stone-700 mb-1">Variant Video Upload</label>
  <input
    type="file"
    name="videoFile"
    id="variantVideo"
    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
    accept="video/*"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 8 * 1024 * 1024) { // âœ… 8 MB in bytes
          alert("File size must be less than 8 MB");
          e.target.value = ""; // clear input
          return;
        }
        setSelectedVideoFile(file);
      }
    }}
  />
   <small className="text-stone-400 text-xs">Maximum allowed file size: 8 MB</small>
</div>


{selectedVideoFile && (
  <div className="mb-3">
    <video width="300" height="200" controls>
      <source src={URL.createObjectURL(selectedVideoFile)} type={selectedVideoFile.type} />
      Your browser does not support the video tag.
    </video>
    <div>
      <button
        type="button"
        className="mt-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition block"
        onClick={() => setSelectedVideoFile(null)}
      >
        Remove Video
      </button>
    </div>
  </div>
)}

       <div className="mb-3">
      <label className="block text-sm font-semibold text-stone-700 mb-1">Tiered Pricing (Optional)</label>
      {tierPricing.map((tier, index) => (
        <div key={index} className="grid grid-cols-4 gap-2 mb-2">
          <input type="number" className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700" placeholder="Min Qty" value={tier.minQty} onChange={(e) => handleTierChange(index, "minQty", e.target.value)} />
          <input type="number" className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700" placeholder="Max Qty" value={tier.maxQty} onChange={(e) => handleTierChange(index, "maxQty", e.target.value)} />
          <input type="number" className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700" placeholder="Tier Price" value={tier.price} onChange={(e) => handleTierChange(index, "price", e.target.value)} />
          <button type="button" className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition" onClick={() => removeTier(index)}>Cancel</button>
        </div>
      ))}
      <button type="button" className="mt-1 px-3 py-1.5 border border-green-600 text-green-700 hover:bg-green-50 rounded text-xs font-semibold transition" onClick={addTier}>+ Add Tier</button>
    </div>
        <div className="mb-3 text-end">
            <button className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-sm font-semibold transition mr-2" onClick={() => addVariant(currentProduct.id)}>Add Variant</button>
            <button className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-sm font-semibold transition" onClick={() => setIsAddingVariant(false)}>Cancel</button>
        </div>
    </div>
            </div>
        </div>
    </div>
)}

{isEditingVariant && (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
        <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
                <div>
                    <h2 className="text-lg font-bold text-stone-800">Edit Variant</h2>
                    {currentProduct && <p className="text-xs text-stone-500 mt-0.5">{currentProduct.name}</p>}
                </div>
                <button
                    onClick={handleCancelEditVariant}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-red-100 text-stone-500 hover:text-red-600 text-lg font-bold transition"
                    title="Close"
                >
                    &times;
                </button>
            </div>
            <div className="px-5 py-4 overflow-y-auto max-h-[80vh]">
    <div className="p-0">

        <div className="mb-3">
            <label htmlFor="productCode" className="block text-sm font-semibold text-stone-700 mb-1">Product Code</label>
            <input
                type="text"
                name="productCode"
                id="productCode"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                value={variantDetails.productCode}
                onChange={handleVariantChange}
                placeholder="productCode"
            />
        </div>

        <div className="mb-3">
            <label htmlFor="color" className="block text-sm font-semibold text-stone-700 mb-1">Color</label>
            <input
                type="text"
                name="color"
                id="color"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                value={variantDetails.color}
                onChange={handleVariantChange}
                placeholder="Color"
            />
        </div>
<div className="mb-3">
            <label htmlFor="otherDimensions" className="block text-sm font-semibold text-stone-700 mb-1">Variations(Sizes)</label>
            <input
                type="text"
                name="otherDimensions"
                id="otherDimensions"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                placeholder="Other Dimensions"
                value={variantDetails.otherDimensions}
                onChange={handleVariantChange}
            />
        </div>
        <div className="mb-3">
            <label htmlFor="dimensions" className="block text-sm font-semibold text-stone-700 mb-1">Dimensions</label>
            <input
                type="text"
                name="dimensions"
                id="dimensions"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                value={variantDetails.dimensions}
                onChange={handleVariantChange}
                placeholder="Dimensions"
            />
        </div>

       <div className="mb-3">
  <label htmlFor="price" className="block text-sm font-semibold text-stone-700 mb-1">Price</label>
  <input
    type="number"
    name="price"
    id="price"
    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
    value={variantDetails.price}
    onChange={handleVariantChange}
    placeholder="Price"
    onWheel={(e) => e.target.blur()}  // âœ… Prevent scroll from changing value
  />
</div>


        <div className="mb-3">
            <label htmlFor="stock" className="block text-sm font-semibold text-stone-700 mb-1">Stock</label>
            <input
                type="number"
                name="stock"
                id="stock"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                value={variantDetails.stock}
                onChange={handleVariantChange}
                onWheel={(e) => e.target.blur()}
                placeholder="Stock"
            />
        </div>


     
        

       
       
        <div className="mb-3">
            <label htmlFor="power" className="block text-sm font-semibold text-stone-700 mb-1">Power</label>
            <input
                type="text"
                name="power"
                id="power"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                placeholder="Power"
                value={variantDetails.power}
                onChange={handleVariantChange}
            />
        </div>


<div className="mb-3">
            <label htmlFor="capacity" className="block text-sm font-semibold text-stone-700 mb-1">Capacity</label>
            <input
                type="text"
                name="capacity"
                id="capacity"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                placeholder="Capacity"
                value={variantDetails.capacity}
                onChange={handleVariantChange}
            />
        </div>

         <div className="mb-3">
            <label htmlFor="productWeight" className="block text-sm font-semibold text-stone-700 mb-1">Weight</label>
            <input
                type="text"
                name="productWeight"
                id="productWeight"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                placeholder="Product Weight"
                value={variantDetails.productWeight}
                onChange={handleVariantChange}
            />
        </div>
           <div className="mb-3">
    <label htmlFor="description" className="block text-sm font-semibold text-stone-700 mb-1">Description</label>
    <textarea
        name="description"
        id="description"
        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
        placeholder="Description"
        value={variantDetails.description}
        onChange={handleVariantChange}
        rows={5} // Increases height
    />
</div>

<div className="mb-3">
    <label htmlFor="keyFeatures" className="block text-sm font-semibold text-stone-700 mb-1">Key Features</label>
    <textarea
        name="keyFeatures"
        id="keyFeatures"
        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
        placeholder="Key Features"
        value={variantDetails.keyFeatures}
        onChange={handleVariantChange}
        rows={5} // Adjusts height
    />
</div>

        <div className="mb-3">
            <label htmlFor="material" className="block text-sm font-semibold text-stone-700 mb-1">Material</label>
            <input
                type="text"
                name="material"
                id="material"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                placeholder="Material"
                value={variantDetails.material}
                onChange={handleVariantChange}
            />
        </div>
        <div className="mb-3">
            <label htmlFor="voltage" className="block text-sm font-semibold text-stone-700 mb-1">Voltage</label>
            <input
                type="text"
                name="voltage"
                id="voltage"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                placeholder="Voltage"
                value={variantDetails.voltage}
                onChange={handleVariantChange}
            />
        </div>
        <div className="mb-3">
            <label htmlFor="shape" className="block text-sm font-semibold text-stone-700 mb-1">Shape</label>
            <input
                type="text"
                name="shape"
                id="shape"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                placeholder="Shape"
                value={variantDetails.shape}
                onChange={handleVariantChange}
            />
        </div>
        <div className="mb-3">
            <label htmlFor="numberOfCompartments" className="block text-sm font-semibold text-stone-700 mb-1">Number Of Compartments</label>
            <input
                type="text"
                name="numberOfCompartments"
                id="numberOfCompartments"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                placeholder="NumberOfCompartments"
                value={variantDetails.numberOfCompartments}
                onChange={handleVariantChange}
            />
        </div>

        
         
        <div className="mb-3">
    <label htmlFor="includedComponents" className="block text-sm font-semibold text-stone-700 mb-1">Included Components</label>
    <textarea
        name="includedComponents"
        id="includedComponents"
        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
        placeholder="IncludedComponents"
        value={variantDetails.includedComponents}
        onChange={handleVariantChange}
        rows={5} // Increases height
    />
</div>


        {/* Displaying current images */}
       {/* Displaying current images */}
<label>Current Images</label>
<div className="mb-3">
  {variantDetails.images && variantDetails.images.length > 0 ? (
    <div className="flex flex-wrap gap-3">
    {variantDetails.images.map((image, index) =>
      image ? (
        <div key={index} className="flex flex-col items-center gap-1">
          <img
          src={image || "https://via.placeholder.com/100"}
        alt={`Variant Image ${index}`}
        className="w-24 h-24 object-cover rounded border border-stone-200"
      />

          <div className="flex items-center gap-1">
            <input
              type="checkbox"
              className="accent-red-600"
              onChange={() => handleSelectImageToDelete(index)}
              checked={selectedImageIndicesToDelete.includes(index)}
            />
            <label className="text-xs text-stone-600">Delete</label>
          </div>
        </div>
      ) : null
    )}
    </div>
  ) : (
    <p>No images available</p>
  )}
</div>


        

       {/* File input for new images */}
<div className="mb-3">
  <label htmlFor="newImages" className="block text-sm font-semibold text-stone-700 mb-1">Add New Images</label>
  <input
    type="file"
    id="newImages"
    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
    multiple
    onChange={(e) => {
      const files = Array.from(e.target.files);

      // Sort files alphabetically
      files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

      // 8 MB limit
      const maxTotalSize = 8 * 1024 * 1024; // 8 MB in bytes

      // Calculate total size of selected files
      const totalSize = files.reduce((acc, file) => acc + file.size, 0);

      if (totalSize > maxTotalSize) {
        alert("Total selected images must not exceed 8 MB.");
        e.target.value = ""; // reset input
        return;
      }

      setSelectedVariantImages(files);
    }}
  />
</div>

{selectedVariantImages.length > 0 && (
  <div className="flex flex-wrap gap-3 mt-3">
    {selectedVariantImages.map((file, index) => (
      <div
        key={index}
        className="relative cursor-grab"
        draggable
        onDragStart={(e) => e.dataTransfer.setData("text/plain", index)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const draggedIndex = Number(e.dataTransfer.getData("text/plain"));
          if (draggedIndex === index) return; // no change if dropped on itself

          setSelectedVariantImages((prev) => {
            const updated = [...prev];
            const [draggedImage] = updated.splice(draggedIndex, 1);
            updated.splice(index, 0, draggedImage);
            return updated;
          });
        }}
      >
        <img
          src={URL.createObjectURL(file)}
          alt={`preview-${index}`}
          className="w-24 h-24 object-cover rounded border border-stone-200"
        />
        <button
          type="button"
          className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center"
          onClick={() =>
            setSelectedVariantImages((prev) => prev.filter((_, i) => i !== index))
          }
        >
          ✕
        </button>
      </div>
    ))}
  </div>
)}


        

        <div className="mb-3">
  <label htmlFor="videoFile" className="block text-sm font-semibold text-stone-700 mb-1">Upload Variant Video</label>
  <input
    type="file"
    name="videoFile"
    id="videoFile"
    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
    accept="video/*"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 8 * 1024 * 1024) { // âœ… 8 MB in bytes
          alert("File size must be less than 8 MB");
          e.target.value = ""; // reset file input
          return;
        }
        setSelectedVideoFile(file);
      }
    }}
  />
  <small className="text-stone-400 text-xs">Maximum allowed file size: 8 MB</small>
</div>

{variantDetails?.videoUrl && (
  <>
    <div className="mb-3">
      <label className="block text-sm font-semibold text-stone-700 mb-1">Current Video</label>
      <video
        width="50%"
        height="auto"
        controls
        className="rounded-lg border border-stone-200"
      >
      <source src={variantDetails.videoUrl || ""} type="video/mp4" />


        Your browser does not support the video tag.
      </video>
    </div>

    <div className="flex items-center gap-2 mb-3">
      <input
        className="w-4 h-4 accent-red-600"
        type="checkbox"
        id="deleteVideo"
        checked={deleteVideo}
        onChange={(e) => setDeleteVideo(e.target.checked)}
      />
      <label className="text-sm text-stone-700" htmlFor="deleteVideo">
        Delete existing video
      </label>
    </div>
  </>
)}





        {variantDetails.tierPrices.length > 0 ? (
  variantDetails.tierPrices.map((tier, index) => (
    <div key={index} className="grid grid-cols-4 gap-2 mb-2">
      <input
        type="number"
        placeholder="Min Qty"
        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
        value={tier.minQty}
        onChange={(e) =>
          handleTierPriceChange(index, 'minQty', e.target.value)
        }
      />
      <input
        type="number"
        placeholder="Max Qty"
        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
        value={tier.maxQty}
        onChange={(e) =>
          handleTierPriceChange(index, 'maxQty', e.target.value)
        }
      />
      <input
        type="number"
        placeholder="Price"
        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
        value={tier.price}
        onChange={(e) =>
          handleTierPriceChange(index, 'price', e.target.value)
        }
      />
      <button
        type="button"
        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition"
        onClick={() => handleDeleteTierPrice(index)}
      >
        Delete
      </button>
    </div>
  ))
) : (
  <p className="text-stone-400 text-xs">No tier prices added.</p>
)}
<button type="button" className="px-3 py-1.5 border border-red-700 text-red-700 hover:bg-red-50 rounded text-sm font-semibold transition" onClick={handleAddTierPrice}>
  + Add Tier Price
</button>


        <div className="mb-3 text-end">
            <button className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-sm font-semibold transition" onClick={() => updateVariant(currentProduct.id)}>Update Variant</button>
            <button className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-sm font-semibold transition" onClick={handleCancelEditVariant}>Cancel</button>
        </div>
    </div>
            </div>
        </div>
    </div>
)}

 <div className="flex items-center gap-2 mb-4 text-sm text-stone-600">
        <span className="font-semibold">Items per page:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1); // reset to first page
          }}
          className="px-2 py-1.5 border border-stone-300 rounded-lg text-sm outline-none focus:border-red-700"
        >
          {[5, 10, 15, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
<div className="rounded-xl border border-stone-200 shadow-sm mb-4 overflow-hidden">
<table className="w-full border-collapse bg-white table-fixed text-sm">
                <thead>
                    <tr className="bg-red-700 text-white">
                        <th className="px-3 py-3 text-xs font-semibold text-left border-r border-red-600 w-10">Sr.</th>
                        <th className="px-3 py-3 text-xs font-semibold text-left border-r border-red-600">Name</th>
                        <th className="px-3 py-3 text-xs font-semibold text-left border-r border-red-600 w-20">HSN</th>
                        <th className="px-3 py-3 text-xs font-semibold text-left border-r border-red-600 w-32">Created &amp; Updated</th>
                        <th className="px-3 py-3 text-xs font-semibold text-left border-r border-red-600">Category</th>
                        <th className="px-3 py-3 text-xs font-semibold text-left border-r border-red-600">Subcategory</th>
                        <th className="px-3 py-3 text-xs font-semibold text-left border-r border-red-600">Subsubcategory</th>
                        <th className="px-3 py-3 text-xs font-semibold text-left border-r border-red-600 w-14">Tax %</th>
                        <th className="px-3 py-3 text-xs font-semibold text-left w-36">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                {productsLoading ? (
                  Array.from({ length: itemsPerPage }).map((_, i) => (
                    <tr key={i}>
                      {[...Array(9)].map((__, j) => (
                        <td key={j} className="px-3 py-2.5">
                          <div className="h-3.5 bg-stone-200 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : paginatedProducts.map((product, index) => (
                        <React.Fragment key={product.id}>
                        <tr className="hover:bg-red-50 transition-colors">
                          <td className="px-3 py-3 text-xs text-stone-500 border-r border-stone-200">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td className="px-3 py-3 text-xs text-stone-800 font-medium border-r border-stone-200">
                            <span className="block whitespace-normal break-words">{product.name}</span>
                          </td>
                          <td className="px-3 py-3 text-xs text-stone-600 border-r border-stone-200">{product.hsn_code}</td>
                          <td className="px-3 py-3 text-xs text-stone-500 border-r border-stone-200">
                            <span className="block">{product.created_at}</span>
                            <span className="block text-stone-400">{product.updated_at}</span>
                          </td>
                          <td className="px-3 py-3 text-xs text-stone-600 border-r border-stone-200">
                              {product.categories && product.categories.length > 0 ? product.categories.map((cat) => cat.name).join(', ') : <span className="text-stone-400">—</span>}
                          </td>
                          <td className="px-3 py-3 text-xs text-stone-600 border-r border-stone-200">
                              {product.subcategories && product.subcategories.length > 0 ? product.subcategories.map((subcat) => subcat.name).join(', ') : <span className="text-stone-400">—</span>}
                          </td>
                          <td className="px-3 py-3 text-xs text-stone-600 border-r border-stone-200">
                              {product.subsubcategories && product.subsubcategories.length > 0 ? product.subsubcategories.map((subsubcat) => subsubcat.name).join(', ') : <span className="text-stone-400 italic">No Subsubcategory</span>}
                          </td>
                          <td className="px-3 py-3 text-xs text-stone-600 border-r border-stone-200">{product.tax_percentage}%</td>
                          <td className="px-2 py-2 text-xs">
                            <div className="flex flex-wrap gap-1">
                                <button className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition font-medium" onClick={() => handleEditProduct(product)}>Edit</button>
                                <button className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition font-medium" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                                <button className="px-2 py-1 bg-stone-600 text-white text-xs rounded hover:bg-stone-700 transition font-medium" onClick={() => { setCurrentProduct(product); fetchVariants(product.id); }}>Variants</button>
                                <button className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition font-medium" onClick={() => { setCurrentProduct(product); setIsAddingVariant(true); }}>Add Variant</button>
                            </div>
                          </td>
                        </tr>
                        {showVariants && currentProduct?.id === product.id && (
                          <tr>
                            <td colSpan={9} className="px-4 py-4 bg-red-50 border-t-2 border-red-200">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-red-800 uppercase tracking-wide">Variants — {product.name}</span>
                                <button className="px-3 py-1 bg-stone-600 text-white text-xs rounded hover:bg-stone-700 transition font-medium" onClick={handleCloseVariants}>✕ Close</button>
                              </div>
                              <div className="overflow-x-auto rounded-lg border border-red-200">
                        <table className="w-full border-collapse bg-white text-xs">
            <thead>
                <tr className="bg-red-700 text-white">
                <th className="px-3 py-2.5 text-xs font-semibold border-r border-red-600">Code</th>
                <th className="px-3 py-2.5 text-xs font-semibold border-r border-red-600">Tax</th>
                    <th className="px-3 py-2.5 text-xs font-semibold border-r border-red-600">Variant</th>
                    <th className="px-3 py-2.5 text-xs font-semibold border-r border-red-600">Price</th>
                    <th className="px-3 py-2.5 text-xs font-semibold border-r border-red-600">Stock</th>
                    <th className="px-3 py-2.5 text-xs font-semibold border-r border-red-600">Created &amp; Updated</th>
                    <th className="px-3 py-2.5 text-xs font-semibold border-r border-red-600">Image</th>
                    <th className="px-3 py-2.5 text-xs font-semibold">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
                {variants.map((variant) => (
                    <tr key={variant.id} className="hover:bg-red-50 transition-colors">
                        <td className="px-3 py-2.5 border-r border-stone-200 text-xs text-stone-700">{variant.product_code}</td>
                        <td className="px-3 py-2.5 border-r border-stone-200 text-xs text-stone-700">{variant.tax_amount} rs</td>
                        <td className="px-3 py-2.5 border-r border-stone-200 text-xs text-stone-700">{variant.color || variant.otherDimensions}</td>
                        <td className="px-3 py-2.5 border-r border-stone-200 text-xs text-stone-700 font-medium">₹{variant.price}</td>
                        <td className="px-3 py-2.5 border-r border-stone-200 text-xs">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            variant.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                          }`}>{variant.stock}</span>
                        </td>
                        <td className="px-3 py-2.5 border-r border-stone-200 text-xs text-stone-500">
                          <span className="block">{variant.created_at}</span>
                          <span className="block text-stone-400">{variant.updated_at}</span>
                        </td>
                        <td className="px-3 py-2.5 border-r border-stone-200 text-xs">
{variant.images && variant.images.length > 0 ? (
  <img
    src={variant.images[0].startsWith("https") ? variant.images[0] : `https://kitchenarykart.com/kitchen_app/${variant.images[0]}`}
    alt="Variant Image 0"
    className="w-14 h-14 object-contain rounded-lg bg-stone-50 border border-stone-200"
  />
) : (
  <img src={logo} alt="KitchenaryKart Logo" className="w-14 h-14 object-contain opacity-50" />
)}
                        </td>
                        <td className="px-3 py-2.5 text-xs">
                            <div className="flex gap-1">
                            <button className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs rounded font-semibold transition" onClick={() => handleEditVariant(variant)}>Edit</button>
                            <button className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition" onClick={() => handleDeleteVariant(product.id, variant.id)}>Delete</button>
                            </div>
                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        </div>
                            </td>
                          </tr>
                        )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
</div>
          {/* Pagination controls */}
<div className="flex items-center justify-between gap-3 py-3 border-t border-stone-200">
  <button
    className="px-3 py-1.5 border border-stone-300 rounded-lg text-sm text-stone-600 hover:bg-stone-100 disabled:opacity-50 transition"
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
  >
    &laquo; Previous
  </button>

  <span className="font-semibold text-sm text-stone-600">
    Page {currentPage} of {totalPages}
  </span>

  <button
    className="px-3 py-1.5 border border-stone-300 rounded-lg text-sm text-stone-600 hover:bg-stone-100 disabled:opacity-50 transition"
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
  >
    Next &raquo;
  </button>
</div>

        </div>
        
    );
};


export default ProductList;








