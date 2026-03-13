import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CouponManager = () => {
  const [discount, setDiscount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [ coupons,setCoupons] = useState([]);
  const [couponId, setCouponId] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allCoupons, setAllCoupons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [couponsPerPage] = useState(25);
  const [filterDiscount, setFilterDiscount] = useState('');  // State for filtering
  // State for selected coupons
const [selectedCoupons, setSelectedCoupons] = useState([]);


  const API_BASE = `${process.env.REACT_APP_API_BASE_URL}`;

  const handleCreateCoupons = async () => {
    if (!discount || !quantity || Number(discount) <= 0 || Number(quantity) <= 0) {
      setMessage('⚠️ Please enter valid discount and quantity');
      setIsError(true);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.post(
        `${API_BASE}/coupons/create?discountPercentage=${discount}&quantity=${quantity}`,
  {},
  {
    headers: {
      "x-Authorization": `Bearer ${token}`,
    },
  }
      );
      setCoupons(res.data);

      // ✅ Change message text here
      setMessage('✅ Generated coupons successfully');
      setIsError(false);
      setDiscount('');
      setQuantity('');
      fetchAllCoupons();
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to create coupons');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

 const handleEditCoupon = async () => {
  if (!couponId || !newCode || !newDiscount) {
    setMessage('⚠️ Please fill all fields for updating coupon');
    setIsError(true);
    return;
  }

  try {
    const token = localStorage.getItem('adminToken');
    const res = await axios.put(
      `${API_BASE}/coupons/edit/${couponId}?newDiscountPercentage=${newDiscount}&newCode=${newCode}`,
      {}, // empty body if your API expects params only
      {
        headers: {
          "x-Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    setMessage(`✅ Coupon updated: ${res.data.code}`);
    setIsError(false);
    setCouponId('');
    setNewCode('');
    setNewDiscount('');
    fetchAllCoupons();
  } catch (err) {
    console.error(err);
    setMessage('❌ Failed to update coupon');
    setIsError(true);
  }
};

  // Handle single coupon selection
const handleSelectCoupon = (id, isChecked) => {
  setSelectedCoupons((prevSelected) =>
    isChecked ? [...prevSelected, id] : prevSelected.filter((couponId) => couponId !== id)
  );
};

// Handle select all functionality
const handleSelectAll = (isChecked) => {
  if (isChecked) {
    const allIds = allCoupons.map((coupon) => coupon.id);
    setSelectedCoupons(allIds);
  } else {
    setSelectedCoupons([]);
  }
};
const fetchAllCoupons = async () => {
  setLoading(true);
  console.log("🔄 Fetching all coupons...");

  try {
    const token = localStorage.getItem("adminToken");
    console.log("📌 Retrieved token:", token);

    const res = await axios.get(`${API_BASE}/coupons/all`, {
      headers: {
        "x-Authorization": `Bearer ${token}`,
      },
    });

    console.log("✅ Axios response:", res);
    console.log("📦 Coupons data:", res.data);

    // ✅ Normalize here: convert used into boolean, id and discount_percentage into numbers
    const normalizedData = res.data.map((coupon) => ({
      ...coupon,
      id: Number(coupon.id),
      discount_percentage: Number(coupon.discount_percentage),
      used: coupon.used === "1" || coupon.used === 1, // true if 1, false if 0
    }));

    setAllCoupons(normalizedData);
    setMessage(`✅ Fetched ${normalizedData.length} coupons`);
    setIsError(false);

    console.log(`🎉 Successfully fetched ${normalizedData.length} coupons`);
  } catch (err) {
    console.error("❌ Error fetching coupons:", err);
    setMessage("❌ Failed to fetch all coupons");
    setIsError(true);
  } finally {
    setLoading(false);
    console.log("⏹️ Fetch coupons request finished");
  }
};



 const handleFilterCoupons = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem('adminToken');
    const res = await axios.get(
      `${API_BASE}/coupons/filter?discountPercentage=${filterDiscount}`,
      {
        headers: {
          "x-Authorization": `Bearer ${token}`,
        },
      }
    );

    // Normalize the data
    const normalizedData = res.data.map((coupon) => ({
      ...coupon,
      id: Number(coupon.id),
      discount_percentage: Number(coupon.discount_percentage),
      used: coupon.used === "1" || coupon.used === 1, // true if 1, false if 0
    }));

    setAllCoupons(normalizedData); // Use normalized data
    setMessage(`✅ Fetched filtered coupons`);
    setIsError(false);
  } catch (err) {
    console.error(err);
    setMessage('❌ Failed to fetch filtered coupons');
    setIsError(true);
  } finally {
    setLoading(false);
  }
};

  const handleEditClick = (coupon) => {
    setCouponId(coupon.id);
    setNewCode(coupon.code);
    setNewDiscount(coupon.discount_percentage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

 // Delete a single coupon
const handleDeleteCoupon = async (id) => {
  try {
    const token = localStorage.getItem('adminToken');
    await axios.delete(`${API_BASE}/coupons/delete_coupon/${id}`,
  
  {
    headers: {
      "x-Authorization": `Bearer ${token}`,
    },
  });
    setMessage("✅ Coupon deleted successfully");
    setIsError(false);
    fetchAllCoupons();
  } catch (err) {
    console.error(err);
    setMessage("❌ Failed to delete coupon");
    setIsError(true);
  }
};

const handleDeleteMultipleCoupons = async (ids) => {
  if (ids.length === 0) {
    setMessage("⚠️ No coupons selected for deletion");
    setIsError(true);
    return;
  }

  try {
    const token = localStorage.getItem('adminToken');

    // Converting IDs to couponIds[]= format
    const params = new URLSearchParams();
    ids.forEach((id) => params.append("couponIds[]", id));

    await axios.delete(`${API_BASE}/coupons/delete_coupon`, {
      params,
      headers: {
        "x-Authorization": `Bearer ${token}`,
      },
    });

    setMessage("✅ Selected coupons deleted successfully");
    setIsError(false);
    setSelectedCoupons([]);
    fetchAllCoupons();
  } catch (err) {
    console.error(err);
    setMessage("❌ Failed to delete selected coupons");
    setIsError(true);
  }
};




  // Paginate Coupons
  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
  const currentCoupons = allCoupons.slice(indexOfFirstCoupon, indexOfLastCoupon);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchAllCoupons();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {loading && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-6">🎟️ Coupon Management</h2>

      {/* Create Coupons */}
      <div className="bg-white rounded-lg shadow mb-6 border-l-4 border-red-600">
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-t-lg font-semibold">
          Create Bulk Coupons
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <input
                type="number"
                placeholder="Discount Percentage"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Quantity"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>
          <button
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCreateCoupons}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Coupons'}
          </button>
        </div>
      </div>

      {/* Edit Coupon */}
      {couponId && (
        <div className="bg-white rounded-lg shadow mb-6 border-l-4 border-yellow-500">
          <div className="bg-yellow-500 text-gray-800 px-6 py-3 rounded-t-lg font-semibold">Edit Coupon</div>
          <div className="p-6">
            <input
              type="text"
              placeholder="Coupon Code"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 transition"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
            />
            <input
              type="number"
              placeholder="Discount Percentage"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 transition"
              value={newDiscount}
              onChange={(e) => setNewDiscount(e.target.value)}
            />
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium" onClick={handleEditCoupon}>
              Update Coupon
            </button>
          </div>
        </div>
      )}

      {/* Filter Coupons */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-t-lg font-semibold">Filter Coupons</div>
        <div className="p-6">
          <input
            type="number"
            placeholder="Filter by Discount Percentage"
            className="w-full px-3 py-2 border border-stone-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 transition"
            value={filterDiscount}
            onChange={(e) => setFilterDiscount(e.target.value)}
          />
          <button className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-sm font-semibold transition" onClick={handleFilterCoupons}>
            Filter Coupons
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`px-4 py-3 rounded-lg mb-6 ${isError ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'}`}>
          {message}
        </div>
      )}

      {/* All Coupons */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 flex justify-between items-center rounded-t-lg">
          <span className="font-semibold">All Coupons</span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleDeleteMultipleCoupons(selectedCoupons)}
              disabled={selectedCoupons.length === 0}
            >
              Delete Selected
            </button>
            <button
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={fetchAllCoupons}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Fetch Coupons'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {allCoupons.length > 0 ? (
            <table className="w-full border-collapse">
              <thead className="bg-stone-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold">
                    <input
                      type="checkbox"
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      checked={selectedCoupons.length === allCoupons.length && allCoupons.length > 0}
                      className="w-4 h-4 cursor-pointer accent-red-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold">ID</th>
                  <th className="px-4 py-3 text-xs font-semibold">Code</th>
                  <th className="px-4 py-3 text-xs font-semibold">Discount %</th>
                  <th className="px-4 py-3 text-xs font-semibold">Used</th>
                  <th className="px-4 py-3 text-xs font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {currentCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedCoupons.includes(coupon.id)}
                        onChange={(e) => handleSelectCoupon(coupon.id, e.target.checked)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">{coupon.id}</td>
                    <td className="px-4 py-3 text-sm font-mono">{coupon.code}</td>
                    <td className="px-4 py-3 text-sm font-bold text-red-600">{coupon.discount_percentage}%</td>
                    <td className="px-4 py-3 text-sm">{coupon.used ? '✅' : '❌'}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      <button
                        className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs mr-2"
                        onClick={() => handleEditClick(coupon)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                        onClick={() => handleDeleteCoupon(coupon.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">No coupons available</div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <nav className="flex gap-2">
          <button
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt; Prev
          </button>

          <span className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
            {currentPage}
          </span>

          <button
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(allCoupons.length / couponsPerPage)}
          >
            Next &gt;
          </button>

          <input
            type="number"
            className="px-3 py-2 border border-stone-300 rounded-lg w-16 focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
            min="1"
            max={Math.ceil(allCoupons.length / couponsPerPage)}
            value={currentPage}
            onChange={(e) => {
              let pageNum = Number(e.target.value);
              pageNum = Math.max(1, Math.min(pageNum, Math.ceil(allCoupons.length / couponsPerPage)));
              setCurrentPage(pageNum);
            }}
          />

          <button
            className="px-3 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-sm font-semibold transition"
            onClick={() => {
              const pageNum = currentPage;
              if (pageNum >= 1 && pageNum <= Math.ceil(allCoupons.length / couponsPerPage)) {
                paginate(pageNum);
              }
            }}
          >
            Go
          </button>
        </nav>
      </div>
    </div>
  );
};

export default CouponManager;
