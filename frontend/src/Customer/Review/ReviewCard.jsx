import React, { useState } from "react";
import { Rating, IconButton, Tooltip, CircularProgress } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import api from "../../config/api";

const ReviewCard = ({ review, currentUserId, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [reviewText, setReviewText] = useState(review.reviewText || "");
  const [rating, setRating] = useState(Number(review.rating) || 5);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const isOwner =
    currentUserId && Number(review.userId) === Number(currentUserId);

  const saveReview = async () => {
    if (!reviewText.trim()) return;
    setSaving(true);
    setError("");
    try {
      const { data } = await api.put(`/api/reviews/${review.id}`, {
        reviewText: reviewText.trim(),
        rating,
      });
      onUpdate(data);
      setEditing(false);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteReview = async () => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    setDeleting(true);
    try {
      await api.delete(`/api/reviews/${review.id}`);
      onDelete(review.id);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    } finally {
      setDeleting(false);
    }
  };

  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Verified Visit";

  return (
    <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3 text-left">
      {/* Header: User avatar + Meta + Action buttons */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
            {`U${review.userId || ""}`.slice(0, 2)}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-bold text-sm text-slate-900 truncate">
                Client #{review.userId}
              </p>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200 shrink-0">
                <CheckCircleRoundedIcon sx={{ fontSize: 10 }} />
                <span>Verified</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{formattedDate}</p>
          </div>
        </div>

        {/* Edit / Delete actions for review owner */}
        {isOwner && !editing && (
          <div className="flex items-center gap-1 shrink-0">
            <Tooltip title="Edit review">
              <IconButton
                size="small"
                onClick={() => setEditing(true)}
                sx={{ color: "#64748b", "&:hover": { color: "#d97706" } }}
              >
                <EditOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete review">
              <IconButton
                size="small"
                onClick={deleteReview}
                disabled={deleting}
                sx={{ color: "#64748b", "&:hover": { color: "#e11d48" } }}
              >
                {deleting ? (
                  <CircularProgress size={14} />
                ) : (
                  <DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                )}
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>

      {/* Stars */}
      {!editing && (
        <div className="flex items-center gap-2">
          <Rating
            readOnly
            value={Number(review.rating) || 5}
            precision={0.5}
            size="small"
            icon={<StarRoundedIcon sx={{ fontSize: 18, color: "#d97706" }} />}
            emptyIcon={<StarRoundedIcon sx={{ fontSize: 18, color: "#cbd5e1" }} />}
          />
          <span className="text-xs font-bold text-slate-700">
            {Number(review.rating).toFixed(1)}
          </span>
        </div>
      )}

      {/* Review Body or Edit Form */}
      {editing ? (
        <div className="space-y-3 pt-2">
          <Rating
            value={rating}
            precision={1}
            onChange={(_, val) => setRating(val || 5)}
            icon={<StarRoundedIcon sx={{ fontSize: 24, color: "#d97706" }} />}
            emptyIcon={<StarRoundedIcon sx={{ fontSize: 24, color: "#cbd5e1" }} />}
          />
          <textarea
            rows={3}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
          />
          {error && <p className="text-xs text-rose-600">{error}</p>}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={saveReview}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {review.reviewText}
        </p>
      )}
    </div>
  );
};

export default ReviewCard;
