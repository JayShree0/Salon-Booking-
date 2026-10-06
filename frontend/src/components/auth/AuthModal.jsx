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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={view === "signup_owner" ? "sm" : "xs"}
      PaperProps={{
        sx: {
          borderRadius: 4,
          padding: 2,
        },
      }}
    >
      <div className="flex justify-end">
        <IconButton size="small" onClick={onClose} aria-label="close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
      <DialogContent sx={{ pt: 0 }}>
        {view === "login" && (
          <LoginForm
            onSuccess={onClose}
            onSwitchToSignup={() => setView("roles")}
          />
        )}

        {view === "roles" && (
          <RoleSelectionCard
            onSelectRole={handleSelectRole}
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

