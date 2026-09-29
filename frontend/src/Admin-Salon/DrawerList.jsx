import { Divider, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DrawerList = ({ menu, menu2, toggleDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleClick = (item) => () => {
    navigate(item.path);
    if (toggleDrawer) {
      toggleDrawer(false)();
    }
  };

  console.log("location: " + location);

  return (
    <div className="h-full">
      <div className="flex flex-col justify-between h-full w-[300px] border-r py-5">
        <div className="space-y-2">
          {menu.map((item, index) => (
            <div onClick={handleClick(item)} className={` cursor-pointer pr-9`}>
              <div
                className={` ${item.path === location.pathname ? " bg-primary-color text-secondary-color " : "text-primary-color"} flex item-center px-5 py-3 rounded-r-full`}
              >
                <ListItemIcon>
                  {item.path === location.pathname
                    ? item.activeIcon
                    : item.icon}
                </ListItemIcon>
                <ListItemText>{item.name}</ListItemText>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <Divider />
          <div className="space-y-2">
            {menu2.map((item, index) => (
              <div
                onClick={handleClick(item)}
                className={` cursor-pointer pr-9`}
              >
                <div
                  className={` ${item.path === location.pathname ? " bg-primary-color text-secondary-color " : "text-primary-color"} flex item-center px-5 py-3 rounded-r-full`}
                >
                  <ListItemIcon>
                    {item.path === location.pathname
                      ? item.activeIcon
                      : item.icon}
                  </ListItemIcon>
                  <ListItemText>{item.name}</ListItemText>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawerList;
