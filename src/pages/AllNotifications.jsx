import React, { useEffect, useState, useRef } from "react";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import Footer from "@/components/shared/Footer";
import NotificationsHeader from "@/components/NotificationsHeader";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
const LIMIT = 10;

const AllNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const token = localStorage.getItem("token");
  const socketRef = useRef(null);

  /* ================= FETCH ================= */
  const fetchNotifications = async (pageNo) => {
    try {
      setLoading(true);
      // setNotifications([]);

      const res = await fetch(
        `http://localhost:5000/api/notification?page=${pageNo}&limit=${LIMIT}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const json = await res.json();

      if (json.success) {
        setNotifications(json.data || []);
        setTotal(json.total || 0); // 👈 IMPORTANT (update backend if missing)
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(page);
  }, [page]);

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (!token) return;

    socketRef.current = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current.on("notification", (notification) => {
      if (page === 1) {
        setNotifications((prev) => [notification, ...prev]);
      }
    });

    return () => socketRef.current?.disconnect();
  }, [page]);

  /* ================= DELETE ================= */
  const removeNotification = async (id) => {
    setDeletingId(id);

    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.notification_id !== id)
      );
      setDeletingId(null);
    }, 300);

    await fetch(`http://localhost:5000/api/notification/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  /* ================= MARK READ ================= */
  const handleMarkAsViewed = async (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.notification_id === id ? { ...n, is_read: true } : n
      )
    );

    await fetch(
      `http://localhost:5000/api/notification/${id}/read`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };
  const handlePageChange = (newPage) => {
    if (newPage === page || newPage < 1 || newPage > totalPages) return;

    setIsAnimating(true);

    setTimeout(() => {
      setPage(newPage);
      setIsAnimating(false);
    }, 250); // match CSS animation
  };
  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(total / LIMIT);

  const start = (page - 1) * LIMIT + 1;
  const end = Math.min(page * LIMIT, total);

  return (
    <>
      <PageHeader>
        <NotificationsHeader />
      </PageHeader>

      <div className="main-content">
        <div className="row">
          <div className="col-12">

            <div className="card">
              <div
                className={`w-100 d-flex justify-content-center align-items-center flex-column 
                ${isAnimating ? "table-fade-out" : "table-fade-in"}`}
              >

                {/* LOADER */}
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" />
                  </div>
                ) : notifications.length === 0 ? (
                  <p className="text-muted">No notifications found</p>
                ) : (
                  <>
                    {/* LIST */}
                    {notifications.map((notification) => (
                      <div
                        key={notification.notification_id}
                        className={`d-flex w-50 justify-content-between align-items-start border-bottom py-3 px-3
                        ${!notification.is_read ? "bg-light" : ""}
                      `}
                      >
                        <Link
                          to={notification.action_url}
                          className="text-decoration-none text-dark flex-grow-1"
                          onClick={() =>
                            handleMarkAsViewed(notification.notification_id)
                          }
                        >
                          <p className="mb-1 fw-semibold">
                            {notification.title}
                          </p>
                          <small className="text-muted">
                            {notification.message}
                          </small>
                          <div className="fs-12 text-muted mt-1">
                            {new Date(
                              notification.created_at
                            ).toLocaleString()}
                          </div>
                        </Link>

                        <button
                          className="btn btn-sm btn-light border"
                          onClick={() =>
                            removeNotification(notification.notification_id)
                          }
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </>
                )}

              </div>

              {/* ✅ TABLE STYLE PAGINATION */}
              {!loading && total > 0 && (
                <div className="card-footer d-flex justify-content-between align-items-center">

                  {/* LEFT TEXT */}
                  <div className="text-muted">
                    Showing {start} to {end} of {total} entries
                  </div>

                  {/* RIGHT PAGINATION */}
                 <ul className="pagination mb-0">

  {/* ⬅️ LEFT ARROW */}
  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
    <button
      className="page-link d-flex align-items-center justify-content-center"
      onClick={() => handlePageChange(page - 1)}
      style={{ width: "36px", height: "36px" }}
    >
      <FiChevronLeft size={16} />
    </button>
  </li>

  {/* PAGE NUMBERS */}
  {[...Array(totalPages)].map((_, i) => {
    const isActive = page === i + 1;
    return (
      <li key={i} className={`page-item ${isActive ? "active" : ""}`}>
        <button
          className="page-link"
          onClick={() => handlePageChange(i + 1)}
          style={{
            color: isActive ? "#fff" : "#3454d1",
            backgroundColor: isActive ? "#3454d1" : "transparent",
            borderColor: "#3454d1",
            minWidth: "36px",
            height: "36px",
          }}
        >
          {i + 1}
        </button>
      </li>
    );
  })}

  {/* ➡️ RIGHT ARROW */}
  <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
    <button
      className="page-link d-flex align-items-center justify-content-center"
      onClick={() => handlePageChange(page + 1)}
      style={{ width: "36px", height: "36px" }}
    >
      <FiChevronRight size={16} />
    </button>
  </li>

</ul>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AllNotifications;