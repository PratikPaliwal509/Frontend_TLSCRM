
import React, { useEffect, useState, useRef } from "react";
import { FiBell, FiCheck, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

const NotificationsModal = () => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");
  const socketRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // 🔹 FETCH NOTIFICATIONS (GET)
  const fetchNotifications = async () => {
    try {
      const res = await fetch("https://api-0ggv.onrender.com/api/notification", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      const readNotifications = json.data.filter(
        (notification) => notification.is_read === false
      );

      setNotifications(readNotifications);
    }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  // fetch once on load and setup socket
  useEffect(() => {
    fetchNotifications();

    // Setup socket.io connection
    socketRef.current = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket"]
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected! id:", socketRef.current.id);
    });
    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });
    socketRef.current.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
    });

    // Listen for all events for debugging
    socketRef.current.onAny((event, ...args) => {
      console.log("Socket event:", event, args);
    });

    // Listen for new notifications
    socketRef.current.on("notification", (notification) => {
      console.log("Received notification event:", notification);
      setNotifications(prev => [notification, ...prev]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // 🔹 MARK ALL AS READ (OPTIONAL UI ONLY)
const handleMarkAllAsRead = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "https://api-0ggv.onrender.com/api/notification/read-all",
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const json = await res.json();

    if (res.ok && json.success) {
      // ✅ update UI immediately
      setNotifications([]);
    } else {
      console.error(json.message);
    }
  } catch (error) {
    console.error("Failed to mark notifications as read", error);
  }
};


  // 🔹 REMOVE FROM UI ONLY
  const removeNotification = (id) => {
    setNotifications(prev =>
      prev.filter(n => n.id !== id)
    );
  };

  return (
    <div className="dropdown nxl-h-item">
      <div className="nxl-head-link me-3" data-bs-toggle="dropdown">
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="badge bg-danger nxl-h-badge">{unreadCount}</span>
        )}
      </div>

      <div className="dropdown-menu dropdown-menu-end nxl-h-dropdown nxl-notifications-menu">
        <div className="d-flex justify-content-between align-items-center notifications-head">
          <h6 className="fw-bold text-dark mb-0">Notifications</h6>
          <button
            className="btn btn-link fs-11 text-success"
            onClick={handleMarkAllAsRead}
          >
            <FiCheck size={14} /> Mark all as read
          </button>
        </div>

        {notifications.length === 0 && (
          <p className="text-center text-muted py-4">
            No notifications
          </p>
        )}

        {notifications.slice(0, 3).map(notification => (
          <div
            key={notification.notification_id}
            className={`notification-item d-flex align-items-start  px-3  ${!notification.is_read ? "unread" : "read"
              }`}
          >
            {/* Left dot indicator */}
            <span
              className={`notification-dot ${!notification.is_read ? "bg-primary" : "bg-secondary"}
                }`}
            />

            {/* Content */}
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0 fw-semibold text-dark">
                  {notification.title}
                </p>
                <small className="text-muted">
                  {new Date(notification.created_at).toLocaleTimeString()}
                </small>
              </div>

              <p className="mb-1 text-muted fs-13">
                {notification.message}
              </p>
              {<hr />}
            </div>
          </div>
        ))}


        <div className="text-center notifications-footer">
          <Link to="/notifications" className="fs-13 fw-semibold text-dark">
            View all notifications
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
