import React, { useState } from "react";
import axios from "axios";

const API_BASE = "https://kitchenarykart.com/kitchen_app";

const BulkProductActions = () => {
  const [loading, setLoading] = useState("");
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (key) => {
    setOpenSection(openSection === key ? null : key);
  };

  const getErrorMessage = (err) => {
    if (err.response) {
      return err.response.data?.message || "Server error occurred";
    } else if (err.request) {
      return "Network error. Please check your connection.";
    } else {
      return err.message;
    }
  };

  // ✅ Download
  const downloadFile = async (url, filename, label) => {
    setLoading(label);
    try {
      const res = await axios.get(API_BASE + url, {
        responseType: "blob",
      });

      const blob = new Blob([res.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (err) {
      alert(`${label} failed: ${getErrorMessage(err)}`);
    } finally {
      setLoading("");
    }
  };

  // ✅ Upload
  const uploadFile = async (url, file, label, resetInput) => {
    if (!file) return alert("Select file");

    // ✅ CSV validation
    if (!file.name.endsWith(".csv")) {
      return alert("Only CSV files allowed");
    }

    const token = localStorage.getItem("adminToken");
    if (!token) return alert("Login required");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(label);

    try {
      await axios.post(API_BASE + url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-Authorization": `Bearer ${token}`,
        },
      });

      alert(`${label} uploaded successfully`);
      if (resetInput) resetInput(); // ✅ reset file input
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setLoading("");
    }
  };

  // ✅ Loader Spinner
  const Spinner = () => (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  );

  const SmallSpinner = () => (
    <div className="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
  );

  // ✅ Accordion Item
  const AccordionItem = ({ id, title, children }) => (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => toggleSection(id)}
        className="w-full text-left px-4 py-2 font-medium bg-gray-100 hover:bg-gray-200 flex justify-between items-center"
      >
        {title}
        <span>{openSection === id ? "−" : "+"}</span>
      </button>

      {openSection === id && (
        <div className="p-4 bg-white border-t">{children}</div>
      )}
    </div>
  );

  // ✅ Card Wrapper
  const Card = ({ title, children }) => (
    <div className="bg-white rounded-xl shadow p-5 border">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );

  // ✅ Upload Block
  const UploadBlock = ({ sampleApi, importApi, label }) => {
    const handleChange = (e) => {
      const file = e.target.files[0];
      uploadFile(importApi, file, label, () => {
        e.target.value = null; // reset
      });
    };

    return (
      <div className="flex flex-col gap-3">
        {/* Download Sample */}
        <button
          disabled={loading === label}
          onClick={() =>
            downloadFile(sampleApi, `${label}_sample.csv`, label)
          }
          className="bg-gray-700 text-white text-xs px-3 py-2 rounded flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading === label ? (
            <>
              <Spinner />
              Downloading...
            </>
          ) : (
            "Download Sample"
          )}
        </button>

        {/* Upload */}
        <input
          type="file"
          disabled={loading === label}
          onChange={handleChange}
          className="text-xs"
        />

        {/* Loader */}
        {loading === label && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <SmallSpinner />
            Processing file...
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 py-4">

      {/* PRODUCTS
      <Card title="📦 Products">
        <AccordionItem id="p1" title="Export Products">
          <button
            disabled={loading === "export-products"}
            onClick={() =>
              downloadFile("/api/products/export", "products.csv", "export-products")
            }
            className="bg-black text-white px-4 py-2 rounded text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading === "export-products" ? (
              <>
                <Spinner />
                Exporting...
              </>
            ) : (
              "Export Products"
            )}
          </button>
        </AccordionItem>

        <AccordionItem id="p2" title="Export Products + Variants">
          <button
            disabled={loading === "export-products-variants"}
            onClick={() =>
              downloadFile(
                "/api/products/export-with-variants",
                "products_with_variants.csv",
                "export-products-variants"
              )
            }
            className="bg-black text-white px-4 py-2 rounded text-sm"
          >
            {loading === "export-products-variants" ? (
              <>
                <Spinner />
                Exporting...
              </>
            ) : (
              "Export Full Data"
            )}
          </button>
        </AccordionItem>

        <AccordionItem id="p3" title="Import Products">
          <UploadBlock
            sampleApi="/api/products/sample"
            importApi="/api/products/import"
            label="products-import"
          />
        </AccordionItem>
      </Card> */}
{/* ✅ NEW COMBINED BLOCK */}
      <Card title="📂 Combined Data" >
        <AccordionItem id="c1" title="Export Full Catalog">
          <button
            disabled={loading === "export-full-catalog"}
            onClick={() =>
              downloadFile(
                "/api/products/export-with-variants",
                "full_catalog.csv",
                "export-full-catalog"
              )
            }
            className="bg-black text-white px-4 py-2 rounded text-sm"
          >
            {loading === "export-full-catalog" ? (
              <>
                <Spinner />
                Exporting...
              </>
            ) : (
              "Export Full Catalog"
            )}
          </button>
        </AccordionItem>

        <AccordionItem id="c2" title="Import Products + Variants">
          <p className="text-xs text-gray-500 mb-2">
            Upload one CSV containing both product and variant data
          </p>

          <UploadBlock
            sampleApi="/api/products/sample-with-variants"
            importApi="/api/products/import-with-variants"
            label="products-variants-import"
          />
        </AccordionItem>
      </Card>
      {/* VARIANTS */}
      <Card title="🧩 Variants">
        <AccordionItem id="v1" title="Export Variants">
          <button
            disabled={loading === "export-variants"}
            onClick={() =>
              downloadFile("/api/variants/export", "variants.csv", "export-variants")
            }
            className="bg-black text-white px-4 py-2 rounded text-sm"
          >
            {loading === "export-variants" ? <Spinner /> : "Export Variants"}
          </button>
        </AccordionItem>

        <AccordionItem id="v2" title="Import Variants">
          <UploadBlock
            sampleApi="/api/variants/sample"
            importApi="/api/variants/import"
            label="variants-import"
          />
        </AccordionItem>
      </Card>

      {/* PRICING */}
      <Card title="💰 Variant Pricing">
        <AccordionItem id="pr1" title="Export Prices">
          <button
            disabled={loading === "export-prices"}
            onClick={() =>
              downloadFile(
                "/api/variants/price/export",
                "variant_prices.csv",
                "export-prices"
              )
            }
            className="bg-black text-white px-4 py-2 rounded text-sm"
          >
            {loading === "export-prices" ? <Spinner /> : "Export Prices"}
          </button>
        </AccordionItem>

        <AccordionItem id="pr2" title="Import Prices">
          <UploadBlock
            sampleApi="/api/variants/price/sample"
            importApi="/api/variants/price/import"
            label="pricing-import"
          />
        </AccordionItem>
      </Card>

      

    </div>
  );
};

export default BulkProductActions;