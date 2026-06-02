import React, {
    useEffect,
    useState,
    useRef,
} from "react";

import TaskModal from "./TaskModal";
import { io } from "socket.io-client";
import ChatMessageSkeleton from "./ChatMessageSkeleton.";
import ChartsHeader from "./ChatHeader";
import MessageEditor from "./MessageEditor";
import PerfectScrollbar from "react-perfect-scrollbar";
import ChatMessage, { FileMessage } from "./ChatMessage";
import ChatsUsers from "./ChatsUsers";
import NewChatUsers from "./NewChatUsers";

import axios from "axios";
import { set } from "date-fns";

const ChatContent = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [replyMessage, setReplyMessage] = useState(null);
    const [activeSidebar, setActiveSidebar] = useState("chats");
    const [chats, setChats] = useState([]);
    const [typingUsers, setTypingUsers] = useState({});
    const [chatTypingUsers, setChatTypingUsers] = useState({}); // { [chat_id]: { [user_id]: name } }
    const [unreadCount, setUnreadCount] = useState(0);
    const [chatUnreadCounts, setChatUnreadCounts] = useState({}); // { [chat_id]: number }
    const [editingMessage, setEditingMessage] = useState(null);
    const user = localStorage.getItem("user");
    const currentUserId = user ? JSON.parse(user).user_id : null;
    const token = localStorage.getItem("token");
    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const socketRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const messageRefs = useRef({});
    const markedReadIds = useRef(new Set());
    const selectedChatRef = useRef(null);
    const creatingChatRef = useRef(false);
    const chatsRef = useRef([]); // always mirrors `chats` state so socket handlers can read it
const [showTaskModal, setShowTaskModal] =
  useState(false);
    /* =========================================
        SCROLL HELPERS
    ========================================= */

    const scrollToBottom = () => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                const container = scrollContainerRef.current?._container;
                if (!container) return;
                container.scrollTop = container.scrollHeight;
            }, 50);
        });
    };

    const scrollToFirstUnread = (msgs) => {
        setTimeout(() => {
            const container = scrollContainerRef.current?._container;
            if (!container) return;

            const unreadMsg = msgs.find(
                (m) =>
                    m.sender_id !== currentUserId &&
                    !m.reads?.some((r) => r.user_id === currentUserId)
            );

            if (!unreadMsg) {
                container.scrollTop = container.scrollHeight;
                return;
            }

            const el = messageRefs.current[unreadMsg.message_id];
            if (!el) {
                container.scrollTop = container.scrollHeight;
                return;
            }

            container.scrollTop = el.offsetTop - 100;
        }, 150);
    };

    /* =========================================
        CHAT LIST HELPERS
    ========================================= */

    /**
     * Update the last message preview in the chats sidebar list.
     * Also bumps the chat to the top of the list.
     */
    const updateChatLastMessage = (chatId, messageData) => {
        setChats((prev) => {
            const idx = prev.findIndex((c) => c.chat_id === chatId);
            if (idx === -1) return prev;

            const updated = { ...prev[idx] };
            const msgs = [...(updated.messages || [])];

            // find if message already exists and replace, else append
            const existingIdx = msgs.findIndex((m) => m.message_id === messageData.message_id);
            if (existingIdx !== -1) {
                msgs[existingIdx] = { ...msgs[existingIdx], ...messageData };
            } else {
                msgs.push(messageData);
            }

            updated.messages = msgs;

            // bubble to top
            const newList = prev.filter((c) => c.chat_id !== chatId);
            return [updated, ...newList];
        });
    };

    /**
     * Mark a message as deleted in chats sidebar preview.
     */
    const deleteChatLastMessage = (chatId, messageId) => {
        setChats((prev) =>
            prev.map((c) => {
                if (c.chat_id !== chatId) return c;
                return {
                    ...c,
                    messages: (c.messages || []).map((m) =>
                        m.message_id === messageId
                            ? { ...m, is_deleted: true, message_text: "" }
                            : m
                    ),
                };
            })
        );
    };

    /* =========================================
        SOCKET CONNECT
    ========================================= */

    useEffect(() => {
        if (!token) return;

        socketRef.current = io("https://api-0ggv.onrender.com", {
            auth: { token },
            transports: ["websocket"],
        });

        const socket = socketRef.current;

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
            // Rejoin ALL chat rooms so we receive messages for every chat,
            // not just the currently open one.
            chatsRef.current.forEach((chat) => {
                socket.emit("chat:join", chat.chat_id);
            });
        });

        // ── EDIT ──────────────────────────────────────────────
        socket.on("chat:message-edited", (updatedMessage) => {
            // update message in chat window
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.message_id === updatedMessage.message_id
                        ? { ...msg, ...updatedMessage }
                        : msg
                )
            );

            // update sidebar preview if it's the last message
            updateChatLastMessage(updatedMessage.chat_id, updatedMessage);
        });

        // ── UPDATE (attachments / status) ─────────────────────
        socket.on("chat:message-updated", (updatedMessage) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.message_id === updatedMessage.message_id
                        ? {
                            ...msg,
                            ...updatedMessage,
                            attachments:
                                updatedMessage.attachments?.length
                                    ? updatedMessage.attachments
                                    : msg.attachments || [],
                        }
                        : msg
                )
            );

            updateChatLastMessage(updatedMessage.chat_id, updatedMessage);
        });

        // ── DELETE ─────────────────────────────────────────────
        socket.on("chat:message-deleted", ({ message_id, chat_id }) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.message_id === message_id
                        ? { ...msg, is_deleted: true, message_text: "", attachments: [] }
                        : msg
                )
            );

            if (chat_id) {
                deleteChatLastMessage(chat_id, message_id);
            }
        });
        socket.on("chat:new-chat", (chat) => {

            setChats((prev) => {

                const exists = prev.some(
                    (c) => c.chat_id === chat.chat_id
                );

                if (exists) return prev;

                return [chat, ...prev];
            });

        });
        // ── NEW MESSAGE ────────────────────────────────────────
        socket.on("chat:new-message", (message) => {
            console.log("New message received:", message);

            // update sidebar: bubble chat up + update last message preview
            updateChatLastMessage(message.chat_id, message);

            // increment unread count for chats that are NOT currently open
            if (
                message.sender_id !== currentUserId &&
                selectedChatRef.current?.chat_id !== message.chat_id
            ) {
                setChatUnreadCounts((prev) => ({
                    ...prev,
                    [message.chat_id]: (prev[message.chat_id] || 0) + 1,
                }));
            }

            // update message window only if this chat is open
            if (
                selectedChatRef.current &&
                message.chat_id === selectedChatRef.current.chat_id
            ) {
                setMessages((prev) => {
                    const tempIndex = prev.findIndex(
                        (m) =>
                            m.message_id?.toString().startsWith("temp_") &&
                            m.sender_id === message.sender_id &&
                            m.message_text === message.message_text
                    );

                    if (tempIndex !== -1) {
                        const updated = [...prev];
                        updated[tempIndex] = {
                            ...message,
                            attachments:
                                message.attachments?.length
                                    ? message.attachments
                                    : prev[tempIndex].attachments || [],
                            replyTo:
                                message.replyTo || prev[tempIndex].replyTo
                                    ? {
                                        message_id:
                                            message.replyTo?.message_id ||
                                            prev[tempIndex].replyTo?.message_id,
                                        text:
                                            message.replyTo?.message_text ??
                                            message.replyTo?.text ??
                                            prev[tempIndex].replyTo?.text ??
                                            "",
                                        sender_name:
                                            message.replyTo?.sender?.full_name ||
                                            prev[tempIndex].replyTo?.sender_name ||
                                            "User",
                                        attachments:
                                            message.replyTo?.attachments ||
                                            prev[tempIndex].replyTo?.attachments ||
                                            [],
                                        message_type:
                                            message.replyTo?.message_type ||
                                            prev[tempIndex].replyTo?.message_type ||
                                            "text",
                                    }
                                    : null,
                            status: "sent",
                        };
                        return updated;
                    }

                    return [
                        ...prev,
                        {
                            ...message,
                            replyTo: message.replyTo
                                ? {
                                    message_id: message.replyTo.message_id,
                                    text: message.replyTo.message_text ?? message.replyTo.text ?? "",
                                    sender_name: message.replyTo.sender?.full_name || "User",
                                    attachments: message.replyTo.attachments || [],
                                    message_type: message.replyTo.message_type || "text",
                                }
                                : null,
                        },
                    ];
                });

                setTimeout(() => scrollToBottom(), 100);
            }
        });

        // ── READ RECEIPTS ──────────────────────────────────────
        socket.on("message:read", ({ message_id, user_id }) => {
            setMessages((prev) =>
                prev.map((msg) => {
                    if (msg.message_id !== message_id) return msg;
                    const alreadyIn = msg.reads?.some((r) => r.user_id === user_id);
                    if (alreadyIn) return msg;
                    return {
                        ...msg,
                        reads: [...(msg.reads || []), { user_id }],
                    };
                })
            );
        });

        // ── TYPING (chat window) ───────────────────────────────
        socket.on("chat:typing", ({ chat_id, user_id, user_name }) => {
            // typing indicator inside open chat
            if (selectedChatRef.current?.chat_id === chat_id) {
                setTypingUsers((prev) => ({
                    ...prev,
                    [user_id]: { name: user_name, typing: true },
                }));
            }

            // typing indicator in sidebar list
            setChatTypingUsers((prev) => ({
                ...prev,
                [chat_id]: {
                    ...(prev[chat_id] || {}),
                    [user_id]: user_name,
                },
            }));
        });

        socket.on("chat:stop-typing", ({ chat_id, user_id }) => {
            if (selectedChatRef.current?.chat_id === chat_id) {
                setTypingUsers((prev) => {
                    const updated = { ...prev };
                    delete updated[user_id];
                    return updated;
                });
            }

            setChatTypingUsers((prev) => {
                const chatTypers = { ...(prev[chat_id] || {}) };
                delete chatTypers[user_id];
                return { ...prev, [chat_id]: chatTypers };
            });
        });

        return () => {
            socket.disconnect();
        };

    }, [token]);

    useEffect(() => {
        selectedChatRef.current = selectedChat;
    }, [selectedChat]);

    // Keep ref in sync so socket reconnect handler always sees latest chats
    useEffect(() => {
        chatsRef.current = chats;
    }, [chats]);

    // Join ALL chat rooms whenever the chat list changes (initial load, new chat added)
    useEffect(() => {
        if (!socketRef.current?.connected || !chats.length) return;
        chats.forEach((chat) => {
            socketRef.current.emit("chat:join", chat.chat_id);
        });
    }, [chats]);

    /* =========================================
        FETCH CHATS
    ========================================= */

    useEffect(() => {
        if (currentUserId) fetchChats();
    }, [currentUserId]);

    const fetchChats = async () => {
        try {
            setLoadingChats(true);
            const res = await fetch(`https://api-0ggv.onrender.com/api/chats/user/${currentUserId}`);
            const data = await res.json();
            const fetchedChats = data.data || [];
            setChats(fetchedChats);

            const counts = {};
            fetchedChats.forEach((chat) => {
                counts[chat.chat_id] = chat.unread_count || 0;
            });
            setChatUnreadCounts(counts);

            // ✅ Restore last visited chat
            const lastChatId = localStorage.getItem("lastChatId");
            if (lastChatId) {
                const lastChat = fetchedChats.find(
                    (c) => String(c.chat_id) === String(lastChatId)
                );
                if (lastChat) {
                    handleSelectChat(lastChat);
                }
            }

        } catch (err) {
            console.log(err);
        } finally {
            setLoadingChats(false);
        }
    };

    /* =========================================
        FETCH MESSAGES
    ========================================= */

    const fetchMessages = async (chatId) => {
        try {
            setLoadingMessages(true);
            const res = await fetch(`https://api-0ggv.onrender.com/api/chat-messages/chat/${chatId}`);
            const data = await res.json();
            const msgs = data.data || [];

            markedReadIds.current = new Set();

            const unread = msgs.filter(
                (m) =>
                    m.sender_id !== currentUserId &&
                    !m.reads?.some((r) => r.user_id === currentUserId)
            );

            setUnreadCount(unread.length);
            setMessages(msgs);
            scrollToFirstUnread(msgs);
            markMessagesAsRead(unread);

            // clear unread badge for this chat in sidebar
            setChatUnreadCounts((prev) => ({ ...prev, [chatId]: 0 }));

        } catch (err) {
            console.log(err);
        } finally {
            setLoadingMessages(false);
        }
    };

    /* =========================================
        MARK AS READ
    ========================================= */

    const markMessagesAsRead = async (unreadMsgs) => {
        for (const message of unreadMsgs) {
            if (markedReadIds.current.has(message.message_id)) continue;
            markedReadIds.current.add(message.message_id);
            try {
                await axios.post(
                    `https://api-0ggv.onrender.com/api/chat-messages/${message.message_id}/read`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (err) {
                console.log(err);
            }
        }
    };

    useEffect(() => {
        if (!selectedChat || !messages.length) return;
        const newUnread = messages.filter(
            (m) =>
                m.sender_id !== currentUserId &&
                !m.reads?.some((r) => r.user_id === currentUserId) &&
                !markedReadIds.current.has(m.message_id)
        );
        if (newUnread.length > 0) markMessagesAsRead(newUnread);
    }, [messages]);

    /* =========================================
        SELECT CHAT
    ========================================= */

    const handleSelectChat = (chat) => {
        // Do NOT emit chat:leave — we stay joined to all rooms
        // so background messages keep arriving for every chat.

        setSelectedChat(chat);
        setMessages([]);
        setTypingUsers({});
        setUnreadCount(0);
        //  Persist last visited chat
        localStorage.setItem("lastChatId", chat.chat_id);
        // clear sidebar unread badge
        setChatUnreadCounts((prev) => ({ ...prev, [chat.chat_id]: 0 }));

        fetchMessages(chat.chat_id);
    };

    /* =========================================
        CREATE DIRECT CHAT
    ========================================= */

    const handleCreateChat = async (targetUser) => {

        if (creatingChatRef.current) return;

        creatingChatRef.current = true;

        try {

            // frontend existing check
            const existing = chats.find(
                (c) =>
                    c.chat_type === "direct" &&
                    c.participants?.some(
                        (p) =>
                            p.user_id === targetUser.user_id
                    )
            );

            // open existing chat
            if (existing) {

                handleSelectChat(existing);

                setActiveSidebar("chats");

                return;
            }

            // create new chat
            const res = await axios.post(
                "https://api-0ggv.onrender.com/api/chats",
                {
                    chat_type: "direct",
                    created_by: currentUserId,
                    user_id: targetUser.user_id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const newChat = res.data.data;

            // prevent duplicate insert
            setChats((prev) => {

                const alreadyExists = prev.some(
                    (c) =>
                        c.chat_id === newChat.chat_id
                );

                if (alreadyExists) {
                    return prev;
                }

                return [newChat, ...prev];
            });

            handleSelectChat(newChat);

            setActiveSidebar("chats");

            // join socket room
            socketRef.current?.emit(
                "chat:join",
                newChat.chat_id
            );

        } catch (err) {

            console.log(
                "Create chat error:",
                err
            );

        } finally {

            creatingChatRef.current = false;
        }
    };

    /* =========================================
        CREATE GROUP
    ========================================= */

    const handleCreateGroup = async (groupName, selectedUsers = []) => {
        const tempGroup = {
            chat_id: "temp_" + Date.now(),
            chat_type: "group",
            chat_name: groupName,
            participants: [
                { user_id: currentUserId },
                ...selectedUsers.map((u) => ({ user_id: u.user_id, user: u })),
            ],
            messages: [],
        };

        setChats((prev) => [tempGroup, ...prev]);
        setSelectedChat(tempGroup);
        setMessages([]);
        setActiveSidebar("chats");

        try {
            const createResponse = await axios.post(
                "https://api-0ggv.onrender.com/api/chats",
                { agency_id: 1, chat_type: "group", chat_name: groupName, created_by: currentUserId },
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );

            const newGroup = createResponse.data.data;

            await axios.post(
                "https://api-0ggv.onrender.com/api/chat-participants",
                { chat_id: newGroup.chat_id, user_id: currentUserId, role: "admin" },
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );

            await Promise.all(
                selectedUsers.map((u) =>
                    axios.post(
                        "https://api-0ggv.onrender.com/api/chat-participants",
                        { chat_id: newGroup.chat_id, user_id: u.user_id, role: "member" },
                        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
                    )
                )
            );

            const finalGroup = { ...newGroup, participants: tempGroup.participants, messages: [] };

            setChats((prev) =>
                prev.map((chat) => (chat.chat_id === tempGroup.chat_id ? finalGroup : chat))
            );
            setSelectedChat(finalGroup);

            if (socketRef.current) {
                socketRef.current.emit("chat:join", finalGroup.chat_id);
            }
        } catch (error) {
            console.error("Create group error:", error.response?.data || error.message);
        }
    };

    /* =========================================
        MESSAGE STATUS
    ========================================= */

    const getMessageStatus = (message) => {
        if (message.sender_id !== currentUserId) return null;
        if (message.reads && message.reads.length > 0) return "read";
        if (message.status === "sending") return "sending";
        if (message.status === "sent") return "sent";
        return "delivered";
    };

    /* =========================================
        DELETE MESSAGE
    ========================================= */

    const handleDeleteMessage = async (message) => {
        try {
            setMessages((prev) =>
                prev.map((m) =>
                    m.message_id === message.message_id
                        ? { ...m, is_deleted: true, message_text: "", attachments: [] }
                        : m
                )
            );

            // optimistic sidebar update
            deleteChatLastMessage(message.chat_id, message.message_id);

            await axios.delete(
                `https://api-0ggv.onrender.com/api/chat-messages/${message.message_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            socketRef.current?.emit("chat:delete-message", {
                message_id: message.message_id,
                chat_id: message.chat_id,
            });

        } catch (err) {
            console.log(err);
            setMessages((prev) =>
                prev.map((m) =>
                    m.message_id === message.message_id
                        ? { ...m, is_deleted: false }
                        : m
                )
            );
        }
    };

    /* =========================================
        SEND MESSAGE
    ========================================= */

    const handleMessageSent = async (payload) => {
        const hasAttachments = payload.attachments?.length > 0;

        const tempMessage = {
            message_id: "temp_" + Date.now(),
            chat_id: payload.chat_id,
            sender_id: currentUserId,
            message_text: payload.message || "",
            message_type: hasAttachments ? "file" : "text",
            created_at: new Date().toISOString(),
            sender: { full_name: "You" },
            status: "sending",
            replyTo: replyMessage
                ? {
                    message_id: replyMessage.message_id,
                    text: replyMessage.text || replyMessage.message_text || "",
                    sender_name: replyMessage.sender_name || replyMessage.sender?.full_name || "User",
                    attachments: replyMessage.attachments || [],
                    message_type: replyMessage.message_type || "text",
                }
                : null,
            attachments: hasAttachments
                ? payload.attachments.map((file, i) => ({
                    file_id: "temp_file_" + i,
                    file_url: file.file_url,
                    file_name: file.file_name,
                    file_type: file.file_type,
                    file_size: file.file_size,
                }))
                : [],
        };

        setMessages((prev) => [...prev, tempMessage]);

        // optimistic sidebar update
        updateChatLastMessage(payload.chat_id, tempMessage);

        scrollToBottom();

        try {
            const res = await fetch("https://api-0ggv.onrender.com/api/chat-messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    chat_id: payload.chat_id,
                    sender_id: currentUserId,
                    message_type: hasAttachments ? "file" : "text",
                    message_text: payload.message,
                    reply_to_message_id: replyMessage?.message_id || null,
                }),
            });

            const data = await res.json();

            if (data.success) {
                const realMessage = data.data;

                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.message_id === tempMessage.message_id
                            ? {
                                ...realMessage,
                                attachments: msg.attachments || [],
                                replyTo: realMessage.replyTo
                                    ? {
                                        message_id: realMessage.replyTo.message_id,
                                        text: realMessage.replyTo.message_text || "",
                                        sender_name: realMessage.replyTo.sender?.full_name || msg.replyTo?.sender_name || "User",
                                        attachments: realMessage.replyTo.attachments || [],
                                        message_type: realMessage.replyTo.message_type || "text",
                                    }
                                    : msg.replyTo || null,
                                status: "sent",
                            }
                            : msg
                    )
                );

                // update sidebar with confirmed message
                updateChatLastMessage(payload.chat_id, { ...realMessage, status: "sent" });

                if (hasAttachments) {
                    const attachRes = await axios.post(
                        "https://api-0ggv.onrender.com/api/chat-attachments",
                        {
                            message_id: realMessage.message_id,
                            chat_id: payload.chat_id,
                            attachments: payload.attachments,
                        },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    if (attachRes.data.success) {
                        const updatedRes = await axios.get(
                            `https://api-0ggv.onrender.com/api/chat-messages/${realMessage.message_id}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        const updatedMessage = updatedRes.data.data;

                        setMessages((prev) =>
                            prev.map((msg) =>
                                msg.message_id === realMessage.message_id
                                    ? { ...updatedMessage, status: "sent" }
                                    : msg
                            )
                        );

                        updateChatLastMessage(payload.chat_id, updatedMessage);

                        socketRef.current?.emit("chat:update-message", updatedMessage);
                    }
                }
            }
        } catch (err) {
            console.log(err);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.message_id === tempMessage.message_id
                        ? { ...msg, status: "failed" }
                        : msg
                )
            );
        }
    };

    const firstUnreadIndex = messages.findIndex(
        (m) =>
            m.sender_id !== currentUserId &&
            !m.reads?.some((r) => r.user_id === currentUserId)
    );

    return (
        <>
            {activeSidebar === "chats" && (
                <ChatsUsers
                    sidebarOpen={true}
                    loading={loadingChats}
                    setSidebarOpen={() => setActiveSidebar("newChat")}
                    handleSelectChat={handleSelectChat}
                    selectedChat={selectedChat}
                    chats={chats}
                    chatUnreadCounts={chatUnreadCounts}
                    chatTypingUsers={chatTypingUsers}
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

            <div className="content-area">
                <PerfectScrollbar ref={scrollContainerRef}>

                    <ChartsHeader
                        setSidebarOpen={setSidebarOpen}
                        selectedChat={selectedChat}
                    />

                    <div className="content-area-body p-4 min-vh-100">

                        {messages.map((message, index) => {

                            const previousMessage = messages[index - 1];
                            const showHeader =
                                !previousMessage ||
                                previousMessage.sender_id !== message.sender_id;

                            const isFirstUnread = index === firstUnreadIndex;

                            return (
                                <React.Fragment key={message.message_id}>

                                    {isFirstUnread && unreadCount > 0 && (
                                        <div className="d-flex align-items-center gap-3 my-3">
                                            <div className="flex-grow-1 border-top border-danger" />
                                            <span
                                                className="badge rounded-pill px-3 py-2 bg-danger"
                                                style={{ fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}
                                            >
                                                {unreadCount} unread message{unreadCount > 1 ? "s" : ""}
                                            </span>
                                            <div className="flex-grow-1 border-top border-danger" />
                                        </div>
                                    )}

                                    <div
                                        ref={(el) => {
                                            messageRefs.current[message.message_id] = el;
                                        }}
                                    >
                                    
                                            <ChatMessage
                                                avatar={message?.sender?.avatar_url || "/images/avatar1.jpg"}
                                                name={message?.sender?.full_name}
                                                time={new Date(message.created_at).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                                messages={[{
                                                    ...message,
                                                    text: message.message_text,
                                                    attachments: message.attachments || [],
                                                    task: message.task,
                                                    replyTo: message.replyTo
                                                        ? {
                                                            message_id: message.replyTo.message_id,
                                                            text: message.replyTo.message_text ?? message.replyTo.text ?? "",
                                                            sender_name: message.replyTo.sender?.full_name || "User",
                                                            attachments: message.replyTo.attachments || [],
                                                            message_type: message.replyTo.message_type || "text",
                                                        }
                                                        : null,
                                                }]}
                                                currentUserId={currentUserId}   // ADD THIS
                                                messageStatus={getMessageStatus(message)}
                                                isReplay={message.sender_id === currentUserId}
                                                showHeader={showHeader}
                                                onReply={(msg) => setReplyMessage(msg)}
                                                onEdit={(msg) => setEditingMessage(msg)}
                                                onDelete={handleDeleteMessage}
                                            />
                                    </div>
                                </React.Fragment>
                            );
                        })}

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
                                            {Object.values(typingUsers)[0]?.name}
                                        </span>
                                        <span className="text-muted fs-12">typing...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
<TaskModal
  show={showTaskModal}
  onClose={() =>
    setShowTaskModal(false)
  }
  selectedChat={selectedChat}
  currentUserId={currentUserId}
  onTaskCreated={(task) => {
    handleMessageSent({
      chat_id:
        selectedChat.chat_id,
      message: `📋 ${task.task_name}`,
      task,
      attachments: [],
    });
  }}
/>
                    <MessageEditor
                        selectedChat={selectedChat}
                        currentUserId={currentUserId}
                        replyMessage={replyMessage}
                        setReplyMessage={setReplyMessage}
                        onSendMessage={handleMessageSent}
                        socketRef={socketRef}
                        editingMessage={editingMessage}
                        setEditingMessage={setEditingMessage}
                          onOpenTaskModal={() => setShowTaskModal(true)}

                    />

                </PerfectScrollbar>
            </div>
        </>
    );
};

export default ChatContent;
