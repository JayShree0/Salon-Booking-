// import { NotificationsActive } from "@mui/icons-material";
// import { Badge, Button, IconButton } from "@mui/material";
// import React from "react";
// import { useNavigate } from "react-router-dom";

// const Navbar = () => {
//     const navigate = useNavigate();

//   return (
//     <div className="z-50 px-6 flex items-center justify-between py-2">
//       <div className="flex items-center gap-10">
//         <h1 onClick={() => navigate("/")} className="cursor-pointer font-bold text-2xl">Salon Service</h1>
//         <div className="flex items-center gap-5">
//           <h1>Home</h1>
//         </div>
//       </div>
//       <div className="flex items-center gap-3 md:gap-6">
//         <Button variant="outlined"> Become parter</Button>

//         <IconButton onClick={() => navigate("/notifications")}>
//             <Badge badgeContent={5}>
//                 <NotificationsActive color="primary"/>
//             </Badge>
//         </IconButton>
//       </div>
//     </div>
//   );
// };

// export default Navbar;

import React, { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import NotificationsActive from "@mui/icons-material/NotificationsActive";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [role, setRole] = useState("CUSTOMER");
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!localStorage.getItem("jwt")) return;

    api.get("/api/users/profile")
      .then(({ data }) => {
        setUser(data);
        if (data.role) localStorage.setItem("role", data.role);
      })
      .catch(() => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("role");
      });
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const openAuth = (mode = "login", selectedRole = "CUSTOMER") => {
    setAuthMode(mode);
    setRole(selectedRole);
    setError("");
    setAuthOpen(true);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = authMode === "login" ? "/auth/login" : "/auth/signup";
      const request = authMode === "login"
        ? { email: form.email, password: form.password }
        : { ...form, role };
      const { data } = await api.post(endpoint, request);

      if (!data.jwt) {
        throw new Error(data.message || "The server did not return an access token.");
      }

      localStorage.setItem("jwt", data.jwt);
      if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
      if (data.role) localStorage.setItem("role", data.role);
      window.location.reload();
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };
  const signOut = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    setUser(null);
    handleClose();
    navigate("/");
  };

  return (
    <>
      <div className="z-50 px-6 flex items-center justify-between py-2 border-b bg-white">
        <div className="flex items-center gap-10">
          <h1 onClick={() => navigate("/")} className="cursor-pointer font-bold text-2xl">Salon Booking</h1>
          <button onClick={() => navigate("/")} className="cursor-pointer">Explore</button>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          {user?.role === "SALON_OWNER" ? (
            <Button variant="outlined" onClick={() => navigate("/salon-dashboard")}>Salon dashboard</Button>
          ) : (
            <Button variant="outlined" onClick={() => openAuth("signup", "SALON_OWNER")}>Become a partner</Button>
          )}

          <IconButton onClick={() => user ? navigate("/notifications") : openAuth()} aria-label="Notifications">
            <Badge>
              <NotificationsActive color="primary" />
            </Badge>
            </IconButton>

          {user ? (
            <div className="flex gap-1 items-center">
              <span className="hidden sm:block text-sm font-semibold">{user.fullName || user.username}</span>
            <IconButton
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <Avatar sx={{ bgcolor: "green" }}>{(user.fullName || user.username || "U").slice(0, 1).toUpperCase()}</Avatar>
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={() => { handleClose(); navigate("/profile"); }}>My Profile</MenuItem>
              <MenuItem onClick={() => { handleClose(); navigate("/bookings"); }}>My Bookings</MenuItem>
              {user.role === "SALON_OWNER" && <MenuItem onClick={() => { handleClose(); navigate("/salon-dashboard"); }}>Salon dashboard</MenuItem>}
              <MenuItem onClick={signOut}>Logout</MenuItem>
            </Menu>
          </div>
        ) : (
            <Button onClick={() => openAuth()} startIcon={<AccountCircle />}>Sign in</Button>
          )}
        </div>
      </div>

      <Dialog open={authOpen} onClose={() => setAuthOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{authMode === "login" ? "Sign in to Salon Booking" : "Create your account"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
            {authMode === "signup" && <>
              <TextField label="Full name" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required />
              <TextField label="Username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} required />
            </>}
            <TextField label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            <TextField label="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
            {authMode === "signup" && <FormControl fullWidth>
              <InputLabel id="signup-role-label">Account type</InputLabel>
              <Select labelId="signup-role-label" label="Account type" value={role} onChange={(event) => setRole(event.target.value)}>
                <MenuItem value="CUSTOMER">Customer</MenuItem>
                <MenuItem value="SALON_OWNER">Salon owner</MenuItem>
              </Select>
            </FormControl>}
            {error && <Alert severity="error">{error}</Alert>}
            <Button type="submit" variant="contained" disabled={loading}>{loading ? "Please wait..." : authMode === "login" ? "Sign in" : "Create account"}</Button>
            <Button type="button" onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setError(""); }}>
              {authMode === "login" ? "Create an account" : "Already have an account? Sign in"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;