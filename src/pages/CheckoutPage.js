import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { getStoredUser } from "../utils/storage";
import { FaTag, FaChevronRight, FaEdit, FaCheck } from "react-icons/fa";
import { Country, State } from "country-state-city";

const Checkout = () => {
  const location = useLocation();
  const { cartTotal = 0 } = location.state || {};
  const navigate = useNavigate();

  const [billingAddress, setBillingAddress] = useState({
    email: "",
    username: "",
    contactNumber: "",
    address: "",
    state: "",
    country: "",
    pincode: "",
  });
const [gst, setGst] = useState("");
const [firmName, setFirmName] = useState("");

  const [userId, setUserId] = useState(null);
  const [shippingCharges, setShippingCharges] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
   const [showInput, setShowInput] = useState(false);

  const rawTotal =
  Number(cartTotal || 0) +
  Number(shippingCharges || 0) -
  Number(discountAmount || 0);

const totalAmount = Math.round(rawTotal);


  // Load user
 useEffect(() => {
  const storedUser = getStoredUser();
  if (storedUser && storedUser.id) {
    setUserId(storedUser.id);
    setBillingAddress((prev) => ({
      ...prev,
      ...storedUser,
      contactNumber: storedUser.contactNumber || storedUser.contact_number || ""
    }));
  }
}, []);

 

  // Shipping calculation
  useEffect(() => {
  const calculatedShipping = Math.max(cartTotal * 0.05, 75);
  const roundedShipping = Math.round(calculatedShipping);
  setShippingCharges(roundedShipping);
}, [cartTotal]);


  // ✅ Dynamically load Razorpay script once
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => {
       
        setRazorpayLoaded(false);
      };
      document.body.appendChild(script);
    } else {
      setRazorpayLoaded(true);
    }
  }, []);

  const handleInputChange = (e) => {
    if (!isEditing) return;
    setBillingAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveBillingAddress = async () => {
    try {
      const response = await api.put(`/user/update`, billingAddress);
      if (response.status === 200) {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...getStoredUser(), ...billingAddress })
        );
        alert("Billing address updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
 
      alert("Failed to update billing address.");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode || !userId) {
      setCouponError("Missing coupon code or user.");
      return;
    }

    try {
      const response = await api.post(`/Orders/apply_coupon`, {
        couponCode,
        userId,
        cartTotal,
      });

      if (response.data && response.data.discountAmount) {
       setDiscountAmount(Math.round(response.data.discountAmount));

        setCouponError("");
      } else {
        setCouponError("Invalid or expired coupon.");
        setDiscountAmount(0);
      }
    } catch (error) {

      setCouponError(error?.response?.data?.message || "Invalid coupon code.");
      setDiscountAmount(0);
    }
  };

  const handleConfirmOrder = async () => {
    if (!userId) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    if (!razorpayLoaded || !window.Razorpay) {
      alert("Razorpay SDK not loaded. Please refresh and try again.");
      return;
    }

    try {
     const formData = new URLSearchParams();
formData.append("userId", userId);
formData.append("couponCode", couponCode);
if (gst.trim()) formData.append("gst", gst);          // ✅ Add this line
if (firmName.trim()) formData.append("firm_name", firmName);  // ✅ Add this line


      const { data: razorpayOrder } = await api.post(`/Orders/razorpay_order`, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const options = {
        key: "rzp_live_RTJyRfs3LWGQWo",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Kitchenary Kart",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (paymentResponse) {
          setIsVerifying(true);
          try {
            const verificationResponse = await api.post(`/Orders/confirm_payment`, paymentResponse);
            if (verificationResponse.status === 200) {

  // ⭐ Send order email to customer automatically ⭐
  try {
    await api.post(
      `/OrderMail/send_mail`,
      new URLSearchParams({ order_id: razorpayOrder.id, mail_type: 1 }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
  } catch (emailErr) {
   
  }

              window.dispatchEvent(new Event("cartUpdated"));
              navigate("/order-success", {
                state: { orderId: razorpayOrder.id },
              });
            } else {
              alert("Payment Verification Failed!");
            }
          } catch (error) {
            
            alert("Payment verification error. Please contact support.");
          } finally {
            setIsVerifying(false);
          }
        },
        prefill: {
          name: billingAddress.username,
          email: billingAddress.email,
          contact: billingAddress.contactNumber,
        },
        theme: { color: "#ff9900" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
    
      alert("Failed to initiate payment.");
    }
  };

  if (isVerifying) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#af2031] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Verifying your payment, please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-[Eczar,serif] bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Billing & Business Details */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          
          {/* Billing Details Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Billing Details</h2>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-sm font-medium text-[#e8900bff] hover:text-[#fb8c00] transition-colors"
                >
                  <FaEdit /> Edit Details
                </button>
              )}
            </div>
            
            <p className="text-gray-500 text-sm mb-6">
              {isEditing
                ? "You can now edit your billing details. Click 'Save Details' once done."
                : "Please review your billing details before ordering. If you need changes, click 'Edit Details'."}
            </p>

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  {isEditing ? ( 
                    <input
                      type="text"
                      name="username"
                      value={billingAddress.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#af2031] focus:border-transparent outline-none transition-all"
                    />
                  ) : (
                    <div className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-gray-800 font-medium">
                      {billingAddress.username || "-"}
                    </div>
                  )}
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="contactNumber"
                      value={billingAddress.contactNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#af2031] focus:border-transparent outline-none transition-all"
                    />
                  ) : (
                    <div className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-gray-800 font-medium">
                      {billingAddress.contactNumber || "-"}
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={billingAddress.address}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#af2031] focus:border-transparent outline-none transition-all"
                  />
                ) : (
                  <div className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-gray-800 font-medium whitespace-pre-wrap">
                    {billingAddress.address || "-"}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  {isEditing ? (
                    <select
                      value={billingAddress.country}
                      onChange={(e) =>
                        setBillingAddress((prev) => ({
                          ...prev,
                          country: e.target.value,
                          state: "",
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#af2031] focus:border-transparent outline-none transition-all bg-white"
                    >
                      <option value="">Select Country</option>
                      {Country.getAllCountries().map((c) => (
                        <option key={c.isoCode} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-gray-800 font-medium">
                      {billingAddress.country || "-"}
                    </div>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  {isEditing ? (
                    <select
                      value={billingAddress.state}
                      onChange={(e) =>
                        setBillingAddress((prev) => ({ ...prev, state: e.target.value }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#af2031] focus:border-transparent outline-none transition-all bg-white"
                      disabled={!billingAddress.country}
                    >
                      <option value="">Select State</option>
                      {billingAddress.country &&
                        State.getStatesOfCountry(
                          Country.getAllCountries().find((c) => c.name === billingAddress.country)?.isoCode
                        ).map((s) => (
                          <option key={s.isoCode} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <div className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-gray-800 font-medium">
                      {billingAddress.state || "-"}
                    </div>
                  )}
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="pincode"
                      value={billingAddress.pincode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#af2031] focus:border-transparent outline-none transition-all"
                    />
                  ) : (
                    <div className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-gray-800 font-medium">
                      {billingAddress.pincode || "-"}
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      const { username, contactNumber, address, state, country, pincode } = billingAddress;
                      if (!username || !contactNumber || !address || !state || !country || !pincode) {
                        alert("Please fill all fields before saving!");
                        return;
                      }
                      handleSaveBillingAddress();
                    }}
                    className="flex-1 bg-[#337c4eff] hover:bg-[#28613d] text-white py-2.5 px-6 rounded-lg font-semibold transition-colors flex justify-center items-center gap-2"
                  >
                    <FaCheck /> Save Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 px-6 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Business Details Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mt-6 lg:mt-0">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Business Details (Optional)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                <input
                  type="text"
                  placeholder="e.g. 29ABCDE1234F1Z5"
                  value={gst}
                  onChange={(e) => setGst(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#af2031] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Firm Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kitchenary Co."
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#af2031] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary (Sticky) */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 lg:sticky lg:top-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Payment Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-gray-600">
                <span>Cart Total</span>
                <span className="font-medium text-gray-900">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Delivery Charges</span>
                <span className="font-medium text-gray-900">₹{shippingCharges}</span>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="mb-6 pt-6 border-t border-gray-100">
              {!showInput ? (
                <button
                  type="button"
                  onClick={() => setShowInput(true)}
                  className="w-full flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-xl border border-dashed border-gray-300 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                      <FaTag />
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Apply coupon code</span>
                  </div>
                  <FaChevronRight className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                </button>
              ) : (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCouponCode(value);
                        if (value.trim() === "") {
                          setDiscountAmount(0);
                          setCouponError("");
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim()}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Apply
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowInput(false);
                          setCouponCode("");
                          setDiscountAmount(0);
                          setCouponError("");
                        }}
                        className="flex-1 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  
                  {couponError && <p className="text-red-500 text-sm mt-2">{couponError}</p>}
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center mt-3 text-green-600 bg-green-50 p-2 rounded border border-green-100">
                      <span className="text-sm font-medium">Discount Applied ({Math.round((discountAmount / cartTotal) * 100)}%)</span>
                      <span className="font-bold">-₹{discountAmount}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">TOTAL AMOUNT</span>
                <span className="text-2xl font-black text-gray-900">₹{totalAmount}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleConfirmOrder}
              disabled={!razorpayLoaded}
              className="w-full bg-[#af2031] hover:bg-[#8e1927] disabled:bg-gray-400 text-white py-3.5 flex justify-center items-center rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {razorpayLoaded ? "Complete Purchase" : "Loading Payment..."}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
