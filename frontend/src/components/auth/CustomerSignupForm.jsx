import React, { useState } from "react";
import { TextField, Button, Alert, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
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
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500"];

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
        fullName: form.fullName,
        username: form.username,
        email: form.email,
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
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Create Customer Account</h2>
          <p className="text-xs text-slate-500">Sign up to book salon appointments effortlessly</p>
        </div>
        <button
          type="button"
          onClick={onBackToRoles}
          className="text-xs text-amber-600 hover:underline font-medium"
        >
          Change Role
        </button>
      </div>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        fullWidth
        size="small"
        label="Full Name"
        value={form.fullName}
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        required
      />

      <TextField
        fullWidth
        size="small"
        label="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        required
      />

      <TextField
        fullWidth
        size="small"
        type="email"
        label="Email Address"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      <div className="space-y-1">
        <TextField
          fullWidth
          size="small"
          type={showPassword ? "text" : "password"}
          label="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {form.password && (
          <div className="pt-1 space-y-1">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className={`h-full ${strengthColors[strength - 1] || "bg-red-400"} transition-all duration-300`}
                style={{ width: `${(strength / 4) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 text-right">
              Strength: <span className="font-medium text-slate-600">{strengthLabels[strength - 1] || "Very Weak"}</span>
            </p>
          </div>
        )}
      </div>

      <TextField
        fullWidth
        size="small"
        type="password"
        label="Confirm Password"
        value={form.confirmPassword}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        required
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={loading}
        className="py-2.5"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </Button>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-amber-600 font-semibold hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
};

export default CustomerSignupForm;

