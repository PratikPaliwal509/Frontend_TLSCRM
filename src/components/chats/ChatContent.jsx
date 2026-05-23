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

const ChatContent = () => {
    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [selectedChat, setSelectedChat] =
        useState(null);

    const [messages, setMessages] = useState([]);

    const [replyMessage, setReplyMessage] =
        useState(null);

    const user = localStorage.getItem("user");
    const currentUserId = user ? JSON.parse(user).user_id : null;
    const socketRef = useRef(null);
    const [chats, setChats] = useState([]);
    const token = localStorage.getItem("token");

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

    return (
        <>
            {/* =====================================
            LEFT SIDEBAR
      ===================================== */}
            <ChatsUsers
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                selectedChat={selectedChat}
                handleSelectChat={handleSelectChat}
                chats={chats}
            />
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

                    <div className="content-area-body p-4">
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