import React from 'react'
import getIcon from '@/utils/getIcon'

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

const TabUserProfile = ({ user }) => {
  if (!user) return null

  /* -------- User Info (Left Section) -------- */
  const userInfoData = [
    {
      title: 'Full Name',
      content: <span>{user.name || '-'}</span>,
    },
    {
      title: 'Email',
      content: (
        <a href={`mailto:${user.email}`}>
          {user.email || '-'}
        </a>
      ),
    },
    {
      title: 'Phone',
      content: user.phone ? (
        <a href={`tel:${user.phone}`}>{user.phone}</a>
      ) : (
        '-'
      ),
    },
    {
      title: 'Role',
      content: <span className="text-capitalize">{user.role || '-'}</span>,
    },
    {
      title: 'Department',
      content: <span>{user.department?.name || '-'}</span>,
    },
    {
      title: 'Team',
      content: <span>{user.team?.name || '-'}</span>,
    },
    {
      title: 'Address',
      content: (
        <span>
          {[
            user.address,
            user.city,
            user.state,
            user.country,
            user.postal_code,
          ]
            .filter(Boolean)
            .join(', ') || '-'}
        </span>
      ),
    },
  ]

  /* -------- General Info (Right Section) -------- */
  const generalInfoData = [
    {
      title: 'Status',
      icon: 'feather-user-check',
      text: user.status,
    },
    {
      title: 'Account Type',
      icon: 'feather-shield',
      text: user.account_type || 'Standard',
    },
    {
      title: 'Email Verified',
      icon: 'feather-mail',
      text: user.email_verified ? 'Verified' : 'Not Verified',
    },
    {
      title: 'Last Login',
      icon: 'feather-log-in',
      text: user.last_login
        ? new Date(user.last_login).toDateString()
        : 'Never',
    },
    {
      title: 'Joined On',
      icon: 'feather-clock',
      text: new Date(user.created_at).toDateString(),
    },
  ]

  return (
    <div className="tab-pane fade show active" id="profileTab" role="tabpanel">
      {/* -------- User Info -------- */}
      <div className="card card-body user-info">
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0">
            <span className="d-block mb-2">User Information :</span>
            <span className="fs-12 fw-normal text-muted d-block">
              Basic information about this user
            </span>
          </h5>

          <a href={`/users/edit/${user.id}`} className="btn btn-sm btn-light-brand">
            Edit User
          </a>
        </div>

        {userInfoData.map((data, index) => (
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
        <div className="mb-4">
          <h5 className="fw-bold mb-0">
            <span className="d-block mb-2">General Information :</span>
            <span className="fs-12 fw-normal text-muted d-block">
              Account and system details
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

        {/* Notes */}
        <div className="row mb-4">
          <div className="col-lg-2 fw-medium">Notes</div>
          <div className="col-lg-10">
            {user.notes || 'No notes available'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TabUserProfile
