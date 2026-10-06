import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import StarIcon from "@mui/icons-material/Star";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SparklesIcon from "@mui/icons-material/AutoAwesome";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

const TRENDING_SERVICES = [
  { label: "Hair cut", icon: "✂️" },
  { label: "Facial Treatment", icon: "✨" },
  { label: "Bridal Makeup", icon: "💄" },
  { label: "Massage Therapy", icon: "💆" },
  { label: "Pedicure", icon: "💅" },
  { label: "Hair Spa", icon: "🌿" },
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
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-amber-50/60 via-white to-stone-50/50 pt-8 pb-16 md:py-20 border-b border-slate-200/70">
      {/* Opulent Ambient Warm Glow Orbs for End-to-End Visual Harmony */}
      <div className="absolute -top-24 right-1/4 w-[32rem] h-[32rem] bg-gradient-to-br from-amber-300/25 to-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Editorial Typography & Concierge Search */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Pre-Header Luxury Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/80 text-amber-900 text-xs font-bold uppercase tracking-wider shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
              </span>
              <SparklesIcon sx={{ fontSize: 14 }} className="text-amber-600" />
              <span>Premier Salon & Spa Concierge</span>
            </div>

            {/* Main Editorial Headline */}
            <div className="space-y-3.5">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Where Elegance Meets{" "}
                <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent">
                  Effortless Care
                </span>
              </h1>

              <p className="max-w-xl text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
                Discover top-tier hair stylists, artisan barbers, and tranquil wellness spas near you.
                Instant live calendar booking, genuine client reviews, and transparent pricing.
              </p>
            </div>

            {/* Floating Concierge Search Console */}
            <div className="w-full max-w-2xl pt-1">
              <form
                onSubmit={handleSearch}
                className="flex flex-col sm:flex-row items-center gap-2 p-2 sm:p-2.5 bg-white rounded-2xl sm:rounded-full shadow-[0_18px_45px_-10px_rgba(217,119,6,0.18)] border border-slate-200/90 focus-within:border-amber-500/80 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all duration-300"
              >
                {/* Search Input Field */}
                <div className="flex items-center gap-3 px-4 py-2 w-full flex-1 text-left">
                  <LocationOnOutlinedIcon className="text-amber-600 shrink-0" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search by city, neighborhood, or salon name..."
                    className="w-full bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm md:text-base font-medium"
                  />
                </div>

                {/* Glowing Search CTA Button */}
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl sm:rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-amber-600/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
                >
                  <SearchOutlinedIcon fontSize="small" />
                  <span>Find Salons</span>
                </button>
              </form>

              {/* Trending Quick Suggestions */}
              <div className="flex flex-wrap items-center gap-2 pt-4 text-xs">
                <span className="text-slate-500 font-bold">Trending:</span>
                {TRENDING_SERVICES.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleQuickTagClick(item.label)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-amber-50 border border-slate-200/90 hover:border-amber-400/80 text-slate-700 hover:text-amber-900 font-semibold shadow-xs transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trust KPI Micro-Badges */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl border-t border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0">
                  <StarIcon sx={{ fontSize: 17 }} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 leading-tight">4.9 / 5 Rating</p>
                  <p className="text-[11px] text-slate-500 leading-none mt-0.5">25k+ Reviews</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
                  <VerifiedOutlinedIcon sx={{ fontSize: 17 }} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 leading-tight">100% Verified</p>
                  <p className="text-[11px] text-slate-500 leading-none mt-0.5">Hygiene Audited</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0">
                  <AccessTimeOutlinedIcon sx={{ fontSize: 17 }} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 leading-tight">Instant Sync</p>
                  <p className="text-[11px] text-slate-500 leading-none mt-0.5">Live Available Slots</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0">
                  <LocalAtmOutlinedIcon sx={{ fontSize: 17 }} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 leading-tight">Best Pricing</p>
                  <p className="text-[11px] text-slate-500 leading-none mt-0.5">Zero Hidden Fees</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Luxury Salon Showcase Visuals */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Ambient Background Radial Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/15 via-amber-400/10 to-transparent rounded-3xl filter blur-2xl transform scale-95 pointer-events-none" />

            {/* Main Luxury Hero Image Card */}
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
              <img
                src="https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Luxury Salon Experience"
                className="w-full h-[440px] sm:h-[490px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Subtle Warm Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent pointer-events-none" />

              {/* Bottom Card Title Badge */}
              <div className="absolute bottom-5 left-5 right-5 text-left text-white">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                  FEATURED STUDIO
                </span>
                <h3 className="text-lg font-bold text-white leading-tight">
                  Aura Luxury Hair Spa & Wellness
                </h3>
                <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                  <LocationOnOutlinedIcon sx={{ fontSize: 14 }} className="text-amber-400" />
                  Bandra West, Mumbai • Open 09:00 - 21:00
                </p>
              </div>
            </div>

            {/* Floating Glassmorphic Badge 1: Top Left Rating Pill */}
            <div className="absolute -top-4 -left-4 sm:-left-6 backdrop-blur-xl bg-white/95 border border-slate-200/90 shadow-xl rounded-2xl p-3 flex items-center gap-3 z-20">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <StarIcon sx={{ fontSize: 20 }} />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-extrabold text-slate-900">4.9 / 5.0</span>
                  <span className="text-[10px] text-amber-600 font-bold">★ Top Rated</span>
                </div>
                <p className="text-[11px] text-slate-500">Verified Master Stylists</p>
              </div>
            </div>

            {/* Floating Glassmorphic Badge 2: Bottom Right Booking Confirmation Badge */}
            <div className="absolute -bottom-5 -right-3 sm:-right-6 backdrop-blur-xl bg-white/95 border border-emerald-500/30 shadow-2xl rounded-2xl p-3.5 flex items-center gap-3 z-20 max-w-[240px]">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircleIcon sx={{ fontSize: 20 }} />
              </div>
              <div className="text-left">
                <p className="text-xs font-extrabold text-slate-900 leading-tight">
                  Instant Confirmation
                </p>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  Live Slot Reserved • Zero Wait
                </p>
              </div>
            </div>

            {/* Floating Micro-Badge 3: Quick Treatment Thumbnail */}
            <div className="hidden sm:flex absolute top-1/2 -right-8 -translate-y-1/2 backdrop-blur-md bg-white/90 border border-slate-200/80 shadow-lg rounded-2xl p-2 items-center gap-2.5 z-20">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                <img
                  src="https://images.pexels.com/photos/5069455/pexels-photo-5069455.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="Spa Ritual"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left pr-2">
                <p className="text-xs font-bold text-slate-900">Spa & Facial</p>
                <p className="text-[10px] text-amber-600 font-semibold">From ₹799</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Banner;
