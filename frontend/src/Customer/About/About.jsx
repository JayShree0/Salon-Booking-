import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full space-y-16">
        {/* Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-wider font-bold text-amber-600">
            Our Mission & Story
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Elevating Self-Care Through Seamless Salon Technology
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            SalonBook was created to bridge the gap between discerning clients and exceptional beauty, hair, and wellness professionals.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
            <span className="text-3xl">✨</span>
            <h3 className="text-lg font-bold text-slate-900">Uncompromising Quality</h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              We exclusively onboard licensed, verified salons that prioritize hygiene, client comfort, and authentic customer satisfaction.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
            <span className="text-3xl">⚡</span>
            <h3 className="text-lg font-bold text-slate-900">Real-Time Clarity</h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Say goodbye to waiting on hold or uncertain schedule delays. Our slot engine connects directly to salon calendars.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
            <span className="text-3xl">🤝</span>
            <h3 className="text-lg font-bold text-slate-900">Empowering Businesses</h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              We provide salon owners with comprehensive management tools to accept bookings, manage staff calendars, and grow revenue.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-wider font-bold text-amber-600">
              The Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Designed with Precision for Clients and Artisans
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Finding a trusted stylist or wellness sanctuary should never be stressful. Whether you are preparing for a wedding, routine hair maintenance, or a spontaneous spa afternoon, SalonBook puts thousands of verified services at your fingertips.
            </p>
            <div className="pt-2">
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/explore")}
              >
                Explore Salons Today
              </Button>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg h-72">
            <img
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80"
              alt="Salon Styling"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

