import React, { useState } from 'react'
import { FiAlignLeft, FiBell, FiBellOff, FiInfo, FiPhoneCall, FiPlus, FiSlash, FiStar, FiTrash2, FiUserPlus, FiVideo } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import Dropdown from '@/components/shared/Dropdown'
import topTost from '@/utils/topTost';

const chatItemsHeader = [
    { label: "Join Group", icon: <FiPlus /> },
    { label: "Invite People", icon: <FiUserPlus /> },
    { label: "Add to Favorite", icon: <FiStar /> },
    { label: "Mute Conversion", icon: <FiBellOff /> },
    { type: "divider" },
    { label: "Group Audio Call", icon: <FiPhoneCall />, },
    { label: "Group Video Call", icon: <FiVideo />, },
    { type: "divider" },
    { label: "Block Conversion", icon: <FiSlash /> },
    { label: "Delete Chat", icon: <FiTrash2 /> },
];
const ChatHeader = ({setSidebarOpen}) => {
    const handleClick = () => {
        topTost()
    };
    return (
        <>
            <div className="content-area-header sticky-top">
                <div className="page-header-left hstack gap-4">
                    <Link to="#" className="app-sidebar-open-trigger" onClick={()=>setSidebarOpen(true)}>
                        <FiAlignLeft className='fs-20' />
                    </Link>
                    <Link to="#" className="d-flex align-items-center justify-content-center gap-3" data-bs-toggle="offcanvas" data-bs-target="#userProfileDetails">
                        <div className="avatar-image">
                            <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAmgMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAABQYHBAEC/8QANRAAAgIBAgIHBQcFAQAAAAAAAAECAwQFEQYxEiFBQlFhsSKBkaHBExQjUnFy0TIzYoLhJf/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAARAf/aAAwDAQACEQMRAD8A1IAGmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAABAAAAAAAAAAAAAAAAAARU+K9enVKWBhWdGW341kea37q+pRKanxHg6fJ19KV9yezhVs9n5vsIiXGk+l7OBHo+dr39Cp+4FSr1g8XYN8lDJrsxpPq6T64/HmvgWCEozgpwkpRkt1KL3TRkpM8O65Zplyquk5Ykn7UX3P8AJfUK0IHiakk4tOL6012npAABAAAAAAAAAAAAAAcmq5iwNOvytt3CPsp9sn1L5szCUpTk5zbcpPdt9rL1xvNx0eMVyldFP4NlELhoACoD9AAL1wXnPJ02WNN7yxmkv2vl9UWEpHAs2tSvguUqd37mv5LuRQAEAAAAAAAAAAAAABA8aV9PReku5bFv5r6ooRqOpYizsC/Flt+JBpb9j5r5pGYWQlXOULIuM4ycZJ9jRcTXyACgAALNwJXvnZNnZGpL4v8A4XUgeDcJ4ulu6cdp5L6fX+Xu/V+8niKAAgAAAAAAAAAAAAABWuJeHnmzeZgpfeO/Xy6fmvMsoKMnuqsosdd1c65ruzjsz4NWvxqMmPRyKK7Y+E4pnG9C0ltt6fQn5Lb5CkZqut7Lm+wsegcNXZNkL9QrdWOutQl1Ss8OrsRb8bAw8Z742JTW/wA0IJP4nSKR4kkkkkkuxHoBAAAAAAAAAAAAAAACK1zW6NJr2e1mTJbwqT+b8EUSORfTjVO3ItjVWucpvZFczuMMetuODQ7n+ebcY/Dn6FVz9QydQu+1yrXN9i5Rj+iOUQqayOKdWufsWwpj4QrXq9zmeu6s3v8Af7vcyOBUS9PEurVPd5X2iXdshFp/LclcLjKSajnYqa/PS+X+r/kqYBWoYGpYmoQcsW6M9uceTX6o6zJ6bbKLI2U2Srsj1xlF7NFz4f4ljluOLqHRhfyhYuqM/J+D9SRasoHIAAAQAAAAAAAfry8QI7XNUhpWFK1pStl7NUPGX8IznIvtyb53X2Oyyct5Sfad3EOovUtSssi/wYexUvJdvvI00gAAAAAAAAAALxwnrbzK/uWVNvIrW8JPvxXj5osZlGPfZjX130y6NlclKL8GjT9Py4Z2FTlV9UbI77b8n2r4k1cdAAIAAAAAARfEmW8PR8icXtOa+zjt59XpuShVePLdqMOld6cpP3JJepRTgAVAAAAAAAAAAAC48C5bdWThyl/S1ZBeT6n89n7ynE1wfa69dqj2WQlB/Df6BcaCADIAAAAABTuPf7+F+yfqgC4KqACoAAAAAAAAAAASnDD/APfwv3v0YAXGj9gAMgAAP//Z" className="img-fluid" alt="image" />
                        </div>
                        <div className="d-none d-sm-block">
                            <div className="fw-bold d-flex align-items-center">Alexandra Della</div>
                            <div className="d-flex align-items-center mt-1">
                                <span className="wd-7 ht-7 rounded-circle opacity-75 me-2 bg-success"></span>
                                <span className="fs-9 text-uppercase fw-bold text-success">Active Now</span>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="page-header-right ms-auto">
                    <div className="d-flex align-items-center justify-content-center gap-2">
                        <Link to="#" className="d-flex" data-bs-toggle="modal" data-bs-target="#voiceCallingModalScreen">
                            <div className="avatar-text avatar-md" data-bs-toggle="tooltip" data-bs-trigger="hover" title="Voice Call">
                                <FiPhoneCall />
                            </div>
                        </Link>
                        <Link to="#" className="d-flex d-flex" data-bs-toggle="modal" data-bs-target="#videoCallingModalScreen">
                            <div className="avatar-text avatar-md" data-bs-toggle="tooltip" data-bs-trigger="hover" title="Video Call">
                                <FiVideo />
                            </div>
                        </Link>
                        <Link to="#" className="d-flex d-none d-sm-block" onClick={handleClick}>
                            <div className="avatar-text avatar-md" data-bs-toggle="tooltip" data-bs-trigger="hover" title="Add to Favorite">
                                <FiStar />
                            </div>
                        </Link>
                        <Link to="#" className="ac-info-sidebar-open-trigger" data-bs-toggle="offcanvas" data-bs-target="#userProfileDetails">
                            <div className="avatar-text avatar-md" data-bs-toggle="tooltip" data-bs-trigger="hover" title="Profile Info">
                                <FiInfo />
                            </div>
                        </Link>

                        <Dropdown dropdownItems={chatItemsHeader} triggerClass={"avatar-md"} triggerPosition={"0,22"} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatHeader