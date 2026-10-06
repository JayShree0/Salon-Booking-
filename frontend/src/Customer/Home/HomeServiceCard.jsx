import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const FALLBACK_IMAGE = "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800";

const HomeServiceCard = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/explore?category=${encodeURIComponent(item.name.trim())}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-950 shadow-md hover:shadow-2xl hover:shadow-amber-500/15 transition-all duration-300 hover:-translate-y-1.5 border border-slate-200/70 flex flex-col justify-end w-full aspect-[3/4] min-w-0"
    >
      {/* High-Quality Portrait Photo with object-fit: cover */}
      <img
        src={item.image}
        alt={item.name}
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMAGE;
        }}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
        loading="lazy"
      />

      {/* Rich, Soft Dark-Gradient Vignette for Enhanced Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent transition-opacity duration-300 pointer-events-none" />

      {/* Subtle Amber Glow Border on Hover */}
      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border-2 border-transparent group-hover:border-amber-400/50 transition-colors duration-300 pointer-events-none" />

      {/* Bottom Content: Refined Typography Scaled Harmoniously With the Card */}
      <div className="relative z-10 p-3 sm:p-3.5 lg:p-4 text-white text-left space-y-0.5 sm:space-y-1 min-w-0">
        <h3 className="font-bold text-sm sm:text-base tracking-tight leading-snug text-white group-hover:text-amber-300 transition-colors duration-200 line-clamp-1">
          {item.name}
        </h3>

        <div className="flex items-center justify-between gap-1.5 min-w-0 text-slate-300 group-hover:text-amber-200 transition-colors pt-0.5">
          <span className="text-[11px] sm:text-xs font-medium text-slate-300 leading-none truncate">
            Book Treatment
          </span>
          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#B48C54] hover:bg-amber-600 text-white flex items-center justify-center shadow-sm transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:scale-105 shrink-0">
            <ArrowForwardIosIcon sx={{ fontSize: 9 }} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomeServiceCard;
