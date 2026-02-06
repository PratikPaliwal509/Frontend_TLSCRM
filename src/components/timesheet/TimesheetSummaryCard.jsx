import React from 'react'

const TimesheetSummaryCard = ({ timesheet }) => {
  if (!timesheet) return null

  return (
    <div className="row g-3">
      <div className="col-md-3">
        <div className="card p-3 border rounded d-flex justify-content-between align-items-center bg-light">
          <span><strong>Total Hours</strong></span>
          <span className="badge bg-secondary">{timesheet.actual_hours}</span>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card p-3 border rounded d-flex justify-content-between align-items-center bg-light">
          <span><strong>Billable Hours</strong></span>
          <span className="badge bg-primary">{timesheet.billable_hours}</span>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card p-3 border rounded d-flex justify-content-between align-items-center bg-light">
          <span><strong>Billed Hours</strong></span>
          <span className="badge bg-success">{timesheet.billed_hours}</span>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card p-3 border rounded d-flex justify-content-between align-items-center bg-light">
          <span><strong>Unbilled Hours</strong></span>
          <span className="badge bg-warning text-dark">{timesheet.unbilled_hours}</span>
        </div>
      </div>
    </div>
  )
}

export default TimesheetSummaryCard
