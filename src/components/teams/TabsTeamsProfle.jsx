import React from 'react'
import getIcon from '@/utils/getIcon'
import { Link } from 'react-router-dom'

const InfoRow = ({ title, content }) => (
  <div className="row mb-4">
    <div className="col-lg-2 fw-medium">{title}</div>
    <div className="col-lg-10">{content}</div>
  </div>
)

const GeneralCard = ({ title, icon, text }) => (
  <div className="row mb-4">
    <div className="col-lg-2 fw-medium">{title}</div>
    <div className="col-lg-10 hstack gap-2">
      {icon && (
        <div className="avatar-text avatar-sm">
          {getIcon(icon)}
        </div>
      )}
      <span className="text-capitalize">{text}</span>
    </div>
  </div>
)

const TabTeamProfile = ({ team }) => {
  if (!team) return null


  /* -------- Team Info -------- */
  const teamInfoData = [
    {
      title: 'Team Name',
      content: <span>{team.team_name || '-'}</span>,
    },
    {
      title: 'Description',
      content: <span>{team.description || '-'}</span>,
    },
    {
      title: 'Department',
      content: team.department ? (
        <Link
          to={`/departments/view/${team.department.department_id}`}
        >
          {team.department.department_name}
        </Link>
      ) : (
        <span>-</span>
      ),
    },
    {
      title: 'Team Lead',
      content: team.team_lead ? (
        <span>
          {team.team_lead.first_name} {team.team_lead.last_name}
        </span>
      ) : (
        <span>-</span>
      ),
    },
    {
      title: 'Total Members',
      content: <span>{team.members?.length || 0}</span>,
    },
  ]

  /* -------- General Info -------- */
  const generalInfoData = [
    {
      title: 'Status',
      icon: 'feather-git-commit',
      text: team.is_active ? 'Active' : 'Inactive',
    },
    {
      title: 'Created On',
      icon: 'feather-clock',
      text: team.created_at
        ? new Date(team.created_at).toDateString()
        : '-',
    },
    {
      title: 'Last Updated',
      icon: 'feather-refresh-cw',
      text: team.updated_at
        ? new Date(team.updated_at).toDateString()
        : '-',
    },
  ]

  return (
    <div
      className="tab-pane fade show active"
      id="profileTab"
      role="tabpanel"
    >
      {/* -------- Team Info -------- */}
      <div className="card card-body lead-info">
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0">
            <span className="d-block mb-2">
              Team Information :
            </span>
            <span className="fs-12 fw-normal text-muted d-block">
              Following information for this team
            </span>
          </h5>

          <Link
            to={`/teams/edit/${team.team_id}`}
            className="btn btn-sm btn-light-brand"
          >
            Edit Team
          </Link>
        </div>

        {teamInfoData.map((data, index) => (
          <InfoRow
            key={index}
            title={data.title}
            content={data.content}
          />
        ))}
      </div>

      <hr />

      {/* -------- General Info -------- */}
      <div className="card card-body general-info">
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0">
            <span className="d-block mb-2">
              General Information :
            </span>
            <span className="fs-12 fw-normal text-muted d-block">
              General information for this team
            </span>
          </h5>
        </div>

        {generalInfoData.map((data, index) => (
          <GeneralCard
            key={index}
            title={data.title}
            icon={data.icon}
            text={data.text}
          />
        ))}
      </div>
    </div>
  )
}

export default TabTeamProfile
