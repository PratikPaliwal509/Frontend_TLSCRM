import React from 'react'
import Input from '@/components/shared/Input'

const UsersEditContent = ({ formData, departments = [], teams = [], roles=[], onChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target
    onChange(name, value)
  }
  return (
    <div className="col-12">
      <div className="card p-4">
        <h5 className="mb-4">User Information</h5>

        {/* Name */}
        <Input
          label="First Name"
          name="first_name"
          labelId="first_name"
          placeholder="Enter first name"
          value={formData.first_name}
          onChange={handleInputChange}
        />
        <Input
          label="Last Name"
          name="last_name"
          labelId="last_name"
          placeholder="Enter last name"
          value={formData.last_name}
          onChange={handleInputChange}
        />

        {/* Email */}
        <Input
          label="Email"
          type="email"
          name="email"
          labelId="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleInputChange}
        />

        {/* Phone */}
        <Input
          label="Phone"
          type="tel"
          name="phone"
          labelId="phone"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={handleInputChange}
        />
        {/* Mobile */}
        <Input
          label="Mobile"
          type="tel"
          name="mobile"
          labelId="mobile"
          placeholder="Enter mobile number"
          value={formData.mobile}
          onChange={handleInputChange}
        />

        {/* Role */}
        <div className="row mb-4 align-items-center">
          <div className="col-lg-4">
            <label className="fw-semibold">Role: </label>
          </div>
          <div className="col-lg-8">
            <select
              className="form-select"
              name="role_id"
              value={formData.role_id}
              onChange={handleInputChange}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.role_id} value={role.role_id}>
                  {role.role_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Department */}
        <div className="row mb-4 align-items-center">
          <div className="col-lg-4">
            <label className="fw-semibold">Department: </label>
          </div>
          <div className="col-lg-8">
            <select
              className="form-select"
              name="department_id"
              value={formData.department_id}
              onChange={handleInputChange}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.department_id} value={dept.department_id}>
                  {dept.department_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Team */}
        <div className="row mb-4 align-items-center">
          <div className="col-lg-4">
            <label className="fw-semibold">Team: </label>
          </div>
          <div className="col-lg-8">
            <select
              className="form-select"
              name="team_id"
              value={formData.team_id}
              onChange={handleInputChange}
            >
              <option value="">Select Team</option>
              {teams.map((team) => (
                <option key={team.team_id} value={team.team_id}>
                  {team.team_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status */}
        <div className="row mb-4 align-items-center">
          <div className="col-lg-4">
            <label className="fw-semibold">Status: </label>
          </div>
          <div className="col-lg-8">
            <select
              className="form-select"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Bio */}
        <Input
          label="Bio"
          name="bio"
          labelId="bio"
          placeholder="Enter bio"
          value={formData.bio || ''}
          onChange={handleInputChange}
        />
      </div>
    </div>
  )
}

export default UsersEditContent
