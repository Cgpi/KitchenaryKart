import React, { useEffect, useState } from "react";
import { Snackbar, Alert, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

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
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        sx={{
          width: "100%",
          backgroundColor: "#fdecea",
          color: "#7a1c1c",
          "& .MuiAlert-action": { color: "#7a1c1c" },
          "& .MuiAlert-icon": { marginTop: "18px" },
        }}
      >
        <Box
          onClick={handleProductClick}
          sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
        >
          {productImage && (
            <img
              src={productImage}
              alt={productName}
              style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
            />
          )}
          <Typography variant="body2" sx={{ fontWeight: 500, maxWidth: 250 }}>
            New product added: {productName}
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default ProductNotification;
