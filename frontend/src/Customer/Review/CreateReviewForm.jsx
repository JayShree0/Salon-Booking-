import React, { useState } from "react";
import { Rating, Alert, CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import api from "../../config/api";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

const RATING_LABELS = {
  1: "Poor - Below expectations",
  2: "Fair - Room for improvement",
  3: "Good - Satisfactory experience",
  4: "Very Good - Exceeded expectations",
  5: "Exceptional - Highly recommended!",
};

const CreateReviewForm = ({ onReviewCreated }) => {
  const { id: salonId } = useParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(-1);

  const isAuthenticated = Boolean(localStorage.getItem("jwt"));

  const formik = useFormik({
    initialValues: { reviewText: "", rating: 5 },
    onSubmit: async (values) => {
      if (!isAuthenticated) {
        setError("Please sign in to your account before posting a review.");
        window.dispatchEvent(
          new CustomEvent("open-auth-modal", { detail: { mode: "login" } })
        );
        return;
      }

      if (!values.rating || values.rating < 1) {
        setError("Please select a star rating between 1 and 5.");
        return;
      }

      if (!values.reviewText.trim()) {
        setError("Please share a brief note about your salon visit.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        await api.post(`/api/reviews/salon/${salonId}`, {
          reviewText: values.reviewText.trim(),
          rating: Number(values.rating),
        });

        setSuccess(true);
        formik.resetForm();

        setTimeout(() => {
          if (onReviewCreated) onReviewCreated();
        }, 800);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            requestError.message ||
            "Unable to post review at this time."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <RateReviewOutlinedIcon sx={{ fontSize: 28 }} />
        </div>
        <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">
          Share Your Salon Experience
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Sign in to leave verified reviews, rate your stylists, and help other clients discover great beauty rituals.
        </p>
        <button
          type="button"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("open-auth-modal", { detail: { mode: "login" } })
            )
          }
          className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-amber-600/20 active:scale-95 transition-all cursor-pointer"
        >
          <LoginOutlinedIcon sx={{ fontSize: 16 }} />
          <span>Sign In to Write a Review</span>
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6"
    >
      <div className="text-center space-y-1.5 pb-2 border-b border-slate-100">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          CLIENT FEEDBACK
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Write a Review
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          How was your treatment, stylist service, and studio atmosphere?
        </p>
      </div>

      {error && (
        <Alert severity="error" sx={{ borderRadius: "12px", fontSize: "0.85rem" }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          icon={<CheckCircleOutlineRoundedIcon />}
          sx={{ borderRadius: "12px", fontSize: "0.85rem" }}
        >
          Your review was posted successfully! Updating review list...
        </Alert>
      )}

      {/* Star Rating Selector */}
      <div className="space-y-2 text-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
        <label className="text-xs font-bold text-slate-700 block">
          Select Your Overall Rating
        </label>
        <div className="flex items-center justify-center gap-1">
          <Rating
            id="rating"
            name="rating"
            value={formik.values.rating}
            precision={1}
            size="large"
            onChange={(_, val) => formik.setFieldValue("rating", val || 5)}
            onChangeActive={(_, val) => setHoverRating(val)}
            icon={<StarRoundedIcon sx={{ fontSize: 36, color: "#d97706" }} />}
            emptyIcon={<StarRoundedIcon sx={{ fontSize: 36, color: "#cbd5e1" }} />}
          />
        </div>
        <p className="text-xs font-semibold text-amber-700 min-h-4">
          {RATING_LABELS[hoverRating !== -1 ? hoverRating : formik.values.rating] || ""}
        </p>
      </div>

      {/* Review Textarea */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="reviewText" className="text-xs font-bold text-slate-700">
            Your Honest Feedback
          </label>
          <span className="text-[11px] text-slate-400">
            {formik.values.reviewText.length}/500
          </span>
        </div>
        <textarea
          id="reviewText"
          name="reviewText"
          rows={4}
          maxLength={500}
          value={formik.values.reviewText}
          onChange={formik.handleChange}
          placeholder="Describe the service quality, cleanliness, waiting time, and overall experience..."
          className="w-full p-3.5 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all resize-none"
        />
      </div>

      {/* Submit Action */}
      <button
        type="submit"
        disabled={loading || !formik.values.reviewText.trim()}
        className={`w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 ${
          loading || !formik.values.reviewText.trim()
            ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            : "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-amber-600/20 cursor-pointer"
        }`}
      >
        {loading ? (
          <>
            <CircularProgress size={16} sx={{ color: "white" }} />
            <span>Publishing Review...</span>
          </>
        ) : (
          <span>Publish Client Review</span>
        )}
      </button>
    </form>
  );
};

export default CreateReviewForm;
