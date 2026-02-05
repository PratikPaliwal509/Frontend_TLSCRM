import React from 'react'
import { FiArrowLeft, FiPlus } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const DepartmentCreateHeader = ({ loading, onSave }) => {
    return (
        <div className="d-flex align-items-center justify-content-between w-100">
            {/* Left */}
            <div>
                <h5 className="mb-1 fw-bold">Create Department</h5>
                <span className="fs-12 text-muted">
                    Add a new department
                </span>
            </div>

            {/* Actions */}
            <div className="d-flex gap-2">
                <Link to="/departments/list" className="btn btn-light">
                    <FiArrowLeft className="me-2" />
                    Back
                </Link>

                <button
                    className="btn btn-primary"
                    onClick={onSave}
                    disabled={loading}
                >
                    <FiPlus className="me-2" />
                    {loading ? 'Creating...' : 'Create Department'}
                </button>
            </div>
        </div>
    )
}

export default DepartmentCreateHeader
