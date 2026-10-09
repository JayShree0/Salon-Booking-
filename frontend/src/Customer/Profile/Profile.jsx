import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import api from "../../config/api";
import { authApi } from "../../api/authApi";

const Profile = () => {
  const navigate = useNavigate();

  // Core Data States
  const [user, setUser] = useState(null);
  const [salon, setSalon] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // UI States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Form Edit State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    username: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const loadProfileData = useCallback(async () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      navigate("/");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userRes = await api.get("/api/users/profile");
      const userData = userRes.data;
      setUser(userData);
      setFormData({
        fullName: userData.fullName || "",
        phone: userData.phone || "",
        email: userData.email || "",
        username: userData.username || "",
      });

      const role = userData.role || localStorage.getItem("role");

      // Load role-specific data
      if (role === "SALON_OWNER") {
        const [salonRes, bookingRes, unreadRes] = await Promise.allSettled([
          api.get("/api/salons/owner"),
          api.get("/api/bookings/salon"),
          api.get("/api/notifications/unread-count"),
        ]);

        if (salonRes.status === "fulfilled") setSalon(salonRes.value.data);
        if (bookingRes.status === "fulfilled") setBookings(bookingRes.value.data || []);
        if (unreadRes.status === "fulfilled") {
          setUnreadCount(typeof unreadRes.value.data === "number" ? unreadRes.value.data : 0);
        }
      } else {
        const [bookingRes, unreadRes] = await Promise.allSettled([
          api.get("/api/bookings/customer"),
          api.get("/api/notifications/unread-count"),
        ]);

        if (bookingRes.status === "fulfilled") setBookings(bookingRes.value.data || []);
        if (unreadRes.status === "fulfilled") {
          setUnreadCount(typeof unreadRes.value.data === "number" ? unreadRes.value.data : 0);
        }
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  // Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required.";
    }
    if (formData.phone && !/^[0-9+\s-]{7,15}$/.test(formData.phone.trim())) {
      errors.phone = "Please enter a valid phone number.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Profile Update Submission
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: user.email,
        username: user.username,
        role: user.role,
      };

      const response = await api.put(`/api/users/${user.id}`, payload);
      const updatedUser = response.data || { ...user, ...payload };

      setUser((prev) => ({ ...prev, ...updatedUser }));
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");

      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormErrors({});
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        email: user.email || "",
        username: user.username || "",
      });
    }
  };

  const handleSignOut = async () => {
    await authApi.logout();
    navigate("/");
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error && !user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-2xl shadow-sm">
          !
        </div>
        <h2 className="text-xl font-bold text-slate-900">Unable to Load Profile</h2>
        <p className="text-sm text-slate-500 max-w-md">{error}</p>
        <button
          onClick={loadProfileData}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
        >
          <RefreshIcon sx={{ fontSize: 16 }} />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  if (!user) return null;

  const role = user.role || localStorage.getItem("role") || "CUSTOMER";
  const isSalonOwner = role === "SALON_OWNER";
  const initials = (user.fullName || user.username || "U").slice(0, 2).toUpperCase();

  // Metrics
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED").length;
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED").length;
  const latestBooking = bookings[0] || null;

  // Format member join date
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Verified Member";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-[80vh] space-y-8">
      {/* Feedback Messages */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all">
          <CheckCircleOutlinedIcon sx={{ fontSize: 18 }} className="text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium flex items-center justify-between gap-3 shadow-xs"
        >
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-rose-500 hover:text-rose-700">
            <CloseOutlinedIcon sx={{ fontSize: 16 }} />
          </button>
        </div>
      )}

      {/* 1. Luxury Profile Header Card */}
      <div className="relative rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden text-left">
        {/* Decorative Top Accent Banner with Warm Ambient Glow */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-48 h-48 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Profile Identity Bar */}
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-5">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white font-extrabold text-3xl sm:text-4xl flex items-center justify-center shadow-xl shadow-amber-600/25 border-4 border-white shrink-0 select-none">
                {initials}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {user.fullName || user.username}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${
                      isSalonOwner
                        ? "bg-amber-50 text-amber-800 border-amber-300"
                        : "bg-emerald-50 text-emerald-800 border-emerald-300"
                    }`}
                  >
                    <VerifiedUserOutlinedIcon sx={{ fontSize: 13 }} />
                    <span>{isSalonOwner ? "Salon Partner" : "Client"}</span>
                  </span>
                </div>

                <p className="text-slate-500 text-xs sm:text-sm font-medium flex items-center gap-1.5 flex-wrap">
                  <span>@{user.username}</span>
                  <span className="text-slate-300">·</span>
                  <span>{user.email}</span>
                  <span className="text-slate-300">·</span>
                  <span>Joined {memberSince}</span>
                </p>
              </div>
            </div>

            {/* Edit Profile Action Button */}
            <div className="self-start sm:self-end">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <EditOutlinedIcon sx={{ fontSize: 15 }} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <CloseOutlinedIcon sx={{ fontSize: 15 }} />
                  <span>Cancel Editing</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Statistics Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-left">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            {isSalonOwner ? "Salon Bookings" : "Total Bookings"}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight block">
            {totalBookings}
          </span>
          <span className="text-[11px] text-slate-500">All-time appointments</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
            Confirmed
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight block">
            {confirmedBookings}
          </span>
          <span className="text-[11px] text-slate-500">Upcoming sessions</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">
            Completed
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-blue-700 tracking-tight block">
            {completedBookings}
          </span>
          <span className="text-[11px] text-slate-500">Successfully fulfilled</span>
        </div>

        <div
          onClick={() => navigate("/notifications")}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-400/80 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-1 group"
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block flex items-center justify-between">
            <span>Updates</span>
            <ArrowForwardIcon sx={{ fontSize: 13 }} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight block">
            {unreadCount}
          </span>
          <span className="text-[11px] text-slate-500">Unread notifications</span>
        </div>
      </div>

      {/* 3. Main Content: Personal Information & Role Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* Left Column: Personal Information (View / Edit Form) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-0.5">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {isEditing ? "Edit Personal Details" : "Personal Information"}
                </h3>
                <p className="text-xs text-slate-500">
                  {isEditing
                    ? "Update your name and primary contact number."
                    : "Your verified account credentials and identity."}
                </p>
              </div>

              <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <PersonOutlinedIcon sx={{ fontSize: 20 }} />
              </span>
            </div>

            {/* View Mode */}
            {!isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Full Name
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-slate-900 block">
                    {user.fullName || "Not provided"}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Username
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-slate-900 block">
                    @{user.username}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Email Address
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-slate-900 block truncate">
                    {user.email}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Contact Phone
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-slate-900 block">
                    {user.phone ? (
                      user.phone
                    ) : (
                      <span className="text-slate-400 italic font-normal">
                        No phone number added
                      </span>
                    )}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Account Role
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-slate-900 block">
                    {isSalonOwner ? "Salon Owner / Partner" : "Customer / Client"}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Account Status
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Verified Active</span>
                  </span>
                </div>
              </div>
            ) : (
              /* Edit Form Mode */
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all ${
                      formErrors.fullName ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {formErrors.fullName && (
                    <p className="text-xs text-rose-600 font-medium">{formErrors.fullName}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all ${
                      formErrors.phone ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                    }`}
                    placeholder="+91 98765 43210"
                  />
                  {formErrors.phone && (
                    <p className="text-xs text-rose-600 font-medium">{formErrors.phone}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Email Address (Locked)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={formData.email}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Username (Locked)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={`@${formData.username}`}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <SaveOutlinedIcon sx={{ fontSize: 16 }} />
                    <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleCancelEdit}
                    className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Role-Specific Showcase & Quick Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* A. If Salon Owner: Salon Showcase Card */}
          {isSalonOwner && salon && (
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    YOUR SALON PARTNERSHIP
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 pt-1">{salon.name}</h3>
                </div>
                <span className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <StorefrontOutlinedIcon sx={{ fontSize: 20 }} />
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-2.5">
                  <LocationOnOutlinedIcon sx={{ fontSize: 18 }} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>{[salon.address, salon.city].filter(Boolean).join(", ")}</span>
                </div>

                {salon.openTime && salon.closeTime && (
                  <div className="flex items-center gap-2.5">
                    <AccessTimeOutlinedIcon sx={{ fontSize: 18 }} className="text-slate-400 shrink-0" />
                    <span>
                      Operating Hours: {String(salon.openTime).slice(0, 5)} - {String(salon.closeTime).slice(0, 5)}
                    </span>
                  </div>
                )}

                {salon.phoneNumber && (
                  <div className="flex items-center gap-2.5">
                    <PhoneOutlinedIcon sx={{ fontSize: 18 }} className="text-slate-400 shrink-0" />
                    <span>Business Line: {salon.phoneNumber}</span>
                  </div>
                )}
              </div>

              {/* Direct Link to Salon Dashboard */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/salon-dashboard")}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <DashboardOutlinedIcon sx={{ fontSize: 16 }} />
                  <span>Open Salon Management Dashboard</span>
                </button>
              </div>
            </div>
          )}

          {/* B. If Customer: Recent Appointment Activity Card */}
          {!isSalonOwner && (
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    APPOINTMENT OVERVIEW
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 pt-1">Recent Booking</h3>
                </div>

                <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <CalendarMonthOutlinedIcon sx={{ fontSize: 20 }} />
                </span>
              </div>

              {latestBooking ? (
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      #BKG-{latestBooking.id}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        latestBooking.status === "CONFIRMED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {latestBooking.status}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-slate-900">
                    {latestBooking.salon?.name || `Salon #${latestBooking.salonId}`}
                  </p>

                  {latestBooking.startTime && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <AccessTimeOutlinedIcon sx={{ fontSize: 14 }} className="text-amber-600" />
                      <span>
                        {new Date(latestBooking.startTime).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 flex justify-between items-center text-xs">
                    <span className="text-slate-500">Total: ₹{latestBooking.totalPrice}</span>
                    <button
                      onClick={() => navigate("/bookings")}
                      className="text-amber-600 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>View Bookings</span>
                      <ArrowForwardIcon sx={{ fontSize: 13 }} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center space-y-2">
                  <p className="text-xs text-slate-500">No appointments scheduled yet.</p>
                  <button
                    onClick={() => navigate("/explore")}
                    className="text-xs font-bold text-amber-600 hover:underline cursor-pointer"
                  >
                    Explore verified salons →
                  </button>
                </div>
              )}

              {/* View Full Booking History CTA */}
              <button
                type="button"
                onClick={() => navigate("/bookings")}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-800 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
              >
                <CalendarMonthOutlinedIcon sx={{ fontSize: 16 }} className="text-amber-600" />
                <span>View All Appointments ({totalBookings})</span>
              </button>
            </div>
          )}

          {/* C. Account Security & Session Management Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Account Security & Session
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600 font-medium">Authentication</span>
                <span className="text-emerald-700 font-bold text-xs bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Spring Security JWT Protected
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600 font-medium">Session Token</span>
                <span className="text-slate-400 font-mono text-[11px]">Active JWT</span>
              </div>
            </div>

            {/* Logout Confirmation Prompt */}
            <div className="pt-3 border-t border-slate-100">
              {!showLogoutConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                >
                  <LogoutOutlinedIcon sx={{ fontSize: 16 }} />
                  <span>Sign Out of Account</span>
                </button>
              ) : (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-2 text-center">
                  <p className="text-xs text-rose-800 font-bold">
                    Are you sure you want to sign out?
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Yes, Sign Out
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLogoutConfirm(false)}
                      className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Stay Signed In
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton Loader matching the luxury Profile aesthetic.
 */
const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
    {/* Header Skeleton */}
    <div className="rounded-3xl bg-white border border-slate-100 p-6 sm:p-8 space-y-4">
      <div className="flex items-end gap-5">
        <Skeleton variant="rounded" width={96} height={96} className="rounded-2xl" />
        <div className="space-y-2 w-1/2">
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="80%" height={20} />
        </div>
      </div>
    </div>

    {/* Metric Cards Skeleton */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-5 rounded-2xl bg-white border border-slate-100 space-y-2">
          <Skeleton variant="text" width="50%" height={16} />
          <Skeleton variant="text" width="70%" height={36} />
        </div>
      ))}
    </div>

    {/* Two-Column Content Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-100 space-y-4">
        <Skeleton variant="text" width="40%" height={28} />
        <div className="grid grid-cols-2 gap-4 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1">
              <Skeleton variant="text" width="40%" height={16} />
              <Skeleton variant="text" width="80%" height={24} />
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-100 space-y-4">
        <Skeleton variant="text" width="50%" height={28} />
        <Skeleton variant="rounded" width="100%" height={120} className="rounded-2xl" />
      </div>
    </div>
  </div>
);

export default Profile;
