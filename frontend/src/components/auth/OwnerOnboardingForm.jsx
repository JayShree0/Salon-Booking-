import React, { useState } from "react";
import { TextField, Button, Alert, Stepper, Step, StepLabel } from "@mui/material";
import authApi from "../../api/authApi";
import salonApi from "../../api/salonApi";

const steps = ["Owner Details", "Salon Info", "Operating Hours", "Review"];

const OwnerOnboardingForm = ({ onSuccess, onBackToRoles, onSwitchToLogin }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
  });

  const handleNext = () => {
    setError("");
    if (activeStep === 0) {
      if (!form.fullName || !form.username || !form.email || !form.password) {
        setError("Please complete all owner information fields.");
        return;
      }
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
    } else if (activeStep === 1) {
      if (!form.salonName || !form.address || !form.city) {
        setError("Please enter the salon name, address, and city.");
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
        fullName: form.fullName,
        username: form.username,
        email: form.email,
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
          name: form.salonName,
          address: form.address,
          city: form.city,
          phoneNumber: form.salonPhone || form.phoneNumber,
          email: form.email,
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
    <div className="space-y-5 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Salon Partner Onboarding</h2>
          <p className="text-xs text-slate-500">Step {activeStep + 1} of 4 — {steps[activeStep]}</p>
        </div>
        <button
          type="button"
          onClick={onBackToRoles}
          className="text-xs text-amber-600 hover:underline font-medium"
        >
          Change Role
        </button>
      </div>

      <Stepper activeStep={activeStep} alternativeLabel className="py-1">
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && <Alert severity="error">{error}</Alert>}

      {/* Step 1: Owner Information */}
      {activeStep === 0 && (
        <div className="space-y-3.5">
          <TextField
            fullWidth
            size="small"
            label="Owner Full Name"
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
          <TextField
            fullWidth
            size="small"
            label="Phone Number"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          />
          <TextField
            fullWidth
            size="small"
            type="password"
            label="Password (min 6 characters)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
      )}

      {/* Step 2: Salon Details */}
      {activeStep === 1 && (
        <div className="space-y-3.5">
          <TextField
            fullWidth
            size="small"
            label="Salon Brand Name"
            value={form.salonName}
            onChange={(e) => setForm({ ...form, salonName: e.target.value })}
            placeholder="e.g. Royal Touch Hair & Spa"
            required
          />
          <TextField
            fullWidth
            size="small"
            label="Full Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          />
          <TextField
            fullWidth
            size="small"
            label="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            required
          />
          <TextField
            fullWidth
            size="small"
            label="Salon Business Phone"
            value={form.salonPhone}
            onChange={(e) => setForm({ ...form, salonPhone: e.target.value })}
          />
        </div>
      )}

      {/* Step 3: Business Information */}
      {activeStep === 2 && (
        <div className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <TextField
              fullWidth
              size="small"
              type="time"
              label="Opening Time"
              value={form.openTime}
              onChange={(e) => setForm({ ...form, openTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
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
            />
          </div>
          <TextField
            fullWidth
            size="small"
            label="Salon Showcase Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <div className="h-32 w-full rounded-xl overflow-hidden border border-slate-200">
            <img src={form.image} alt="Preview" className="h-full w-full object-cover" />
          </div>
        </div>
      )}

      {/* Step 4: Review Summary */}
      {activeStep === 3 && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-sm">
          <h4 className="font-semibold text-slate-900 border-b pb-2">Review Onboarding Information</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500">Owner:</span>
              <p className="font-semibold text-slate-800">{form.fullName} ({form.username})</p>
            </div>
            <div>
              <span className="text-slate-500">Email:</span>
              <p className="font-semibold text-slate-800">{form.email}</p>
            </div>
            <div>
              <span className="text-slate-500">Salon Name:</span>
              <p className="font-semibold text-slate-800">{form.salonName}</p>
            </div>
            <div>
              <span className="text-slate-500">Location:</span>
              <p className="font-semibold text-slate-800">{form.city}</p>
            </div>
            <div>
              <span className="text-slate-500">Operating Hours:</span>
              <p className="font-semibold text-slate-800">{form.openTime} - {form.closeTime}</p>
            </div>
            <div>
              <span className="text-slate-500">Role Assigned:</span>
              <p className="font-semibold text-amber-700">SALON_OWNER</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-3 border-t border-slate-100">
        {activeStep > 0 ? (
          <Button variant="outlined" onClick={handleBack} disabled={loading}>
            Back
          </Button>
        ) : (
          <div />
        )}

        {activeStep < steps.length - 1 ? (
          <Button variant="contained" color="primary" onClick={handleNext}>
            Continue
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Registering..." : "Launch Salon"}
          </Button>
        )}
      </div>

      <div className="text-center pt-1">
        <p className="text-xs text-slate-500">
          Already registered?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-amber-600 font-semibold hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default OwnerOnboardingForm;

