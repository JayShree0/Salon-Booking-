import { Button } from "@mui/material";
import { ArrowRightAlt } from "@mui/icons-material";
import React from "react";

const BookingCard = ({ booking, onCancel }) => {
  const startTime = booking.startTime ? new Date(booking.startTime) : null;
  const canCancel = !["CANCELLED", "COMPLETED"].includes(booking.status);

  return (
    <div className="p-5 rounded-md bg-slate-100 md:flex items-center justify-between">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{booking.salon?.name || `Salon #${booking.salonId}`}</h2>
        <ul className="list-disc pl-5">
          {booking.services.map((service) => <li key={service.id}>{service.name}</li>)}
          {booking.services.length === 0 && <li>Service details unavailable</li>}
        </ul>

        <div>
          <p>
            Time & Date <ArrowRightAlt /> {startTime ? startTime.toLocaleDateString() : "Not available"}{" "}
          </p>
          <p>{startTime ? startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""} to {booking.endTime ? new Date(booking.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</p>
          <p>Status: {booking.status}</p>
        </div>
      </div>

      <div className="space-y-2 ">
        <img className="h-28 w-28 object-cover rounded" src={booking.salon?.images?.[0] || "https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=300"} alt={booking.salon?.name || "Salon"} />

        <p className="text-center">₹{booking.totalPrice}</p>
        {canCancel ? <Button color="error" variant="outlined" onClick={() => onCancel(booking.id)}>Cancel booking</Button> : <Button disabled variant="outlined">{booking.status}</Button>}
      </div>
    </div>
  );
};

export default BookingCard;
