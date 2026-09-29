import React from "react";
import ProfileFieldcard from "./ProfileFieldcard";
import { Divider } from "@mui/material";

const Profile = () => {
  return (
    <div className="lg:px-20 lg:bottom-20">
      <div className="w-full lg:w-[70%]">
        <h1 className="text-5xl font-bold pb-5">Pablo Salon</h1>
        <section className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <img
              className="w-full rounded-md h-[15rem] object-cover"
              src="https://res.cloudinary.com/dxoqwusir/image/upload/v1732934194/barber-1453064_1280_o1vfee.jpg"
              alt=""
            />
          </div>

          <div className="col-span-1">
            <img
              className="w-full rounded-md h-[15rem] object-cover"
              src="http://res.cloudinary.com/dxoqwusir/image/upload/v1732934203/barber-5497152_1280_zgcao8.jpg"
              alt=""
            />
          </div>

          <div className="col-span-1">
            <img
              className="w-full rounded-md h-[15rem] object-cover"
              src="http://res.cloudinary.com/dxoqwusir/image/upload/v1732934217/beauty-salon-4043096_1280_itrjdr.jpg"
              alt=""
            />
          </div>
        </section>
      </div>

      <div className="mt-10 lg:w-[70%]">
        <div className="flex items-center pb-3 justify-between">
          <h1 className="text-2xl font-bold text-gray-600">Owner Details</h1>
        </div>
        <div>
          <ProfileFieldcard keys={"owner name"} value={"pablo "} />
          <Divider />
          <ProfileFieldcard
            keys={"email"}
            value={"pablo@gmail.com"}
          />
          <Divider />
          <ProfileFieldcard keys={"role"} value={"SALON_OWNER"} />
</div>
      </div>


      <div className="mt-10 lg:w-[70%]">
        <div className="flex items-center pb-3 justify-between">
          <h1 className="text-2xl font-bold text-gray-600">Salon Details</h1>
        </div>
        <div>
          <ProfileFieldcard keys={"salon name"} value={"pablo salon"} />
          <Divider />
          <ProfileFieldcard
            keys={"salon address"}
            value={"ambavadi choke, banglore"}
          />
          <Divider />
          <ProfileFieldcard keys={"open time"} value={"10:00:00 AM"} />
          <Divider />
          <ProfileFieldcard keys={"close time"} value={"9:00:00 PM"} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
