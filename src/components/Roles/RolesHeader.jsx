import React from 'react'
import { useNavigate } from 'react-router-dom'
import { canUser } from '@/utils/canUser'

const RolesHeader = () => {
    const navigate = useNavigate()

    return (
        <div className="d-flex justify-content-between align-items-center">
            <div>
                <h4 className="fw-bold mb-1">Roles</h4>
                <p className="text-muted fs-12 mb-0">
                    Manage system and custom roles
                </p>
            </div>

            {canUser('roles', 'create') && (
                <button
                    className="btn btn-primary p-2"
                    onClick={() => navigate('/settings/roles/create')}
                >
                    Add Role
                </button>
            )}
        </div>
    )
}

export default RolesHeader
