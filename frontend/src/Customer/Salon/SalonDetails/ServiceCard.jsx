import { FiberManualRecord } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";

const ServiceCard = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-5">
        <div className="space-y-1 w-[60%]">
          <h1 className="text-2xl font-semibold">Man Beard</h1>
          <p className="text-gray-500 text-sm">Stylish man beard</p>
          <p>₹399</p>

          <div className="flex items-center gap-3">
            <FiberManualRecord
              sx={{
                fontSize: "10px",
                color: "gray",
              }}
            />
            <p>45 mins</p>
          </div>
        </div>

        <div className="space-y-3">
            <img className="w-32 h-32 object-cover rounded-md" src="https://images.unsplash.com/photo-1684868265714-fd2300637c23?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnJpZGFsJTIwbWFrZXVwfGVufDB8fDB8fHww" alt="" />
            <Button fullWidth variant="outlined">
                Add
            </Button>

        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
