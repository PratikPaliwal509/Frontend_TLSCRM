import { useEffect, useState } from "react"
import { FiClock } from "react-icons/fi"

const TaskTimeLogDetails = ({ taskId, project_id, role }) => {
  const [log, setLog] = useState(null)
  const [loading, setLoading] = useState(false)

  // Manual entry states
  const [manualStart, setManualStart] = useState("")
  const [manualEnd, setManualEnd] = useState("")
  const [description, setDescription] = useState("")
  const [isBillable, setIsBillable] = useState(true)
  const [hourlyRate, setHourlyRate] = useState("")
const [actionLoading, setActionLoading] = useState(false)

  /* ---------------- HELPERS ---------------- */

  const formatTime = (date) =>
    date ? new Date(date).toLocaleString() : "-"

  const formatDuration = (start, end) => {
    if (!start || !end) return "-"
    const seconds =
      (new Date(end).getTime() - new Date(start).getTime()) / 1000

    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)

    return `${h}h ${m}m`
  }

  /* ---------------- FETCH LOG ---------------- */

  const fetchLog = async () => {
    if (!taskId) return

    const token = localStorage.getItem("token")
    setLoading(true)

    try {
      const res = await fetch(
        `https://api-0ggv.onrender.com/api/tasks/timelogs/active/${taskId}`,
        // `https://api-0ggv.onrender.com/api/tasks/timelogs/${taskId}/time-logs`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const result = await res.json()
      setLog(result || null)
      // setLog(result?.data?.[0] || null)
    } catch (err) {
      console.error("Failed to fetch time log", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLog()
  }, [taskId])

  /* ---------------- MANUAL ENTRY ---------------- */

  const handleManualSubmit = async () => {
    if (!manualStart || !manualEnd) return

    if (new Date(manualEnd) <= new Date(manualStart)) {
      alert("End time must be after start time")
      return
    }

    const token = localStorage.getItem("token")

    try {
      await fetch(
        `https://api-0ggv.onrender.com/api/tasks/timelogs/${taskId}/timelogs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            project_id,
            start_time: manualStart,
            end_time: manualEnd,
            description,
            is_billable: isBillable,
            hourly_rate: hourlyRate || null,
            log_type: "manual",
          }),
        }
      )

      // Reset & refetch
      setManualStart("")
      setManualEnd("")
      setDescription("")
      setHourlyRate("")
      setIsBillable(true)

      fetchLog()
    } catch (err) {
      console.error("Failed to save manual time", err)
    }
  }

  const handleApprove = async () => {
  if (!log) return

  const token = localStorage.getItem("token")
  setActionLoading(true)

  try {
    await fetch(
      `https://api-0ggv.onrender.com/api/tasks/timelogs/${log.log_id}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    fetchLog()
  } catch (err) {
    console.error("Failed to approve time log", err)
  } finally {
    setActionLoading(false)
  }
}

const handleReject = async () => {
  if (!log) return

  const token = localStorage.getItem("token")
  setActionLoading(true)

  try {
    await fetch(
      `https://api-0ggv.onrender.com/api/tasks/timelogs/${log.log_id}/reject`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    fetchLog()
  } catch (err) {
    console.error("Failed to reject time log", err)
  } finally {
    setActionLoading(false)
  }
}

  /* ---------------- UI ---------------- */

  if (loading) return <p>Loading time logs...</p>

  return (
    <div className="mt-4">
      <div className="card-body">
        {log ? (
          <>
            <h2 className="fs-16 fw-bold mb-1">Time Log Details</h2>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="text-muted fs-12 mb-1">Start Time</div>
                <div className="fw-semibold">{formatTime(log.start_time)}</div>
              </div>

              <div className="col-md-6">
                <div className="text-muted fs-12 mb-1">End Time</div>
                {log.end_time ? (
                  <div className="fw-semibold">
                    {formatTime(log.end_time)}
                  </div>
                ) : (
                  <span className="badge bg-warning text-dark">
                    In Progress
                  </span>
                )}
              </div>

              <div className="col-12">
                <div className="text-muted fs-12 mb-1">Description</div>
                <div className="bg-light rounded p-3 fs-14">
                  {log.description || "No description provided"}
                </div>
              </div>

              {log.end_time && (
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center bg-soft-primary rounded p-3">
                    <span className="fw-semibold">Total Time</span>
                    <span className="fw-bold text-primary">
                      {formatDuration(log.start_time, log.end_time)}
                    </span>
                  </div>
                   <div className="d-flex gap-2 justify-content-end">
      {
      // !log.is_approved && 
      (role === "Super Admin" || role === "Admin") && <>
        <button
          className="btn btn-success mt-2"
          onClick={handleApprove}
          disabled={actionLoading || log.is_approved}
        >
          {log.is_approved ? "Approved" : "Approve"}
        </button>
      
        {/* <button
          className="btn btn-danger"
          onClick={handleReject}
          disabled={actionLoading}
        >
          Reject
        </button> */}
        </>
      }
    </div>
  
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-4">
              <FiClock size={26} className="text-muted mb-2" />
              <p className="fw-semibold mb-1">No time logged</p>
              <small className="text-muted">
                Add manual time entry
              </small>
            </div>

            <div className="border rounded p-4">
              <h6 className="fw-semibold mb-3">Manual Time Entry</h6>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Start Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={manualStart}
                    onChange={(e) => setManualStart(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">End Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={manualEnd}
                    onChange={(e) => setManualEnd(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Hourly Rate</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Optional"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                  />
                </div>

                <div className="col-md-6 d-flex align-items-center">
                  <div className="form-check mt-4">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={isBillable}
                      onChange={(e) => setIsBillable(e.target.checked)}
                    />
                    <label className="form-check-label">
                      Billable
                    </label>
                  </div>
                </div>

                <div className="col-12 text-end">
                  <button
                    className="btn btn-primary"
                    disabled={!manualStart || !manualEnd}
                    onClick={handleManualSubmit}
                  >
                    Save Time Entry
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default TaskTimeLogDetails
