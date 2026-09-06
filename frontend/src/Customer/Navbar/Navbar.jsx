import React from "react";

const Navbar = () => {
  return (
    <div className="z-50 px-6 flex items-center justify-between py-2">
      <div className="flex items-center gap-10">
        <h1 className="cursor-pointer font-bold text-2xl">Salon Service</h1>
        <div className="flex items-center gap-5">
          <h1>Home</h1>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
