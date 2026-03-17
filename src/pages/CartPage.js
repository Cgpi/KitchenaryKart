import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowLeft,
  Package,
} from "lucide-react";
import api from "../utils/api";
import logo from "../images/piclogo.png";

// ── Skeleton ───────────────────────────────────────────────────────────
const CartItemSkeleton = () => (
  <div className="bg-white rounded-2xl p-4 shadow-card">
    <div className="flex gap-4">
      <div className="skeleton w-24 h-24 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2.5">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-8 w-32 rounded-lg mt-3" />
      </div>
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────
function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUser] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingQty, setEditingQty] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchCart(storedUser.id);
    } else {
      navigate("/login");
    }
  }, [navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCart = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/Cart/index/${id}`);
      const filteredItems = response.data.items.filter(
        (item) => Number(item.productVariant.stock) > 0,
      );
      setCartItems(filteredItems);
      calculateTotal(filteredItems);
      window.dispatchEvent(new Event("cartUpdated"));
      for (const item of response.data.items) {
        if (Number(item.productVariant.stock) === 0) {
          await removeItem(item.id);
        }
      }
    } catch (error) {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce(
      (acc, item) => acc + parseFloat(item.totalPrice),
      0,
    );
    setTotalPrice(total.toFixed(2));
  };

  const handleProductClick = (productId, productName) => {
    navigate(`/product/${productId}?name=${encodeURIComponent(productName)}`);
  };

  const commitQuantityChange = async (itemId, value) => {
    const item = cartItems.find((i) => i.id === itemId);
    if (!item) return;
    let qty = Number(value);
    if (!value || isNaN(qty)) {
      setEditingQty((prev) => {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      });
      return;
    }
    if (qty <= 0) {
      await removeItem(itemId);
      return;
    }
    const stock = Number(item.productVariant.stock);
    if (qty > stock) {
      qty = stock;
      setModalMessage(
        stock === 1 ? "Only 1 item left." : `Only ${stock} items left.`,
      );
      setShowModal(true);
    }
    if (qty === item.quantity) {
      setEditingQty((prev) => {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      });
      return;
    }
    try {
      setLoading(true);
      await api.put(`/Cart/cart_update/${user.id}`, null, {
        params: {
          productId: item.productVariant.productId,
          productVariantId: item.productVariant.id,
          quantity: qty,
        },
      });
      fetchCart(user.id);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      // silent fail
    } finally {
      setLoading(false);
      setEditingQty((prev) => {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      });
    }
  };

  const removeItem = async (itemId) => {
    try {
      setLoading(true);
      await api.delete(`/Cart/clear/${user.id}`, { params: { itemId } });
      fetchCart(user.id);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      setModalMessage("Please log in to continue.");
      setShowModal(true);
      return;
    }
    const stockIssues = [];
    for (const item of cartItems) {
      const availableStock = Number(item.productVariant.stock);
      let variantInfo = "";
      if (item.productVariant.otherDimensions)
        variantInfo += `Variant: ${item.productVariant.otherDimensions}`;
      if (item.productVariant.color) {
        if (variantInfo) variantInfo += " | ";
        variantInfo += `Color: ${item.productVariant.color}`;
      }
      if (variantInfo) variantInfo = ` (${variantInfo})`;
      if (availableStock === 0) {
        await removeItem(item.id);
        window.dispatchEvent(new Event("cartUpdated"));
        stockIssues.push(
          `${item.productVariant.productName}${variantInfo} is out of stock and has been removed.`,
        );
        continue;
      }
      if (item.quantity > availableStock) {
        stockIssues.push(
          `${item.productVariant.productName}${variantInfo}: only ${availableStock} ${availableStock === 1 ? "item" : "items"} left.`,
        );
      }
    }
    if (stockIssues.length > 0) {
      setModalMessage(stockIssues.join("\n"));
      setShowModal(true);
      return;
    }
    navigate(`/checkout/${user.id}`, {
      state: { cartItems, cartTotal: totalPrice, userRegion: user.state },
    });
  };

  const subtotalExclGST = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.productVariant.priceExcludingTax) * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen  bg-white">
      {/* ── Loading overlay ─────────────────────────────── */}
      {loading && (
        <div className="fixed inset-0 z-[500] bg-black/40 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-brand/30 border-t-brand rounded-full animate-spin" />
        </div>
      )}

      <div className="container-main py-8">
        {/* ── Page header ────────────────────────────────── */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-stone-200 bg-white text-stone-500 hover:border-brand hover:text-brand transition-colors shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-charcoal flex items-center gap-2">
              <ShoppingCart size={24} className="text-brand" />
              Shopping Cart
            </h1>
            <p className="text-sm text-stone-500 mt-0.5">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>
        </div>

        {/* ── Main layout ─────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* LEFT — Cart Items */}
          <div className="flex-1 min-w-0 space-y-3">
            {loading && cartItems.length === 0 ? (
              <>
                <CartItemSkeleton />
                <CartItemSkeleton />
                <CartItemSkeleton />
              </>
            ) : cartItems.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-card p-12 text-center">
                <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Package size={36} className="text-stone-300" />
                </div>
                <h3 className="font-display font-bold text-xl text-charcoal mb-2">
                  Your cart is empty
                </h3>
                <p className="text-stone-500 font-body text-sm mb-6">
                  Looks like you haven't added anything yet.
                </p>
                <button onClick={() => navigate("/")} className="btn-primary">
                  Continue Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-stone-200 pb-8 mb-8"
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
                    {/* PRODUCT IMAGE */}
                    <div
                      className="w-full sm:w-40 md:w-48 lg:w-56 aspect-square bg-stone-100 cursor-pointer flex-shrink-0"
                      onClick={() =>
                        handleProductClick(
                          item.productVariant.productId,
                          item.productVariant.productName,
                        )
                      }
                    >
                      <img
                        src={
                          item.productVariant.images.length > 0
                            ? item.productVariant.images[0]
                            : logo
                        }
                        alt=""
                        className="w-full h-full object-contain bg-white"
                      />
                    </div>

                    {/* PRODUCT DETAILS */}
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-medium text-charcoal mb-1">
                        {item.productVariant.productName}
                      </h3>

                      <p className="text-xs sm:text-sm text-stone-500 mb-2 sm:mb-3">
                        #{item.productVariant.id}
                      </p>

                      <p className="text-sm sm:text-base mb-4 sm:mb-5">
                        ₹
                        {Number(item.productVariant.priceExcludingTax).toFixed(
                          2,
                        )}
                      </p>

                      {/* QUANTITY */}
                      <div className="mb-3 sm:mb-4">
                        <input
                          type="number"
                          min="1"
                          value={editingQty[item.id] ?? item.quantity}
                          onChange={(e) =>
                            setEditingQty({
                              ...editingQty,
                              [item.id]: e.target.value,
                            })
                          }
                          onBlur={() =>
                            commitQuantityChange(item.id, editingQty[item.id])
                          }
                          className="w-12 sm:w-14 h-9 sm:h-10 border border-stone-300 text-center"
                        />

                        <div>
                          <button
                            onClick={() =>
                              commitQuantityChange(item.id, editingQty[item.id])
                            }
                            className="text-xs sm:text-sm underline mt-1 sm:mt-2"
                          >
                            Update
                          </button>
                        </div>
                      </div>

                      {/* ACTION LINKS */}
                      <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="underline text-stone-700"
                        >
                          Remove
                        </button>

                        <button className="underline text-stone-700">
                          Save for later
                        </button>
                      </div>
                    </div>

                    {/* ITEM TOTAL */}
                    <div className="sm:w-28 lg:w-32 text-left sm:text-right mt-3 sm:mt-0">
                      <p className="text-xs sm:text-sm text-stone-500 mb-1">
                        Item Total
                      </p>

                      <p className="text-base sm:text-lg font-medium">
                        ₹{Number(item.totalPrice).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT — Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:w-80 xl:w-96 flex-shrink-0 lg:sticky lg:top-28">
              <div className="bg-white rounded-2xl shadow-card p-5 mb-4">
                <h2 className="font-display font-bold text-xl text-charcoal mb-5">
                  Order Summary
                </h2>

                {/* Line items */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-500 font-body">
                      Subtotal ({cartItems.length} items)
                    </span>
                    <span className="font-semibold text-charcoal">
                      ₹{subtotalExclGST.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-500 font-body">
                      GST & Taxes
                    </span>
                    <span className="font-semibold text-charcoal">
                      ₹{(Number(totalPrice) - subtotalExclGST).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-500 font-body">Shipping</span>
                    <span className="text-green-600 font-semibold">
                      Calculated at checkout
                    </span>
                  </div>
                </div>

                <div className="h-px bg-stone-100 mb-4" />

                <div className="flex items-center justify-between mb-5">
                  <span className="font-bold text-charcoal">
                    Total (incl. GST)
                  </span>
                  <span className="font-display font-bold text-xl text-brand">
                    ₹{totalPrice}
                  </span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={cartItems.length === 0}
                  className="btn-primary w-full py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="btn-ghost w-full mt-2 text-sm"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Trust badges */}
              <div className="bg-white rounded-2xl shadow-card p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Why shop with us
                </p>
                <div className="space-y-3">
                  {[
                    {
                      icon: ShieldCheck,
                      label: "Secure Checkout",
                      sub: "256-bit SSL encryption",
                    },
                    {
                      icon: Truck,
                      label: "Pan India Delivery",
                      sub: "Ships to all major cities",
                    },
                    {
                      icon: RotateCcw,
                      label: "Easy Returns",
                      sub: "Hassle-free return policy",
                    },
                  ].map(({ icon: Icon, label, sub }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-brand/8 flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-brand" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-charcoal">
                          {label}
                        </p>
                        <p className="text-[11px] text-stone-400">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Stock warning modal ──────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-[400] bg-black/40 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-red-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <ShoppingCart size={18} className="text-brand" />
              </div>
              <h3 className="font-semibold text-charcoal">Stock Alert</h3>
            </div>
            <div className="space-y-2 mb-5">
              {modalMessage.split("\n").map((msg, idx) => (
                <p
                  key={idx}
                  className="text-sm text-stone-600 font-body leading-relaxed"
                >
                  {msg}
                </p>
              ))}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="btn-primary w-full"
            >
              OK, Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
