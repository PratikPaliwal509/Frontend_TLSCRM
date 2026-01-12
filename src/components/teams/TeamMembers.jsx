import React, { useState } from 'react'

const TeamMembers = ({ users, teamMembers, onAddMembers, loading, setLoading }) => {
    const [selectedUsers, setSelectedUsers] = useState([])

    const existingIds = teamMembers.map(m => m.user_id)

    const availableUsers = users.filter(
        u => !existingIds.includes(u.user_id)
    )

    const handleSelect = (e) => {
        const userId = Number(e.target.value)
        if (!userId) return

        if (!selectedUsers.includes(userId)) {
            setSelectedUsers(prev => [...prev, userId])
        }
    }

    const removeSelected = (id) => {
        setSelectedUsers(prev => prev.filter(u => u !== id))
    }

    const handleAdd = async () => {
        try {
            setLoading(true)
            await onAddMembers(selectedUsers)
            setSelectedUsers([]) // optional: clear after success
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="col-md-4">
            <div className="card h-100">
                <div className="card-header">
                    <h5 className="mb-0">Team Members</h5>
                </div>

                <div className="card-body">
                    {/* Existing Members */}
                    <div className="form-group mb-3">
                        <label className="form-label">Current Members</label>
                        <div className="border rounded p-2">
                            {teamMembers.length ? (
                                teamMembers.map(m => (
                                    <span
                                        key={m.user_id}
                                        className="badge bg-light text-dark me-2 mb-2"
                                    >
                                        {m.first_name} {m.last_name}
                                    </span>
                                ))
                            ) : (
                                <span className="text-muted">No members yet</span>
                            )}
                        </div>
                    </div>

                    {/* Add Members */}
                    <div className="form-group mb-3">
                        <label className="form-label">Add Members</label>
                        <select
                            className="form-control"
                            onChange={handleSelect}
                            value=""
                        >
                            <option value="">Select user</option>
                            {availableUsers.map(user => (
                                <option key={user.user_id} value={user.user_id}>
                                    {user.first_name} {user.last_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Selected Users */}
                    {selectedUsers.length > 0 && (
                        <div className="mb-3">
                            <label className="form-label">Selected Users</label>
                            <div className="border rounded p-2">
                                {selectedUsers.map(id => {
                                    const user = users.find(u => u.user_id === id)
                                    return (
                                        <span
                                            key={id}
                                            className="badge bg-primary me-2 mb-2"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => removeSelected(id)}
                                            title="Remove"
                                        >
                                            {user?.first_name} {user?.last_name} ✕
                                        </span>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    <button
                        className="btn btn-primary w-100"
                        disabled={loading || !selectedUsers.length}
                        onClick={handleAdd}
                    >
                        {loading ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                    aria-hidden="true"
                                />
                                Adding Members...
                            </>
                        ) : (
                            'Add Members'
                        )}
                    </button>

                </div>
            </div>
        </div>
    )
}

export default TeamMembers
