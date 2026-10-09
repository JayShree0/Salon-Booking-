import React, { useState } from "react";
import { TextField, Alert, IconButton, InputAdornment, Chip } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import authApi from "../../api/authApi";
import salonApi from "../../api/salonApi";

const STEPS = [
  { id: 1, label: "Partner Account", desc: "Owner credentials" },
  { id: 2, label: "Studio Info", desc: "Location & contact" },
  { id: 3, label: "Hours & Photos", desc: "Schedule & branding" },
  { id: 4, label: "Review & Launch", desc: "Final verification" },
];

const PRESET_IMAGES = [
  { label: "Luxury Hair Studio", url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80" },
  { label: "Artisan Barber", url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80" },
  { label: "Relaxing Spa", url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80" },
  { label: "Nail Lounge", url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80" },
];

const POPULAR_CITIES = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad"];

const OwnerOnboardingForm = ({ onSuccess, onBackToRoles, onSwitchToLogin }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Consolidated form state
  const [form, setForm] = useState({
    // Step 1: Owner
    fullName: "",
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    // Step 2: Salon
    salonName: "",
    address: "",
    city: "",
    salonPhone: "",
    // Step 3: Business
    openTime: "09:00",
    closeTime: "20:00",
    image: PRESET_IMAGES[0].url,
  });

  // Simple password strength calculation
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

  const handleNext = () => {
    setError("");
    if (activeStep === 0) {
      if (!form.fullName.trim() || !form.username.trim() || !form.email.trim() || !form.password) {
        setError("Please complete all required owner account fields.");
        return;
      }
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
    } else if (activeStep === 1) {
      if (!form.salonName.trim() || !form.address.trim() || !form.city.trim()) {
        setError("Please enter your salon's brand name, address, and city.");
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError("");
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Create the user with role SALON_OWNER
      const authData = await authApi.signup({
        fullName: form.fullName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        role: "SALON_OWNER",
      });

      if (!authData.jwt) {
        throw new Error(authData.message || "Failed to authenticate account.");
      }

      localStorage.setItem("jwt", authData.jwt);
      if (authData.refresh_token) localStorage.setItem("refresh_token", authData.refresh_token);
      localStorage.setItem("role", "SALON_OWNER");

      // 2. Register the salon with the newly obtained JWT
      try {
        await salonApi.createSalon({
          name: form.salonName.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          phoneNumber: form.salonPhone.trim() || form.phoneNumber.trim(),
          email: form.email.trim(),
          openTime: form.openTime + ":00",
          closeTime: form.closeTime + ":00",
          images: [form.image],
        });
      } catch (salErr) {
        console.warn("Salon record creation notice:", salErr.message);
      }

      if (onSuccess) onSuccess();
      window.location.href = "/salon-dashboard";
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to complete salon onboarding.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 py-1">
      {/* Top Header & Role Badge */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-900 text-amber-400 text-[10px] font-extrabold uppercase tracking-widest border border-slate-800">
            PARTNER REGISTRATION
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
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Salon Partner Onboarding</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Step {activeStep + 1} of 4 — <span className="font-semibold text-slate-700">{STEPS[activeStep].label}</span>
          </p>
        </div>
      </div>

      {/* Modern Stepper Indicator */}
      <div className="grid grid-cols-4 gap-2 pt-1 pb-1">
        {STEPS.map((step, idx) => {
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div key={step.id} className="space-y-1.5">
              <div
                className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                  isDone
                    ? "bg-amber-600"
                    : isCurrent
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 shadow-xs"
                    : "bg-slate-200"
                }`}
              />
              <div className="hidden sm:block">
                <p
                  className={`text-[11px] font-bold truncate leading-tight ${
                    isCurrent ? "text-amber-700 font-extrabold" : isDone ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <Alert severity="error" sx={{ borderRadius: "12px", fontSize: "0.825rem" }}>
          {error}
        </Alert>
      )}

      {/* Step 1: Owner Information */}
      {activeStep === 0 && (
        <div className="space-y-3.5">
          <TextField
            fullWidth
            size="small"
            label="Owner Full Name"
            placeholder="e.g. Alexander Sterling"
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
              placeholder="e.g. alexander_s"
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
              placeholder="owner@salon.com"
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

          <TextField
            fullWidth
            size="small"
            label="Personal Phone Number"
            placeholder="+91 98765 43210"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
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
        </div>
      )}

      {/* Step 2: Salon Details */}
      {activeStep === 1 && (
        <div className="space-y-3.5">
          <TextField
            fullWidth
            size="small"
            label="Salon Brand Name"
            placeholder="e.g. Royal Touch Hair & Spa"
            value={form.salonName}
            onChange={(e) => setForm({ ...form, salonName: e.target.value })}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <StorefrontOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
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
            label="Full Physical Address"
            placeholder="e.g. 102 Luxury Boulevard, Bandra West"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
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

          <div className="space-y-1.5">
            <TextField
              fullWidth
              size="small"
              label="City"
              placeholder="e.g. Mumbai"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationCityOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
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

            {/* Quick City suggestions */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[11px] text-slate-400">Quick select:</span>
              {POPULAR_CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, city: c })}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                    form.city.toLowerCase() === c.toLowerCase()
                      ? "bg-amber-100 text-amber-800 border-amber-300 font-bold"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <TextField
            fullWidth
            size="small"
            label="Salon Business Helpline Phone"
            placeholder="e.g. +91 22 2654 3210 (optional)"
            value={form.salonPhone}
            onChange={(e) => setForm({ ...form, salonPhone: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
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
      )}

      {/* Step 3: Operating Schedule & Visuals */}
      {activeStep === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3.5">
            <TextField
              fullWidth
              size="small"
              type="time"
              label="Opening Time"
              value={form.openTime}
              onChange={(e) => setForm({ ...form, openTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccessTimeOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  bgcolor: "#F8FAFC",
                },
              }}
            />
            <TextField
              fullWidth
              size="small"
              type="time"
              label="Closing Time"
              value={form.closeTime}
              onChange={(e) => setForm({ ...form, closeTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccessTimeOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  bgcolor: "#F8FAFC",
                },
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Showcase Image</span>
              <span className="text-[11px] font-normal text-slate-400">Select preset or paste URL</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setForm({ ...form, image: preset.url })}
                  className={`p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                    form.image === preset.url
                      ? "border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20"
                      : "border-slate-200 bg-slate-50 hover:bg-white"
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="h-12 w-full object-cover rounded-lg mb-1"
                  />
                  <p className="text-[10px] font-bold text-slate-700 truncate">{preset.label}</p>
                </button>
              ))}
            </div>

            <TextField
              fullWidth
              size="small"
              label="Custom Image URL"
              placeholder="https://images.unsplash.com/..."
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhotoCameraOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  bgcolor: "#F8FAFC",
                },
              }}
            />
          </div>

          {/* Live Preview Card */}
          <div className="relative h-28 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner group">
            <img
              src={form.image}
              alt="Salon Preview"
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = PRESET_IMAGES[0].url;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
              <div className="text-white">
                <p className="text-xs font-extrabold truncate">{form.salonName || "Your Salon Name"}</p>
                <p className="text-[10px] text-amber-300">
                  {form.city || "City"} • {form.openTime} - {form.closeTime}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Final Review Summary */}
      {activeStep === 3 && (
        <div className="space-y-3.5">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
            {/* Top banner image */}
            <div className="relative h-24 w-full bg-slate-900">
              <img
                src={form.image}
                alt={form.salonName}
                className="h-full w-full object-cover opacity-80"
              />
              <div className="absolute top-2.5 right-2.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                  SALON PARTNER
                </span>
              </div>
              <div className="absolute bottom-2 left-3 text-white">
                <h4 className="font-extrabold text-base leading-tight drop-shadow-sm">
                  {form.salonName}
                </h4>
                <p className="text-[11px] text-amber-200 drop-shadow-sm">
                  {form.city} • Open {form.openTime} - {form.closeTime}
                </p>
              </div>
            </div>

            {/* Verification Grid */}
            <div className="p-4 grid grid-cols-2 gap-3 text-xs bg-slate-50/60">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Owner Account</span>
                <p className="font-bold text-slate-900 truncate mt-0.5">{form.fullName}</p>
                <p className="text-slate-500 text-[11px] truncate">@{form.username}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Email</span>
                <p className="font-semibold text-slate-900 truncate mt-0.5">{form.email}</p>
                <p className="text-slate-500 text-[11px] truncate">{form.phoneNumber || "No personal phone"}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Salon Location</span>
                <p className="font-semibold text-slate-900 truncate mt-0.5">{form.address}</p>
                <p className="text-slate-500 text-[11px] truncate">{form.city}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Phone</span>
                <p className="font-semibold text-slate-900 truncate mt-0.5">
                  {form.salonPhone || form.phoneNumber || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 flex items-center gap-2.5 text-xs text-amber-900">
            <CheckCircleIcon sx={{ fontSize: 18 }} className="text-amber-600 shrink-0" />
            <span>Your partner profile will be activated immediately upon registration.</span>
          </div>
        </div>
      )}

      {/* Stepper Navigation Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-3">
        {activeStep > 0 ? (
          <button
            type="button"
            onClick={handleBack}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
          >
            <ArrowBackIcon sx={{ fontSize: 14 }} />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        {activeStep < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-amber-600/20 active:scale-95 transition-all cursor-pointer leading-none ml-auto"
          >
            <span>Continue</span>
            <ArrowForwardIcon sx={{ fontSize: 14 }} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-amber-600/20 active:scale-95 disabled:opacity-60 transition-all cursor-pointer leading-none ml-auto"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Launching Partner Account...</span>
              </>
            ) : (
              <>
                <RocketLaunchOutlinedIcon sx={{ fontSize: 16 }} />
                <span>Launch Salon Business</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Switch to Login link */}
      <div className="text-center pt-1 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Already registered?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-amber-600 font-bold hover:text-amber-700 hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default OwnerOnboardingForm;

