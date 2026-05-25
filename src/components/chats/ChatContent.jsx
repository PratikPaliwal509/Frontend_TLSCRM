import React, {
    useEffect,
    useState,
    useRef,
} from "react";

import { io } from "socket.io-client";

import ChartsHeader from "./ChatHeader";
import MessageEditor from "./MessageEditor";
import PerfectScrollbar from "react-perfect-scrollbar";
import ChatMessage from "./ChatMessage";
import ChatsUsers from "./ChatsUsers";
import NewChatUsers from "./NewChatUsers";

import axios from "axios";

const ChatContent = () => {

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [selectedChat, setSelectedChat] =
        useState(null);

    const [messages, setMessages] =
        useState([]);

    const [replyMessage, setReplyMessage] =
        useState(null);

    const [activeSidebar, setActiveSidebar] =
        useState("chats");

    const [chats, setChats] =
        useState([]);

    const [creatingChat, setCreatingChat] =
        useState(false);
const [typingUsers, setTypingUsers] =
    useState({});
    const user =
        localStorage.getItem("user");

    const currentUserId =
        user
            ? JSON.parse(user).user_id
            : null;

    const token =
        localStorage.getItem("token");

    const socketRef =
        useRef(null);

    /* =========================================
        SOCKET CONNECT
    ========================================= */

    useEffect(() => {

        if (!token) return;

        socketRef.current = io(
            "http://localhost:5000",
            {
                auth: {
                    token,
                },
                transports: ["websocket"],
            }
        );

        const socket =
            socketRef.current;

        socket.on(
            "connect",
            () => {

                console.log(
                    "Socket connected:",
                    socket.id
                );

                if (selectedChat) {

                    socket.emit(
                        "chat:join",
                        selectedChat.chat_id
                    );
                }
            }
        );

        /* =====================================
            NEW MESSAGE
        ===================================== */

     socket.on("chat:new-message", (message) => {

    if (
        selectedChat &&
        message.chat_id === selectedChat.chat_id
    ) {
        setMessages((prev) => {

            // ✅ find a pending temp from same sender with same text
            const tempIndex = prev.findIndex(
                (m) =>
                    m.message_id?.toString().startsWith("temp_") &&
                    m.sender_id === message.sender_id &&
                    m.message_text === message.message_text
            );

            if (tempIndex !== -1) {
                const updated = [...prev];
                updated[tempIndex] = { ...message, status: "sent" };
                return updated;
            }

            const exists = prev.some(
                (m) => m.message_id === message.message_id
            );
            if (exists) return prev;

            return [...prev, message];
        });
    }

    // sidebar update same as above...
});

        /* =====================================
            MESSAGE READ
        ===================================== */

        socket.on(
            "message:read",
            ({
                message_id,
                user_id,
            }) => {

                setMessages((prev) =>
                    prev.map((msg) => {

                        if (
                            msg.message_id ===
                            message_id
                        ) {

                            return {
                                ...msg,

                                reads: [
                                    ...(msg.reads || []),

                                    {
                                        user_id,
                                    },
                                ],
                            };
                        }

                        return msg;
                    })
                );
            }
        );

         /* =====================================
    USER TYPING
===================================== */

socket.on(
    "chat:typing",
    ({
        chat_id,
        user_id,
        user_name,
    }) => {

        if (
            selectedChat?.chat_id !==
            chat_id
        ) {
            return;
        }

        setTypingUsers((prev) => ({
            ...prev,

            [user_id]: {
                name: user_name,
                typing: true,
            },
        }));
    }
);

/* =====================================
    USER STOP TYPING
===================================== */

socket.on(
    "chat:stop-typing",
    ({
        chat_id,
        user_id,
    }) => {

        if (
            selectedChat?.chat_id !==
            chat_id
        ) {
            return;
        }

        setTypingUsers((prev) => {

            const updated = {
                ...prev,
            };

            delete updated[user_id];

            return updated;
        });
    }
);
        return () => {

            socket.disconnect();
        };

    }, [token, selectedChat]);

    /* =========================================
        FETCH CHATS
    ========================================= */

    useEffect(() => {

        if (currentUserId) {

            fetchChats();
        }

    }, [currentUserId]);

    const fetchChats = async () => {

        try {

            const res = await fetch(
                `http://localhost:5000/api/chats/user/${currentUserId}`
            );

            const data =
                await res.json();

            setChats(
                data.data || []
            );

        } catch (err) {

            console.log(err);
        }
    };

    /* =========================================
        FETCH MESSAGES
    ========================================= */

    const fetchMessages = async (
        chatId
    ) => {

        try {

            const res = await fetch(
                `http://localhost:5000/api/chat-messages/chat/${chatId}`
            );

            const data =
                await res.json();

            setMessages(
                data.data || []
            );

        } catch (err) {

            console.log(err);
        }
    };

    /* =========================================
        AUTO MARK READ
    ========================================= */

    useEffect(() => {

        if (
            !selectedChat ||
            !messages.length
        ) {
            return;
        }

        messages.forEach(
            async (message) => {

                // don't mark own msg
                if (
                    message.sender_id ===
                    currentUserId
                ) {
                    return;
                }

                // already read
                const alreadyRead =
                    message.reads?.some(
                        (r) =>
                            r.user_id ===
                            currentUserId
                    );

                if (alreadyRead) {
                    return;
                }

                try {
                    console.log(message.message_id, "marking as read");
                    await axios.post(
                        `http://localhost:5000/api/chat-messages/${message.message_id}/read`,
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                } catch (err) {

                    console.log(err);
                }
            }
        );

    }, [
        messages,
        selectedChat,
        currentUserId,
        token,
    ]);

    /* =========================================
        SELECT CHAT
    ========================================= */

    const handleSelectChat = (
        chat
    ) => {

        // leave old room
        if (
            selectedChat &&
            socketRef.current
        ) {

            socketRef.current.emit(
                "chat:leave",
                selectedChat.chat_id
            );
        }

        setSelectedChat(chat);

        // join new room
        if (socketRef.current) {

            socketRef.current.emit(
                "chat:join",
                chat.chat_id
            );
        }

        fetchMessages(
            chat.chat_id
        );
    };

    /* =========================================
        MESSAGE STATUS
    ========================================= */

const getMessageStatus = (message) => {
  if (message.sender_id !== currentUserId) return null;

  // ✅ Blue double tick — someone read it
  if (message.reads && message.reads.length > 0) return "read";

  // ✅ Clock — optimistic temp message still in flight
  if (message.status === "sending") return "sending";

  // ✅ Single tick — API confirmed, not yet delivered
  if (message.status === "sent") return "sent";

  // ✅ Double tick — delivered (default for confirmed messages)
  return "delivered";
};

    /* =========================================
        SEND MESSAGE
    ========================================= */

const handleMessageSent = async (payload) => {

    // =====================================
    // TEMP MESSAGE (INSTANT UI)
    // =====================================

    const tempMessage = {
        message_id: "temp_" + Date.now(),

        chat_id: payload.chat_id,

        sender_id: currentUserId,

        message_text: payload.message,

        message_type: "text",

        created_at: new Date().toISOString(),

        sender: {
            full_name: "You",
        },

        // sending | sent | delivered | read
        status: "sending",

        reads: [],
    };

    // =====================================
    // SHOW MESSAGE IMMEDIATELY
    // =====================================

    setMessages((prev) => [
        ...prev,
        tempMessage,
    ]);

    // =====================================
    // UPDATE CHAT SIDEBAR IMMEDIATELY
    // =====================================

    setChats((prevChats) =>
        prevChats.map((chat) => {

            if (
                chat.chat_id ===
                payload.chat_id
            ) {

                return {
                    ...chat,

                    messages: [
                        ...(chat.messages || []),
                        tempMessage,
                    ],
                };
            }

            return chat;
        })
    );

    try {

        // =====================================
        // SEND REAL MESSAGE
        // =====================================

        const res = await fetch(
            "http://localhost:5000/api/chat-messages",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`,
                },

                body: JSON.stringify({
                    chat_id:
                        payload.chat_id,

                    sender_id:
                        currentUserId,

                    message_type:
                        "text",

                    message_text:
                        payload.message,

                    reply_to_message_id:
                        payload.reply_to_message_id,
                }),
            }
        );

        const data =
            await res.json();

        if (data.success) {

            // =====================================
            // REPLACE TEMP MESSAGE
            // =====================================

            setMessages((prev) =>
                prev.map((msg) =>

                    msg.message_id ===
                        tempMessage.message_id
                        ? {
                            ...data.data,

                            // SINGLE TICK
                            status: "sent",
                        }
                        : msg
                )
            );

            // =====================================
            // UPDATE SIDEBAR MESSAGE
            // =====================================

            setChats((prevChats) =>
                prevChats.map((chat) => {

                    if (
                        chat.chat_id ===
                        payload.chat_id
                    ) {

                        return {
                            ...chat,

                            messages:
                                (chat.messages || []).map(
                                    (msg) =>

                                        msg.message_id ===
                                            tempMessage.message_id
                                            ? {
                                                ...data.data,

                                                status:
                                                    "sent",
                                            }
                                            : msg
                                ),
                        };
                    }

                    return chat;
                })
            );
        }

    } catch (err) {

        console.log(err);

        // OPTIONAL FAILED STATUS

        setMessages((prev) =>
            prev.map((msg) =>

                msg.message_id ===
                    tempMessage.message_id
                    ? {
                        ...msg,
                        status: "failed",
                    }
                    : msg
            )
        );
    }
};
    /* =========================================
        CREATE GROUP
    ========================================= */

    const handleCreateGroup = async (
        groupName,
        selectedUsers = []
    ) => {

        // temp group
        const tempGroup = {
            chat_id:
                "temp_" + Date.now(),

            chat_type: "group",

            chat_name: groupName,

            participants: [
                {
                    user_id:
                        currentUserId,
                },

                ...selectedUsers.map(
                    (user) => ({
                        user_id:
                            user.user_id,
                        user,
                    })
                ),
            ],

            messages: [],
        };

        // instant open
        setChats((prev) => [
            tempGroup,
            ...prev,
        ]);

        setSelectedChat(
            tempGroup
        );

        setMessages([]);

        setActiveSidebar(
            "chats"
        );

        try {

            // create group
            const createResponse =
                await axios.post(
                    "http://localhost:5000/api/chats",
                    {
                        agency_id: 1,

                        chat_type:
                            "group",

                        chat_name:
                            groupName,

                        created_by:
                            currentUserId,
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json",
                        },
                    }
                );

            const newGroup =
                createResponse.data.data;

            // add self
            await axios.post(
                "http://localhost:5000/api/chat-participants",
                {
                    chat_id:
                        newGroup.chat_id,

                    user_id:
                        currentUserId,

                    role: "admin",
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json",
                    },
                }
            );

            // add members
            await Promise.all(

                selectedUsers.map(
                    (user) =>
                        axios.post(
                            "http://localhost:5000/api/chat-participants",
                            {
                                chat_id:
                                    newGroup.chat_id,

                                user_id:
                                    user.user_id,

                                role: "member",
                            },
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,

                                    "Content-Type":
                                        "application/json",
                                },
                            }
                        )
                )
            );

            // final group
            const finalGroup = {
                ...newGroup,

                participants:
                    tempGroup.participants,

                messages: [],
            };

            // replace temp
            setChats((prev) =>
                prev.map((chat) =>
                    chat.chat_id ===
                        tempGroup.chat_id
                        ? finalGroup
                        : chat
                )
            );

            // update selected
            setSelectedChat(
                finalGroup
            );

            // join socket
            if (
                socketRef.current
            ) {

                socketRef.current.emit(
                    "chat:join",
                    finalGroup.chat_id
                );
            }

        } catch (error) {

            console.error(
                "Create group error:",
                error.response?.data ||
                error.message
            );
        }
    };
const typingTimeoutRef =
    useRef(null);

const handleTyping = () => {

    if (
        !socketRef.current ||
        !selectedChat?.chat_id
    ) {
        return;
    }

    socketRef.current.emit(
        "chat:typing",
        {
            chat_id:
                selectedChat.chat_id,

            user_id:
                currentUserId,

            user_name:
                JSON.parse(user)
                    ?.full_name,
        }
    );

    clearTimeout(
        typingTimeoutRef.current
    );

    typingTimeoutRef.current =
        setTimeout(() => {

            socketRef.current.emit(
                "chat:stop-typing",
                {
                    chat_id:
                        selectedChat.chat_id,

                    user_id:
                        currentUserId,
                }
            );

        }, 1000);
};
    return (
        <>
            {/* SIDEBAR */}

            {activeSidebar ===
                "chats" && (
                    <ChatsUsers
                        sidebarOpen={true}
                        setSidebarOpen={() =>
                            setActiveSidebar(
                                "newChat"
                            )
                        }
                        handleSelectChat={
                            handleSelectChat
                        }
                        selectedChat={
                            selectedChat
                        }
                        chats={chats}
                    />
                )}

            {activeSidebar ===
                "newChat" && (
                    <NewChatUsers
                        sidebarOpen={true}
                        setSidebarOpen={() =>
                            setActiveSidebar(
                                "chats"
                            )
                        }
                        handleCreateGroup={
                            handleCreateGroup
                        }
                    />
                )}

            {/* CHAT AREA */}

            <div className="content-area">

                <PerfectScrollbar>

                    <ChartsHeader
                        setSidebarOpen={
                            setSidebarOpen
                        }
                        selectedChat={
                            selectedChat
                        }
                    />

                    {/* MESSAGES */}

                    <div className="content-area-body p-4 min-vh-100">

                        {messages.map(
                            (
                                message,
                                index
                            ) => {

                                const previousMessage =
                                    messages[
                                    index - 1
                                    ];

                                const showHeader =
                                    !previousMessage ||

                                    previousMessage.sender_id !==
                                    message.sender_id;

                                return (
                                    <ChatMessage
                                        key={
                                            message.message_id
                                        }
                                        avatar={
                                            message
                                                ?.sender
                                                ?.avatar_url ||
                                            "/images/avatar.png"
                                        }
                                        name={
                                            message
                                                ?.sender
                                                ?.full_name
                                        }
                                        time={new Date(
                                            message.created_at
                                        ).toLocaleTimeString(
                                            [],
                                            {
                                                hour: "2-digit",
                                                minute:
                                                    "2-digit",
                                            }
                                        )}
                                        messages={[
                                            message.message_text,
                                        ]}
                                        messageStatus={getMessageStatus(
                                            message
                                        )}
                                        isReplay={
                                            message.sender_id ===
                                            currentUserId
                                        }
                                        showHeader={
                                            showHeader
                                        }
                                    />
                                );
                            }
                        )}
                        {/* =====================================
    TYPING INDICATOR
===================================== */}

{Object.values(typingUsers).length > 0 && (

    <div className="single-chat-item mb-3">

        <div className="d-flex align-items-center gap-3 mb-2">

            <a href="#" className="avatar-image">
                <img
                    src="/images/avatar.png"
                    className="img-fluid rounded-circle"
                    alt="avatar"
                />
            </a>

            <div className="d-flex align-items-center gap-2">

                <span className="fw-semibold">
                    {
                        Object.values(
                            typingUsers
                        )[0]?.name
                    }
                </span>

                <span className="text-muted fs-12">
                    typing...
                </span>
            </div>
        </div>

        <div className="wd-120 p-3 rounded-5 bg-gray-200">

            <div className="d-flex gap-1 align-items-center">

                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>

            </div>
        </div>
    </div>
)}
                    </div>

                    {/* MESSAGE EDITOR */}

                    <MessageEditor
                        selectedChat={
                            selectedChat
                        }
                        currentUserId={
                            currentUserId
                        }
                        replyMessage={
                            replyMessage
                        }
                        setReplyMessage={
                            setReplyMessage
                        }
                        onSendMessage={
                            handleMessageSent
                        }
                        socketRef={socketRef}

                    />
                </PerfectScrollbar>
            </div>
        </>
    );
};

export default ChatContent;