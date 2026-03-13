import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useOrders } from "../hooks";
import { orderService } from "../services";

const OrderManagement = () => {
  // Use new hook for orders fetching
  const { orders, loading, error, setOrders, refetch } = useOrders();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState("");
  const [selectedTrackingLink, setSelectedTrackingLink] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Initialize filtered orders when orders change
  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  useEffect(() => {
    console.log("Fetching delivery partners...");

    fetch(`${process.env.REACT_APP_API_BASE_URL}/Deliverypartner/DeliveryPartnerList`)
      .then(res => res.json())
      .then(data => {
        console.log("Delivery partners fetched:", data);
        setDeliveryPartners(data.data);
      })
      .catch(err => console.error("Error fetching delivery partners:", err));
  }, []);


  const filterByDate = () => {
    if (!startDate || !endDate) {
      setFilteredOrders(orders);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // include entire end day

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= start && orderDate <= end;
    });

    setFilteredOrders(filtered);
    setPage(0);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/Orders/admin_update_status/${orderId}`,
        null,
        {
          params: { status },
          headers: { "x-Authorization": `Bearer ${token}` },

        }
      );
      toast.success(`Order ${orderId} updated to ${status}. Email sent.`);
      refetch();
    } catch (err) {
      toast.error("Failed to update order status");
      console.error("Update order error:", err);
    }
  };
  const handlePartnerChange = (e) => {
    const partnerId = e.target.value;
    setSelectedPartner(partnerId);

    const partner = deliveryPartners.find(
      (p) => p.deliverypartners_id === partnerId
    );

    setSelectedTrackingLink(partner ? partner.deliverypartners_description : "");
  };


  const filterOrders = (term) => {
    if (!term) {
      setFilteredOrders(orders);
      return;
    }

    const lowerTerm = term.toLowerCase();

    const filtered = orders.filter((order) => {
      return (
        order.username?.toLowerCase().includes(lowerTerm) ||
        order.contactNumber?.toLowerCase().includes(lowerTerm) ||
        order.status?.toLowerCase().includes(lowerTerm) ||
        order.finalAmount?.toString().includes(lowerTerm)
      );
    });

    setFilteredOrders(filtered);
    setPage(0);
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrder(null);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("invoice").innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  // if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-600 font-semibold">{error}</p>;

  return (
    <div className="flex flex-col h-screen md:px-6 px-3 mt-4 w-full">
      {/* Fullscreen Loader */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
        </div>
      )}

      {/* Static Top Section */}
      <div className="shrink-0">
        <h2 className="text-2xl font-bold font-display text-charcoal mb-4">Order Management</h2>

        {/* Date Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-charcoal">Start Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-charcoal">End Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button 
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
              onClick={filterByDate}
            >
              Filter
            </button>
          </div>
        </div>

        {/* Search Field */}
        <div className="mb-4 md:w-1/3">
          <input
            type="text"
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="Search by username, contact, status, total..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              filterOrders(e.target.value);
            }}
          />
        </div>

        {/* Toast Notification */}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>

      {/* Scrollable Table Section */}
      <div className="flex-1 overflow-y-auto border-t border-stone-200 pt-4">
        <div className="overflow-x-auto rounded-lg border border-stone-200 shadow-sm">
          <table className="w-full text-left bg-white min-w-max">
            <thead className="bg-stone-800 text-white">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold">Order ID</th>
                <th className="px-4 py-3 text-sm font-semibold">User</th>
                <th className="px-4 py-3 text-sm font-semibold">Contact</th>
                <th className="px-4 py-3 text-sm font-semibold border-stone-700 w-[200px]">Address</th>
                <th className="px-4 py-3 text-sm font-semibold">Total</th>
                <th className="px-4 py-3 text-sm font-semibold">Products</th>
                <th className="px-4 py-3 text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-sm font-semibold">Date & Time</th>
                <th className="px-4 py-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3 text-sm">{order.id}</td>
                    <td className="px-4 py-3 text-sm">
                      {order.username}
                      <br />
                      <span className="text-stone-500 text-xs">{order.user?.email}</span>
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">{order.contactNumber}</td>
                    <td className="px-4 py-3 text-sm truncate max-w-[200px]" title={`${order.address}, ${order.pincode}, ${order.state}, ${order.country}`}>
                      {order.address}, {order.pincode}, {order.state}, {order.country}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold">₹{order.finalAmount}</td>
                    <td className="px-4 py-3 text-sm">
                      <button 
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                        onClick={() => handleOpenModal(order)}
                      >
                        View More
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === "Delivered" ? "bg-green-100 text-green-700" :
                        order.status === "Shipped" ? "bg-blue-100 text-blue-700" : "bg-stone-100 text-stone-700"
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-500 whitespace-nowrap">{new Date(order.orderDate).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">
                      <select
                        value={order.status}
                        onChange={async (e) => {
                          const status = e.target.value;

                          if (status === "Shipped") {
                            setSelectedOrderId(order.id);
                            setShowDispatchModal(true);
                            return;
                          }

                          if (status === "Delivered") {
                            try {
                              // 1️⃣ Update order status
                              await updateOrderStatus(order.id, "Delivered");

                              // 2️⃣ Create feedback link
                              const feedbackLink = `https://www.kitchenarykart.com/profile/myorder?orderId=${order.id}`;

                              // 3️⃣ Send feedback email
                              await axios.post(
                                `${process.env.REACT_APP_API_BASE_URL}/OrderMail/send_mail`,
                                new URLSearchParams({
                                  order_id: order.id,          // REQUIRED
                                  feedback_link: feedbackLink,
                                  mail_type: 3,
                                })
                              );

                              toast.success("Order marked as Delivered & feedback email sent");
                            } catch (error) {
                              console.error("Delivered email error:", error);
                              toast.error("Order updated but email failed");
                            }

                            return;
                          }

                          // Other statuses
                          updateOrderStatus(order.id, status);
                        }}
                        className="px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                      >
                        <option value="Placed">Placed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Refunded">Refunded</option>
                      </select>

                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 p-2 bg-white border-t border-stone-200">
            <div className="mb-3 sm:mb-0 flex items-center">
              <label className="mr-2 text-sm text-stone-600 font-semibold">Rows per page:</label>
              <select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                className="px-2 py-1 border border-stone-300 rounded text-sm outline-none focus:border-brand"
              >
                {[1, 10, 25, 50].map((rows) => (
                  <option key={rows} value={rows}>
                    {rows}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-stone-600">
                Page {page + 1} of {Math.ceil(filteredOrders.length / rowsPerPage)}
              </span>
              <button
                disabled={page >= Math.ceil(filteredOrders.length / rowsPerPage) - 1}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Invoice */}
      {openModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4" onClick={handleCloseModal}>
          <div 
            className="bg-white rounded-lg shadow-lg w-4/5 max-w-4xl max-h-screen overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedOrder && (
              <div id="invoice">
                <h2 className="text-lg font-bold mb-4">Order Invoice</h2>

                <p className="mb-2"><strong>Order ID:</strong> {selectedOrder.id}</p>
                <div
                  className="border border-gray-300 p-3 mb-3 rounded"
                >
                  <p className="mb-1"><strong>Customer Name:</strong> {selectedOrder.username}</p>
                  <p className="mb-1"><strong>Email:</strong> {selectedOrder.user?.email}</p>
                  <p><strong>Contact:</strong> {selectedOrder.contactNumber}</p>
                </div>
                {(selectedOrder?.firm_name || selectedOrder?.gst_no) && (
                  <div
                    className="border border-gray-300 p-3 mb-3 rounded inline-block"
                  >
                    {selectedOrder?.firm_name && (
                      <p className="mb-1">
                        <strong>Firm Name:</strong> {selectedOrder.firm_name}
                      </p>
                    )}

                    {selectedOrder?.gst_no && (
                      <p>
                        <strong>GST No:</strong> {selectedOrder.gst_no}
                      </p>
                    )}
                  </div>
                )}

                <p className="mb-2"><strong>Delivery Charges:</strong> {selectedOrder.shipping_charges}</p>

                <p className="mb-2"><strong>Total:</strong> ₹{selectedOrder.finalAmount}</p>
                <p className="mb-3"><strong>Ordered On:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>

                {selectedOrder.items.length > 0 && (
                  <p className="mb-4">
                    <strong>Shipping Address:</strong>
                    {selectedOrder.address}, {selectedOrder.pincode}, {selectedOrder.state}, {selectedOrder.country}
                  </p>

                )}


                <div className="overflow-x-auto border border-stone-200 rounded mt-4">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-stone-100 text-stone-700">
                      <tr>
                        <th className="px-3 py-2 border-b border-stone-200">Product</th>

                        {selectedOrder.items.some(item => item.color || item.otherDimensions) && (
                          <th className="px-3 py-2 border-b border-stone-200">Variant</th>
                        )}
                        {selectedOrder.items.some(item => item.productWeight) && <th className="px-3 py-2 border-b border-stone-200">Weight</th>}

                        {/* Only show if any item has material */}
                        {selectedOrder.items.some(item => item.material) && <th className="px-3 py-2 border-b border-stone-200">Material</th>}
                        <th className="px-3 py-2 border-b border-stone-200 w-24">Quantity</th>
                        <th className="px-3 py-2 border-b border-stone-200 w-24">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 leading-tight">{item.productName}</td>


                          {selectedOrder.items.some(i => i.color || i.otherDimensions) && (
                            <td className="px-3 py-2">{item.color || item.otherDimensions || "-"}</td>
                          )}
                          {/* Only show if any item has weight */}

                          {selectedOrder.items.some(i => i.productWeight) && (
                            <td className="px-3 py-2">{item.productWeight || "-"}</td>
                          )}

                          {selectedOrder.items.some(i => i.material) && (
                            <td className="px-3 py-2">{item.material || "-"}</td>
                          )}

                          <td className="px-3 py-2">{item.quantity}</td>
                          <td className="px-3 py-2 font-semibold text-red-600">₹{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <button onClick={handlePrint} className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-semibold transition">
                Print Invoice
              </button>
              <button onClick={handleCloseModal} className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg font-semibold transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4" onClick={() => setShowDispatchModal(false)}>
          <div 
            className="bg-white rounded-lg shadow-lg w-96 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">
              Dispatch Order #{selectedOrderId}
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Delivery Partner:</label>
              <select
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                value={selectedPartner}
                onChange={handlePartnerChange}
              >
                <option value="">Select a partner</option>
                {deliveryPartners.map((partner, idx) => (
                  <option
                    key={idx}
                    value={partner.deliverypartners_id}
                  >
                    {partner.deliverypartners_name}
                  </option>
                ))}
              </select>
            </div>


            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Tracking Link (Auto-Filled):</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
                value={selectedTrackingLink}
                readOnly
              />
            </div>


            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Tracking ID:</label>
              <input
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                placeholder="Enter tracking number..."
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
            </div>

            <button
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
              onClick={async () => {
                try {
                  console.log("Selected Order ID:", selectedOrderId);
                  console.log("Selected Partner:", selectedPartner);
                  console.log("Tracking ID:", trackingId);

                  // Construct full tracking link for debugging
                  console.log("Selected Tracking Link:", selectedTrackingLink);

                  // 1️⃣ Update order status
                  await updateOrderStatus(selectedOrderId, "Shipped");

                  // 2️⃣ Send email
                  await axios.post(
                    `${process.env.REACT_APP_API_BASE_URL}/OrderMail/send_mail`,
                    new URLSearchParams({
                      order_id: selectedOrderId,
                      mail_type: 2,
                      transporter: selectedPartner,
                      tracking_link: selectedTrackingLink,
                      tracking_id: trackingId,
                    }),
                    {
                      headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    }
                  );

                  toast.success("Dispatch Details Saved & Email Sent");
                  setShowDispatchModal(false);
                } catch (err) {
                  console.error("Error in dispatch/email:", err);
                  toast.error("Error saving dispatch details or sending email");
                }
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div >
  );

};

export default OrderManagement;
