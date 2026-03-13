/**
 * INTEGRATION GUIDE: Using New Service Layer
 * 
 * This guide shows how to safely update existing components to use
 * the new production-grade service layer without breaking the UI.
 * 
 * ============================================================================
 * BEFORE: Old pattern (direct axios calls, duplicated code)
 * ============================================================================
 */

/*
import axios from 'axios';

const fetchProducts = async () => {
  setLoading(true);
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/product/index`
    );
    setProducts(response.data);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchProducts();
}, []);
*/

/**
 * ============================================================================
 * AFTER: New pattern (service layer + hooks, clean + reusable)
 * ============================================================================
 */

/*
// OPTION 1: Use custom hook (recommended for most cases)
import { useProducts } from '../hooks/useProducts';

const MyComponent = () => {
  const { products, loading, error } = useProducts();
  
  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
};

// OPTION 2: Use service directly (for custom logic)
import { productService } from '../services/productService';

const MyComponent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return <div>...</div>;
};
*/

/**
 * ============================================================================
 * PATTERN 1: Replace category/product fetching with hooks
 * ============================================================================
 */

/*
// BEFORE (ProductList.js - lines 147-160)
const fetchCategories = async () => {
  setLoading(true);
  try {
    const response = await axios.get(`${BASE_URL}/category/index`);
    setCategories(response.data);
  } catch (error) {
    console.error('Error fetching Categories:', error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchCategories();
}, []);

// AFTER
import { useCategories, useSubcategories } from '../hooks';

const ProductList = () => {
  const { categories, loading } = useCategories();
  const { subcategories } = useSubcategories();
  // That's it! No more duplicated fetch logic
};
*/

/**
 * ============================================================================
 * PATTERN 2: Replace tier pricing logic (appears 3 times!)
 * ============================================================================
 */

/*
// BEFORE (ProductList.js, AddProductForm.js, UpdateProductForm.js)
const handleTierPriceChange = (index, field, value) => {
  const updated = [...tierPrices];
  updated[index] = { ...updated[index], [field]: value };
  setTierPrices(updated);
};

const addTier = () => {
  setTierPrices([...tierPrices, { minQty: '', maxQty: '', price: '' }]);
};

const removeTier = (index) => {
  const updated = [...tierPrices];
  updated.splice(index, 1);
  setTierPrices(updated);
};

// AFTER (in ONE of the 3 components - delete from others)
import { useTierPricing } from '../hooks/useTierPricing';

const AddProductForm = () => {
  const { 
    tiers, 
    handleTierChange, 
    addTier, 
    removeTier, 
    validateTiers 
  } = useTierPricing();
  
  // Use tiers, handleTierChange, addTier, removeTier
  // Update other two components to import the same way
};
*/

/**
 * ============================================================================
 * PATTERN 3: Replace image validation (appears 4 times!)
 * ============================================================================
 */

/*
// BEFORE (ProductList.js, AddProductForm.js, UpdateProductForm.js)
const handleVariantImageChange = (e) => {
  const maxTotalSize = 8 * 1024 * 1024;
  let files = Array.from(e.target.files);
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  
  if (totalSize > maxTotalSize) {
    alert('Total image size exceeds 8MB');
    e.target.value = '';
    return;
  }
  
  files.sort((a, b) => {
    const nameA = a.name.split('.')[0];
    const nameB = b.name.split('.')[0];
    // ... complex sorting logic
  });
  
  setSelectedImages(files);
};

// AFTER (ONE component only - delete duplicates)
import { useImageValidation } from '../hooks/useImageValidation';

const AddProductForm = () => {
  const { 
    selectedImages, 
    imageError, 
    handleImageChange, 
    removeImage 
  } = useImageValidation(8); // 8MB max
  
  return (
    <input 
      type="file" 
      onChange={handleImageChange} 
      multiple 
    />
  );
};
*/

/**
 * ============================================================================
 * PATTERN 4: Replace API calls with service layer
 * ============================================================================
 */

/*
// BEFORE (scattered throughout all admin components)
const { mutate: createProduct } = useMutation({
  mutationFn: async (product) => {
    await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/product/create`,
      product
    );
  }
});

// AFTER (centralized - same everywhere)
import { productService } from '../services';

const { mutate: createProduct } = useMutation({
  mutationFn: productService.create
});
*/

/**
 * ============================================================================
 * STEP-BY-STEP: How to update ProductList.js
 * ============================================================================
 */

/*
// STEP 1: Update imports at top of ProductList.js
// Add these imports:
import { 
  useProducts, 
  useProductVariants, 
  useCategories, 
  useSubcategories, 
  useSubsubcategories,
  useTierPricing,
  useImageValidation
} from '../hooks';

// Remove these duplicated axios calls still exist locally

// STEP 2: In the component, replace fetch logic with hooks:

// Original: 50 lines of fetch code
const [products, setProducts] = useState([]);
const [categories, setCategories] = useState([]);
// ... 20+ more state variables

const fetchProducts = async () => {
  // ... 15 lines of duplicated fetch code
};

useEffect(() => {
  fetchProducts();
  fetchCategories();
  fetchSubcategories();
  fetchSubsubcategories();
}, []);

// NEW: 2 lines with hooks
const { products } = useProducts();
const { categories } = useCategories();
const { subcategories } = useSubcategories();
const { subsubcategories } = useSubsubcategories();

// STEP 3: Replace tier pricing FIVE times with ONE hook call
// Remove all the manual tier pricing state and handlers (100+ lines)
// Replace with:
const { 
  tiers: tierPrices, 
  handleTierChange,
  addTier,
  removeTier
} = useTierPricing();

// STEP 4: Replace image validation (delete 60 lines, add 1 line)
const { 
  selectedImages: selectedVariantImages,
  handleImageChange: handleVariantImageChange,
  removeImage
} = useImageValidation(8);

// STEP 5: Test - the UI should look IDENTICAL
// The component is now 300+ lines shorter, but functions exactly the same
*/

/**
 * ============================================================================
 * QUICK REFERENCE: Import Patterns
 * ============================================================================
 */

// Import hooks (use these for common logic)
import {
  useProducts,
  useProductVariants,
  useCategories,
  useTopCategories,
  useSubcategories,
  useSubsubcategories,
  useTierPricing,
  useOrders,
  useImageValidation,
} from "../hooks";

// Import services (for one-off API calls)
import {
  productService,
  categoryService,
  subcategoryService,
  subsubcategoryService,
  orderService,
  couponService,
  reviewService,
  userService,
} from "../services";

// Import routes (for URL generation)
import { ROUTES, getProductDetailsUrl, getCartUrl } from "../routes";

/**
 * ============================================================================
 * SAFE MIGRATION CHECKLIST
 * ============================================================================
 */

/*
[ ] 1. Read this guide completely
[ ] 2. Update ONE component (e.g., ProductList.js)
[ ] 3. Test in browser - UI should be identical
[ ] 4. Check console - no errors
[ ] 5. Move to next component
[ ] 6. Check each list:
      [ ] ProductList.js
      [ ] AddProductForm.js
      [ ] UpdateProductForm.js
      [ ] Category.js
      [ ] Subcategory.js
      [ ] SubsubcategoryManager.js
      [ ] OrderManagement.js
      [ ] AdminUserManagement.js
      [ ] CouponManager.js
      [ ] VariantReviewTable.js
*/

/**
 * ============================================================================
 * TROUBLESHOOTING
 * ============================================================================
 */

/*
Q: Component looks different after update?
A: You accidentally changed the JSX rendering. Roll back and be more careful
   with which lines you modify. Only change import and fetch logic lines.

Q: Getting undefined errors?
A: Make sure you're destructuring the hook return correctly.
   const { products, loading } = useProducts();  ✓
   const products = useProducts();               ✗

Q: Data not showing up?
A: The hooks return the same data format as before. Check console for API errors.
   If the old code worked, the new code will too.

Q: How do I know if I'm using the right hook?
A: If you were calling productService.getAll(), use useProducts hook.
   If you were calling categoryService.getAll(), use useCategories hook.
   Check the hooks/index.js barrel export for all available hooks.
*/
