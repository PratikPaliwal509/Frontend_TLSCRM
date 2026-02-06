// ClientProjectCost.js
import React from 'react'

// Helper to format minutes to HH:MM
const toHHMM = (minutes = 0) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// Helper to format currency
const formatCurrency = (value = 0, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(value)
}

const ClientProjectCost = ({ projectCost }) => {
  if (!projectCost || projectCost.length === 0) return null

  return (
    <div className="mb-4">
      {projectCost.map((project) => (
        <div className="card shadow-sm mb-3" key={project.project_id}>
          <div className="card-header bg-primary text-white">
            <strong>{project.project_name}</strong> - Project Cost Summary
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6 mb-2">
                <div className="p-3 border rounded d-flex justify-content-between align-items-center bg-light">
                  <span><strong>Actual Hours</strong></span>
                  <span className="badge bg-secondary fs-6">{project.actual_hours}</span>
                </div>
              </div>

              <div className="col-md-6 mb-2">
                <div className="p-3 border rounded d-flex justify-content-between align-items-center bg-light">
                  <span><strong>Billable Hours</strong></span>
                  <span className="badge bg-info fs-6">
                    {project.billable_hours} | {formatCurrency(project.billable_amount, project.currency)}
                  </span>
                </div>
              </div>

              <div className="col-md-6 mb-2">
                <div className="p-3 border rounded d-flex justify-content-between align-items-center bg-light">
                  <span><strong>Billed Hours</strong></span>
                  <span className="badge bg-success fs-6">
                    {project.billed_hours} | {formatCurrency(project.billed_amount, project.currency)}
                  </span>
                </div>
              </div>

              <div className="col-md-6 mb-2">
                <div className="p-3 border rounded d-flex justify-content-between align-items-center bg-light">
                  <span><strong>Unbilled Hours</strong></span>
                  <span className="badge bg-warning text-dark fs-6">
                    {project.unbilled_hours} | {formatCurrency(project.unbilled_amount, project.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ClientProjectCost
