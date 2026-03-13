/**
 * AdminUI.js — Shared admin component library
 * Used across all admin pages for consistent styling (Tailwind CSS, stone/red palette).
 */
import React from "react";

// ── Loading overlay ────────────────────────────────────────────────────────────
export const AdminLoader = () => (
  <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/50">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-red-600"></div>
  </div>
);

// ── Page header: title + optional action slot ──────────────────────────────────
export const AdminPageHeader = ({ title, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
    <h1 className="text-2xl font-bold text-stone-800">{title}</h1>
    {action && <div>{action}</div>}
  </div>
);

// ── Section card ───────────────────────────────────────────────────────────────
export const AdminCard = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-stone-200 mb-6 overflow-hidden ${className}`}>
    {title && (
      <div className="px-5 py-3 bg-stone-800 text-white font-semibold text-sm">{title}</div>
    )}
    <div className="p-5">{children}</div>
  </div>
);

// ── Form input ─────────────────────────────────────────────────────────────────
export const AdminInput = ({ label, htmlFor, ...props }) => (
  <div>
    {label && (
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-stone-700 mb-1">
        {label}
      </label>
    )}
    <input
      id={htmlFor}
      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 transition"
      {...props}
    />
  </div>
);

// ── Textarea ───────────────────────────────────────────────────────────────────
export const AdminTextarea = ({ label, htmlFor, rows = 3, ...props }) => (
  <div>
    {label && (
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-stone-700 mb-1">
        {label}
      </label>
    )}
    <textarea
      id={htmlFor}
      rows={rows}
      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 transition resize-y"
      {...props}
    />
  </div>
);

// ── Select ─────────────────────────────────────────────────────────────────────
export const AdminSelect = ({ label, htmlFor, children, ...props }) => (
  <div>
    {label && (
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-stone-700 mb-1">
        {label}
      </label>
    )}
    <select
      id={htmlFor}
      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 transition bg-white"
      {...props}
    >
      {children}
    </select>
  </div>
);

// ── Button ─────────────────────────────────────────────────────────────────────
export const AdminBtn = ({ children, variant = "primary", size = "md", className = "", disabled, ...props }) => {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm" };
  const variants = {
    primary:   "bg-red-700 hover:bg-red-800 text-white",
    secondary: "bg-stone-200 hover:bg-stone-300 text-stone-700",
    danger:    "bg-red-600 hover:bg-red-700 text-white",
    outline:   "border border-stone-300 bg-white hover:bg-stone-50 text-stone-700",
    success:   "bg-green-600 hover:bg-green-700 text-white",
    warning:   "bg-amber-500 hover:bg-amber-600 text-white",
  };
  return (
    <button
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// ── Modal ──────────────────────────────────────────────────────────────────────
export const AdminModal = ({ title, onClose, children, size = "md" }) => {
  const widths = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl shadow-xl w-full ${widths[size] || widths.md} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-stone-200">
          <h3 className="text-base font-bold text-stone-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

// ── Scrollable table wrapper ────────────────────────────────────────────────────
export const AdminTable = ({ headers, children, emptyMessage }) => (
  <div className="overflow-x-auto rounded-xl border border-stone-200 shadow-sm">
    <table className="w-full text-left bg-white min-w-max">
      <thead className="bg-stone-800 text-white">
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="px-4 py-3 text-xs font-semibold whitespace-nowrap">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-stone-200">{children}</tbody>
    </table>
    {emptyMessage && (
      <div className="text-center py-8 text-stone-500 text-sm">{emptyMessage}</div>
    )}
  </div>
);

// ── Accordion item (replaces Bootstrap accordion) ─────────────────────────────
export const AdminAccordion = ({ title, count, isOpen, onToggle, children }) => (
  <div className="border border-stone-200 rounded-xl overflow-hidden mb-2">
    <button
      className="w-full flex items-center justify-between px-4 py-3 bg-stone-50 hover:bg-stone-100 transition text-left"
      type="button"
      onClick={onToggle}
    >
      <span className="font-semibold text-stone-800 text-sm">{title}</span>
      <div className="flex items-center gap-2">
        {count !== undefined && (
          <span className="bg-stone-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
        <span
          className={`text-stone-500 transition-transform duration-200 inline-block ${isOpen ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </div>
    </button>
    {isOpen && (
      <div className="bg-white border-t border-stone-200 divide-y divide-stone-100">
        {children}
      </div>
    )}
  </div>
);

// ── Pagination bar ──────────────────────────────────────────────────────────────
export const AdminPagination = ({
  page,
  totalPages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  rowOptions = [10, 25, 50],
}) => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white border-t border-stone-200">
    {onRowsPerPageChange && (
      <div className="flex items-center gap-2 text-sm text-stone-600">
        <span className="font-medium">Rows per page:</span>
        <select
          value={rowsPerPage}
          onChange={onRowsPerPageChange}
          className="px-2 py-1 border border-stone-300 rounded text-sm outline-none focus:border-red-700"
        >
          {rowOptions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
    )}
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1.5 border border-stone-300 rounded-lg text-sm hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Previous
      </button>
      <span className="text-sm text-stone-600 font-medium">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1.5 border border-stone-300 rounded-lg text-sm hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Next
      </button>
    </div>
  </div>
);

// ── Status badge ───────────────────────────────────────────────────────────────
export const AdminBadge = ({ label, status }) => {
  const colors = {
    Delivered: "bg-green-100 text-green-700",
    Shipped:   "bg-blue-100 text-blue-700",
    Placed:    "bg-amber-100 text-amber-700",
    Refunded:  "bg-purple-100 text-purple-700",
    Active:    "bg-green-100 text-green-700",
    Inactive:  "bg-red-100 text-red-700",
  };
  const display = label || status;
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-semibold ${colors[status] || "bg-stone-100 text-stone-700"}`}
    >
      {display}
    </span>
  );
};

// ── Section search input ───────────────────────────────────────────────────────
export const AdminSearch = ({ value, onChange, placeholder = "Search..." }) => (
  <input
    type="text"
    className="w-full md:w-64 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 transition"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
);
