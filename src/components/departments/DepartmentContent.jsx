import React from 'react'
import Input from '@/components/shared/Input'
import { useState } from 'react'

const DepartmentContent = ({
    formData,
    onChange,
    users,
    departments,
    SetIs_sub_department,
    is_sub_department,
    managerLoading
}) => {
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        onChange(name, type === 'checkbox' ? checked : value)
    }

    return (
        <div className="col-12">
            <div className="card p-4">
                <h5 className="mb-4">Department Information</h5>

                <Input
                    label="Department Name"
                    name="department_name"
                    value={formData.department_name}
                    onChange={handleInputChange}
                />

                <Input
                    label="Department Code"
                    name="department_code"
                    value={formData.department_code}
                    onChange={handleInputChange}
                />

                <Input
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                />

                {/* Manager */}
                <div className="row mb-4">
                    <div className="col-lg-4">
                        <label className="fw-semibold">Manager</label>
                    </div>
                    <div className="col-lg-8">
                        <select
                            className="form-select"
                            value={formData.manager_id}
                            onChange={(e) =>
                                onChange('manager_id', Number(e.target.value))
                            }
                        >
                            <option value="">{managerLoading? 'Loading Manager...' : 'Select Manager'}</option>
                            {users.map(u => (
                                <option key={u.user_id} value={u.user_id}>
                                    {u.first_name} {u.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Status */}
                <div className="row mb-4">
                    <div className="col-lg-4">
                        <label className="fw-semibold">Status</label>
                    </div>
                    <div className="col-lg-8">
                        <div className="form-check form-switch">
                            <input
                                type="checkbox"
                                className="form-check-input"
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

                {/* Sub Department Toggle */}
                <div className="row mb-4">
                    <div className="col-lg-4">
                        <label className="fw-semibold">
                            Add as Sub-Department?
                        </label>
                    </div>
                    <div className="col-lg-8">
                        <div className="form-check form-switch">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={is_sub_department}
                                onChange={(e) => SetIs_sub_department(e.target.checked)}
                            />
                            <label className="form-check-label">
                                {is_sub_department ? 'Yes' : 'No'}
                            </label>
                        </div>
                    </div>
                </div>

                {/* Parent Department Selector */}
                {is_sub_department && (
                    <div className="row mb-4">
                        <div className="col-lg-4">
                            <label className="fw-semibold">
                                Select Parent Department
                            </label>
                        </div>
                        <div className="col-lg-8">
                            <select
                                className="form-select"
                                value={formData.parent_department_id ?? ''}
                                onChange={(e) =>
                                    onChange(
                                        'parent_department_id',
                                        e.target.value === '' ? null : Number(e.target.value)
                                    )
                                }
                            >
                                <option value="">Choose Department</option>

                                {departments.map(dep => (
                                    <option
                                        key={dep.department_id}
                                        value={dep.department_id}
                                    >
                                        {dep.department_name}
                                    </option>
                                ))}
                            </select>

                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DepartmentContent
