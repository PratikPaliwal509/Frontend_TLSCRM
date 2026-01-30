
import React, { useEffect, useState } from "react";
import { FiBell, FiCheck, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

const NotificationsModal = () => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");

  const unreadCount = notifications.filter(n => !n.read).length;

  // 🔹 FETCH NOTIFICATIONS (GET)
  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notification", {
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

  // fetch once on load
  useEffect(() => {
    fetchNotifications();
  }, []);

  // 🔹 MARK ALL AS READ (OPTIONAL UI ONLY)
const handleMarkAllAsRead = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/notification/read-all",
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
