import React from "react";
// import Grid2 from '@mui/material/Grid2'
import { Avatar, Box, Grid, IconButton, Rating } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { red } from "@mui/material/colors";

const ReviewCard = () => {
  return (
    <div className="flex justify-between">
      <div className="w-[80%]">
        <Grid container gap={3}>
        <Grid size={1.5}>
          <Box>
            <Avatar
              className="text-white"
              sx={{ width: 56, height: 56, bgcolor: "#9155FD" }}
            ></Avatar>
          </Box>
        </Grid>

        <Grid size={9}>
          <div className="space-y-2">
            <p className="font-semibold text-lg">Jay Shree</p>
            <p className="opacity-70">2026-09-05T12:26:00.000</p>
          </div>
          <div>
            <Rating readOnly 
                value={4.5} 
                name="half-rating" 
                defaultValue={4.5}
                precision={0.5}/>
          </div>
          <p>This salon provides great service</p>
        </Grid>
      </Grid>
      </div>
      <IconButton><Delete sx={{
        color:red[700]
      }} /></IconButton>
    </div>
  );
};

export default ReviewCard;
