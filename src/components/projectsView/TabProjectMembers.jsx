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
    const handleLeaveProject = async (projectId) => {
        if (!window.confirm('Are you sure you want to leave this project?')) return

        try {
            const res = await fetch(
                `http://localhost:5000//api/projects/${projectId}/members/${userId}`,
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
                                                    src={member.user.avatar || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAmgMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAABQYHBAEC/8QANRAAAgIBAgIHBQcFAQAAAAAAAAECAwQFEQYxEiFBQlFhsSKBkaHBExQjUnFy0TIzYoLhJf/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAARAf/aAAwDAQACEQMRAD8A1IAGmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAABAAAAAAAAAAAAAAAAAARU+K9enVKWBhWdGW341kea37q+pRKanxHg6fJ19KV9yezhVs9n5vsIiXGk+l7OBHo+dr39Cp+4FSr1g8XYN8lDJrsxpPq6T64/HmvgWCEozgpwkpRkt1KL3TRkpM8O65Zplyquk5Ykn7UX3P8AJfUK0IHiakk4tOL6012npAABAAAAAAAAAAAAAAcmq5iwNOvytt3CPsp9sn1L5szCUpTk5zbcpPdt9rL1xvNx0eMVyldFP4NlELhoACoD9AAL1wXnPJ02WNN7yxmkv2vl9UWEpHAs2tSvguUqd37mv5LuRQAEAAAAAAAAAAAAABA8aV9PReku5bFv5r6ooRqOpYizsC/Flt+JBpb9j5r5pGYWQlXOULIuM4ycZJ9jRcTXyACgAALNwJXvnZNnZGpL4v8A4XUgeDcJ4ulu6cdp5L6fX+Xu/V+8niKAAgAAAAAAAAAAAAABWuJeHnmzeZgpfeO/Xy6fmvMsoKMnuqsosdd1c65ruzjsz4NWvxqMmPRyKK7Y+E4pnG9C0ltt6fQn5Lb5CkZqut7Lm+wsegcNXZNkL9QrdWOutQl1Ss8OrsRb8bAw8Z742JTW/wA0IJP4nSKR4kkkkkkuxHoBAAAAAAAAAAAAAAACK1zW6NJr2e1mTJbwqT+b8EUSORfTjVO3ItjVWucpvZFczuMMetuODQ7n+ebcY/Dn6FVz9QydQu+1yrXN9i5Rj+iOUQqayOKdWufsWwpj4QrXq9zmeu6s3v8Af7vcyOBUS9PEurVPd5X2iXdshFp/LclcLjKSajnYqa/PS+X+r/kqYBWoYGpYmoQcsW6M9uceTX6o6zJ6bbKLI2U2Srsj1xlF7NFz4f4ljluOLqHRhfyhYuqM/J+D9SRasoHIAAAQAAAAAAAfry8QI7XNUhpWFK1pStl7NUPGX8IznIvtyb53X2Oyyct5Sfad3EOovUtSssi/wYexUvJdvvI00gAAAAAAAAAALxwnrbzK/uWVNvIrW8JPvxXj5osZlGPfZjX130y6NlclKL8GjT9Py4Z2FTlV9UbI77b8n2r4k1cdAAIAAAAAARfEmW8PR8icXtOa+zjt59XpuShVePLdqMOld6cpP3JJepRTgAVAAAAAAAAAAAC48C5bdWThyl/S1ZBeT6n89n7ynE1wfa69dqj2WQlB/Df6BcaCADIAAAAABTuPf7+F+yfqgC4KqACoAAAAAAAAAAASnDD/APfwv3v0YAXGj9gAMgAAP//Z'}
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
