import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

// High-resolution fallback image matching SalonCard
const FALLBACK_SALON_IMAGE =
  "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800";

/**
 * Returns color classes and label for the booking status pill badge.
 */
const getStatusConfig = (status) => {
  switch (status?.toUpperCase()) {
    case "CONFIRMED":
      return {
        label: "Confirmed",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-300/80",
        dotClass: "bg-emerald-500",
      };
    case "PENDING":
      return {
        label: "Pending",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-300/80",
        dotClass: "bg-amber-500 animate-pulse",
      };
    case "COMPLETED":
      return {
        label: "Completed",
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
        dotClass: "bg-blue-500",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
        dotClass: "bg-rose-500",
      };
    case "REJECTED":
      return {
        label: "Rejected",
        badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
        dotClass: "bg-slate-400",
      };
    default:
      return {
        label: status || "Booked",
        badgeClass: "bg-slate-50 text-slate-700 border-slate-200",
        dotClass: "bg-slate-400",
      };
  }
};

/**
 * Redesigned BookingCard component matching the luxury salon website design system.
 */
const BookingCard = ({ booking, onCancel }) => {
  const navigate = useNavigate();
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  if (!booking) return null;

  // Extract salon details
  const salon = booking.salon || {};
  const salonName = salon.name || (booking.salonId ? `Salon #${booking.salonId}` : "Luxury Salon");
  const salonImage = salon.images?.[0] || FALLBACK_SALON_IMAGE;
  const salonLocation = [salon.address, salon.city].filter(Boolean).join(", ") || "Neighborhood Studio";

  // Date and Time parsing
  const startTime = booking.startTime ? new Date(booking.startTime) : null;
  const endTime = booking.endTime ? new Date(booking.endTime) : null;

  const formattedDate = startTime && !isNaN(startTime.getTime())
    ? startTime.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Date not available";

  const formatTimeStr = (dateObj) =>
    dateObj && !isNaN(dateObj.getTime())
      ? dateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
      : "";

  const formattedTime = startTime
    ? endTime
      ? `${formatTimeStr(startTime)} - ${formatTimeStr(endTime)}`
      : formatTimeStr(startTime)
    : "Time not available";

  // Calculate total duration in minutes
  const durationMinutes =
    startTime && endTime && !isNaN(startTime.getTime()) && !isNaN(endTime.getTime())
      ? Math.max(0, Math.round((endTime.getTime() - startTime.getTime()) / 60000))
      : (booking.services || []).reduce((sum, s) => sum + (Number(s.duration) || 0), 0);

  // Status configuration
  const statusConfig = getStatusConfig(booking.status);
  const canCancel = !["CANCELLED", "COMPLETED", "REJECTED"].includes(booking.status?.toUpperCase());

  // Services list
  const services = booking.services || [];

  // Handlers
  const handleNavigateSalon = () => {
    if (booking.salonId || salon.id) {
      navigate(`/salon/${booking.salonId || salon.id}`);
    }
  };

  const handleConfirmCancel = async () => {
    if (!onCancel) return;
    setIsCancelling(true);
    try {
      await onCancel(booking.id);
    } finally {
      setIsCancelling(false);
      setConfirmingCancel(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400/60 shadow-xs hover:shadow-lg transition-all duration-300 p-5 sm:p-6 text-left">
      {/* 1. Header Row: Salon Thumbnail, Name, Status Badge & Price */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
        {/* Salon Info Left */}
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/70 shrink-0 shadow-2xs">
            <img
              src={salonImage}
              alt={salonName}
              onError={(e) => {
                e.currentTarget.src = FALLBACK_SALON_IMAGE;
              }}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-slate-400 tracking-wider">
                #BKG-{booking.id}
              </span>
            </div>

            <h3
              onClick={handleNavigateSalon}
              className="font-bold text-base sm:text-lg text-slate-900 hover:text-amber-600 transition-colors cursor-pointer truncate"
              title={salonName}
            >
              {salonName}
            </h3>

            <div className="flex items-center gap-1 text-slate-500 text-xs">
              <LocationOnOutlinedIcon sx={{ fontSize: 14 }} className="text-amber-600 shrink-0" />
              <span className="truncate">{salonLocation}</span>
            </div>
          </div>
        </div>

        {/* Status Badge & Price Right */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs ${statusConfig.badgeClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
            <span>{statusConfig.label}</span>
          </span>

          <div className="text-right">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Amount
            </span>
            <span className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              ₹{Number(booking.totalPrice || 0).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Middle Section: Appointment Schedule (Date, Time, Duration) */}
      <div className="my-4 p-3.5 sm:p-4 rounded-xl bg-slate-50/80 border border-slate-100/90 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Date Box */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <CalendarTodayOutlinedIcon sx={{ fontSize: 18 }} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Appointment Date
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate block">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Time Slot Box */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <AccessTimeOutlinedIcon sx={{ fontSize: 18 }} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Time Slot
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate block">
              {formattedTime} {durationMinutes > 0 ? `(${durationMinutes} mins)` : ""}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Booked Services List */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ContentCutOutlinedIcon sx={{ fontSize: 14 }} className="text-amber-600" />
            <span>Booked Services ({services.length})</span>
          </span>
        </div>

        {services.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {services.map((service) => (
              <div
                key={service.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200/90 text-slate-800 text-xs font-medium shadow-2xs hover:border-amber-300 transition-colors"
              >
                <span className="font-semibold text-slate-900">{service.name}</span>
                {service.duration ? (
                  <span className="text-[11px] text-slate-400">· {service.duration}m</span>
                ) : null}
                {service.price ? (
                  <span className="text-xs font-bold text-amber-600">₹{service.price}</span>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No specific service details recorded.</p>
        )}
      </div>

      {/* 4. Action Row: View Salon & Cancel Booking */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
        {/* View Salon Link */}
        <button
          type="button"
          onClick={handleNavigateSalon}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer group/link self-start"
        >
          <span>View Salon & Menu</span>
          <ArrowForwardIcon
            sx={{ fontSize: 14 }}
            className="transform group-hover/link:translate-x-1 transition-transform"
          />
        </button>

        {/* Cancellation or Status Actions */}
        {canCancel ? (
          confirmingCancel ? (
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-slate-600 font-medium">Confirm cancellation?</span>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleConfirmCancel}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => setConfirmingCancel(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                No, Keep
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingCancel(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer self-end sm:self-auto"
            >
              <CancelOutlinedIcon sx={{ fontSize: 14 }} />
              <span>Cancel Booking</span>
            </button>
          )
        ) : (
          <div className="self-end sm:self-auto">
            {booking.status === "COMPLETED" ? (
              <button
                type="button"
                onClick={handleNavigateSalon}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition-all duration-200 cursor-pointer"
              >
                <span>Book Again</span>
              </button>
            ) : (
              <span className="text-xs text-slate-400 font-medium italic">
                {booking.status === "CANCELLED" ? "Appointment was cancelled" : booking.status}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Skeleton loading state for BookingCard matching the site's skeleton designs.
 */
export const BookingCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 space-y-4">
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3 w-3/4">
        <Skeleton variant="rounded" width={70} height={70} className="rounded-xl shrink-0" />
        <div className="space-y-1.5 w-full">
          <Skeleton variant="text" width="30%" height={16} />
          <Skeleton variant="text" width="70%" height={24} />
          <Skeleton variant="text" width="50%" height={16} />
        </div>
      </div>
      <div className="space-y-2 text-right">
        <Skeleton variant="rounded" width={80} height={24} className="rounded-full" />
        <Skeleton variant="text" width={60} height={24} />
      </div>
    </div>

    <Skeleton variant="rounded" width="100%" height={64} className="rounded-xl" />

    <div className="flex gap-2">
      <Skeleton variant="rounded" width={100} height={30} className="rounded-lg" />
      <Skeleton variant="rounded" width={120} height={30} className="rounded-lg" />
    </div>

    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
      <Skeleton variant="text" width={120} height={20} />
      <Skeleton variant="rounded" width={100} height={32} className="rounded-full" />
    </div>
  </div>
);

export default BookingCard;
