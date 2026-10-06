import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <span className="text-2xl">✂️</span>
            <span className="text-xl font-bold tracking-tight text-white">SalonBook</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Discover top-rated beauty and wellness destinations, view verified services, and book appointments seamlessly in real-time.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            <li><button onClick={() => navigate("/")} className="hover:text-amber-400 transition-colors">Home</button></li>
            <li><button onClick={() => navigate("/explore")} className="hover:text-amber-400 transition-colors">Explore Salons</button></li>
            <li><button onClick={() => navigate("/bookings")} className="hover:text-amber-400 transition-colors">My Appointments</button></li>
            <li><button onClick={() => navigate("/profile")} className="hover:text-amber-400 transition-colors">Customer Profile</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Popular Services</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li>Hair Styling & Cuts</li>
            <li>Beard Grooming & Shave</li>
            <li>Bridal & Party Makeup</li>
            <li>Facial & Skin Care</li>
            <li>Spa & Body Relaxation</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">For Salon Owners</h4>
          <p className="text-slate-400 text-sm mb-4">
            Grow your salon business with automated bookings, calendar management, and customer reach.
          </p>
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { mode: "signup", role: "SALON_OWNER" } }));
            }}
            className="px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors"
          >
            Become a Partner
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} SalonBook Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          <span className="hover:text-slate-400 cursor-pointer">Support</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

