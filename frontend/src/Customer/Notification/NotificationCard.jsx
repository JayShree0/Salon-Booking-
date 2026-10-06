import React from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

/**
 * Helper to compute human-friendly relative time (e.g., "5m ago", "2h ago", "Oct 6").
 */
const formatTimeAgo = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

/**
 * Returns type-specific styling, icon, and formatted title for a notification.
 */
const getNotificationTypeConfig = (type, description = "", status = "") => {
  const normalizedType = String(type || "").toUpperCase();
  const normalizedDesc = String(description || "").toUpperCase();
  const normalizedStatus = String(status || "").toUpperCase();

  if (normalizedType.includes("PAYMENT") || normalizedDesc.includes("PAYMENT")) {
    return {
      label: "Payment",
      icon: <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 18 }} />,
      iconBoxClass: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
      pillClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    };
  }

  if (
    normalizedType.includes("CANCEL") ||
    normalizedDesc.includes("CANCEL") ||
    normalizedStatus === "CANCELLED"
  ) {
    return {
      label: "Cancelled",
      icon: <CancelOutlinedIcon sx={{ fontSize: 18 }} />,
      iconBoxClass: "bg-rose-500/10 text-rose-600 border border-rose-500/20",
      pillClass: "bg-rose-50 text-rose-700 border-rose-200/80",
    };
  }

  if (
    normalizedType.includes("CONFIRM") ||
    normalizedDesc.includes("CONFIRM") ||
    normalizedStatus === "CONFIRMED"
  ) {
    return {
      label: "Confirmed",
      icon: <CheckCircleOutlinedIcon sx={{ fontSize: 18 }} />,
      iconBoxClass: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
      pillClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    };
  }

  if (normalizedType.includes("BOOKING") || normalizedDesc.includes("BOOKING")) {
    return {
      label: "Booking",
      icon: <CalendarMonthOutlinedIcon sx={{ fontSize: 18 }} />,
      iconBoxClass: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
      pillClass: "bg-amber-50 text-amber-700 border-amber-300/80",
    };
  }

  return {
    label: "Notice",
    icon: <NotificationsActiveOutlinedIcon sx={{ fontSize: 18 }} />,
    iconBoxClass: "bg-slate-500/10 text-slate-700 border border-slate-300/40",
    pillClass: "bg-slate-100 text-slate-700 border-slate-200",
  };
};

/**
 * Luxury NotificationCard matching the website's amber & slate design system.
 */
const NotificationCard = ({ notification, onRead }) => {
  const navigate = useNavigate();
  if (!notification) return null;

  const isRead = Boolean(notification.isRead);
  const booking = notification.booking;
  const timeAgo = formatTimeAgo(notification.createdAt);

  const typeConfig = getNotificationTypeConfig(
    notification.type,
    notification.description,
    booking?.status
  );

  // Determine user role for routing
  const role = localStorage.getItem("role");
  const isSalonOwner = role === "SALON_OWNER";

  const handleViewTarget = () => {
    if (booking || notification.bookingId) {
      if (isSalonOwner) {
        navigate("/salon-dashboard/bookings");
      } else {
        navigate("/bookings");
      }
    } else if (notification.salonId) {
      navigate(`/salon/${notification.salonId}`);
    }
  };

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-300 p-4 sm:p-5 text-left flex flex-col justify-between gap-3 ${
        isRead
          ? "bg-white border-slate-200/80 hover:border-amber-400/60 shadow-2xs hover:shadow-md"
          : "bg-amber-50/25 border-amber-300/80 hover:border-amber-400 shadow-xs hover:shadow-lg"
      }`}
    >
      {/* Top Content Row */}
      <div className="flex items-start gap-3.5 sm:gap-4">
        {/* Context-Specific Icon Box */}
        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs transition-transform duration-300 group-hover:scale-105 ${typeConfig.iconBoxClass}`}
        >
          {typeConfig.icon}
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* Header Line: Category Pill, Title, Unread Indicator & Timestamp */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${typeConfig.pillClass}`}
              >
                {typeConfig.label}
              </span>

              <h4
                className={`text-sm sm:text-base leading-snug truncate ${
                  isRead ? "font-semibold text-slate-800" : "font-extrabold text-slate-900"
                }`}
              >
                {notification.type || "Booking Notification"}
              </h4>

              {/* Pulsing Unread Indicator Dot */}
              {!isRead && (
                <span className="relative flex h-2 w-2 shrink-0" title="Unread notification">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
              )}
            </div>

            {timeAgo && (
              <span className="text-[11px] font-medium text-slate-400 shrink-0">
                {timeAgo}
              </span>
            )}
          </div>

          {/* Message Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {notification.description}
          </p>

          {/* Booking Summary Pill (if booking object exists) */}
          {booking && (
            <div className="pt-1.5 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1 text-slate-700 text-xs font-medium">
                <AccessTimeOutlinedIcon sx={{ fontSize: 13 }} className="text-amber-600" />
                <span>
                  Booking #{booking.id || notification.bookingId} ·{" "}
                  <strong className="text-slate-900">{booking.status}</strong>
                  {booking.startTime && (
                    <span className="text-slate-500 ml-1">
                      (
                      {new Date(booking.startTime).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                      )
                    </span>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions Row */}
      <div className="flex items-center justify-between gap-3 pt-2 sm:pt-3 border-t border-slate-100">
        {/* Navigation Action */}
        {(booking || notification.bookingId || notification.salonId) ? (
          <button
            type="button"
            onClick={handleViewTarget}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer group/link"
          >
            <span>{isSalonOwner ? "View in Dashboard" : "View Appointment Details"}</span>
            <ArrowForwardIcon
              sx={{ fontSize: 13 }}
              className="transform group-hover/link:translate-x-0.5 transition-transform"
            />
          </button>
        ) : (
          <span className="text-[11px] text-slate-400">SalonBook Automated Alert</span>
        )}

        {/* Mark As Read Button */}
        {!isRead && onRead && (
          <button
            type="button"
            onClick={() => onRead(notification)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 shrink-0"
          >
            <DoneOutlinedIcon sx={{ fontSize: 13 }} />
            <span>Mark read</span>
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Skeleton Loader for NotificationCard matching the website's luxury styling.
 */
export const NotificationCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 space-y-3">
    <div className="flex items-start gap-3.5">
      <Skeleton variant="rounded" width={44} height={44} className="rounded-xl shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="flex justify-between items-center">
          <Skeleton variant="text" width="30%" height={20} />
          <Skeleton variant="text" width="15%" height={16} />
        </div>
        <Skeleton variant="text" width="85%" height={18} />
        <Skeleton variant="text" width="60%" height={16} />
      </div>
    </div>
    <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
      <Skeleton variant="text" width={100} height={16} />
      <Skeleton variant="rounded" width={80} height={24} className="rounded-full" />
    </div>
  </div>
);

export default NotificationCard;
