import React from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

const steps = [
  {
    step: "01",
    title: "Discover Nearby Salons",
    desc: "Search by your city, neighborhood, or specific treatment to explore verified studios.",
    icon: <SearchOutlinedIcon sx={{ fontSize: 24 }} />,
  },
  {
    step: "02",
    title: "Select Your Treatments",
    desc: "Browse comprehensive menus with clear durations, transparent pricing, and stylist profiles.",
    icon: <ContentCutOutlinedIcon sx={{ fontSize: 24 }} />,
  },
  {
    step: "03",
    title: "Choose Date & Time Slot",
    desc: "Select your preferred date and choose an available real-time slot that fits your schedule.",
    icon: <CalendarMonthOutlinedIcon sx={{ fontSize: 24 }} />,
  },
  {
    step: "04",
    title: "Instant Confirmation",
    desc: "Receive immediate booking confirmation with automated reminders and directions.",
    icon: <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 24 }} />,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl border border-slate-800">
      {/* Decorative Golden Orbs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-3 mb-14">
        <span className="text-xs uppercase tracking-widest font-extrabold text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/30">
          EFFORTLESS RESERVATIONS
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          How SalonBook Works
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Book your next hair, skin, or wellness appointment in four frictionless steps.
        </p>
      </div>

      {/* Grid of Steps */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item, idx) => (
          <div
            key={idx}
            className="group relative rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber-400/40 p-6 space-y-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
          >
            {/* Step Top Bar */}
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">
                {item.icon}
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-white/10 text-amber-300 border border-white/10">
                {item.step}
              </span>
            </div>

            {/* Step Text */}
            <div className="space-y-1.5">
              <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;

