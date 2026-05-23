import React from "react";
import {
  FiCheck,
  FiCheckCircle,
} from "react-icons/fi";

const MessageStatus = ({ status }) => {
  if (status === "sent") {
    return <FiCheck size={14} />;
  }

  if (status === "delivered") {
    return (
      <div className="d-flex">
        <FiCheck size={14} />
        <FiCheck
          size={14}
          className="ms-n1"
        />
      </div>
    );
  }

  if (status === "seen") {
    return (
      <div className="text-info">
        <FiCheckCircle size={14} />
      </div>
    );
  }

  return null;
};

export default MessageStatus;