import React, {
    useEffect,
    useState,
} from "react";

import PerfectScrollbar from "react-perfect-scrollbar";

import {
    FiArrowLeft,
    FiSearch,
    FiUsers,
} from "react-icons/fi";

const NewChatUsers = ({
    sidebarOpen,
    setSidebarOpen,
    handleCreateChat,
    handleCreateGroup,
    setActiveSidebar,
}) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredUsers, setFilteredUsers] =
        useState([]);
    const [search, setSearch] =
        useState("");

    const [isGroupMode, setIsGroupMode] =
        useState(false);

    const [selectedUsers, setSelectedUsers] =
        useState([]);

    const [groupName, setGroupName] =
        useState("");

    const [step, setStep] =
        useState(1);
    const token = localStorage.getItem('token')
    const user =
        localStorage.getItem("user");

    const currentUserId = user
        ? JSON.parse(user).user_id
        : null;

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (!search.trim()) {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(
                (u) =>
                    u.full_name
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        ) ||
                    u.email
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )
            );

            setFilteredUsers(filtered);
        }
    }, [search, users]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/users/user', {
                headers: { Authorization: `Bearer ${token}` },
            })

            const data =
                await response.json();
            console.log("Fetched users:", data);
            const filtered =
                data?.data?.filter(
                    (u) =>
                        u.user_id !==
                        currentUserId
                ) || [];

            setUsers(filtered);
            setFilteredUsers(filtered);
        } catch (error) {
            console.log(
                "Fetch users error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };
    const handleSelectGroupUser = (user) => {

        const exists = selectedUsers.find(
            (u) => u.user_id === user.user_id
        );

        if (exists) {

            setSelectedUsers((prev) =>
                prev.filter(
                    (u) => u.user_id !== user.user_id
                )
            );

        } else {

            setSelectedUsers((prev) => [
                ...prev,
                user,
            ]);
        }
    };
    return (
        <div
            className={`content-sidebar content-sidebar-xl ${sidebarOpen
                ? "app-sidebar-open"
                : ""
                }`}
        >
            <PerfectScrollbar>
                {/* HEADER */}

                <div className="content-sidebar-header bg-white sticky-top hstack justify-content-between border-bottom">

                    <div className="d-flex align-items-center">

                        <button
                            className="btn btn-sm me-3"
                            onClick={() =>
                                setSidebarOpen(false)
                            }
                        >
                            <FiArrowLeft size={18} />
                        </button>

                        <h5 className="mb-0 fw-bold">
                            {isGroupMode
                                ? step === 1
                                    ? "Add Participants"
                                    : "New Group"
                                : "New Chat"}
                        </h5>
                    </div>
                </div>

                {/* SEARCH */}

                <div className="p-3 border-bottom">

                    <div className="position-relative">

                        <FiSearch
                            className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                        />

                        <input
                            type="text"
                            className="form-control ps-5"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>
                </div>
                {/* SELECTED USERS */}

                {isGroupMode &&
                    selectedUsers.length > 0 && (
                        <div className="p-3 border-bottom d-flex flex-wrap gap-2">

                            {selectedUsers.map((user) => (

                                <div
                                    key={user.user_id}
                                    className="badge bg-primary p-2"
                                >
                                    {user.full_name}
                                </div>
                            ))}
                        </div>
                    )}
                {/* CREATE GROUP */}

                <div
                    className="p-3 d-flex align-items-center border-bottom c-pointer hover-bg"
                    onClick={() => {
                        setIsGroupMode(true);
                        setStep(1);
                    }}
                >

                    <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                        style={{
                            width: "45px",
                            height: "45px",
                        }}
                    >
                        <FiUsers size={20} />
                    </div>

                    <div className="ms-3">
                        <h6 className="mb-0 fw-semibold">
                            New Group
                        </h6>

                        <small className="text-muted">
                            Create group chat
                        </small>
                    </div>
                </div>

                {/* USERS */}

                <div className="content-sidebar-items">
                    {loading ? <div className="text-center p-5 text-muted">Loading...</div> :
                        ((!(filteredUsers.length === 0)) ? filteredUsers.map((user) => (
                            <div
                                key={user.user_id}
                                className="p-3 d-flex align-items-center border-bottom c-pointer hover-bg"
                                onClick={() => {

                                    if (isGroupMode) {

                                        handleSelectGroupUser(user);

                                    } else {

                                        handleCreateChat(user);
                                    }
                                }}
                            >

                                {/* AVATAR */}

                                {user.avatar_url ? (
                                    <img
                                        src={user.avatar_url}
                                        alt="avatar"
                                        className="rounded-circle"
                                        width={45}
                                        height={45}
                                    />
                                ) : (
                                    <div
                                        className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "45px",
                                            height: "45px",
                                        }}
                                    >
                                        {user.full_name?.charAt(
                                            0
                                        )}
                                    </div>
                                )}

                                {/* INFO */}

                                <div className="ms-3">

                                    <h6 className="mb-0 fw-semibold">
                                        {user.full_name}
                                    </h6>

                                    <small className="text-muted">
                                        {user.email}
                                    </small>
                                </div>
                            </div>
                        )) :
                            (
                                <div className="text-center p-5 text-muted">
                                    No users found
                                </div>
                            ))
                    }

                </div>
                {/* GROUP ACTION BUTTON */}

                {isGroupMode && (
                    <div className="p-3 border-top bg-white sticky-bottom">

                        {step === 1 ? (

                            <button
                                className="btn btn-primary w-100"
                                disabled={
                                    selectedUsers.length === 0
                                }
                                onClick={() =>
                                    setStep(2)
                                }
                            >
                                Next
                            </button>

                        ) : (

                            <>
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Enter group name"
                                    value={groupName}
                                    onChange={(e) =>
                                        setGroupName(
                                            e.target.value
                                        )
                                    }
                                />

                                <button
                                    className="btn btn-success w-100"
                                    disabled={!groupName}
                                    onClick={() => {

                                        handleCreateGroup(
                                            groupName,
                                            selectedUsers
                                        );

                                        setGroupName("");
                                        setSelectedUsers([]);
                                        setIsGroupMode(false);
                                        setStep(1);
                                    }}
                                >
                                    Create Group
                                </button>
                            </>
                        )}
                    </div>
                )}
            </PerfectScrollbar>
        </div>
    );
};

export default NewChatUsers;