// import React from 'react'

// const CreateServiceForm = () => {
//   return (
//     <div>CreateServiceForm</div>
//   )
// }

// export default CreateServiceForm

import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";

const CreateServiceForm = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data: salon } = await api.get("/api/salons/owner");
        const { data } = await api.get(`/api/categories/salon/${salon.id}`);
        setCategories(data || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || requestError.message);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      image: "",
      description: "",
      price: "",
      duration: "",
      category: "",
    },
    onSubmit: async (values) => {
      setError("");
      try {
        await api.post("/api/service-offering/salon-owner", {
          ...values,
          price: Number(values.price),
          duration: Number(values.duration),
          category: Number(values.category),
        });
        navigate("/salon-dashboard/services");
      } catch (requestError) {
        setError(requestError.response?.data?.message || requestError.message);
      }
    },
  });
  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={formik.handleSubmit}
        className="space-y-4 p-4 w-full lg:w-1/2"
      >
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              id="description"
              name="description"
              label="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              id="price"
              name="price"
              label="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              id="duration"
              name="duration"
              label="duration"
              value={formik.values.duration}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField fullWidth id="image" name="image" label="Image URL (optional)" value={formik.values.image} onChange={formik.handleChange} />
          </Grid>

          <Grid size={12}>
            <FormControl fullWidth>
              <InputLabel id="service-category-label">Category</InputLabel>
              <Select
                labelId="service-category-label"
                id="category"
                value={formik.values.category}
                label="Category"
                name="category"
                onChange={formik.handleChange}
                required
              >
                {categories.map((category) => <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={12}>
            {error && <p role="alert" className="text-red-700">{error}</p>}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ py: ".8rem" }}
              disabled={formik.isSubmitting || loadingCategories || categories.length === 0}
            >
              {formik.isSubmitting ? "Creating..." : "Create service"}
            </Button>
            {!loadingCategories && categories.length === 0 && <p className="pt-2 text-sm text-gray-600">Create a category before adding services.</p>}
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default CreateServiceForm;
