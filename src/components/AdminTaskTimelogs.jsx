"use client";
import { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";

const AdminTaskTimelogs = ({ taskId, project_id, role }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  /* ---------------- HELPERS ---------------- */

  const formatTime = (date) =>
    date ? new Date(date).toLocaleString() : "-";

  const formatDuration = (start, end) => {
    if (!start || !end) return "-";
    const seconds =
      (new Date(end).getTime() - new Date(start).getTime()) / 1000;

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    return `${h}h ${m}m`;
  };

  /* ---------------- FETCH ALL LOGS ---------------- */

  const fetchLogs = async () => {
    if (!taskId || !project_id) return;

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/tasks/timelogs/${project_id}/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await res.json();
      setLogs(result?.data || []);
    } catch (err) {
      console.error("Failed to fetch timelogs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [taskId, project_id]);

  /* ---------------- APPROVE ---------------- */

  const handleApprove = async (logId) => {
    const token = localStorage.getItem("token");
    setActionLoadingId(logId);

    try {
      await fetch(
        `http://localhost:5000/api/tasks/timelogs/${logId}/approve`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchLogs();
    } catch (err) {
      console.error("Approve failed", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  /* ---------------- UI ---------------- */

  if (loading) return <p>Loading time logs...</p>;

  return (
    <div className="mt-4">
      <div className="card-body">

        <h2 className="fs-16 fw-bold mb-3">All Time Logs</h2>

        {logs.length === 0 ? (
          <div className="text-center">
            <FiClock size={26} className="text-muted mb-2" />
            <p className="fw-semibold">No time logs found</p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.log_id}
              className="border rounded p-3 mb-3"
            >
              <div className="row g-3">

                <div className="col-md-6">
                  <div className="text-muted fs-12">Start</div>
                  <div className="fw-semibold">
                    {formatTime(log.start_time)}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="text-muted fs-12">End</div>
                  <div className="fw-semibold">
                    {log.end_time
                      ? formatTime(log.end_time)
                      : "In Progress"}
                  </div>
                </div>

                <div className="col-12">
                  <div className="text-muted fs-12">Description</div>
                  <div className="bg-light p-2 rounded">
                    {log.description || "No description"}
                  </div>
                </div>

                {log.end_time && (
                  <div className="col-12 d-flex justify-content-between align-items-center bg-soft-primary p-2 rounded">
                    <span>Total Time</span>
                    <span className="fw-bold text-primary">
                      {formatDuration(log.start_time, log.end_time)}
                    </span>
                  </div>
                )}

                {/* ✅ APPROVE BUTTON */}
                {(role === "Admin" || role === "Super Admin") && (
                  <div className="col-12 text-end">
                    <button
                      className="btn btn-success"
                      disabled={
                        actionLoadingId === log.log_id ||
                        log.is_approved
                      }
                      onClick={() => handleApprove(log.log_id)}
                    >
                      {log.is_approved
                        ? "Approved"
                        : actionLoadingId === log.log_id
                        ? "Approving..."
                        : "Approve"}
                    </button>
                  </div>
                )}

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminTaskTimelogs;