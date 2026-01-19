import React from 'react'
import LeadsEmptyCard from '@/components/leadsViewCreate/LeadsEmptyCard'
import { jwtDecode } from 'jwt-decode'
import { FiLogOut } from 'react-icons/fi'

const TabProjectMembers = ({ project }) => {
    const members = project?.projectMembers || []
    const projectId = project?.project_id
    const token = localStorage.getItem('token')
    const decoded = token ? jwtDecode(token) : null
    const userId = decoded?.user_id
    console.log(JSON.stringify(members))
    const handleLeaveProject = async (projectId) => {
        if (!window.confirm('Are you sure you want to leave this project?')) return

        try {
            const res = await fetch(
                `http://localhost:5000/api/projects/${projectId}/members/${userId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const json = await res.json()

            if (!res.ok || !json.success) {
                throw new Error(json.message || 'Failed to leave project')
            }

            // ✅ SUCCESS
            alert('You have left the project')

            // 🔄 Option 1: reload project
            window.location.reload()

            // 🔄 Option 2 (better): update state instead of reload
            // setProject(prev => ({
            //   ...prev,
            //   projectMembers: prev.projectMembers.filter(
            //     m => m.user_id !== userId
            //   )
            // }))

        } catch (error) {
            console.error(error)
            alert(error.message || 'Something went wrong')
        }
    }


    return (
        <div className="tab-pane fade" id="membersTab">
            {members.length === 0 ? (
                <LeadsEmptyCard
                    title="No members yet!"
                    description={`No members are assigned to ${project?.name}`}
                />
            ) : (
                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0">Project Members</h5>
                    </div>

                    <div className="card-body">
                        <div className="row g-3">
                            {members.map(member => {
                                const isYou = member.user_id === userId
                                const isActive = member.is_active === true

                                return (
                                    <div
                                        key={member.member_id}
                                        className={`col-md-4 ${!isActive ? 'opacity-50' : ''}`}
                                    >
                                        <div
                                            className={`d-flex align-items-center justify-content-space-evenly border rounded p-3 ${!isActive ? 'bg-light' : ''
                                                }`}
                                            style={!isActive ? { pointerEvents: 'none' } : {}}
                                        >
                                            <div className="d-flex align-items-center gap-3 flex-grow-1">
                                                <img
                                                    src={member.user.avatar || '/images/avatar/1.png'}
                                                    alt={member.user.full_name}
                                                    className="avatar avatar-md rounded-circle"
                                                />

                                                <div>
                                                    <div className="fw-semibold">
                                                        {member.user.full_name}

                                                        {isYou && isActive && (
                                                            <span className="badge bg-info ms-2">You</span>
                                                        )}

                                                        {!isActive && (
                                                            <span className="badge bg-secondary ms-2">Left</span>
                                                        )}
                                                    </div>

                                                    <div className="fs-12 text-muted">
                                                        {member.user.email}
                                                    </div>

                                                    {member.user.role && (
                                                        <span className="badge bg-soft-primary text-primary mt-1">
                                                            {member.user.role}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {isYou && isActive && (
                                                <button
                                                    className="btn btn-sm btn-outline-danger me-2"
                                                    onClick={() => handleLeaveProject(projectId)}
                                                    title="Leave Project"
                                                >
                                                    <FiLogOut />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TabProjectMembers
