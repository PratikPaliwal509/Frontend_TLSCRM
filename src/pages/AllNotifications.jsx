import React, { useEffect, useState } from "react";

const AllNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notification", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) setNotifications(json.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
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

    await fetch(`http://localhost:5000/api/notification/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-4">All Notifications</h4>

      {notifications.length === 0 && (
        <p className="text-muted">No notifications available.</p>
      )}

      {notifications.map(notification => (
        <div
          key={notification.notification_id}
          className={`notification-card border rounded p-3 mb-2 d-flex justify-content-between
            ${!notification.read ? "bg-light" : ""}
            ${deletingId === notification.notification_id ? "deleting" : ""}
          `}
        >
          <div>
            <p className="mb-1 fw-semibold">{notification.title}</p>
            <small className="text-muted">{notification.message}</small>
          </div>

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
