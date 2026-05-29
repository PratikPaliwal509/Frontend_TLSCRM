import React, {
  Fragment,
  useState,
} from "react";
import { Link } from "react-router-dom";

import Dropdown from "@/components/shared/Dropdown";

import {
  FiAlertTriangle,
  FiArchive,
  FiBellOff,
  FiCheckCircle,
  FiMail,
  FiPhoneCall,
  FiStar,
  FiTrash2,
  FiImage,
  FiFileText,
  FiVideo,
  FiMusic,
  FiPaperclip,

} from "react-icons/fi";
import { FiX } from "react-icons/fi";
import PerfectScrollbar from "react-perfect-scrollbar";

const filteringOptions = [
  "Oldest",
  "Newest",
  "Replied",
  "Snoozed",
  "Ascending",
  "Descending",
  "Mute Conversion",
  "Block Conversion",
  "Delete Conversion",
];

const chatItems = [
  { label: "Make as Read", icon: <FiCheckCircle /> },
  { label: "Add to Favorite", icon: <FiStar /> },
  { label: "Mute Notifications", icon: <FiBellOff /> },
  { type: "divider" },
  { label: "Audio Call", icon: <FiPhoneCall />, modalTarget: "#voiceCallingModalScreen" },
  { label: "Video Call", icon: <FiVideo />, modalTarget: "#videoCallingModalScreen" },
  { label: "Send eMail", icon: <FiMail /> },
  { type: "divider" },
  { label: "Report Chat", icon: <FiAlertTriangle /> },
  { label: "Delete Chat", icon: <FiTrash2 /> },
  { label: "Archive Chat", icon: <FiArchive /> },
];

/**
 * Build the last-message preview text for a chat.
 * Handles: deleted messages, file-only messages, edited messages.
 */
const getLastMessagePreview = (chat, currentUserId) => {
  // Support both messages[] array and flat last_message / latestMessage fields
  const msgs = chat.messages?.length
    ? chat.messages
    : chat.last_message
      ? [chat.last_message]
      : chat.latestMessage
        ? [chat.latestMessage]
        : [];

  if (!msgs.length) return "No messages yet";

  const last = msgs[msgs.length - 1];
  if (!last) return "No messages yet";

  if (last.is_deleted) return "🚫 This message was deleted";

  const isMine = last.sender_id === currentUserId;
  const prefix = isMine ? "You: " : "";

  // message_text may come as message_text OR text depending on API shape
  const rawText = last.message_text ?? last.text ?? "";

  if (rawText) {
    const edited = last.is_edited ? " (edited)" : "";
    // strip HTML tags for clean preview
    const plain = rawText.replace(/<[^>]*>/g, "").trim();
    if (plain) return `${prefix}${plain}${edited}`;
  }

  if (last.attachments?.length) {

    const file = last.attachments[0];

    const type = file?.file_type || "";

    // IMAGE
    if (type.startsWith("image")) {
      return (
        <>
          <FiImage
            size={14}
            className="me-1"
          />
          {prefix}Photo
        </>
      );
    }

    // VIDEO
    if (type.startsWith("video")) {
      return (
        <>
          <FiVideo
            size={14}
            className="me-1"
          />
          {prefix}Video
        </>
      );
    }

    // AUDIO
    if (type.startsWith("audio")) {
      return (
        <>
          <FiMusic
            size={14}
            className="me-1"
          />
          {prefix}Audio
        </>
      );
    }

    // PDF / DOC
    if (
      type.includes("pdf") ||
      type.includes("document") ||
      type.includes("word")
    ) {
      return (
        <>
          <FiFileText
            size={14}
            className="me-1"
          />
          {prefix}Document
        </>
      );
    }

    // DEFAULT
    return (
      <>
        <FiPaperclip
          size={14}
          className="me-1"
        />
        {prefix}Attachment
      </>
    );
  }

  // message_type fallback (e.g. API returns type but no text yet)
  if (last.message_type === "file") {
    return (
      <>
        <FiPaperclip
          size={14}
          className="me-1"
        />
        {prefix}Attachment
      </>
    );
  }

  if (last.message_type === "image") {
    return (
      <>
        <FiImage
          size={14}
          className="me-1"
        />
        {prefix}Photo
      </>
    );
  }

  if (last.message_type === "video") {
    return (
      <>
        <FiVideo
          size={14}
          className="me-1"
        />
        {prefix}Video
      </>
    );
  }

  if (last.message_type === "audio") {
    return (
      <>
        <FiMusic
          size={14}
          className="me-1"
        />
        {prefix}Audio
      </>
    );
  }

  if (last.message_type === "document") {
    return (
      <>
        <FiFileText
          size={14}
          className="me-1"
        />
        {prefix}Document
      </>
    );
  }

  return "No messages yet";
};

const ChatsUsers = ({
  sidebarOpen,
  setSidebarOpen,
  handleSelectChat,
  selectedChat,
  chats,
  chatUnreadCounts = {},   // { [chat_id]: number }
  chatTypingUsers = {},    // { [chat_id]: { [user_id]: name } }
}) => {
  const [selectOption, setSelectOption] = useState("Newest");

  const user = localStorage.getItem("user");
  const currentUserId = user ? JSON.parse(user).user_id : null;

  return (
    <div
      className={`content-sidebar content-sidebar-xl ${sidebarOpen ? "app-sidebar-open" : ""}`}
    >
      <PerfectScrollbar>

        {/* HEADER */}
        <div className="content-sidebar-header bg-white sticky-top hstack justify-content-between">
          <h4 className="fw-bolder mb-0">Chat</h4>
          <button
            className="btn btn-primary btn-sm ms-2"
            onClick={() => setSidebarOpen(true)}
          >
            New Chat
          </button>
          <a
            href="#"
            className="app-sidebar-close-trigger d-flex"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX size={16} />
          </a>
        </div>

        {/* BODY */}
        <div className="content-sidebar-body">

          {/* SEARCH + FILTER */}
          <div className="py-0 px-4 d-flex align-items-center justify-content-between border-bottom">
            <form className="sidebar-search">
              <input
                type="search"
                className="py-3 px-0 border-0"
                placeholder="Search..."
              />
            </form>

            <div className="filter-dropdown sidebar-filter">
              <a
                href="#"
                data-bs-toggle="dropdown"
                className="d-flex align-items-center justify-content-center dropdown-toggle"
              >
                {selectOption}
              </a>
              <ul className="dropdown-menu dropdown-menu-end overflow-auto">
                {filteringOptions.map((option, index) => (
                  <Fragment key={index}>
                    {index === 4 && <li className="dropdown-divider"></li>}
                    <li onClick={() => setSelectOption(option)}>
                      <Link
                        to="#"
                        className={`dropdown-item ${selectOption === option ? "active" : ""}`}
                      >
                        {option}
                      </Link>
                    </li>
                    {index === 5 && <li className="dropdown-divider"></li>}
                  </Fragment>
                ))}
              </ul>
            </div>
          </div>

          {/* CHAT LIST */}
          <div className="content-sidebar-items">
            {chats.map((chat) => {

              const isGroup = chat.chat_type === "group";

              const otherUser = chat.participants?.find(
                (p) => p.user_id !== currentUserId
              )?.user;

              const displayName = isGroup ? chat.chat_name : otherUser?.full_name;
              const avatar = isGroup ? null : otherUser?.avatar_url;

              // ── last message preview ──────────────────────────
              const lastMessagePreview = getLastMessagePreview(chat, currentUserId);

              // ── timestamp from last message (same fallback as preview helper) ──
              const msgs = chat.messages?.length
                ? chat.messages
                : chat.last_message
                  ? [chat.last_message]
                  : chat.latestMessage
                    ? [chat.latestMessage]
                    : [];
              const lastMessage = msgs[msgs.length - 1];
              const lastTime = lastMessage?.created_at
                ? new Date(lastMessage.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : "";

              // ── unread badge ──────────────────────────────────
              const unreadCount = chatUnreadCounts[chat.chat_id] || 0;

              // ── typing indicator ──────────────────────────────
              const typers = chatTypingUsers[chat.chat_id] || {};
              const typerNames = Object.values(typers);
              const isTyping = typerNames.length > 0;

              // typing text: "John typing..." or "John, Jane typing..."
              const typingText =
                typerNames.length === 1
                  ? `${typerNames[0]} typing…`
                  : `${typerNames.slice(0, 2).join(", ")} typing…`;

              return (
                <div
                  key={chat.chat_id}
                  onClick={() => handleSelectChat(chat)}
                  className={`p-4 d-flex position-relative border-bottom c-pointer single-item chat-single-item ${selectedChat?.chat_id === chat.chat_id ? "bg-gray-200" : ""
                    }`}
                >

                  {/* AVATAR */}
                  {avatar ? (
                    <div className="avatar-image">
                      <img src={avatar} className="img-fluid" alt="avatar" />
                    </div>
                  ) : (
                    <div className="text-white avatar-text user-avatar-text">
                      {displayName?.substring(0, 1)}
                    </div>
                  )}

                  {/* INFO */}
                  <div className="ms-3 item-desc w-100">

                    {/* TOP ROW: name + time + unread badge */}
                    <div className="w-100 d-flex justify-content-between align-items-center">
                      <span className="fw-semibold">{displayName}</span>

                      <div className="d-flex align-items-center gap-2 ms-auto">
                        {unreadCount > 0 && (
                          <span
                            className="badge rounded-pill bg-primary"
                            style={{ fontSize: 10, minWidth: 18, textAlign: "center" }}
                          >
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                        <span className="fs-10 text-muted">{lastTime}</span>
                      </div>

                      <Dropdown dropdownItems={chatItems} />
                    </div>

                    {/* BOTTOM ROW: typing OR last message preview */}
                    {isTyping ? (
                      <p
                        className="fs-12 fw-semibold mt-2 mb-0 text-primary"
                        style={{ fontStyle: "italic" }}
                      >
                        {typingText}
                      </p>
                    ) : (
                      <div
                        className={`fs-12 mt-2 mb-0 d-flex align-items-center gap-1 text-truncate-2-line ${lastMessage?.is_deleted
                          ? "text-muted fst-italic"
                          : unreadCount > 0
                            ? "fw-bold"
                            : "fw-semibold"
                          }`}
                      >
                        {lastMessagePreview}
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <a
          href="#"
          className="content-sidebar-footer px-4 py-3 fs-11 text-uppercase d-block text-center"
        >
          Load More
        </a>
      </PerfectScrollbar>
    </div>
  );
};

export default ChatsUsers;
