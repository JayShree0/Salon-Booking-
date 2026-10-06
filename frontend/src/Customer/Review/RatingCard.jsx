import { Box, Grid, LinearProgress, Rating } from "@mui/material";
import React from "react";

const RatingCard = ({ reviews = [] }) => {
  const average = reviews.length
    ? reviews.reduce((total, review) => total + Number(review.rating || 0), 0) / reviews.length
    : 0;
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => reviews.filter((review) => Math.floor(Number(review.rating)) === rating).length);

  return (
    <div className="border p-5 rounded-md">
      <div className="flex items-center space-x-3 pb-10">
        <Rating
          readOnly
          value={average}
          name="half-rating"
          precision={0.5}
        />
        <p className="opacity-60">{reviews.length}</p>
      </div>
      <Box>
        {[5, 4, 3, 2, 1].map((rating, index) => (
          <Grid key={rating} container justifyContent="center" alignItems="center">
            <Grid size={2}><p>{rating} star</p></Grid>
            <Grid size={7}>
              <LinearProgress sx={{ bgcolor: "#d0d0d0", height: 7, borderRadius: 4 }} variant="determinate" value={reviews.length ? ratingCounts[index] / reviews.length * 100 : 0} color={rating > 3 ? "success" : "warning"} />
            </Grid>
            <Grid size={2}><p className="opacity-50 p-2">{ratingCounts[index]}</p></Grid>
          </Grid>
        ))}
      </Box>
    </div>
  );
};

export default RatingCard;
