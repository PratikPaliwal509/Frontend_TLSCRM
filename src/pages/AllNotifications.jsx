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
        `https://api-0ggv.onrender.com/api/notification?page=${pageNo}&limit=${LIMIT}`,
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

    socketRef.current = io("https://api-0ggv.onrender.com", {
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

    await fetch(`https://api-0ggv.onrender.com/api/notification/${id}`, {
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
      `https://api-0ggv.onrender.com/api/notification/${id}/read`,
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

                    {/* PREVIOUS */}
                    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        style={{
                          color: "#283c50",
                          // borderColor: "#3454d1"
                        }}
                      >
                        Previous
                      </button>
                    </li>

                    {/* CURRENT PAGE */}
                    <li className="page-item active">
                      <span
                        className="page-link"
                        style={{
                          backgroundColor: "#3454d1",
                          borderColor: "#3454d1",
                          color: "#fff"
                        }}
                      >
                        {page}
                      </span>
                    </li>

                    {/* NEXT */}
                    <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        style={{
                          color: "#283c50",
                          // borderColor: "#3454d1"
                        }}
                      >
                        Next
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