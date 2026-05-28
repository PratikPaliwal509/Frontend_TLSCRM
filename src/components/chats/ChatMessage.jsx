import React, { useState } from "react";

import {
  FiDownload,
  FiPaperclip,
  FiChevronDown,
} from "react-icons/fi";

import {
  Check,
  CheckCheck,
  Clock3,
} from "lucide-react";

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

// ======================================
// FILE MESSAGE
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
              <div className="fw-semibold small">
                {file.file_name}
              </div>

              <small className="text-muted">
                {file.file_size}
              </small>
            </div>
          </div>

          <a
            href={file.file_url}
            target="_blank"
            rel="noreferrer"
          >
            <FiDownload />
          </a>
        </div>
      ))}
    </div>
  );
};

// ======================================
// CHAT MESSAGE
// ======================================

const ChatMessage = ({
  avatar,
  name,
  time,
  messages,
  isReplay,
  showHeader = true,
  messageStatus,
  onReply,
  onEdit,
  onDelete,
}) => {

  const [hovered, setHovered] = useState(false);

  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  const toggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div
      className="single-chat-item mb-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      {/* HEADER */}

      {showHeader && (
        <div
          className={`d-flex align-items-center gap-3 mb-2 ${isReplay ? "flex-row-reverse" : ""
            }`}
        >

          <a href="#" className="avatar-image">
            <img
              src={avatar}
              className="img-fluid rounded-circle"
              alt="avatar"
            />
          </a>

          <div
            className={`d-flex align-items-center gap-2 ${isReplay ? "flex-row-reverse" : ""
              }`}
          >

            <a href="#">{name}</a>

            <span className="wd-5 ht-5 bg-gray-400 rounded-circle"></span>

            <span className="fs-11 text-muted">
              {time}
            </span>

          </div>
        </div>
      )}

      {/* MESSAGE BUBBLE */}

      <div
        className={`wd-500 p-3 rounded-4 bg-gray-200 message-content position-relative ${isReplay ? "ms-auto" : ""
          }`}
      >

        {/* MESSAGE LIST */}

        {messages?.map((msg, index) => (

          <div
            key={index}
            className="position-relative"
          >

            {/* WHATSAPP MENU */}

            <div
              style={{
                position: "absolute",
                top: "4px",
                right: "4px",
                opacity: hovered ? 1 : 0,
                transition: "0.2s ease",
                zIndex: 10,
              }}
            >

              <Dropdown
                isOpen={dropdownOpen}
                toggle={toggle}
              >

                <DropdownToggle
                  tag="div"
                  style={{
                    cursor: "pointer",
                    width: 24,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                  }}
                >
                  <FiChevronDown size={16} />
                </DropdownToggle>

                <DropdownMenu end>

                  <DropdownItem
                    onClick={() =>
                      onReply?.({
                        ...msg,
                        sender_name: name,
                      })
                    }
                  >
                    Reply
                  </DropdownItem>

                  <DropdownItem
                    onClick={() =>
                      onEdit?.({
                        ...msg,
                        sender_name: name,
                      })
                    }
                  >
                    Edit
                  </DropdownItem>

                  <DropdownItem
                    className="text-danger"
                    onClick={() =>
                      onDelete?.(msg)
                    }
                  >
                    Delete
                  </DropdownItem>

                </DropdownMenu>
              </Dropdown>
            </div>

            {/* REPLY PREVIEW */}

            {/* REPLY PREVIEW */}

            {msg.replyTo && (
              <div
                className="px-3 py-2 mb-2 rounded-3"
                style={{ background: "#f4f6f9", borderLeft: "4px solid #5e72e4" }}
              >
                <div className="fw-semibold mb-1" style={{ fontSize: 12, color: "#5e72e4" }}>
                  {msg.replyTo.sender_name}
                </div>

                {/* Show deleted state if original was deleted */}
                {msg.replyTo.is_deleted ? (
                  <div style={{ fontSize: 13, color: "#adb5bd", fontStyle: "italic" }}>
                    This message was deleted
                  </div>
                ) : (
                  <>
                    {msg.replyTo.text && (
                      <div style={{ fontSize: 13, color: "#6c757d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {msg.replyTo.text}
                      </div>
                    )}
                    {msg.replyTo.attachments?.length > 0 && (
                      <div className="d-flex align-items-center gap-2" style={{ background: "#fff", borderRadius: 8, padding: "6px 8px" }}>
                        {msg.replyTo.attachments[0]?.file_type?.startsWith("image") ? (
                          <img src={msg.replyTo.attachments[0].file_url} alt="reply"
                            style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }} />
                        ) : (
                          <FiPaperclip size={16} className="text-muted" />
                        )}
                        <div style={{ fontSize: 12, color: "#6c757d", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {msg.replyTo.attachments[0]?.file_name || "Attachment"}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            {/* TEXT */}

            {/* TEXT */}

            {msg.is_deleted ? (
              <p
                className="py-2 px-3 mb-2 text-muted fst-italic"
                style={{
                  background: "#f1f1f1",
                  borderRadius: 10,
                  opacity: 0.8,
                }}
              >
                This message was deleted
              </p>
            ) : (
              <>
                {msg.text && (
                  <div className="position-relative">

                    <p
                      className="py-2 px-3 bg-white mb-1"
                      dangerouslySetInnerHTML={{
                        __html: msg.text,
                      }}
                    />

                    {/* EDITED TAG */}
                    {msg.is_edited && (
                      <div
                        className="text-muted text-end pe-2"
                        style={{
                          fontSize: 11,
                          marginTop: "-4px",
                        }}
                      >
                        edited
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* ATTACHMENTS */}

            {!msg.is_deleted && msg.attachments?.length > 0 && (
              <FileMessage
                attachments={msg.attachments}
              />
            )}
          </div>
        ))}

        {/* MESSAGE STATUS */}

        {isReplay && messageStatus && (
          <div className="d-flex justify-content-end mt-1">

            {messageStatus === "sending" && (
              <Clock3
                size={14}
                className="text-muted"
              />
            )}

            {messageStatus === "sent" && (
              <Check
                size={16}
                className="text-muted"
              />
            )}

            {messageStatus === "delivered" && (
              <CheckCheck
                size={16}
                className="text-muted"
              />
            )}

            {messageStatus === "read" && (
              <CheckCheck
                size={16}
                color="#53bdeb"
              />
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default ChatMessage;