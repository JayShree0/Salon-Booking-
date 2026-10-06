import { Button, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import api from "../../config/api";

const CategoryForm = ({ onCreated }) => {
  const [error, setError] = useState("");
  const formik = useFormik({
    initialValues: { name: "", image: "" },
    onSubmit: async (values) => {
      setError("");
      try {
        await api.post("/api/categories/salon-owner", values);
        formik.resetForm();
        onCreated?.();
      } catch (requestError) {
        setError(requestError.response?.data?.message || requestError.message);
      }
    },
  });

  return (
    <div className="flex justify-center items-center">
      <form onSubmit={formik.handleSubmit} className="space-y-4 p-4 w-full lg:w-1/2">
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField fullWidth id="name" name="name" label="Category name" value={formik.values.name} onChange={formik.handleChange} required />
          </Grid>
          <Grid size={12}>
            <TextField fullWidth id="image" name="image" label="Image URL (optional)" value={formik.values.image} onChange={formik.handleChange} />
          </Grid>
          {error && <Grid size={12}><p role="alert" className="text-red-700">{error}</p></Grid>}
          <Grid size={12}>
            <Button type="submit" variant="outlined" fullWidth sx={{ py: ".8rem" }} disabled={formik.isSubmitting}>Create Category</Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default CategoryForm;
