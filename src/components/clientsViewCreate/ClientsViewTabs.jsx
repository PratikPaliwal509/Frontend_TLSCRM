
import React from 'react'

const ClientsViewTab = ({ client }) => {
  return (
    <div className="bg-white py-3 border-bottom rounded-0 p-md-0 mb-0">
      <div className="d-md-none d-flex">
        <a href="#" className="page-content-left-open-toggle">
          <i className="feather-align-left fs-20"></i>
        </a>
      </div>

      <div className="d-flex align-items-center justify-content-between">
        <div className="nav-tabs-wrapper page-content-left-sidebar-wrapper">
          <div className="d-flex d-md-none">
            <a href="#" className="page-content-left-close-toggle">
              <i className="feather-arrow-left me-2"></i>
              <span>Back</span>
            </a>
          </div>

          <ul className="nav nav-tabs nav-tabs-custom-style" role="tablist">
            <li className="nav-item">
              <button
                className="nav-link active"
                data-bs-toggle="tab"
                data-bs-target="#profileTab"
              >
                Profile
              </button>
            </li>

            {/* <li className="nav-item">
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#proposalTab"
              >
                Proposals
              </button>
            </li> */}

            {/* <li className="nav-item">
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#tasksTab"
              >
                Tasks
              </button>
            </li> */}
            <li className="nav-item">
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#projectCostTab"
              >
                Project Cost
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#notesTab"
              >
                Notes
              </button>
            </li>

            {/* <li className="nav-item">
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#commentTab"
              >
                Comments
              </button>
            </li> */}
          </ul>
        </div>

        {/* OPTIONAL: Client Status Badge */}
        <div className="d-none d-md-flex">
          <span
            className={`badge ${client?.status === 'active'
                ? 'bg-soft-success text-success'
                : 'bg-soft-danger text-danger'
              }`}
          >
            {client?.status}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ClientsViewTab
