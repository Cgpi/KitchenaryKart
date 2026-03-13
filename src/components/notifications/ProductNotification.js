import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { X } from "lucide-react";

const ProductNotification = () => {
    const [open, setOpen] = useState(false);
    const [productId, setProductId] = useState(null);
    const [productName, setProductName] = useState("");
    const [productImage, setProductImage] = useState(null);

    const navigate = useNavigate();

    const getSeenProducts = () =>
        JSON.parse(localStorage.getItem("seenProducts") || "[]");

    const getSeenArrivals = () =>
        JSON.parse(localStorage.getItem("seenArrivals") || "{}");

    const markProductSeen = (id) => {
        const seen = getSeenProducts();
        if (!seen.includes(id)) {
            seen.push(id);
            localStorage.setItem("seenProducts", JSON.stringify(seen));
        }
    };

    const markArrivalSeen = (id, version) => {
        const seen = getSeenArrivals();
        seen[id] = version;
        localStorage.setItem("seenArrivals", JSON.stringify(seen));
    };

    const checkNewProduct = async () => {
        try {
            const res = await api.get("/product/index");

            if (!Array.isArray(res.data) || res.data.length === 0) return;

            const latest = res.data[res.data.length - 1];
            const image = latest?.variants?.[0]?.images?.[0] || null;

            const hasStock =
                Array.isArray(latest.variants) &&
                latest.variants.some((v) => Number(v.stock) > 0);

            if (!hasStock) return;

            const seenProducts = getSeenProducts();

            if (!seenProducts.includes(latest.id)) {
                setProductId(latest.id);
                setProductName(latest.name);
                setProductImage(image);
                setOpen(true);
                markProductSeen(latest.id);
                return;
            }

            if (latest.is_new_arrival === "1") {
                const arrivalVersion =
                    latest.updated_at || latest.created_at || Date.now();
                const seenArrivals = getSeenArrivals();

                if (seenArrivals[latest.id] !== arrivalVersion) {
                    setProductId(latest.id);
                    setProductName(latest.name);
                    setProductImage(image);
                    setOpen(true);
                    markArrivalSeen(latest.id, arrivalVersion);
                }
            }
        } catch {
            // silent fail — network issues should not surface to user
        }
    };

    useEffect(() => {
        checkNewProduct();
        const interval = setInterval(checkNewProduct, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleProductClick = () => {
        if (!productId || !productName) return;
        navigate(`/product/${productId}?name=${encodeURIComponent(productName)}`);
        setOpen(false);
    };

    const handleClose = (e, reason) => {
        e?.stopPropagation();
        if (reason === "clickaway") return;
        setOpen(false);
    };

    return (
        <>
            {open && (
                <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 max-w-sm animate-in fade-in slide-in-from-top duration-300">
                    <div className="flex items-start gap-3">
                        {productImage && (
                            <img
                                src={productImage}
                                alt={productName}
                                className="w-12 h-12 object-cover rounded flex-shrink-0"
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <p
                                onClick={handleProductClick}
                                className="text-sm font-medium text-red-900 cursor-pointer hover:underline break-words"
                            >
                                New product added: {productName}
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="flex-shrink-0 text-red-600 hover:text-red-800 p-1"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductNotification;
