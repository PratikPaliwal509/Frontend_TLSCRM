import React from 'react'

const ClientTab = ({ client }) => {
  if (!client) {
    return (
      <div className="card">
        <div className="card-body text-muted">
          No client information available
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Client Details</h5>
      </div>

      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <strong>Name:</strong>
            <div>{client.primary_contact_name || '-'}</div>
          </div>

          <div className="col-md-6">
            <strong>Email:</strong>
            <div>{client.primary_contact_email || '-'}</div>
          </div>

          <div className="col-md-6">
            <strong>Phone:</strong>
            <div>{client.primary_contact_phone || '-'}</div>
          </div>

          <div className="col-md-6">
            <strong>Company:</strong>
            <div>{client.company_name || '-'}</div>
          </div>

          <div className="col-md-12">
            <strong>Address:</strong>
            <div>{client.address || '-'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientTab
