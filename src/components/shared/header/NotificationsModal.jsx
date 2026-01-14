// import React from 'react'
// import { FiBell, FiCheck, FiX } from 'react-icons/fi'
// import { Link } from 'react-router-dom'
// import { useNotifications } from '../../../../src/context/NotificationsContext'
// import NotificationCard from '@/components/notification/NotificationCard'
// const NotificationsModal = () => {
//     const {
//         notifications,
//         markAsRead,
//         removeNotification,
//         markAllAsRead
//     } = useNotifications()
// console.log(notifications)
//     const unreadCount = notifications.filter(n => !n.read).length

//     return (
//         <div className="dropdown nxl-h-item">
//             <div className="nxl-head-link me-3" data-bs-toggle="dropdown">
//                 <FiBell size={20} />
//                 {unreadCount > 0 && (
//                     <span className="badge bg-danger nxl-h-badge">
//                         {unreadCount}
//                     </span>
//                 )}
//             </div>

//             <div className="dropdown-menu dropdown-menu-end nxl-h-dropdown nxl-notifications-menu">
//                 <div className="d-flex justify-content-between align-items-center notifications-head">
//                     <h6 className="fw-bold text-dark mb-0">Notifications</h6>
//                     <button
//                         className="btn btn-link fs-11 text-success"
//                         onClick={markAllAsRead}
//                     >
//                         <FiCheck size={14} /> Mark all as read
//                     </button>
//                 </div>

//                 {notifications.length === 0 && (
//                     <p className="text-center text-muted py-4">
//                         No notifications
//                     </p>
//                 )}

//                 {notifications.slice(0, 5).map(notification => (
//                     <NotificationCard
//                         key={notification.id}
//                         notification={notification}
//                         onRead={markAsRead}
//                         onRemove={removeNotification}
//                     />
//                 ))}

//                 <div className="text-center notifications-footer">
//                     <Link
//                         to="/notifications"
//                         className="fs-13 fw-semibold text-dark"
//                     >
//                         View all notifications
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default NotificationsModal
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
      if (json.success) {
        setNotifications(json.data);
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
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
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
            onClick={markAllAsRead}
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
            className={`notification-item d-flex align-items-start gap-3 px-3 py-2 ${!notification.read ? "unread" : "read"
              }`}
          >
            {/* Left dot indicator */}
            <span
              className={`notification-dot ${!notification.read ? "bg-primary" : "bg-secondary"
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
