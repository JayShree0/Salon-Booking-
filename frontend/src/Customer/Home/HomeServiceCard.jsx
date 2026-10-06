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
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-950 shadow-xs hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 border border-slate-200/80 flex flex-col justify-end w-full h-36 sm:h-40 md:h-44"
    >
      {/* High-Quality Portrait Photo with Shorter, Compact Aspect Ratio */}
      <img
        src={item.image}
        alt={item.name}
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMAGE;
        }}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />

      {/* Rich, Soft Dark-Gradient Vignette for Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent transition-opacity duration-300 pointer-events-none" />

      {/* Subtle Amber Glow Border on Hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-amber-400/50 transition-colors duration-300 pointer-events-none" />

      {/* Bottom Content: Small crisp title, tiny subtitle, and miniature circular arrow */}
      <div className="relative z-10 p-3 sm:p-3.5 text-white text-left space-y-0.5">
        <h3 className="font-bold text-xs sm:text-sm tracking-tight leading-snug text-white group-hover:text-amber-300 transition-colors duration-200 line-clamp-1">
          {item.name}
        </h3>

        <div className="flex items-center justify-between text-slate-300 group-hover:text-amber-200 transition-colors pt-0.5">
          <span className="text-[10px] sm:text-[11px] font-medium leading-none">
            Book Treatment
          </span>
          <span className="w-5 h-5 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300 transform group-hover:translate-x-0.5 shadow-2xs shrink-0">
            <ArrowForwardIosIcon sx={{ fontSize: 8 }} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomeServiceCard;
