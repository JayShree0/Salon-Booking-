import React, { useState } from "react";
import { TextField, Button, Alert, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
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
      const data = await authApi.login({ email, password });
      if (!data.jwt) {
        throw new Error(data.message || "Invalid credentials received.");
      }

      localStorage.setItem("jwt", data.jwt);
      if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
      if (data.role) localStorage.setItem("role", data.role);

      if (onSuccess) onSuccess();
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
        <p className="text-sm text-slate-500">Sign in to manage your appointments and services</p>
      </div>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        fullWidth
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <TextField
        fullWidth
        type={showPassword ? "text" : "password"}
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={loading}
        className="py-3"
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="text-center pt-2">
        <p className="text-sm text-slate-500">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-amber-600 font-semibold hover:underline"
          >
            Create one
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;

