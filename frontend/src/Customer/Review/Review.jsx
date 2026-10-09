import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/api";
import ReviewCard from "./ReviewCard";
import RatingCard from "./RatingCard";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import CircularProgress from "@mui/material/CircularProgress";

const Review = ({ reviews: propReviews, onOpenWriteReview }) => {
  const { id: salonId } = useParams();
  const [reviews, setReviews] = useState(propReviews || []);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(propReviews ? false : true);
  const [error, setError] = useState("");

  const loadReviews = async () => {
    try {
      const reviewResponse = await api.get(`/api/reviews/salon/${salonId}`);
      setReviews(reviewResponse.data || []);
      setError("");

      if (localStorage.getItem("jwt")) {
        try {
          const userResponse = await api.get("/api/users/profile");
          setUserId(userResponse.data?.id || null);
        } catch {
          setUserId(null);
        }
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propReviews !== undefined) {
      setReviews(propReviews);
      setLoading(false);
      if (localStorage.getItem("jwt")) {
        api
          .get("/api/users/profile")
          .then(({ data }) => setUserId(data?.id || null))
          .catch(() => setUserId(null));
      }
    } else {
      loadReviews();
    }
  }, [salonId, propReviews]);

  const updateReview = (updatedReview) => {
    setReviews((current) =>
      current.map((item) => (item.id === updatedReview.id ? updatedReview : item))
    );
  };

  const deleteReview = (reviewId) => {
    setReviews((current) => current.filter((item) => item.id !== reviewId));
  };

  if (loading) {
    return (
      <div className="py-16 text-center space-y-3">
        <CircularProgress size={36} sx={{ color: "#d97706" }} />
        <p className="text-xs font-semibold text-slate-500">Loading client reviews...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
      {/* Left: Overall Rating Card */}
      <div className="w-full lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-24 space-y-4">
        <RatingCard reviews={reviews} />

        {onOpenWriteReview && (
          <button
            type="button"
            onClick={onOpenWriteReview}
            className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-xs transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <RateReviewOutlinedIcon sx={{ fontSize: 16 }} />
            <span>Write a Client Review</span>
          </button>
        )}
      </div>

      {/* Right: Reviews List */}
      <div className="flex-1 min-w-0 w-full space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
              Client Testimonials & Feedback
            </h2>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {reviews.length}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-white text-slate-400 flex items-center justify-center mx-auto shadow-2xs">
              <StarOutlineRoundedIcon sx={{ fontSize: 24 }} />
            </div>
            <h3 className="font-bold text-sm text-slate-800">No Reviews Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Be the first client to rate this salon and share your styling experience with the community.
            </p>
            {onOpenWriteReview && (
              <button
                type="button"
                onClick={onOpenWriteReview}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <RateReviewOutlinedIcon sx={{ fontSize: 15 }} />
                <span>Write the First Review</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                currentUserId={userId}
                onUpdate={updateReview}
                onDelete={deleteReview}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Review;
