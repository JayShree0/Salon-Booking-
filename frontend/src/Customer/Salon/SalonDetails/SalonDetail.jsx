import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../config/api";

const SalonDetail = () => {
  const { id } = useParams();
  const [salon, setSalon] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/api/salons/${id}`)
      .then(({ data }) => setSalon(data))
      .catch((requestError) => setError(requestError.response?.data?.message || requestError.message));
  }, [id]);

  if (error) return <p role="alert" className="py-8 text-red-700">Unable to load this salon: {error}</p>;
  if (!salon) return <p className="py-8 text-gray-600">Loading salon details...</p>;

  const images = salon.images?.filter(Boolean) || [];
  const fallbackImage = "https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=900";

  const handleScrollToCategories = () => {
    const el = document.getElementById("salon-categories-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6 mb-12">
      {/* Photo Gallery Grid */}
      <section className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <img
            className="w-full rounded-2xl h-[16rem] sm:h-[20rem] object-cover shadow-sm"
            src={images[0] || fallbackImage}
            alt={`${salon.name} salon`}
          />
        </div>

        <div className="col-span-1 hidden sm:block">
          <img
            className="w-full rounded-2xl h-[12rem] object-cover shadow-xs"
            src={images[1] || images[0] || fallbackImage}
            alt={`${salon.name} salon interior`}
          />
        </div>

        <div className="col-span-1 hidden sm:block">
          <img
            className="w-full rounded-2xl h-[12rem] object-cover shadow-xs"
            src={images[2] || images[0] || fallbackImage}
            alt={`${salon.name} salon workspace`}
          />
        </div>
      </section>

      {/* Salon Info Header with Quick "View All Categories" Action */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-50/70 border border-slate-200/80 rounded-2xl">
        <div className="space-y-1 text-left">
          <h1 className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">{salon.name}</h1>
          <p className="text-slate-600 text-sm font-medium">{[salon.address, salon.city].filter(Boolean).join(", ")}</p>
          <p className="text-slate-500 text-xs">Hours: {String(salon.openTime || "09:00").slice(0, 5)} to {String(salon.closeTime || "18:00").slice(0, 5)}</p>
        </div>

        <button
          type="button"
          onClick={handleScrollToCategories}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-600/20 active:scale-95 transition-all duration-200 cursor-pointer shrink-0 self-start sm:self-center"
        >
          <span>View All Categories</span>
          <span>↓</span>
        </button>
      </section>
    </div>
  );
};

export default SalonDetail;
