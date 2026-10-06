import React from "react";
import { Skeleton } from "@mui/material";

export const SalonCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm p-3 space-y-3">
    <Skeleton variant="rounded" width="100%" height={200} className="rounded-xl" />
    <div className="space-y-2 px-1">
      <div className="flex justify-between items-center">
        <Skeleton variant="text" width="60%" height={28} />
        <Skeleton variant="rounded" width={50} height={24} />
      </div>
      <Skeleton variant="text" width="80%" height={20} />
      <div className="pt-2 flex justify-between items-center">
        <Skeleton variant="text" width="40%" height={24} />
        <Skeleton variant="rounded" width={90} height={36} />
      </div>
    </div>
  </div>
);

export const ServiceCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-slate-100 p-4 flex justify-between items-center gap-4">
    <div className="space-y-2 w-2/3">
      <Skeleton variant="text" width="70%" height={24} />
      <Skeleton variant="text" width="95%" height={18} />
      <Skeleton variant="text" width="30%" height={20} />
    </div>
    <Skeleton variant="rounded" width={80} height={80} className="rounded-lg" />
  </div>
);

export default SalonCardSkeleton;

