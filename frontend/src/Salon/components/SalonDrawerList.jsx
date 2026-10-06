import {
  AccountBalance,
  AccountBox,
  Add,
  Dashboard,
  Inventory,
  Logout,
  Receipt,
  ShoppingBag,
} from "@mui/icons-material";
import CategoryIcon from "@mui/icons-material/Category";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsIcon from "@mui/icons-material/Notifications";
import React from "react";
import { useNavigate } from "react-router-dom";
import DrawerList from "../../Admin-Salon/DrawerList";

const menu = [
  {
    name: "Dashboard",
    path: "/salon-dashboard",
    icon: <Dashboard className="text-primary-color" />,
    activeIcon: <Dashboard className="text-secondary-color" />,
  },
  {
    name: "Bookings",
    path: "/salon-dashboard/bookings",
    icon: <ShoppingBag className="text-primary-color" />,
    activeIcon: <ShoppingBag className="text-secondary-color" />,
  },
  {
    name: "Services",
    path: "/salon-dashboard/services",
    icon: <Inventory className="text-primary-color" />,
    activeIcon: <Inventory className="text-secondary-color" />,
  },
  {
    name: "Add Services",
    path: "/salon-dashboard/add-services",
    icon: <Add className="text-primary-color" />,
    activeIcon: <Add className="text-secondary-color" />,
  },
  {
    name: "Payment",
    path: "/salon-dashboard/payment",
    icon: <AccountBalance className="text-primary-color" />,
    activeIcon: <AccountBalance className="text-secondary-color" />,
  },
  {
    name: "Transaction",
    path: "/salon-dashboard/transaction",
    icon: <Receipt className="text-primary-color" />,
    activeIcon: <Receipt className="text-secondary-color" />,
  },
  {
    name: "Category",
    path: "/salon-dashboard/category",
    icon: <CategoryIcon className="text-primary-color" />,
    activeIcon: <CategoryIcon className="text-secondary-color" />,
  },
  {
    name: "Notifications",
    path: "/salon-dashboard/notifications",
    icon: <NotificationsNoneIcon className="text-primary-color" />,
    activeIcon: <NotificationsIcon className="text-secondary-color" />,
  },
];

const menu2 = [
  {
    name: "Account",
    path: "/salon-dashboard/account",
    icon: <AccountBox className="text-primary-color" />,
    activeIcon: <AccountBox className="text-secondary-color" />,
  },
  {
    name: "Logout",
    path: "/",
    logout: true,
    icon: <Logout className="text-primary-color" />,
    activeIcon: <Logout className="text-secondary-color" />,
  },
];
const SalonDrawerList = ({ toggleDrawer = () => () => {} }) => {
  const navigate = useNavigate();

  // Removing the saved tokens signs the user out of the whole app.
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return <DrawerList menu={menu} menu2={menu2} toggleDrawer={toggleDrawer} onLogout={handleLogout} />;
};

export default SalonDrawerList;
