import React, { useState } from "react";
import { TextField, Alert, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import authApi from "../../api/authApi";

const CustomerSignupForm = ({ onSuccess, onBackToRoles, onSwitchToLogin }) => {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Compute simple password strength (1 to 4)
  const getPasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(form.password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-amber-500", "bg-yellow-500", "bg-emerald-500"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await authApi.signup({
        fullName: form.fullName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        role: "CUSTOMER",
      });

      if (!data.jwt) {
        throw new Error(data.message || "Failed to receive authorization token.");
      }

      localStorage.setItem("jwt", data.jwt);
      if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("role", "CUSTOMER");
      if (onSuccess) onSuccess();
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to register account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-1">
      {/* Top Header & Role Badge */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-extrabold uppercase tracking-widest border border-amber-200">
            CLIENT REGISTRATION
          </span>
          {onBackToRoles && (
            <button
              type="button"
              onClick={onBackToRoles}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-amber-700 font-semibold transition-colors cursor-pointer"
            >
              <ArrowBackIcon sx={{ fontSize: 13 }} />
              <span>Change role</span>
            </button>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Your Account</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Join SalonBook to discover verified studios and book instant rituals.
          </p>
        </div>
      </div>

      {error && (
        <Alert severity="error" sx={{ borderRadius: "12px", fontSize: "0.825rem" }}>
          {error}
        </Alert>
      )}

      {/* Form Fields Grid */}
      <div className="space-y-3.5">
        <TextField
          fullWidth
          size="small"
          label="Full Name"
          placeholder="e.g. Sophia Montgomery"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <TextField
            fullWidth
            size="small"
            label="Username"
            placeholder="e.g. sophiam"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AlternateEmailOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
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

          <TextField
            fullWidth
            size="small"
            type="email"
            label="Email Address"
            placeholder="sophia@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
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
        </div>

        {/* Password Field with Strength Meter */}
        <div className="space-y-1">
          <TextField
            fullWidth
            size="small"
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="Minimum 6 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
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

          {form.password && (
            <div className="pt-1 px-0.5 space-y-1">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  className={`h-full ${strengthColors[strength - 1] || "bg-red-400"} transition-all duration-300`}
                  style={{ width: `${(strength / 4) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span>At least 6 characters</span>
                <span>
                  Strength:{" "}
                  <strong className="text-slate-700">{strengthLabels[strength - 1] || "Very Weak"}</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <TextField
          fullWidth
          size="small"
          type={showConfirmPassword ? "text" : "password"}
          label="Confirm Password"
          placeholder="Repeat your password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                  {showConfirmPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
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
      </div>

      {/* Submit Action Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-amber-600/20 active:scale-95 disabled:opacity-60 transition-all cursor-pointer leading-none"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <span>Create Client Account</span>
          )}
        </button>
      </div>

      {/* Terms & Switch to Login */}
      <div className="text-center space-y-2 pt-1 border-t border-slate-100">
        <p className="text-[11px] text-slate-400">
          By signing up, you agree to SalonBook's Terms of Service and Privacy Policy.
        </p>

        <p className="text-xs text-slate-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-amber-600 font-bold hover:text-amber-700 hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
};

export default CustomerSignupForm;

