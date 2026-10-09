import React, { useEffect, useState, useCallback, useRef } from "react";
import SalonDrawerList from "./components/SalonDrawerList";
import Navbar from "../Admin-Salon/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import SalonRoutes from "../Routes/SalonRoutes";
import api from "../config/api";
import AuthModal from "../components/auth/AuthModal";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import AppRegistrationOutlinedIcon from "@mui/icons-material/AppRegistrationOutlined";
 
// Helper function to decode JWT payload safely
const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const SalonDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mainContentRef = useRef(null);
  const [authStatus, setAuthStatus] = useState("CHECKING"); // 'CHECKING' | 'AUTHORIZED' | 'UNAUTHENTICATED' | 'FORBIDDEN'
  const [salon, setSalon] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loadingMetadata, setLoadingMetadata] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  // Reset main content scroll position when sub-route changes
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname]);

  const loadSalonMetadata = useCallback(() => {
    setLoadingMetadata(true);
    Promise.allSettled([
      api.get("/api/users/profile"),
      api.get("/api/salons/owner"),
    ])
      .then(([userRes, salonRes]) => {
        if (userRes.status === "fulfilled") {
          setOwner(userRes.value.data);
        }
        if (salonRes.status === "fulfilled") {
          setSalon(salonRes.value.data);
        }
      })
      .finally(() => setLoadingMetadata(false));
  }, []);

  const checkAuth = useCallback(async () => {
    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      setAuthStatus("UNAUTHENTICATED");
      return;
    }

    const payload = parseJwt(jwt);

    // If token has an expiry claim and is expired, clear and prompt login
    if (payload?.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("role");
      setAuthStatus("UNAUTHENTICATED");
      return;
    }

    // Check role in localStorage or decoded JWT claims
    let role = localStorage.getItem("role");
    if (!role && payload) {
      if (payload.role) {
        role = payload.role;
      } else if (Array.isArray(payload.roles) && payload.roles.length > 0) {
        role = payload.roles[0].replace("ROLE_", "");
      }
      if (role) {
        localStorage.setItem("role", role);
      }
    }

    // If already known as SALON_OWNER or ADMIN, authorize immediately and fetch metadata
    if (role === "SALON_OWNER" || role === "ROLE_SALON_OWNER" || role === "ADMIN") {
      localStorage.setItem("role", "SALON_OWNER");
      setAuthStatus("AUTHORIZED");
      loadSalonMetadata();
      return;
    }

    // If role is unverified or customer, verify with backend user profile
    try {
      const { data: userProfile } = await api.get("/api/users/profile");
      if (userProfile.role === "SALON_OWNER" || userProfile.role === "ADMIN") {
        localStorage.setItem("role", "SALON_OWNER");
        setOwner(userProfile);
        setAuthStatus("AUTHORIZED");
        loadSalonMetadata();
      } else {
        setCurrentUserEmail(userProfile.email || "");
        setAuthStatus("FORBIDDEN");
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("jwt");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("role");
        setAuthStatus("UNAUTHENTICATED");
      } else if (role === "SALON_OWNER") {
        // Fallback for transient network error if previously authenticated as owner
        setAuthStatus("AUTHORIZED");
        loadSalonMetadata();
      } else {
        setAuthStatus("UNAUTHENTICATED");
      }
    }
  }, [loadSalonMetadata]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle switching account from Forbidden customer state
  const handleSwitchToOwner = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    setAuthModalMode("login");
    setAuthModalOpen(true);
  };

  // 1. Loading State
  if (authStatus === "CHECKING") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-4 max-w-sm px-6">
          <div className="w-14 h-14 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto shadow-lg shadow-amber-500/20" />
          <h2 className="text-xl font-bold tracking-tight">Verifying Salon Partner Access</h2>
          <p className="text-xs text-slate-400">
            Checking your credentials and connecting to salon management services...
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State (Prompt to Log In as Salon Owner)
  if (authStatus === "UNAUTHENTICATED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden select-none">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          {/* Brand Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20">
            <StorefrontOutlinedIcon sx={{ fontSize: 32 }} />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-extrabold tracking-widest uppercase">
              SALON PARTNER PORTAL
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Salon Owner Sign In
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Please sign in with your salon owner credentials to manage your appointments, service catalog, and studio operations.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setAuthModalMode("login");
                setAuthModalOpen(true);
              }}
              className="w-full h-12 inline-flex items-center justify-center gap-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <LoginOutlinedIcon sx={{ fontSize: 18 }} />
              <span>Sign In with Salon Credentials</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthModalMode("signup_owner");
                setAuthModalOpen(true);
              }}
              className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all cursor-pointer"
            >
              <AppRegistrationOutlinedIcon sx={{ fontSize: 18 }} className="text-amber-400" />
              <span>Register a New Salon</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full h-10 inline-flex items-center justify-center gap-2 text-slate-400 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <ArrowBackOutlinedIcon sx={{ fontSize: 16 }} />
              <span>Back to Customer Homepage</span>
            </button>
          </div>
        </div>

        {/* Global Auth Modal for in-place sign in */}
        <AuthModal
          open={authModalOpen}
          onClose={() => {
            setAuthModalOpen(false);
            checkAuth();
          }}
          initialMode={authModalMode}
          initialRole="SALON_OWNER"
        />
      </div>
    );
  }

  // 3. Forbidden State (Signed in as Customer instead of Salon Owner)
  if (authStatus === "FORBIDDEN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden select-none">
        <div className="relative z-10 max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <LockOutlinedIcon sx={{ fontSize: 32 }} />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-extrabold tracking-widest uppercase">
              ACCESS RESTRICTED
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Salon Owner Account Required
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              You are currently signed in as a customer account{" "}
              {currentUserEmail ? (
                <span className="font-semibold text-slate-200">({currentUserEmail})</span>
              ) : null}
              . This dashboard is reserved for registered salon partners.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleSwitchToOwner}
              className="w-full h-12 inline-flex items-center justify-center gap-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <LoginOutlinedIcon sx={{ fontSize: 18 }} />
              <span>Switch to Salon Owner Account</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold text-xs transition-all cursor-pointer"
            >
              <ArrowBackOutlinedIcon sx={{ fontSize: 16 }} />
              <span>Return to Customer Homepage</span>
            </button>
          </div>
        </div>

        <AuthModal
          open={authModalOpen}
          onClose={() => {
            setAuthModalOpen(false);
            checkAuth();
          }}
          initialMode="login"
          initialRole="SALON_OWNER"
        />
      </div>
    );
  }

  // 4. Authorized State: Render Complete Salon Management Dashboard
  return (
    <div className="h-screen h-[100dvh] max-h-[100dvh] overflow-hidden bg-slate-50/70 flex flex-col antialiased">
      {/* Top Header */}
      <Navbar DrawerList={SalonDrawerList} salon={salon} owner={owner} />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex min-h-0 min-w-0 overflow-hidden">
        {/* Desktop Fixed Sidebar */}
        <div className="hidden lg:flex flex-col shrink-0 h-full w-72 z-10 border-r border-slate-200/80 bg-white shadow-2xs">
          <SalonDrawerList salon={salon} />
        </div>

        {/* Scrollable Dashboard Viewport */}
        <main
          ref={mainContentRef}
          className="flex-1 min-h-0 min-w-0 h-full overflow-y-auto overflow-x-hidden px-4 sm:px-8 py-6 lg:py-8"
        >
          <div className="max-w-7xl mx-auto w-full pb-12">
            <SalonRoutes />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SalonDashboard;
