import React from "react";

const RoleSelectionCard = ({ onSelectRole }) => {
  return (
    <div className="py-4 space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">How would you like to use SalonBook?</h2>
        <p className="text-slate-500 text-sm">Choose your account type to get started</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Customer Card */}
        <div
          onClick={() => onSelectRole("CUSTOMER")}
          className="group relative cursor-pointer rounded-2xl border-2 border-slate-200 hover:border-amber-500 bg-white p-6 transition-all duration-200 hover:shadow-lg flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              👤
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
              Customer
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Discover verified salons, explore curated services, and book appointments effortlessly.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-amber-600">
            <span>Continue as Customer</span>
            <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>

        {/* Salon Owner Card */}
        <div
          onClick={() => onSelectRole("SALON_OWNER")}
          className="group relative cursor-pointer rounded-2xl border-2 border-slate-200 hover:border-amber-500 bg-white p-6 transition-all duration-200 hover:shadow-lg flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              ✂️
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
              Salon Owner
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Register your salon, manage service offerings, track bookings, and grow your clientele.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-amber-600">
            <span>Continue as Salon Owner</span>
            <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionCard;

