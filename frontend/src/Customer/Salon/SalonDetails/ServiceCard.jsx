import { FiberManualRecord } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";

const ServiceCard = ({ service, selected, onToggle }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-5">
        <div className="space-y-1 w-[60%]">
          <h2 className="text-xl font-semibold">{service.name}</h2>
          <p className="text-gray-500 text-sm">{service.description}</p>
          <p>₹{service.price}</p>

          <div className="flex items-center gap-3">
            <FiberManualRecord
              sx={{
                fontSize: "10px",
                color: "gray",
              }}
            />
            <p>{service.duration} mins</p>
          </div>
        </div>

        <div className="space-y-3">
            <img className="w-32 h-32 object-cover rounded-md" src={service.image || "https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=300"} alt={service.name} />
            <Button fullWidth variant={selected ? "contained" : "outlined"} onClick={onToggle}>
              {selected ? "Remove" : "Add"}
            </Button>

        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
