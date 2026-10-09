import React, { useState } from "react";
import { TextField, Alert, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import authApi from "../../api/authApi";

const LoginForm = ({ onSuccess, onSwitchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await authApi.login({ email: email.trim(), password });
      if (!data.jwt) {
        throw new Error(data.message || "Invalid credentials received.");
      }

      localStorage.setItem("jwt", data.jwt);
      if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
      if (data.role) localStorage.setItem("role", data.role);

      if (onSuccess) onSuccess();

      const isSalonOwner = data.role === "SALON_OWNER" || data.role === "ROLE_SALON_OWNER";
      if (isSalonOwner) {
        window.location.href = "/salon-dashboard";
      } else {
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2 sm:py-3">
      {/* Brand Header */}
      <div className="text-center space-y-1.5 pb-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-extrabold uppercase tracking-widest border border-amber-200">
          AUTHENTICATION
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome Back
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
          Sign in to manage your bookings, appointments, and studio services
        </p>
      </div>

      {error && (
        <Alert severity="error" sx={{ borderRadius: "12px", py: 0.5, fontSize: "0.85rem" }}>
          {error}
        </Alert>
      )}

      {/* Email Address */}
      <TextField
        fullWidth
        size="small"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MailOutlineOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            bgcolor: "#F8FAFC",
            "&:hover": { bgcolor: "#FFFFFF" },
            "&.Mui-focused": { bgcolor: "#FFFFFF" },
          },
        }}
      />

      {/* Password */}
      <TextField
        fullWidth
        size="small"
        type={showPassword ? "text" : "password"}
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            bgcolor: "#F8FAFC",
            "&:hover": { bgcolor: "#FFFFFF" },
            "&.Mui-focused": { bgcolor: "#FFFFFF" },
          },
        }}
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 shadow-md shadow-amber-600/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <span>Sign In</span>
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </>
        )}
      </button>

      {/* Switch to Signup */}
      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-amber-600 font-bold hover:text-amber-700 hover:underline cursor-pointer"
          >
            Create an account
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;

