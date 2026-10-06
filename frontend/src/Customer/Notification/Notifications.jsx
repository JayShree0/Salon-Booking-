import React, { useEffect, useState } from "react";
import api from "../../config/api";
import NotificationCard from './NotificationCard';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNotifications = async () => {
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
        setError(requestError.response?.data?.message || requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const markAsRead = async (notification) => {
    try {
      const { data } = await api.put(`/api/notifications/${notification.id}/read`);
      setNotifications((current) => current.map((item) => item.id === notification.id ? data : item));
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    }
  };

  return (
    <div className="px-5 md:flex flex-col items-center mt-10 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold py-5">Notifications</h1>
      </div>

      <div className="space-y-4 md:w-[35rem]">
        {loading && <p>Loading notifications...</p>}
        {error && <p role="alert" className="text-red-700">{error}</p>}
        {!loading && !error && notifications.length === 0 && <p>You have no notifications.</p>}
        {notifications.map((notification) => <NotificationCard key={notification.id} notification={notification} onRead={markAsRead} />)}
      </div>
    </div>
  )
}

export default Notifications
