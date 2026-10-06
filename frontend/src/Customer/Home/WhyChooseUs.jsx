import React from "react";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";

const features = [
  {
    icon: <BoltOutlinedIcon sx={{ fontSize: 26 }} />,
    title: "Instant Live Booking",
    description:
      "Reserve verified appointment slots in seconds with real-time salon calendar sync. Zero waiting on phone confirmations.",
  },
  {
    icon: <VerifiedUserOutlinedIcon sx={{ fontSize: 26 }} />,
    title: "100% Verified Stylists",
    description:
      "Every salon and artist is vetted for high hygiene standards, certified cosmetic products, and genuine client reviews.",
  },
  {
    icon: <PaymentsOutlinedIcon sx={{ fontSize: 26 }} />,
    title: "Transparent Pricing",
    description:
      "Browse upfront service costs with zero hidden charges or surprise salon markups. Pay securely with ease.",
  },
  {
    icon: <EventAvailableOutlinedIcon sx={{ fontSize: 26 }} />,
    title: "Seamless Rescheduling",
    description:
      "Plans change? Effortlessly adjust dates, manage your upcoming visits, or cancel directly from your customer dashboard.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-12 relative">
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
        <span className="text-xs uppercase tracking-widest font-extrabold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
          THE SALONBOOK DISTINCTION
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Why Discerning Clients Choose Us
        </h2>
        <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
          We bring uncompromising quality, reliability, and sophistication to your personal grooming and beauty rituals.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, index) => (
          <div
            key={index}
            className="group relative rounded-2xl p-7 bg-white border border-slate-200/80 hover:border-amber-400/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 space-y-4"
          >
            {/* Ambient Corner Glow on Hover */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full group-hover:bg-amber-500/10 transition-colors pointer-events-none" />

            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-800 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
              {item.icon}
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-lg group-hover:text-amber-600 transition-colors duration-200">
                {item.title}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
