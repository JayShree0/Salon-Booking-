// import React from "react";

// const NotFound = () => {
//   return (
//     <div className="flex font-bold text-3xl justify-center items-center h-[80vh]">
//       Page Not Found
//     </div>
//   );
// };

// export default NotFound;

import React from "react";
import { Button } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden bg-slate-950 px-6 py-12 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Dynamic ambient glow backgrounds */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 right-1/4 h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[100px]" />

      {/* Grid line texture */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }}
      />

      <div className="relative z-10 flex max-w-xl flex-col items-center text-center">
        {/* Glowing badge */}
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Status 404
        </span>

        {/* Large stylized 404 header */}
        <div className="relative my-4 select-none">
          <h1 className="text-8xl sm:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-600 drop-shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
            404
          </h1>
          <span className="absolute inset-0 -z-10 blur-2xl opacity-30 text-8xl sm:text-9xl font-black bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
            404
          </span>
        </div>

        {/* Descriptive message */}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
          Lost in the digital ether?
        </h2>
        <p className="mt-3 max-w-md text-sm sm:text-base leading-relaxed text-slate-400">
          The page you are looking for has vanished, been relocated, or never existed at all. Let's get you back on track.
        </p>

        {/* Action buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            startIcon={<HomeRoundedIcon />}
            sx={{
              backgroundColor: "#10b981",
              color: "#ffffff",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "0.75rem",
              padding: "10px 24px",
              boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.35)",
              "&:hover": {
                backgroundColor: "#059669",
                boxShadow: "0 15px 30px -5px rgba(16, 185, 129, 0.45)",
              },
            }}
            className="w-full sm:w-auto"
          >
            Return Home
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackRoundedIcon />}
            sx={{
              borderColor: "rgba(148, 163, 184, 0.2)",
              color: "#cbd5e1",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "0.75rem",
              padding: "10px 24px",
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              "&:hover": {
                borderColor: "rgba(148, 163, 184, 0.4)",
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                color: "#ffffff",
              },
            }}
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;