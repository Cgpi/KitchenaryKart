
import React, { useState } from 'react';
import { Link, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import ProductList from './ProductList';
import Category from './Category';
import SubcategoryManager from './Subcategory';
import SubsubcategoryManager from './Subsubcategory';
import { useAdminAuth } from '../contexts/AdminAuthContext';

// ── Merged category & subcategory selectors ────────────────────────
// CategorySelector replaces: CategorySelection, CategorySelection2–5
// SubcategorySelector replaces: SubcategorySelection, SubcategorySelection2–5
import CategorySelector from './CategorySelector';
import SubcategorySelector from './SubcategorySelector';

import OrderManagement from './OrderManagement';
import OrderStats from './OrderStats';
import VariantReviewTable from './VariantReviewTable';
import CouponManager from './CouponManager';
import VariantQnATable from './VariantQnATable';
import AdminUserManagement from './AdminUserManagement';
import DeliveryPartnerPage from './DeliveryPartnerPage';
import AdminEmailBroadcast from './AdminEmailBroadcast';

const AdminPanel = () => {
    const { adminLogout } = useAdminAuth();
    const location = useLocation();
    const [showSelectionLinks, setShowSelectionLinks] = useState(false);
    const [showSelectionLinks2, setShowSelectionLinks2] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navLink = (to, label) => {
        const active = location.pathname === `/admin${to}`;
        return (
            <li>
                <Link
                    to={`/admin${to}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`block px-3 py-2 rounded-lg transition text-sm font-medium ${
                        active
                            ? 'bg-red-700 text-white'
                            : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                    }`}
                >
                    {label}
                </Link>
            </li>
        );
    };

    return (
        <div className="flex h-screen overflow-hidden bg-stone-100 font-body w-full">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <nav className={`
                fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
                w-60 h-screen bg-stone-900 text-white flex flex-col flex-shrink-0
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex items-center justify-between px-4 py-4 border-b border-stone-700">
                    <h2 className="text-lg font-bold font-display tracking-tight"> Admin Panel</h2>
                    <button
                        className="lg:hidden text-stone-400 hover:text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        ✕
                    </button>
                </div>
                <ul className="flex flex-col gap-0.5 px-3 py-4 text-sm flex-1 overflow-y-auto">
                    {navLink('/products', '📦 Manage Products')}
                    {navLink('/categories', '🗂 Categories')}
                    {navLink('/subcategories', '📁 Subcategories')}
                    {navLink('/subsubcategories', '📂 Subsubcategories')}
                    {navLink('/ordermanagement', '🛒 Order Management')}
                    {navLink('/orderstats', '📊 Order Stats')}
                    {navLink('/users', '👥 Users')}
                    {navLink('/review', '⭐ Reviews')}
                    {navLink('/QA', '❓ Q&A')}
                    {navLink('/coupons', '🎟 Coupons')}
                    {navLink('/delivery-partner', '🚚 Delivery Partners')}
                    {navLink('/user-email-broadcast', '📧 Email Broadcast')}

                    {/* Selection dropdown */}
                    <li>
                        <button
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-800 transition flex justify-between items-center text-stone-300 text-sm font-medium"
                            onClick={() => setShowSelectionLinks(!showSelectionLinks)}
                        >
                            🔧 Selection
                            <span className={`transition-transform duration-200 inline-block ${showSelectionLinks ? 'rotate-180' : ''}`}>▾</span>
                        </button>
                        {showSelectionLinks && (
                            <ul className="flex flex-col gap-0.5 pl-3 mt-1 border-l border-stone-700 ml-3">
                                {[1,2,3,4,5].map(n => (
                                    <li key={n}>
                                        <Link
                                            to={`/admin/selectedcategories${n === 1 ? '' : n}`}
                                            onClick={() => setSidebarOpen(false)}
                                            className="block px-3 py-1.5 rounded hover:bg-stone-800 transition text-stone-400 hover:text-white text-xs"
                                        >
                                            Selected Categories {n}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>

                    {/* Selection Sub dropdown */}
                    <li>
                        <button
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-800 transition flex justify-between items-center text-stone-300 text-sm font-medium"
                            onClick={() => setShowSelectionLinks2(!showSelectionLinks2)}
                        >
                            🔖 Selection Sub
                            <span className={`transition-transform duration-200 inline-block ${showSelectionLinks2 ? 'rotate-180' : ''}`}>▾</span>
                        </button>
                        {showSelectionLinks2 && (
                            <ul className="flex flex-col gap-0.5 pl-3 mt-1 border-l border-stone-700 ml-3">
                                {[1,2,3,4,5].map(n => (
                                    <li key={n}>
                                        <Link
                                            to={`/admin/selectedsubcategories${n === 1 ? '' : n}`}
                                            onClick={() => setSidebarOpen(false)}
                                            className="block px-3 py-1.5 rounded hover:bg-stone-800 transition text-stone-400 hover:text-white text-xs"
                                        >
                                            Selected SubCategories {n}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                </ul>

                {/* Logout */}
                <div className="px-3 pb-4">
                    <button
                        onClick={adminLogout}
                        className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Mobile top bar */}
                <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-stone-900 text-white sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-stone-300 hover:text-white text-xl"
                    >
                        ☰
                    </button>
                    <span className="font-bold font-display text-sm">🍳 Admin Panel</span>
                </div>

                <div className="flex-1 bg-stone-100 p-4 sm:p-6 overflow-y-auto h-full">
                    <Routes>
                    <Route index element={<Navigate to="products" replace />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/categories" element={<Category />} />
                    <Route path="/subcategories" element={<SubcategoryManager />} />
                    <Route path="/subsubcategories" element={<SubsubcategoryManager />} />

                    {/* ── Category selection routes (5 slots → 1 component) ── */}
                    <Route path="/selectedcategories" element={<CategorySelector key="cat-slot-1" slotIndex={1} />} />
                    <Route path="/selectedcategories2" element={<CategorySelector key="cat-slot-2" slotIndex={2} />} />
                    <Route path="/selectedcategories3" element={<CategorySelector key="cat-slot-3" slotIndex={3} />} />
                    <Route path="/selectedcategories4" element={<CategorySelector key="cat-slot-4" slotIndex={4} />} />
                    <Route path="/selectedcategories5" element={<CategorySelector key="cat-slot-5" slotIndex={5} />} />

                    {/* ── Subcategory selection routes (5 slots → 1 component) ── */}
                    <Route path="/selectedsubcategories" element={<SubcategorySelector key="sub-slot-1" slotIndex={1} />} />
                    <Route path="/selectedsubcategories2" element={<SubcategorySelector key="sub-slot-2" slotIndex={2} />} />
                    <Route path="/selectedsubcategories3" element={<SubcategorySelector key="sub-slot-3" slotIndex={3} />} />
                    <Route path="/selectedsubcategories4" element={<SubcategorySelector key="sub-slot-4" slotIndex={4} />} />
                    <Route path="/selectedsubcategories5" element={<SubcategorySelector key="sub-slot-5" slotIndex={5} />} />

                    <Route path="/ordermanagement" element={<OrderManagement />} />
                    <Route path="/orderstats" element={<OrderStats />} />
                    <Route path="/review" element={<VariantReviewTable />} />
                    <Route path="/coupons" element={<CouponManager />} />
                    <Route path="/QA" element={<VariantQnATable />} />
                    <Route path="/users" element={<AdminUserManagement />}></Route>
                    <Route path="/delivery-partner" element={<DeliveryPartnerPage />}></Route>
                    <Route path="/user-email-broadcast" element={<AdminEmailBroadcast />}></Route>
                </Routes>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
