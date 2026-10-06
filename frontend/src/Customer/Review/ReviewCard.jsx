import React, { useState } from "react";
// import Grid2 from '@mui/material/Grid2'
import { Avatar, Box, Button, Grid, IconButton, Rating, TextField } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import api from "../../config/api";

const ReviewCard = ({ review, currentUserId, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [reviewText, setReviewText] = useState(review.reviewText || "");
  const [rating, setRating] = useState(Number(review.rating) || 0);
  const [error, setError] = useState("");
  const isOwner = Number(review.userId) === Number(currentUserId);

  const saveReview = async () => {
    try {
      const { data } = await api.put(`/api/reviews/${review.id}`, { reviewText, rating });
      onUpdate(data);
      setEditing(false);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    }
  };

  const deleteReview = async () => {
    try {
      await api.delete(`/api/reviews/${review.id}`);
      onDelete(review.id);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    }
  };

  return (
    <div className="flex justify-between">
      <div className="w-[80%]">
        <Grid container gap={3}>
        <Grid size={1.5}>
          <Box>
            <Avatar
              className="text-white"
              sx={{ width: 56, height: 56, bgcolor: "#52745b" }}
            >{String(review.userId || "C").slice(0, 1)}</Avatar>
          </Box>
        </Grid>

        <Grid size={9}>
          <div className="space-y-2">
            <p className="font-semibold text-lg">Customer {review.userId}</p>
            <p className="opacity-70">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}</p>
          </div>
          <div>
          <Rating readOnly value={Number(review.rating) || 0} name="review-rating" precision={0.5}/>
          </div>
          {editing ? <div className="space-y-3">
            <TextField fullWidth multiline minRows={3} value={reviewText} onChange={(event) => setReviewText(event.target.value)} />
            <Rating value={rating} onChange={(event, value) => setRating(value || 0)} precision={0.5} />
            <Button size="small" variant="contained" onClick={saveReview}>Save</Button>
            <Button size="small" onClick={() => setEditing(false)}>Cancel</Button>
          </div> : <p>{review.reviewText}</p>}
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        </Grid>
      </Grid>
      </div>
      {isOwner && <div className="flex items-start">
        <IconButton aria-label="Edit review" onClick={() => setEditing(true)}><Edit /></IconButton>
        <IconButton aria-label="Delete review" onClick={deleteReview}><Delete color="error" /></IconButton>
      </div>}
    </div>
  );
};

export default ReviewCard;
