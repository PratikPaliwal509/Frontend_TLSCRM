import React from 'react'

const TeamsViewTabs = () => {
  return (
    <div className="bg-white py-3 border-bottom rounded-0 p-md-0 mb-0 nav nav-tabs ">
    <div className="d-flex align-items-center justify-content-between">
        <div className="nav-tabs-wrapper page-content-left-sidebar-wrapper">
    <ul className="nav nav-tabs nav-tabs-custom-style" role="tablist">
      <li className="nav-item" role="presentation">
        <button
        
          className="nav-link active"
          data-bs-toggle="tab"
          data-bs-target="#profileTab"
          type="button"
        >
          Team Profile
        </button>
      </li>

      <li className="nav-item" role="presentation">
        <button
          className="nav-link"
          data-bs-toggle="tab"
          data-bs-target="#membersTab"
          type="button"
        >
          Members
        </button>
      </li>

      <li className="nav-item" role="presentation">
        <button
          className="nav-link"
          data-bs-toggle="tab"
          data-bs-target="#projectsTab"
          type="button"
        >
          Projects
        </button>
      </li>
    </ul>
    </div>
    </div>
    </div>
  )
}

export default TeamsViewTabs
