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

  return (
    <div className="space-y-5 mb-20">
      <section className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <img
            className="w-full rounded-md h-[15rem] object-cover"
            src={images[0] || fallbackImage}
            alt={`${salon.name} salon`}
          />
        </div>

        <div className="col-span-1 hidden sm:block">
          <img
            className="w-full rounded-md h-[15rem] object-cover"
            src={images[1] || images[0] || fallbackImage}
            alt={`${salon.name} salon interior`}
          />
        </div>

        <div className="col-span-1 hidden sm:block">
          <img
            className="w-full rounded-md h-[15rem] object-cover"
            src={images[2] || images[0] || fallbackImage}
            alt={`${salon.name} salon workspace`}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h1 className="font-bold text-3xl">{salon.name}</h1>
        <p>{[salon.address, salon.city].filter(Boolean).join(", ")}</p>
        <p>Hours: {String(salon.openTime || "").slice(0, 5)} to {String(salon.closeTime || "").slice(0, 5)}</p>
      </section>
    </div>
  );
};

export default SalonDetail;
