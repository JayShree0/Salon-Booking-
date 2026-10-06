import React from "react";
import { useNavigate } from "react-router-dom";
import Banner from "./Banner";
import HomeServiceCard from "./HomeServiceCard";
import { services } from "../../Data/services";
import SalonList from "../Salon/SalonList";
import WhyChooseUs from "./WhyChooseUs";
import HowItWorks from "./HowItWorks";
import TestimonialSection from "./TestimonialSection";
import HomeCta from "./HomeCta";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/60 to-white space-y-16 md:space-y-24 pb-20">
      {/* 1. Cinematic Luxury Hero Banner */}
      <section className="w-full">
        <Banner />
      </section>

      {/* Main Content Sections with Responsive Width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-28">
        {/* 2. Popular Services & Treatments Category Showcase */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs uppercase tracking-widest font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                SIGNATURE EXPERIENCES
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                Explore by Category & Treatment
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm max-w-xl">
                From precision fades to rejuvenating therapies, select your desired service to discover verified artists.
              </p>
            </div>

            <button
              onClick={() => navigate("/explore")}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer group shrink-0"
            >
              <span>View All Categories</span>
              <ArrowForwardIcon sx={{ fontSize: 16 }} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Service Cards Slider / Flex Grid */}
          <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent">
            {services.map((item) => (
              <div key={item.id} className="shrink-0">
                <HomeServiceCard item={item} />
              </div>
            ))}
          </div>
        </section>

        {/* 3. Featured & Trending Salons */}
        <section className="pt-2">
          <SalonList />
        </section>

        {/* 4. Editorial Split Showcase: The SalonBook Experience */}
        <section className="relative rounded-3xl bg-slate-900 text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl border border-slate-800">
          {/* Subtle Ambient Golden Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs uppercase tracking-widest font-extrabold border border-amber-500/30">
                <AutoAwesomeOutlinedIcon sx={{ fontSize: 14 }} />
                THE SALONBOOK STANDARD
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]">
                Elevate Your Personal Grooming & Beauty Ritual
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                We believe booking a haircut, color transformation, or massage therapy should feel as calm and enjoyable as the appointment itself. SalonBook unites leading neighborhood studios with seamless digital scheduling.
              </p>

              {/* Quality Checklist */}
              <div className="space-y-3 pt-2">
                {[
                  "Verified Master Stylists & Aesthetic Specialists",
                  "Sterilized Equipment & Medical-Grade Hygiene Protocols",
                  "Guaranteed Appointment Slots With Zero Waiting Time",
                  "Transparent Menu Pricing With No Hidden Surcharges",
                ].map((text, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <CheckCircleOutlinedIcon sx={{ fontSize: 15 }} />
                    </span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/explore")}
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all duration-200 hover:scale-105 active:scale-95 inline-flex items-center gap-2"
                >
                  <ContentCutOutlinedIcon fontSize="small" />
                  <span>Explore Verified Salons</span>
                </button>

                <button
                  onClick={() => navigate("/about")}
                  className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition-all duration-200"
                >
                  Our Story & Values
                </button>
              </div>
            </div>

            {/* Right Artistic Staggered Image Showcase */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4 relative">
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden shadow-lg h-56 sm:h-64 border border-white/10 group">
                  <img
                    src="https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Salon Treatment"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs font-bold text-white px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md">
                    Hair Transformations
                  </span>
                </div>

                <div className="relative rounded-2xl overflow-hidden shadow-lg h-44 sm:h-52 border border-white/10 group">
                  <img
                    src="https://images.pexels.com/photos/3331488/pexels-photo-3331488.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Artisan Barbershop"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs font-bold text-white px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md">
                    Artisan Barbering
                  </span>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="relative rounded-2xl overflow-hidden shadow-lg h-44 sm:h-52 border border-white/10 group">
                  <img
                    src="https://images.pexels.com/photos/5069455/pexels-photo-5069455.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Spa Wellness"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs font-bold text-white px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md">
                    Tranquil Spa Rituals
                  </span>
                </div>

                <div className="relative rounded-2xl overflow-hidden shadow-lg h-56 sm:h-64 border border-white/10 group">
                  <img
                    src="https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Facial Care"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs font-bold text-white px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md">
                    Bridal & Glow
                  </span>
                </div>
              </div>

              {/* Floating Stat Badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950/90 backdrop-blur-xl border border-amber-400/40 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <div className="text-left">
                  <p className="text-xs font-extrabold text-amber-300">500+ Top Studios</p>
                  <p className="text-[10px] text-slate-300">Verified & Booking Now</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Four Simple Steps: How It Works */}
        <section>
          <HowItWorks />
        </section>

        {/* 6. Why Choose Us: Value Pillars */}
        <section>
          <WhyChooseUs />
        </section>

        {/* 7. Client Testimonials & Social Proof */}
        <section>
          <TestimonialSection />
        </section>

        {/* 8. Conversion CTA */}
        <section>
          <HomeCta />
        </section>
      </div>
    </div>
  );
};

export default Home;

