import React from 'react'
import { FiEdit } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const UsersViewHeader = ({ user }) => {
    const navigate = useNavigate()

    return (
        <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">{user.name}</h4>

            <button
                className="btn btn-outline-primary"
                onClick={() => navigate(`/user/edit/${user.id}`)}
            >
                <FiEdit className="me-1" />
                Edit User
            </button>
        </div>
    )
}

export default UsersViewHeader
