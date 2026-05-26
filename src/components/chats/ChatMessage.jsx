import React from "react";

import { FiDownload, FiPaperclip } from "react-icons/fi";
import {
  Check,
  CheckCheck,
  Clock3,
} from "lucide-react";

// ======================================
// FILE MESSAGE — moved above ChatMessage
// so it's defined before it's used
// ======================================

export const FileMessage = ({ attachments = [] }) => {
  return (
    <div className="d-flex flex-column gap-2">
      {attachments.map((file, index) => (
        <div
          key={index}
          className="d-flex align-items-center justify-content-between bg-white border rounded-3 p-2"
        >
          <div className="d-flex align-items-center gap-2">
            {file.file_type?.startsWith("image") ? (
              <img
                src={file.file_url}
                alt={file.file_name}
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            ) : (
              <FiPaperclip size={18} />
            )}

            <div>
              <div className="fw-semibold small">{file.file_name}</div>
              <small className="text-muted">{file.file_size}</small>
            </div>
          </div>

          <a href={file.file_url} target="_blank" rel="noreferrer">
            <FiDownload />
          </a>
        </div>
      ))}
    </div>
  );
};

// ======================================
// SINGLE CHAT MESSAGE — UI unchanged
// ======================================

const ChatMessage = ({ avatar, name, time, messages, isReplay, showHeader = true, messageStatus }) => {
  return (
    <div className="single-chat-item mb-3">

      {/* HEADER — only shown for first message in a group */}
      {showHeader && (
        <div className={`d-flex align-items-center gap-3 mb-3 ${isReplay ? "flex-row-reverse" : ""}`}>
          <a href="#" className="avatar-image">
            <img src={avatar} className="img-fluid rounded-circle" alt="avatar" />
          </a>
          <div className={`d-flex align-items-center gap-2 ${isReplay ? "flex-row-reverse" : ""}`}>
            <a href="#">{name}</a>
            <span className="wd-5 ht-5 bg-gray-400 rounded-circle"></span>
            <span className="fs-11 text-muted">{time}</span>
          </div>
        </div>
      )}

      {/* MESSAGE BUBBLE */}
      <div className={`wd-500 p-3 rounded-5 bg-gray-200 message-content ${isReplay ? "ms-auto" : ""}`}>
        {messages.map((msg, index) => (
          <React.Fragment key={index}>
            {msg.text && (
              <p
                className="py-2 px-3 rounded-5 bg-white mb-2"
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            )}

            {msg.attachments?.length > 0 && (
              <FileMessage attachments={msg.attachments} />
            )}
          </React.Fragment>
        ))}

        {/* TICK STATUS */}
        {isReplay && messageStatus && (
          <div className="d-flex justify-content-end mt-1">
            {messageStatus === "sending"   && <Clock3     size={14} className="text-muted" />}
            {messageStatus === "sent"      && <Check      size={16} className="text-muted" />}
            {messageStatus === "delivered" && <CheckCheck size={16} className="text-muted" />}
            {messageStatus === "read"      && <CheckCheck size={16} color="#0d6efd" />}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
