import React from 'react'
import {
    FiAlignLeft,
    FiInfo,
    FiPhoneCall,
    FiPlus,
    FiSlash,
    FiStar,
    FiTrash2,
    FiUserPlus,
    FiVideo,
    FiBellOff
} from 'react-icons/fi'

import { Link } from 'react-router-dom'
import Dropdown from '@/components/shared/Dropdown'
import topTost from '@/utils/topTost';

const chatItemsHeader = [
    { label: "Join Group", icon: <FiPlus /> },
    { label: "Invite People", icon: <FiUserPlus /> },
    { label: "Add to Favorite", icon: <FiStar /> },
    { label: "Mute Conversion", icon: <FiBellOff /> },
    { type: "divider" },
    { label: "Group Audio Call", icon: <FiPhoneCall /> },
    { label: "Group Video Call", icon: <FiVideo /> },
    { type: "divider" },
    { label: "Block Conversion", icon: <FiSlash /> },
    { label: "Delete Chat", icon: <FiTrash2 /> },
];

const ChatHeader = ({
    setSidebarOpen,
    selectedChat

}) => {
    const user = localStorage.getItem("user");
    const currentUserId = user ? JSON.parse(user).user_id : null;
    const handleClick = () => {
        topTost()
    };

    // NO CHAT SELECTED
    if (!selectedChat) {
        return (
            <div className="content-area-header sticky-top d-flex align-items-center justify-content-center">
                <h5 className="text-muted mb-0">
                    Select a chat to start messaging
                </h5>
            </div>
        )
    }

    const isGroup = selectedChat.chat_type === "group";

    const otherUser = selectedChat?.participants?.find(
        (p) => p.user_id !== currentUserId
    )?.user;

    const displayName = isGroup
        ? selectedChat.chat_name
        : otherUser?.full_name;

    const avatar = isGroup
        ? null
        : otherUser?.avatar_url;

    const isOnline = otherUser?.is_active;

    return (
        <>
            <div className="content-area-header sticky-top">

                {/* LEFT SIDE */}
                <div className="page-header-left hstack gap-4">

                    <Link
                        to="#"
                        className="app-sidebar-open-trigger"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <FiAlignLeft className='fs-20' />
                    </Link>

                    <Link
                        to="#"
                        className="d-flex align-items-center justify-content-center gap-3"
                    >

                        {/* AVATAR */}
                        {
                            avatar ? (
                                <div className="avatar-image">
                                    <img
                                        src={avatar}
                                        className="img-fluid rounded-circle"
                                        alt="image"
                                    />
                                </div>
                            ) : (
                                <div className="avatar-text user-avatar-text text-gray-800">
                                    {displayName?.substring(0, 1)}
                                </div>
                            )
                        }

                        {/* USER INFO */}
                        <div className="d-none d-sm-block">

                            <div className="fw-bold d-flex align-items-center">
                                {displayName}
                            </div>

                            <div className="d-flex align-items-center mt-1">

                                <span
                                    className={`wd-7 ht-7 rounded-circle opacity-75 me-2 
                                    ${isOnline ? "bg-success" : "bg-gray-500"}`}
                                ></span>

                                <span
                                    className={`fs-9 text-uppercase fw-bold 
                                    ${isOnline ? "text-success" : "text-muted"}`}
                                >
                                    {
                                        isGroup
                                            ? `${selectedChat?.participants?.length || 0} Participants`
                                            : isOnline
                                                ? "Active Now"
                                                : "Offline"
                                    }
                                </span>

                            </div>

                        </div>
                    </Link>
                </div>

                {/* RIGHT SIDE */}
                {/* <div className="page-header-right ms-auto">

                    <div className="d-flex align-items-center justify-content-center gap-2">

                        <Link
                            to="#"
                            className="d-flex"
                        >
                            <div
                                className="avatar-text avatar-md"
                                title="Voice Call"
                            >
                                <FiPhoneCall />
                            </div>
                        </Link>

                        <Link
                            to="#"
                            className="d-flex"
                        >
                            <div
                                className="avatar-text avatar-md"
                                title="Video Call"
                            >
                                <FiVideo />
                            </div>
                        </Link>

                        <Link
                            to="#"
                            className="d-flex d-none d-sm-block"
                            onClick={handleClick}
                        >
                            <div
                                className="avatar-text avatar-md"
                                title="Add to Favorite"
                            >
                                <FiStar />
                            </div>
                        </Link>

                        <Link
                            to="#"
                            className="ac-info-sidebar-open-trigger"
                        >
                            <div
                                className="avatar-text avatar-md"
                                title="Profile Info"
                            >
                                <FiInfo />
                            </div>
                        </Link>

                        <Dropdown
                            dropdownItems={chatItemsHeader}
                            triggerClass={"avatar-md"}
                            triggerPosition={"0,22"}
                        />

                    </div>

                </div> */}
            </div>
        </>
    )
}

export default ChatHeader