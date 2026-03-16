
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

// ── Floating-label input (fieldset/legend style) ────────────────────
const FloatingInput = ({ label, required, inputRef, ...props }) => (
    <fieldset className="border border-stone-300 rounded px-3 pb-2 pt-0 focus-within:border-blue-500 transition-colors">
        <legend className="text-xs text-stone-400 px-1">
            {label}{required && ' *'}
        </legend>
        <input
            ref={inputRef}
            {...props}
            className="w-full outline-none text-sm text-stone-800 bg-transparent py-0.5"
        />
    </fieldset>
);

// ── Searchable multi-select dropdown ─────────────────────────────────
const SearchableDropdown = ({ placeholder, options, selected, onChange, error, disabled }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef();

    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const filtered = options.filter(o =>
        o.label.toLowerCase().includes(search.toLowerCase())
    );

    const toggle = (id) => {
        if (selected.includes(id)) onChange(selected.filter(s => s !== id));
        else onChange([...selected, id]);
    };

    const displayText = selected.length > 0
        ? options.filter(o => selected.includes(o.id)).map(o => o.label).join(', ')
        : '';

    return (
        <div ref={containerRef} className="relative">
            <div
                className={`flex items-center border rounded px-3 py-2.5 cursor-pointer bg-white transition-colors ${
                    error ? 'border-red-500' : 'border-stone-300 hover:border-stone-400'
                } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => { if (!disabled) setOpen(!open); }}
            >
                <span className={`flex-1 text-sm truncate ${displayText ? 'text-stone-800' : 'text-stone-400'}`}>
                    {displayText || placeholder}
                </span>
                <svg
                    className={`w-4 h-4 text-stone-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            {open && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-stone-200 rounded shadow-lg flex flex-col" style={{ maxHeight: '240px' }}>
                    <div className="p-2 border-b border-stone-100 flex-shrink-0">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onClick={e => e.stopPropagation()}
                            placeholder="Search..."
                            className="w-full px-2 py-1.5 text-sm border border-stone-200 rounded outline-none focus:border-blue-400"
                            autoFocus
                        />
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {filtered.length === 0 ? (
                            <p className="text-sm text-stone-400 text-center py-3">No options found</p>
                        ) : filtered.map(option => (
                            <label key={option.id} className="flex items-center gap-2.5 px-3 py-2 hover:bg-stone-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(option.id)}
                                    onChange={() => toggle(option.id)}
                                    onClick={e => e.stopPropagation()}
                                    className="w-4 h-4 accent-blue-600 flex-shrink-0"
                                />
                                <span className="text-sm text-stone-700">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const AddProductForm = ({ onCancel, fetchProducts, categories, subcategories, subsubcategories }) => {

   // Refs for ENTER key focus shifting
    const inputRefs = {
        name: useRef(),
        taxPercentage: useRef(),
        hsn_code: useRef(),
        keywords: useRef(),
        categories: useRef(), // first autoComplete field
    };

    const handleEnterKey = (e, nextFieldRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextFieldRef?.current) {
                nextFieldRef.current.focus();
            }
        }
    };
    const [product, setProduct] = useState({
        name: '',
        taxPercentage: 0,
        hsn_code: '',
        categoryIds: [],
        subcategoryIds: [],
        subsubcategoryIds: [],
        isNewArrival: false,
        isMostSelling: false, 
        keywords:'',
       
    });

    const [relatedProductNames, setRelatedProductNames] = useState([]); // State for storing related product names
    const [products, setProducts] = useState([]); // State for storing products to select related ones
    const [newProductId, setNewProductId] = useState(null);
    const [loading, setLoading] = useState(false); // loader state
     // Get admin token from localStorage
    const adminToken = localStorage.getItem("adminToken");
    const authHeaders = {
        headers: {
            "Content-Type": "application/json",
            "x-Authorization": `Bearer ${adminToken}`,
        },
    };

    // Fetch all products for related products dropdown
    useEffect(() => {
        const fetchAllProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/index`, authHeaders);
                setProducts(response.data); // Assuming response is an array of products
            } catch (error) {
                
            }
            finally {
      setLoading(false);
    }
        };

        fetchAllProducts();
    }, []);

    // Handle changes to input fields
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue;
        if (type === 'checkbox') {
            newValue = checked;
        } else if (['price', 'taxPercentage', 'quantity', 'power'].includes(name)) {
            const numValue = Number(value);
            if (name === 'taxPercentage') {
                // Clamp tax percentage between 0 and 100
                newValue = isNaN(numValue) ? '' : Math.max(0, Math.min(100, numValue));
            } else {
                newValue = isNaN(numValue) ? '' : Math.max(0, numValue);
            }
        } else {
            newValue = value;
        }
        setProduct({ ...product, [name]: newValue });
    };

    // Handle changes for multi-select fields (categories, subcategories, etc.)
    const handleMultiSelectChange = (e, field) => {
        const { value } = e.target;
        setProduct({ ...product, [field]: typeof value === 'string' ? value.split(',') : value });
    };

    // Submit form to create a new product and add related products
const handleSubmit = async (e) => {
  e.preventDefault();

  // âœ… Validate category and subcategory selections
  if (product.categoryIds.length === 0) {
    alert("Please select at least one category before submitting.");
    return;
  }

  if (product.subcategoryIds.length === 0) {
    alert("Please select at least one subcategory before submitting.");
    return;
  }

  // âœ… (Optional) Validate product name, HSN code, etc.
  if (!product.name.trim()) {
    alert("Product name is required.");
    return;
  }

  setLoading(true);

    // Prepare payload in correct types
    const payload = {
        ...product,
        taxPercentage: Number(product.taxPercentage),
         hsnCode: product.hsn_code, 
        categoryIds: product.categoryIds.map(Number),
        subcategoryIds: product.subcategoryIds.map(Number),
        subsubcategoryIds: product.subsubcategoryIds.map(Number),
        isNewArrival: Boolean(product.isNewArrival),
        isMostSelling: Boolean(product.isMostSelling),
        keywords: product.keywords
    };

   

    try {
        // 1ï¸âƒ£ Create product
        const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/product/create`,
            payload,
            authHeaders,
            { headers: { "Content-Type": "application/json" } }
        );
if (response.data && response.data.id) {
    const createdProductId = response.data.id;
    setNewProductId(createdProductId);
            // 2ï¸âƒ£ Map related names â†’ IDs
            const relatedProductIds = products
                .filter((prod) => relatedProductNames.includes(prod.name))
                .map((prod) => prod.id);

           if (relatedProductIds.length > 0) {
   await axios.post(
    `${process.env.REACT_APP_API_BASE_URL}/product/set_related/${createdProductId}`,
    relatedProductIds, // send array directly
    authHeaders,
    { headers: { "Content-Type": "application/json" } }
);

}


            alert("Product added successfully!");
            fetchProducts();
            onCancel();
        } else {
            alert("Failed to add product: " + (response.data.message || "Unknown error"));
        }
    } catch (error) {
       
        alert("Failed to save product or related products.");
    }
    finally {
      setLoading(false);
    }
};



    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto mt-8 mb-8">
            {loading && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-[9999]">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-stone-300 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-white mt-2">Loading...</p>
                    </div>
                </div>
            )}

            <h2 className="text-xl font-bold mb-5 text-stone-800">Add Product</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Product Name */}
                <FloatingInput
                    label="Product Name"
                    required
                    inputRef={inputRefs.name}
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    onKeyDown={(e) => handleEnterKey(e, inputRefs.taxPercentage)}
                    placeholder="Product Name *"
                />

                {/* Checkboxes – single row */}
                <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isNewArrival"
                            checked={product.isNewArrival}
                            onChange={handleChange}
                            className="w-4 h-4 accent-blue-600 cursor-pointer"
                        />
                        <span className="text-sm text-stone-700">Mark as New Arrival</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isMostSelling"
                            checked={product.isMostSelling}
                            onChange={handleChange}
                            className="w-4 h-4 accent-blue-600 cursor-pointer"
                        />
                        <span className="text-sm text-stone-700">Mark as Most Selling</span>
                    </label>
                </div>

                {/* Tax Percentage */}
                <FloatingInput
                    label="Tax Percentage"
                    inputRef={inputRefs.taxPercentage}
                    type="number"
                    name="taxPercentage"
                    value={product.taxPercentage}
                    onChange={handleChange}
                    onKeyDown={(e) => handleEnterKey(e, inputRefs.hsn_code)}
                    inputProps={{ min: 0, max: 100 }}
                />

                {/* HSN Code */}
                <FloatingInput
                    label="HSN Code"
                    inputRef={inputRefs.hsn_code}
                    type="text"
                    name="hsn_code"
                    value={product.hsn_code}
                    onChange={handleChange}
                    onKeyDown={(e) => handleEnterKey(e, inputRefs.keywords)}
                    placeholder="HSN Code"
                />

                {/* Keywords */}
                <FloatingInput
                    label="Keywords"
                    inputRef={inputRefs.keywords}
                    type="text"
                    name="keywords"
                    value={product.keywords}
                    onChange={handleChange}
                    placeholder="Keywords"
                />

                {/* Categories */}
                <SearchableDropdown
                    placeholder="Search Categories"
                    options={[...categories]
                        .map(cat => ({ label: cat.name, id: cat.id }))
                        .sort((a, b) => a.label.localeCompare(b.label))}
                    selected={product.categoryIds}
                    onChange={(ids) => setProduct({ ...product, categoryIds: ids, subcategoryIds: [], subsubcategoryIds: [] })}
                    error={product.categoryIds.length === 0 ? 'Please select at least one category' : null}
                />

                {/* Subcategories */}
                <SearchableDropdown
                    placeholder="Search Subcategories"
                    options={[...subcategories]
                        .filter(sub => product.categoryIds.includes(sub.category_id))
                        .map(sub => ({ label: sub.name, id: sub.id }))
                        .sort((a, b) => a.label.trim().toLowerCase().localeCompare(b.label.trim().toLowerCase()))}
                    selected={product.subcategoryIds}
                    onChange={(ids) => setProduct({ ...product, subcategoryIds: ids, subsubcategoryIds: [] })}
                    error={product.subcategoryIds.length === 0 ? 'Please select at least one subcategory' : null}
                />

                {/* Subsubcategories */}
                <SearchableDropdown
                    placeholder="Search Subsubcategories"
                    options={[...subsubcategories]
                        .filter(subsub => product.subcategoryIds.includes(subsub.subcategory_id))
                        .map(subsub => ({ label: subsub.name, id: subsub.id }))
                        .sort((a, b) => a.label.trim().toLowerCase().localeCompare(b.label.trim().toLowerCase()))}
                    selected={product.subsubcategoryIds}
                    onChange={(ids) => setProduct({ ...product, subsubcategoryIds: ids })}
                />

                {/* Related Products */}
                <SearchableDropdown
                    placeholder="Search Related Products"
                    options={products
                        .map(prod => ({ label: prod.name, id: prod.id }))
                        .sort((a, b) => a.label.localeCompare(b.label))}
                    selected={products.filter(p => relatedProductNames.includes(p.name)).map(p => p.id)}
                    onChange={(ids) => {
                        setRelatedProductNames(products.filter(p => ids.includes(p.id)).map(p => p.name));
                    }}
                />

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700 disabled:bg-stone-400 uppercase tracking-wide transition-colors"
                    >
                        {loading ? 'Adding...' : 'Add Product'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 bg-red-600 text-white text-sm font-bold rounded hover:bg-red-700 uppercase tracking-wide transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProductForm;



