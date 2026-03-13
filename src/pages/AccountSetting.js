import React, { useState, useEffect } from "react";
import api from "../utils/api";
import ProfilePage from "./ProfilePage";
import { Country, State } from "country-state-city";
import { User, Mail, Phone, MapPin, Globe, Map, Hash, Pencil, Check, X, Save, ShieldCheck } from "lucide-react";

/* ─── Reusable input ─────────────────────────────────────────────────────── */
const Input = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">{label}</label>
    <input
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full px-3 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg
                 focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors"
    />
  </div>
);

/* ─── Main ───────────────────────────────────────────────────────────────── */
const AccountSetting = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(user || {});
  const [loading, setLoading] = useState(!user);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (!user) fetchUser(); }, []); // eslint-disable-line

  const fetchUser = async () => {
    const id = localStorage.getItem("userId");
    if (!id) { setLoading(false); return; }
    try {
      const { data } = await api.get(`/user/${id}`);
      if (data) { setUser(data); setFormData(data); localStorage.setItem("user", JSON.stringify(data)); }
    } catch (_) { }
    finally { setLoading(false); }
  };

  const openEdit = () => { setFormData(user); setEditMode(true); };
  const closeEdit = () => setEditMode(false);
  const onInput = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSave = async () => {
    setSaving(true);
    try {
      const payload = {
        email: user.email,
        username: formData.username,
        contactNumber: formData.contact_number,
        address: formData.address,
        country: formData.country,
        state: formData.state,
        pincode: formData.pincode,
      };
      const { data } = await api.put(`/user/update`, payload);
      if (data.success) {
        const next = { ...user, ...payload, contact_number: payload.contactNumber };
        setUser(next);
        localStorage.setItem("user", JSON.stringify(next));
        setEditMode(false);
        setSaved(true);
        window.dispatchEvent(new Event("userUpdated"));
        setTimeout(() => setSaved(false), 3000);
      } else alert(data.message || "Failed to update.");
    } catch (_) { alert("An error occurred."); }
    finally { setSaving(false); }
  };

  const initials = user?.username
    ? user.username.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  /* ── States ── */
  if (loading)
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <ProfilePage />
        <div className="flex-1 flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <ProfilePage />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <User size={24} className="text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-700">Not signed in</p>
            <p className="text-xs text-gray-400 mt-1">Please log in to continue</p>
          </div>
        </div>
      </div>
    );

  /* ── list of fields to display ── */
  const fields = [
    { icon: User, label: "Full Name", value: user.username },
    { icon: Mail, label: "Email", value: user.email },
    { icon: Phone, label: "Mobile", value: user.contact_number },
    { icon: Hash, label: "Pincode", value: user.pincode },
    { icon: Globe, label: "Country", value: user.country },
    { icon: Map, label: "State", value: user.state },
    { icon: MapPin, label: "Address", value: user.address, wide: true },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      <ProfilePage />

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-gray-50/60">

        {/* Page header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-100 px-5 sm:px-8 py-4 flex items-center justify-between">
          <h1 className="text-base font-bold text-gray-900">Account</h1>
          <button
            onClick={openEdit}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            <Pencil size={12} />
            Edit
          </button>
        </div>

        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-8 space-y-8">

          {/* ── Profile identity ─────────────────────────────────── */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0 select-none"
              style={{ background: "linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)" }}>
              {initials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-lg font-bold text-gray-900 leading-tight">{user.username}</p>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <ShieldCheck size={10} /> Verified
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-0.5 truncate">{user.email}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100" />

          {/* ── Success banner ───────────────────────────────────── */}
          {saved && (
            <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl">
              <Check size={15} className="flex-shrink-0" />
              Profile saved successfully.
            </div>
          )}

          {/* ── Info section label ───────────────────────────────── */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Personal Information</p>

            {/* Fields grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden bg-white">
              {fields.map(({ icon: Icon, label, value, wide }, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 px-4 py-4 sm:py-4.5 hover:bg-gray-50/70 transition-colors
                    ${wide ? "sm:col-span-2 border-t border-gray-100" : ""}
                    ${!wide && i % 2 === 1 ? "sm:border-l sm:border-gray-100" : ""}
                  `}
                >
                  <Icon size={14} className="text-gray-300 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-300 mb-0.5">{label}</p>
                    <p className="text-sm text-gray-800 font-medium break-words">
                      {value || <span className="text-gray-300 font-normal">—</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ─── Edit side panel ────────────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        onClick={closeEdit}
        className={`fixed inset-0 z-[300] bg-black/20 transition-opacity duration-300 ${editMode ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 z-[301] h-full w-full max-w-[400px] bg-white shadow-2xl flex flex-col
                       transition-transform duration-300 ease-[cubic-bezier(.32,.72,0,1)]
                       ${editMode ? "translate-x-0" : "translate-x-full"}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <p className="text-sm font-bold text-gray-900">Edit Profile</p>
          <button onClick={closeEdit} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X size={14} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <Input label="Full Name" name="username" value={formData.username} onChange={onInput} />
          <Input label="Mobile" name="contact_number" value={formData.contact_number} onChange={onInput} />
          <Input label="Address" name="address" value={formData.address} onChange={onInput} />
          <Input label="Pincode" name="pincode" value={formData.pincode} onChange={onInput} />

          {/* Country */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Country</label>
            <select
              value={formData.country || ""}
              onChange={(e) => setFormData((p) => ({ ...p, country: e.target.value, state: "" }))}
              className="w-full px-3 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg
                         focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors"
            >
              <option value="">Select Country</option>
              {Country.getAllCountries().map((c) => (
                <option key={c.isoCode} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">State</label>
            <select
              value={formData.state || ""}
              onChange={(e) => setFormData((p) => ({ ...p, state: e.target.value }))}
              disabled={!formData.country}
              className="w-full px-3 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg
                         focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select State</option>
              {(() => {
                const c = Country.getAllCountries().find((c) => c.name === formData.country);
                return c ? State.getStatesOfCountry(c.isoCode).map((s) => (
                  <option key={s.isoCode} value={s.name}>{s.name}</option>
                )) : [];
              })()}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 px-5 py-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={closeEdit}
            className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            Cancel
          </button>
          <button onClick={onSave} disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white bg-gray-900
                       hover:bg-gray-800 disabled:opacity-50 rounded-xl transition-all active:scale-[0.98]">
            {saving
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><Save size={13} /> Save</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSetting;
