import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

const AllNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");
  const socketRef = useRef(null);

  /* ================= FETCH ================= */
  const fetchNotifications = async (pageNo) => {
    try {
      setLoading(true);

      // ✅ CLEAR OLD DATA (IMPORTANT FIX)
      setNotifications([]);

      const res = await fetch(
        `https://api-0ggv.onrender.com/api/notification?page=${pageNo}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const json = await res.json();

      if (json.success) {
        setNotifications(json.data || []);

        // ✅ Handle total pages
        if (json.total) {
          setTotalPages(Math.ceil(json.total / 10));
        } else {
          setTotalPages(json.data.length < 10 ? pageNo : pageNo + 1);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= PAGE CHANGE ================= */
  useEffect(() => {
    fetchNotifications(page);
  }, [page]);

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (!token) return;

    socketRef.current = io("https://api-0ggv.onrender.com", {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current.on("notification", (notification) => {
      // Only push if on first page
      if (page === 1) {
        setNotifications(prev => [notification, ...prev]);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [page]);

  /* ================= DELETE ================= */
  const removeNotification = async (id) => {
    setDeletingId(id);

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

  /* ================= MARK READ ================= */
  const handleMarkAsViewed = async (id) => {
    try {
      setNotifications(prev =>
        prev.map(n =>
          n.notification_id === id ? { ...n, is_read: true } : n
        )
      );

      await fetch(
        `https://api-0ggv.onrender.com/api/notification/${id}/read`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= PAGE CHANGE ================= */
  const handlePageChange = (pageNo) => {
    if (pageNo < 1 || pageNo > totalPages) return;
    setPage(pageNo);
  };

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-4">All Notifications</h4>

      {/* ✅ FULL PAGE LOADER */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : (
        <>
          {notifications.length === 0 ? (
            <p className="text-muted">No notifications available.</p>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.notification_id}
                className={`border rounded p-3 mb-2 d-flex justify-content-between
                ${!notification.is_read ? "bg-light" : ""}
                ${deletingId === notification.notification_id ? "opacity-50" : ""}
              `}
              >
                <Link
                  to={notification.action_url}
                  onClick={() =>
                    handleMarkAsViewed(notification.notification_id)
                  }
                >
                  <div>
                    <p className="mb-1 fw-semibold">{notification.title}</p>
                    <small className="text-muted">{notification.message}</small>
                  </div>
                </Link>

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() =>
                    removeNotification(notification.notification_id)
                  }
                >
                  {deletingId === notification.notification_id
                    ? "Deleting…"
                    : "Delete"}
                </button>
              </div>
            ))
          )}
        </>
      )}

      {/* ✅ PAGINATION */}
      {!loading && totalPages > 1 && (
        <div className="d-flex justify-content-end mt-4">
          <ul className="pagination mb-0">

            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(page - 1)}
              >
                Previous
              </button>
            </li>

            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${page === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(page + 1)}
              >
                Next
              </button>
            </li>

          </ul>
        </div>
      )}
    </div>
  );
};

export default AllNotifications;