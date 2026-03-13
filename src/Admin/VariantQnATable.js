import React, { useEffect, useState } from "react"; 
import axios from "axios";

const VariantQnATable = () => {
  const [qnas, setQnas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [answers, setAnswers] = useState({});
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [expandedVariants, setExpandedVariants] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchAllQnAs = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/ProductVariantQa/getAll`,
          {
            headers: { "x-Authorization": `Bearer ${token}` },
          }
        );

        const formatted = res.data.map((qa) => ({
          id: qa.id,
          answer: qa.answer,
          answeredAt: qa.answered_at,
          answeredBy: qa.answered_by,
          createdAt: qa.created_at,
          isApproved: qa.is_approved,
          isDeleted: qa.is_deleted,
          question: qa.question,
          userId: qa.user_id,
          variantId: qa.variant_id,
          username: qa.username,
          userEmail: qa.userEmail,
          productName: qa.product_name,
          color: qa.color,
          dimensions: qa.dimensions,
        }));

        setQnas(formatted);
      } catch (error) {
        console.error("Error fetching Q&As:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllQnAs();
  }, []);

  const handleAnswerChange = (qaId, value) => {
    setAnswers({ ...answers, [qaId]: value });
  };

  const submitAnswer = async (qaId) => {
    const answerText = answers[qaId];
    if (!answerText) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/ProductVariantQa/answer/${qaId}`,
        null,
        {
          params: { answer: answerText },
          headers: { "x-Authorization": `Bearer ${token}` },
        }
      );
      setAnswers((prev) => ({ ...prev, [qaId]: "" }));
      await refreshQnAs();
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAnswer = (qaId, currentAnswer) => {
    setEditingAnswerId(qaId);
    setAnswers({ ...answers, [qaId]: currentAnswer });
  };

  const submitEditedAnswer = async (qaId) => {
    const updatedAnswer = answers[qaId];
    if (!updatedAnswer) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/ProductVariantQa/editAnswer/${qaId}`,
        null,
        {
          params: { answer: updatedAnswer },
          headers: { "x-Authorization": `Bearer ${token}` },
        }
      );
      setEditingAnswerId(null);
      setAnswers((prev) => ({ ...prev, [qaId]: "" }));
      await refreshQnAs();
    } catch (err) {
      console.error("Error editing answer:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnswer = async (qaId) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/ProductVariantQa/deleteAnswer/${qaId}`,
        { headers: { "x-Authorization": `Bearer ${token}` } }
      );
      await refreshQnAs();
    } catch (err) {
      console.error("Failed to delete answer:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (qaId) => {
    if (!window.confirm("Are you sure you want to delete this Q&A?")) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/ProductVariantQa/delete_qa/${qaId}`,
        { headers: { "x-Authorization": `Bearer ${token}` } }
      );
      setQnas((prev) => prev.filter((qa) => qa.id !== qaId));
    } catch (err) {
      console.error("Failed to delete Q&A:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshQnAs = async () => {
  const token = localStorage.getItem("adminToken");
  const res = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/ProductVariantQa/getAll`,
    { headers: { "x-Authorization": `Bearer ${token}` } }
  );

  const formatted = res.data.map((qa) => ({
    ...qa,
    variantId: qa.variant_id,
    productName: qa.product_name,
    dimensions: qa.dimensions,
    color: qa.color,
  }));

  setQnas(formatted);
};
  const toggleExpand = (variantId) => {
    setExpandedVariants((prev) => ({
      ...prev,
      [variantId]: !prev[variantId],
    }));
  };

  const grouped = qnas.reduce((acc, qa) => {
    const variantId = qa.variantId || "Unknown";
    if (!acc[variantId]) {
      acc[variantId] = {
        variantId,
        productName: qa.productName,
        dimensions: qa.dimensions,
        color: qa.color,
        qas: [],
      };
    }
    acc[variantId].qas.push(qa);
    return acc;
  }, {});

  const variantGroups = Object.values(grouped);
  const filteredGroups = variantGroups.filter((variant) =>
    variant.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-4 sm:px-6 py-6 bg-stone-50 min-h-screen">
      {loading && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/50">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-red-600" />
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4 text-stone-800">Product Variant Q&A</h2>

      <div className="mb-4">
        <input
          type="text"
          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredGroups.length === 0 ? (
        <p className="text-sm text-stone-500">No Q&A found for the searched product.</p>
      ) : (
        filteredGroups.map((variant) => (
          <div key={variant.variantId} className="mb-6 bg-white rounded-xl shadow-sm border border-stone-200 p-4">
            <h6 className="text-sm font-semibold text-stone-800 mb-1">Product Name: {variant.productName}</h6>
            {variant.dimensions?.trim() && <p className="text-xs text-stone-600"><strong>Dimensions:</strong> {variant.dimensions}</p>}
            {variant.color?.trim() && <p className="text-xs text-stone-600"><strong>Color:</strong> {variant.color}</p>}

            <button
              className="px-3 py-1.5 border border-stone-400 text-stone-700 hover:bg-stone-100 text-xs rounded font-semibold transition mb-2"
              onClick={() => toggleExpand(variant.variantId)}
            >
              {expandedVariants[variant.variantId] ? "Hide Q&A" : "More"}
            </button>

            {expandedVariants[variant.variantId] && (
              <div className="overflow-x-auto mt-2">
              <table className="w-full border-collapse text-sm min-w-max">
                <thead>
                  <tr className="bg-stone-800 text-white">
                    <th className="px-3 py-2.5 text-xs font-semibold text-left">User</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-left">Question</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-left">Answer</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-left">Asked On</th>
                    <th className="px-3 py-2.5 text-xs font-semibold text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {variant.qas.map((qa) => (
                    <tr key={qa.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-3 py-2.5 text-xs text-stone-700">
                        {qa.username && (
                          <>
                            <strong>{qa.username}</strong>
                            {qa.userEmail && ` (${qa.userEmail})`}
                          </>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-stone-700">{qa.question}</td>
                      <td className="px-3 py-2.5 text-xs text-stone-700">
                        {editingAnswerId === qa.id ? (
                          <div>
                            <textarea
                              rows={2}
                              value={answers[qa.id]}
                              onChange={(e) => handleAnswerChange(qa.id, e.target.value)}
                              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                            />
                            <div className="flex gap-1 mt-1">
                            <button
                              className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded font-semibold transition"
                              onClick={() => submitEditedAnswer(qa.id)}
                            >
                              Save
                            </button>
                            <button
                              className="px-2 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs rounded font-semibold transition"
                              onClick={() => setEditingAnswerId(null)}
                            >
                              Cancel
                            </button>
                            </div>
                          </div>
                        ) : qa.answer ? (
                          <div>
                            <span className="text-xs text-stone-700">{qa.answer}</span>
                            <div className="flex gap-1 mt-1">
                              <button
                                className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs rounded font-semibold transition"
                                onClick={() => handleEditAnswer(qa.id, qa.answer)}
                              >
                                Edit
                              </button>
                              <button
                                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded font-semibold transition"
                                onClick={() => handleDeleteAnswer(qa.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <textarea
                              rows={2}
                              value={answers[qa.id] || ""}
                              onChange={(e) => handleAnswerChange(qa.id, e.target.value)}
                              placeholder="Enter answer..."
                              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                            />
                            <button
                              className="px-2 py-1 bg-red-700 hover:bg-red-800 text-white text-xs rounded font-semibold transition mt-1"
                              onClick={() => submitAnswer(qa.id)}
                            >
                              Submit
                            </button>
                          </div>
                        )}
                      </td>
                     <td className="px-3 py-2.5 text-xs text-stone-700">{new Date(qa.createdAt).toLocaleDateString()}</td>
                      <td className="px-3 py-2.5">
                        <button
                          className="px-2 py-1 border border-red-600 text-red-600 hover:bg-red-50 text-xs rounded font-semibold transition"
                          onClick={() => handleDelete(qa.id)}
                        >
                          Delete Q&A
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default VariantQnATable;
