import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  CategoryOutlined,
} from "@mui/icons-material";
import api from "../../config/api";

export default function CategoryTables() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCategories = async () => {
    try {
      const { data: salon } = await api.get("/api/salons/owner");
      const { data } = await api.get(`/api/categories/salon/${salon.id}`);
      setCategories(data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const deleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category? Services under it might be affected.")) return;
    setDeletingId(categoryId);
    setError("");
    try {
      await api.delete(`/api/categories/salon-owner/${categoryId}`);
      setCategories((current) => current.filter((category) => category.id !== categoryId));
      setSuccess("Category removed successfully.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-44 bg-white rounded-2xl border border-slate-200 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          {success}
        </div>
      )}

      {categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <CategoryOutlined sx={{ fontSize: 44 }} className="text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No categories found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create categories to organize your treatments and services for customers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const isDeleting = deletingId === category.id;
            return (
              <div
                key={category.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400/60 shadow-2xs hover:shadow-sm transition-all p-4 flex flex-col justify-between space-y-3 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80">
                    <img
                      src={
                        category.image ||
                        "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=300"
                      }
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=300";
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-[10px] font-bold text-slate-400">
                      #CAT-{category.id}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                      {category.name}
                    </h3>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Salon Category
                  </span>

                  <button
                    onClick={() => deleteCategory(category.id)}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <DeleteOutlined sx={{ fontSize: 14 }} />
                    <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
