import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";

const HomeCta = () => {
  const navigate = useNavigate();

  return (
    <section className="relative rounded-3xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 p-8 sm:p-14 md:p-16 text-white overflow-hidden shadow-2xl border border-amber-500/30">
      {/* Decorative Background Accents */}
      <div className="absolute -top-16 -right-16 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-amber-950/40 rounded-full blur-2xl pointer-events-none" />

      {/* Decorative Icon Watermark */}
      <div className="absolute right-6 bottom-4 opacity-10 text-9xl select-none pointer-events-none hidden md:block">
        ✨
      </div>

      <div className="relative z-10 max-w-2xl space-y-5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-200 text-xs uppercase tracking-widest font-extrabold border border-white/20">
          YOUR BEAUTY JOURNEY STARTS HERE
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.2]">
          Ready to Experience Exceptional Salon Care?
        </h2>

        <p className="text-amber-100 text-sm sm:text-base leading-relaxed max-w-xl">
          Join thousands of clients who discover vetted hair artists, premier spas, and artisan grooming through SalonBook every day.
        </p>

        <div className="pt-3 flex flex-wrap items-center gap-4">
          <Button
            variant="contained"
            onClick={() => navigate("/explore")}
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: "white",
              color: "#B45309",
              fontWeight: 700,
              px: 4,
              py: 1.6,
              borderRadius: "9999px",
              textTransform: "none",
              fontSize: "0.95rem",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)",
              "&:hover": {
                bgcolor: "#FFFBEB",
                transform: "translateY(-1px)",
                boxShadow: "0 15px 30px -5px rgba(0,0,0,0.25)",
              },
            }}
          >
            Explore Salons
          </Button>

          <Button
            variant="outlined"
            startIcon={<StorefrontOutlinedIcon />}
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent("open-auth-modal", {
                  detail: { mode: "signup", role: "SALON_OWNER" },
                })
              );
            }}
            sx={{
              borderColor: "rgba(255,255,255,0.6)",
              color: "white",
              fontWeight: 600,
              px: 3.5,
              py: 1.5,
              borderRadius: "9999px",
              textTransform: "none",
              fontSize: "0.95rem",
              "&:hover": {
                borderColor: "white",
                bgcolor: "rgba(255,255,255,0.15)",
                transform: "translateY(-1px)",
              },
            }}
          >
            Register Your Salon
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HomeCta;
