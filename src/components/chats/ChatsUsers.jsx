
import React, {
  Fragment,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { FiX } from "react-icons/fi";

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
} from "react-icons/fi";

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
  {
    label: "Make as Read",
    icon: <FiCheckCircle />,
  },
  {
    label: "Add to Favorite",
    icon: <FiStar />,
  },
  {
    label: "Mute Notifications",
    icon: <FiBellOff />,
  },
  { type: "divider" },
  {
    label: "Audio Call",
    icon: <FiPhoneCall />,
    modalTarget:
      "#voiceCallingModalScreen",
  },
  {
    label: "Video Call",
    icon: <FiVideo />,
    modalTarget:
      "#videoCallingModalScreen",
  },
  {
    label: "Send eMail",
    icon: <FiMail />,
  },
  { type: "divider" },
  {
    label: "Report Chat",
    icon: <FiAlertTriangle />,
  },
  {
    label: "Delete Chat",
    icon: <FiTrash2 />,
  },
  {
    label: "Archive Chat",
    icon: <FiArchive />,
  },
];

const ChatsUsers = ({
  sidebarOpen,
  setSidebarOpen,
  handleSelectChat,
  selectedChat,
  chats,
}) => {

  const [selectOption, setSelectOption] =
    useState("Newest");

  const user =
    localStorage.getItem("user");

  const currentUserId = user
    ? JSON.parse(user).user_id
    : null;

  return (
    <div
      className={`content-sidebar content-sidebar-xl ${sidebarOpen
          ? "app-sidebar-open"
          : ""
        }`}
    >
      <PerfectScrollbar>

        {/* HEADER */}

        <div className="content-sidebar-header bg-white sticky-top hstack justify-content-between">

          <h4 className="fw-bolder mb-0">
            Chat
          </h4>
          <button
            className="btn btn-primary btn-sm ms-2"
            onClick={() => setSidebarOpen(true)}
          >
            New Chat
          </button>
          <a
            href="#"
            className="app-sidebar-close-trigger d-flex"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <FiX size={16} />
          </a>
        </div>

        {/* BODY */}

        <div className="content-sidebar-body">

          {/* SEARCH */}

          <div className="py-0 px-4 d-flex align-items-center justify-content-between border-bottom">

            <form className="sidebar-search">
              <input
                type="search"
                className="py-3 px-0 border-0"
                placeholder="Search..."
              />
            </form>

            {/* FILTER */}

            <div className="filter-dropdown sidebar-filter">

              <a
                href="#"
                data-bs-toggle="dropdown"
                className="d-flex align-items-center justify-content-center dropdown-toggle"
              >
                {selectOption}
              </a>

              <ul className="dropdown-menu dropdown-menu-end overflow-auto">

                {filteringOptions.map(
                  (option, index) => (
                    <Fragment key={index}>

                      {index === 4 && (
                        <li className="dropdown-divider"></li>
                      )}

                      <li
                        onClick={() =>
                          setSelectOption(
                            option
                          )
                        }
                      >
                        <Link
                          to="#"
                          className={`dropdown-item ${selectOption ===
                              option
                              ? "active"
                              : ""
                            }`}
                        >
                          {option}
                        </Link>
                      </li>

                      {index === 5 && (
                        <li className="dropdown-divider"></li>
                      )}
                    </Fragment>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* CHAT LIST */}

          <div className="content-sidebar-items">

            {chats.map((chat) => {

              const lastMessage =
                chat.messages?.[
                chat.messages.length - 1
                ];

              const isGroup =
                chat.chat_type === "group";

              const otherUser =
                chat.participants?.find(
                  (p) =>
                    p.user_id !==
                    currentUserId
                )?.user;

              const displayName = isGroup
                ? chat.chat_name
                : otherUser?.full_name;

              const avatar = isGroup
                ? null
                : otherUser?.avatar_url;

              return (
                <div
                  key={chat.chat_id}
                  onClick={() =>
                    handleSelectChat(chat)
                  }
                  className={`p-4 d-flex position-relative border-bottom c-pointer single-item chat-single-item

                  ${selectedChat?.chat_id ===
                      chat.chat_id
                      ? "bg-gray-200"
                      : ""
                    }`}
                >

                  {/* AVATAR */}

                  {avatar ? (
                    <div className="avatar-image">
                      <img
                        src={avatar}
                        className="img-fluid"
                        alt="avatar"
                      />
                    </div>
                  ) : (
                    <div className="text-white avatar-text user-avatar-text">
                      {displayName?.substring(
                        0,
                        1
                      )}
                    </div>
                  )}

                  {/* INFO */}

                  <div className="ms-3 item-desc w-100">

                    <div className="w-100 d-flex justify-content-between align-items-center">

                      <span className="fw-semibold">
                        {displayName}
                      </span>

                      <span className="fs-10 text-muted">

                        {lastMessage?.created_at
                          ? new Date(
                            lastMessage.created_at
                          ).toLocaleTimeString(
                            [],
                            {
                              hour:
                                "2-digit",
                              minute:
                                "2-digit",
                            }
                          )
                          : ""}
                      </span>

                      <Dropdown
                        dropdownItems={
                          chatItems
                        }
                      />
                    </div>

                    {/* LAST MESSAGE */}

                    <p className="fs-12 fw-semibold mt-2 mb-0 text-truncate-2-line">

                      {lastMessage?.message_text ||
                        "No messages yet"}
                    </p>
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