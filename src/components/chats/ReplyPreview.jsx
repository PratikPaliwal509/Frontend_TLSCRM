import React from "react";
import { FiX } from "react-icons/fi";

const ReplyPreview = ({
  replyMessage,
  clearReply,
}) => {
  if (!replyMessage) return null;

  return (
    <div className="border-top px-3 py-2 bg-light">
      <div className="d-flex align-items-start justify-content-between">
        <div>
          <small className="fw-bold text-primary">
            Replying to{" "}
            {replyMessage.sender_name}
          </small>

          <div className="small text-muted mt-1">
            {replyMessage.message_text}
          </div>
        </div>

        <button
          className="btn btn-sm"
          onClick={clearReply}
        >
          <FiX />
        </button>
      </div>
    </div>
  );
};

export default ReplyPreview;