import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RefreshIcon from "@mui/icons-material/Refresh";
import NotificationCard, { NotificationCardSkeleton } from "./NotificationCard";
import EmptyState from "../../components/common/EmptyState";
import api from "../../config/api";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // 'all' | 'unread' | 'bookings' | 'payments'
  const [markingAll, setMarkingAll] = useState(false);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let url;
      if (localStorage.getItem("role") === "SALON_OWNER") {
        const { data: salon } = await api.get("/api/salons/owner");
        url = `/api/notifications/salon-owner/salon/${salon.id}`;
      } else {
        const { data: user } = await api.get("/api/users/profile");
        url = `/api/notifications/user/${user.id}`;
      }

      const { data } = await api.get(url);
      setNotifications(data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAsRead = async (notification) => {
    try {
      const { data } = await api.put(`/api/notifications/${notification.id}/read`);
      setNotifications((current) =>
        current.map((item) => (item.id === notification.id ? { ...item, isRead: true, ...data } : item))
      );
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.isRead);
    if (unreadNotifications.length === 0) return;

    setMarkingAll(true);
    try {
      await Promise.allSettled(
        unreadNotifications.map((item) =>
          api.put(`/api/notifications/${item.id}/read`)
        )
      );
      setNotifications((current) =>
        current.map((item) => ({ ...item, isRead: true }))
      );
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    } finally {
      setMarkingAll(false);
    }
  };

  // Counts for filter pills
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const bookingCount = notifications.filter((n) => {
    const t = String(n.type || "").toUpperCase();
    const d = String(n.description || "").toUpperCase();
    return t.includes("BOOKING") || d.includes("BOOKING");
  }).length;
  const paymentCount = notifications.filter((n) => {
    const t = String(n.type || "").toUpperCase();
    const d = String(n.description || "").toUpperCase();
    return t.includes("PAYMENT") || d.includes("PAYMENT");
  }).length;

  // Filtered notifications
  const filteredNotifications = notifications.filter((item) => {
    if (filter === "unread") return !item.isRead;
    if (filter === "bookings") {
      const t = String(item.type || "").toUpperCase();
      const d = String(item.description || "").toUpperCase();
      return t.includes("BOOKING") || d.includes("BOOKING");
    }
    if (filter === "payments") {
      const t = String(item.type || "").toUpperCase();
      const d = String(item.description || "").toUpperCase();
      return t.includes("PAYMENT") || d.includes("PAYMENT");
    }
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-[75vh]">
      {/* 1. Page Header with Badge & Bulk Action */}
      <div className="mb-6 sm:mb-8 text-left space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold text-amber-700 bg-amber-50/90 px-3 py-1 rounded-full border border-amber-300/80 shadow-2xs">
              ACTIVITY & UPDATES
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Notifications
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl leading-relaxed">
              Stay informed about appointments, payment confirmations, and important updates.
            </p>
          </div>

          {/* Header Actions: Mark All As Read Button */}
          {unreadCount > 0 && (
            <button
              type="button"
              disabled={markingAll}
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300/80 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer self-start sm:self-auto shrink-0"
            >
              <DoneAllIcon sx={{ fontSize: 16 }} />
              <span>{markingAll ? "Marking..." : `Mark all as read (${unreadCount})`}</span>
            </button>
          )}
        </div>

        {/* 2. Category Filter Pills */}
        {!loading && notifications.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-b border-slate-100 pb-3">
            {[
              { id: "all", label: "All", count: notifications.length },
              { id: "unread", label: "Unread", count: unreadCount },
              { id: "bookings", label: "Bookings", count: bookingCount },
              { id: "payments", label: "Payments", count: paymentCount },
            ].map((tab) => {
              const isActive = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive ? "bg-amber-500 text-slate-950" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Notifications List / Loading / Error / Empty States */}
      <div className="space-y-3 sm:space-y-4">
        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-3">
            <NotificationCardSkeleton />
            <NotificationCardSkeleton />
            <NotificationCardSkeleton />
          </div>
        )}

        {/* Error State Banner with Retry */}
        {error && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-700 text-xs sm:text-sm font-medium"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={loadNotifications}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 font-bold transition-colors cursor-pointer"
            >
              <RefreshIcon sx={{ fontSize: 14 }} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Empty State: Completely caught up */}
        {!loading && !error && notifications.length === 0 && (
          <EmptyState
            icon="🔔"
            title="You're all caught up!"
            description="There are no notifications right now. When you book appointments or receive updates, they will appear here."
            actionText="Explore Salons"
            onAction={() => navigate("/explore")}
          />
        )}

        {/* Filtered Empty State: No results for selected filter */}
        {!loading && !error && notifications.length > 0 && filteredNotifications.length === 0 && (
          <EmptyState
            icon="✨"
            title={`No ${filter} notifications`}
            description={`You don't have any notifications under the "${filter}" filter.`}
            actionText="View All Notifications"
            onAction={() => setFilter("all")}
          />
        )}

        {/* Render Filtered Notifications */}
        {!loading &&
          !error &&
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onRead={markAsRead}
            />
          ))}
      </div>
    </div>
  );
};

export default Notifications;
