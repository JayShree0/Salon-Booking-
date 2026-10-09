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
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../config/api";

const Navbar = ({ DrawerList, salon, owner }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isMenuOpen = Boolean(anchorEl);

  const toggleDrawer = (openState) => () => {
    setMobileOpen(openState);
  };

  useEffect(() => {
    api
      .get("/api/notifications/unread-count")
      .then(({ data }) => setUnreadCount(typeof data === "number" ? data : 0))
      .catch(() => setUnreadCount(0));
  }, [location.pathname]);

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    setAnchorEl(null);
    navigate("/");
  };

  // Derive title from current route
  const getPageTitle = () => {
    const p = location.pathname;
    if (p.includes("/services")) return "Services Catalog";
    if (p.includes("/add-services")) return "Add New Service";
    if (p.includes("/bookings")) return "Bookings & Appointments";
    if (p.includes("/category")) return "Categories Management";
    if (p.includes("/transaction")) return "Payment Transactions";
    if (p.includes("/payment")) return "Earnings & Overview";
    if (p.includes("/notifications")) return "Notifications";
    if (p.includes("/account")) return "Salon Profile & Settings";
    return "Dashboard Overview";
  };

  return (
    <header className="h-16 lg:h-18 bg-white border-b border-slate-200/90 px-4 sm:px-8 flex items-center justify-between shrink-0 z-30 shadow-2xs">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3">
        <IconButton
          onClick={toggleDrawer(true)}
          className="lg:!hidden"
          sx={{
            color: "#0f172a",
            bgcolor: "#f8fafc",
            "&:hover": { bgcolor: "#f1f5f9" },
            border: "1px solid #e2e8f0",
          }}
          aria-label="Open sidebar menu"
          size="small"
        >
          <MenuIcon fontSize="small" />
        </IconButton>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <span>Salon Manager</span>
            <span>/</span>
            <span className="text-amber-700 font-bold">{salon?.name || "My Salon"}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right: Customer Website Link, Notification icon & Owner Profile menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Customer Website Link */}
        {salon?.id && (
          <button
            type="button"
            onClick={() => navigate(`/salon/${salon.id}`)}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 transition-colors"
            title="Preview how customers view your salon"
          >
            <StorefrontOutlinedIcon sx={{ fontSize: 15 }} className="text-amber-600" />
            <span>View Public Store</span>
            <LaunchOutlinedIcon sx={{ fontSize: 13 }} className="text-slate-400" />
          </button>
        )}

        {/* Notifications Button */}
        <IconButton
          onClick={() => navigate("/salon-dashboard/notifications")}
          size="small"
          sx={{
            width: 40,
            height: 40,
            color: "#475569",
            bgcolor: "#f8fafc",
            border: "1px solid #e2e8f0",
            "&:hover": { color: "#d97706", bgcolor: "#fef3c7" },
          }}
          aria-label="Notifications"
        >
          <Badge
            badgeContent={unreadCount}
            color="error"
            sx={{
              "& .MuiBadge-badge": {
                bgcolor: "#d97706",
                color: "white",
                fontWeight: 700,
                fontSize: "0.65rem",
                height: 18,
                minWidth: 18,
              },
            }}
          >
            <NotificationsOutlinedIcon sx={{ fontSize: 20 }} />
          </Badge>
        </IconButton>

        {/* Profile Capsule dropdown */}
        <button
          type="button"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          className="inline-flex items-center gap-2 h-10 pl-1.5 pr-3 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/90 hover:border-amber-400/50 transition-all cursor-pointer shadow-2xs"
        >
          <Avatar
            sx={{
              width: 28,
              height: 28,
              bgcolor: "#d97706",
              fontSize: "0.8rem",
              fontWeight: 700,
              boxShadow: "0 2px 4px rgba(217,119,6,0.25)",
            }}
          >
            {(owner?.fullName || owner?.username || "O").slice(0, 1).toUpperCase()}
          </Avatar>

          <span className="hidden sm:inline-block text-xs font-bold text-slate-800 max-w-[120px] truncate leading-none">
            {owner?.fullName || owner?.username || "Salon Owner"}
          </span>

          <KeyboardArrowDownIcon sx={{ fontSize: 16 }} className="text-slate-400" />
        </button>

        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={() => setAnchorEl(null)}
          elevation={0}
          PaperProps={{
            sx: {
              mt: 1.5,
              borderRadius: "16px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e2e8f0",
              minWidth: 200,
              p: 1,
            },
          }}
        >
          <div className="px-3 py-2">
            <p className="text-xs font-bold text-slate-900 truncate">
              {owner?.fullName || owner?.username || "Salon Owner"}
            </p>
            <p className="text-[11px] text-slate-500 truncate">{owner?.email || ""}</p>
          </div>
          <Divider sx={{ my: 0.5 }} />

          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate("/salon-dashboard/account");
            }}
            sx={{ fontSize: "0.85rem", fontWeight: 600, py: 1, borderRadius: "8px", gap: 1.5 }}
          >
            <StorefrontOutlinedIcon fontSize="small" className="text-slate-500" />
            <span>Salon Profile</span>
          </MenuItem>

          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate("/");
            }}
            sx={{ fontSize: "0.85rem", fontWeight: 600, py: 1, borderRadius: "8px", gap: 1.5 }}
          >
            <DashboardOutlinedIcon fontSize="small" className="text-slate-500" />
            <span>Customer Website</span>
          </MenuItem>

          <Divider sx={{ my: 0.5 }} />

          <MenuItem
            onClick={handleSignOut}
            sx={{
              fontSize: "0.85rem",
              fontWeight: 600,
              py: 1,
              borderRadius: "8px",
              gap: 1.5,
              color: "#e11d48",
            }}
          >
            <LogoutOutlinedIcon fontSize="small" className="text-rose-600" />
            <span>Sign Out</span>
          </MenuItem>
        </Menu>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        open={mobileOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{ sx: { width: 288, border: "none" } }}
      >
        <DrawerList toggleDrawer={toggleDrawer} salon={salon} unreadCount={unreadCount} />
      </Drawer>
    </header>
  );
};

export default Navbar;