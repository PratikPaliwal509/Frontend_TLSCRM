import React from 'react'

const DepartmentsViewTabs = ({ departments }) => {
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

                    <ul
                        className="nav nav-tabs nav-tabs-custom-style"
                        role="tablist"
                    >
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
                                data-bs-target="#teamsTab"
                            >
                                Teams
                            </button>
                        </li> */}

                        {/* <li className="nav-item">
                            <button
                                className="nav-link"
                                data-bs-toggle="tab"
                                data-bs-target="#membersTab"
                            >
                                Members
                            </button>
                        </li> */}

                        {/* <li className="nav-item">
                            <button
                                className="nav-link"
                                data-bs-toggle="tab"
                                data-bs-target="#notesTab"
                            >
                                Notes
                            </button>
                        </li> */}

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

                {/* OPTIONAL: Department Status Badge */}
                <div className="d-none d-md-flex">
                    <span
                        className={`badge ${
                            departments?.status === 'active'
                                ? 'bg-soft-success text-success'
                                : 'bg-soft-danger text-danger'
                        }`}
                    >
                        {departments?.status || 'active'}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default DepartmentsViewTabs
