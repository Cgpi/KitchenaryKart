import React, { useState } from "react";
import axios from "axios";

const API_BASE = "https://kitchenarykart.com/kitchen_app";

const BulkProductActions = () => {
  const [loading, setLoading] = useState("");

  // ✅ File validation
  const validateFile = (file) => {
    if (!file) return "No file selected";

    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(file.type)) {
      return "Only CSV or Excel files are allowed";
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return "File size should be less than 5MB";
    }

    return null;
  };

  // ✅ Extract backend error safely
  const getErrorMessage = (err) => {
    if (err.response) {
      return err.response.data?.message || "Server error occurred";
    } else if (err.request) {
      return "Network error. Please check your connection.";
    } else {
      return err.message;
    }
  };

  // ✅ Download with error handling
  const downloadFile = async (url, filename, label) => {
    setLoading(label);
    try {
      const res = await axios.get(API_BASE + url, {
        responseType: "blob",
      });

      if (!res.data || res.data.size === 0) {
        throw new Error("Empty file received");
      }

      const blob = new Blob([res.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (err) {
      console.error("Download error:", err);
      alert(`${label} failed: ${getErrorMessage(err)}`);
    } finally {
      setLoading("");
    }
  };

 const uploadFile = async (url, file, label) => {
  if (!file) {
    alert("Please select a file first");
    return;
  }

  const token = localStorage.getItem("adminToken");

  if (!token) {
    alert("You are not logged in. Please login again.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post(API_BASE + url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-Authorization": `Bearer ${token}`,
      },
    });

    alert(`${label} uploaded successfully`);
  } catch (err) {
    console.error("Upload error:", err);

    if (err.response) {
      const status = err.response.status;

      if (status === 401) {
        alert("Session expired or unauthorized. Please login again.");
      } else if (status === 400) {
        alert(err.response.data?.message || "Invalid file format");
      } else if (status === 500) {
        alert("Server error. Please try again later.");
      } else {
        alert(err.response.data?.message || "Upload failed");
      }
    } else {
      alert("Network error. Check your internet connection.");
    }
  }
};
  // ✅ Upload Block
  const UploadBlock = ({ title, description, sampleApi, importApi, label }) => (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h4 className="font-semibold text-sm mb-1">{title}</h4>
      <p className="text-xs text-gray-500 mb-3">{description}</p>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          disabled={loading === label}
          onClick={() =>
            downloadFile(sampleApi, `${label}_sample.csv`, label)
          }
          className="text-xs px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {loading === label ? "Downloading..." : "Download Sample"}
        </button>

        <input
          type="file"
          className="text-xs"
          disabled={loading === label}
          onChange={(e) =>
            uploadFile(importApi, e.target.files[0], label)
          }
        />
      </div>
    </div>
  );

  const Card = ({ title, children }) => (
    <div className="bg-white rounded-xl shadow p-5 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );

  return (
    <div className="grid md:grid-cols-3 gap-6">

      {/* PRODUCTS */}
      <Card title="📦 Products">

        <button
          disabled={loading === "export-products"}
          onClick={() =>
            downloadFile("/api/products/export", "products.csv", "export-products")
          }
          className="bg-black text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading === "export-products" ? "Exporting..." : "Export Products"}
        </button>

        <button
          disabled={loading === "export-products-variants"}
          onClick={() =>
            downloadFile(
              "/api/products/export-with-variants",
              "products_with_variants.csv",
              "export-products-variants"
            )
          }
          className="bg-black text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading === "export-products-variants"
            ? "Exporting..."
            : "Export Products + Variants"}
        </button>

        <UploadBlock
          title="Import Products Only"
          description="Upload only product data (without variants)."
          sampleApi="/api/products/sample"
          importApi="/api/products/import"
          label="products-import"
        />

      </Card>

      {/* VARIANTS */}
      <Card title="🧩 Variants">

        <button
          disabled={loading === "export-variants"}
          onClick={() =>
            downloadFile("/api/variants/export", "variants.csv", "export-variants")
          }
          className="bg-black text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading === "export-variants" ? "Exporting..." : "Export Variants"}
        </button>

        <UploadBlock
          title="Import Variants Only"
          description="Upload variants using product_code."
          sampleApi="/api/variants/sample"
          importApi="/api/variants/import"
          label="variants-import"
        />

      </Card>

      {/* PRICING */}
      <Card title="💰 Variant Pricing">

        <button
          disabled={loading === "export-prices"}
          onClick={() =>
            downloadFile(
              "/api/variants/price/export",
              "variant_prices.csv",
              "export-prices"
            )
          }
          className="bg-black text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading === "export-prices" ? "Exporting..." : "Export Prices"}
        </button>

        <UploadBlock
          title="Import Variant Prices"
          description="Upload tier pricing (minQty, maxQty, price)."
          sampleApi="/api/variants/price/sample"
          importApi="/api/variants/price/import"
          label="pricing-import"
        />

      </Card>

    </div>
  );
};

export default BulkProductActions;