import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CurrencyRupee,
  CalendarTodayOutlined,
  CancelOutlined,
  SavingsOutlined,
  AddCircleOutlineOutlined,
  StorefrontOutlined,
  ArrowForward,
  TrendingUpOutlined,
  PeopleAltOutlined,
  Inventory2Outlined,
} from "@mui/icons-material";
import api from "../../config/api";

const HomePage = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [salon, setSalon] = useState(null);
  const [servicesCount, setServicesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.allSettled([
      api.get("/api/bookings/report"),
      api.get("/api/bookings/salon"),
      api.get("/api/salons/owner"),
      api.get("/api/service-offering/salon-owner"),
    ])
      .then(([reportRes, bookingRes, salonRes, servicesRes]) => {
        if (reportRes.status === "fulfilled") setReport(reportRes.value.data);
        if (bookingRes.status === "fulfilled") setBookings(bookingRes.value.data || []);
        if (salonRes.status === "fulfilled") setSalon(salonRes.value.data);
        if (servicesRes.status === "fulfilled") setServicesCount(servicesRes.value.data?.length || 0);
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-28 bg-white rounded-2xl border border-slate-200 p-6 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
        <div className="h-72 bg-white rounded-2xl border border-slate-200 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Hero Banner with Quick Actions */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-bold tracking-wide uppercase">
              <StorefrontOutlined sx={{ fontSize: 14 }} />
              <span>Salon Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {salon?.name || "Welcome Back, Owner"}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              {salon
                ? `${salon.address || "Your Salon"}, ${salon.city || "India"} · Open ${salon.openTime || "09:00"} - ${salon.closeTime || "21:00"}`
                : "Manage your bookings, catalog, and salon operations from one place."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("/salon-dashboard/add-services")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-transform active:scale-95 shadow-sm cursor-pointer"
            >
              <AddCircleOutlineOutlined sx={{ fontSize: 16 }} />
              <span>Add Service</span>
            </button>

            <button
              onClick={() => navigate("/salon-dashboard/account")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/10 cursor-pointer"
            >
              <StorefrontOutlined sx={{ fontSize: 16 }} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* 2. Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Earnings */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-sm transition-all flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Earnings
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{Number(report?.totalEarnings || 0).toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <TrendingUpOutlined sx={{ fontSize: 14 }} />
              <span>Active Revenue</span>
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <CurrencyRupee sx={{ fontSize: 22 }} />
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-sm transition-all flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Bookings
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">
              {report?.totalBookings ?? bookings.length}
            </p>
            <p className="text-[11px] font-semibold text-slate-500">All customer appointments</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <CalendarTodayOutlined sx={{ fontSize: 20 }} />
          </div>
        </div>

        {/* Live Catalog Services */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-sm transition-all flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Live Services
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">
              {servicesCount}
            </p>
            <p className="text-[11px] font-semibold text-slate-500">Active offerings in catalog</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
            <Inventory2Outlined sx={{ fontSize: 22 }} />
          </div>
        </div>

        {/* Cancelled Bookings */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-sm transition-all flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Cancellations
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">
              {report?.cancelledBookings ?? 0}
            </p>
            <p className="text-[11px] font-semibold text-rose-600">
              ₹{Number(report?.totalRefunds || 0).toLocaleString("en-IN")} refunds issued
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
            <CancelOutlined sx={{ fontSize: 22 }} />
          </div>
        </div>
      </div>

      {/* 3. Recent Bookings Table Preview */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Recent Appointments</h2>
            <p className="text-xs text-slate-500">Latest reservations made by customers</p>
          </div>
          <Link
            to="/salon-dashboard/bookings"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline"
          >
            <span>View All Bookings</span>
            <ArrowForward sx={{ fontSize: 14 }} />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <CalendarTodayOutlined sx={{ fontSize: 40 }} className="text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No bookings recorded yet</p>
            <p className="text-xs text-slate-400">Customer appointments will appear here as soon as they book.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      #BKG-{booking.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {booking.startTime
                      ? new Date(booking.startTime).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "Time not set"}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-900">
                      ₹{Number(booking.totalPrice || 0).toLocaleString("en-IN")}
                    </span>
                    <p className="text-[11px] text-slate-400">
                      {booking.serviceIds?.length || 1} service(s)
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/salon-dashboard/bookings")}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;