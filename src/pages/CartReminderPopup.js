import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { X } from "lucide-react";

const CartReminderPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) return;

    setUserId(storedUser.id);

    // Prevent popup from showing again during the same session
    if (sessionStorage.getItem("cartPopupShown")) return;

    const fetchCart = async () => {
      try {
        const res = await api.get(`/Cart/index/${storedUser.id}`);
        if (res.data.items.length > 0) {
          setShowPopup(true);
          sessionStorage.setItem("cartPopupShown", "true"); // Set flag to avoid repeat
        }
      } catch (err) {
        // Silent fail
      }
    };

    fetchCart();
  }, []);

  const handleGoToCart = () => {
    setShowPopup(false);
    navigate(`/cart/${userId}`);
  };

  if (!showPopup) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setShowPopup(false)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 40,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 50,
          width: "90%",
          maxWidth: "400px",
        }}
      >
        <div
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          style={{
            border: "2px solid #ffc107",
            boxShadow: "0 10px 40px rgba(255, 193, 7, 0.3)",
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowPopup(false)}
            className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#666",
              zIndex: 51,
            }}
          >
            <X size={20} />
          </button>

          {/* Content */}
          <div className="p-6 text-center">
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🛒</div>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px", color: "#333" }}>
              You left items in your cart!
            </h3>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "24px" }}>
              Complete your purchase before they go out of stock.
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={() => setShowPopup(false)}
                style={{
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontWeight: "500",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  backgroundColor: "#f5f5f5",
                  color: "#333",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#efefef";
                  e.target.style.borderColor = "#ccc";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#f5f5f5";
                  e.target.style.borderColor = "#ddd";
                }}
              >
                Close
              </button>
              <button
                onClick={handleGoToCart}
                style={{
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  border: "none",
                  borderRadius: "6px",
                  backgroundColor: "#ffc107",
                  color: "#000",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#ffb300";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 4px 12px rgba(255, 193, 7, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#ffc107";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                Go to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartReminderPopup;


