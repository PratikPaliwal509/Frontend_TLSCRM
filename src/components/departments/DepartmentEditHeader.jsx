import React from 'react'
import { FiArrowLeft, FiSave } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const DepartmentEditHeader = ({ loading, onSave }) => {
    return (
        <div className="d-flex align-items-center justify-content-between w-100">
            <div>
                <h5 className="mb-1 fw-bold">Edit Department</h5>
                <span className="fs-12 text-muted">
                    Update department information
                </span>
            </div>

            <div className="d-flex gap-2">
                <Link to="/settings/departments/list" className="btn btn-light">
                    <FiArrowLeft className="me-2" />
                    Back
                </Link>

                <button
                    className="btn btn-primary"
                    onClick={onSave}
                    disabled={loading}
                >
                    <FiSave className="me-2" />
                    {loading ? 'Updating...' : 'Update Department'}
                </button>
            </div>
        </div>
    )
}

export default DepartmentEditHeader
