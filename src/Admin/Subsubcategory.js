import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL
  ? process.env.REACT_APP_API_BASE_URL.replace("/Api","")
  : 'https://kitchenarykart.com/kitchen_app';

const SubsubcategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [subsubcategories, setSubsubcategories] = useState([]);

  const [newSubsubcategoryName, setNewSubsubcategoryName] = useState('');
  const [newSubsubcategoryImageFile, setNewSubsubcategoryImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingSubsubcategoryId, setEditingSubsubcategoryId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [existingSearch, setExistingSearch] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const formRef = useRef(null);

  // Normalize text to avoid case sensitivity or extra space issues
  const normalize = (str) => str?.trim()?.toLowerCase() || "";

  // Sorted & filtered subcategories
  const sortedSubcategories = [...subcategories].sort((a, b) =>
    normalize(a.name).localeCompare(normalize(b.name))
  );

  const filteredSubcategories = sortedSubcategories.filter(sub =>
    normalize(sub.name).includes(normalize(searchQuery))
  );

  // Sorted categories
  const sortedCategories = [...categories].sort((a, b) =>
    normalize(a.name).localeCompare(normalize(b.name))
  );
useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
}, []);
  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/Api/category/index`);
      setCategories(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching categories:", err);
    }
  };

  // Fetch subcategories
  const fetchSubcategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/Api/subcategory/index`);
      setSubcategories(res.data || []);
    } catch (err) {
      console.error('❌ Error fetching subcategories:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subsubcategories
  const fetchSubsubcategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/Api/subsubcategory/index`);
      // API may return { data: [...] } or a plain array — handle both
      const raw = res.data;
      const list = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
      setSubsubcategories(list);
    } catch (err) {
      console.error('❌ Error fetching subsubcategories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchSubsubcategories();
  }, []);

  // Save subsubcategory
  const handleSaveSubsubcategory = async (e) => {
    e.preventDefault();
    if (!selectedSubcategoryId) return;

    const formData = new FormData();
    formData.append('name', newSubsubcategoryName);
    formData.append('subcategoryId', selectedSubcategoryId);
    if (newSubsubcategoryImageFile) {
      formData.append('image', newSubsubcategoryImageFile);
    }

    const token = localStorage.getItem("adminToken");
    const url = isEditing
      ? `${BASE_URL}/Api/subsubcategory/update/${editingSubsubcategoryId}`
      : `${BASE_URL}/Api/subsubcategory/create`;

    setLoading(true);
    try {
      await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-Authorization': `Bearer ${token}`,
        },
      });
      resetForm();
      fetchSubsubcategories();
    } catch (err) {
      console.error('❌ Error saving subsubcategory:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete subsubcategory
  const handleDeleteSubsubcategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subsubcategory?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${BASE_URL}/Api/subsubcategory/delete/${id}`, {
        headers: { 'x-Authorization': `Bearer ${token}` },
      });
      fetchSubsubcategories();
    } catch (err) {
      console.error('❌ Error deleting subsubcategory:', err);
    } finally {
      setLoading(false);
    }
  };

  // Edit subsubcategory
  const handleEditSubsubcategory = (item) => {
    setNewSubsubcategoryName(item.name);
    setSelectedSubcategoryId(item.subcategory_id);
    setPreviewImage(item.image || '');
    setIsEditing(true);
    setEditingSubsubcategoryId(item.id);
    if (formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  // Reset form
  const resetForm = () => {
    setNewSubsubcategoryName('');
    setNewSubsubcategoryImageFile(null);
    setPreviewImage('');
    setSelectedSubcategoryId('');
    setIsEditing(false);
    setEditingSubsubcategoryId(null);
  };

  // Group subsubcategories
  const groupedSubsubcategories = sortedSubcategories
    .map((subcategory) => {
      const filtered = subsubcategories.filter(
        (item) => parseInt(item.subcategory_id) === parseInt(subcategory.id)
      );
      return { subcategory, subsubcategories: filtered };
    })
    .filter((group) => group.subsubcategories.length > 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {loading && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/50">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-red-600"></div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-stone-800 mb-6">🗃️ Subsubcategory Manager</h2>

      {/* Add / Edit Form */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 mb-6 overflow-hidden" ref={formRef}>
        <div className="px-5 py-3 bg-stone-800 text-white font-semibold text-sm">
          {isEditing ? "Edit Subsubcategory" : "Add New Subsubcategory"}
        </div>
        <form onSubmit={handleSaveSubsubcategory} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">Subsubcategory Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 transition"
              placeholder="Subsubcategory Name"
              value={newSubsubcategoryName}
              onChange={(e) => setNewSubsubcategoryName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">Image</label>
            <input
              type="file"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setNewSubsubcategoryImageFile(file);
                  setPreviewImage(URL.createObjectURL(file));
                }
              }}
            />
            {previewImage && (
              <img src={previewImage} alt="Preview" className="mt-2 w-16 h-16 object-cover rounded-lg border border-stone-200" />
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">Select Parent Subcategory</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 transition mb-2"
              placeholder="🔍 Search subcategory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              size={searchQuery ? 5 : 1}
              value={selectedSubcategoryId}
              onChange={(e) => {
                setSelectedSubcategoryId(e.target.value);
                setTimeout(() => { setSearchQuery(""); }, 150);
              }}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 transition"
              required
            >
              <option value="">Select Subcategory</option>
              {filteredSubcategories.map((sub) => {
                const mainCategory = sortedCategories.find(
                  (cat) => parseInt(cat.id) === parseInt(sub.category_id)
                );
                return (
                  <option key={sub.id} value={sub.id}>
                    #{sub.id}-{sub.name.trim()}{mainCategory ? ` (${mainCategory.name.trim()})` : ""}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="submit" className="flex-1 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-sm font-semibold transition">
              {isEditing ? "Update Subsubcategory" : "Add Subsubcategory"}
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="flex-1 px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-sm font-semibold transition">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Search Existing */}
      <div className="mb-4">
        <input
          type="text"
          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 transition"
          placeholder="Search by subsubcategory, subcategory or category name..."
          value={existingSearch}
          onChange={(e) => setExistingSearch(e.target.value)}
        />
      </div>

      <h3 className="text-lg font-bold text-stone-800 mb-3">Existing Subsubcategories</h3>

      {groupedSubsubcategories.length > 0 ? (
        <div className="space-y-2">
          {groupedSubsubcategories.map((group, index) => {
            const subName = normalize(group.subcategory.name);
            const mainCategory = sortedCategories.find(
              (cat) => parseInt(cat.id) === parseInt(group.subcategory.category_id)
            );
            const catName = normalize(mainCategory?.name || "");

            const hasMatch =
              subName.includes(normalize(existingSearch)) ||
              catName.includes(normalize(existingSearch)) ||
              group.subsubcategories.some((item) =>
                normalize(item.name).includes(normalize(existingSearch))
              );

            if (!hasMatch) return null;

            const isOpen = openIndex === index;
            return (
              <div key={group.subcategory.id} className="border border-stone-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-3 bg-stone-50 hover:bg-stone-100 transition text-left"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="font-semibold text-stone-800 text-sm">
                   #{group.subcategory.id}-{group.subcategory.name}
                    {mainCategory ? <span className="text-stone-500 font-normal"> ({mainCategory.name})</span> : ""}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="bg-stone-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">{group.subsubcategories.length}</span>
                    <span className={`text-stone-500 transition-transform duration-200 text-xs ${isOpen ? "rotate-180" : ""}`}>▾</span>
                  </div>
                </button>
                {isOpen && (
                  <ul className="divide-y divide-stone-100 bg-white">
                    {group.subsubcategories
                      .sort((a, b) => normalize(a.name).localeCompare(normalize(b.name)))
                      .map((item) => (
                        <li key={item.id} className="flex items-center justify-between px-4 py-3 hover:bg-stone-50 transition-colors">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-stone-200" />
                            )}
                            <span className="text-sm text-stone-700">#{item.id}-{item.name}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditSubsubcategory(item)}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-semibold transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSubsubcategory(item.id)}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition"
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-stone-50 rounded-xl border border-stone-200 text-stone-500 text-sm">
          No subsubcategories available.
        </div>
      )}
    </div>
  );
};

export default SubsubcategoryManager;
