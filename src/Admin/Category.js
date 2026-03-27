import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Safe BASE_URL with fallback
const BASE_URL = process.env.REACT_APP_API_BASE_URL 
  ? process.env.REACT_APP_API_BASE_URL.replace("/Api", "")
  : 'https://kitchenarykart.com/kitchen_app';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImageFile, setNewCategoryImageFile] = useState(null);
  const [newCategoryImageUrl, setNewCategoryImageUrl] = useState('');
  const [isTopCategory, setIsTopCategory] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false); // loader state

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const [categoriesResponse, topCategoriesResponse] = await Promise.all([
        axios.get(`${BASE_URL}/Api/category/index`),
        axios.get(`${BASE_URL}/Api/category/top`),
      ]);

      // SORT + TRIM NAMES (case-insensitive alphabetical ascending)
      const sortedCategories = categoriesResponse.data
        .map(c => ({ ...c, name: c.name.trim() }))
        .sort((a, b) => a.name.localeCompare(b.name));

      const sortedTopCategories = topCategoriesResponse.data
        .map(c => ({ ...c, name: c.name.trim() }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setCategories(sortedCategories);
      setTopCategories(sortedTopCategories);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };



  const handleAddCategory = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', newCategoryName);
      if (newCategoryImageFile) {
        formData.append('image', newCategoryImageFile); // actual file, not Base64
      }
      formData.append('top_category', isTopCategory ? '1' : '0');

      const token = localStorage.getItem('adminToken');

      await axios.post(`${BASE_URL}/Api/category/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-Authorization': `Bearer ${token}`,
        },
      });

      setNewCategoryName('');
      setNewCategoryImageFile(null);
      setNewCategoryImageUrl('');
      setIsTopCategory(false);
      fetchCategories();
    } catch (error) {

      alert(error.response?.data?.message || 'Failed to add category.');
    }
    finally {
      setLoading(false);
    }
  };




  const handleEditCategory = (category) => {
    setEditingCategory({
      ...category,
      topCategory: category.top_category,
      imageFile: null,
      imagePreviewUrl: category.image,
    });
    setIsEditing(true);
  };

  const handleUpdateCategory = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', editingCategory.name);

      if (editingCategory.imageFile) {
        formData.append('image', editingCategory.imageFile); // actual file
      }
      formData.append(
        'top_category',
        editingCategory.topCategory === '1' || editingCategory.topCategory === true ? '1' : '0'
      );

      const token = localStorage.getItem('adminToken');

      await axios.post(`${BASE_URL}/Api/category/update/${editingCategory.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-Authorization': `Bearer ${token}`,
        },
      });

      fetchCategories();
      setIsEditing(false);
      setEditingCategory(null);
    } catch (error) {

      alert(error.response?.data?.message || 'Failed to update category.');
    }
    finally {
      setLoading(false);
    }
  };


  const handleDeleteCategory = async (id) => {
    const token = localStorage.getItem('adminToken');
    try {
      await axios.delete(`${BASE_URL}/Api/category/delete/${id}`, {
        headers: {
          'x-Authorization': `Bearer ${token}`,
        },
      });
      fetchCategories();
    } catch (error) {

      alert(error.response?.data?.message || 'Failed to delete category.');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 mt-6 mb-12 font-body">
      {loading && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left side: Top Categories */}
        <div className="md:col-span-1 border-r border-stone-200 pr-4">
          <h2 className="text-xl font-bold font-display mb-4">Top Categories</h2>
          <ul className="flex flex-col gap-2">
            {topCategories.map((category) => (
              <li key={category.id} className="flex justify-between items-center bg-white border border-stone-200 rounded p-3 shadow-sm">
               <span className="text-sm font-medium text-stone-800">
  #{category.id} - {category.name}
</span>
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    width={50}
                    className="ms-2"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Right side: All Categories + Management */}
        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold font-display mb-6">Category Manager</h1>

          <div className="bg-white border border-stone-200 rounded-lg shadow-sm mb-8 overflow-hidden">
            <div className="p-6">
              {isEditing ? (
                <div>
                  <h2 className="text-lg font-bold mb-4 text-charcoal">Edit Category</h2>
                  <form onSubmit={handleUpdateCategory}>
                    <div className="mb-4">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-brand"
                        value={editingCategory.name}
                        onChange={(e) =>
                          setEditingCategory({ ...editingCategory, name: e.target.value })
                        }
                        placeholder="Category Name"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <input
                        type="file"
                        className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-brand"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          const imageUrl = file ? URL.createObjectURL(file) : '';
                          setEditingCategory({
                            ...editingCategory,
                            imageFile: file,
                            imagePreviewUrl: imageUrl,
                          });
                        }}
                        accept="image/*"
                      />
                      {editingCategory.imagePreviewUrl && (
                        <img
                          src={editingCategory.imagePreviewUrl}
                          alt="Preview"
                          width={60}
                          className="mt-2"
                        />
                      )}
                    </div>
                    <div className="mb-4 flex items-center gap-2">
                      <label className="font-semibold text-sm">Top Category:</label>
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-brand focus:ring-brand accent-brand border-stone-300 rounded"
                        checked={editingCategory.topCategory === '1' || editingCategory.topCategory === true}
                        onChange={() =>
                          setEditingCategory({
                            ...editingCategory,
                            topCategory:
                              editingCategory.topCategory === '1' || editingCategory.topCategory === true
                                ? '0'
                                : '1',
                          })
                        }
                      />
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button type="submit" className="px-5 py-2 bg-red-700 text-white rounded font-semibold hover:bg-red-800 transition">Save Changes</button>
                      <button type="button" className="px-5 py-2 bg-stone-200 text-stone-700 rounded font-semibold hover:bg-stone-300 transition" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-bold mb-4 text-charcoal">Add New Category</h2>
                  <form onSubmit={handleAddCategory}>
                    <div className="mb-4">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-brand"
                        placeholder="Category Name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <input
                        type="file"
                        className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-brand"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const imageUrl = URL.createObjectURL(file);
                            setNewCategoryImageFile(file);
                            setNewCategoryImageUrl(imageUrl);
                          }
                        }}

                      />
                      {newCategoryImageUrl && (
                        <img src={newCategoryImageUrl} alt="Preview" width={60} className="mt-2" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-4 mt-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-brand focus:ring-brand accent-brand border-stone-300 rounded"
                        checked={isTopCategory}
                        onChange={(e) => setIsTopCategory(e.target.checked)}
                        id="topcat"
                      />
                      <label htmlFor="topcat" className="font-semibold text-sm cursor-pointer">Top Category</label>
                    </div>
                    <button type="submit" className="px-5 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition">Add Category</button>
                  </form>
                </div>
              )}
            </div>
          </div>

          <h2 className="text-xl font-bold font-display mb-4">All Categories</h2>
          <ul className="flex flex-col gap-3">
            {categories.map((category) => (
              <li key={category.id} className="flex justify-between items-center bg-white border border-stone-200 rounded p-4 shadow-sm">
               <span className="text-sm font-medium text-stone-800">
  #{category.id} - {category.name}
</span>
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    width={50}
                    className="ms-2"
                  />
                )}
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded text-sm font-semibold hover:bg-yellow-600 transition" onClick={() => handleEditCategory(category)}>
                    Edit
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700 transition" onClick={() => handleDeleteCategory(category.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
