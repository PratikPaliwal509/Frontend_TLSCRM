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

    const [messages, setMessages] = useState([]);

    const [replyMessage, setReplyMessage] =
        useState(null);
    const [activeSidebar, setActiveSidebar] = useState("chats");
    // "chats" | "newChat" | null
    const user = localStorage.getItem("user");
    const currentUserId = user ? JSON.parse(user).user_id : null;
    const socketRef = useRef(null);
    const [chats, setChats] = useState([]);
    const token = localStorage.getItem("token");

    const [creatingChat, setCreatingChat] =
        useState(false);


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

        const socket = socketRef.current;

        socket.on("connect", () => {

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
        });

        /* =====================================
            REALTIME MESSAGE
        ===================================== */

        socket.on(
            "chat:new-message",
            (message) => {

                console.log(
                    "Realtime Message:",
                    message
                );

                /* =========================
                    UPDATE MESSAGE LIST
                ========================= */

                if (
                    selectedChat &&
                    message.chat_id ===
                    selectedChat.chat_id
                ) {

                    setMessages((prev) => {

                        const exists =
                            prev.some(
                                (m) =>
                                    m.message_id ===
                                    message.message_id
                            );

                        if (exists) {
                            return prev;
                        }

                        return [
                            ...prev,
                            message,
                        ];
                    });
                }

                /* =========================
                    UPDATE CHAT SIDEBAR
                ========================= */

                setChats((prevChats) => {

                    const updatedChats =
                        prevChats.map((chat) => {

                            if (
                                chat.chat_id ===
                                message.chat_id
                            ) {

                                return {
                                    ...chat,
                                    messages: [
                                        ...(chat.messages || [])
                                            .filter(
                                                (m) =>
                                                    m.message_id !==
                                                    message.message_id
                                            ),
                                        message,
                                    ],
                                };
                            }

                            return chat;
                        });

                    // latest message on top
                    updatedChats.sort(
                        (a, b) => {

                            const aLast =
                                a.messages?.[
                                    a.messages.length - 1
                                ]?.created_at || 0;

                            const bLast =
                                b.messages?.[
                                    b.messages.length - 1
                                ]?.created_at || 0;

                            return (
                                new Date(bLast) -
                                new Date(aLast)
                            );
                        }
                    );

                    return [...updatedChats];
                });
            }
        );

        return () => {

            socket.disconnect();
        };

    }, [token, selectedChat]);
    useEffect(() => {

        if (currentUserId) {

            fetchChats();
        }

    }, [currentUserId]);
    /* =========================================
        FETCH CHAT MESSAGES
    ========================================= */
    const fetchChats = async () => {

        try {

            const res = await fetch(
                `http://localhost:5000/api/chats/user/${currentUserId}`
            );

            const data =
                await res.json();

            setChats(data.data || []);

        } catch (err) {

            console.log(err);
        }
    };
    const fetchMessages = async (chatId) => {
        try {
            const res = await fetch(
                `http://localhost:5000/api/chat-messages/chat/${chatId}`
            );

            const data = await res.json();

            setMessages(data.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    /* =========================================
        SELECT CHAT
    ========================================= */

    const handleSelectChat = (chat) => {

        // leave old room
        if (selectedChat && socketRef.current) {
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

        fetchMessages(chat.chat_id);
    };

    /* =========================================
        SEND MESSAGE
    ========================================= */

    const handleMessageSent = async (
        payload
    ) => {
        try {
            const res = await fetch(
                "http://localhost:5000/api/chat-messages",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        chat_id:
                            payload.chat_id,
                        sender_id:
                            currentUserId,
                        message_type: "text",
                        message_text:
                            payload.message,
                        reply_to_message_id:
                            payload.reply_to_message_id,
                    }),
                }
            );

            const data = await res.json();

            if (data.success) {
                // OPTIONAL:
                // realtime socket already adds message
                // but keeping this for instant UI
                console.log("message sent");
                // setMessages((prev) => [
                //     ...prev,
                //     data.data,
                // ]);
            }
        } catch (err) {
            console.log(err);
        }
    };
    // ======================================
    // CREATE OR OPEN DIRECT CHAT
    // ======================================
    const handleCreateChat = async (
        selectedUser
    ) => {
        console.log(selectedUser)
        // STOP MULTIPLE CLICKS
        if (creatingChat) return;

        try {

            setCreatingChat(true);

            // ======================================
            // CHECK EXISTING CHAT
            // ======================================

            const existingChat = chats.find(
                (chat) => {

                    if (
                        chat.chat_type !== "direct"
                    ) {
                        return false;
                    }

                    return chat.participants?.some(
                        (participant) =>
                            participant.user_id ===
                            selectedUser.user_id
                    );
                }
            );

            // ======================================
            // OPEN EXISTING CHAT
            // ======================================

            if (existingChat) {

                handleSelectChat(
                    existingChat
                );

                setActiveSidebar(
                    "chats"
                );

                return;
            }

            // ======================================
            // OPTIMISTIC TEMP CHAT
            // ======================================

            const tempChat = {
                chat_id:
                    "temp_" + Date.now(),

                chat_type: "direct",

                participants: [
                    {
                        user_id:
                            currentUserId,
                    },
                    {
                        user_id:
                            selectedUser.user_id,
                        user: selectedUser,
                    },
                ],

                messages: [],
            };

            // INSTANT OPEN
            setSelectedChat(tempChat);

            // INSTANT SIDEBAR UPDATE
            setChats((prev) => [
                tempChat,
                ...prev,
            ]);

            setActiveSidebar(
                "chats"
            );

            // ======================================
            // CREATE REAL CHAT API
            // ======================================

            const response =
                await axios.post(
                    "http://localhost:5000/api/chats",
                    {
                        agency_id: 1,
                        chat_type: "direct",
                        chat_name: null,
                        created_by:
                            currentUserId,
                        receiver_id:
                            selectedUser.user_id,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type":
                                "application/json",
                        },
                    }
                );

            const realChat =
                response.data.data;
            // ======================================
            // ADD PARTICIPANTS
            // ======================================

            // current user
            await axios.post(
                "http://localhost:5000/api/chat-participants",
                {
                    chat_id: realChat.chat_id,
                    user_id: currentUserId,
                    role: "member",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // selected user
            await axios.post(
                "http://localhost:5000/api/chat-participants",
                {
                    chat_id: realChat.chat_id,
                    user_id: selectedUser.user_id,
                    role: "member",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            // ======================================
            // PREPARE FINAL CHAT WITH USER DETAILS
            // ======================================

            const finalChat = {
                ...realChat,

                participants: [
                    {
                        user_id: currentUserId,
                    },
                    {
                        user_id: selectedUser.user_id,
                        user: selectedUser,
                    },
                ],

                messages: [],
            };

            // ======================================
            // REPLACE TEMP CHAT
            // ======================================

            setChats((prev) =>
                prev.map((chat) =>
                    chat.chat_id === tempChat.chat_id
                        ? finalChat
                        : chat
                )
            );

            // ======================================
            // OPEN REAL CHAT
            // ======================================

            setSelectedChat(finalChat);

            // JOIN SOCKET ROOM
            if (socketRef.current) {

                socketRef.current.emit(
                    "chat:join",
                    realChat.chat_id
                );
            }

            // FETCH MESSAGES
            fetchMessages(
                finalChat.chat_id
            );

        } catch (error) {

            console.error(
                "Create/Open chat error:",
                error.response?.data ||
                error.message
            );

        } finally {

            setCreatingChat(false);
        }
    };


    // ======================================
    // CREATE GROUP CHAT
    // ======================================
    const handleCreateGroup = async (
        groupName,
        selectedUsers = []
    ) => {

        // ======================================
        // TEMP GROUP (INSTANT UI)
        // ======================================

        const tempGroup = {
            chat_id: "temp_" + Date.now(),

            chat_type: "group",

            chat_name: groupName,

            participants: [
                {
                    user_id: currentUserId,
                },

                ...selectedUsers.map((user) => ({
                    user_id: user.user_id,
                    user,
                })),
            ],

            messages: [],
        };

        // ======================================
        // OPEN IMMEDIATELY
        // ======================================

        setChats((prev) => [
            tempGroup,
            ...prev,
        ]);

        setSelectedChat(tempGroup);

        setMessages([]);

        setActiveSidebar("chats");

        try {

            // ======================================
            // CREATE REAL GROUP
            // ======================================

            const createResponse =
                await axios.post(
                    "http://localhost:5000/api/chats",
                    {
                        agency_id: 1,
                        chat_type: "group",
                        chat_name: groupName,
                        created_by: currentUserId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type":
                                "application/json",
                        },
                    }
                );

            const newGroup =
                createResponse.data.data;

            // ======================================
            // ADD CURRENT USER
            // ======================================

            await axios.post(
                "http://localhost:5000/api/chat-participants",
                {
                    chat_id: newGroup.chat_id,
                    user_id: currentUserId,
                    role: "admin",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },
                }
            );

            // ======================================
            // ADD MEMBERS
            // ======================================

            await Promise.all(

                selectedUsers.map((user) =>
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
                                Authorization: `Bearer ${token}`,
                                "Content-Type":
                                    "application/json",
                            },
                        }
                    )
                )
            );

            // ======================================
            // FINAL GROUP
            // ======================================

            const finalGroup = {
                ...newGroup,

                participants:
                    tempGroup.participants,

                messages: [],
            };

            // ======================================
            // REPLACE TEMP GROUP
            // ======================================

            setChats((prev) =>
                prev.map((chat) =>
                    chat.chat_id ===
                        tempGroup.chat_id
                        ? finalGroup
                        : chat
                )
            );

            // ======================================
            // UPDATE SELECTED CHAT
            // ======================================

            setSelectedChat(finalGroup);

            // ======================================
            // JOIN SOCKET
            // ======================================

            if (socketRef.current) {

                socketRef.current.emit(
                    "chat:join",
                    finalGroup.chat_id
                );
            }

            console.log(
                "Group created:",
                finalGroup
            );

        } catch (error) {

            console.error(
                "Create group error:",
                error.response?.data ||
                error.message
            );
        }
    };
    return (
        <>
            {/* =====================================
            LEFT SIDEBAR
      ===================================== */}
            {activeSidebar === "chats" && (
                <ChatsUsers
                    sidebarOpen={true}
                    setSidebarOpen={() => setActiveSidebar("newChat")}
                    handleSelectChat={handleSelectChat}
                    selectedChat={selectedChat}
                    chats={chats}
                />
            )}

            {activeSidebar === "newChat" && (
                <NewChatUsers
                    sidebarOpen={true}
                    setSidebarOpen={() => setActiveSidebar("chats")}
                    handleCreateChat={handleCreateChat}
                    handleCreateGroup={handleCreateGroup}
                />
            )}
            {/* =====================================
            RIGHT CHAT AREA
      ===================================== */}

            <div className="content-area">
                <PerfectScrollbar>
                    {/* HEADER */}

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
                            (message, index) => {
                                const previousMessage =
                                    messages[index - 1];

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
                                            message?.sender
                                                ?.avatar_url ||
                                            "/images/avatar.png"
                                        }
                                        name={
                                            message?.sender
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
                    />
                </PerfectScrollbar>
            </div>
        </>
    );
};

export default ChatContent;