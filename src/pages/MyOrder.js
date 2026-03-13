import React, { useEffect, useState } from "react";
import api from "../utils/api";

import { useNavigate, useLocation } from "react-router-dom";
import logo from "../images/piclogo.png";

import ProfilePage from "./ProfilePage";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Loader2 } from "lucide-react";

// ✅ Defensive assignment (works across all builds)
if (pdfFonts && pdfFonts.pdfMake) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else if (pdfFonts && pdfFonts.vfs) {
  pdfMake.vfs = pdfFonts.vfs;
}

// ✅ Define fonts manually
pdfMake.fonts = {
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Medium.ttf",
    italics: "Roboto-Italic.ttf",
    bolditalics: "Roboto-MediumItalic.ttf",
  },
};
const toDataURL = (url) =>
  fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        })
    );

export default function MyOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;
  const navigate = useNavigate();
  const [logoBase64, setLogoBase64] = useState("");
  const location = useLocation();
  const [newReview, setNewReview] = useState({ rating: 1, comment: '' });
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeReviewItemId, setActiveReviewItemId] = useState(null);

  const gstStateCodes = [
    { state: "Andaman and Nicobar Islands", code: "35" },
    { state: "Andhra Pradesh", code: "37" },
    { state: "Arunachal Pradesh", code: "12" },
    { state: "Assam", code: "18" },
    { state: "Bihar", code: "10" },
    { state: "Chandigarh", code: "04" },
    { state: "Chhattisgarh", code: "22" },
    { state: "Dadra and Nagar Haveli and Daman and Diu", code: "26" },
    { state: "Delhi", code: "07" },
    { state: "Goa", code: "30" },
    { state: "Gujarat", code: "24" },
    { state: "Haryana", code: "06" },
    { state: "Himachal Pradesh", code: "02" },
    { state: "Jammu and Kashmir", code: "01" },
    { state: "Jharkhand", code: "20" },
    { state: "Karnataka", code: "29" },
    { state: "Kerala", code: "32" },
    { state: "Ladakh", code: "38" },
    { state: "Lakshadweep", code: "31" },
    { state: "Madhya Pradesh", code: "23" },
    { state: "Maharashtra", code: "27" },
    { state: "Manipur", code: "14" },
    { state: "Meghalaya", code: "17" },
    { state: "Mizoram", code: "15" },
    { state: "Nagaland", code: "13" },
    { state: "Odisha", code: "21" },
    { state: "Puducherry", code: "34" },
    { state: "Punjab", code: "03" },
    { state: "Rajasthan", code: "08" },
    { state: "Sikkim", code: "11" },
    { state: "Tamil Nadu", code: "33" },
    { state: "Telangana", code: "36" },
    { state: "Tripura", code: "16" },
    { state: "Uttar Pradesh", code: "09" },
    { state: "Uttarakhand", code: "05" },
    { state: "West Bengal", code: "19" }
  ];

  // → Auto-get GST state code from name
  const getGSTCode = (stateName) => {
    if (!stateName) return { code: "", indian: null };

    const match = gstStateCodes.find(
      s => s.state.toLowerCase() === stateName.toLowerCase()
    );

    if (match) return { code: match.code, indian: true };

    return { code: "", indian: false }; // foreign / unknown state
  };
  useEffect(() => {
    toDataURL(logo).then((dataUrl) => {
      setLogoBase64(dataUrl);
    });
  }, []);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const query = new URLSearchParams(location.search);
    const orderIdFromEmail = query.get("orderId");

    if (orderIdFromEmail) {
      if (user?.id) {
        handleViewDetails(orderIdFromEmail);
      } else {
        // Optionally redirect to login if user not logged in
        navigate("/login");
        return;
      }

      // Remove orderId from URL without reload
      const params = new URLSearchParams(location.search);
      params.delete("orderId");
      window.history.replaceState({}, "", `${location.pathname}?${params.toString()}`);
    }
  }, [location.search, navigate]);



  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    api
      .get(`/Orders/user_orders/${userId}`)
      .then((response) => {
        const sortedOrders = response.data
          .map((o) => ({
            ...o,
            finalAmount: Number(o.finalAmount),
            shipping_charges: Number(o.shipping_charges),
          }))
          .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

        setOrders(sortedOrders);
      })
      .catch(() => {
        // intentionally silent
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);


  const handleViewDetails = async (orderId) => {
    try {
      const response = await api.get(`/Orders/order/${orderId}`);

      if (response.data) {
        const sanitizedOrder = {
          ...response.data,
          finalAmount: Number(response.data.finalAmount),
          shipping_charges: Number(response.data.shipping_charges),
          items:
            response.data.items?.map((item) => ({
              ...item,
              price: Number(item.price),
            })) || [],
        };
        setSelectedOrder(sanitizedOrder);
        setModalOpen(true);
      }
    } catch (error) {

    }
  };
  const handleAddReview = async (item) => {


    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) {
      alert('You need to log in to submit a review.');
      navigate('/login');
      return;
    }

    // Ensure rating is provided
    if (!newReview.rating) {
      alert('Please provide a rating.');
      return;
    }

    // Ensure variantId is available before proceeding
    // Access variant_id directly from item (since variant_id is now part of the item, not item.product)
    const variantId = item.variant_id;  // Corrected access to variant_id
    if (!variantId) {
      alert('Variant ID is missing. Cannot submit review.');
      return; // Prevent review submission if variantId is not present
    }



    const formData = new FormData();
    formData.append('variantId', variantId);
    formData.append('rating', newReview.rating);
    if (newReview.comment) {
      formData.append('comment', newReview.comment);
    }

    selectedImages.forEach((file) => {
      formData.append('images[]', file);
    });

    if (selectedVideo) {
      formData.append('video', selectedVideo);
    }

    try {
      setIsSubmitting(true);
      await api.post(`/Reviews/add/${user.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const refreshed = await api.get(`/Reviews/variant/${variantId}`);
      item.reviews = refreshed.data;

      // setNewReview({ rating: 1, comment: '' });
      setSelectedImages([]);
      setSelectedVideo(null);
      setVideoPreviewUrl(null);
      setShowReviewForm(false);
      alert('Review submitted successfully!');
    } catch (error) {

      alert('Failed to submit the review. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleDownloadInvoice = () => {
    if (!selectedOrder) return;
    const discount = Number(selectedOrder.discount_amount || 0);

    // ==========================
    //  GST CALCULATION PER ITEM
    // ==========================
    const gstItems = selectedOrder.items.map((item, index) => {
      const priceIncl = Number(item.price || 0);             // Price including GST
      const priceExcl = Number(item.priceExcludingTax || 0); // Price excluding GST

      const gstAmount = priceIncl - priceExcl;
      const cgst = gstAmount / 2;
      const sgst = gstAmount / 2;

      return {
        sno: index + 1,
        name: item.productName,
        hsn: item.product?.hsn_code || "N/A",
        gstPercent: Number(item.product?.tax_percentage || 0),
        taxable: priceExcl,
        cgst,
        sgst,
        qty: item.quantity,
        total: priceIncl,
      };
    });



    // TOTALS
    const totalTaxable = gstItems.reduce((sum, i) => sum + i.taxable * i.qty, 0);
    const totalCGST = gstItems.reduce((sum, i) => sum + (i.cgst * i.qty), 0);
    const totalSGST = gstItems.reduce((sum, i) => sum + (i.sgst * i.qty), 0);
    const totalTax = totalCGST + totalSGST;

    const shipping = Number(selectedOrder.shipping_charges || 0);
    const grandTotal =
      totalTaxable +
      totalCGST +
      totalSGST +
      shipping -
      discount;

    const totalQty = gstItems.reduce((sum, i) => sum + i.qty, 0);
    const buyerState = (selectedOrder.user?.state);
    const sellerState = "Maharashtra";
    const isIntraState = buyerState === sellerState;

    // ==========================
    //  SUMMARY TAX TABLE (HSN WISE)
    // ==========================
    // Safe number helper
    const safeNumber = (n) => (isNaN(Number(n)) ? 0 : Number(n));

    // ==========================
    //  SUMMARY TAX TABLE (HSN WISE)
    // ==========================
    const gstRows = gstItems.map((i) => {
      const taxableValue = (safeNumber(i.taxable) * safeNumber(i.qty)).toFixed(2);
      const igstAmount = ((safeNumber(i.cgst) + safeNumber(i.sgst)) * safeNumber(i.qty)).toFixed(2);

      if (isIntraState) {
        return [
          i.hsn,
          taxableValue,
          `${safeNumber(i.gstPercent) / 2}%`,
          (safeNumber(i.cgst) * safeNumber(i.qty)).toFixed(2),
          `${safeNumber(i.gstPercent) / 2}%`,
          (safeNumber(i.sgst) * safeNumber(i.qty)).toFixed(2),
          ((safeNumber(i.cgst) + safeNumber(i.sgst)) * safeNumber(i.qty)).toFixed(2),
        ];
      } else {
        return [
          i.hsn,
          taxableValue,
          `${safeNumber(i.gstPercent)}%`,
          igstAmount,
        ];
      }
    });

    // Prepare totals row
    const summaryTotals = isIntraState
      ? [
        { text: "Total", bold: true },
        totalTaxable.toFixed(2),
        "",
        totalCGST.toFixed(2),
        "",
        totalSGST.toFixed(2),
        (totalCGST + totalSGST).toFixed(2),
      ]
      : [
        { text: "Total", bold: true },
        totalTaxable.toFixed(2),
        "",
        (totalCGST + totalSGST).toFixed(2), // IGST total
      ];

    // Final summary tax table
    const summaryTaxTable = [
      // Header row
      isIntraState
        ? [
          { text: "HSN/SAC", bold: true },
          { text: "Taxable Value", bold: true },
          { text: "CGST \nRate", bold: true, alignment: "center" },
          { text: "CGST \nAmount", bold: true, alignment: "center" },
          { text: "SGST \nRate", bold: true, alignment: "center" },
          { text: "SGST \nAmount", bold: true, alignment: "center" },
          { text: "Total Tax Amount", bold: true, alignment: "center" },
        ]
        : [
          { text: "HSN/SAC", bold: true },
          { text: "Taxable Value", bold: true },
          { text: "IGST \nRate", bold: true, alignment: "center" },
          { text: "IGST \nAmount", bold: true, alignment: "center" },
        ],

      // Table data rows
      ...gstRows,

      // Totals row
      summaryTotals,
    ];


    const tableBody = [
      [
        { text: "S.No", bold: true },
        { text: "Description of Goods", bold: true },
        { text: "HSN", bold: true },
        { text: "GST %", bold: true },
        { text: "Qty", bold: true },
        { text: "Rate", bold: true },
        { text: "Per", bold: true },
        { text: "Amount", bold: true },
      ],

      // PRODUCT ROWS
      ...gstItems.map((i) => [
        i.sno.toString(),
        { text: i.name, bold: true },
        i.hsn,
        `${i.gstPercent}%`,
        i.qty.toString(),
        `${i.taxable.toFixed(2)}`,
        "Pcs",
        `${(i.taxable * i.qty).toFixed(2)}`,
      ]),

      // EMPTY SPACER ROW
      ["", "", "", "", "", "", "", ""],

      // SUMMARY INSIDE TABLE
      ...(isIntraState
        ? [
          ["", { text: "CGST", bold: true }, "", "", "", "", "", `${totalCGST.toFixed(2)}`],
          ["", { text: "SGST", bold: true }, "", "", "", "", "", `${totalSGST.toFixed(2)}`],
        ]
        : [
          ["", { text: "IGST", bold: true }, "", "", "", "", "", `${(totalCGST + totalSGST).toFixed(2)}`],
        ]),

      // ============================
      // INSERT DISCOUNT ROW HERE
      // ONLY IF discount > 0
      // ============================
      ...(discount > 0
        ? [
          [
            "",
            { text: "Discount Applied", bold: true },
            "",
            "",
            "",
            "",
            "",
            `-${discount.toFixed(2)}`
          ]
        ]
        : []),

      // SHIPPING ROW (NO CHANGE)
      ["", { text: "Shipping Charges", bold: true }, "", "", "", "", "", `${shipping.toFixed(2)}`],

      [
        "",
        { text: "Grand Total", bold: true },
        "",
        "",
        { text: totalQty + " Pcs", bold: true },
        "",
        "",
        { text: `₹${Math.round(grandTotal).toFixed(2)}`, bold: true }
      ],
    ];


    // Convert number to words
    const numberToWords = (num) => {
      const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven",
        "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
      const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

      const convert = (n) => {
        if (n < 20) return a[n];
        if (n < 100) return b[Math.floor(n / 10)] + " " + a[n % 10];
        if (n < 1000) return a[Math.floor(n / 100)] + " Hundred " + convert(n % 100);
        if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand " + convert(n % 1000);
        if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh " + convert(n % 100000);
        return convert(Math.floor(n / 10000000)) + " Crore " + convert(n % 10000000);
      };

      return convert(num).trim() + " Rupees Only";
    };

    // ==========================
    //  DOCUMENT DEFINITION
    // ==========================
    const docDefinition = {
      pageMargins: [40, 160, 40, 60],

      header: (currentPage, pageCount) => ({
        margin: [40, 10, 40, 30],
        stack: [
          { image: logoBase64, width: 70, margin: [0, 0, 0, 5] },
          {
            alignment: "left",
            stack: [
              { text: "https://www.kitchenarykart.com", link: "https://www.kitchenarykart.com", color: "blue", fontSize: 10 },
              { text: "A2 / 103, Parshwanagar, opp. Swami Vivekanand Garden,", fontSize: 9 },
              { text: "Kondhwa Budruk, Pune", fontSize: 9 },
              {
                text: [
                  { text: "Contact: ", fontSize: 10 },
                  { text: "8010595749", bold: true, fontSize: 9 }
                ]
              },

              { text: "GSTIN/UIN: 27AAQPR2976J1ZU", fontSize: 9 },
              { text: "Company's PAN: AAQPR2976J ", fontSize: 9 },
              { text: "State Name: Maharashtra, Code: 27", fontSize: 9 },
              { text: "E-Mail: support@kitchenarykart.com", fontSize: 9 },
            ],
          }
        ]
      }),




      content: [{ text: "\n" },
      // { text: "TAX INVOICE", style: "title", margin: [0, 0, 0, 20] },

      // ORDER + ADDRESS SECTION
      {
        columns: [
          [
            { text: "Buyer (Bill to)", bold: true },
            { text: selectedOrder.user?.username || "", bold: true, fontSize: 9 },
            {
              text: `${selectedOrder.user?.address}, ${selectedOrder.user?.state}, ${selectedOrder.user?.country} - ${selectedOrder.user?.pincode}`,
              fontSize: 9,
            },
            {
              text:
                getGSTCode(selectedOrder.user?.state).indian === true
                  ? `State Name  :${selectedOrder.user?.state} ,Code: ${getGSTCode(selectedOrder.user?.state).code}`
                  : `State  :${selectedOrder.user?.state} (Non-Indian — GST not applicable)`,
              fontSize: 9,
            },

            {
              text: [
                { text: "Contact :", fontSize: 9 },
                { text: selectedOrder.user?.contactNumber || "", bold: true, fontSize: 9 }
              ],
            },
          ]
          ,
          [
            { text: `Invoice No.: ${selectedOrder.id}`, style: "info" },
            // { text: `Status: ${selectedOrder.status}`, style: "info" },
            {
              text: `Order Date: ${new Date(selectedOrder.orderDate).toLocaleDateString()}`
              ,
              style: "info",
            },
          ],

        ],
      },

      { text: "Order Items", style: "sectionHeader" },

      // ==========================
      // MAIN GST TABLE
      // ==========================
      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto", "auto", "auto", "auto", "auto", "auto"],
          body: tableBody,
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex === 0 ? "#f5f5f5" : null),
          vLineWidth: () => 1,
          vLineColor: () => "#ccc",
          hLineWidth: (i, node) => {
            const totalRows = node.table.body.length;
            const grandTotalIndex = totalRows - 1;
            if (i === 1) return 1; // Under header
            if (i === grandTotalIndex) return 1; // Above grand total
            return 0;
          },
          hLineColor: () => "#000",
        },
        fontSize: 7.5
      },

      // ==========================
      //  SPACE BEFORE SUMMARY
      // ==========================
      { text: "\n" },
      {
        text: [
          "Amount chargeable (in Words) \n ",
          { text: `${numberToWords(Math.round(grandTotal))}`, bold: true }
        ],
        margin: [0, 10, 0, 10],
        fontSize: 7.5
      }
        ,

      // ==========================
      //  TAX SUMMARY TABLE (NEW)
      // ==========================
      { text: "Tax Summary", style: "sectionHeader", margin: [0, 10, 0, 6] },

      {
        table: {
          headerRows: 1,
          widths: isIntraState
            ? ["auto", "*", "auto", "auto", "auto", "auto", "auto"] // 7 columns for CGST+SGST
            : ["auto", "*", "auto", "auto"],                         // 4 columns for IGST
          body: summaryTaxTable,
        },
        layout: {
          vLineWidth: () => 1,
          vLineColor: () => "#000",
          hLineWidth: (i, node) => {
            const total = node.table.body.length;
            if (i === 1) return 1;           // Header underline
            if (i === total - 1) return 1;   // Above total row
            return 0;
          },
          hLineColor: () => "#000",
        },
        fontSize: 7.5
      },
      {
        text: [
          "Tax Amount (in Words):\n",
          { text: `${numberToWords(Math.round(totalTax))}`, bold: true }
        ],
        margin: [0, 5, 0, 10],
        fontSize: 7.5
      }
        ,

      // ==========================
      // FOOTER TEXT
      // ==========================
      { text: "\nThank you for shopping with us!", style: "footerNote" },
      ],

      styles: {
        title: {
          fontSize: 20,
          bold: true,
          alignment: "center",
          color: "#8B0000",
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          margin: [0, 20, 0, 10],
          color: "#8B0000",
        },
        info: { fontSize: 10, margin: [0, 2, 0, 2] },
        footerNote: {
          alignment: "center",
          italics: true,
          margin: [0, 20, 0, 0],
          color: "#8B0000",
        },
      },

      defaultStyle: {
        font: "Roboto",
      },
    };

    pdfMake.createPdf(docDefinition).download(`Invoice_Order_${selectedOrder.id}.pdf`);
  };








  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <ProfilePage />
      <div className="flex-1 min-w-0 p-4 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-600">No orders found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow p-4">
                <div className="space-y-2">
                  <p className="text-sm"><span className="font-semibold">Status:</span> {order.status}</p>
                  <p className="text-sm"><span className="font-semibold">Delivery Charges:</span> ₹{order.shipping_charges}</p>
                  <p className="text-sm"><span className="font-semibold">Total:</span> ₹ {order.finalAmount.toFixed(2)}</p>
                  <p className="text-sm"><span className="font-semibold">Ordered On:</span> {new Date(order.orderDate).toLocaleString()}</p>
                  <button
                    onClick={() => handleViewDetails(order.id)}
                    className="mt-3 px-4 py-2 border-2 border-red-900 text-red-900 font-bold rounded hover:bg-red-900 hover:text-white transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-lg max-w-2xl w-full my-8" onClick={(e) => e.stopPropagation()}>
            {selectedOrder && (
              <div className="flex flex-col max-h-96 overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-4 font-bold text-lg">
                  Order Details
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <p className="text-sm text-gray-600">Order ID: {selectedOrder.id}</p>
                  {selectedOrder.gst_no && <p className="text-sm"><strong>GST No:</strong> {selectedOrder.gst_no}</p>}
                  {selectedOrder.firm_name && <p className="text-sm"><strong>Firm Name:</strong> {selectedOrder.firm_name}</p>}
                  
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item) => (
                      <div key={item.id} className="border-b pb-3">
                        <p className="text-sm"><strong>Product:</strong> {item.product?.name}</p>
                        <p className="text-sm"><strong>Quantity:</strong> {item.quantity}</p>
                        <p className="text-sm"><strong>Price:</strong> ₹{item.price?.toFixed(2)}</p>
                        {item.productWeight && <p className="text-sm"><strong>Weight:</strong> {item.productWeight}</p>}
                        {item.color && <p className="text-sm"><strong>Color:</strong> {item.color}</p>}
                      </div>
                    ))}
                  </div>

                  <p className="text-sm"><strong>Shipping Address:</strong> {selectedOrder.address}, {selectedOrder.pincode}, {selectedOrder.state}, {selectedOrder.country}</p>
                </div>

                {/* Footer */}
                <div className="border-t p-4 flex gap-2 justify-end">
                  <button
                    onClick={handleDownloadInvoice}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Download Invoice
                  </button>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}



