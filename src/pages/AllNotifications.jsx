import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

const AllNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const socketRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const res = await fetch("https://api-0ggv.onrender.com/api/notification", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      console.log(JSON.stringify(json))
      if (json.success) setNotifications(json.data);
    } catch (err) {
      console.error(err);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    if (!token) return;

    // Create socket connection
    socketRef.current = io("https://api-0ggv.onrender.com", {
      auth: { token },
      transports: ["websocket"],
    });

    // Connected
    socketRef.current.on("connect", () => {
      console.log("✅ Connected:", socketRef.current.id);
    });

    // Receive notification
    socketRef.current.on("notification", (notification) => {
      console.log("🔔 New notification:", notification);

      setNotifications((prev) => [
        notification,
        ...prev,
      ]);
    });

    // Debug any event
    socketRef.current.onAny((event, ...args) => {
      console.log("📡 Event:", event, args);
    });

    // Error handling
    socketRef.current.on("connect_error", (err) => {
      console.error("❌ Socket error:", err.message);
    });

    socketRef.current.on("disconnect", (reason) => {
      console.warn("⚠️ Disconnected:", reason);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // 🔴 DELETE with UX feedback
  const removeNotification = async (id) => {
    setDeletingId(id); // start animation

    // wait for animation to finish
    setTimeout(() => {
      setNotifications(prev =>
        prev.filter(n => n.notification_id !== id)
      );
      setDeletingId(null);
    }, 300);

    await fetch(`https://api-0ggv.onrender.com/api/notification/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  };
const handleMarkAsViewed = async (id) => {
  try {
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, viewed: true } : n
      )
    );

    await fetch(`https://api-0ggv.onrender.com/api/notification/${id}/read`, {
      method: "PATCH", // change to PUT if your backend uses PUT
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    });

  } catch (error) {
    console.error("Failed to mark as viewed", error);
  }
};

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-4">All Notifications</h4>

      {loading && (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {!loading && notifications.length === 0 && (
        <p className="text-muted">No notifications available.</p>
      )}

      {notifications.map(notification => (
        <div
          key={notification.notification_id}
          className={`notification-card border rounded p-3 mb-2 d-flex justify-content-between
            ${!notification.is_read ? "bg-light" : ""}
            ${deletingId === notification.notification_id ? "deleting" : ""}
          `}
        >
          <Link to={`${notification.action_url}`} onClick={() => handleMarkAsViewed(notification.notification_id)}>
          <div >
            <p className="mb-1 fw-semibold">{notification.title}</p>
            <small className="text-muted">{notification.message}</small>
          </div>
          </Link>

          <button
            className="btn btn-sm btn-outline-danger"
            disabled={deletingId === notification.notification_id}
            onClick={() => removeNotification(notification.notification_id)}
          >
            {deletingId === notification.notification_id ? "Deleting…" : "Delete"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default AllNotifications;
