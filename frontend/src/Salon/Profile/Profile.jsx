import React, { useEffect, useState } from "react";
import ProfileFieldcard from "./ProfileFieldcard";
import api from "../../config/api";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import SaveIcon from "@mui/icons-material/Save";

const Profile = () => {
  const [owner, setOwner] = useState(null);
  const [salon, setSalon] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    openTime: "09:00",
    closeTime: "18:00",
    images: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: user } = await api.get("/api/users/profile");
        setOwner(user);
        try {
          const { data } = await api.get("/api/salons/owner");
          setSalon(data);
          setForm({
            name: data.name || "",
            email: data.email || user.email || "",
            phoneNumber: data.phoneNumber || "",
            address: data.address || "",
            city: data.city || "",
            openTime: String(data.openTime || "09:00").slice(0, 5),
            closeTime: String(data.closeTime || "18:00").slice(0, 5),
            images: (data.images || []).join("\n"),
          });
        } catch (requestError) {
          setError(
            requestError.response?.data?.message ||
              "Create your salon profile to start taking bookings."
          );
          setForm((current) => ({ ...current, email: user.email || "" }));
        }
      } catch (requestError) {
        setError(requestError.response?.data?.message || requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });

  const saveSalon = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    const salonDetails = {
      ...form,
      images: form.images
        .split("\n")
        .map((image) => image.trim())
        .filter(Boolean),
    };

    try {
      const response = salon
        ? await api.put(`/api/salons/${salon.id}`, salonDetails)
        : await api.post("/api/salons", salonDetails);
      setSalon(response.data);
      setMessage(
        salon
          ? "Salon details updated successfully."
          : "Salon profile created successfully."
      );
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const previewImages = form.images
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-600">Loading salon profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-300/80 text-amber-800 text-[11px] font-extrabold uppercase tracking-wider mb-2">
          <StorefrontIcon sx={{ fontSize: 14 }} />
          MANAGEMENT IDENTITY
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Salon & Owner Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your account credentials and customize public business details for customers.
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium">
          {error}
        </div>
      )}
      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center gap-2">
          <CheckCircleOutlinedIcon sx={{ fontSize: 18 }} className="text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* 1. Owner Credentials Card */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <PersonOutlinedIcon className="text-amber-600" sx={{ fontSize: 22 }} />
          <h2 className="text-lg font-bold text-slate-900">Owner Account Details</h2>
        </div>

        {owner && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <ProfileFieldcard
              keys="Full Name"
              value={owner.fullName}
              icon={<PersonOutlinedIcon sx={{ fontSize: 16 }} className="text-slate-400" />}
            />
            <ProfileFieldcard
              keys="Account Email"
              value={owner.email}
              icon={<EmailOutlinedIcon sx={{ fontSize: 16 }} className="text-slate-400" />}
            />
            <ProfileFieldcard
              keys="Assigned Role"
              value={owner.role}
              icon={<BadgeOutlinedIcon sx={{ fontSize: 16 }} className="text-slate-400" />}
            />
          </div>
        )}
      </section>

      {/* 2. Salon Public Details Form */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <StorefrontIcon className="text-amber-600" sx={{ fontSize: 22 }} />
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {salon ? "Salon Details" : "Create Salon Profile"}
              </h2>
              <p className="text-xs text-slate-500">
                Information visible to clients exploring salons and booking appointments
              </p>
            </div>
          </div>
          {salon && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
              Salon #{salon.id}
            </span>
          )}
        </div>

        <form onSubmit={saveSalon} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Salon Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Salon Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. Mirror Magic Salon"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-slate-900"
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Contact Email *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="salon@example.com"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-slate-900"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Phone Number *
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                required
                placeholder="+91 9876543210"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-slate-900"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                placeholder="e.g. Mumbai, Surat, Delhi"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-slate-900"
              />
            </div>

            {/* Street Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                placeholder="Plot / Shop number, Commercial Complex, Area"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-slate-900"
              />
            </div>

            {/* Opening Time */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Opening Time *
              </label>
              <div className="relative">
                <input
                  type="time"
                  name="openTime"
                  value={form.openTime}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Closing Time */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Closing Time *
              </label>
              <div className="relative">
                <input
                  type="time"
                  name="closeTime"
                  value={form.closeTime}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Image URLs */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Salon Showcase Images (one URL per line)
              </label>
              <textarea
                name="images"
                rows={3}
                value={form.images}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-1560066984-138dadb4c035&#10;https://images.unsplash.com/photo-1522337360788-8b13dee7a37e"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono text-xs text-slate-800"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Enter direct image URLs. These appear on your salon's public gallery and store card.
              </p>

              {previewImages.length > 0 && (
                <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-2">
                  {previewImages.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Salon preview ${index + 1}`}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
            >
              <SaveIcon sx={{ fontSize: 18 }} />
              <span>{saving ? "Saving Changes..." : salon ? "Update Salon Profile" : "Create Salon Profile"}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Profile;
