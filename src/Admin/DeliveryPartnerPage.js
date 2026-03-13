import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminModal, AdminInput, AdminTextarea, AdminBtn, AdminPageHeader } from "./AdminUI";

const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}`;

const DeliveryPartnerPage = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPartner, setEditPartner] = useState(null);
  const [hasSetModal, setHasSetModal] = useState(false);
  const [form, setForm] = useState({ deliverypartners_name: "", deliverypartners_description: "" });

  const showToast = (message, variant = "success") => {
    if (variant === "danger" || variant === "error") {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  const fetchPartners = useCallback(async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/Deliverypartner/DeliveryPartnerList`
      );

      if (res.data?.status) {
        setPartners(res.data.data || []);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      showToast("Failed to load delivery partners", "danger");
    }
  }, []);


  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);


  const openModal = (partner = null) => {
    setEditPartner(partner);
    setForm(
      partner
        ? {
          deliverypartners_id: partner.deliverypartners_id,
          deliverypartners_name: partner.deliverypartners_name,
          deliverypartners_description: partner.deliverypartners_description,
        }
        : { deliverypartners_name: "", deliverypartners_description: "" }
    );
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editPartner) {
        await axios.post(`${BASE_URL}/Deliverypartner/editDeliveryPartner`, form);
        showToast("Delivery Partner Updated!");
      } else {
        await axios.post(`${BASE_URL}/Deliverypartner/addDeliveryPartner`, form);
        showToast("Delivery Partner Added!");
      }

      setModalOpen(false);
      fetchPartners();
    } catch (err) {
      console.error(err);
      showToast("Action Failed", "danger");
    }
  };

  // New: Delete Delivery Partner
  const handleDelete = async (partnerId) => {
    if (!window.confirm("Are you sure you want to delete this partner?")) return;

    try {
      await axios.post(`${BASE_URL}/Deliverypartner/deleteDeliveryPartner`, {
        deliverypartners_id: partnerId,
      });
      showToast("Delivery Partner Deleted!");
      fetchPartners(); // Refresh the list
    } catch (err) {
      console.error(err);
      showToast("Delete Failed", "danger");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-stone-50 min-h-screen">
      <AdminPageHeader
        title="Delivery Partners"
        action={
          <AdminBtn onClick={() => openModal()}>+ Add Partner</AdminBtn>
        }
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-red-600"></div>
        </div>
      ) : partners.length === 0 ? (
        <div className="text-center text-gray-500 py-12">No delivery partners found.</div>
      ) : (
        <div className="space-y-3">
          {partners.map((partner) => (
            <div
              key={partner.deliverypartners_id}
              className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between hover:shadow-lg transition"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{partner.deliverypartners_name}</h3>
                <p className="text-sm text-gray-500 mt-1">{partner.deliverypartners_description}</p>
              </div>
              <div className="flex gap-2">
                <AdminBtn
                  variant="outline"
                  size="sm"
                  onClick={() => openModal(partner)}
                >
                  ✎ Edit
                </AdminBtn>
                <AdminBtn
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(partner.deliverypartners_id)}
                >
                  🗑 Delete
                </AdminBtn>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <AdminModal
          title={editPartner ? "Edit Delivery Partner" : "Add Delivery Partner"}
          onClose={() => setModalOpen(false)}
          size="md"
        >
          <div className="space-y-4">
            <AdminInput
              label="Partner Name"
              type="text"
              value={form.deliverypartners_name}
              onChange={(e) => setForm({ ...form, deliverypartners_name: e.target.value })}
              placeholder="Partner name"
            />
            <AdminTextarea
              label="Tracking Link / Description"
              rows={3}
              value={form.deliverypartners_description}
              onChange={(e) => setForm({ ...form, deliverypartners_description: e.target.value })}
              placeholder="Tracking link or description"
            />
          </div>
          <div className="flex gap-3 mt-5">
            <AdminBtn className="flex-1" onClick={handleSubmit}>
              {editPartner ? "Update" : "Add"}
            </AdminBtn>
            <AdminBtn variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>
              Cancel
            </AdminBtn>
          </div>
        </AdminModal>
      )}

      {/* Toast Notification */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default DeliveryPartnerPage;
