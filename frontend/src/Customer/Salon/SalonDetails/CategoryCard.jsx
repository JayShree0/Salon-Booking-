import React from "react";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";

const FALLBACK_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=300&auto=format&fit=crop";

const CategoryCard = ({ category, selected, onClick, count }) => {
  const isAll = category.id === "all";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl text-left transition-all duration-200 cursor-pointer select-none border ${
        selected
          ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10 scale-[1.01]"
          : "bg-white text-slate-700 hover:bg-amber-50/50 hover:text-slate-900 border-slate-200/80 hover:border-amber-300"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Category Thumbnail / Icon */}
        <div
          className={`w-11 h-11 rounded-xl overflow-hidden shrink-0 flex items-center justify-center transition-all ${
            selected
              ? "bg-amber-500 text-slate-950 font-bold"
              : "bg-slate-100 text-slate-500 group-hover:bg-amber-100 group-hover:text-amber-800"
          }`}
        >
          {isAll ? (
            <AutoAwesomeOutlinedIcon sx={{ fontSize: 20 }} />
          ) : (
            <img
              src={category.image || FALLBACK_CATEGORY_IMAGE}
              alt={category.name}
              onError={(e) => {
                e.currentTarget.src = FALLBACK_CATEGORY_IMAGE;
              }}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </div>

        {/* Category Label */}
        <div className="min-w-0">
          <p
            className={`text-xs sm:text-sm font-bold truncate leading-tight transition-colors ${
              selected ? "text-white" : "text-slate-800 group-hover:text-amber-700"
            }`}
          >
            {category.name}
          </p>
          <span
            className={`text-[10px] font-medium leading-none block mt-0.5 ${
              selected ? "text-amber-300" : "text-slate-400 group-hover:text-slate-500"
            }`}
          >
            {isAll ? "Full Catalog" : "Specialized Care"}
          </span>
        </div>
      </div>

      {/* Service Count Badge */}
      {typeof count === "number" && (
        <span
          className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 border transition-colors ${
            selected
              ? "bg-amber-400 text-slate-950 border-amber-300"
              : "bg-slate-100 text-slate-600 border-slate-200 group-hover:bg-amber-100 group-hover:text-amber-800 group-hover:border-amber-200"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default CategoryCard;
