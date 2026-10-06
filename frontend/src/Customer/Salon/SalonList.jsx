import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import SalonCard from "./SalonCard";
import { fetchSalons, searchSalons } from "../../Redux/Salon/action";
import { SalonCardSkeleton } from "../../components/common/SkeletonCard";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const POPULAR_CITIES = ["All", "Mumbai", "Delhi", "Bangalore", "Pune"];

const SalonList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { salons, searchSalons: searchResults, loading, error } = useSelector((state) => state.salon);
  const [searchParams, setSearchParams] = useSearchParams();
  const cityFromUrl = searchParams.get("city") || "";

  const [city, setCity] = useState(cityFromUrl);
  const [activeCityPill, setActiveCityPill] = useState(cityFromUrl || "All");
  const [hasSearched, setHasSearched] = useState(Boolean(cityFromUrl));

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

      {/* Error Message */}
      {error && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center space-y-2">
          <p className="text-red-700 text-sm font-semibold">{error}</p>
          <button
            onClick={() => dispatch(fetchSalons())}
            className="text-xs text-red-600 underline hover:text-red-800"
          >
            Try reloading salons
          </button>
        </div>
      )}

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

