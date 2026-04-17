import React from "react";

const NotificationsHeader = () => {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <div>
        <h4 className="fw-bold mb-1">Notifications</h4>
        <p className="text-muted fs-12 mb-0">
          Manage all system notifications
        </p>
      </div>
    </div>
  );
};

export default NotificationsHeader;