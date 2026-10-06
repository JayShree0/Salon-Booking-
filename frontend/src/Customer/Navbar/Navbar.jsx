import React, { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
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
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/95 border-b border-slate-200/80 shadow-xs transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Left: Brand Logo & Wordmark */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/25 group-hover:scale-105 group-hover:shadow-amber-500/40 transition-all duration-300 shrink-0">
              <ContentCutIcon sx={{ fontSize: 20 }} className="transform -rotate-45" />
            </div>

            <div className="flex flex-col justify-center">
              <span className="font-extrabold text-xl text-slate-900 tracking-tight leading-none group-hover:text-amber-600 transition-colors">
                SALONBOOK<span className="text-amber-500">.</span>
              </span>
              <span className="text-[9px] font-extrabold text-amber-600 uppercase tracking-widest leading-none mt-1">
                Luxury Care
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation Links with Perfect Vertical & Horizontal Alignment */}
          <nav className="hidden md:flex items-center justify-center gap-1 lg:gap-2">
            {[
              { label: "Home", path: "/" },
              { label: "Explore Salons", path: "/explore" },
              { label: "About Us", path: "/about" },
              ...(user ? [{ label: "My Bookings", path: "/bookings" }] : []),
            ].map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-xs lg:text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer h-9 leading-none ${
                  isActive(item.path)
                    ? "bg-amber-50 text-amber-700 font-bold shadow-xs border border-amber-200/60"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right: Action Tray (Unified 40px Height Axis for Flawless Alignment) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Salon Owner Dashboard or Partner CTA */}
            {user?.role === "SALON_OWNER" ? (
              <button
                type="button"
                onClick={() => navigate("/salon-dashboard")}
                className="hidden sm:inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer leading-none"
              >
                <DashboardOutlinedIcon sx={{ fontSize: 16 }} className="text-amber-400" />
                <span>Salon Dashboard</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuth("signup", "SALON_OWNER")}
                className="hidden sm:inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full border border-amber-600/40 text-amber-700 hover:border-amber-600 hover:bg-amber-50 font-bold text-xs transition-all cursor-pointer leading-none"
              >
                <StorefrontOutlinedIcon sx={{ fontSize: 16 }} className="text-amber-600" />
                <span>List Your Salon</span>
              </button>
            )}

            {/* Notification Bell (Exact 40px Box) */}
            <IconButton
              onClick={() => (user ? navigate("/notifications") : openAuth("login"))}
              aria-label="Notifications"
              sx={{
                width: 40,
                height: 40,
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
                    fontSize: "0.65rem",
                    height: 18,
                    minWidth: 18,
                  },
                }}
              >
                <NotificationsOutlinedIcon sx={{ fontSize: 21 }} />
              </Badge>
            </IconButton>

            {/* Authenticated User Menu Trigger OR Sign In Button */}
            {user ? (
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={handleMenuClick}
                  className="inline-flex items-center justify-center gap-2 h-10 pl-1.5 pr-3 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/90 hover:border-amber-400/50 transition-all cursor-pointer shadow-2xs"
                >
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: "#D97706",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      boxShadow: "0 2px 4px rgba(217,119,6,0.25)",
                    }}
                  >
                    {(user.fullName || user.username || "U").slice(0, 1).toUpperCase()}
                  </Avatar>

                  <span className="hidden sm:inline-block text-xs font-bold text-slate-800 max-w-[110px] truncate leading-none">
                    {user.fullName || user.username}
                  </span>

                  <KeyboardArrowDownIcon sx={{ fontSize: 16 }} className="text-slate-400" />
                </button>

                <Menu
                  anchorEl={anchorEl}
                  open={isMenuOpen}
                  onClose={handleMenuClose}
                  elevation={0}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      width: 260,
                      borderRadius: "18px",
                      boxShadow: "0 12px 36px -4px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.05)",
                      border: "1px solid rgba(226, 232, 240, 0.9)",
                      p: 1.25,
                      overflow: "visible",
                    },
                  }}
                  MenuListProps={{
                    sx: {
                      p: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  {/* User Profile Card Header */}
                  <div className="px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-100 mb-1 space-y-1">
                    <p className="font-bold text-sm text-slate-900 truncate leading-snug">
                      {user.fullName || user.username}
                    </p>
                    <p className="text-xs text-slate-500 truncate leading-none">{user.email}</p>
                    <div className="pt-0.5">
                      <span className="inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        {user.role === "SALON_OWNER" ? "Salon Partner" : "Client"}
                      </span>
                    </div>
                  </div>

                  <Divider sx={{ my: 0.75, borderColor: "rgba(241, 245, 249, 0.9)" }} />

                  {/* 1. My Profile */}
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate("/profile");
                    }}
                    sx={{
                      borderRadius: "10px",
                      px: 2,
                      py: 1.25,
                      minHeight: 42,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#1e293b",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      transition: "all 0.15s ease",
                      "&:hover": {
                        bgcolor: "#f8fafc",
                        color: "#d97706",
                        "& .menu-icon": { color: "#d97706" },
                      },
                    }}
                  >
                    <span className="w-5 h-5 flex items-center justify-center shrink-0 text-slate-500 menu-icon transition-colors">
                      <PersonOutlinedIcon sx={{ fontSize: 19 }} />
                    </span>
                    <span className="leading-none">My Profile</span>
                  </MenuItem>

                  {/* 2. My Appointments */}
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate("/bookings");
                    }}
                    sx={{
                      borderRadius: "10px",
                      px: 2,
                      py: 1.25,
                      minHeight: 42,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#1e293b",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      transition: "all 0.15s ease",
                      "&:hover": {
                        bgcolor: "#f8fafc",
                        color: "#d97706",
                        "& .menu-icon": { color: "#d97706" },
                      },
                    }}
                  >
                    <span className="w-5 h-5 flex items-center justify-center shrink-0 text-slate-500 menu-icon transition-colors">
                      <CalendarMonthOutlinedIcon sx={{ fontSize: 19 }} />
                    </span>
                    <span className="leading-none">My Appointments</span>
                  </MenuItem>

                  {/* 3. Notifications */}
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate("/notifications");
                    }}
                    sx={{
                      borderRadius: "10px",
                      px: 2,
                      py: 1.25,
                      minHeight: 42,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#1e293b",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      transition: "all 0.15s ease",
                      "&:hover": {
                        bgcolor: "#f8fafc",
                        color: "#d97706",
                        "& .menu-icon": { color: "#d97706" },
                      },
                    }}
                  >
                    <span className="w-5 h-5 flex items-center justify-center shrink-0 text-slate-500 menu-icon transition-colors">
                      <NotificationsOutlinedIcon sx={{ fontSize: 19 }} />
                    </span>
                    <span className="leading-none flex-1">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-extrabold bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-full leading-none">
                        {unreadCount}
                      </span>
                    )}
                  </MenuItem>

                  {/* 4. Role-based: Salon Dashboard */}
                  {user.role === "SALON_OWNER" && (
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate("/salon-dashboard");
                      }}
                      sx={{
                        borderRadius: "10px",
                        px: 2,
                        py: 1.25,
                        minHeight: 42,
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "#1e293b",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        transition: "all 0.15s ease",
                        "&:hover": {
                          bgcolor: "#f8fafc",
                          color: "#d97706",
                          "& .menu-icon": { color: "#d97706" },
                        },
                      }}
                    >
                      <span className="w-5 h-5 flex items-center justify-center shrink-0 text-slate-500 menu-icon transition-colors">
                        <DashboardOutlinedIcon sx={{ fontSize: 19 }} />
                      </span>
                      <span className="leading-none">Salon Dashboard</span>
                    </MenuItem>
                  )}

                  <Divider sx={{ my: 0.75, borderColor: "rgba(241, 245, 249, 0.9)" }} />

                  {/* 5. Sign Out */}
                  <MenuItem
                    onClick={handleSignOut}
                    sx={{
                      borderRadius: "10px",
                      px: 2,
                      py: 1.25,
                      minHeight: 42,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#dc2626",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      transition: "all 0.15s ease",
                      "&:hover": {
                        bgcolor: "#fef2f2",
                        color: "#b91c1c",
                        "& .menu-icon": { color: "#b91c1c" },
                      },
                    }}
                  >
                    <span className="w-5 h-5 flex items-center justify-center shrink-0 text-red-500 menu-icon transition-colors">
                      <LogoutOutlinedIcon sx={{ fontSize: 19 }} />
                    </span>
                    <span className="leading-none">Sign Out</span>
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuth("login")}
                className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-600/20 active:scale-95 transition-all duration-200 cursor-pointer leading-none"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Menu Button (Exact 40px Box) */}
            <IconButton
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden"
              sx={{
                width: 40,
                height: 40,
                color: "#334155",
                "&:hover": { bgcolor: "#F1F5F9" },
              }}
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
            width: 300,
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
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <ContentCutIcon sx={{ fontSize: 16 }} className="transform -rotate-45" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-extrabold text-base text-slate-900 tracking-tight leading-none">
                  SALONBOOK<span className="text-amber-500">.</span>
                </span>
                <span className="text-[8px] font-extrabold text-amber-600 uppercase tracking-widest leading-none mt-0.5">
                  Luxury Care
                </span>
              </div>
            </div>

            <IconButton size="small" onClick={() => setMobileDrawerOpen(false)} aria-label="Close menu">
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>

          {/* User Status Card in Drawer */}
          {user ? (
            <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/60 flex items-center gap-3">
              <Avatar sx={{ bgcolor: "#D97706", width: 38, height: 38, fontWeight: 700, fontSize: "0.85rem" }}>
                {(user.fullName || user.username || "U").slice(0, 1).toUpperCase()}
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-slate-900 truncate leading-snug">
                  {user.fullName || user.username}
                </p>
                <p className="text-[11px] text-amber-700 font-semibold capitalize leading-none mt-0.5">
                  {user.role === "SALON_OWNER" ? "Salon Partner" : "Client"}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-2.5">
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Sign in to manage appointments, discover stylists, and view booking history.
              </p>
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  openAuth("login");
                }}
                className="w-full h-10 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-xs shadow-sm active:scale-95 transition-all"
              >
                Sign In / Register
              </button>
            </div>
          )}

          {/* Drawer Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {[
              { label: "Home", path: "/", icon: <HomeOutlinedIcon fontSize="small" /> },
              { label: "Explore Salons", path: "/explore", icon: <ExploreOutlinedIcon fontSize="small" /> },
              { label: "About Us", path: "/about", icon: <InfoOutlinedIcon fontSize="small" /> },
              ...(user
                ? [
                    { label: "My Bookings", path: "/bookings", icon: <CalendarMonthOutlinedIcon fontSize="small" /> },
                    {
                      label: unreadCount > 0 ? `Notifications (${unreadCount})` : "Notifications",
                      path: "/notifications",
                      icon: <NotificationsOutlinedIcon fontSize="small" />,
                    },
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
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors text-left ${
                  isActive(item.path)
                    ? "bg-amber-50 text-amber-700 font-bold border border-amber-200/50"
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

        {/* Drawer Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          {user?.role !== "SALON_OWNER" && (
            <button
              type="button"
              onClick={() => {
                setMobileDrawerOpen(false);
                openAuth("signup", "SALON_OWNER");
              }}
              className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 text-amber-700 font-bold text-xs hover:bg-amber-50 transition-colors"
            >
              <StorefrontOutlinedIcon fontSize="small" />
              <span>Partner With Us</span>
            </button>
          )}

          {user && (
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100 transition-colors"
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