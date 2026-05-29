import React from "react";

const GroupAvatar = ({
  participants = [],
}) => {
  const visibleUsers =
    participants.slice(0, 3);

  return (
    <div className="d-flex align-items-center">
      {visibleUsers.map((user, index) => (
        <div
          key={user.user_id}
          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center border border-white"
          style={{
            width: 35,
            height: 35,
            marginLeft: index === 0 ? 0 : -10,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {user.name?.charAt(0)}
        </div>
      ))}
    </div>
  );
};

export default GroupAvatar;