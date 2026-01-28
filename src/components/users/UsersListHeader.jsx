import React from 'react'
import { FiUserPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const UsersListHeader = () => {
    const navigate = useNavigate()

    return (
        <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 me-2">Users</h4>

            <button
                className="btn btn-primary"
                onClick={() => navigate('/user/create')}
            >
                <FiUserPlus className="me-1" />
                Add User
            </button>
        </div>
    )
}

export default UsersListHeader
