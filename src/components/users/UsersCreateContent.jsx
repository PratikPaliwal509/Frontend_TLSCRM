import React from 'react'

const UsersCreateContent = ({
    formData,
    roles,
    departments,
    teams,
    onChange,
}) => {
    const handleInput = (e) => {
        const { name, value } = e.target
        onChange(name, value)
    }

    return (
        <div className="card">
            <div className="card-body">
                <div className="row g-3">

                    {/* First Name */}
                    <div className="col-md-6">
                        <label className="form-label">First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            className="form-control"
                            value={formData.first_name || ''}
                            onChange={handleInput}
                            placeholder="Enter first name"
                        />
                    </div>

                    {/* Last Name */}
                    <div className="col-md-6">
                        <label className="form-label">Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            className="form-control"
                            value={formData.last_name || ''}
                            onChange={handleInput}
                            placeholder="Enter last name"
                        />
                    </div>

                    {/* Email */}
                    <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email || ''}
                            onChange={handleInput}
                            placeholder="Enter email"
                        />
                    </div>

                    {/* Password */}
                    <div className="col-md-6">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password || ''}
                            onChange={handleInput}
                            placeholder="Enter password"
                        />
                    </div>

                    {/* Role */}
                    <div className="col-md-6">
                        <label className="form-label">Role</label>
                        <select
                            name="role_id"
                            className="form-select"
                            value={formData.role_id || ''}
                            onChange={handleInput}
                        >
                            <option value="">Select Role</option>
                            {Array.isArray(roles) && roles.map(r => (
                                <option key={r.role_id} value={r.role_id}>
                                    {r.role_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Department */}
                    <div className="col-md-6">
                        <label className="form-label">Department</label>
                        <select
                            name="department_id"
                            className="form-select"
                            value={formData.department_id || ''}
                            onChange={handleInput}
                        >
                            <option value="">Select Department</option>
                            {departments?.map(d => (
                                <option key={d.department_id} value={d.department_id}>
                                    {d.department_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Team */}
                    <div className="col-md-6">
                        <label className="form-label">Team</label>
                        <select
                            name="team_id"
                            className="form-select"
                            value={formData.team_id || ''}
                            onChange={handleInput}
                            disabled={!formData.department_id}
                        >
                            <option value="">Select Team</option>
                            {teams?.map(t => (
                                <option key={t.team_id} value={t.team_id}>
                                    {t.team_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div className="col-md-6">
                        <label className="form-label">Status</label>
                        <select
                            name="status"
                            className="form-select"
                            value={formData.status || 'active'}
                            onChange={handleInput}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default UsersCreateContent
