import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../config/api";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";

const FALLBACK_HERO =
  "https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=1200";
const FALLBACK_INTERIOR =
  "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=900";
const FALLBACK_WORKSPACE =
  "https://images.pexels.com/photos/3993444/pexels-photo-3993444.jpeg?auto=compress&cs=tinysrgb&w=900";

const SalonDetail = ({
  salon: propSalon,
  reviews = [],
  loading: propLoading,
  error: propError,
  onScrollToCategories,
}) => {
  const { id } = useParams();
  const [internalSalon, setInternalSalon] = useState(null);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState("");

  useEffect(() => {
    if (propSalon) return;
    if (!id) return;

    setInternalLoading(true);
    api
      .get(`/api/salons/${id}`)
      .then(({ data }) => {
        setInternalSalon(data);
        setInternalError("");
      })
      .catch((requestError) =>
        setInternalError(
          requestError.response?.data?.message || requestError.message || "Failed to load salon."
        )
      )
      .finally(() => setInternalLoading(false));
  }, [id, propSalon]);

  const salon = propSalon || internalSalon;
  const loading = propLoading !== undefined ? propLoading : internalLoading;
  const error = propError || internalError;

  const handleScroll = () => {
    if (onScrollToCategories) {
      onScrollToCategories();
    } else {
      const el = document.getElementById("salon-categories-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  if (loading && !salon) {
    return (
      <div className="space-y-6 mb-8 animate-pulse">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 h-64 sm:h-80 bg-slate-200 rounded-2xl" />
          <div className="col-span-1 hidden sm:block h-48 bg-slate-200 rounded-2xl" />
          <div className="col-span-1 hidden sm:block h-48 bg-slate-200 rounded-2xl" />
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-2xl h-28" />
      </div>
    );
  }

  if (error && !salon) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold mb-8">
        Unable to load this salon: {error}
      </div>
    );
  }

  if (!salon) return null;

  const images = salon.images?.filter(Boolean) || [];
  const heroImage = images[0] || FALLBACK_HERO;
  const interiorImage = images[1] || FALLBACK_INTERIOR;
  const workspaceImage =
    images[2] || (images.length === 2 ? FALLBACK_WORKSPACE : FALLBACK_WORKSPACE);

  const fullAddress =
    salon.address && salon.city && salon.address.toLowerCase().includes(salon.city.toLowerCase())
      ? salon.address
      : [salon.address, salon.city].filter(Boolean).join(", ");

  const openTimeFormatted = String(salon.openTime || "09:00").slice(0, 5);
  const closeTimeFormatted = String(salon.closeTime || "21:00").slice(0, 5);

  const reviewCount = reviews.length;
  const avgRating = reviewCount
    ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviewCount).toFixed(1)
    : null;

  return (
    <div className="space-y-6 mb-8">
      {/* 1. Photo Gallery Grid */}
      <section className="grid grid-cols-2 gap-3">
        {/* Main Hero Shot */}
        <div className="col-span-2 relative overflow-hidden rounded-2xl bg-slate-100 group shadow-sm">
          <img
            className="w-full h-64 sm:h-80 md:h-96 object-cover transition-transform duration-500 group-hover:scale-102"
            src={heroImage}
            alt={`${salon.name} hero`}
            onError={(e) => {
              e.currentTarget.src = FALLBACK_HERO;
            }}
          />
        </div>

        {/* Interior Thumbnail */}
        <div className="col-span-1 hidden sm:block relative overflow-hidden rounded-2xl bg-slate-100 group shadow-xs">
          <img
            className="w-full h-44 md:h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            src={interiorImage}
            alt={`${salon.name} interior view`}
            onError={(e) => {
              e.currentTarget.src = FALLBACK_INTERIOR;
            }}
          />
        </div>

        {/* Workspace Thumbnail */}
        <div className="col-span-1 hidden sm:block relative overflow-hidden rounded-2xl bg-slate-100 group shadow-xs">
          <img
            className="w-full h-44 md:h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            src={workspaceImage}
            alt={`${salon.name} styling station`}
            onError={(e) => {
              e.currentTarget.src = FALLBACK_WORKSPACE;
            }}
          />
        </div>
      </section>

      {/* 2. Salon Info Header with Verified Badge, Address, Hours, Contact & Quick Action */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 p-6 sm:p-7 bg-white border border-slate-200/90 rounded-3xl shadow-sm">
        <div className="space-y-3 text-left">
          {/* Salon Title & Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              {salon.name}
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <VerifiedOutlinedIcon sx={{ fontSize: 13 }} />
              <span>Verified Partner</span>
            </span>

            {reviewCount > 0 ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <StarRoundedIcon sx={{ fontSize: 16 }} className="text-amber-500" />
                <span>{avgRating}</span>
                <span className="text-slate-500 font-medium">({reviewCount})</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                <StarOutlineRoundedIcon sx={{ fontSize: 15, color: "#94a3b8" }} />
                <span>New Partner</span>
              </span>
            )}
          </div>

          {/* Details Row: Address, Operating Hours, Phone, Email */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-slate-600 text-xs sm:text-sm font-medium">
            <span className="inline-flex items-center gap-1.5 text-slate-700">
              <LocationOnOutlinedIcon sx={{ fontSize: 16 }} className="text-amber-600 shrink-0" />
              <span>{fullAddress}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 text-slate-600">
              <AccessTimeOutlinedIcon sx={{ fontSize: 15 }} className="text-amber-600 shrink-0" />
              <span>
                Hours: {openTimeFormatted} to {closeTimeFormatted}
              </span>
            </span>

            {salon.phoneNumber && (
              <span className="inline-flex items-center gap-1.5 text-slate-600">
                <PhoneOutlinedIcon sx={{ fontSize: 14 }} className="text-slate-400 shrink-0" />
                <span>+91 {salon.phoneNumber}</span>
              </span>
            )}

            {salon.email && (
              <span className="inline-flex items-center gap-1.5 text-slate-600 hidden md:inline-flex">
                <EmailOutlinedIcon sx={{ fontSize: 14 }} className="text-slate-400 shrink-0" />
                <span>{salon.email}</span>
              </span>
            )}
          </div>
        </div>

        {/* View All Categories CTA */}
        <button
          type="button"
          onClick={handleScroll}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-slate-900/10 active:scale-95 transition-all duration-200 cursor-pointer shrink-0 self-start lg:self-center"
        >
          <span>View All Categories</span>
          <span>↓</span>
        </button>
      </section>
    </div>
  );
};

export default SalonDetail;
