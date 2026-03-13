/**
 * SubcategorySelector — merged replacement for SubcategorySelection1–5.
 *
 * WHY MERGED: All 5 SubcategorySelection files were structurally IDENTICAL.
 * The ONLY difference between them was the API endpoint suffix:
 *   - SubcategorySelection.js  → /Api/Selected_subcategory/
 *   - SubcategorySelection2.js → /Api/Selected_subcategory2/
 *   etc.
 *
 * This single component accepts a `slotIndex` prop (1–5) and derives
 * the correct endpoint. Zero functionality change — backend API untouched.
 *
 * Usage:
 *   <SubcategorySelector slotIndex={1} />  — was SubcategorySelection
 *   <SubcategorySelector slotIndex={2} />  — was SubcategorySelection2
 *   ... etc.
 */
import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL
    ? process.env.REACT_APP_API_BASE_URL.replace("/Api", "")
    : "";

const SubcategorySelector = ({ slotIndex = 1 }) => {
    // suffix: slot 1 → "" (empty), slot 2–5 → "2", "3", "4", "5"
    const suffix = slotIndex === 1 ? "" : String(slotIndex);
    const endpoint = `${BASE_URL}/Api/Selected_subcategory${suffix}`;

    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState({});
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    /* ── Fetch all categories and subcategories with parent names ─── */
    const fetchSubcategories = async () => {
        try {
            // Fetch categories first
            const catRes = await axios.get(`${BASE_URL}/Api/category/index`);
            const categoriesData = catRes.data || [];
            setCategories(categoriesData);

            // Fetch subcategories and attach category names
            const subRes = await axios.get(`${BASE_URL}/Api/subcategory/index`);
            const mapped = (subRes.data || []).map((sc) => ({
                ...sc,
                categoryName: categoriesData.find(
                    (cat) => Number(cat.id) === Number(sc.category_id)
                )?.name || "Unknown"
            }));

            // Sort alphabetically
            const sorted = mapped.sort((a, b) =>
                `${a.name.trim()} (${a.categoryName})`.localeCompare(
                    `${b.name.trim()} (${b.categoryName})`
                )
            );
            setSubcategories(sorted);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    };

    /* ── Fetch currently selected subcategory for this slot ──────── */
    const fetchSelected = async () => {
        try {
            const res = await axios.get(`${endpoint}/index`);
            if (res.data?.subcategoryId) {
                setSelectedSubcategoryId(String(res.data.subcategoryId));
            }
        } catch {
            // no selection yet
        }
    };

    useEffect(() => {
        // Reset state so a previous slot's value doesn't bleed into the new slot
        setSelectedSubcategoryId(null);
        setMessage("");
        fetchSubcategories();
        fetchSelected();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slotIndex]);

    /* ── Save selection ───────────────────────────────────────────── */
    const handleSave = async () => {
        if (!selectedSubcategoryId) {
            setMessage("Please select a subcategory first.");
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
                `${endpoint}/update?subcategoryId=${selectedSubcategoryId}`,
                {},
                { headers: { "x-Authorization": `Bearer ${token}` } }
            );
            setMessage(`✅ Slot ${slotIndex} subcategory saved successfully!`);
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
        if (!window.confirm(`Remove the subcategory from home-page slot ${slotIndex}?`)) return;
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
                `${endpoint}/update?subcategoryId=`,
                {},
                { headers: { "x-Authorization": `Bearer ${token}` } }
            );
            setSelectedSubcategoryId(null);
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
                Subcategory Selection — Slot {slotIndex}
            </h1>
            <p className="text-sm text-stone-500 mb-6">
                Select which subcategory's products appear in home-page slot {slotIndex}.
            </p>

            <div className="bg-white border border-stone-200 rounded-xl shadow-sm p-6">
                <label
                    htmlFor={`subcat-select-${slotIndex}`}
                    className="block text-sm font-semibold text-stone-700 mb-2"
                >
                    Choose Subcategory
                </label>
                <select
                    id={`subcat-select-${slotIndex}`}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 mb-4"
                    value={selectedSubcategoryId || ""}
                    onChange={(e) => setSelectedSubcategoryId(e.target.value)}
                >
                    <option value="">— Select a subcategory —</option>
                    {subcategories.map((sub) => (
                        <option key={sub.id} value={String(sub.id)}>
                            {sub.name.trim()} ({sub.categoryName})
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
                        disabled={loading || !selectedSubcategoryId}
                        className="py-2 px-4 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold rounded-lg transition disabled:opacity-40"
                        title="Remove selected subcategory from this slot"
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

export default SubcategorySelector;
