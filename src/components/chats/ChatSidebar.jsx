import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";

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
  FiVideo,
  FiX,
  FiUsers,
} from "react-icons/fi";

const API_URL = "http://localhost:5000/api";

const filteringOptions = [
  "Newest",
  "Oldest",
  "Unread",
  "Groups",
  "Direct",
];

const chatItems = [
  { label: "Make as Read", icon: <FiCheckCircle /> },
  { label: "Add to Favorite", icon: <FiStar /> },
  { label: "Mute Notifications", icon: <FiBellOff /> },
  { type: "divider" },
  {
    label: "Audio Call",
    icon: <FiPhoneCall />,
    modalTarget: "#voiceCallingModalScreen",
  },
  {
    label: "Video Call",
    icon: <FiVideo />,
    modalTarget: "#videoCallingModalScreen",
  },
  { label: "Send eMail", icon: <FiMail /> },
  { type: "divider" },
  { label: "Report Chat", icon: <FiAlertTriangle /> },
  { label: "Delete Chat", icon: <FiTrash2 /> },
  { label: "Archive Chat", icon: <FiArchive /> },
];

const ChatSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  selectedChat,
  setSelectedChat,
}) => {
  const [selectOption, setSelectOption] = useState("Newest");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [chats, setChats] = useState([]);

  const currentUserId = Number(localStorage.getItem("user_id")) || 5;

  const token = localStorage.getItem("token");

  // ================= FETCH CHATS =================
  const getChats = async () => {
    try {
      setLoading(true);
console.log(currentUserId)
      const res = await fetch(`${API_URL}/chats/user/${currentUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setChats(data?.data || []);
      }
    } catch (error) {
      console.error("Get Chats Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChats();
  }, []);

  // ================= FILTERED CHATS =================
  const filteredChats = useMemo(() => {
    let temp = [...chats];

    // Search
    if (search.trim()) {
      temp = temp.filter((chat) =>
        (
          chat.chat_name ||
          chat.project?.project_name ||
          "Unknown Chat"
        )
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // Filter
    if (selectOption === "Groups") {
      temp = temp.filter((chat) => chat.chat_type === "group");
    }

    if (selectOption === "Direct") {
      temp = temp.filter((chat) => chat.chat_type === "direct");
    }

    if (selectOption === "Unread") {
      temp = temp.filter((chat) => chat.unread_count > 0);
    }

    // Sort
    if (selectOption === "Oldest") {
      temp.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    } else {
      temp.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );
    }

    return temp;
  }, [chats, search, selectOption]);

  // ================= CHAT TITLE =================
  const getChatTitle = (chat) => {
    if (chat.chat_name) return chat.chat_name;

    if (chat.chat_type === "project") {
      return chat.project?.project_name || "Project Chat";
    }

    if (chat.chat_type === "task") {
      return chat.task?.task_title || "Task Chat";
    }

    if (chat.chat_type === "group") {
      return "Group Chat";
    }

    // direct chat
    const otherUser = chat.participants?.find(
      (p) => p.user_id !== currentUserId
    );

    if (otherUser?.user) {
      return `${otherUser.user.first_name} ${otherUser.user.last_name}`;
    }

    return "Direct Chat";
  };

  // ================= LAST MESSAGE =================
  const getLastMessage = (chat) => {
    if (!chat.messages?.length) {
      return "No messages yet";
    }

    const lastMessage = chat.messages[0];

    if (lastMessage.message_type === "image") {
      return "📷 Image";
    }

    if (lastMessage.message_type === "file") {
      return "📎 File";
    }

    return lastMessage.message_text || "Message";
  };

  // ================= TIME =================
  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ================= AVATAR =================
  const renderAvatar = (chat) => {
    if (chat.chat_type === "group") {
      return (
        <div className="avatar-text bg-primary text-white">
          <FiUsers />
        </div>
      );
    }

    const otherUser = chat.participants?.find(
      (p) => p.user_id !== currentUserId
    );

    if (otherUser?.user?.avatar_url) {
      return (
        <div className="avatar-image">
          <img
            src={otherUser.user.avatar_url}
            className="img-fluid"
            alt="avatar"
          />
        </div>
      );
    }

    const firstLetter =
      otherUser?.user?.first_name?.charAt(0)?.toUpperCase() || "U";

    return (
      <div className="avatar-text user-avatar-text text-white">
        {firstLetter}
      </div>
    );
  };

  return (
    <div
      className={`content-sidebar content-sidebar-xl ${
        sidebarOpen ? "app-sidebar-open" : ""
      }`}
    >
      <PerfectScrollbar>
        {/* ================= HEADER ================= */}
        <div className="content-sidebar-header bg-white sticky-top hstack justify-content-between">
          <h4 className="fw-bolder mb-0">Chats</h4>

          <button
            className="app-sidebar-close-trigger d-flex border-0 bg-transparent"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX size={16} />
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="content-sidebar-body">
          {/* SEARCH + FILTER */}
          <div className="py-0 px-4 d-flex align-items-center justify-content-between border-bottom">
            <form
              className="sidebar-search w-100"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="search"
                className="py-3 px-0 border-0 w-100"
                placeholder="Search chats..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                    <li onClick={() => setSelectOption(option)}>
                      <Link
                        to="#"
                        className={`dropdown-item ${
                          selectOption === option ? "active" : ""
                        }`}
                      >
                        {option}
                      </Link>
                    </li>
                  </Fragment>
                ))}
              </ul>
            </div>
          </div>

          {/* ================= CHAT LIST ================= */}
          <div className="content-sidebar-items">
            {loading ? (
              <div className="p-4 text-center">
                <div className="spinner-border spinner-border-sm"></div>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="p-5 text-center text-muted">
                No chats found
              </div>
            ) : (
              filteredChats.map((chat) => {
                const title = getChatTitle(chat);
                const lastMessage = getLastMessage(chat);

                const active =
                  selectedChat?.chat_id === chat.chat_id;

                return (
                  <div
                    key={chat.chat_id}
                    className={`p-4 d-flex position-relative border-bottom c-pointer single-item chat-single-item ${
                      active ? "bg-gray-100" : ""
                    }`}
                    onClick={() => setSelectedChat(chat)}
                  >
                    {/* AVATAR */}
                    {renderAvatar(chat)}

                    {/* CONTENT */}
                    <div className="ms-3 item-desc flex-grow-1 overflow-hidden">
                      <div className="w-100 d-flex align-items-center justify-content-between">
                        <div className="hstack gap-2 me-2 overflow-hidden">
                          <span className="fw-semibold text-truncate">
                            {title}
                          </span>

                          {chat.is_online && (
                            <div className="wd-5 ht-5 rounded-circle bg-success"></div>
                          )}
                        </div>

                        <div className="d-flex align-items-center gap-2">
                          <span className="fs-11 text-muted">
                            {formatTime(
                              chat.messages?.[0]?.created_at ||
                                chat.updated_at
                            )}
                          </span>

                          <Dropdown dropdownItems={chatItems} />
                        </div>
                      </div>

                      {/* LAST MESSAGE */}
                      <div className="d-flex align-items-center justify-content-between mt-2">
                        <p
                          className={`fs-12 mb-0 text-truncate ${
                            chat.unread_count > 0
                              ? "fw-bold text-dark"
                              : "text-muted"
                          }`}
                          style={{ maxWidth: "85%" }}
                        >
                          {lastMessage}
                        </p>

                        {/* UNREAD COUNT */}
                        {chat.unread_count > 0 && (
                          <div className="badge bg-primary rounded-pill">
                            {chat.unread_count}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="content-sidebar-footer px-4 py-3 fs-11 text-uppercase d-block text-center">
          Total Chats : {filteredChats.length}
        </div>
      </PerfectScrollbar>
    </div>
  );
};

export default ChatSidebar;