import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const HomeServiceCard = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/explore?category=${encodeURIComponent(item.name.trim())}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-900 shadow-md hover:shadow-2xl hover:shadow-amber-500/15 transition-all duration-300 hover:-translate-y-1.5 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-end w-36 sm:w-44 md:w-48 h-52 sm:h-60"
    >
      {/* Background Image with Zoom */}
      <img
        src={item.image}
        alt={item.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        loading="lazy"
      />

      {/* Luxury Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

      {/* Amber Ambient Border Glow on Hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-amber-400/50 transition-colors duration-300 pointer-events-none" />

      {/* Card Details */}
      <div className="relative z-10 p-4 text-white space-y-1">
        <h3 className="font-bold text-sm sm:text-base tracking-tight leading-snug group-hover:text-amber-300 transition-colors duration-200 line-clamp-1">
          {item.name}
        </h3>

        <div className="flex items-center justify-between text-[11px] text-slate-300 group-hover:text-amber-200 transition-colors">
          <span className="font-medium">Book Treatment</span>
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300 transform group-hover:translate-x-1">
            <ArrowForwardIosIcon sx={{ fontSize: 9 }} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomeServiceCard;
