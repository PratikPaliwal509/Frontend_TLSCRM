import React from "react";

const TypingIndicator = ({
  users = [],
}) => {
  return (
    <div className="d-flex align-items-center gap-2 px-3 py-2">
      <div className="typing-loader">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <small className="text-muted">
        {users.join(", ")} typing...
      </small>
    </div>
  );
};

export default TypingIndicator;