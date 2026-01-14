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
                    {/* Name */}
                    <div className="col-md-6">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={formData.name}
                            onChange={handleInput}
                        />
                    </div>

                    {/* Email */}
                    <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleInput}
                        />
                    </div>

                    {/* Password */}
                    <div className="col-md-6">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleInput}
                        />
                    </div>

                    {/* Role */}
                    <div className="col-md-6">
                        <label className="form-label">Role</label>
                        <select
                            name="role"
                            className="form-select"
                            value={formData.role}
                            onChange={handleInput}
                        >
                            {roles.map(r => (
                                <option key={r} value={r}>
                                    {r}
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
                            value={formData.department_id}
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
                            value={formData.team_id}
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
                            value={formData.status}
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
