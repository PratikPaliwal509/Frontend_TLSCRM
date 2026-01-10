import React from 'react'
import Input from '@/components/shared/Input'

const DepartmentContent = ({ formData, onChange, users }) => {
    console.log('DepartmentContent formData:', formData)

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        // Handle checkbox for is_active
        const val = type === 'checkbox' ? checked : value
        onChange(name, val)
    }

    return (
        <div className="col-12">
            <div className="card p-4">
                <h5 className="mb-4">Department Information</h5>

                {/* Department Name */}
                <Input
                    label="Department Name"
                    name="department_name"
                    labelId="department_name"
                    placeholder="Enter department name"
                    value={formData.department_name}
                    onChange={handleInputChange}
                />

                {/* Department Code */}
                <Input
                    label="Department Code"
                    name="department_code"
                    labelId="department_code"
                    placeholder="Enter department code"
                    value={formData.department_code}
                    onChange={handleInputChange}
                />

                {/* Description */}
                <Input
                    label="Description"
                    name="description"
                    labelId="description"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={handleInputChange}
                />
                {/* Manager */}
                <div className="row mb-4 align-items-center">
                    <div className="col-lg-4">
                        <label className="fw-semibold">Manager</label>
                    </div>
                    <div className="col-lg-8">
                        <select
                            className="form-select"
                            name="manager_id"
                            value={formData.manager_id}
                            onChange={(e) => onChange('manager_id', Number(e.target.value))}

                        >
                            <option value="">Select Manager</option>

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
                        <label className="fw-semibold">Status: </label>
                    </div>
                    <div className="col-lg-8">
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="is_active"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={handleInputChange}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="is_active"
                            >
                                {formData.is_active ? 'Active' : 'Inactive'}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DepartmentContent
