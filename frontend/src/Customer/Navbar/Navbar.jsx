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

import React from "react";
import {
  Avatar,
  Badge,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import NotificationsActive from "@mui/icons-material/NotificationsActive";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="z-50 px-6 flex items-center justify-between py-2">
      <div className="flex items-center gap-10">
        <h1 onClick={() => navigate("/")} className="cursor-pointer font-bold text-2xl">Salon Service</h1>
        <div className="flex items-center gap-5">
          <h1>Home</h1>
        </div>
      </div>
      <div className="flex items-center gap-3 md:gap-6">
        <Button variant="outlined">Become partner</Button>

        <IconButton onClick={() => navigate("/notifications")}>
          <Badge badgeContent={5}>
            <NotificationsActive color="primary" />
          </Badge>
        </IconButton>

        {true ? (
          <div className="flex gap-1 items-center">
            <h1 className="text-lg font-semibold">Jay</h1>
            <IconButton
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <Avatar sx={{ bgcolor: "green" }}>J</Avatar>
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
              <MenuItem onClick={() => {
                navigate("/bookings")
              }}>My Bookings</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </div>
        ) : (
          <IconButton>
            <AccountCircle sx={{ fontSize: "45px", color: "green" }} />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default Navbar;