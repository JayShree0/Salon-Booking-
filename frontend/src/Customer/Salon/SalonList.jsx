import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import SalonCard from "./SalonCard";
import { fetchSalons, searchSalons } from "../../Redux/Salon/action";
import { SalonCardSkeleton } from "../../components/common/SkeletonCard";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloudOffOutlinedIcon from "@mui/icons-material/CloudOffOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

const POPULAR_CITIES = ["All", "Mumbai", "Delhi", "Bangalore", "Pune"];

const getFriendlyErrorInfo = (rawError) => {
  if (!rawError) return null;
  const errStr = String(rawError).toLowerCase();

  if (errStr.includes("401") || errStr.includes("unauthorized")) {
    return {
      badge: "Connection Updating",
      title: "Our Salon Directory Is Momentarily Resting",
      subtitle:
        "Our salon service is currently refreshing its connection or restarting. Please try reconnecting below — no booking history has been affected.",
    };
  }

  if (
    errStr.includes("network") ||
    errStr.includes("connect") ||
    errStr.includes("timeout") ||
    errStr.includes("econnrefused") ||
    errStr.includes("failed to fetch")
  ) {
    return {
      badge: "Server Temporarily Offline",
      title: "Unable to Reach Our Salon Network",
      subtitle:
        "Our salon servers appear to be temporarily offline or undergoing quick scheduled maintenance. Please check your internet connection or try again in a few moments.",
    };
  }

  if (errStr.includes("500") || errStr.includes("502") || errStr.includes("503") || errStr.includes("504")) {
    return {
      badge: "Maintenance In Progress",
      title: "Service Momentarily Unavailable",
      subtitle:
        "Our systems are currently handling a brief service update. Everything should be back up and running smoothly very soon.",
    };
  }

  return {
    badge: "Temporary Hiccup",
    title: "Unable to Load Salons Right Now",
    subtitle:
      "We're having trouble connecting to our salon partners right now. Please try reconnecting below, or explore our signature treatment categories above.",
  };
};

const SalonList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { salons, searchSalons: searchResults, loading, error } = useSelector((state) => state.salon);
  const [searchParams, setSearchParams] = useSearchParams();
  const cityFromUrl = searchParams.get("city") || "";

  const [city, setCity] = useState(cityFromUrl);
  const [activeCityPill, setActiveCityPill] = useState(cityFromUrl || "All");
  const [hasSearched, setHasSearched] = useState(Boolean(cityFromUrl));
  const [isRetrying, setIsRetrying] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    dispatch(fetchSalons()).finally(() => {
      setTimeout(() => setIsRetrying(false), 600);
    });
  };

  const salonsToShow = hasSearched ? searchResults : salons;

  useEffect(() => {
    dispatch(fetchSalons());
  }, [dispatch]);

  // Synchronize when URL city param changes
  useEffect(() => {
    if (!cityFromUrl) {
      setHasSearched(false);
      setActiveCityPill("All");
      return;
    }

    setCity(cityFromUrl);
    setActiveCityPill(cityFromUrl);
    setHasSearched(true);
    dispatch(searchSalons(localStorage.getItem("jwt"), cityFromUrl));
  }, [cityFromUrl, dispatch]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (!city.trim()) {
      handleReset();
      return;
    }

    setHasSearched(true);
    setActiveCityPill(city.trim());
    setSearchParams({ city: city.trim() });
    dispatch(searchSalons(localStorage.getItem("jwt"), city.trim()));
  };

  const handleCityPillClick = (cityName) => {
    setActiveCityPill(cityName);
    if (cityName === "All") {
      handleReset();
    } else {
      setCity(cityName);
      setHasSearched(true);
      setSearchParams({ city: cityName });
      dispatch(searchSalons(localStorage.getItem("jwt"), cityName));
    }
  };

  const handleReset = () => {
    setCity("");
    setActiveCityPill("All");
    setHasSearched(false);
    setSearchParams({});
    dispatch(fetchSalons());
  };

  return (
    <div id="featured-salons" className="space-y-8">
      {/* Header and Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-wider font-bold text-amber-600">
            Certified Studios & Parlours
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Featured Salons Near You
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Handpicked beauty spaces with verified hygiene standards and premier ratings.
          </p>
        </div>

        {/* Quick Filter Search & Pills */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all"
          >
            <SearchOutlinedIcon fontSize="small" className="text-slate-400" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search by city..."
              className="bg-transparent border-none outline-none text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 w-36 sm:w-44"
            />
            {hasSearched && (
              <button
                type="button"
                onClick={handleReset}
                title="Reset search"
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <RestartAltIcon sx={{ fontSize: 16 }} />
              </button>
            )}
          </form>

          {/* Quick City Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {POPULAR_CITIES.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => handleCityPillClick(name)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeCityPill.toLowerCase() === name.toLowerCase()
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <SalonCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Friendly, Human-Centered Server Down / Error State */}
      {error && (() => {
        const friendly = getFriendlyErrorInfo(error);
        return (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-amber-50/50 via-white to-slate-50/80 border border-amber-200/70 p-8 sm:p-12 text-center shadow-sm">
            {/* Ambient Warm Blur Glows */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-lg mx-auto space-y-5">
              {/* Soft Icon Badge with Pulse Indicator */}
              <div className="relative inline-flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-100 to-amber-50 text-amber-700 flex items-center justify-center shadow-md shadow-amber-500/10 border border-amber-200">
                  <CloudOffOutlinedIcon sx={{ fontSize: 36 }} />
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white" />
                </span>
              </div>

              {/* Status Pill Badge */}
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100/80 border border-amber-300/80 shadow-2xs">
                  {friendly.badge}
                </span>
              </div>

              {/* Clear, Non-Technical Headline */}
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {friendly.title}
              </h3>

              {/* Friendly, Reassuring Explanation */}
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {friendly.subtitle}
              </p>

              {/* Helpful Everyday Advice Checklist */}
              <div className="bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-2xl p-4 text-left text-xs text-slate-600 space-y-2 shadow-2xs">
                <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">What you can do:</p>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">1.</span>
                  <span>Click <strong>"Try Reconnecting"</strong> below to reload salon availability.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">2.</span>
                  <span>Check that your internet connection is active and stable.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">3.</span>
                  <span>Explore the <strong>Signature Experiences</strong> categories above in the meantime.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-600/20 active:scale-95 disabled:opacity-60 transition-all cursor-pointer leading-none"
                >
                  <RefreshOutlinedIcon sx={{ fontSize: 18 }} className={isRetrying ? "animate-spin" : ""} />
                  <span>{isRetrying ? "Reconnecting..." : "Try Reconnecting"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs sm:text-sm shadow-2xs hover:border-slate-300 transition-all cursor-pointer leading-none"
                >
                  <span>Browse Categories Above</span>
                </button>
              </div>

              {/* Optional Collapsible Diagnostic Details (for developers / support) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                  className="text-[11px] text-slate-400 hover:text-slate-600 underline transition-colors cursor-pointer"
                >
                  {showTechnicalDetails ? "Hide technical diagnostic" : "Need technical info? (For developers)"}
                </button>

                {showTechnicalDetails && (
                  <div className="mt-2.5 p-3 rounded-xl bg-slate-900 text-slate-300 text-[11px] font-mono text-left overflow-x-auto shadow-inner">
                    <p className="text-slate-400 font-semibold mb-1">// System diagnostic code:</p>
                    <p className="text-amber-400 break-all">{String(error)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Empty State */}
      {!loading && !error && salonsToShow.length === 0 && (
        <div className="text-center py-12 px-4 bg-slate-50/70 border border-dashed border-slate-200 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center text-xl">
            ✂️
          </div>
          <h3 className="text-lg font-bold text-slate-800">No salons found</h3>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
            We couldn't find any salons matching "{city || cityFromUrl}". Try searching for another city or explore all registered salons.
          </p>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <RestartAltIcon sx={{ fontSize: 16 }} />
            Show All Salons
          </button>
        </div>
      )}

      {/* Salon Cards Grid */}
      {!loading && !error && salonsToShow.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {salonsToShow.map((salon) => (
            <SalonCard key={salon.id} item={salon} />
          ))}
        </div>
      )}

      {/* Bottom CTA to View All in Explore Directory */}
      {!loading && salonsToShow.length > 0 && (
        <div className="pt-4 text-center">
          <button
            onClick={() => navigate("/explore")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 hover:border-amber-400 text-slate-800 hover:text-amber-700 font-semibold text-sm shadow-sm hover:shadow-md transition-all group"
          >
            <span>Explore All Salons in Directory</span>
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowForwardIcon sx={{ fontSize: 12 }} />
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SalonList;

