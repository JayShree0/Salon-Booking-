import { Card } from "@mui/material";
import React from "react";
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';

const NotificationCard = () => {
  return (
    <div>
      <Card
        sx={{
          bgcolor: "#EAF0F1",
        }}
        className={`cursor-pointer p-5 flex items-center gap-5`}>
        <NotificationsActiveOutlinedIcon/>
        <div>
            <p>Your booking got confimed</p>
            <h1 className="space-x-3">
                {[1,1,1,1,1,1,1].map((item) => 
                <span>hair cut</span>
                )}
            </h1>
        </div>
      </Card>
    </div>
  );
};

export default NotificationCard;
