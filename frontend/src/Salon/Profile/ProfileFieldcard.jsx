import React from "react";

const ProfileFieldcard = ({ value, keys, icon }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 gap-2">
      <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm font-semibold">
        {icon}
        <span>{keys}</span>
      </div>
      <div className="text-sm sm:text-base font-bold text-slate-900 break-all">
        {value || "—"}
      </div>
    </div>
  );
};

export default ProfileFieldcard;