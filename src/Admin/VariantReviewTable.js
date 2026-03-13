import React, { useEffect, useState } from "react";
import axios from "axios";

const VariantReviewTable = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newReply, setNewReply] = useState({});
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const[loading,setLoading]=useState(false);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Reviews/all`, {
        headers: { "x-Authorization": `Bearer ${token}` },
      });
      setReviews(res.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }finally{setLoading(false)}
  };

  const handleDeleteReview = async (reviewId) => {
    setLoading(true)
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/Reviews/delete_review/${reviewId}`, {
          headers: { "x-Authorization": `Bearer ${token}` },
        });
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      } catch (err) {
        console.error("Failed to delete review:", err);
      }
      finally{setLoading(false)}
    }
  };

  const handleAddReply = async (reviewId) => {
    setLoading(true)
  const message = newReply[reviewId]?.trim();
  if (!message) return;

  try {
    const formData = new URLSearchParams();
    formData.append("message", message);

    await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/Reviews/reply/${reviewId}`,
      formData, // ✅ send as x-www-form-urlencoded
      {
        headers: {
          "x-Authorization": `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded", // ✅ correct content type
        },
      }
    );

    fetchAllReviews(); // refresh list
    setNewReply((prev) => ({ ...prev, [reviewId]: "" })); // clear input
  } catch (err) {
    console.error("Failed to add reply:", err.response?.data || err);
  } finally{setLoading(false)}
};



  const handleDeleteReply = async (replyId) => {
    setLoading(true)
    if (window.confirm("Delete this reply?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/Reviews/delete_reply/${replyId}`, {
          headers: { "x-Authorization": `Bearer ${token}` },
        });
        fetchAllReviews();
      } catch (err) {
        console.error("Failed to delete reply:", err);
      }
       finally{setLoading(false)}
    }
  };

const handleEditReply = async (replyId) => {
 setLoading(true)
  if (!editingText.trim()) return;

  try {
    const formData = new URLSearchParams();
    formData.append("message", editingText);

    await axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/Reviews/update_reply/${replyId}`, // ✅ correct API
      formData, // ✅ send as x-www-form-urlencoded
      {
        headers: {
          "x-Authorization": `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded", // ✅ important
        },
      }
    );

    fetchAllReviews(); // refresh updated replies
    setEditingReplyId(null);
    setEditingText("");
  } catch (err) {
    console.error("Failed to update reply:", err.response?.data || err);
  }
   finally{setLoading(false)}
};



  const groupedByVariant = reviews.reduce((acc, review) => {
    const variantId = review.productVariant?.id || "Unknown";
    if (!acc[variantId]) {
      acc[variantId] = {
        variantId,
        productName: review.productVariant?.productName || "N/A",
        dimensions: review.productVariant?.dimensions || "N/A",
        color: review.productVariant?.color || "N/A",
        reviews: [],
      };
    }
    acc[variantId].reviews.push(review);
    return acc;
  }, {});

  const variantsWithReviews = Object.values(groupedByVariant);
  const filteredVariants = variantsWithReviews.filter((variant) =>
    variant.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-4 sm:px-6 py-6 bg-stone-50 min-h-screen">
       {loading && (
  <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/50">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-red-600" />
  </div>
)}
      <h2 className="text-2xl font-bold mb-4 text-stone-800">Product Reviews</h2>
      <input
        type="text"
        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 mb-4"
        placeholder="Search by product name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredVariants.map((variant) => (
        <div key={variant.variantId} className="mb-6 bg-white rounded-xl shadow-sm border border-stone-200 p-4">
          <h6 className="text-sm font-semibold text-stone-800 mb-1">Product Name: {variant.productName}</h6>
       {variant.dimensions?.trim() && (
              <p className="text-xs text-stone-600"><strong>Dimensions:</strong> {variant.dimensions}</p>
            )}
            {variant.color?.trim() && (
              <p className="text-xs text-stone-600"><strong>Color:</strong> {variant.color}</p>
            )}

          <div className="overflow-x-auto mt-3">
          <table className="w-full border-collapse text-sm min-w-max">
            <thead>
              <tr className="bg-stone-800 text-white">
                <th className="px-3 py-2.5 text-xs font-semibold text-left">User</th>
                <th className="px-3 py-2.5 text-xs font-semibold text-left">Ratings</th>
                <th className="px-3 py-2.5 text-xs font-semibold text-left">Comment</th>
                <th className="px-3 py-2.5 text-xs font-semibold text-left">Date</th>
                <th className="px-3 py-2.5 text-xs font-semibold text-left">Images</th>
                <th className="px-3 py-2.5 text-xs font-semibold text-left">Replies</th>
                <th className="px-3 py-2.5 text-xs font-semibold text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {variant.reviews.map((review) => (
                <tr key={review.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-3 py-2.5 text-xs text-stone-700">{review.user?.username || "Anonymous"}</td>
                  <td className="px-3 py-2.5 text-xs text-stone-700">{review.rating}★</td>
                  <td className="px-3 py-2.5 text-xs text-stone-700">{review.reviewText}</td>
                  <td className="px-3 py-2.5 text-xs text-stone-700">{new Date(review.createdAt).toLocaleDateString()}</td>
                 <td className="px-3 py-2.5">
  {review.images && review.images.length > 0 ? (
    <div className="flex flex-wrap gap-1">
    {review.images.map((imgObj, i) => (
      <img
        key={i}
        src={imgObj.image}
        alt={`review-${review.id}-${i}`}
        className="w-10 h-10 object-cover rounded border border-stone-200"
      />
    ))}
    </div>
  ) : (
    <span className="text-xs text-stone-400">No images</span>
  )}
</td>

                  <td className="px-3 py-2.5">
                    {review.replies?.map((reply) => (
                      <div key={reply.id} className="mb-2 border border-stone-200 p-2 rounded bg-stone-50">
                        {editingReplyId === reply.id ? (
                          <>
                            <textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 mb-2"
                            />
                            <button onClick={() => handleEditReply(reply.id)} className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded font-semibold transition mr-1">Save</button>
                            <button onClick={() => setEditingReplyId(null)} className="px-2 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs rounded font-semibold transition">Cancel</button>
                          </>
                        ) : (
                          <>
                           <p className="text-xs text-stone-700 mb-1">{reply.message}</p>

<button
  onClick={() => {
    setEditingReplyId(reply.id);
    setEditingText(reply.message);
  }}
  className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs rounded font-semibold transition mr-1"
>
  Edit
</button>

                            <button onClick={() => handleDeleteReply(reply.id)} className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded font-semibold transition">Delete</button>
                          </>
                        )}
                      </div>
                    ))}

                    <div className="mt-2">
                      <textarea
                        placeholder="Write a reply..."
                        value={newReply[review.id] || ""}
                        onChange={(e) =>
                          setNewReply((prev) => ({ ...prev, [review.id]: e.target.value }))
                        }
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 mb-2"
                      />
                      <button onClick={() => handleAddReply(review.id)} className="px-2 py-1 bg-red-700 hover:bg-red-800 text-white text-xs rounded font-semibold transition">
                        Add Reply
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <button className="px-2 py-1 border border-red-600 text-red-600 hover:bg-red-50 text-xs rounded font-semibold transition" onClick={() => handleDeleteReview(review.id)}>
                      Delete Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VariantReviewTable;
