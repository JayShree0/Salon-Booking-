import React from "react";
import StarIcon from "@mui/icons-material/Star";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

const SalonCard = ({ item }) => {
  const navigate = useNavigate();
  const image =
    item.images?.[0] ||
    "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800";

  return (
    <div
      onClick={() => navigate(`/salon/${item.id}`)}
      className="group relative cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-amber-400/60 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          src={image}
          alt={item.name}
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

        {/* Rating Floating Badge */}
        <div className="absolute top-3 left-3 bg-slate-950/75 backdrop-blur-md text-amber-300 border border-white/10 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <span>{item.rating || "4.8"}</span>
        </div>

        {/* Verified Badge */}
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 shadow-md">
          <VerifiedOutlinedIcon sx={{ fontSize: 13 }} />
          <span>Verified</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
            {item.name}
          </h3>

          <div className="flex items-center gap-1.5 text-slate-500 text-xs line-clamp-1">
            <LocationOnOutlinedIcon sx={{ fontSize: 16 }} className="text-amber-600 shrink-0" />
            <span>{item.address || item.city || "Premium Salon Experience"}</span>
          </div>

          {item.openTime && item.closeTime && (
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <AccessTimeOutlinedIcon sx={{ fontSize: 15 }} className="text-slate-400 shrink-0" />
              <span>
                {String(item.openTime).slice(0, 5)} - {String(item.closeTime).slice(0, 5)}
              </span>
            </div>
          )}
        </div>

        {/* Card Action Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
          <span className="text-amber-600 group-hover:text-amber-700 transition-colors">
            Book Appointment
          </span>
          <span className="w-7 h-7 rounded-full bg-amber-50 group-hover:bg-amber-600 text-amber-600 group-hover:text-white flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-1">
            <ArrowForwardIcon sx={{ fontSize: 14 }} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default SalonCard;

