import React from 'react'
import Input from '@/components/shared/Input'

const TeamContent = ({ formData, onChange, users, departments }) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    onChange(name, type === 'checkbox' ? checked : value)
  }
  return (
    <div className="col-12">
      <div className="card p-4">
        <h5 className="mb-4">Team Information</h5>

        <Input
          label="Team Name"
          name="team_name"
          placeholder="Enter team name"
          value={formData.team_name}
          onChange={handleInputChange}
        />

        <Input
          label="Description"
          name="description"
          placeholder="Enter description"
          value={formData.description}
          onChange={handleInputChange}
        />

        {/* Department (Optional) */}
        <div className="row mb-4 align-items-center">
          <div className="col-lg-4">
            <label className="fw-semibold">Department</label>
          </div>
          <div className="col-lg-8">
            <select
              className="form-select"
              name="department_id"
              value={formData.department_id}
              onChange={handleInputChange}
            >
              <option value="">No Department</option>
              {departments.map(dep => (
                <option key={dep.department_id} value={dep.department_id}>
                  {dep.department_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Team Lead */}
        <div className="row mb-4 align-items-center">
          <div className="col-lg-4">
            <label className="fw-semibold">Team Lead</label>
          </div>
          <div className="col-lg-8">
            <select
              className="form-select"
              name="team_lead_id"
              value={formData.team_lead_id}
              onChange={handleInputChange}
            >
              <option value="">Select Team Lead</option>
              {users.map(user => (
                <option key={user.user_id} value={user.user_id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status */}
        <div className="row mb-4 align-items-center">
          <div className="col-lg-4">
            <label className="fw-semibold">Status</label>
          </div>
          <div className="col-lg-8">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
              />
              <label className="form-check-label">
                {formData.is_active ? 'Active' : 'Inactive'}
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default TeamContent
