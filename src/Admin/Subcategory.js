import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL
  ? process.env.REACT_APP_API_BASE_URL.replace("/Api","")
  : 'https://kitchenarykart.com/kitchen_app';

const SubcategoryManager = () => {
  const formRef = useRef(null);
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newSubcategoryImageFile, setNewSubcategoryImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editSubcategoryId, setEditSubcategoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingSearch, setExistingSearch] = useState('');
  const [openIndex, setOpenIndex] = useState(0);
  // ---------------- FETCH DATA ----------------
const fetchSubcategories = async () => {
  setLoading(true);
  try {
    const res = await axios.get(`${BASE_URL}/Api/subcategory/index`);

    const cleanSorted = res.data
      .map(s => ({ ...s, name: s.name.trim() }))
      .sort((a, b) => a.name.localeCompare(b.name));

    setSubcategories(cleanSorted);
  } catch (err) {
    console.error("Error fetching subcategories:", err);
  } finally {
    setLoading(false);
  }
};


  const fetchCategories = async () => {
  setLoading(true);
  try {
    const res = await axios.get(`${BASE_URL}/Api/category/index`);

    const cleanSorted = res.data
      .map(c => ({ ...c, name: c.name.trim() }))
      .sort((a, b) => a.name.localeCompare(b.name));

    setCategories(cleanSorted);
    setFilteredCategories(cleanSorted);
  } catch (err) {
    console.error("Error fetching categories:", err);
  } finally {
    setLoading(false);
  }
};


  // ---------------- HANDLE SEARCH ----------------
  useEffect(() => {
    if (!categorySearchTerm.trim()) {
      setFilteredCategories(categories);
      return;
    }
    const filtered = categories.filter(cat =>
  cat.name.trim().toLowerCase().includes(categorySearchTerm.toLowerCase())
);

    setFilteredCategories(filtered);
  }, [categorySearchTerm, categories]);

  // ---------------- SAVE / UPDATE ----------------
  const handleSaveSubcategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    if (!selectedCategoryId) {
      alert("Please select a category.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", newSubcategoryName);
      if (newSubcategoryImageFile) {
        formData.append("image", newSubcategoryImageFile);
      }
      formData.append("categoryId", selectedCategoryId);

      const headers = {
        "Content-Type": "multipart/form-data",
        "x-Authorization": `Bearer ${token}`,
      };

      if (isEditing) {
        await axios.post(
          `${BASE_URL}/Api/subcategory/update/${editSubcategoryId}`,
          formData,
          { headers }
        );
      } else {
        await axios.post(`${BASE_URL}/Api/subcategory/create`, formData, {
          headers,
        });
      }

      setNewSubcategoryName("");
      setNewSubcategoryImageFile(null);
      setPreviewImage("");
      setSelectedCategoryId("");
      setIsEditing(false);
      setEditSubcategoryId(null);
      await fetchSubcategories();
    } catch (err) {
      console.error("Error saving subcategory:", err);
      alert("Failed to save subcategory.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DELETE ----------------
  const handleDeleteSubcategory = async (id) => {
    const token = localStorage.getItem("adminToken");
    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/Api/subcategory/delete/${id}`, {
        headers: { "x-Authorization": `Bearer ${token}` },
      });
      await fetchSubcategories();
    } catch (err) {
      console.error("Error deleting subcategory:", err);
      alert("Failed to delete subcategory.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- EDIT ----------------
  const handleEditSubcategory = (subcategory) => {
    setIsEditing(true);
    setEditSubcategoryId(subcategory.id);
    setNewSubcategoryName(subcategory.name);
    setSelectedCategoryId(subcategory.category_id);
    setPreviewImage(subcategory.image);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditSubcategoryId(null);
    setNewSubcategoryName("");
    setNewSubcategoryImageFile(null);
    setPreviewImage("");
    setSelectedCategoryId("");
  };

  // ---------------- GROUPED DISPLAY ----------------
  const groupedSubcategories = categories.map(cat => ({
  category: cat,
  subcategories: subcategories
    .filter(s => s.category_id === cat.id)
    .sort((a, b) => a.name.localeCompare(b.name)) // sort inside groups
}));


  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  // ---------------- UI ----------------
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {loading && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/50">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-red-600"></div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-stone-800 mb-6">🗂️ Subcategory Manager</h2>

      {/* Add / Edit Form */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 mb-6 overflow-hidden" ref={formRef}>
        <div className="px-5 py-3 bg-stone-800 text-white font-semibold text-sm">
          {isEditing ? "Edit Subcategory" : "Add New Subcategory"}
        </div>
        <form onSubmit={handleSaveSubcategory} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">Subcategory Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 transition"
              placeholder="Subcategory Name"
              value={newSubcategoryName}
              onChange={(e) => setNewSubcategoryName(e.target.value)}
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
                  setNewSubcategoryImageFile(file);
                  setPreviewImage(URL.createObjectURL(file));
                }
              }}
            />
            {previewImage && (
              <img src={previewImage} alt="Preview" className="mt-2 w-16 h-16 object-cover rounded-lg border border-stone-200" />
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">Search Category</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 transition mb-2"
              placeholder="🔍 Search Category..."
              value={categorySearchTerm}
              onChange={(e) => setCategorySearchTerm(e.target.value)}
            />
            <select
              size={categorySearchTerm ? 5 : 1}
              value={selectedCategoryId}
              onChange={(e) => {
                setSelectedCategoryId(e.target.value);
                setCategorySearchTerm("");
              }}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 transition"
              required
            >
              <option value="">Select Category</option>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>#{cat.id} - {cat.name}</option>
                ))
              ) : (
                <option disabled>No results found</option>
              )}
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="submit" className="flex-1 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-sm font-semibold transition">
              {isEditing ? "Update Subcategory" : "Add Subcategory"}
            </button>
            {isEditing && (
              <button type="button" onClick={handleCancelEdit} className="flex-1 px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-sm font-semibold transition">
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
          placeholder="Search by subcategory or category name..."
          value={existingSearch}
          onChange={(e) => setExistingSearch(e.target.value)}
        />
      </div>

      <h3 className="text-lg font-bold text-stone-800 mb-3">Existing Subcategories</h3>

      {groupedSubcategories.filter((group) =>
        group.subcategories.some((s) =>
          s.name?.toLowerCase().includes(existingSearch.toLowerCase())
        )
      ).length > 0 ? (
        <div className="space-y-2">
          {groupedSubcategories
            .filter((group) =>
              group.subcategories.some((s) =>
                s.name?.toLowerCase().includes(existingSearch.toLowerCase())
              )
            )
            .map((group, index) => {
              const isOpen = openIndex === index;
              const matchCount = group.subcategories.filter((s) =>
                s.name?.toLowerCase().includes(existingSearch.toLowerCase())
              ).length;
              return (
                <div key={group.category.id} className="border border-stone-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-3 bg-stone-50 hover:bg-stone-100 transition text-left"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span className="font-semibold text-stone-800 text-sm">
                      {group.category.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="bg-stone-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">{matchCount}</span>
                      <span className={`text-stone-500 transition-transform duration-200 text-xs ${isOpen ? "rotate-180" : ""}`}>▾</span>
                    </div>
                  </button>
                  {isOpen && (
                    <ul className="divide-y divide-stone-100 bg-white">
                      {group.subcategories
                        .filter((s) =>
                          s.name?.toLowerCase().includes(existingSearch.toLowerCase())
                        )
                        .map((subcategory) => (
                          <li key={subcategory.id} className="flex items-center justify-between px-4 py-3 hover:bg-stone-50 transition-colors">
                            <div className="flex items-center gap-3">
                              {subcategory.image && (
                                <img
                                  src={subcategory.image}
                                  alt={subcategory.name}
                                  className="w-10 h-10 object-cover rounded-lg border border-stone-200"
                                />
                              )}
                              <span className="text-sm text-stone-700">#{subcategory.id}-{subcategory.name}</span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditSubcategory(subcategory)}
                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-semibold transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteSubcategory(subcategory.id)}
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
          No subcategories available.
        </div>
      )}
    </div>
  );
};

export default SubcategoryManager;
