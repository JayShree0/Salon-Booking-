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
      className="group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 shadow-sm hover:shadow-xl hover:shadow-amber-500/15 transition-all duration-300 hover:-translate-y-1.5 border border-slate-200/80 flex flex-col justify-end w-full aspect-[4/5]"
    >
      {/* High-Quality Portrait Background Image with object-fit: cover */}
      <img
        src={item.image}
        alt={item.name}
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMAGE;
        }}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />

      {/* Dark Gradient Vignette for Readability (from-black/80 via-black/20 to-transparent) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 pointer-events-none" />

      {/* Subtle Amber Glow Border on Hover */}
      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border-2 border-transparent group-hover:border-amber-400/50 transition-colors duration-300 pointer-events-none" />

      {/* Bottom Content: Category Title, Subtitle, and Subtle Rounded Arrow */}
      <div className="relative z-10 p-4 sm:p-5 text-white space-y-1 text-left">
        <h3 className="font-extrabold text-sm sm:text-base md:text-lg tracking-tight leading-snug text-white group-hover:text-amber-300 transition-colors duration-200 line-clamp-1">
          {item.name}
        </h3>

        <div className="flex items-center justify-between text-xs text-slate-300 group-hover:text-amber-200 transition-colors pt-0.5">
          <span className="font-medium text-[11px] sm:text-xs">Book Treatment</span>
          <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300 transform group-hover:translate-x-1 shadow-xs shrink-0">
            <ArrowForwardIosIcon sx={{ fontSize: 9 }} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomeServiceCard;
