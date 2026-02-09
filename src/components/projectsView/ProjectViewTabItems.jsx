
import React from 'react'

const defaultTabs = [
  { id: 'overviewTab', label: 'Overview', active: true },
  { id: 'activityTab', label: 'Activity' },
  { id: 'timesheetsTab', label: 'Timesheets' },
  { id: 'milestonesTab', label: 'Milestones' },
  { id: 'discussionsTab', label: 'Discussions' },
]

const ProjectViewTabItems = ({ tabs = defaultTabs }) => {
  return (
    <div className="bg-white py-3 border-bottom rounded-0 p-md-0 mb-0">
      {/* Mobile toggle */}
      <div className="d-md-none d-flex align-items-center justify-content-between">
        <a href="#" className="page-content-left-open-toggle">
          <i className="feather-align-left fs-20"></i>
        </a>
      </div>

      <div className="d-flex align-items-center justify-content-between">
        <div className="nav-tabs-wrapper page-content-left-sidebar-wrapper">
          {/* Mobile back button */}
          <div className="d-flex d-md-none">
            <a href="#" className="page-content-left-close-toggle">
              <i className="feather-arrow-left me-2"></i>
              <span>Back</span>
            </a>
          </div>

          {/* Tabs */}
          <ul className="nav nav-tabs nav-tabs-custom-style" id="myTab" role="tablist">
            {tabs.map((tab) => (
              <li className="nav-item" role="presentation" key={tab.id}>
                <button
                  className={`nav-link ${tab.active ? 'active' : ''}`}
                  data-bs-toggle="tab"
                  data-bs-target={`#${tab.id}`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
            <li className="nav-item" role="presentation" key={3}>
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#membersTab"
                type="button"
              >
                Members
              </button>

            </li>
            <li className="nav-item" role="presentation" key={3}>
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#tasksTab"
                type="button"
              >
                Tasks
              </button>

            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ProjectViewTabItems
