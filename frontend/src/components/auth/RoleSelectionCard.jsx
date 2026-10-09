import React from "react";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

const RoleSelectionCard = ({ onSelectRole, onSwitchToLogin }) => {
  return (
    <div className="py-2 sm:py-3 space-y-6">
      {/* Header section with brand pill */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-extrabold uppercase tracking-widest border border-amber-200">
          ACCOUNT REGISTRATION
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          How will you use SalonBook?
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
          Select your account type to access personalized tools and experience.
        </p>
      </div>

      {/* Role Selection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* 1. Customer Role Card */}
        <div
          onClick={() => onSelectRole("CUSTOMER")}
          className="group relative cursor-pointer rounded-2xl border-2 border-slate-200/90 hover:border-amber-500 bg-white p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-0.5 flex flex-col justify-between"
        >
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:bg-amber-100 transition-all duration-300">
                <PersonOutlineOutlinedIcon sx={{ fontSize: 26 }} />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Client
              </span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
                Book Your Next Look
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Discover verified salons, explore curated rituals, and book appointments that fit your schedule effortlessly.
              </p>
            </div>

            {/* Feature Highlights */}
            <ul className="space-y-1.5 pt-1 text-[11px] text-slate-600 font-medium">
              <li className="flex items-center gap-1.5">
                <CheckCircleOutlinedIcon sx={{ fontSize: 14 }} className="text-amber-600 shrink-0" />
                <span>Instant confirmed bookings</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircleOutlinedIcon sx={{ fontSize: 14 }} className="text-amber-600 shrink-0" />
                <span>Verified client reviews & photos</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircleOutlinedIcon sx={{ fontSize: 14 }} className="text-amber-600 shrink-0" />
                <span>Personalized visit history</span>
              </li>
            </ul>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:text-amber-600">
            <span>Continue as Customer</span>
            <span className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center group-hover:translate-x-1 group-hover:bg-amber-100 transition-all">
              <ArrowForwardIcon sx={{ fontSize: 13 }} />
            </span>
          </div>
        </div>

        {/* 2. Salon Owner Role Card */}
        <div
          onClick={() => onSelectRole("SALON_OWNER")}
          className="group relative cursor-pointer rounded-2xl border-2 border-slate-200/90 hover:border-slate-900 bg-white p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/10 hover:-translate-y-0.5 flex flex-col justify-between"
        >
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:bg-slate-800 transition-all duration-300">
                <StorefrontOutlinedIcon sx={{ fontSize: 24 }} />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Partner
              </span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
                Grow Your Salon Business
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Register your salon studio, manage service menus, track client bookings, and scale your brand.
              </p>
            </div>

            {/* Feature Highlights */}
            <ul className="space-y-1.5 pt-1 text-[11px] text-slate-600 font-medium">
              <li className="flex items-center gap-1.5">
                <CheckCircleOutlinedIcon sx={{ fontSize: 14 }} className="text-amber-600 shrink-0" />
                <span>Dedicated partner dashboard</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircleOutlinedIcon sx={{ fontSize: 14 }} className="text-amber-600 shrink-0" />
                <span>Custom services & time slots</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircleOutlinedIcon sx={{ fontSize: 14 }} className="text-amber-600 shrink-0" />
                <span>Reach thousands of local clients</span>
              </li>
            </ul>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-amber-700">
            <span>Continue as Salon Owner</span>
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center group-hover:translate-x-1 group-hover:bg-slate-200 transition-all">
              <ArrowForwardIcon sx={{ fontSize: 13 }} />
            </span>
          </div>
        </div>
      </div>

      {/* Switch to Login Link */}
      <div className="text-center pt-1 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-amber-600 font-bold hover:text-amber-700 hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default RoleSelectionCard;

