import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AddCircleOutlineOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  Inventory2Outlined,
  AccessTimeOutlined,
  Close,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import api from "../../config/api";

export default function ServiceTables() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [salonId, setSalonId] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    categoryId: "",
    image: "",
  });
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      const [serviceRes, salonRes] = await Promise.all([
        api.get("/api/service-offering/salon-owner"),
        api.get("/api/salons/owner"),
      ]);
      setServices(serviceRes.data || []);
      setSalonId(salonRes.data.id);

      const catRes = await api.get(`/api/categories/salon/${salonRes.data.id}`);
      setCategories(catRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openEditor = (service) => {
    setEditingService(service);
    setForm({
      name: service.name || "",
      description: service.description || "",
      price: service.price ?? "",
      duration: service.duration ?? "",
      categoryId: service.categoryId ?? "",
      image: service.image || "",
    });
    setError("");
    setSuccess("");
  };

  const saveService = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        duration: Number(form.duration),
        categoryId: Number(form.categoryId),
        salonId,
      };
      const { data } = await api.put(
        `/api/service-offering/salon-owner/${editingService.id}`,
        payload
      );
      setServices((current) =>
        current.map((s) => (s.id === data.id ? data : s))
      );
      setEditingService(null);
      setSuccess("Service updated successfully.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service? This cannot be undone.")) return;
    setDeletingId(serviceId);
    setError("");
    try {
      await api.delete(`/api/service-offering/salon-owner/${serviceId}`);
      setServices((current) => current.filter((s) => s.id !== serviceId));
      setSuccess("Service deleted successfully.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Filter services by search term and selected category
  const filteredServices = services.filter((s) => {
    const matchesSearch =
      (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.description || "").toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === "ALL" || Number(s.categoryId) === Number(selectedCategory);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header with Breadcrumb, Title & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Services Catalog
          </h1>
          <p className="text-xs text-slate-500">
            Manage your salon treatments, durations, pricing, and descriptions ({services.length} total)
          </p>
        </div>

        <Link
          to="/salon-dashboard/add-services"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-transform active:scale-95 shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <AddCircleOutlineOutlined sx={{ fontSize: 16 }} className="text-amber-400" />
          <span>Add New Service</span>
        </Link>
      </div>

      {/* Notifications / Alerts */}
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

      {/* 2. Search & Category Filters Bar */}
      <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between sticky top-0 z-10">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <SearchOutlined
            sx={{ fontSize: 18 }}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search service name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-800 transition-colors"
          />
        </div>

        {/* Category Filter Pills / Dropdown */}
        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-500 text-slate-800 font-semibold cursor-pointer"
          >
            <option value="ALL">All Categories ({services.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Services Data Cards / Responsive Table */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Inventory2Outlined sx={{ fontSize: 44 }} className="text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No services match your criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, selecting another category, or add a new service to your catalog.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => {
            const categoryObj = categories.find((c) => c.id === service.categoryId);
            const isDeleting = deletingId === service.id;

            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400/60 shadow-2xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between space-y-4 group"
              >
                {/* Header: Image & Badges */}
                <div className="space-y-3">
                  <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                    <img
                      src={
                        service.image ||
                        "https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=800"
                      }
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=800";
                      }}
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-950/80 backdrop-blur-md text-amber-300 border border-white/10 shadow-xs">
                      {categoryObj?.name || "General"}
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-white/95 text-slate-900 shadow-sm border border-slate-200/80">
                      ₹{service.price}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-1">
                      {service.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {service.description || "No description provided."}
                    </p>
                  </div>
                </div>

                {/* Footer: Metadata & Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                    <AccessTimeOutlined sx={{ fontSize: 14 }} className="text-slate-400" />
                    <span>{service.duration} mins</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditor(service)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      <EditOutlined sx={{ fontSize: 13 }} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => deleteService(service.id)}
                      disabled={isDeleting}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <DeleteOutlined sx={{ fontSize: 14 }} />
                      <span>{isDeleting ? "..." : "Delete"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Edit Service Modal Dialog */}
      <Dialog
        open={Boolean(editingService)}
        onClose={() => setEditingService(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "20px",
            p: 1,
            border: "1px solid #e2e8f0",
          },
        }}
      >
        <DialogTitle className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Edit Service</h3>
            <p className="text-xs text-slate-500">Update pricing, duration, or details</p>
          </div>
          <button
            onClick={() => setEditingService(null)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <Close sx={{ fontSize: 18 }} />
          </button>
        </DialogTitle>

        <DialogContent className="space-y-4 pt-4">
          <TextField
            fullWidth
            label="Service Title"
            size="small"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <TextField
            fullWidth
            select
            label="Service Category"
            size="small"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            required
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <div className="grid grid-cols-2 gap-3">
            <TextField
              fullWidth
              type="number"
              label="Price (INR ₹)"
              size="small"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <TextField
              fullWidth
              type="number"
              label="Duration (minutes)"
              size="small"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              required
            />
          </div>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            size="small"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <TextField
            fullWidth
            label="Image URL"
            size="small"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="https://..."
          />
        </DialogContent>

        <DialogActions className="border-t border-slate-100 pt-3 px-6 pb-4">
          <Button
            onClick={() => setEditingService(null)}
            sx={{ textTransform: "none", color: "#64748b", fontWeight: 700 }}
          >
            Cancel
          </Button>
          <Button
            onClick={saveService}
            variant="contained"
            disabled={saving || !form.name || !form.price || !form.duration}
            sx={{
              textTransform: "none",
              bgcolor: "#0f172a",
              "&:hover": { bgcolor: "#1e293b" },
              borderRadius: "12px",
              px: 3,
              fontWeight: 700,
            }}
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}