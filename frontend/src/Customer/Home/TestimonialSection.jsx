import React from "react";
import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { Avatar } from "@mui/material";

const reviews = [
  {
    name: "Ananya Sharma",
    city: "Mumbai",
    salon: "Aura Luxury Hair Spa",
    rating: 5,
    comment:
      "Booking my bridal hair styling and pre-wedding makeup was completely effortless. The salon was prepared the second I walked in, with zero waiting time!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    initials: "AS",
  },
  {
    name: "Rohan Verma",
    city: "Delhi",
    salon: "The Master Barbershop",
    rating: 5,
    comment:
      "Hands down the best grooming platform. I found an artisan barbershop near my office, checked the price list upfront, and booked a 30-min slot seamlessly.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    initials: "RV",
  },
  {
    name: "Pooja Mehta",
    city: "Bangalore",
    salon: "Serene Ayurvedic Wellness",
    rating: 5,
    comment:
      "I love the clean interface and notification reminders. Transparent pricing and verified hygiene standards make this my permanent booking app.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    initials: "PM",
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-12 relative">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
        <span className="text-xs uppercase tracking-widest font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          CLIENT EXPERIENCES
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Loved by Thousands of Clients
        </h2>
        <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
          Hear how our community discovers exceptional artists, certified hygiene, and effortless salon visits.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="group relative rounded-2xl p-7 bg-white border border-slate-200/80 hover:border-amber-400/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-6"
          >
            {/* Quote Icon & Stars */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5 text-amber-500">
                  {[...Array(r.rating)].map((_, idx) => (
                    <StarIcon key={idx} sx={{ fontSize: 18 }} />
                  ))}
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FormatQuoteIcon sx={{ fontSize: 20 }} />
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed italic">
                "{r.comment}"
              </p>
            </div>

            {/* Client Profile */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <Avatar
                src={r.avatar}
                alt={r.name}
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: "#D97706",
                  border: "2px solid #FEF3C7",
                }}
              >
                {r.initials}
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-slate-900 truncate">
                    {r.name}
                  </h4>
                  <VerifiedIcon sx={{ fontSize: 14 }} className="text-emerald-600 shrink-0" />
                </div>
                <p className="text-xs text-slate-400 truncate">
                  {r.city} • <span className="text-amber-600 font-medium">{r.salon}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;
