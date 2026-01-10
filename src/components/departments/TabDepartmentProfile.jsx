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

const TabDepartmentProfile = ({ departments }) => {

    if (!departments) return null
    console.log("departments" + JSON.stringify(departments))

    /* -------- Department Info (Left Section) -------- */
    const departmentInfoData = [
        {
            title: 'Department Name',
            content: <span>{departments.department_name || '-'}</span>,
        },
        {
            title: 'Department Code',
            content: <span>{departments.department_code || '-'}</span>,
        },
        {
            title: 'Description',
            content: <span>{departments.description || '-'}</span>,
        },
        {
            title: 'Total Teams',
            content: <span>{departments.teams?.length || 0}</span>,
        },
        // {
        //     title: 'Total Members',
        //     content: <span>{departments.members?.length || 0}</span>,
        // },
    ]

    /* -------- General Info (Right Section) -------- */
    const generalInfoData = [
        {
            title: 'Status',
            icon: 'feather-git-commit',
            text: departments.is_active === true ? 'Active' : 'Inactive'
        },
        {
            title: 'Created On',
            icon: 'feather-clock',
            text: departments.created_at
                ? new Date(departments.created_at).toDateString()
                : '-',
        },
        {
            title: 'Last Updated',
            icon: 'feather-refresh-cw',
            text: departments.updated_at
                ? new Date(departments.updated_at).toDateString()
                : '-',
        },
    ]

    return (
        <div
            className="tab-pane fade show active"
            id="profileTab"
            role="tabpanel"
        >
            {/* -------- Department Info -------- */}
            <div className="card card-body lead-info">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0">
                        <span className="d-block mb-2">
                            Department Information :
                        </span>
                        <span className="fs-12 fw-normal text-muted d-block">
                            Following information for this department
                        </span>
                    </h5>
                    <a href="#" className="btn btn-sm btn-light-brand">
                        Add Team
                    </a>
                </div>

                {departmentInfoData.map((data, index) => (
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
                            General information for this department
                        </span>
                    </h5>
                    <Link to={`/settings/departments/edit/${departments.department_id}`} className="btn btn-sm btn-light-brand">
                        Edit Department
                    </Link>
                </div>

                {generalInfoData.map((data, index) => {
                    console.log(data)
                    return (
                        <GeneralCard
                            key={index}
                            title={data.title}
                            icon={data.icon}
                            text={data.text}
                        />
                    )
                })}

                {/* Notes */}
                {/* <div className="row mb-4">
                    <div className="col-lg-2 fw-medium">Notes</div>
                    <div className="col-lg-10">
                        {departments.notes || 'No notes available'}
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default TabDepartmentProfile
