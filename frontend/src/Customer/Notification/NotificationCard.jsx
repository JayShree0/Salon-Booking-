import { Card } from "@mui/material";
import React from "react";
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';

const NotificationCard = ({ notification, onRead }) => {
  const isRead = notification.isRead;
  const booking = notification.booking;

  return (
    <div>
      <Card
        sx={{
          bgcolor: isRead ? "#F4F5F3" : "#EAF0F1",
        }}
        className={`p-5 flex items-center gap-5`}>
        <NotificationsActiveOutlinedIcon/>
        <div className="flex-1">
            <p className="font-semibold">{notification.type || "Booking update"}</p>
            <p>{notification.description}</p>
            {booking && <p className="text-sm text-gray-600">{booking.status} · {booking.startTime ? new Date(booking.startTime).toLocaleString() : ""}</p>}
            {notification.createdAt && <p className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>}
        </div>
        {!isRead && <button className="text-sm text-green-800" onClick={() => onRead(notification)}>Mark read</button>}
      </Card>
    </div>
  );
};

export default NotificationCard;
