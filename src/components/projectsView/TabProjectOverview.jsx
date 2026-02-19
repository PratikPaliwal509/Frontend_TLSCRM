
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
                        data={imageList.map((m) => ({
                          id: m.id,
                          user_name: m.full_name,
                          user_img: "data:image/jpeg;base64,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", // optional placeholder
                          // user_img: "/images/avatar/placeholder.png", // optional placeholder
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
                  {/* <a href="#" className="btn btn-icon" data-bs-toggle="tooltip" title="Make as Complete">
                    <FiCheckCircle size={16} />
                  </a>
                  <a href="#" className="btn btn-icon" data-bs-toggle="tooltip" title="Timesheets">
                    <FiCalendar size={16} />
                  </a>
                  <a href="#" className="btn btn-icon" data-bs-toggle="tooltip" title="Statistics">
                    <FiBarChart2 size={16} />
                  </a> */}
                  {/* <a href="#" className="btn btn-success" data-bs-toggle="tooltip" title="Start Timer">
                    <FiClock size={16} className="me-2" />
                    <span>Start Timer</span>
                  </a> */}
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
            <HourCard icon="feather-log-in" color="primary" title="Logged Hours" hours={project?.actual_hours ?? '00:00'} totalBilled={project?.actual_hours ?? '00:00'} />
            <HourCard icon="feather-clipboard" color="warning" title="Billable Hours" hours={project?.time_summary.billable_hours ?? '00:00'} totalBilled={project?.time_summary.billable_amount ?? '00:00'} />
            <HourCard icon="feather-check" color="success" title="Billed Hours" hours={project?.time_summary.billed_hours ?? '00:00'} totalBilled={project?.time_summary.billed_amount ?? '00:00'} />
            <HourCard icon="feather-x" color="danger" title="Unbilled Hours" hours={project?.time_summary.unbilled_hours ?? '00:00'} totalBilled={project?.time_summary.unbilled_amount ?? '00:00'} />
          </div>

          <div className="card  mt-3">
          {/* <div className="card stretch stretch-full mt-3"> */}
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
