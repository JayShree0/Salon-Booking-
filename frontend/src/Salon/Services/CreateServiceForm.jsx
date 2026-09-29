// import React from 'react'

// const CreateServiceForm = () => {
//   return (
//     <div>CreateServiceForm</div>
//   )
// }

// export default CreateServiceForm

import { AddPhotoAlternate, Close } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";

const CreateServiceForm = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      image: "",
      description: "",
      price: "",
      duration: "",
      category: "",
    },
    onSubmit: (values) => {
      console.log("Submitting", values);
    },
  });
  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={formik.handleSubmit}
        className="space-y-4 p-4 w-full lg:w-1/2"
      >
        <Grid container spacing={2}>
          <Grid className="w-24 h-24" size={{ xs: 12 }}>
            {false ? (
              <div className="relative border">
                <img
                  className="w-24 h-24 object-cover"
                  src="https://cdn.pixabay.com/photo/2020/05/24/02/00/barber-shop-5212059_1280.jpg"
                  alt=""
                />
                <IconButton
                  className=""
                  size="small"
                  color="error"
                  sx={{ position: "absolute", top: 0, right: 0 }}
                >
                  <Close sx={{ fontSize: "1rem" }} />
                </IconButton>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  id="fileInput"
                  style={{
                    display: "none",
                  }}
                />
                <label className="relative" htmlFor="fileInput">
                  <span className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-400">
                    <AddPhotoAlternate className="text-gray-700" />
                  </span>
                  {false && (
                    <div className="absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center">
                      <CircularProgress />
                    </div>
                  )}
                </label>
              </>
            )}
          </Grid>
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
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formik.values.category}
                label="category"
                name="category"
                onChange={formik.handleChange}
              >
                
                {/* This category will come form the backend and it should be the list of categories in the drop down menu*/}
                {[1,1,1,1,1,1].map((item, index) => <MenuItem value={"haircut" + index}>Hair cut</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={12}>
            <Button
              type="submit"
              variant="outlined"
              fullWidth
              sx={{ py: ".8rem" }}
            >
              Create Category
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default CreateServiceForm;
