import { useFormik } from "formik";
import React, { useState } from "react";
import { CheckCircleOutlineOutlined } from "@mui/icons-material";
import api from "../../config/api";

const CategoryForm = ({ onCreated }) => {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: { name: "", image: "" },
    onSubmit: async (values) => {
      setError("");
      setSubmitting(true);
      try {
        await api.post("/api/categories/salon-owner", values);
        formik.resetForm();
        onCreated?.();
      } catch (requestError) {
        setError(requestError.response?.data?.message || requestError.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-8">
      <div className="mb-6 space-y-1">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Create New Category
        </h2>
        <p className="text-xs text-slate-500">
          Organize your salon services (e.g. Hair Care, Facials, Grooming)
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Category Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="e.g. Hair Treatments, Luxury Spa..."
            value={formik.values.name}
            onChange={formik.handleChange}
            required
            className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-900 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Category Cover Image URL</label>
          <input
            type="url"
            id="image"
            name="image"
            placeholder="https://images.pexels.com/..."
            value={formik.values.image}
            onChange={formik.handleChange}
            className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-900 transition-colors"
          />

          {formik.values.image && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 mt-2">
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

        <button
          type="submit"
          disabled={submitting || !formik.values.name.trim()}
          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-transform active:scale-95 shadow-sm cursor-pointer disabled:opacity-50 mt-4"
        >
          <CheckCircleOutlineOutlined sx={{ fontSize: 16 }} className="text-amber-400" />
          <span>{submitting ? "Creating Category..." : "Create Category"}</span>
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;
