import React from "react";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";

const RatingCard = ({ reviews = [] }) => {
  const count = reviews.length;
  const average = count
    ? (
        reviews.reduce((total, r) => total + Number(r.rating || 0), 0) / count
      ).toFixed(1)
    : "0.0";

  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) =>
      reviews.filter((r) => Math.round(Number(r.rating || 0)) === star).length
  );

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
          Rating Overview
        </h3>
        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
          {count} {count === 1 ? "Review" : "Reviews"}
        </span>
      </div>

      {/* Main Score Centerpiece */}
      <div className="flex items-baseline gap-3">
        <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none">
          {average}
        </span>
        <div className="space-y-1">
          <div className="flex items-center text-amber-500">
            {[1, 2, 3, 4, 5].map((star) =>
              Number(average) >= star ? (
                <StarRoundedIcon key={star} sx={{ fontSize: 20 }} />
              ) : (
                <StarOutlineRoundedIcon
                  key={star}
                  sx={{ fontSize: 20, color: "#cbd5e1" }}
                />
              )
            )}
          </div>
          <p className="text-xs text-slate-400">Based on verified visits</p>
        </div>
      </div>

      {/* Rating Breakdown Bars */}
      <div className="space-y-2 pt-1">
        {[5, 4, 3, 2, 1].map((stars, index) => {
          const starCount = ratingCounts[index];
          const percentage = count ? Math.round((starCount / count) * 100) : 0;

          return (
            <div key={stars} className="flex items-center gap-3 text-xs">
              <span className="w-12 text-slate-600 font-semibold flex items-center gap-1 shrink-0">
                <span>{stars}</span>
                <StarRoundedIcon sx={{ fontSize: 13, color: "#d97706" }} />
              </span>

              {/* Progress track */}
              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <span className="w-8 text-right font-medium text-slate-400 shrink-0">
                {starCount}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RatingCard;
