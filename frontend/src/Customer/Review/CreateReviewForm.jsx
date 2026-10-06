import { Box, Button, InputLabel, Rating, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/api";

const CreateReviewForm = ({ onReviewCreated }) => {
  const { id: salonId } = useParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: { reviewText: "", rating: 0 },
    onSubmit: async (values) => {
      // A review belongs to a user, so we need a signed in user first.
      if (!localStorage.getItem("jwt")) {
        setError("Please sign in before writing a review.");
        return;
      }

      setLoading(true);
      setError("");
      try {
        await api.post(`/api/reviews/salon/${salonId}`, values);
        formik.resetForm();
        onReviewCreated();
      } catch (requestError) {
        setError(requestError.response?.data?.message || requestError.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box
      component={"form"}
      onSubmit={formik.handleSubmit}
      sx={{ mt: 3 }}
      className="mx-auto w-full max-w-xl space-y-5"
    >
      <TextField
        fullWidth
        id="reviewText"
        name="reviewText"
        label="Review"
        variant="outlined"
        multiline
        rows={4}
        value={formik.values.reviewText}
        onChange={formik.handleChange}
      />

      <div className="space-y-2">
        <InputLabel>Rating</InputLabel>
        <Rating
            id="rating"
            name="rating"
            value={formik.values.rating}
            onChange={(event, newValue) => formik.setFieldValue("rating", newValue || 0)}
          precision={0.5}
        />
      </div>

        {error && <p role="alert" className="text-red-700">{error}</p>}
        <Button variant="contained" color="primary" type="submit" disabled={loading || !formik.values.rating || !formik.values.reviewText.trim()}>
          {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </Box>
  );
};

export default CreateReviewForm;
