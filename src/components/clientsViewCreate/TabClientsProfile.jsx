
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

const TabClientsProfile = ({ client }) => {
  if (!client) return null

  /* -------- Lead Info (Left Section) -------- */
  const leadInfoData = [
    {
      title: 'Company Name',
      content: <span>{client.company_name || '-'}</span>,
    },
    {
      title: 'Industry',
      content: <span>{client.industry || '-'}</span>,
    },
    {
      title: 'Primary Contact',
      content: <span>{client.primary_contact_name || '-'}</span>,
    },
    {
      title: 'Email',
      content: (
        <a href={`mailto:${client.primary_contact_email}`}>
          {client.primary_contact_email}
        </a>
      ),
    },
    {
      title: 'Phone',
      content: (
        <a href={`tel:${client.primary_contact_phone}`}>
          {client.primary_contact_phone}
        </a>
      ),
    },
    {
      title: 'Website',
      content: client.website ? (
        <a href={client.website} target="_blank" rel="noreferrer">
          {client.website}
        </a>
      ) : (
        '-'
      ),
    },
    {
      title: 'Company Size',
      content: <span>{client.company_size || '-'}</span>,
    },
    {
      title: 'Address',
      content: (
        <span>
          {[
            client.address,
            client.city,
            client.state,
            client.country,
            client.postal_code,
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
      icon: 'feather-git-commit',
      text: client.status,
    },
    {
      title: 'Onboarding',
      icon: 'feather-activity',
      text: client.onboarding_status,
    },
    {
      title: 'Portal Access',
      icon: 'feather-globe',
      text: client.portal_enabled ? 'Enabled' : 'Disabled',
    },
    {
      title: 'Payment Terms',
      icon: 'feather-credit-card',
      text: `${client.payment_terms} Days`,
    },
    {
      title: 'Created On',
      icon: 'feather-clock',
      text: new Date(client.created_at).toDateString(),
    },
  ]

  return (
    <div className="tab-pane fade show active" id="profileTab" role="tabpanel">
      {/* -------- Lead Info -------- */}
      <div className="card card-body lead-info">
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0">
            <span className="d-block mb-2">Client Information :</span>
            <span className="fs-12 fw-normal text-muted d-block">
              Following information for your client
            </span>
          </h5>
          <a href="#" className="btn btn-sm btn-light-brand">
            Create Invoice
          </a>
        </div>

        {leadInfoData.map((data, index) => (
          <InfoRow key={index} title={data.title} content={data.content} />
        ))}
      </div>

      <hr />

      {/* -------- General Info -------- */}
      <div className="card card-body general-info">
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0">
            <span className="d-block mb-2">General Information :</span>
            <span className="fs-12 fw-normal text-muted d-block">
              General information for this client
            </span>
          </h5>
          <a href={`/clients/edit/${client.client_id}`} className="btn btn-sm btn-light-brand">
            Edit Client
          </a>
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
            {client.notes || 'No notes available'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TabClientsProfile
