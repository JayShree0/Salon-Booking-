import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";

const SelectedServiceList = ({ services = [], onRemove }) => {
  if (services.length === 0) {
    return (
      <div className="my-4 p-5 rounded-2xl border border-dashed border-slate-200 text-center space-y-2 bg-slate-50/50">
        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <ContentCutOutlinedIcon sx={{ fontSize: 20 }} />
        </div>
        <p className="text-xs font-semibold text-slate-700">No services selected yet</p>
        <p className="text-[11px] text-slate-400">
          Click &quot;Add Service&quot; on any item to schedule your appointment.
        </p>
      </div>
    );
  }

  return (
    <div className="my-3 space-y-2 max-h-48 overflow-y-auto pr-1">
      {services.map((service) => (
        <div
          key={service.id}
          className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-left transition-colors hover:bg-slate-100/70"
        >
          <div className="min-w-0 flex-1">
            <p className="font-bold text-xs text-slate-800 truncate">{service.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-extrabold text-amber-700">
                ₹{Number(service.price || 0).toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                <AccessTimeOutlinedIcon sx={{ fontSize: 11 }} />
                <span>{service.duration || 30}m</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRemove(service.id)}
            aria-label={`Remove ${service.name}`}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default SelectedServiceList;
