import React, { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../config/api";
import AuthModal from "../../components/auth/AuthModal";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [role, setRole] = useState("CUSTOMER");
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const isMenuOpen = Boolean(anchorEl);

  // 1. Fetch current user profile if JWT exists
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      setUser(null);
      return;
    }

    api
      .get("/api/users/profile")
      .then(({ data }) => {
        setUser(data);
        if (data.role) localStorage.setItem("role", data.role);
      })
      .catch(() => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("role");
        setUser(null);
      });
  }, []);

  // 2. Fetch unread notifications count if user is signed in
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    api
      .get("/api/notifications/unread-count")
      .then(({ data }) => setUnreadCount(typeof data === "number" ? data : 0))
      .catch(() => setUnreadCount(0));
  }, [user]);

  // 3. Listen for global "open-auth-modal" events from across the site
  useEffect(() => {
    const handleCustomAuth = (e) => {
      const mode = e.detail?.mode || "login";
      const selectedRole = e.detail?.role || "CUSTOMER";
      openAuth(mode, selectedRole);
    };

    window.addEventListener("open-auth-modal", handleCustomAuth);
    return () => window.removeEventListener("open-auth-modal", handleCustomAuth);
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openAuth = (mode = "login", selectedRole = "CUSTOMER") => {
    setAuthMode(mode);
    setRole(selectedRole);
    setAuthOpen(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    setUser(null);
    handleMenuClose();
    setMobileDrawerOpen(false);
    navigate("/");
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/90 border-b border-slate-200/80 shadow-xs transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/25 group-hover:scale-105 group-hover:shadow-amber-500/40 transition-all duration-300">
              <ContentCutIcon sx={{ fontSize: 20 }} className="transform -rotate-45" />
            </div>

            <div className="flex flex-col">
              <span className="font-extrabold text-xl text-slate-900 tracking-tight leading-none group-hover:text-amber-600 transition-colors">
                SALONBOOK<span className="text-amber-500">.</span>
              </span>
              <span className="text-[9px] font-extrabold text-amber-600 uppercase tracking-widest leading-tight mt-0.5">
                Luxury Care
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {[
              { label: "Home", path: "/" },
              { label: "Explore Salons", path: "/explore" },
              { label: "About", path: "/about" },
              ...(user ? [{ label: "My Bookings", path: "/bookings" }] : []),
            ].map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive(item.path)
                    ? "bg-amber-50 text-amber-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Tray */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Salon Owner or Partner Action */}
            {user?.role === "SALON_OWNER" ? (
              <button
                onClick={() => navigate("/salon-dashboard")}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <DashboardOutlinedIcon sx={{ fontSize: 16 }} />
                <span>Salon Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => openAuth("signup", "SALON_OWNER")}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-amber-600/40 text-amber-700 hover:border-amber-600 hover:bg-amber-50 font-semibold text-xs transition-all cursor-pointer"
              >
                <StorefrontOutlinedIcon sx={{ fontSize: 16 }} />
                <span>List Your Salon</span>
              </button>
            )}

            {/* Notification Bell */}
            <IconButton
              onClick={() => (user ? navigate("/notifications") : openAuth("login"))}
              aria-label="Notifications"
              sx={{
                color: "#475569",
                "&:hover": { color: "#D97706", bgcolor: "#FEF3C7" },
              }}
            >
              <Badge
                badgeContent={unreadCount}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: "#D97706",
                    color: "white",
                    fontWeight: 700,
                  },
                }}
              >
                <NotificationsOutlinedIcon />
              </Badge>
            </IconButton>

            {/* Authenticated User Menu or Sign In */}
            {user ? (
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={handleMenuClick}
                  className="inline-flex items-center gap-2 p-1 pl-2 sm:pr-2.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "#D97706",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      boxShadow: "0 2px 6px rgba(217,119,6,0.3)",
                    }}
                  >
                    {(user.fullName || user.username || "U").slice(0, 1).toUpperCase()}
                  </Avatar>
                  <span className="hidden sm:block text-xs font-bold text-slate-800 max-w-[100px] truncate text-left">
                    {user.fullName || user.username}
                  </span>
                  <KeyboardArrowDownIcon sx={{ fontSize: 16 }} className="text-slate-400" />
                </button>

                <Menu
                  anchorEl={anchorEl}
                  open={isMenuOpen}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      borderRadius: 3,
                      minWidth: 220,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                      border: "1px solid rgba(226,232,240,0.8)",
                      p: 1,
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  {/* User Profile Card Header in Dropdown */}
                  <div className="px-3 py-2 space-y-0.5">
                    <p className="font-bold text-sm text-slate-900 truncate">
                      {user.fullName || user.username}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      {user.role === "SALON_OWNER" ? "Salon Partner" : "Client"}
                    </span>
                  </div>

                  <Divider sx={{ my: 1 }} />

                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate("/profile");
                    }}
                    sx={{ borderRadius: 2, fontSize: "0.85rem", py: 1 }}
                  >
                    <PersonOutlinedIcon fontSize="small" className="text-slate-500 mr-2.5" />
                    My Profile
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate("/bookings");
                    }}
                    sx={{ borderRadius: 2, fontSize: "0.85rem", py: 1 }}
                  >
                    <CalendarMonthOutlinedIcon fontSize="small" className="text-slate-500 mr-2.5" />
                    My Appointments
                  </MenuItem>

                  {user.role === "SALON_OWNER" && (
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate("/salon-dashboard");
                      }}
                      sx={{ borderRadius: 2, fontSize: "0.85rem", py: 1 }}
                    >
                      <DashboardOutlinedIcon fontSize="small" className="text-slate-500 mr-2.5" />
                      Salon Dashboard
                    </MenuItem>
                  )}

                  <Divider sx={{ my: 1 }} />

                  <MenuItem
                    onClick={handleSignOut}
                    sx={{
                      borderRadius: 2,
                      fontSize: "0.85rem",
                      py: 1,
                      color: "#DC2626",
                      "&:hover": { bgcolor: "#FEF2F2" },
                    }}
                  >
                    <LogoutOutlinedIcon fontSize="small" className="text-red-500 mr-2.5" />
                    Sign Out
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuth("login")}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-600/20 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <IconButton
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden"
              sx={{ color: "#334155" }}
              aria-label="Open navigation menu"
            >
              <MenuIcon />
            </IconButton>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 290,
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            bgcolor: "#FFFFFF",
          },
        }}
      >
        <div className="space-y-6">
          {/* Drawer Top Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-sm">
                <ContentCutIcon sx={{ fontSize: 16 }} className="transform -rotate-45" />
              </div>
              <span className="font-extrabold text-base text-slate-900 tracking-tight">
                SALONBOOK
              </span>
            </div>

            <IconButton size="small" onClick={() => setMobileDrawerOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>

          {/* User Status Card in Drawer */}
          {user ? (
            <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/60 flex items-center gap-3">
              <Avatar sx={{ bgcolor: "#D97706", width: 40, height: 40, fontWeight: 700 }}>
                {(user.fullName || user.username || "U").slice(0, 1).toUpperCase()}
              </Avatar>
              <div className="min-w-0">
                <p className="font-bold text-sm text-slate-900 truncate">
                  {user.fullName || user.username}
                </p>
                <p className="text-[11px] text-amber-700 font-semibold capitalize">
                  {user.role === "SALON_OWNER" ? "Salon Partner" : "Client"}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-2">
              <p className="text-xs text-slate-500 font-medium">
                Sign in to manage bookings and salon appointments.
              </p>
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  openAuth("login");
                }}
                className="w-full py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-sm"
              >
                Sign In / Register
              </button>
            </div>
          )}

          {/* Drawer Navigation Links */}
          <nav className="flex flex-col gap-1">
            {[
              { label: "Home", path: "/", icon: <HomeOutlinedIcon fontSize="small" /> },
              { label: "Explore Salons", path: "/explore", icon: <ExploreOutlinedIcon fontSize="small" /> },
              { label: "About Us", path: "/about", icon: <InfoOutlinedIcon fontSize="small" /> },
              ...(user
                ? [
                    { label: "My Bookings", path: "/bookings", icon: <CalendarMonthOutlinedIcon fontSize="small" /> },
                    { label: "My Profile", path: "/profile", icon: <PersonOutlinedIcon fontSize="small" /> },
                  ]
                : []),
              ...(user?.role === "SALON_OWNER"
                ? [{ label: "Salon Dashboard", path: "/salon-dashboard", icon: <DashboardOutlinedIcon fontSize="small" /> }]
                : []),
            ].map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  navigate(item.path);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors text-left ${
                  isActive(item.path)
                    ? "bg-amber-50 text-amber-700 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className={isActive(item.path) ? "text-amber-600" : "text-slate-400"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Drawer Bottom Action */}
        <div className="pt-6 border-t border-slate-100 space-y-2">
          {user?.role !== "SALON_OWNER" && (
            <button
              onClick={() => {
                setMobileDrawerOpen(false);
                openAuth("signup", "SALON_OWNER");
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-amber-500/40 text-amber-700 font-semibold text-xs hover:bg-amber-50 transition-colors"
            >
              <StorefrontOutlinedIcon fontSize="small" />
              <span>Partner With Us</span>
            </button>
          )}

          {user && (
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-600 font-semibold text-xs hover:bg-red-100 transition-colors"
            >
              <LogoutOutlinedIcon fontSize="small" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </Drawer>

      {/* Modular Auth Modal */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
        initialRole={role}
      />
    </>
  );
};

export default Navbar;