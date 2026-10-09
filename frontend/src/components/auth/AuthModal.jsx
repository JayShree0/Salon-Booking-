import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LoginForm from "./LoginForm";
import RoleSelectionCard from "./RoleSelectionCard";
import CustomerSignupForm from "./CustomerSignupForm";
import OwnerOnboardingForm from "./OwnerOnboardingForm";

const AuthModal = ({ open, onClose, initialMode = "login", initialRole = null }) => {
  const [view, setView] = useState("login"); // 'login' | 'roles' | 'signup_customer' | 'signup_owner'

  useEffect(() => {
    if (initialMode === "login") {
      setView("login");
    } else if (initialRole === "SALON_OWNER") {
      setView("signup_owner");
    } else if (initialRole === "CUSTOMER") {
      setView("signup_customer");
    } else {
      setView("roles");
    }
  }, [initialMode, initialRole, open]);

  const handleSelectRole = (role) => {
    if (role === "SALON_OWNER") {
      setView("signup_owner");
    } else {
      setView("signup_customer");
    }
  };

  // Compute dialog width based on active view
  const getDialogMaxWidth = () => {
    if (view === "signup_owner" || view === "roles") return "md";
    return "sm";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={getDialogMaxWidth()}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(15, 23, 42, 0.45)",
          },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: { xs: "20px", sm: "24px" },
          padding: { xs: 2, sm: 3 },
          position: "relative",
          boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.8)",
          backgroundImage: "none",
          maxHeight: "92vh",
        },
      }}
    >
      {/* Floating Modern Close Button */}
      <IconButton
        size="small"
        onClick={onClose}
        aria-label="close authentication modal"
        sx={{
          position: "absolute",
          top: { xs: 12, sm: 16 },
          right: { xs: 12, sm: 16 },
          zIndex: 20,
          bgcolor: "#F8FAFC",
          color: "#64748B",
          border: "1px solid #E2E8F0",
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: "#F1F5F9",
            color: "#0F172A",
            transform: "scale(1.05)",
          },
        }}
      >
        <CloseIcon sx={{ fontSize: 18 }} />
      </IconButton>

      <DialogContent sx={{ p: { xs: 1, sm: 1.5 }, pt: 0, overflowY: "auto" }}>
        {view === "login" && (
          <LoginForm
            onSuccess={onClose}
            onSwitchToSignup={() => setView("roles")}
          />
        )}

        {view === "roles" && (
          <RoleSelectionCard
            onSelectRole={handleSelectRole}
            onSwitchToLogin={() => setView("login")}
          />
        )}

        {view === "signup_customer" && (
          <CustomerSignupForm
            onSuccess={onClose}
            onBackToRoles={() => setView("roles")}
            onSwitchToLogin={() => setView("login")}
          />
        )}

        {view === "signup_owner" && (
          <OwnerOnboardingForm
            onSuccess={onClose}
            onBackToRoles={() => setView("roles")}
            onSwitchToLogin={() => setView("login")}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

