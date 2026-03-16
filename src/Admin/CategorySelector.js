/**
 * CategorySelector — merged replacement for CategorySelection1–5.
 * 
 * WHY MERGED: All 5 CategorySelection files (CategorySelection.js,
 * CategorySelection2.js, CategorySelection3.js, CategorySelection4.js,
 * CategorySelection5.js) were structurally IDENTICAL. The ONLY difference
 * between them was the API endpoint suffix:
 *   - CategorySelection.js  → /Api/Selected_category/
 *   - CategorySelection2.js → /Api/Selected_category2/
 *   - CategorySelection3.js → /Api/Selected_category3/
 *   etc.
 *
 * This single component accepts a `slotIndex` prop (1–5) and derives
 * the correct endpoint. Zero functionality change — backend API untouched.
 *
 * Usage:
 *   <CategorySelector slotIndex={1} />  — was CategorySelection
 *   <CategorySelector slotIndex={2} />  — was CategorySelection2
 *   ... etc.
 */
import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL
    ? process.env.REACT_APP_API_BASE_URL.replace("/Api", "")
    : 'https://kitchenarykart.com/kitchen_app';

const CategorySelector = ({ slotIndex = 1 }) => {
    // suffix: slot 1 → "" (empty), slot 2–5 → "2", "3", "4", "5"
    const suffix = slotIndex === 1 ? "" : String(slotIndex);
    const endpoint = `${BASE_URL}/Api/Selected_category${suffix}`;

    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    /* ── Fetch all categories ─────────────────────────────────────── */
    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/Api/category/index`);
            // Sort alphabetically, trim names — same as Category.js
            const sorted = (res.data || [])
                .map((c) => ({ ...c, name: c.name.trim() }))
                .sort((a, b) => a.name.localeCompare(b.name));
            setCategories(sorted);
        } catch {
            // silent fail
        }
    };

    /* ── Fetch currently selected category for this slot ─────────── */
    const fetchSelected = async () => {
        try {
            const res = await axios.get(`${endpoint}/index`);
            if (res.data?.categoryId) {
                setSelectedCategoryId(String(res.data.categoryId));
            }
        } catch {
            // no selection yet
        }
    };

    useEffect(() => {
        // Reset state so a previous slot's value doesn't bleed into the new slot
        setSelectedCategoryId(null);
        setMessage("");
        fetchCategories();
        fetchSelected();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slotIndex]);

    /* ── Save selection ───────────────────────────────────────────── */
    const handleSave = async () => {
        if (!selectedCategoryId) {
            setMessage("Please select a category first.");
            return;
        }
        setLoading(true);
        setMessage("");
        try {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                setMessage("❌ Failed: No authentication token found. Please log in again.");
                setLoading(false);
                return;
            }
            await axios.put(
                `${endpoint}/update?categoryId=${selectedCategoryId}`,
                {},
                { headers: { "x-Authorization": `Bearer ${token}` } }
            );
            setMessage(`✅ Slot ${slotIndex} category saved successfully!`);
        } catch (err) {
            console.error("Save error:", err);
            const errorMessage = err.response?.data?.message ||
                                err.response?.data?.error ||
                                err.message ||
                                "Unknown error";
            setMessage(`❌ Failed: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    /* ── Reset / remove selection ─────────────────────────────────── */
    const handleReset = async () => {
        if (!window.confirm(`Remove the category from home-page slot ${slotIndex}?`)) return;
        setLoading(true);
        setMessage("");
        try {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                setMessage("❌ Failed: No authentication token found. Please log in again.");
                setLoading(false);
                return;
            }
            await axios.put(
                `${endpoint}/update?categoryId=`,
                {},
                { headers: { "x-Authorization": `Bearer ${token}` } }
            );
            setSelectedCategoryId(null);
            setMessage(`✅ Slot ${slotIndex} cleared — section will be hidden on homepage.`);
        } catch (err) {
            console.error("Reset error:", err);
            const errorMessage = err.response?.data?.message ||
                                err.response?.data?.error ||
                                err.message ||
                                "Unknown error";
            setMessage(`❌ Reset failed: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 font-body">
            <h1 className="text-2xl font-bold font-display mb-2">
                Category Selection — Slot {slotIndex}
            </h1>
            <p className="text-sm text-stone-500 mb-6">
                Select which category appears in home-page slot {slotIndex}.
            </p>

            <div className="bg-white border border-stone-200 rounded-xl shadow-sm p-6">
                <label
                    htmlFor={`cat-select-${slotIndex}`}
                    className="block text-sm font-semibold text-stone-700 mb-2"
                >
                    Choose Category
                </label>
                <select
                    id={`cat-select-${slotIndex}`}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 mb-4"
                    value={selectedCategoryId || ""}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                    <option value="">— Select a category —</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={String(cat.id)}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 py-2 px-4 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg transition disabled:opacity-60"
                    >
                        {loading ? "Saving…" : `Save Slot ${slotIndex}`}
                    </button>
                    <button
                        onClick={handleReset}
                        disabled={loading || !selectedCategoryId}
                        className="py-2 px-4 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold rounded-lg transition disabled:opacity-40"
                        title="Remove selected category from this slot"
                    >
                        Reset
                    </button>
                </div>

                {message && (
                    <p className="mt-3 text-sm font-medium text-stone-700">{message}</p>
                )}
            </div>
        </div>
    );
};

export default CategorySelector;
