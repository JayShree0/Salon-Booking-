import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      // This page shows the details of the signed in user,
      // so we send guests back to the home page.
      if (!localStorage.getItem("jwt")) {
        navigate("/");
        return;
      }

      try {
        const [userResponse, bookingResponse] = await Promise.all([
          api.get("/api/users/profile"),
          api.get("/api/bookings/customer"),
        ]);
        setUser(userResponse.data);
        setBookings(bookingResponse.data || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  if (loading) return <p className="px-5 py-10 text-gray-600">Loading your profile...</p>;
  if (error) return <p role="alert" className="px-5 py-10 text-red-700">{error}</p>;
  if (!user) return null;

  const confirmedBookings = bookings.filter((booking) => booking.status === "CONFIRMED").length;

  return (
    <div className="px-5 md:flex flex-col items-center mt-10 min-h-screen">
      <div className="w-full md:w-[35rem] space-y-6">
        <h1 className="text-3xl font-bold">My Profile</h1>

        <div className="p-5 rounded-md bg-slate-100 space-y-2">
          <p className="text-2xl font-bold">{user.fullName || user.username}</p>
          <p>{user.email}</p>
          <p>Username: {user.username}</p>
          <p>Account type: {user.role}</p>
          {user.phone && <p>Phone: {user.phone}</p>}
        </div>

        <div className="p-5 rounded-md bg-slate-100 space-y-2">
          <p className="font-semibold">Your bookings</p>
          <p>{bookings.length} total bookings</p>
          <p>{confirmedBookings} confirmed bookings</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
