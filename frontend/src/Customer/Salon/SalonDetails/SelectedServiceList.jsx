import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";

const SelectedServiceList = ({ services, onRemove }) => {
  return (
    <div className="my-5 space-y-2">
      {services.map((service) => (
        <div key={service.id} className="py-2 px-4 rounded-md bg-slate-100 flex justify-between items-center gap-2">
          <span className="font-thin">{service.name}</span>
          <p>₹{service.price}</p>
          <IconButton onClick={() => onRemove(service.id)} aria-label={`Remove ${service.name}`}>
            <Close />
          </IconButton>
        </div>
      ))}
      {services.length === 0 && <p className="text-sm text-gray-500">Choose a service to begin.</p>}
    </div>
  );
};

export default SelectedServiceList;
