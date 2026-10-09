import React from "react";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const FALLBACK_SERVICE_IMAGE =
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop";

const ServiceCard = ({ service, selected, onToggle, isSalonOwner = false }) => {
  return (
    <div
      className={`group relative p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-300 bg-white ${
        selected
          ? "border-amber-500/80 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/40"
          : "border-slate-200/80 hover:border-slate-300 hover:shadow-md"
      }`}
    >
      <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Service Details */}
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight group-hover:text-amber-700 transition-colors">
              {service.name}
            </h3>
            {selected && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <CheckCircleRoundedIcon sx={{ fontSize: 12 }} />
                <span>Selected</span>
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2">
            {service.description || "Professional grooming and beauty treatment tailored for you."}
          </p>

          {/* Pricing & Duration Bar */}
          <div className="flex items-center gap-3 pt-1">
            <span className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              ₹{Number(service.price || 0).toLocaleString("en-IN")}
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              <AccessTimeOutlinedIcon sx={{ fontSize: 13 }} className="text-slate-400" />
              <span>{service.duration || 30} mins</span>
            </span>
          </div>
        </div>

        {/* Right: Service Image + Add/Remove Button */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-xs border border-slate-100 shrink-0">
            <img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={service.image || FALLBACK_SERVICE_IMAGE}
              alt={service.name}
              onError={(e) => {
                e.currentTarget.src = FALLBACK_SERVICE_IMAGE;
              }}
              loading="lazy"
            />
          </div>

          {isSalonOwner ? (
            <span className="w-full sm:w-28 h-9 inline-flex items-center justify-center rounded-xl font-bold text-[11px] text-slate-500 bg-slate-100 border border-slate-200">
              Partner View
            </span>
          ) : (
            <button
              type="button"
              onClick={onToggle}
              className={`w-full sm:w-28 h-9 inline-flex items-center justify-center gap-1.5 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
                selected
                  ? "bg-slate-900 hover:bg-rose-600 text-white border border-slate-900 hover:border-rose-600"
                  : "bg-amber-50 hover:bg-amber-600 text-amber-800 hover:text-white border border-amber-300 hover:border-amber-600"
              }`}
            >
              {selected ? (
                <>
                  <CheckCircleRoundedIcon sx={{ fontSize: 15 }} />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <AddRoundedIcon sx={{ fontSize: 16 }} />
                  <span>Add Service</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
