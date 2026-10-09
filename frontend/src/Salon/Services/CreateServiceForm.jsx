import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowBack,
  CheckCircleOutlined,
} from "@mui/icons-material";
import api from "../../config/api";

const CreateServiceForm = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data: salon } = await api.get("/api/salons/owner");
        const { data } = await api.get(`/api/categories/salon/${salon.id}`);
        setCategories(data || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || requestError.message);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      image: "",
      description: "",
      price: "",
      duration: "",
      category: "",
    },
    onSubmit: async (values) => {
      setError("");
      setSubmitting(true);
      try {
        await api.post("/api/service-offering/salon-owner", {
          ...values,
          price: Number(values.price),
          duration: Number(values.duration),
          category: Number(values.category),
        });
        navigate("/salon-dashboard/services");
      } catch (requestError) {
        setError(requestError.response?.data?.message || requestError.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 1. Back link and header */}
      <div className="flex items-center justify-between">
        <Link
          to="/salon-dashboard/services"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowBack sx={{ fontSize: 16 }} />
          <span>Back to Catalog</span>
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Add New Salon Service
        </h1>
        <p className="text-xs text-slate-500">
          Create a new service offering and make it available immediately for online customer bookings.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* 2. Main Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-8">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Service Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Service Title *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Classic Hair Cut, Deep Tissue Massage..."
              value={formik.values.name}
              onChange={formik.handleChange}
              required
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-900 transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Category *</label>
            <select
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              required
              disabled={loadingCategories}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-900 transition-colors cursor-pointer"
            >
              <option value="">Select a category for this service...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && !loadingCategories && (
              <p className="text-[11px] text-amber-700 font-semibold">
                No categories found. Please create a category first in the Categories tab.
              </p>
            )}
          </div>

          {/* Pricing and Duration in two columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Price (INR ₹) *</label>
              <input
                type="number"
                name="price"
                placeholder="e.g. 499"
                min="0"
                value={formik.values.price}
                onChange={formik.handleChange}
                required
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-900 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Duration (Minutes) *</label>
              <input
                type="number"
                name="duration"
                placeholder="e.g. 45"
                min="5"
                step="5"
                value={formik.values.duration}
                onChange={formik.handleChange}
                required
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-900 transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Description</label>
            <textarea
              name="description"
              rows="3"
              placeholder="Explain the treatment steps, benefits, products used, and what is included..."
              value={formik.values.description}
              onChange={formik.handleChange}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-900 transition-colors leading-relaxed"
            />
          </div>

          {/* Image URL with live preview */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Service Image URL</label>
            <input
              type="url"
              name="image"
              placeholder="https://images.pexels.com/..."
              value={formik.values.image}
              onChange={formik.handleChange}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-900 transition-colors"
            />
            {formik.values.image && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <img
                  src={formik.values.image}
                  alt="Preview"
                  className="w-16 h-16 rounded-lg object-cover bg-white"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <span className="text-[11px] font-semibold text-slate-500">
                  Image Preview verified
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/salon-dashboard/services")}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || !formik.values.name || !formik.values.price || !formik.values.category}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-transform active:scale-95 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <CheckCircleOutlined sx={{ fontSize: 16 }} className="text-amber-400" />
              <span>{submitting ? "Publishing Service..." : "Publish Service"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateServiceForm;
