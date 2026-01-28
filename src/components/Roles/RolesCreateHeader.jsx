import React from 'react'

const RolesCreateHeader = ({ loading, onCreate }) => {
    return (
        <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
            {/* <div className="d-flex justify-content-between align-items-center"> */}
            <div>
                <h4 className="fw-bold mb-1">Add Role</h4>
                <p className="text-muted fs-12 mb-0">
                    Create a new role and assign scoped permissions
                </p>
            </div>

            <button
                className="btn btn-primary"
                onClick={onCreate}
                disabled={loading}
            >
                {loading ? 'Saving...' : 'Create Role'}
            </button>
        </div>
    )
}

export default RolesCreateHeader
