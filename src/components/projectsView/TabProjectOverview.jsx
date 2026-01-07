
import React from 'react'
import { FiBarChart2, FiCalendar, FiCheckCircle, FiClock, FiLink2 } from 'react-icons/fi'
import ImageGroup from '@/components/shared/ImageGroup'
import getIcon from '@/utils/getIcon'
import ReactApexChart from 'react-apexcharts'
import { projectViewAreaChartOptions } from '@/utils/chartsLogic/projectViewAreaChartOptions'
import { formatDate, formatCurrency, statusLabel } from '@/utils/projectHelpers'

const TabProjectOverview = ({ project }) => {
  const chartOptions = projectViewAreaChartOptions()
  const members = project?.projectMembers || []

  const imageList = members.map(m => ({
    id: m.member_id,
    user_name: m.user?.full_name,
    user_img: m.user?.avatar || '/images/avatar/default.png'
  }))

  return (
    <div className="tab-pane fade show active" id="overviewTab">
      <div className="row">
        <div className="col-lg-12">
          <div className="card stretch stretch-full">
            <div className="card-body task-header d-md-flex align-items-center justify-content-between">
              <div className="me-4">
                <h4 className="mb-4 fw-bold d-flex">
                  <span className="text-truncate-1-line">
                    {project?.project_name}
                    <span className="badge bg-soft-primary text-primary mx-3">{statusLabel(project?.status)}</span>
                  </span>
                </h4>
                <div className="d-flex align-items-center">
                  {members.length > 0 && (
                    <div className="img-group lh-0 ms-2 justify-content-start">
                      <ImageGroup
                        data={members.map((m) => ({
                          id: m.user.user_id,
                          user_name: m.user.full_name,
                          user_img: "/images/avatar/placeholder.png", // optional placeholder
                        }))}
                        avatarSize="avatar-md"
                      />
                      <span className="d-none d-sm-flex">
                        <span className="fs-12 text-muted ms-3 text-truncate-1-line">{members.length}+ members</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 mt-md-0">
                <div className="d-flex gap-2">
                  <a href="#" className="btn btn-icon" data-bs-toggle="tooltip" title="Make as Complete">
                    <FiCheckCircle size={16} />
                  </a>
                  <a href="#" className="btn btn-icon" data-bs-toggle="tooltip" title="Timesheets">
                    <FiCalendar size={16} />
                  </a>
                  <a href="#" className="btn btn-icon" data-bs-toggle="tooltip" title="Statistics">
                    <FiBarChart2 size={16} />
                  </a>
                  <a href="#" className="btn btn-success" data-bs-toggle="tooltip" title="Start Timer">
                    <FiClock size={16} className="me-2" />
                    <span>Start Timer</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="col-xl-8">
          <div className="card stretch stretch-full">
            <div className="card-body">
              <div className="row">
                <Detail label="Project Code" value={project?.project_code} />
                <Detail label="Status" value={statusLabel(project?.status)} />
                <Detail label="Priority" value={project?.priority} />
                <Detail label="Billing Type" value={project?.billing_type ?? '—'} />
                <Detail label="Start Date" value={formatDate(project?.start_date)} />
                <Detail label="End Date" value={formatDate(project?.end_date)} />
                <Detail label="Estimated Hours" value={project?.estimated_hours ?? '—'} />
                <Detail label="Actual Hours" value={project?.actual_hours ?? '—'} />
                <Detail label="Budget" value={formatCurrency(project?.budget_amount, project?.budget_currency)} />
                <Detail label="Billable" value={project?.is_billable ? 'Yes' : 'No'} />
                <Detail label="Public" value={project?.is_public ? 'Yes' : 'No'} />
                <Detail label="Progress Percentage" value={`${project?.progress_percentage}%` ?? '—'} />
              </div>

              <hr />
              <label className="form-label">Description</label>
              <p>{project?.description ?? '—'}</p>

              <label className="form-label mt-3">Notes</label>
              <p>{project?.notes ?? '—'}</p>
            </div>
          </div>
        </div>

        {/* Hours & Charts */}

        {/* Pending Hours & Charts. Need to calculate totalbilled by project member hourly rate */}
        {/* NOTE:
        Total Billed should be calculated by multiplying each project member’s
        hourly_rate with their billable logged hours, then summing the result.

        Formula:
        totalBilled = Σ (billable_hours_per_member × member.hourly_rate)

        This ensures billing is based on actual time logs and member-specific rates,
        not on estimated_hours. */}

        <div className="col-xl-4">
          <div className="row">
            <HourCard icon="feather-log-in" color="primary" title="Logged Hours" hours={project?.actual_hours ?? '00:00'} totalBilled="00:00" />
            <HourCard icon="feather-clipboard" color="warning" title="Billable Hours" hours={project?.actual_hours ?? '00:00'} totalBilled="00:00" />
            <HourCard icon="feather-check" color="success" title="Billed Hours" hours="00:00" totalBilled="00:00" />
            <HourCard icon="feather-x" color="danger" title="Unbilled Hours" hours="00:00" totalBilled="00:00" />
          </div>

          <div className="card stretch stretch-full mt-3">
            <ReactApexChart options={chartOptions} series={chartOptions?.series} type="area" height={270} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TabProjectOverview

const Detail = ({ label, value }) => (
  <div className="col-md-6 mb-3">
    <label className="form-label">{label}</label>
    <p>{value ?? '—'}</p>
  </div>
)

const HourCard = ({ icon, color, title, hours, totalBilled }) => (
  <div className="col-xxl-6 col-xl-12 col-sm-6 mb-3">
    <div className="card stretch stretch-full">
      <div className="card-body">
        <div className={`avatar-text bg-soft-${color} text-${color} border-0 mb-3`}>
          {React.cloneElement(getIcon(icon), { size: 16 })}
        </div>
        <p>
          <span className={`fw-bold text-${color}`}>{title}:</span> {hours}
        </p>
        <div>
          <span className="fw-bold text-dark">Total Billed:</span> {totalBilled}
        </div>
      </div>
    </div>
  </div>
)
