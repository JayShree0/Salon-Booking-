import {
  AccountBalanceOutlined,
  AccountBoxOutlined,
  AddCircleOutlineOutlined,
  DashboardOutlined,
  Inventory2Outlined,
  LogoutOutlined,
  ReceiptLongOutlined,
  ShoppingBagOutlined,
  CategoryOutlined,
  NotificationsNoneOutlined,
  StorefrontOutlined,
  ChevronRight,
} from "@mui/icons-material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const salonMenuItems = [
  {
    name: "Dashboard",
    path: "/salon-dashboard",
    icon: <DashboardOutlined fontSize="small" />,
    badge: null,
  },
  {
    name: "Bookings",
    path: "/salon-dashboard/bookings",
    icon: <ShoppingBagOutlined fontSize="small" />,
    badge: null,
  },
  {
    name: "Services",
    path: "/salon-dashboard/services",
    icon: <Inventory2Outlined fontSize="small" />,
    badge: null,
  },
  {
    name: "Add Service",
    path: "/salon-dashboard/add-services",
    icon: <AddCircleOutlineOutlined fontSize="small" />,
    badge: null,
  },
  {
    name: "Categories",
    path: "/salon-dashboard/category",
    icon: <CategoryOutlined fontSize="small" />,
    badge: null,
  },
  {
    name: "Earnings & Summary",
    path: "/salon-dashboard/payment",
    icon: <AccountBalanceOutlined fontSize="small" />,
    badge: null,
  },
  {
    name: "Transactions",
    path: "/salon-dashboard/transaction",
    icon: <ReceiptLongOutlined fontSize="small" />,
    badge: null,
  },
  {
    name: "Notifications",
    path: "/salon-dashboard/notifications",
    icon: <NotificationsNoneOutlined fontSize="small" />,
    badge: null,
  },
];

export const salonAccountItems = [
  {
    name: "Salon Profile",
    path: "/salon-dashboard/account",
    icon: <StorefrontOutlined fontSize="small" />,
  },
  {
    name: "Sign Out",
    path: "/",
    logout: true,
    icon: <LogoutOutlined fontSize="small" />,
  },
];

const SalonDrawerList = ({ toggleDrawer, salon, unreadCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleNavigate = (item) => {
    if (item.logout) {
      handleLogout();
    } else {
      navigate(item.path);
    }
    if (toggleDrawer) {
      toggleDrawer(false)();
    }
  };

  const isActive = (path) => {
    if (path === "/salon-dashboard") {
      return location.pathname === "/salon-dashboard" || location.pathname === "/salon-dashboard/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-72 h-full bg-white flex flex-col border-r border-slate-200 select-none overflow-hidden">
      {/* Brand & Salon Identity Header - shrink-0 */}
      <div className="shrink-0">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 leading-none">
                SALONBOOK<span className="text-amber-500">.</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mt-1 leading-none">
                Partner Portal
              </span>
            </div>
          </div>
        </div>

        {/* Salon Capsule Badge */}
        {salon && (
          <div className="mx-4 mt-4 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0 border border-amber-200/80 shadow-2xs">
              <img
                src={
                  salon.images?.[0] ||
                  "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800"
                }
                alt={salon.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">{salon.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{salon.city || "Salon Partner"}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Group: Operations - Independent Scroll Area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 pt-5 pb-3">
        <p className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          Operations & Catalog
        </p>
        <nav className="space-y-1">
          {salonMenuItems.map((item) => {
            const active = isActive(item.path);
            const isNotification = item.name === "Notifications";
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item)}
                type="button"
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  active
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={active ? "text-amber-400" : "text-slate-500"}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </div>
                {isNotification && unreadCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950">
                    {unreadCount}
                  </span>
                ) : active ? (
                  <ChevronRight sx={{ fontSize: 16 }} className="text-amber-400" />
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Account Section & Logout - shrink-0 pinned at bottom */}
      <div className="shrink-0 p-3 border-t border-slate-100 bg-slate-50/50">
        <p className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          Account & Session
        </p>
        <div className="space-y-1">
          {salonAccountItems.map((item) => {
            const active = isActive(item.path);
            const isLogout = item.logout;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigate(item)}
                type="button"
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isLogout
                    ? "text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    : active
                    ? "bg-slate-900 text-white font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isLogout ? "text-rose-500" : active ? "text-amber-400" : "text-slate-500"}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default SalonDrawerList;
