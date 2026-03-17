import React, { useEffect, useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import logo from "../images/piclogo.png";

function CartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // ── Get user ─────────────────────────
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // ── Fetch cart when opened ───────────
  useEffect(() => {
    if (isOpen && user?.id) {
      fetchCart(user.id);
    }
  }, [isOpen, user]);

  const fetchCart = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/Cart/index/${id}`);
      setCartItems(res.data.items || []);
    } catch {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // ── Update qty ───────────────────────
  const updateQty = async (item, delta) => {
    let newQty = item.quantity + delta;
    if (newQty <= 0) return removeItem(item.id);

    await api.put(`/Cart/cart_update/${user.id}`, null, {
      params: {
        productId: item.productVariant.productId,
        productVariantId: item.productVariant.id,
        quantity: newQty,
      },
    });

    fetchCart(user.id);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ── Remove item ──────────────────────
  const removeItem = async (itemId) => {
    await api.delete(`/Cart/clear/${user.id}`, {
      params: { itemId },
    });

    fetchCart(user.id);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const total = cartItems.reduce((sum, i) => sum + Number(i.totalPrice), 0);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-[100] transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[101] shadow-xl transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <ShoppingCart size={18} /> Cart
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <p className="text-center text-sm text-gray-500">Loading...</p>
          ) : cartItems.length === 0 ? (
            <div className="text-center mt-10">
              <ShoppingCart className="mx-auto mb-3 text-gray-300" size={40} />
              <p className="text-sm text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 border rounded-xl p-3">
                <img
                  src={item.productVariant.images?.[0] || logo}
                  className="w-16 h-16 object-contain"
                  alt=""
                />

                <div className="flex-1">
                  <p className="text-sm font-semibold line-clamp-2">
                    {item.productVariant.productName}
                  </p>

                  <p className="text-xs text-gray-500">₹{item.totalPrice}</p>

                  {/* Qty */}
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQty(item, -1)}>
                      <Minus size={14} />
                    </button>

                    <span className="text-sm">{item.quantity}</span>

                    <button onClick={() => updateQty(item, 1)}>
                      <Plus size={14} />
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t">
            <div className="flex justify-between mb-3 font-semibold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => {
                onClose();
                navigate(`/checkout/${user.id}`);
              }}
              className="w-full bg-brand text-white py-3 rounded-xl"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;
