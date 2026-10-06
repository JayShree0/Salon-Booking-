import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import StarIcon from "@mui/icons-material/Star";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";
import heroVideo from "../../Assets/horizontal_.webm";

const TRENDING_SERVICES = [
  { label: "Hair cut", icon: "✂️" },
  { label: "Facial Treatment", icon: "✨" },
  { label: "Bridal Makeup", icon: "💄" },
  { label: "Massage Therapy", icon: "💆" },
  { label: "Pedicure", icon: "💅" },
];

const Banner = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    if (!keyword.trim()) return;

    // Send query to home page and smooth-scroll to salon list
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
    <div className="relative w-full min-h-[640px] md:h-[86vh] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* 1. Cinematic Background Video with High-Res Poster Fallback */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none scale-105 transition-transform duration-1000"
        muted
        autoPlay
        loop
        playsInline
        src={heroVideo}
        poster="https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      {/* 2. Layered Luxury Gradient & Vignette Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/85 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-slate-950/40 to-slate-950/95 pointer-events-none" />

      {/* 3. Opulent Ambient Glow Orbs */}
      <div className="absolute -top-28 left-1/4 w-[30rem] h-[30rem] bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-28 right-1/4 w-[32rem] h-[32rem] bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* 4. Central Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center space-y-7 pt-12 pb-14">
        {/* Luxury Pre-Header Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          ✨ The Premier Salon & Wellness Booking Concierge
        </div>

        {/* Hero Title & Subheading */}
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
            Book Exceptional Beauty,{" "}
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
              Crafted For You
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base md:text-lg font-normal leading-relaxed">
            Discover vetted hair stylists, artisan barbers, and tranquil wellness spas near you.
            Instant appointment confirmation, real reviews, and 100% transparent pricing.
          </p>
        </div>

        {/* Floating Glassmorphic Concierge Search Console */}
        <div className="w-full max-w-3xl pt-2">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-center gap-2 p-2 sm:p-2.5 bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl rounded-2xl sm:rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 dark:border-slate-700/80"
          >
            {/* Search Input Field */}
            <div className="flex items-center gap-3 px-4 py-2 w-full flex-1 text-left">
              <LocationOnOutlinedIcon className="text-amber-600 shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search by city, neighborhood, or salon name (e.g. Mumbai, Delhi)..."
                className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm md:text-base font-medium"
              />
            </div>

            {/* Glowing Search Action Button */}
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl sm:rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-600/30 hover:shadow-amber-500/50 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <SearchOutlinedIcon fontSize="small" />
              <span>Find Salons</span>
            </button>
          </form>

          {/* Trending Searches Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs text-slate-300">
            <span className="text-slate-400 font-semibold">Popular Right Now:</span>
            {TRENDING_SERVICES.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleQuickTagClick(item.label)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 hover:border-amber-400/40 text-slate-200 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Hero Trust KPI Highlights Row */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl border-t border-white/10 mt-4">
          <div className="flex items-center justify-center gap-2.5 text-slate-200">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <StarIcon sx={{ fontSize: 18 }} />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-bold text-white">4.9 / 5 Rating</p>
              <p className="text-[11px] text-slate-400">Over 25k Reviews</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 text-slate-200">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <VerifiedOutlinedIcon sx={{ fontSize: 18 }} />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-bold text-white">100% Verified</p>
              <p className="text-[11px] text-slate-400">Hygiene Audited</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 text-slate-200">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AccessTimeOutlinedIcon sx={{ fontSize: 18 }} />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-bold text-white">Instant Booking</p>
              <p className="text-[11px] text-slate-400">Live Available Slots</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 text-slate-200">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <LocalAtmOutlinedIcon sx={{ fontSize: 18 }} />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-bold text-white">Best Pricing</p>
              <p className="text-[11px] text-slate-400">Zero Hidden Surcharges</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
