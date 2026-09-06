import { Button } from "@mui/material";
import { ArrowRightAlt } from "@mui/icons-material";
import React from "react";

const BookingCard = () => {
  return (
    <div className="p-5 rounded-md bg-slate-100 md:flex items-center justify-between">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Monika Salon</h1>
        <div>
          <li>Hair cut</li>
          <li>Massage thearpy</li>
          <li>Hair color</li>
        </div>

        <div>
          <p>
            Time & Date <ArrowRightAlt /> 2025-01-16{" "}
          </p>
          <p>12:00:00 To 12:45:00</p>
        </div>
      </div>

      <div className="space-y-2 ">
        <img className="h-28 w-28" src="http://res.cloudinary.com/dxoqwusir/image/upload/v1732934724/barber-2165745_1280_qfqyus.jpg" alt="" />

        <p className="text-center"> ₹399</p>
        <Button color="error" variant="outlined">Cancelled</Button>
      </div>
    </div>
  );
};

export default BookingCard;
