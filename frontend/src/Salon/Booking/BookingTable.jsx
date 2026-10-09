import React, { useEffect, useState } from "react";
import {
  CalendarTodayOutlined,
  SearchOutlined,
  CancelOutlined,
  DoneAllOutlined,
  AccessTimeOutlined,
  PersonOutlined,
  PhoneOutlined,
  EmailOutlined,
  CurrencyRupee,
} from "@mui/icons-material";
import api from "../../config/api";

export default function BookingTables() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadBookings = async () => {
    try {
      const { data } = await api.get("/api/bookings/salon");
      const details = await Promise.all(
        (data || []).map(async (booking) => {
          const [customerResult, ...serviceResults] = await Promise.allSettled([
            api.get(`/api/users/${booking.customerId}`),
            ...(booking.serviceIds || []).map((serviceId) =>
              api.get(`/api/service-offering/${serviceId}`)
            ),
          ]);

          return {
            ...booking,
            customer:
              customerResult.status === "fulfilled"
                ? customerResult.value.data
                : null,
            services: serviceResults
              .filter((result) => result.status === "fulfilled")
              .map((result) => result.value.data),
          };
        })
      );
      setBookings(details);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const updateStatus = async (bookingId, status) => {
    setUpdatingId(bookingId);
    setError("");
    try {
      const { data } = await api.put(
        `/api/bookings/${bookingId}/status`,
        null,
        { params: { status } }
      );
      setBookings((current) =>
        current.map((b) => (b.id === bookingId ? { ...b, ...data } : b))
      );
      setSuccess(`Booking #BKG-${bookingId} status updated to ${status}.`);
      setTimeout(() => setSuccess(""), 4000);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return "bg-emerald-50 text-emerald-700 border-emerald-300";
      case "COMPLETED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-300";
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const customerName = b.customer?.fullName || "";
    const customerEmail = b.customer?.email || "";
    const idStr = String(b.id);
    const matchesSearch =
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      idStr.includes(search);
    const matchesStatus =
      statusFilter === "ALL" || b.status?.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header with Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Bookings & Appointments
          </h1>
          <p className="text-xs text-slate-500">
            Real-time appointment schedule, customer details, and status controls ({bookings.length} total)
          </p>
        </div>
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

      {/* 2. Search & Status Filter Bar */}
      <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between sticky top-0 z-10">
        <div className="relative w-full sm:w-80">
          <SearchOutlined
            sx={{ fontSize: 18 }}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search booking ID, customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-800 transition-colors"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-500 text-slate-800 font-semibold cursor-pointer"
          >
            <option value="ALL">All Statuses ({bookings.length})</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* 3. Bookings List / Data View */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <CalendarTodayOutlined sx={{ fontSize: 44 }} className="text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No appointments found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Bookings will automatically appear here once customers schedule salon treatments online.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((b) => {
            const isUpdating = updatingId === b.id;
            const startTimeStr = b.startTime
              ? new Date(b.startTime).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "Date unrecorded";

            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400/60 shadow-2xs hover:shadow-xs transition-all p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left: ID, Status, Customer & Services */}
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      #BKG-{b.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${getStatusBadge(
                        b.status
                      )}`}
                    >
                      {b.status}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <AccessTimeOutlined sx={{ fontSize: 14 }} className="text-slate-400" />
                      <span>{startTimeStr}</span>
                    </span>
                  </div>

                  {/* Customer info */}
                  <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <PersonOutlined sx={{ fontSize: 15 }} className="text-amber-600" />
                      <span>{b.customer?.fullName || `Customer #${b.customerId}`}</span>
                    </span>
                    {b.customer?.email && (
                      <span className="text-slate-500 flex items-center gap-1">
                        <EmailOutlined sx={{ fontSize: 13 }} />
                        <span>{b.customer.email}</span>
                      </span>
                    )}
                    {b.customer?.phone && (
                      <span className="text-slate-500 flex items-center gap-1">
                        <PhoneOutlined sx={{ fontSize: 13 }} />
                        <span>{b.customer.phone}</span>
                      </span>
                    )}
                  </div>

                  {/* Services requested */}
                  <div className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Services: </span>
                    <span>
                      {b.services?.length
                        ? b.services.map((s) => s.name).join(", ")
                        : `${b.serviceIds?.length || 0} service(s)`}
                    </span>
                  </div>
                </div>

                {/* Right: Price & Status Actions */}
                <div className="flex items-center justify-between lg:justify-end gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                  <div className="text-left lg:text-right">
                    <p className="text-xs text-slate-400 font-semibold uppercase">Total Price</p>
                    <p className="text-lg font-black text-slate-900">
                      ₹{Number(b.totalPrice || 0).toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Actions based on current status */}
                  <div className="flex items-center gap-2">
                    {b.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => updateStatus(b.id, "CONFIRMED")}
                          disabled={isUpdating}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateStatus(b.id, "CANCELLED")}
                          disabled={isUpdating}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {b.status === "CONFIRMED" && (
                      <button
                        onClick={() => updateStatus(b.id, "COMPLETED")}
                        disabled={isUpdating}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Mark Completed
                      </button>
                    )}

                    {!["PENDING", "CONFIRMED"].includes(b.status) && (
                      <span className="text-xs font-bold text-slate-400 px-2 py-1">
                        Archived
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
