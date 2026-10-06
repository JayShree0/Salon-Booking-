import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import StarIcon from "@mui/icons-material/Star";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";
import heroVideo from "../../Assets/horizontal_.webm";

const POPULAR_SEARCHES = [
  "Hair cut",
  "Facial Treatment",
  "Bridal Makeup",
  "Massage Therapy",
  "Pedicure",
];

const Banner = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    if (!keyword.trim()) return;

    navigate(`/?city=${encodeURIComponent(keyword.trim())}`);
    const salonSection = document.getElementById("featured-salons");
    if (salonSection) {
      salonSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleQuickTagClick = (tag) => {
    navigate(`/explore?category=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="relative w-full min-h-[620px] md:h-[84vh] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Video with Poster Fallback */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-45 pointer-events-none scale-105 transition-transform duration-1000"
        muted
        autoPlay
        loop
        playsInline
        src={heroVideo}
        poster="https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      {/* Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/80 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/40 to-slate-950/90 pointer-events-none" />

      {/* Ambient Warm Golden Glow Orbs */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center space-y-6 pt-12 pb-16">
        {/* Luxury Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide shadow-lg shadow-black/20">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          ✨ Curated Beauty & Wellness Destinations
        </div>

        {/* Hero Title */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15]">
            Where Elegance Meets{" "}
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
              Effortless Care
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base md:text-lg font-normal leading-relaxed">
            Discover verified hair stylists, artisan barbers, and tranquil spas near you.
            Transparent upfront pricing, real reviews, and instant appointment booking.
          </p>
        </div>

        {/* Floating Glassmorphic Search Bar */}
        <div className="w-full max-w-2xl pt-2">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl sm:rounded-full shadow-2xl border border-white/20 shadow-black/40"
          >
            <div className="flex items-center gap-3 px-4 py-2 w-full flex-1 text-left">
              <LocationOnOutlinedIcon className="text-amber-600" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search by city or salon name (e.g. Mumbai, Delhi)..."
                className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 text-sm sm:text-base font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl sm:rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-amber-500/25 active:scale-95"
            >
              <SearchOutlinedIcon fontSize="small" />
              <span>Find Salons</span>
            </button>
          </form>

          {/* Quick Trending Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs text-slate-300">
            <span className="text-slate-400 font-medium">Trending:</span>
            {POPULAR_SEARCHES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleQuickTagClick(item)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 hover:border-amber-400/40 text-slate-200 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Trust KPI Highlights */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-3xl border-t border-white/10 mt-4">
          <div className="flex items-center justify-center gap-2 text-slate-200">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
              <StarIcon sx={{ fontSize: 18 }} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white">4.9 / 5 Rating</p>
              <p className="text-[11px] text-slate-400">From 15k+ Reviews</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-200">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
              <VerifiedOutlinedIcon sx={{ fontSize: 18 }} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white">100% Verified</p>
              <p className="text-[11px] text-slate-400">Hygiene Certified</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-200">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
              <AccessTimeOutlinedIcon sx={{ fontSize: 18 }} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white">Instant Booking</p>
              <p className="text-[11px] text-slate-400">Live Available Slots</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-200">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
              <LocalAtmOutlinedIcon sx={{ fontSize: 18 }} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white">Best Pricing</p>
              <p className="text-[11px] text-slate-400">Zero Hidden Fees</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
